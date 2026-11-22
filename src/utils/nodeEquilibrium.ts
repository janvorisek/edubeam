/**
 * A node cut free from the solved structure: what each member, the loads and the supports do to it.
 *
 * Everything is in the model's axes, x right and z down (as the SVG is drawn), in SI; the axis
 * convention and units are for whoever shows it. Moments are about y, positive counter-clockwise on
 * screen, as the solver's.
 *
 * A member's end forces from the solver are what the node does to the member, in the member's axes;
 * what the member does to the node is their opposite. With the loads and the reactions, those add up
 * to nothing: K r = f + R, row by row, is exactly this balance at each node.
 */
import { Beam2D, DofID, type LinearStaticSolver, type Node } from '@edubeam/fem';
import type { Matrix } from 'mathjs';
import { ref } from 'vue';
import { isNumbered, resultScales, withoutRoundOff } from '@/utils/exportResults';
import { nodeToGlobal } from '@/utils/nodalLcs';

/** A direction or a force in the model's axes: x right, z down. */
export type Vec = readonly [x: number, z: number];

/**
 * The cut end of a member at the node, and what it does to the node, by the sign convention of the
 * diagrams: N, V and M are the diagrams' values at that end. Drawn on the cut face of the stub left at
 * the node, positive N points out of the section (tension); positive V points along the member's
 * local +z, toward its bottom fibres, on the face of its start, and the other way on the face of its
 * end; positive M turns counter-clockwise on the start's face and clockwise on the end's. So the
 * force on the node is n·along + v·shearDirection and its moment m·momentTurn.
 */
export interface MemberAction {
  readonly label: string;
  /** Unit vector from the node along the member, toward its other end: positive N's direction. */
  readonly along: Vec;
  /** The member's own local z axis, the side of its bottom fibres. */
  readonly across: Vec;
  /** Whether the node is the member's start (its cut face the positive one) or its end. */
  readonly atStart: boolean;
  readonly n: number;
  readonly v: number;
  readonly m: number;
  /** Positive V's direction on this cut face: `across` at the start, against it at the end. */
  readonly shearDirection: Vec;
  /** Positive M's turn on this cut face, +1 counter-clockwise on screen. */
  readonly momentTurn: 1 | -1;
  readonly hinged: boolean;
  /** The force on the node, in the model's axes. */
  readonly force: Vec;
  /** The moment on the node, counter-clockwise positive. */
  readonly moment: number;
}

/** One component of a load or a reaction, along an axis of the node's (rotated by a turned support) or the model's. */
export interface ForceComponent {
  readonly direction: Vec;
  readonly value: number;
}

/** The loads on the node, or its support's reaction, as components and a moment. */
export interface NodeAction {
  readonly components: readonly ForceComponent[];
  readonly m: number;
  /** A moment is there to show: a load's is not zero, or the support holds the rotation */
  readonly hasMoment: boolean;
  readonly force: Vec;
}

export interface NodeEquilibrium {
  readonly members: readonly MemberAction[];
  readonly load: NodeAction | null;
  readonly reaction: NodeAction | null;
  /** What it all adds up to, which the solution makes zero (round-off left as it is). */
  readonly sum: { readonly x: number; readonly z: number; readonly m: number };
}

const at = (values: Matrix | number[], i: number): number =>
  Array.isArray(values) ? values[i] : (values.get([i]) as number);

/** The node's own axes in the model's, x' and z': turned with its support, or the model's own. */
const nodeAxes = (node: Node): [Vec, Vec] => [nodeToGlobal(node, 1, 0), nodeToGlobal(node, 0, 1)];

const combine = (components: readonly ForceComponent[]): Vec => [
  components.reduce((sum, c) => sum + c.direction[0] * c.value, 0),
  components.reduce((sum, c) => sum + c.direction[1] * c.value, 0),
];

const memberActions = (solver: LinearStaticSolver, node: Node): MemberAction[] => {
  const lc = solver.loadCases[0];
  const actions: MemberAction[] = [];

  for (const element of solver.domain.elements.values()) {
    if (!(element instanceof Beam2D)) continue;
    const end = element.nodes.indexOf(node.label);
    if (end === -1) continue;

    const [start, finish] = element.nodes.map((label) => solver.domain.getNode(label).coords);
    const dx = finish[0] - start[0];
    const dz = finish[2] - start[2];
    const length = Math.hypot(dx, dz);
    if (length === 0) continue;
    const c = dx / length;
    const s = dz / length;

    const atStart = end === 0;
    // The diagrams' own values at this end, loads on the member included
    const x = atStart ? 0 : length;
    const n = element.computeNormalForceAt(lc, x);
    const v = element.computeShearForceAt(lc, x);
    const m = element.computeBendingMomentAt(lc, x);

    const ex: Vec = [c, s];
    // + 0 keeps a reversed zero from printing as -0
    const across: Vec = [-s + 0, c];
    const along: Vec = atStart ? ex : [-c + 0, -s + 0];
    const shearDirection: Vec = atStart ? across : [s, -c + 0];
    const momentTurn = atStart ? 1 : -1;

    actions.push({
      label: String(element.label),
      along,
      across,
      atStart,
      n,
      v,
      m,
      shearDirection,
      momentTurn,
      hinged: element.hinges[end],
      force: [n * along[0] + v * shearDirection[0], n * along[1] + v * shearDirection[1]],
      moment: m * momentTurn,
    });
  }

  return actions;
};

