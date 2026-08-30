import {
  Node,
  LinearStaticSolver,
  Beam2D,
  BeamElementUniformEdgeLoad,
  BeamConcentratedLoad,
  BeamTemperatureLoad,
  BeamElementTrapezoidalEdgeLoad,
} from 'ts-fem';
import { createDimensionId, ensureDimensionId } from './id';
import { deserializeShape, isSerializedShape, serializeShape } from './sectionProperties';
import {
  createDimensionPoint,
  createDimensionPointFromNode,
  type DimensionLine,
  type DimensionPoint,
} from '@/types/dimension';

/** `btoa` only accepts Latin-1; encode as UTF-8 bytes first so labels in any script survive. */
function objectToBase64(obj: unknown) {
  try {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  } catch (error) {
    console.error('Error converting object to base64:', error);
    return null;
  }
}

function base64ToObject(base64String: string) {
  try {
    const binary = atob(base64String);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    // Models written before UTF-8 encoding are plain Latin-1 JSON; `fatal` makes
    // those fall through to the legacy path instead of decoding as garbage.
    let jsonString: string;
    try {
      jsonString = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch {
      jsonString = binary;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Error decoding base64 to object:', error);
    return null;
  }
}

const MAX_ENTITIES = 10000;

const isLabel = (v: unknown) =>
  (typeof v === 'string' && v.length <= 64) || (typeof v === 'number' && Number.isFinite(v));
const isFiniteNumber = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
const isNumberArray = (v: unknown, len?: number) =>
  Array.isArray(v) && (len === undefined || v.length === len) && v.every(isFiniteNumber);
const isOptionalBool = (v: unknown) => v === undefined || typeof v === 'boolean';
/** Nodal values are either a per-DOF array or a DofID-keyed object (`{ 0: fx, 2: fz, 4: my }`). */
const isDofValues = (v: unknown) =>
  isNumberArray(v) ||
  (typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    Object.entries(v).every(([k, n]) => /^\d+$/.test(k) && isFiniteNumber(n)));

const isRowList = (v: unknown, check: (row: unknown[]) => boolean) =>
  v === undefined ||
  (Array.isArray(v) && v.length <= MAX_ENTITIES && v.every((row) => Array.isArray(row) && check(row)));

/**
 * Structural validation of a decoded model. Rejects anything that would put NaN,
 * non-arrays or absurd counts into the solver; referential integrity (element → node,
 * load → element) is still left to the solver's own diagnostics.
 */
export const isValidSerializedModel = (tmp: unknown): boolean => {
  if (typeof tmp !== 'object' || tmp === null || Array.isArray(tmp)) return false;
  const m = tmp as Record<string, unknown>;

  return (
    isRowList(
      m.n,
      (r) =>
        isLabel(r[0]) &&
        isNumberArray(r[1], 3) &&
        (r[2] === undefined || isNumberArray(r[2])) &&
        (r[3] === undefined || r[3] === null || isNumberArray(r[3], 6))
    ) &&
    isRowList(
      m.e,
      (r) =>
        isLabel(r[0]) &&
        Array.isArray(r[1]) &&
        r[1].length === 2 &&
        r[1].every(isLabel) &&
        isLabel(r[2]) &&
        isLabel(r[3]) &&
        (r[4] === undefined || (Array.isArray(r[4]) && r[4].length === 2 && r[4].every((h) => typeof h === 'boolean')))
    ) &&
    isRowList(m.m, (r) => isLabel(r[0]) && r.slice(1, 5).every(isFiniteNumber)) &&
    isRowList(
      m.cs,
      (r) => isLabel(r[0]) && r.slice(1, 5).every(isFiniteNumber) && (r[5] === undefined || isSerializedShape(r[5]))
    ) &&
    isRowList(m.el, (r) => isLabel(r[0]) && isNumberArray(r[1], 2) && isOptionalBool(r[2])) &&
    isRowList(m.ecl, (r) => isLabel(r[0]) && isNumberArray(r[1]) && isOptionalBool(r[2])) &&
    isRowList(m.etl, (r) => isLabel(r[0]) && isNumberArray(r[1])) &&
    isRowList(
      m.etr,
      (r) =>
        isLabel(r[0]) &&
        (r[1] === undefined || isNumberArray(r[1], 2)) &&
        (r[2] === undefined || isNumberArray(r[2], 2)) &&
        isOptionalBool(r[3])
    ) &&
    isRowList(m.nl, (r) => isLabel(r[0]) && isDofValues(r[1])) &&
    isRowList(m.pd, (r) => isLabel(r[0]) && isDofValues(r[1])) &&
    (m.d === undefined || (Array.isArray(m.d) && m.d.length <= MAX_ENTITIES))
  );
};

/** Decodes and validates a serialized model without touching the solver. `null` when invalid. */
export const parseSerializedModel = (base64String: string) => {
  const tmp = base64ToObject(base64String);
  return isValidSerializedModel(tmp) ? tmp : null;
};

export const serializeModel = (ls: LinearStaticSolver, dims: DimensionLine[]) => {
  const _nodes = [];
  const _elements = [];
  const _materials = [];
  const _css = [];
  const eloads = [];
  const ecloads = [];
  const etloads = [];
  const etraploads = [];
  const nloads = [];
  const pd = [];

  ls.domain.nodes.forEach((node, id) => {
    _nodes.push([
      id,
      node.coords,
      Array.from(node.bcs.values()),
      node.hasLcs() ? [...node.lcs[0], ...node.lcs[1]] : null,
    ]);
  });

  ls.domain.elements.forEach((element: Beam2D, id) => {
    _elements.push([id, element.nodes, element.mat, element.cs, element.hinges]);
  });

  ls.domain.materials.forEach((material, id) => {
    _materials.push([id, material.d, material.e, material.g, material.alpha]);
  });

  ls.domain.crossSections.forEach((cs, id) => {
    const row: unknown[] = [id, cs.a, cs.iy, cs.h, cs.k];
    if (cs.shape) row.push(serializeShape(cs.shape));
    _css.push(row);
  });

  ls.loadCases[0].elementLoadList
    .filter((el) => el instanceof BeamElementUniformEdgeLoad)
    .forEach((load: BeamElementUniformEdgeLoad) => {
      eloads.push([load.target, load.values, load.lcs]);
    });

  ls.loadCases[0].elementLoadList
    .filter((el) => el instanceof BeamConcentratedLoad)
    .forEach((load: BeamConcentratedLoad) => {
      ecloads.push([load.target, load.values, load.lcs]);
    });

  ls.loadCases[0].elementLoadList
    .filter((el) => el instanceof BeamTemperatureLoad)
    .forEach((load: BeamTemperatureLoad) => {
      etloads.push([load.target, load.values]);
    });

  ls.loadCases[0].elementLoadList
    .filter((el) => el instanceof BeamElementTrapezoidalEdgeLoad)
    .forEach((load: BeamElementTrapezoidalEdgeLoad) => {
      etraploads.push([load.target, load.startValues, load.endValues, load.lcs]);
    });

  ls.loadCases[0].nodalLoadList.forEach((load) => {
    nloads.push([load.target, load.values]);
  });

  ls.loadCases[0].prescribedBC.forEach((load) => {
    pd.push([load.target, load.prescribedValues]);
  });

  const obj: {
    n?: unknown[];
    e?: unknown[];
    m?: unknown[];
    cs?: unknown[];
    el?: unknown[];
    ecl?: unknown[];
    etl?: unknown[];
    nl?: unknown[];
    pd?: unknown[];
    d?: unknown[];
    etr?: unknown[];
  } = {};

  if (_nodes.length > 0) obj.n = _nodes;
  if (_elements.length > 0) obj.e = _elements;
  if (_materials.length > 0) obj.m = _materials;
  if (_css.length > 0) obj.cs = _css;
  if (eloads.length > 0) obj.el = eloads;
  if (ecloads.length > 0) obj.ecl = ecloads;
  if (etloads.length > 0) obj.etl = etloads;
  if (etraploads.length > 0) obj.etr = etraploads;
  if (nloads.length > 0) obj.nl = nloads;
  if (pd.length > 0) obj.pd = pd;

  obj.d = dims.map((e) => {
    const id = ensureDimensionId(e);
    const distanceUnit = e.distanceUnit ?? 'world';
    return [
      e.distance,
      e.points.map((point) => [point.x, point.y]),
      id,
      distanceUnit,
      e.points.map((point) => point.sourceNodeLabel ?? null),
    ];
  });

  return objectToBase64(obj);
};

/**
 * Loads a serialized model into `ls`. Returns `false` (and leaves the solver untouched)
 * when the payload is malformed, so callers never end up with a half-cleared model.
 */
export const deserializeModel = (base64String: string, ls: LinearStaticSolver, dims): boolean => {
  const tmp = parseSerializedModel(base64String);

  if (tmp === null) return false;

  ls.domain.nodes.clear();
  ls.domain.elements.clear();

  if ('n' in tmp) {
    for (const e of tmp.n) {
      const node = ls.domain.createNode(e[0], e[1], e[2]);

      if (e[3] !== undefined && e[3] !== null) {
        const locx = e[3].slice(0, 3);
        const locy = e[3].slice(3, 6);

        node.updateLcs({ locx, locy });
      }
    }
  }

  if ('e' in tmp) {
    for (const e of tmp.e) {
      ls.domain.createBeam2D(e[0], e[1], e[2], e[3], e[4]);
    }
  }

  if ('m' in tmp) {
    for (const e of tmp.m) {
      ls.domain.createMaterial(e[0], { d: e[1], e: e[2], g: e[3], alpha: e[4] });
    }
  }

  if ('cs' in tmp) {
    for (const e of tmp.cs) {
      const cs = ls.domain.createCrossSection(e[0], { a: e[1], iy: e[2], h: e[3], k: e[4] });
      const shape = e[5] !== undefined ? deserializeShape(e[5]) : null;
      if (shape) cs.shape = shape;
    }
  }

  if ('el' in tmp) {
    for (const e of tmp.el) {
      const lcs = e[2] !== undefined ? e[2] : true;
      ls.loadCases[0].createBeamElementUniformEdgeLoad(e[0], e[1], lcs);
    }
  }

  if ('ecl' in tmp) {
    for (const e of tmp.ecl) {
      const lcs = e[2] !== undefined ? e[2] : true;
      ls.loadCases[0].createBeamConcentratedLoad(e[0], e[1], lcs);
    }
  }

  if ('etl' in tmp) {
    for (const e of tmp.etl) {
      ls.loadCases[0].createBeamTemperatureLoad(e[0], e[1]);
    }
  }

  if ('etr' in tmp) {
    for (const e of tmp.etr) {
      const lcs = e[3] !== undefined ? e[3] : true;
      const startValues = e[1] !== undefined ? e[1] : [0, 0];
      const endValues = e[2] !== undefined ? e[2] : startValues;
      ls.loadCases[0].createBeamElementTrapezoidalEdgeLoad(e[0], startValues, endValues, lcs);
    }
  }

  if ('nl' in tmp) {
    for (const e of tmp.nl) {
      ls.loadCases[0].createNodalLoad(e[0], e[1]);
    }
  }

  if ('pd' in tmp) {
    for (const e of tmp.pd) {
      ls.loadCases[0].createPrescribedDisplacement(e[0], e[1]);
    }
  }

  if ('d' in tmp) {
    for (const e of tmp.d) {
      try {
        const id = e[2] ?? createDimensionId();
        const distanceUnit = e[3] ?? 'pixel';
        const serializedPoints = Array.isArray(e[1]) ? e[1] : [];
        const sourceNodeLabels = Array.isArray(e[4]) ? e[4] : [];

        const points = serializedPoints.every((point) => Array.isArray(point) && point.length >= 2)
          ? serializedPoints
              .slice(0, 2)
              .map((point, index) => createDimensionPoint(point[0], point[1], sourceNodeLabels[index] ?? null))
          : serializedPoints.slice(0, 2).map((nodeLabel) => {
              const node = ls.domain.getNode(nodeLabel);
              return createDimensionPointFromNode(node);
            });

        if (points.length < 2) continue;

        dims.push({
          id,
          distance: e[0],
          distanceUnit,
          points: [points[0] as DimensionPoint, points[1] as DimensionPoint],
        });
      } catch (e) {
        console.warn('Error deserializing dimensions: ', e);
      }
    }
  }

  return true;
};
