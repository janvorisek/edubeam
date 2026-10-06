import { DofID, Node } from 'ts-fem';
import { executeModelMutationWithUndo, setUnsolved } from '@/utils';

/** The supports students name: no support, then the most common first, each a fixed set of restrained DOFs in the node's LCS. */
export const supportTypes = {
  free: [],
  pin: [DofID.Dx, DofID.Dz],
  roller: [DofID.Dz],
  verticalRoller: [DofID.Dx],
  fixed: [DofID.Dx, DofID.Dz, DofID.Ry],
  slider: [DofID.Dz, DofID.Ry],
  verticalSlider: [DofID.Dx, DofID.Ry],
  rotation: [DofID.Ry],
} as const satisfies Record<string, readonly DofID[]>;

export type SupportType = keyof typeof supportTypes;

/** The named support these DOFs make up, or `custom` for any other combination. */
export const supportType = (bcs: Set<number>): SupportType | 'custom' => {
  const match = (Object.keys(supportTypes) as SupportType[]).find(
    (type) => supportTypes[type].length === bcs.size && supportTypes[type].every((dof) => bcs.has(dof))
  );

  return match ?? 'custom';
};

/** Restrain exactly the DOFs of `type` on a node of the model, as one undo step. */
export const setSupportType = (node: Node, type: SupportType) => {
  executeModelMutationWithUndo(() => {
    setUnsolved();
    node.bcs = new Set(supportTypes[type]);
  });
};
