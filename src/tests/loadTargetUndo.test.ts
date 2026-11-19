import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from '@edubeam/fem';
import { useProjectStore } from '@/store/project';
import { changeLoadTarget, redoModelChange, undoModelChange } from '@/utils';
import { undoRedoManager } from '@/CommandManager';

/**
 * The target column of the loads table wrote the new node or element straight into the load, so
 * Ctrl+Z skipped the change and took back whatever came before it.
 */
const build = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('2', [4, 0, 0], []);
  domain.createNode('3', [8, 0, 0], [DofID.Dz]);
  domain.createBeam2D('a', ['1', '2'], 'm', 'cs');
  domain.createBeam2D('b', ['2', '3'], 'm', 'cs');

  return store;
};

describe('changing the target of a load', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    undoRedoManager.clearHistory();
  });

  it('is undone and redone for a nodal load', () => {
    const store = build();
    store.solver.loadCases[0].createNodalLoad('2', { [DofID.Dz]: 10e3 });

    changeLoadTarget(store.solver.loadCases[0].nodalLoadList[0], '3');
    expect(store.solver.loadCases[0].nodalLoadList[0].target).toBe('3');

    undoModelChange();
    expect(store.solver.loadCases[0].nodalLoadList[0].target).toBe('2');

    redoModelChange();
    expect(store.solver.loadCases[0].nodalLoadList[0].target).toBe('3');
  });

  it('is undone for an element load', () => {
    const store = build();
    store.solver.loadCases[0].createBeamElementUniformEdgeLoad('a', [0, 5e3], true);

    changeLoadTarget(store.solver.loadCases[0].elementLoadList[0], 'b');
    expect(store.solver.loadCases[0].elementLoadList[0].target).toBe('b');

    undoModelChange();
    expect(store.solver.loadCases[0].elementLoadList[0].target).toBe('a');
  });

  it('leaves no undo step when the same target is picked again', () => {
    const store = build();
    store.solver.loadCases[0].createNodalLoad('2', { [DofID.Dz]: 10e3 });

    const execute = vi.spyOn(undoRedoManager, 'executeCommand');

    changeLoadTarget(store.solver.loadCases[0].nodalLoadList[0], '2');

    expect(execute).not.toHaveBeenCalled();
    execute.mockRestore();
  });
});
