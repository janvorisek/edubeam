import type { Node } from '@edubeam/fem';

/** Below this, an angle is indistinguishable from an unrotated support. */
const NEGLIGIBLE_RADIANS = 1e-8;

/** Brings an angle into (-180, 180], so a support reads -170 rather than 190. */
const normalizeDegrees = (degrees: number) => {
  const wrapped = (((degrees + 180) % 360) + 360) % 360;

  return wrapped === 0 ? 180 : wrapped - 180;
};

/** The angle of a node's local coordinate system in degrees; zero when it has none. */
export const nodeLcsAngle = (node: Node | undefined) => {
  if (!node?.hasLcs()) return 0;

  return normalizeDegrees(90 - Math.atan2(node.lcs[0][0], node.lcs[0][2]) * (180 / Math.PI));
};

/** Rotates a node's local system to `degrees`. Zero - or anything unreadable - removes it. */
export const applyNodeLcsAngle = (node: Node, degrees: number) => {
  const radians = degrees * (Math.PI / 180);

  if (!Number.isFinite(radians) || Math.abs(radians) < NEGLIGIBLE_RADIANS) {
    node.lcs = undefined;
    return;
  }

  node.updateLcs({ locx: [Math.cos(radians), 0, Math.sin(radians)], locy: [0, 1, 0] });
};

/**
 * A vector (x, z) in a node's own axes, in the global ones; unchanged for a node without axes of
 * its own. The node's base vectors are the rows of its `lcs`, in global components.
 */
export const nodeToGlobal = (node: Node | undefined, x: number, z: number): [number, number] => {
  if (!node?.hasLcs()) return [x, z];

  return [x * node.lcs[0][0] + z * node.lcs[2][0], x * node.lcs[0][2] + z * node.lcs[2][2]];
};

/**
 * The global components of what a nodal load or a prescribed displacement does at its node: a
 * load in the node's axes, and every prescribed displacement (they act along the support's own
 * restraints), turned into the global axes; a load in the global axes as it is. For drawing.
 */
export const actingInGlobalAxes = (
  node: Node | undefined,
  values: Readonly<Record<number, number>>,
  inNodeAxes: boolean
): { x: number; z: number } => {
  const x = values[0] ?? 0;
  const z = values[2] ?? 0;
  if (!inNodeAxes) return { x, z };

  const [gx, gz] = nodeToGlobal(node, x, z);
  return { x: gx, z: gz };
};

/** A global vector (x, z) in a node's own axes; unchanged for a node without axes of its own. */
export const globalToNode = (node: Node | undefined, x: number, z: number): [number, number] => {
  if (!node?.hasLcs()) return [x, z];

  return [x * node.lcs[0][0] + z * node.lcs[0][2], x * node.lcs[2][0] + z * node.lcs[2][2]];
};

/**
 * Whether the node's axes are turned from the global ones. A node can carry axes of its own that
 * are not turned at all (from a file, at 0 degrees); it shows nothing a plain node does not.
 */
export const isTurned = (node: Node | undefined) => !!node?.hasLcs() && Math.abs(nodeLcsAngle(node)) > 1e-9;

/** The prime that marks a component in a turned node's own axes (x′), or nothing in the global ones. */
export const axisMark = (node: Node | undefined, inNodeAxes: boolean) => (inNodeAxes && isTurned(node) ? '′' : '');
