import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { undoRedoManager } from '@/CommandManager';
import { setSupportType, supportType } from '@/utils/supports';

describe('supportType', () => {
  it.each([
    [[], 'free'],
    [[DofID.Dx, DofID.Dz], 'pin'],
    [[DofID.Dz], 'roller'],
    [[DofID.Dz, DofID.Ry], 'slider'],
    [[DofID.Ry, DofID.Dz, DofID.Dx], 'fixed'],
    [[DofID.Dx, DofID.Ry], 'verticalSlider'],
    [[DofID.Ry], 'rotation'],
    [[DofID.Dx], 'verticalRoller'],
    // Every combination of the three in-plane DOFs has a name; only a stray one does not.
    [[DofID.Dx, DofID.Dy], 'custom'],
  ])('names %j as %s', (dofs, type) => {
    expect(supportType(new Set(dofs))).toBe(type);
  });
});

describe('setSupportType', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('restrains exactly the DOFs of the support, as one undo step', () => {
    const projectStore = useProjectStore();
    const solver = new LinearStaticSolver();
    const node = solver.domain.createNode(1, [0, 0, 0], [DofID.Ry]);
    projectStore.solver = solver;

    setSupportType(node, 'pin');
    expect([...node.bcs].sort()).toEqual([DofID.Dx, DofID.Dz].sort());

    undoRedoManager.undo();
    expect([...projectStore.solver.domain.nodes.get('1')!.bcs]).toEqual([DofID.Ry]);
  });
});
