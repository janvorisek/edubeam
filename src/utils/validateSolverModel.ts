import { DofID, type LinearStaticSolver, type Node } from 'ts-fem';

export type SolveIssueLevel = 'error' | 'warning';

export interface SolveIssue {
  level: SolveIssueLevel;
  code: string;
  message: string;
}

export interface SolveDiagnostics {
  errors: SolveIssue[];
  warnings: SolveIssue[];
}

const toLabel = (value: unknown) => String(value ?? '?');

const isFiniteNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);

export const validateSolverModel = (solver: LinearStaticSolver): SolveDiagnostics => {
  const diagnostics: SolveDiagnostics = {
    errors: [],
    warnings: [],
  };

  const domain = solver.domain;
  const loadCase = solver.loadCases[0];

  for (const element of domain.elements.values()) {
    const elementLabel = toLabel((element as { label?: unknown }).label);
    const elementNodes = Array.isArray((element as { nodes?: unknown[] }).nodes)
      ? ((element as { nodes?: unknown[] }).nodes as unknown[])
      : [];

    if (elementNodes.length !== 2) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_INVALID_NODE_COUNT',
        message: `Element ${elementLabel} must reference exactly 2 nodes.`,
      });
      continue;
    }

    if (elementNodes[0] === elementNodes[1]) {
      diagnostics.warnings.push({
        level: 'warning',
        code: 'ELEMENT_DUPLICATE_NODE_REFERENCE',
        message: `Element ${elementLabel} references the same node at both ends.`,
      });
    }

    for (const nodeLabel of elementNodes) {
      const normalizedNodeLabel = toLabel(nodeLabel);
      if (!domain.nodes.has(normalizedNodeLabel)) {
        diagnostics.errors.push({
          level: 'error',
          code: 'ELEMENT_MISSING_NODE',
          message: `Element ${elementLabel} references missing node ${normalizedNodeLabel}.`,
        });
      }
    }

    const materialLabel = (element as { mat?: unknown }).mat;
    if (materialLabel !== undefined && materialLabel !== null && !domain.materials.has(toLabel(materialLabel))) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_MISSING_MATERIAL',
        message: `Element ${elementLabel} references missing material ${toLabel(materialLabel)}.`,
      });
    }

    const crossSectionLabel = (element as { cs?: unknown }).cs;
    if (
      crossSectionLabel !== undefined &&
      crossSectionLabel !== null &&
      !domain.crossSections.has(toLabel(crossSectionLabel))
    ) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_MISSING_CROSS_SECTION',
        message: `Element ${elementLabel} references missing cross section ${toLabel(crossSectionLabel)}.`,
      });
    }
  }

  for (let i = 0; i < loadCase.nodalLoadList.length; i++) {
    const load = loadCase.nodalLoadList[i];

    if (!domain.nodes.has(load.target)) {
      diagnostics.errors.push({
        level: 'error',
        code: 'NODAL_LOAD_MISSING_TARGET',
        message: `Nodal load #${i + 1} references missing node ${toLabel(load.target)}.`,
      });
    }

    const values = Object.values(load.values);
    if (values.some((value) => !isFiniteNumber(value))) {
      diagnostics.warnings.push({
        level: 'warning',
        code: 'NODAL_LOAD_NON_FINITE_VALUES',
        message: `Nodal load #${i + 1} contains invalid values.`,
      });
    }
  }

  for (let i = 0; i < loadCase.prescribedBC.length; i++) {
    const prescribed = loadCase.prescribedBC[i];

    if (!domain.nodes.has(prescribed.target)) {
      diagnostics.errors.push({
        level: 'error',
        code: 'PRESCRIBED_DISPLACEMENT_MISSING_TARGET',
        message: `Prescribed displacement #${i + 1} references missing node ${toLabel(prescribed.target)}.`,
      });
    }

    if (Object.values(prescribed.prescribedValues).some((value) => !isFiniteNumber(value))) {
      diagnostics.warnings.push({
        level: 'warning',
        code: 'PRESCRIBED_DISPLACEMENT_NON_FINITE_VALUES',
        message: `Prescribed displacement #${i + 1} contains invalid values.`,
      });
    }
  }

  for (let i = 0; i < loadCase.elementLoadList.length; i++) {
    const load = loadCase.elementLoadList[i];

    if (!domain.elements.has(load.target)) {
      diagnostics.errors.push({
        level: 'error',
        code: 'ELEMENT_LOAD_MISSING_TARGET',
        message: `Element load #${i + 1} references missing element ${toLabel(load.target)}.`,
      });
    }
  }

  if (domain.nodes.size > 0 && domain.elements.size > 0) {
    appendStabilityIssues(solver, diagnostics);
  }

  return diagnostics;
};

