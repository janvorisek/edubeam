import type { Beam2D, Node } from '@edubeam/fem';

/**
 * The drawing's one snapping engine: where a point put down by the pointer goes. Every tool that
 * puts something on the drawing - a node, an element's ends, a support, a load, a load dragged, a
 * dimension's points - asks it, and so does what previews it, so what is seen is where it lands.
 *
 * In order: the nearest node within reach; on a member, its middle, then its thirds, which pull
 * from further; anywhere else on the member, at the grid point projected onto it; the grid point;
 * the pointer itself. Placing freely (`snapping` off: the editor's Alt held) leaves the marks out;
 * nodes and members still catch, being what a thing is put on.
 */

/** A point of the model, m: x right, y as the model's z, down */
export type ModelPoint = { readonly x: number; readonly y: number };

/** What a point snapped to: drawn as its own mark, so the user sees why it is where it is */
export type SnapKind = 'node' | 'middle' | 'third' | 'member' | 'grid' | 'free';

export type Snap = ModelPoint & {
  readonly kind: SnapKind;
  /** The node it is on (`node`) */
  readonly node?: Node;
  /** The member it is on (`middle`, `third`, `member`), and how far along it from its first node, m */
  readonly beam?: Beam2D;
  readonly at?: number;
};

/**
 * What a tool puts down: on a node (a support), at a place on a member (a point load dragged), over
 * a whole member (a distributed load: no place along it to snap to), on either (a node, a force), or
 * anywhere.
 */
export type SnapTakes = 'node' | 'member' | 'whole-member' | 'either' | 'anywhere';

export interface SnapInput {
  readonly nodes: ReadonlyMap<string, Node>;
  readonly beams: readonly Beam2D[];
  /** Where the pointer is, never snapped: what decides the node or member it is on */
  readonly exact: ModelPoint;
  /** The pointer on the grid when snapping is on, else the pointer: where a point off the marks goes */
  readonly grid: ModelPoint;
  /** How near a node or member the pointer has to be, m (the screen's px over the scale) */
  readonly reach: number;
  readonly takes: SnapTakes;
  /** The middle and thirds of a member pull; off (placing freely), a point on a member stays where it is */
  readonly snapping: boolean;
}

/** How much further than a node a member's middle and thirds pull the pointer */
const MARK_PULL = 1.5;
/** The places along a member a point snaps to, as parts of its length: the middle first, the thirds */
const MARKS: readonly { readonly part: number; readonly kind: 'middle' | 'third' }[] = [
  { part: 1 / 2, kind: 'middle' },
  { part: 1 / 3, kind: 'third' },
  { part: 2 / 3, kind: 'third' },
];

const pointOf = (node: Node): ModelPoint => ({ x: node.coords[0], y: node.coords[2] });

const distanceToSegment = (p: ModelPoint, a: ModelPoint, b: ModelPoint): number => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq === 0 ? 0 : Math.min(Math.max(((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq, 0), 1);
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
};

/** How near two points are to be one, m: a point put down there is the node already there */
const SAME_POINT = 1e-6;

export const snapPoint = (input: SnapInput): Snap => {
  const { nodes, beams, exact, grid, reach, takes, snapping } = input;
  const onMember = takes === 'member' || takes === 'whole-member';
  // A point that comes out on a node - a grid point there, a member's end - is that node, so no
  // second node is put on top of it (and no member of no length made by splitting there)
  const asNode = (snap: Snap): Snap => {
    if (onMember) return snap;
    for (const n of nodes.values()) {
      if (Math.hypot(n.coords[0] - snap.x, n.coords[2] - snap.y) <= SAME_POINT) {
        return { ...pointOf(n), kind: 'node', node: n };
      }
    }
    return snap;
  };
  // Off the structure, or off what the tool takes: the grid point, or the pointer with snapping off
  const loose: Snap = asNode({ ...grid, kind: snapping ? 'grid' : 'free' });

  if (!onMember) {
    let node: Node | null = null;
    let nodeDistance = reach;
    for (const n of nodes.values()) {
      const d = Math.hypot(n.coords[0] - exact.x, n.coords[2] - exact.y);
      if (d <= nodeDistance) [node, nodeDistance] = [n, d];
    }
    if (node) return { ...pointOf(node), kind: 'node', node };
  }
  if (takes === 'node') return loose;

  let beam: Beam2D | null = null;
  let beamDistance = reach;
  for (const b of beams) {
    const [a, z] = b.nodes.map((id) => nodes.get(id));
    if (!a || !z) continue;
    const d = distanceToSegment(exact, pointOf(a), pointOf(z));
    if (d <= beamDistance) [beam, beamDistance] = [b, d];
  }
  if (!beam) return loose;

  const a = pointOf(nodes.get(beam.nodes[0])!);
  const z = pointOf(nodes.get(beam.nodes[1])!);
  const dx = z.x - a.x;
  const dy = z.y - a.y;
  const length = Math.hypot(dx, dy);
  const along = (at: number, kind: SnapKind): Snap => {
    const k = length === 0 ? 0 : at / length;
    return { x: a.x + k * dx, y: a.y + k * dy, kind, beam: beam!, at };
  };
  if (length === 0) return along(0, 'member');
  const project = (p: ModelPoint) => ((p.x - a.x) * dx + (p.y - a.y) * dy) / length;

  if (snapping && takes !== 'whole-member') {
    const exactly = project(exact);
    const mark = MARKS.map((m) => ({ ...m, place: m.part * length }))
      .map((m) => ({ ...m, off: Math.abs(m.place - exactly) }))
      .filter((m) => m.off <= MARK_PULL * reach)
      .sort((p, q) => p.off - q.off)[0];
    if (mark) return along(mark.place, mark.kind);
  }

  return asNode(along(Math.min(Math.max(project(grid), 0), length), 'member'));
};
