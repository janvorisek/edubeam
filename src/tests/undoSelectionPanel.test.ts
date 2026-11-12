import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import {
  executeModelMutationWithUndo,
  redoModelChange,
  replaceModel,
  resetModel,
  toggleSet,
  undoModelChange,
} from '@/utils';
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

describe('the selection after the model changes under it', () => {
  // The panel listing the selection looks each item up; one that is gone crashed it (EDUBEAM-APP-FP).
  const selectBeam = () => {
    setActivePinia(createPinia());
    undoRedoManager.clearHistory();

    const projectStore = useProjectStore();
    const solver = new LinearStaticSolver();
    const domain = solver.domain;
    domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
    domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
    domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode('2', [4, 0, 0], [DofID.Dz]);
    domain.createBeam2D('1', ['1', '2'], 'm', 'cs');
    projectStore.solver = solver;
    projectStore.selection2.nodes = ['1', '2'];
    projectStore.selection2.elements = ['1'];

    return projectStore;
  };

  const exists = (projectStore: ReturnType<typeof useProjectStore>) => {
    const { domain } = projectStore.solver;
    return (
      projectStore.selection2.nodes.every((label) => domain.nodes.has(label)) &&
      projectStore.selection2.elements.every((label) => domain.elements.has(label))
    );
  };

  it('lets go of everything when the model is cleared, also after undo and redo', () => {
    const projectStore = selectBeam();

    replaceModel('clear', () => resetModel());
    expect(projectStore.selection2.elements).toEqual([]);
    expect(projectStore.selection2.nodes).toEqual([]);

    undoModelChange();
    expect(projectStore.solver.domain.elements.size).toBe(1);
    expect(projectStore.selection2.elements).toEqual(['1']);

    redoModelChange();
    expect(projectStore.solver.domain.elements.size).toBe(0);
    expect(projectStore.selection2.elements).toEqual([]);
  });

  it('keeps only what is left after an edit removes part of it', () => {
    const projectStore = selectBeam();

    executeModelMutationWithUndo(() => projectStore.solver.domain.elements.delete('1'));

    expect(projectStore.selection2.elements).toEqual([]);
    expect(projectStore.selection2.nodes).toEqual(['1', '2']);
    expect(exists(projectStore)).toBe(true);
  });
});
