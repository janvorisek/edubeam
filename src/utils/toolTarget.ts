import {
  BeamConcentratedLoad,
  BeamElementLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  DofID,
  NodalLoad,
  type Beam2D,
  type LoadCase,
  type Node,
} from '@edubeam/fem';
import type { Snap, SnapTakes } from '@/utils/snap';
import { globalToNode, nodeToGlobal } from '@/utils/nodalLcs';

/** What a support or load tool click lands on: a node, or a member at a distance along it, m */
export type ToolTarget = { readonly node: Node } | { readonly beam: Beam2D; readonly at: number };

/** The kinds of load the load tool puts on */
export type ToolLoadKind = 'force' | 'moment' | 'udl' | 'trapezoidal' | 'temperature';

/**
 * The load tool's load, SI, z down. A force or a distributed load on a member is in the member's
 * axes when `local`, as the element load dialog offers; on a node a force is in global axes.
 */
export type ToolLoad =
  | { readonly kind: 'force'; readonly fx: number; readonly fz: number; readonly local: boolean }
  | { readonly kind: 'moment'; readonly my: number }
  | { readonly kind: 'udl'; readonly qx: number; readonly qz: number; readonly local: boolean }
  | {
      readonly kind: 'trapezoidal';
      readonly start: { readonly fx: number; readonly fz: number };
      readonly end: { readonly fx: number; readonly fz: number };
      readonly local: boolean;
    }
  /** Temperature change, K: of the centroid, and bottom minus top fibres */
  | { readonly kind: 'temperature'; readonly uniform: number; readonly gradient: number };

/** The kinds that only go on a member: along its length */
const ALONG_MEMBER: ReadonlySet<ToolLoadKind> = new Set(['udl', 'trapezoidal', 'temperature']);

const valuesOf = (load: ToolLoad): number[] => {
  switch (load.kind) {
    case 'force':
      return [load.fx, load.fz];
    case 'moment':
      return [load.my];
    case 'udl':
      return [load.qx, load.qz];
    case 'trapezoidal':
      return [load.start.fx, load.start.fz, load.end.fx, load.end.fz];
    case 'temperature':
      return [load.uniform, load.gradient];
  }
};

/** What the support tool, or the load tool with this load, puts it on */
export const toolTakes = (tool: 'support' | 'load', load: ToolLoad): SnapTakes =>
  tool === 'support' ? 'node' : ALONG_MEMBER.has(load.kind) ? 'whole-member' : 'either';

/** What a snap lands a tool's click on, if anything (see snapPoint) */
export const targetOf = (snap: Snap): ToolTarget | null =>
  snap.node ? { node: snap.node } : snap.beam && snap.at !== undefined ? { beam: snap.beam, at: snap.at } : null;

/** Whether the load can go on the target: not a zero load, and one along a member only on a member */
export const toolLoadFits = (target: ToolTarget, load: ToolLoad): boolean => {
  const values = valuesOf(load);
  if (values.some((v) => !Number.isFinite(v)) || values.every((v) => v === 0)) return false;
  return !ALONG_MEMBER.has(load.kind) || 'beam' in target;
};

/**
 * Puts the load on the target. A force or a moment on a member is a point load where it was put; a
 * force on a node is in global axes.
 */
export const putToolLoad = (lc: LoadCase, target: ToolTarget, load: ToolLoad): void => {
  if ('node' in target) {
    if (ALONG_MEMBER.has(load.kind)) return;
    const label = target.node.label;
    if (load.kind === 'force')
      lc.createNodalLoad(label, { [DofID.Dx]: load.fx, [DofID.Dz]: load.fz, [DofID.Ry]: 0 }, false);
    else if (load.kind === 'moment')
      lc.createNodalLoad(label, { [DofID.Dx]: 0, [DofID.Dz]: 0, [DofID.Ry]: load.my }, false);
    return;
  }

  const label = target.beam.label;
  switch (load.kind) {
    case 'udl':
      lc.createBeamElementUniformEdgeLoad(label, [load.qx, load.qz], load.local);
      return;
    case 'trapezoidal':
      lc.createBeamElementTrapezoidalEdgeLoad(
        label,
        [load.start.fx, load.start.fz],
        [load.end.fx, load.end.fz],
        load.local
      );
      return;
    case 'temperature':
      // Stored as the element load dialog stores it: centroid, bottom minus top, and a zero
      lc.createBeamTemperatureLoad(label, [load.uniform, load.gradient, 0]);
      return;
    case 'force':
      lc.createBeamConcentratedLoad(label, [load.fx, load.fz, 0, target.at], load.local);
      return;
    case 'moment':
      lc.createBeamConcentratedLoad(label, [0, 0, load.my, target.at], false);
  }
};

