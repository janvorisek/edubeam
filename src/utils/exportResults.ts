/**
 * Builds a spreadsheet-ready dump of the solved results.
 *
 * Values are converted into whatever units the app currently displays and the header
 * carries them, so a table pasted into Excel or Matlab means the same thing as the one
 * on screen — which is the whole point when a student is checking a hand calculation.
 */
import { Beam2D, DofID, type LinearStaticSolver, type Node } from 'ts-fem';
import type { Matrix } from 'mathjs';
import { axisLetters, vertical } from './axisConvention';

/**
 * Display units to render results in.
 *
 * Passed in rather than read from the store so this stays a pure formatter; the editor
 * builds one from `useAppStore()` via `resultUnitsFromStore`.
 */
export interface ResultUnits {
  lengthLabel: string;
  displacementLabel: string;
  angleLabel: string;
  forceLabel: string;
  momentLabel: string;
  length: (value: number) => number;
  displacement: (value: number) => number;
  force: (value: number) => number;
  moment: (value: number) => number;
}

interface AppStoreUnitsSource {
  units: { Length: string; Displacement: string; Angle: string; Force: string; Moment: string };
  convertLength: (value: number) => number;
  convertDisplacement: (value: number) => number;
  convertForce: (value: number) => number;
  convertMoment: (value: number) => number;
}

export const resultUnitsFromStore = (app: AppStoreUnitsSource): ResultUnits => ({
  lengthLabel: app.units.Length,
  displacementLabel: app.units.Displacement,
  angleLabel: app.units.Angle,
  forceLabel: app.units.Force,
  momentLabel: app.units.Moment,
  length: (value) => app.convertLength(value),
  displacement: (value) => app.convertDisplacement(value),
  force: (value) => app.convertForce(value),
  moment: (value) => app.convertMoment(value),
});

/** Reaction components a 2D model can produce, in table order. */
const REACTION_DOFS: DofID[] = [DofID.Dx, DofID.Dz, DofID.Ry];

/**
 * A node no element touches gets no equation numbers, so the solver has nothing to read back for it
 * - asking anyway throws instead of returning a value.
 */
const readUnknown = (solver: LinearStaticSolver, node: Node, dof: DofID) => {
  if (solver.nodeCodeNumbers.get(node.label)?.[dof] === undefined) return null;

  return node.getUnknowns(solver.loadCases[0], [dof]) as unknown as number;
};

const readReaction = (node: Node, loadCase: LinearStaticSolver['loadCases'][number], dof: DofID) => {
  if (node.bcs.size === 0) return null;

  const reactions = node.getReactions(loadCase, !node.hasLcs());
  const index = reactions.dofs.findIndex((d) => d === dof);

  if (index === -1) return null;

  return 'get' in reactions.values ? (reactions.values as unknown as Matrix).get([index]) : reactions.values[index];
};

/** RFC 4180 quoting: only when needed, and doubling any embedded quote. */
const csvCell = (value: string | number | null) => {
  if (value === null) return '';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';

  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
};

const toCsv = (rows: (string | number | null)[][]) => rows.map((row) => row.map(csvCell).join(',')).join('\r\n');

const sortByLabel = <T extends { label: string }>(items: T[]) =>
  [...items].sort((a, b) => String(a.label).localeCompare(String(b.label), undefined, { numeric: true }));

export const buildNodeResultRows = (solver: LinearStaticSolver, units: ResultUnits) => {
  const loadCase = solver.loadCases[0];
  // Headers and vertical components follow the axis convention on screen, like the units do.
  const { v, r } = axisLetters();

  const rows: (string | number | null)[][] = [
    [
      'Node',
      `x [${units.lengthLabel}]`,
      `${v} [${units.lengthLabel}]`,
      `Dx [${units.displacementLabel}]`,
      `D${v} [${units.displacementLabel}]`,
      `R${r} [${units.angleLabel}]`,
      `Rx [${units.forceLabel}]`,
      `R${v} [${units.forceLabel}]`,
      `M${r} [${units.momentLabel}]`,
    ],
  ];

  for (const node of sortByLabel([...solver.domain.nodes.values()])) {
    const displacement = (dof: DofID) => {
      const value = readUnknown(solver, node, dof);

      return value === null ? null : units.displacement(value);
    };
    const reaction = (dof: DofID) => {
      const value = readReaction(node, loadCase, dof);

      if (value === null) return null;
      if (dof === DofID.Dz) return vertical(units.force(value));

      return dof === DofID.Ry ? units.moment(value) : units.force(value);
    };

    const dz = displacement(DofID.Dz);

    rows.push([
      node.label,
      units.length(node.coords[0]),
      vertical(units.length(node.coords[2])),
      displacement(DofID.Dx),
      dz === null ? null : vertical(dz),
      // Rotations are an angle, not a length, so they bypass the length conversion.
      readUnknown(solver, node, DofID.Ry),
      ...REACTION_DOFS.map(reaction),
    ]);
  }

  return rows;
};

export const buildElementResultRows = (solver: LinearStaticSolver, units: ResultUnits) => {
  const loadCase = solver.loadCases[0];

  const rows: (string | number | null)[][] = [
    [
      'Element',
      'Node 1',
      'Node 2',
      `N1 [${units.forceLabel}]`,
      `V1 [${units.forceLabel}]`,
      `M1 [${units.momentLabel}]`,
      `N2 [${units.forceLabel}]`,
      `V2 [${units.forceLabel}]`,
      `M2 [${units.momentLabel}]`,
    ],
  ];

  for (const element of sortByLabel([...solver.domain.elements.values()])) {
    if (!(element instanceof Beam2D)) continue;

    const endForces = element.computeEndForces(loadCase).toArray() as number[];
    // computeEndForces returns [N, V, M] at the start node followed by [N, V, M] at the end, with V
    // along the local vertical axis.
    const converted = endForces.map((value, i) => {
      if (i % 3 === 2) return units.moment(value);

      return i % 3 === 1 ? vertical(units.force(value)) : units.force(value);
    });

    rows.push([element.label, element.nodes[0], element.nodes[1], ...converted]);
  }

  return rows;
};

/** One CSV holding both tables, separated by a blank line so a spreadsheet keeps them apart. */
export const buildResultsCsv = (solver: LinearStaticSolver, units: ResultUnits) =>
  `${toCsv(buildNodeResultRows(solver, units))}\r\n\r\n${toCsv(buildElementResultRows(solver, units))}\r\n`;

export const downloadResultsCsv = (
  solver: LinearStaticSolver,
  units: ResultUnits,
  filename = 'edubeam-results.csv'
) => {
  // The BOM makes Excel read the file as UTF-8, which matters for non-Latin node labels.
  const blob = new Blob([`\ufeff${buildResultsCsv(solver, units)}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
};

/** Tab separated, because that is what pastes straight into spreadsheet cells. */
export const buildResultsTsv = (solver: LinearStaticSolver, units: ResultUnits) => {
  const toTsv = (rows: (string | number | null)[][]) =>
    rows.map((row) => row.map((cell) => (cell === null ? '' : String(cell))).join('\t')).join('\n');

  return `${toTsv(buildNodeResultRows(solver, units))}\n\n${toTsv(buildElementResultRows(solver, units))}`;
};