/** DOFs a Beam2D activates in every node it touches. */
const PLANAR_DOFS: DofID[] = [DofID.Dx, DofID.Dz, DofID.Ry];

/** A rigid body in a plane has three degrees of freedom, so it needs at least three restraints. */
const RIGID_BODY_DOFS = 3;

/** Renders a node list for a message, truncated so a large floating part stays readable. */
const formatNodeList = (labels: string[], limit = 6) => {
  const sorted = [...labels].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return sorted.length > limit ? `${sorted.slice(0, limit).join(', ')}, …` : sorted.join(', ');
};

/**
 * Groups nodes into connected components of the element graph.
 *
 * Each component is a separate rigid body as far as stability goes: supports on one
 * component do nothing for another, which is exactly the mistake behind most
 * "why does nothing happen when I solve?" reports.
 */
const findConnectedParts = (solver: LinearStaticSolver) => {
  const domain = solver.domain;
  const parent = new Map<string, string>();

  const find = (node: string): string => {
    let root = node;
    while (parent.get(root) !== root) root = parent.get(root) as string;
    // path compression keeps this linear for the model sizes edubeam deals with
    let cursor = node;
    while (parent.get(cursor) !== root) {
      const next = parent.get(cursor) as string;
      parent.set(cursor, root);
      cursor = next;
    }
    return root;
  };

  const union = (a: string, b: string) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootA, rootB);
  };

  for (const label of domain.nodes.keys()) parent.set(toLabel(label), toLabel(label));

  const connected = new Set<string>();
  for (const element of domain.elements.values()) {
    const nodes = (element.nodes ?? []).map(toLabel).filter((label) => parent.has(label));
    if (nodes.length !== 2) continue;

    union(nodes[0], nodes[1]);
    connected.add(nodes[0]);
    connected.add(nodes[1]);
  }

  const parts = new Map<string, string[]>();
  for (const label of parent.keys()) {
    if (!connected.has(label)) continue;

    const root = find(label);
    const part = parts.get(root);
    if (part) part.push(label);
    else parts.set(root, [label]);
  }

  return { parts: [...parts.values()], orphans: [...parent.keys()].filter((label) => !connected.has(label)) };
};

/** Counts restraints that actually hold a Beam2D DOF, ignoring bcs no element uses. */
const countRestraints = (solver: LinearStaticSolver, nodeLabels: string[]) => {
  let restraints = 0;

  for (const label of nodeLabels) {
    const node = solver.domain.nodes.get(label);
    if (!node) continue;

    for (const dof of PLANAR_DOFS) {
      if (node.bcs.has(dof)) restraints++;
    }
  }

  return restraints;
};

/** How a part can still move once its supports are taken into account. */
type RigidBodyMode = 'horizontal' | 'vertical' | 'rotation' | 'mixed';

/**
 * The global direction a restrained DOF resists, honouring a skewed nodal system.
 *
 * `Ry` is not a direction at all, so it is reported separately by the caller.
 */
