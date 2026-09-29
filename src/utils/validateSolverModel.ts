import { DofID, type LinearStaticSolver, type Node } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import { axisLetters } from './axisConvention';

/**
 * `incomplete` is what every model goes through while it is being drawn - a beam not
 * supported yet. It blocks the solve like an error, but it is the next step, not a mistake,
 * and is shown as one.
 */
export type SolveIssueLevel = 'error' | 'incomplete' | 'warning';

/**
 * How a part of the structure can move without resistance: for each node, the direction
 * it travels in, scaled so the node that moves the most moves by 1. Drawn on the canvas,
 * it shows the mechanism instead of describing it.
 */
export type FreeMotion = Map<string, [number, number]>;

export interface SolveIssue {
  level: SolveIssueLevel;
  code: string;
  message: string;
  /** Nodes the issue is about, highlighted on the canvas. */
  nodes?: string[];
  /** The motion the structure is free to make, when the issue is a mechanism. */
  motion?: FreeMotion;
  /** One line that can stand in for the message when it is the only issue. */
  summary?: string;
}

export interface SolveDiagnostics {
  errors: SolveIssue[];
  incomplete: SolveIssue[];
  warnings: SolveIssue[];
}

export const emptyDiagnostics = (): SolveDiagnostics => ({ errors: [], incomplete: [], warnings: [] });

const toLabel = (value: unknown) => String(value ?? '?');

// Every message may name a direction, so each gets the letters of the axis convention on screen.
const t = (key: string, params: Record<string, unknown> = {}) =>
  i18n.global.t(`solveDiagnostics.issues.${key}`, { ...axisLetters(), ...params });

/**
 * Builds an issue whose message is translated when it is read, not when the model is solved,
 * so switching the language relabels the diagnostics already on screen.
 */
export const solveIssue = (
  level: SolveIssueLevel,
  code: string,
  message: () => string,
  { summary, ...where }: Pick<SolveIssue, 'nodes' | 'motion'> & { summary?: () => string } = {}
): SolveIssue => {
  const issue: SolveIssue = {
    level,
    code,
    get message() {
      return message();
    },
    ...where,
  };

  if (summary) {
    Object.defineProperty(issue, 'summary', { get: summary, enumerable: true });
  }

  return issue;
};

const isFiniteNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);