/* ── Moving a load already on the model ─────────────────────────────────────────────────────── */

/** A load of the model that can be dragged to another place */
export type MovableLoad = NodalLoad | BeamElementLoad;

/** What a dragged load can go on: a nodal load on another node, a member's load on a member */
export const movableTakes = (load: MovableLoad): SnapTakes =>
  load instanceof NodalLoad ? 'node' : load instanceof BeamConcentratedLoad ? 'member' : 'whole-member';

/**
 * The load as the tool's loads, to preview it where it would be dropped: a nodal or point load
 * with both a force and a moment is two of them. None for a kind there is nothing to show for.
 */
export const asToolLoads = (load: MovableLoad): ToolLoad[] => {
  if (load instanceof NodalLoad) {
    // As it acts, in global axes: given in its node's own, it keeps that direction when moved
    const [fx, fz] = load.lcs
      ? nodeToGlobal(load.domain.nodes.get(load.target), load.values[DofID.Dx] ?? 0, load.values[DofID.Dz] ?? 0)
      : [load.values[DofID.Dx] ?? 0, load.values[DofID.Dz] ?? 0];
    const my = load.values[DofID.Ry] ?? 0;
    return [
      ...(fx !== 0 || fz !== 0 ? [{ kind: 'force', fx, fz, local: false } as const] : []),
      ...(my !== 0 ? [{ kind: 'moment', my } as const] : []),
    ];
  }
  if (load instanceof BeamConcentratedLoad) {
    const [fx = 0, fz = 0, my = 0] = load.values;
    return [
      ...(fx !== 0 || fz !== 0 ? [{ kind: 'force', fx, fz, local: load.lcs } as const] : []),
      ...(my !== 0 ? [{ kind: 'moment', my } as const] : []),
    ];
  }
  if (load instanceof BeamElementUniformEdgeLoad) {
    return [{ kind: 'udl', qx: load.values[0] ?? 0, qz: load.values[1] ?? 0, local: load.lcs }];
  }
  if (load instanceof BeamElementTrapezoidalEdgeLoad) {
    const [sx, sz] = load.startValues;
    const [ex, ez] = load.endValues;
    return [{ kind: 'trapezoidal', start: { fx: sx, fz: sz }, end: { fx: ex, fz: ez }, local: load.lcs }];
  }
  if (load instanceof BeamTemperatureLoad) {
    const [uniform = 0, bottom = 0, top = 0] = load.values;
    return [{ kind: 'temperature', uniform, gradient: bottom - top }];
  }
  return [];
};

/**
 * Moves the load onto the target: onto another node or member, and a point load to its new place
 * along the member. Whether anything changed; a load dropped back where it was, or on what it
 * cannot go on, is left alone. The caller makes it one undo step.
 */
export const moveLoad = (load: MovableLoad, target: ToolTarget): boolean => {
  if (load instanceof NodalLoad) {
    if (!('node' in target) || target.node.label === load.target) return false;
    // A force given in its node's own axes keeps its direction: given again in the new node's axes
    if (load.lcs) {
      const from = load.domain.nodes.get(load.target);
      const [gx, gz] = nodeToGlobal(from, load.values[DofID.Dx] ?? 0, load.values[DofID.Dz] ?? 0);
      const [x, z] = globalToNode(target.node, gx, gz);
      load.values[DofID.Dx] = x;
      load.values[DofID.Dz] = z;
    }
    load.target = String(target.node.label);
    return true;
  }
  if (!('beam' in target)) return false;
  const label = String(target.beam.label);
  if (load instanceof BeamConcentratedLoad) {
    if (label === load.target && Math.abs((load.values[3] ?? 0) - target.at) < 1e-9) return false;
    load.target = label;
    load.values[3] = target.at;
    return true;
  }
  if (label === load.target) return false;
  load.target = label;
  return true;
};
