import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { DofID } from 'ts-fem';
import { parsePythonLiteral, type PyValue } from './pythonLiteral';

/**
 * Sessions of the desktop EduBeam (Patzák, Stránský, Šmilauer; CTU Prague, 2.x - 3.5), turned into
 * the shape of a project.json so they open through `importJSON` like any project file.
 *
 * The format is the one its `ebio.loadDomainFromXmlFile` read, including the older shapes it still
 * accepted: version 2.2.6 kept loads on the domain and supports and prescribed displacements as lists
 * on the nodes; before 3.3.0 an element load was a plain `{fx, fz, dTc, dTg}`.
 *
 * Its values carry no units. Its manual sets up the worked example in kN, kPa and m and calls that
 * the typical choice, and the sessions it shipped are in them (E = 30e6 for concrete), so they are
 * read as kN, kPa and m and stored in SI. Temperatures are differences in °C, which are kelvin.
 */

export class EduBeamSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EduBeamSessionError';
  }
}

/** kN → N, kPa → Pa, kN/m → N/m, kNm → Nm, t/m³ → kg/m³. */
const KILO = 1e3;

type Dofs = Partial<Record<DofID, number>>;

export interface ProjectElementLoad {
  type: 'udl' | 'concentrated' | 'temperature';
  target: string;
  lcs: boolean;
  values: number[];
}

/** A project file as `importJSON` reads it. */
export interface SessionProject {
  edubeam: true;
  domain: {
    materials: { label: string; e: number; g: number; alpha: number; d: number }[];
    crossSections: { label: string; a: number; iy: number; h: number; k: number }[];
    nodes: { label: string; coords: [number, number, number]; bcs: DofID[] }[];
    elements: { label: string; nodes: [string, string]; mat: string; cs: string; hinges: [boolean, boolean] }[];
    loadCases: {
      label: string;
      nodalLoads: { target: string; values: Dofs }[];
      elementLoads: ProjectElementLoad[];
      prescribedBC: { target: string; prescribedValues: Dofs }[];
    }[];
  };
}

export interface EduBeamSession {
  project: SessionProject;
  /** The version the session says it was saved by, when it says. */
  version: string | null;
  /** Load cases beyond the first: the app solves one, so these are left out. */
  skippedLoadCases: string[];
}

type XmlNode = Record<string, unknown>;

const REPEATED = new Set([
  'Material',
  'CrossSection',
  'Node',
  'Beam2d',
  'LoadCase',
  'NodalLoad',
  'ElementLoad',
  'PrescribedDisplacement',
  'DistributedLoad',
  'TemperatureLoad',
]);

const isNode = (value: unknown): value is XmlNode =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** The children of `parent` with this tag; an empty or missing container has none. */
const children = (parent: unknown, tag: string): XmlNode[] => {
  if (!isNode(parent)) return [];
  const found = parent[tag];
  return Array.isArray(found) ? found.filter(isNode) : [];
};

const attr = (node: XmlNode, name: string): string | undefined => {
  const value = node[name];
  return typeof value === 'string' ? value : undefined;
};

const describe = (tag: string, node: XmlNode) => `${tag} ${attr(node, 'label') ?? '(no label)'}`;

const label = (tag: string, node: XmlNode): string => {
  const value = attr(node, 'label');
  if (value === undefined || value === '') throw new EduBeamSessionError(`A ${tag} has no label.`);
  return value;
};

const number = (value: unknown, what: string): number => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(parsed)) throw new EduBeamSessionError(`${what} is not a number.`);
  return parsed;
};

const numberAttr = (node: XmlNode, name: string, what: string, fallback?: number): number => {
  const raw = attr(node, name);
  if (raw === undefined || raw === '') {
    if (fallback !== undefined) return fallback;
    throw new EduBeamSessionError(`${what} has no ${name}.`);
  }
  return number(raw, `${name} of ${what}`);
};

const literal = (node: XmlNode, name: string, what: string): PyValue | undefined => {
  const raw = attr(node, name);
  if (raw === undefined || raw.trim() === '') return undefined;
  try {
    return parsePythonLiteral(raw);
  } catch (e) {
    throw new EduBeamSessionError(`${name} of ${what} cannot be read: ${(e as Error).message}`);
  }
};

const asDict = (value: PyValue | undefined): Record<string, PyValue> =>
  isNode(value) ? (value as Record<string, PyValue>) : {};

/** A Python truth value as the original took it: True, 1 and 1.0 are true. */
const truthy = (value: PyValue | undefined) => value === true || (typeof value === 'number' && value !== 0);

const optionalNumber = (value: PyValue | undefined, what: string) =>
  value === undefined || value === null ? 0 : number(value, what);

/** Supports and prescribed values are keyed x, z, Y; version 2.2.6 wrote them as a list in that order. */
const byDof = (value: PyValue | undefined): Record<string, PyValue> =>
  Array.isArray(value) ? { x: value[0] ?? 0, z: value[1] ?? 0, Y: value[2] ?? 0 } : asDict(value);