const restraintDirection = (node: Node, dof: DofID): [number, number] => {
  if (!node.hasLcs()) return dof === DofID.Dx ? [1, 0] : [0, 1];

  const axis = node.lcs[dof === DofID.Dx ? 0 : 2];

  return [axis[0], axis[2]];
};

/**
 * Finds the rigid body motion a part can still perform.
 *
 * A planar rigid body moves as `u = (ux - φ·z, uz + φ·x)`, so every restraint is one
 * linear equation in `(ux, uz, φ)`. Three independent equations pin the body down;
 * anything less leaves a mechanism. Counting restraints cannot see this — three
 * parallel rollers are three restraints and still slide — and neither can the solved
 * displacements, because a rigid body mode that carries no load simply does not show
 * up in them. Row reducing the 3-column constraint matrix decides it exactly.
 */
const findFreeRigidBodyMode = (solver: LinearStaticSolver, nodeLabels: string[]): RigidBodyMode | null => {
  const rows: number[][] = [];

  // Reference point and length scale keep the rotation column comparable to the
  // translation ones, so a single relative tolerance works at any model size.
  let sumX = 0;
  let sumZ = 0;
  let count = 0;

  for (const label of nodeLabels) {
    const node = solver.domain.nodes.get(label);
    if (!node) continue;

    sumX += node.coords[0];
    sumZ += node.coords[2];
    count++;
  }

  if (count === 0) return null;

  const originX = sumX / count;
  const originZ = sumZ / count;

  let span = 0;
  for (const label of nodeLabels) {
    const node = solver.domain.nodes.get(label);
    if (!node) continue;

    span = Math.max(span, Math.abs(node.coords[0] - originX), Math.abs(node.coords[2] - originZ));
  }

  const scale = span > 1e-9 ? span : 1;

  for (const label of nodeLabels) {
    const node = solver.domain.nodes.get(label);
    if (!node) continue;

    const x = (node.coords[0] - originX) / scale;
    const z = (node.coords[2] - originZ) / scale;

    if (node.bcs.has(DofID.Ry)) rows.push([0, 0, 1]);

    for (const dof of [DofID.Dx, DofID.Dz]) {
      if (!node.bcs.has(dof)) continue;

      const [dx, dz] = restraintDirection(node, dof);
      rows.push([dx, dz, dz * x - dx * z]);
    }
  }

  // Gaussian elimination with partial pivoting; `pivots` records which unknown each
  // pivot row resolved, so a rank deficiency can be named rather than just counted.
  const TOLERANCE = 1e-9;
  const pivots: number[] = [];
  let row = 0;

  for (let column = 0; column < 3 && row < rows.length; column++) {
    let best = row;
    for (let i = row + 1; i < rows.length; i++) {
      if (Math.abs(rows[i][column]) > Math.abs(rows[best][column])) best = i;
    }

    if (Math.abs(rows[best][column]) < TOLERANCE) continue;

    [rows[row], rows[best]] = [rows[best], rows[row]];

    for (let i = row + 1; i < rows.length; i++) {
      const factor = rows[i][column] / rows[row][column];
      for (let c = column; c < 3; c++) rows[i][c] -= factor * rows[row][c];
    }

    pivots.push(column);
    row++;
  }

  if (pivots.length >= RIGID_BODY_DOFS) return null;

  const free = [0, 1, 2].filter((column) => !pivots.includes(column));

  if (free.length > 1) return 'mixed';

  return free[0] === 0 ? 'horizontal' : free[0] === 1 ? 'vertical' : 'rotation';
};

const MODE_DESCRIPTIONS: Record<RigidBodyMode, string> = {
  horizontal: 'slide horizontally',
  vertical: 'move vertically',
  rotation: 'rotate freely',
  mixed: 'move as a rigid body',
};