const loadAction = (solver: LinearStaticSolver, node: Node): NodeAction | null => {
  const loads = solver.loadCases[0].nodalLoadList.filter((load) => load.target === node.label);
  if (loads.length === 0) return null;

  const [lx, lz] = nodeAxes(node);
  const components: ForceComponent[] = [];
  let m = 0;

  for (const load of loads) {
    const [ax, az]: [Vec, Vec] = load.lcs
      ? [lx, lz]
      : [
          [1, 0],
          [0, 1],
        ];
    const fx = load.values[DofID.Dx] ?? 0;
    const fz = load.values[DofID.Dz] ?? 0;
    if (fx !== 0) components.push({ direction: ax, value: fx });
    if (fz !== 0) components.push({ direction: az, value: fz });
    m += load.values[DofID.Ry] ?? 0;
  }

  return { components, m, hasMoment: m !== 0, force: combine(components) };
};

/** The reaction along the support's own axes: a turned roller pushes along its own z. */
const reactionAction = (solver: LinearStaticSolver, node: Node): NodeAction | null => {
  if (node.bcs.size === 0) return null;

  const { dofs, values } = node.getReactions(solver.loadCases[0], false);
  const [lx, lz] = nodeAxes(node);
  const components: ForceComponent[] = [];
  let m = 0;

  dofs.forEach((dof, i) => {
    const value = at(values as Matrix | number[], i);
    if (dof === DofID.Dx) components.push({ direction: lx, value });
    else if (dof === DofID.Dz) components.push({ direction: lz, value });
    else if (dof === DofID.Ry) m = value;
  });

  return { components, m, hasMoment: dofs.includes(DofID.Ry), force: combine(components) };
};

/**
 * The node's equilibrium in the last solution, or null when there is none to show: the structure is
 * not solved, or the node had no part in the solve (nothing connects it, or it was added since).
 */
export const nodeEquilibrium = (solver: LinearStaticSolver, label: string): NodeEquilibrium | null => {
  const node = solver.domain.nodes.get(label);
  if (!node || !solver.loadCases[0]?.solved || !isNumbered(solver, node, DofID.Dx)) return null;

  const members = memberActions(solver, node);
  if (members.length === 0) return null;

  const load = loadAction(solver, node);
  const reaction = reactionAction(solver, node);
  const all = [
    ...members.map((a) => ({ force: a.force, m: a.moment })),
    ...(load ? [load] : []),
    ...(reaction ? [reaction] : []),
  ];

  return {
    members,
    load,
    reaction,
    sum: {
      x: all.reduce((sum, a) => sum + a.force[0], 0),
      z: all.reduce((sum, a) => sum + a.force[1], 0),
      m: all.reduce((sum, a) => sum + a.m, 0),
    },
  };
};

/** The same, with what is round-off against the model's largest values set to zero, for showing. */
export const shownNodeEquilibrium = (solver: LinearStaticSolver, label: string): NodeEquilibrium | null => {
  const raw = nodeEquilibrium(solver, label);
  if (!raw) return null;

  const { force: fs, moment: ms } = resultScales(solver);
  const f = (value: number) => withoutRoundOff(value, fs);
  const m = (value: number) => withoutRoundOff(value, ms);
  const vec = (v: Vec): Vec => [f(v[0]), f(v[1])];
  // A load's zero components are not there; a reaction's are unknowns that came out zero, and stay
  const action = (a: NodeAction | null, keepZeros: boolean): NodeAction | null =>
    a && {
      ...a,
      components: a.components.map((c) => ({ ...c, value: f(c.value) })).filter((c) => keepZeros || c.value !== 0),
      m: m(a.m),
      force: vec(a.force),
    };

  return {
    members: raw.members.map((a) => ({
      ...a,
      n: f(a.n),
      v: f(a.v),
      m: m(a.m),
      force: vec(a.force),
      moment: m(a.moment),
    })),
    load: action(raw.load, false),
    reaction: action(raw.reaction, true),
    sum: { x: f(raw.sum.x), z: f(raw.sum.z), m: m(raw.sum.m) },
  };
};

/**
 * What the widget's arrows carry: symbols, in the positive directions the sums count with, or values,
 * each arrow turned the way its force really acts. One choice for every such widget, for the session.
 */
export const equilibriumMode = ref<'symbols' | 'values'>('symbols');