const nodeBcs = (value: PyValue | undefined): DofID[] => {
  const bcs = byDof(value);
  const dofs: DofID[] = [];
  if (truthy(bcs.x)) dofs.push(DofID.Dx);
  if (truthy(bcs.z)) dofs.push(DofID.Dz);
  if (truthy(bcs.Y)) dofs.push(DofID.Ry);
  return dofs;
};

const prescribedValues = (value: PyValue | undefined, what: string): Dofs | null => {
  const values = byDof(value);
  const dofs: Dofs = {
    [DofID.Dx]: optionalNumber(values.x, `x of ${what}`),
    [DofID.Dz]: optionalNumber(values.z, `z of ${what}`),
    [DofID.Ry]: optionalNumber(values.Y, `Y of ${what}`),
  };
  return Object.values(dofs).some((v) => v !== 0) ? dofs : null;
};

const coords = (value: PyValue | undefined, what: string): [number, number, number] => {
  if (!Array.isArray(value) || value.length < 2) throw new EduBeamSessionError(`${what} has no coordinates.`);
  // [x, y, z] as written; a plain [x, z] is taken as such.
  const [x, z] = value.length >= 3 ? [value[0], value[2]] : [value[0], value[1]];
  return [number(x, `x of ${what}`), 0, number(z, `z of ${what}`)];
};

type Geometry = Map<string, { cos: number; sin: number }>;

/**
 * One element load of the original is up to three loads at once - it summed a uniform load, a point
 * force and a temperature change, whatever its `type` said - so each part that is set becomes a load
 * of its own. `perX` gave the intensity per horizontal projection, which it applied as |cos α|.
 */
const elementLoads = (target: string, raw: Record<string, PyValue>, geometry: Geometry, what: string) => {
  const value = { ...raw };
  // Renamed over the versions; the original renamed them the same way on load.
  if ('dta' in value) value.dTc = value.dta;
  if ('dtt' in value) value.dTg = value.dtt;
  if ('dTh' in value) value.dTg = value.dTh;

  const loads: ProjectElementLoad[] = [];
  const read = (key: string) => optionalNumber(value[key], `${key} of ${what}`);

  if (value.type === undefined) {
    // Before 3.3.0: an intensity in the element's own axes, and a temperature.
    const fx = read('fx');
    const fz = read('fz');
    if (fx !== 0 || fz !== 0) loads.push({ type: 'udl', target, lcs: true, values: [fx * KILO, fz * KILO] });
  } else {
    const magnitude = read('magnitude') * KILO;
    if (magnitude !== 0) {
      const dir = String(value.dir ?? '');
      const lcs = dir.startsWith('Local');
      const along = dir.endsWith('X') ? [magnitude, 0] : dir.endsWith('Z') ? [0, magnitude] : null;
      if (!along) throw new EduBeamSessionError(`${what} has an unknown direction "${dir}".`);

      const projected = truthy(value.perX) ? Math.abs(geometry.get(target)?.cos ?? 1) : 1;
      loads.push({ type: 'udl', target, lcs, values: along.map((v) => v * projected) });
    }

    const fx = read('Fx');
    const fz = read('Fz');
    if (fx !== 0 || fz !== 0) {
      // Given in the global axes, at a distance from the start node.
      loads.push({ type: 'concentrated', target, lcs: false, values: [fx * KILO, fz * KILO, 0, read('DistF')] });
    }
  }

  // dTg is the bottom face minus the top face, the app's ΔTb - ΔTt.
  const dTc = read('dTc');
  const dTg = read('dTg');
  if (dTc !== 0 || dTg !== 0) loads.push({ type: 'temperature', target, lcs: true, values: [dTc, dTg, 0] });

  return loads;
};

/** Version 2.2.6 wrote element loads as positional lists under their own tags. */
const legacyElementLoad = (tag: string, raw: PyValue | undefined): Record<string, PyValue> => {
  if (!Array.isArray(raw)) return asDict(raw);
  if (tag === 'DistributedLoad') return { fx: raw[0] ?? 0, fz: raw[1] ?? 0 };
  if (tag === 'TemperatureLoad') return { dTc: raw[0] ?? 0, dTg: raw[1] ?? 0 };
  return {};
};

const nodalLoad = (load: XmlNode, what: string) => {
  const raw = literal(load, 'value', what);
  // Version 2.2.6: [fx, fz, my].
  const value = Array.isArray(raw) ? { fx: raw[0], fz: raw[1], my: raw[2] } : asDict(raw);

  return {
    target: attr(load, 'where') ?? '',
    values: {
      [DofID.Dx]: optionalNumber(value.fx, `fx of ${what}`) * KILO,
      [DofID.Dz]: optionalNumber(value.fz, `fz of ${what}`) * KILO,
      [DofID.Ry]: optionalNumber(value.my, `my of ${what}`) * KILO,
    },
  };
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: false,
  parseTagValue: false,
  isArray: (tag) => REPEATED.has(tag),
});