export const validateSolverModel = (solver: LinearStaticSolver): SolveDiagnostics => {
  const diagnostics = emptyDiagnostics();

  const domain = solver.domain;
  const loadCase = solver.loadCases[0];

  for (const element of domain.elements.values()) {
    const elementLabel = toLabel((element as { label?: unknown }).label);
    const elementNodes = Array.isArray((element as { nodes?: unknown[] }).nodes)
      ? ((element as { nodes?: unknown[] }).nodes as unknown[])
      : [];

    if (elementNodes.length !== 2) {
      diagnostics.errors.push(
        solveIssue('error', 'ELEMENT_INVALID_NODE_COUNT', () => t('elementNodeCount', { element: elementLabel }))
      );
      continue;
    }

    if (elementNodes[0] === elementNodes[1]) {
      diagnostics.warnings.push(
        solveIssue('warning', 'ELEMENT_DUPLICATE_NODE_REFERENCE', () => t('elementSameNode', { element: elementLabel }))
      );
    }

    for (const nodeLabel of elementNodes) {
      const normalizedNodeLabel = toLabel(nodeLabel);
      if (!domain.nodes.has(normalizedNodeLabel)) {
        diagnostics.errors.push(
          solveIssue('error', 'ELEMENT_MISSING_NODE', () =>
            t('elementMissingNode', { element: elementLabel, node: normalizedNodeLabel })
          )
        );
      }
    }

    const materialLabel = (element as { mat?: unknown }).mat;
    if (materialLabel !== undefined && materialLabel !== null && !domain.materials.has(toLabel(materialLabel))) {
      diagnostics.errors.push(
        solveIssue('error', 'ELEMENT_MISSING_MATERIAL', () =>
          t('elementMissingMaterial', { element: elementLabel, material: toLabel(materialLabel) })
        )
      );
    }

    const crossSectionLabel = (element as { cs?: unknown }).cs;
    if (
      crossSectionLabel !== undefined &&
      crossSectionLabel !== null &&
      !domain.crossSections.has(toLabel(crossSectionLabel))
    ) {
      diagnostics.errors.push(
        solveIssue('error', 'ELEMENT_MISSING_CROSS_SECTION', () =>
          t('elementMissingCrossSection', { element: elementLabel, crossSection: toLabel(crossSectionLabel) })
        )
      );
    }
  }

  for (let i = 0; i < loadCase.nodalLoadList.length; i++) {
    const load = loadCase.nodalLoadList[i];

    if (!domain.nodes.has(load.target)) {
      diagnostics.errors.push(
        solveIssue('error', 'NODAL_LOAD_MISSING_TARGET', () =>
          t('nodalLoadMissingNode', { index: i + 1, node: toLabel(load.target) })
        )
      );
    }

    const values = Object.values(load.values);
    if (values.some((value) => !isFiniteNumber(value))) {
      diagnostics.warnings.push(
        solveIssue('warning', 'NODAL_LOAD_NON_FINITE_VALUES', () => t('nodalLoadInvalid', { index: i + 1 }))
      );
    }
  }

  for (let i = 0; i < loadCase.prescribedBC.length; i++) {
    const prescribed = loadCase.prescribedBC[i];

    if (!domain.nodes.has(prescribed.target)) {
      diagnostics.errors.push(
        solveIssue('error', 'PRESCRIBED_DISPLACEMENT_MISSING_TARGET', () =>
          t('prescribedMissingNode', { index: i + 1, node: toLabel(prescribed.target) })
        )
      );
    }

    if (Object.values(prescribed.prescribedValues).some((value) => !isFiniteNumber(value))) {
      diagnostics.warnings.push(
        solveIssue('warning', 'PRESCRIBED_DISPLACEMENT_NON_FINITE_VALUES', () =>
          t('prescribedInvalid', { index: i + 1 })
        )
      );
    }
  }

  for (let i = 0; i < loadCase.elementLoadList.length; i++) {
    const load = loadCase.elementLoadList[i];

    if (!domain.elements.has(load.target)) {
      diagnostics.errors.push(
        solveIssue('error', 'ELEMENT_LOAD_MISSING_TARGET', () =>
          t('elementLoadMissingElement', { index: i + 1, element: toLabel(load.target) })
        )
      );
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

interface FreeRigidBodyMode {
  mode: RigidBodyMode;
  motion: FreeMotion;
}

/** Scales a motion so its largest nodal displacement is 1; null when nothing visibly moves. */
const normalizeMotion = (motion: FreeMotion): FreeMotion | null => {
  let largest = 0;
  for (const [u, w] of motion.values()) largest = Math.max(largest, Math.hypot(u, w));

  if (!Number.isFinite(largest) || largest < 1e-12) return null;

  return new Map([...motion].map(([label, [u, w]]) => [label, [u / largest, w / largest]]));
};

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
const findFreeRigidBodyMode = (solver: LinearStaticSolver, nodeLabels: string[]): FreeRigidBodyMode | null => {
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

  // One solution of the constraint equations: the first free unknown set to 1, any other
  // free one to 0, and the pivot unknowns back substituted. When several motions are free
  // this picks a translation before a rotation, the simpler one to see.
  const mode = [0, 0, 0];
  mode[free[0]] = 1;

  for (let i = pivots.length - 1; i >= 0; i--) {
    const column = pivots[i];
    let sum = 0;
    for (let c = column + 1; c < 3; c++) sum += rows[i][c] * mode[c];
    mode[column] = -sum / rows[i][column];
  }

  const [ux, uz, phi] = mode;
  const motion: FreeMotion = new Map();

  for (const label of nodeLabels) {
    const node = solver.domain.nodes.get(label);
    if (!node) continue;

    const x = (node.coords[0] - originX) / scale;
    const z = (node.coords[2] - originZ) / scale;
    motion.set(label, [ux - phi * z, uz + phi * x]);
  }

  return {
    mode: free.length > 1 ? 'mixed' : free[0] === 0 ? 'horizontal' : free[0] === 1 ? 'vertical' : 'rotation',
    motion: normalizeMotion(motion) ?? motion,
  };
};

/** Nodes of a part that carry a support, the ones to look at when the part is not held. */
const supportedNodes = (solver: LinearStaticSolver, nodeLabels: string[]) =>
  nodeLabels.filter((label) => {
    const node = solver.domain.nodes.get(label);
    return node ? PLANAR_DOFS.some((dof) => node.bcs.has(dof)) : false;
  });

/** A motion that deforms no element, and the hinges it turns about. */
interface KinematicMechanism {
  motion: FreeMotion;
  hinges: string[];
}

/**
 * Finds every way a part can move without any of its elements deforming.
 *
 * Each element gives one equation for its axial stretch and one for each end that is not
 * hinged: that end has to turn with the member's chord. Each support gives one more. A
 * displacement that satisfies all of them is a mechanism, whatever the stiffnesses are, so
 * this catches what the rigid body check cannot: hinges that let members turn against each
 * other while the supports themselves are fine. It is decided on geometry and hinges alone,
 * which keeps it independent of units and of a shear coefficient that may be 1e32.
 */
const findKinematicMechanism = (solver: LinearStaticSolver, nodeLabels: string[]): KinematicMechanism | null => {
  const domain = solver.domain;
  const index = new Map(nodeLabels.map((label, i) => [label, i]));
  const u = (i: number) => 3 * i;
  const w = (i: number) => 3 * i + 1;
  const phi = (i: number) => 3 * i + 2;

  // Same normalisation as the rigid body check, so one tolerance works at any model size.
  const coords = nodeLabels.map((label) => domain.nodes.get(label)!.coords);
  const originX = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
  const originZ = coords.reduce((sum, c) => sum + c[2], 0) / coords.length;
  const span = Math.max(...coords.map((c) => Math.max(Math.abs(c[0] - originX), Math.abs(c[2] - originZ))));
  const scale = span > 1e-9 ? span : 1;
  const x = (i: number) => (coords[i][0] - originX) / scale;
  const z = (i: number) => (coords[i][2] - originZ) / scale;

  const columns = 3 * nodeLabels.length;
  const rows: number[][] = [];
  const row = (entries: [number, number][]) => {
    const r = new Array(columns).fill(0);
    for (const [column, value] of entries) r[column] += value;
    rows.push(r);
  };

  /** Whether some element end at the node turns with the node, so its rotation is held by it. */
  const heldRotation = new Array(nodeLabels.length).fill(false);
  const members: { a: number; b: number; hinged: [boolean, boolean] }[] = [];

  for (const element of domain.elements.values()) {
    const ends = (element.nodes ?? []).map((label) => index.get(toLabel(label)));
    if (ends.length !== 2 || ends[0] === undefined || ends[1] === undefined || ends[0] === ends[1]) continue;

    const [a, b] = ends as [number, number];
    const hinged = ((element as { hinges?: [boolean, boolean] }).hinges ?? [false, false]) as [boolean, boolean];
    const dx = x(b) - x(a);
    const dz = z(b) - z(a);
    const l2 = dx * dx + dz * dz;
    if (l2 < 1e-18) continue;

    const l = Math.sqrt(l2);
    members.push({ a, b, hinged });

    // No stretch along the member.
    row([
      [u(a), -dx / l],
      [w(a), -dz / l],
      [u(b), dx / l],
      [w(b), dz / l],
    ]);

    // A rigid end turns with the chord, whose rotation is (Δw·Δx − Δu·Δz) / L².
    hinged.forEach((isHinged, end) => {
      if (isHinged) return;

      const node = end === 0 ? a : b;
      heldRotation[node] = true;
      row([
        [phi(node), 1],
        [w(b), -dx / l2],
        [w(a), dx / l2],
        [u(b), dz / l2],
        [u(a), -dz / l2],
      ]);
    });
  }

  nodeLabels.forEach((label, i) => {
    const node = domain.nodes.get(label)!;

    if (node.bcs.has(DofID.Ry)) {
      heldRotation[i] = true;
      row([[phi(i), 1]]);
    }

    for (const dof of [DofID.Dx, DofID.Dz]) {
      if (!node.bcs.has(dof)) continue;

      const [ex, ez] = restraintDirection(node, dof);
      row([
        [u(i), ex],
        [w(i), ez],
      ]);
    }
  });

  // A node where every element end is hinged has a rotation nothing touches. That is fine -
  // it is how a pin-jointed truss is drawn, and the solver leaves an unloaded rotation at 0 -
  // but it would fill the search with nodes spinning in place, so it is left out.
  const active = [...Array(columns).keys()].filter((c) => c % 3 !== 2 || heldRotation[Math.floor(c / 3)]);

  // Row reduce over the remaining columns; any column without a pivot is a free motion.
  // Eliminating only below each pivot and back substituting afterwards keeps this a fraction
  // of what the solve itself costs, even for a few hundred nodes.
  const matrix = rows.map((r) => Float64Array.from(active, (c) => r[c]));
  const TOLERANCE = 1e-9;
  const pivotColumns: number[] = [];
  let pivotRow = 0;

  for (let column = 0; column < active.length && pivotRow < matrix.length; column++) {
    let best = pivotRow;
    for (let i = pivotRow + 1; i < matrix.length; i++) {
      if (Math.abs(matrix[i][column]) > Math.abs(matrix[best][column])) best = i;
    }
    if (Math.abs(matrix[best][column]) < TOLERANCE) continue;

    [matrix[pivotRow], matrix[best]] = [matrix[best], matrix[pivotRow]];
    const pivot = matrix[pivotRow];

    for (let i = pivotRow + 1; i < matrix.length; i++) {
      const factor = matrix[i][column] / pivot[column];
      if (factor === 0) continue;
      for (let c = column; c < active.length; c++) matrix[i][c] -= factor * pivot[c];
    }

    pivotColumns.push(column);
    pivotRow++;
  }

  const freeColumns = active.map((_, column) => column).filter((column) => !pivotColumns.includes(column));
  if (freeColumns.length === 0) return null;

  /** One motion from the null space: a free unknown set to 1, the others to 0, the pivots back substituted. */
  const basisMotion = (free: number) => {
    const reduced = new Float64Array(active.length);
    reduced[free] = 1;
    for (let r = pivotColumns.length - 1; r >= 0; r--) {
      const column = pivotColumns[r];
      let sum = 0;
      for (let c = column + 1; c < active.length; c++) sum += matrix[r][c] * reduced[c];
      reduced[column] = -sum / matrix[r][column];
    }

    const mode = new Array(columns).fill(0);
    active.forEach((column, k) => (mode[column] = reduced[k]));
    return mode;
  };

  const chordRotation = (mode: number[], { a, b }: { a: number; b: number }) => {
    const dx = x(b) - x(a);
    const dz = z(b) - z(a);
    return ((mode[w(b)] - mode[w(a)]) * dx - (mode[u(b)] - mode[u(a)]) * dz) / (dx * dx + dz * dz);
  };

  const hingeNodes = new Set<number>();
  for (const member of members) {
    member.hinged.forEach((isHinged, end) => {
      if (isHinged) hingeNodes.add(end === 0 ? member.a : member.b);
    });
  }

  /** Hinges a motion turns about: nodes where the members meeting there rotate by different amounts. */
  const turningHinges = (mode: number[]) => {
    const largest = Math.max(...mode.map(Math.abs));

    return [...hingeNodes].filter((node) => {
      const rotations = members
        .filter((member) => member.a === node || member.b === node)
        .map((member) => chordRotation(mode, member));
      // A node that turns with a rigid end or a rotational support counts as one more member.
      if (heldRotation[node]) rotations.push(mode[phi(node)]);

      return Math.max(...rotations) - Math.min(...rotations) > 1e-6 * largest;
    });
  };

  // A structure can have several independent ways to move - one column swinging on its own
  // while the rest sways. Every one of them is found, their hinges all pointed at, and the
  // outline shows them together, weighted apart so they cannot cancel out.
  const modes = freeColumns.map(basisMotion);
  const hinges = new Set(modes.flatMap(turningHinges));
  const combined = new Array(columns).fill(0);

  modes.forEach((mode, k) => {
    const size = Math.max(...nodeLabels.map((_, i) => Math.hypot(mode[u(i)], mode[w(i)]))) || 1;
    const weight = 1 / (k + 1);
    mode.forEach((value, c) => (combined[c] += (weight * value) / size));
  });

  const motion: FreeMotion = new Map(nodeLabels.map((label, i) => [label, [combined[u(i)], combined[w(i)]]]));

  return { motion: normalizeMotion(motion) ?? motion, hinges: [...hinges].map((node) => nodeLabels[node]) };
};

const appendKinematicIssues = (solver: LinearStaticSolver, part: string[], diagnostics: SolveDiagnostics) => {
  const mechanism = findKinematicMechanism(solver, part);
  if (!mechanism) return;

  // Without hinges to point at, the supports are what let it move.
  const nodes = mechanism.hinges.length > 0 ? mechanism.hinges : supportedNodes(solver, part);

  diagnostics.errors.push(
    solveIssue('error', 'HINGE_MECHANISM', () => t('hingeMechanism', { nodes: formatNodeList(nodes) }), {
      nodes,
      motion: mechanism.motion,
      summary: () => t('hingeMechanismShort', { nodes: formatNodeList(nodes) }),
    })
  );
};

const appendStabilityIssues = (solver: LinearStaticSolver, diagnostics: SolveDiagnostics) => {
  const { parts, orphans } = findConnectedParts(solver);

  for (const label of orphans) {
    const node = solver.domain.nodes.get(label);
    const isSupported = node ? PLANAR_DOFS.some((dof) => node.bcs.has(dof)) : false;

    diagnostics.warnings.push(
      solveIssue(
        'warning',
        isSupported ? 'SUPPORTED_NODE_NOT_CONNECTED' : 'NODE_NOT_CONNECTED',
        () => t(isSupported ? 'supportedNodeNotConnected' : 'nodeNotConnected', { node: label }),
        { nodes: [label] }
      )
    );
  }

  for (const part of parts) {
    const free = findFreeRigidBodyMode(solver, part);

    // Held as a rigid body; what is left is whether the hinges hold it too.
    if (!free) {
      appendKinematicIssues(solver, part, diagnostics);
      continue;
    }

    // The supports that fail to hold the part are what needs fixing; a part with none
    // at all is pointed out as a whole.
    const supported = supportedNodes(solver, part);
    const where = { nodes: supported.length > 0 ? supported : part, motion: free.motion };

    // Too few restraints means the supports are simply not all there yet, which is where
    // every drawing passes through. Only once there are enough of them does a free motion
    // say the student placed them wrong.
    if (countRestraints(solver, part) < RIGID_BODY_DOFS) {
      diagnostics.incomplete.push(
        parts.length > 1
          ? solveIssue(
              'incomplete',
              'UNSUPPORTED_STRUCTURE_PART',
              () => t('partUnsupported', { nodes: formatNodeList(part) }),
              {
                ...where,
                summary: () => t('partNeedsSupports', { nodes: formatNodeList(part) }),
              }
            )
          : solveIssue('incomplete', 'INSUFFICIENT_SUPPORTS', () => t('insufficientSupports'), {
              ...where,
              summary: () => t('needsSupports'),
            })
      );
      continue;
    }

    diagnostics.errors.push(
      solveIssue(
        'error',
        'RIGID_BODY_MECHANISM',
        () => {
          const motion = t(`motion.${free.mode}`);
          return parts.length > 1
            ? t('partMechanism', { nodes: formatNodeList(part), motion })
            : t('mechanism', { motion });
        },
        {
          ...where,
          summary: () => {
            const motion = t(`motion.${free.mode}`);
            return parts.length > 1
              ? t('partMechanismShort', { nodes: formatNodeList(part), motion })
              : t('mechanismShort', { motion });
          },
        }
      )
    );
  }
};

/** Displacements above this are not a soft structure any more, they are a mechanism. */
export const MECHANISM_DISPLACEMENT_LIMIT = 1e6;

const DOF_KEYS: Partial<Record<DofID, string>> = {
  [DofID.Dx]: 'dx',
  [DofID.Dz]: 'dz',
  [DofID.Ry]: 'ry',
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
  const displaced: FreeMotion = new Map();

  for (const [label, codeNumbers] of solver.nodeCodeNumbers) {
    const translation: [number, number] = [0, 0];

    for (const dof of PLANAR_DOFS) {
      const equation = codeNumbers[dof];
      // Equations from neq upwards belong to restrained DOFs and hold prescribed values.
      if (equation === undefined || equation >= solver.neq) continue;

      const value = r[equation];
      if (!Number.isFinite(value) || Math.abs(value) > limit) runaway.push({ node: toLabel(label), dof });

      if (dof === DofID.Dx) translation[0] = value;
      if (dof === DofID.Dz) translation[1] = value;
    }

    displaced.set(toLabel(label), translation);
  }

  if (runaway.length === 0) return [];

  // The runaway solution is dominated by the mechanism, so its shape is the free motion.
  // Only worth drawing when the nodes themselves run away; a node that merely spins in
  // place (Ry) is shown by its highlight.
  const translationRunsAway = [...displaced.values()].some(([u, w]) => Math.hypot(u, w) > limit);
  const motion = translationRunsAway ? normalizeMotion(displaced) : null;

  return [
    solveIssue(
      'error',
      'UNSTABLE_STRUCTURE',
      () => {
        const list = runaway
          .slice(0, 4)
          .map(({ node, dof }) => t(`unstableDof.${DOF_KEYS[dof] ?? 'other'}`, { node, dof }))
          .join(', ');
        const dofs = runaway.length > 4 ? t('unstableMore', { list, count: runaway.length - 4 }) : list;

        return t('unstable', { dofs });
      },
      {
        nodes: [...new Set(runaway.map(({ node }) => node))],
        ...(motion ? { motion } : {}),
        summary: () => t('unstableShort'),
      }
    ),
  ];
};