const appendStabilityIssues = (solver: LinearStaticSolver, diagnostics: SolveDiagnostics) => {
  const { parts, orphans } = findConnectedParts(solver);

  for (const label of orphans) {
    const node = solver.domain.nodes.get(label);
    const isSupported = node ? PLANAR_DOFS.some((dof) => node.bcs.has(dof)) : false;

    diagnostics.warnings.push({
      level: 'warning',
      code: isSupported ? 'SUPPORTED_NODE_NOT_CONNECTED' : 'NODE_NOT_CONNECTED',
      message: isSupported
        ? `Node ${label} is supported but no element connects to it, so the support carries nothing.`
        : `Node ${label} is not connected to any element and is ignored by the solver.`,
    });
  }

  for (const part of parts) {
    // Too few restraints to begin with reads better as its own message than as a
    // rigid body mode, and it is the mistake a beginner makes first.
    if (countRestraints(solver, part) < RIGID_BODY_DOFS) {
      diagnostics.errors.push({
        level: 'error',
        code: parts.length > 1 ? 'UNSUPPORTED_STRUCTURE_PART' : 'INSUFFICIENT_SUPPORTS',
        message:
          parts.length > 1
            ? `A separate part of the structure (nodes ${formatNodeList(part)}) has fewer than 3 restrained DOFs and can move freely.`
            : 'Model needs at least 3 constrained DOFs to be stable in 2D analysis.',
      });
      continue;
    }

    const mode = findFreeRigidBodyMode(solver, part);

    if (!mode) continue;

    const where = parts.length > 1 ? `A separate part of the structure (nodes ${formatNodeList(part)})` : 'Structure';

    diagnostics.errors.push({
      level: 'error',
      code: 'RIGID_BODY_MECHANISM',
      message: `${where} has enough supports but they do not hold it: it can still ${MODE_DESCRIPTIONS[mode]}. Supports that are all parallel, or whose lines of action meet in one point, leave the structure free to move.`,
    });
  }
};

/** Displacements above this are not a soft structure any more, they are a mechanism. */
export const MECHANISM_DISPLACEMENT_LIMIT = 1e6;

const DOF_NAMES: Partial<Record<DofID, string>> = {
  [DofID.Dx]: 'horizontally (Dx)',
  [DofID.Dz]: 'vertically (Dz)',
  [DofID.Ry]: 'in rotation (Ry)',
};

/**
 * Names the free DOFs behind an unusable solution.
 *
 * A mechanism leaves the stiffness matrix singular or nearly so, and the solver answers
 * with displacements many orders of magnitude too large. Reading them back through the
 * code numbers turns "nothing happened" into the node and direction to fix.
 */
export const findMechanismIssues = (solver: LinearStaticSolver, limit = MECHANISM_DISPLACEMENT_LIMIT): SolveIssue[] => {
  const loadCase = solver.loadCases[0];
  if (!loadCase?.r) return [];

  const r = loadCase.r.toArray() as number[];
  const runaway: { node: string; dof: DofID }[] = [];

  for (const [label, codeNumbers] of solver.nodeCodeNumbers) {
    for (const dof of PLANAR_DOFS) {
      const equation = codeNumbers[dof];
      // Equations from neq upwards belong to restrained DOFs and hold prescribed values.
      if (equation === undefined || equation >= solver.neq) continue;

      const value = r[equation];
      if (!Number.isFinite(value) || Math.abs(value) > limit) runaway.push({ node: toLabel(label), dof });
    }
  }

  if (runaway.length === 0) return [];

  const described = runaway
    .slice(0, 4)
    .map(({ node, dof }) => `node ${node} ${DOF_NAMES[dof] ?? `in DOF ${dof}`}`)
    .join(', ');
  const remainder = runaway.length > 4 ? ` and ${runaway.length - 4} more` : '';

  return [
    {
      level: 'error',
      code: 'UNSTABLE_STRUCTURE',
      message: `Structure is unstable: ${described}${remainder} moves practically without resistance. Add a support or an element, remove an end hinge, or check the cross section stiffness.`,
    },
  ];
};
