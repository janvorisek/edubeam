/**
 * What the user is after near a node, when the values at the pointer show (PlotReadout).
 *
 * A node lies at the end of every member that meets there, so near one the pointer is over both.
 * What it means is read from how it got there: sliding along a member while its values show is
 * reading that member to its end, and the readout stays on it; arriving any other way - from off
 * the member, across it, or fast - is going for the node, and its own tooltip shows instead. The
 * choice is made on entering the node and kept until the pointer leaves it.
 */
import { memberFrame, nodeMap, type PlotModel } from '@edubeam/plot';

/** A node's reach, screen px: its hit target's */
export const NODE_PX = 12;
/** Faster than this, px/ms, the pointer is heading somewhere rather than reading on the way */
export const FAST = 1.2;
/** How far back the pointer's motion is judged, ms */
export const MOTION_MS = 120;
/** A member read over less than this, screen px along it, was only brushed on the way: not reading */
export const READING_PX = 50;
/** Resting on a node this long, ms, is wanting the node, however the pointer got there */
export const DWELL_MS = 800;

export interface TrailPoint {
  /** ms */
  readonly t: number;
  /** Screen px */
  readonly x: number;
  readonly y: number;
}

/** The pointer's motion over the trail, screen px/ms */
export const pointerMotion = (trail: readonly TrailPoint[]): { x: number; y: number } => {
  if (trail.length < 2) return { x: 0, y: 0 };
  const a = trail[0];
  const b = trail[trail.length - 1];
  const dt = Math.max(1, b.t - a.t);
  return { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
};

/**
 * The node within reach of a point of the drawing, if any.
 * `scale` is the drawing's px per metre, `pxPerScreen` drawing px per screen px.
 */
export const nodeNear = (
  model: PlotModel,
  scale: number,
  px: number,
  py: number,
  pxPerScreen: number
): { id: string; d: number } | null => {
  let best: { id: string; d: number } | null = null;
  for (const n of model.nodes) {
    const d = Math.hypot(n.x * scale - px, n.z * scale - py) / pxPerScreen;
    if (d <= NODE_PX && (!best || d < best.d)) best = { id: n.id, d };
  }
  return best;
};

/** The member whose values show, and where the pointer was when they began to, screen px */
export interface Reading {
  readonly member: string;
  readonly x: number;
  readonly y: number;
}

/**
 * Entering node `nodeId`: the member being read on to its end, or null when the user is going for
 * the node. `screen` maps the model's x and z to screen px (the drawing's on-screen scale, which may
 * flip an axis).
 */
export const readingOnTo = (
  model: PlotModel,
  nodeId: string,
  reading: Reading | null,
  pointer: { readonly x: number; readonly y: number },
  motion: { readonly x: number; readonly y: number },
  screen: { readonly a: number; readonly d: number }
): string | null => {
  if (!reading) return null;
  const m = model.members.find((member) => member.id === reading.member);
  if (!m || (m.start !== nodeId && m.end !== nodeId)) return null;
  // The member's direction on screen
  const f = memberFrame(model, m, nodeMap(model));
  const tx = f.tx * screen.a;
  const ty = f.tz * screen.d;
  const tl = Math.hypot(tx, ty) || 1;
  // Read along it far enough, not just brushed on the way in
  const travelled = Math.abs(((pointer.x - reading.x) * tx + (pointer.y - reading.y) * ty) / tl);
  if (travelled < READING_PX) return null;
  const speed = Math.hypot(motion.x, motion.y);
  if (speed > FAST) return null;
  if (speed < 0.02) return m.id;
  const along = Math.abs((motion.x * tx + motion.y * ty) / (speed * tl));
  return along > 0.8 ? m.id : null;
};
