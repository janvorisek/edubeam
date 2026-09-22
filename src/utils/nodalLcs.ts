import type { Node } from 'ts-fem';

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
