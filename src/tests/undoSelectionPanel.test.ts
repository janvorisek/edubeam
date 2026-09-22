import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { executeModelMutationWithUndo, toggleSet, undoModelChange } from '@/utils';
import { undoRedoManager } from '@/CommandManager';

const openPanelOnNode = () => {
  setActivePinia(createPinia());
  undoRedoManager.clearHistory();

  const projectStore = useProjectStore();
  const solver = new LinearStaticSolver();
  solver.domain.createNode(1, [0, 0, 0], [DofID.Dx]);
  solver.domain.createNode(2, [3, 0, 0], []);
  projectStore.solver = solver;

  // What clicking a node leaves behind: the floating panel, plus the highlight.
  projectStore.selection.type = 'node';
  projectStore.selection.label = '1';
  projectStore.selection.x = 120;
  projectStore.selection.y = 80;
  projectStore.selection2.nodes = ['1'];

  return projectStore;
};

describe('the selection panel across undo', () => {
  beforeEach(() => undoRedoManager.clearHistory());

  it('stays open while the user edits from it', () => {
    const projectStore = openPanelOnNode();

    toggleSet(projectStore.solver.domain.nodes.get('1'), 'bcs', DofID.Dz);

    expect(projectStore.selection.type).toBe('node');
    expect(projectStore.selection.label).toBe('1');
  });

  it('closes on undo instead of reopening over the reverted model', () => {
    const projectStore = openPanelOnNode();

    toggleSet(projectStore.solver.domain.nodes.get('1'), 'bcs', DofID.Dz);
    expect(projectStore.solver.domain.nodes.get('1')!.bcs.has(DofID.Dz)).toBe(true);

    undoModelChange();

    expect(projectStore.solver.domain.nodes.get('1')!.bcs.has(DofID.Dz)).toBe(false);
    expect(projectStore.selection.type).toBeNull();
    expect(projectStore.selection.label).toBeNull();
  });

  it('still brings back what was highlighted', () => {
    const projectStore = openPanelOnNode();

    executeModelMutationWithUndo(() => {
      projectStore.solver.domain.createNode(3, [6, 0, 0], []);
      projectStore.solver.domain.nodes = new Map(projectStore.solver.domain.nodes);
    });

    projectStore.selection2.nodes = [];
    undoModelChange();

    expect(projectStore.selection2.nodes).toEqual(['1']);
  });
});