/** Whether a file looks like a desktop EduBeam session rather than a project file. */
export const isEduBeamSession = (text: string) =>
  /^\s*(?:<\?xml[^>]*\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<session[\s>]/.test(text);

export const parseEduBeamSession = (text: string): EduBeamSession => {
  const valid = XMLValidator.validate(text);
  if (valid !== true)
    throw new EduBeamSessionError(`The file is not valid XML: ${valid.err.msg} (line ${valid.err.line}).`);

  const document = parser.parse(text) as XmlNode;
  const session = document.session;
  if (!isNode(session) || !isNode(session.domain)) throw new EduBeamSessionError('The file is not an EduBeam session.');
  const domain = session.domain;

  const materials = children(domain.materials, 'Material').map((m) => {
    const what = describe('material', m);
    const e = numberAttr(m, 'e', what);
    return {
      label: label('material', m),
      e: e * KILO,
      // Sessions from before G existed took it equal to E, as the original did.
      g: numberAttr(m, 'g', what, e) * KILO,
      alpha: numberAttr(m, 'alpha', what, 0),
      d: numberAttr(m, 'd', what, 0) * KILO,
    };
  });

  const crossSections = children(domain.crossSects, 'CrossSection').map((cs) => {
    const what = describe('cross section', cs);
    return {
      label: label('cross section', cs),
      a: numberAttr(cs, 'a', what),
      iy: numberAttr(cs, 'iy', what),
      h: numberAttr(cs, 'h', what),
      // Without one, the original made shear deformation negligible the same way.
      k: numberAttr(cs, 'k', what, 1e12),
    };
  });

  const pDspls: { target: string; prescribedValues: Dofs }[] = [];
  const nodes = children(domain.nodes, 'Node').map((n) => {
    const what = describe('node', n);
    const nodeLabel = label('node', n);
    const pDspl = prescribedValues(literal(n, 'pDspl', what), what);
    if (pDspl) pDspls.push({ target: nodeLabel, prescribedValues: pDspl });

    return {
      label: nodeLabel,
      coords: coords(literal(n, 'coords', what), what),
      bcs: nodeBcs(literal(n, 'bcs', what)),
    };
  });

  const nodeCoords = new Map(nodes.map((n) => [n.label, n.coords]));
  const geometry: Geometry = new Map();

  const elements = children(domain.elements, 'Beam2d').map((e) => {
    const what = describe('element', e);
    const elementLabel = label('element', e);
    const ends = literal(e, 'nodes', what);
    if (!Array.isArray(ends) || ends.length !== 2) throw new EduBeamSessionError(`${what} does not have two nodes.`);
    const [start, end] = ends.map(String) as [string, string];
    const hinges = literal(e, 'hinges', what);

    const a = nodeCoords.get(start);
    const b = nodeCoords.get(end);
    if (a && b) {
      const l = Math.hypot(b[0] - a[0], b[2] - a[2]);
      if (l > 0) geometry.set(elementLabel, { cos: (b[0] - a[0]) / l, sin: (b[2] - a[2]) / l });
    }

    return {
      label: elementLabel,
      nodes: [start, end] as [string, string],
      mat: attr(e, 'mat') ?? '',
      cs: attr(e, 'cs') ?? '',
      hinges: (Array.isArray(hinges) ? [truthy(hinges[0]), truthy(hinges[1])] : [false, false]) as [boolean, boolean],
    };
  });

  const loadCaseNodes = children(domain.loadCases, 'LoadCase');

  // Version 2.2.6 had no load cases: the loads hung off the domain, in one implicit case.
  const cases =
    loadCaseNodes.length > 0
      ? loadCaseNodes.map((lc) => ({
          label: attr(lc, 'label') ?? 'Default_loadcase',
          nodal: children(lc, 'NodalLoad'),
          element: children(lc, 'ElementLoad').map((l) => ({ tag: 'ElementLoad', load: l })),
          prescribed: children(lc, 'PrescribedDisplacement'),
        }))
      : [
          {
            label: 'Default_loadcase',
            nodal: children(domain.nodalLoads, 'NodalLoad'),
            element: ['ElementLoad', 'DistributedLoad', 'TemperatureLoad'].flatMap((tag) =>
              children(domain.elementLoads, tag).map((l) => ({ tag, load: l }))
            ),
            prescribed: [],
          },
        ];

  const [first, ...rest] = cases;

  const loadCase = {
    label: first.label,
    nodalLoads: first.nodal.map((l) => nodalLoad(l, describe('nodal load', l))),
    elementLoads: first.element.flatMap(({ tag, load }) => {
      const what = describe('element load', load);
      const raw = literal(load, 'value', what);
      return elementLoads(attr(load, 'where') ?? '', legacyElementLoad(tag, raw), geometry, what);
    }),
    prescribedBC: [
      ...pDspls,
      ...first.prescribed.flatMap((p) => {
        const values = prescribedValues(
          literal(p, 'value', describe('prescribed displacement', p)),
          describe('prescribed displacement', p)
        );
        return values ? [{ target: attr(p, 'where') ?? '', prescribedValues: values }] : [];
      }),
    ],
  };

  return {
    project: { edubeam: true, domain: { materials, crossSections, nodes, elements, loadCases: [loadCase] } },
    version: attr(session, 'version') ?? null,
    skippedLoadCases: rest.map((lc) => lc.label),
  };
};
