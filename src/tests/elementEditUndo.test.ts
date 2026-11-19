import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { Beam2D, DofID } from '@edubeam/fem';
import { useProjectStore } from '@/store/project';
import { changeElementNode, changeElementProperty, redoModelChange, swapNodes, undoModelChange } from '@/utils';
import { undoRedoManager } from '@/CommandManager';

/**
 * The elements table wrote a new node, material or cross section straight into the element, so
 * Ctrl+Z skipped the change, or took it back only as part of whatever came before it.
 */
const build = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createMaterial('m2', { e: 70e9, g: 26e9, alpha: 2.3e-5, d: 2700 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
  domain.createCrossSection('cs2', { a: 2e-2, iy: 2e-5, h: 0.3, k: 1e32 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('2', [4, 0, 0], []);
  domain.createNode('3', [8, 0, 0], [DofID.Dz]);
  domain.createBeam2D('a', ['1', '2'], 'm', 'cs');
  domain.createBeam2D('b', ['2', '3'], 'm', 'cs');

  return store;
};

const element = (label: string) => {
  const el = useProjectStore().solver.domain.elements.get(label);
  if (!el) throw new Error(`No element ${label}`);
  return el;
};

describe('editing an element in the elements table', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    undoRedoManager.clearHistory();
  });

  it('undoes and redoes a new cross section', () => {
    build();
    changeElementProperty(element('a'), 'cs', 'cs2');
    expect(element('a').cs).toBe('cs2');

    undoModelChange();
    expect(element('a').cs).toBe('cs');

    redoModelChange();
    expect(element('a').cs).toBe('cs2');
  });

  it('undoes a new material', () => {
    build();
    changeElementProperty(element('b'), 'mat', 'm2');
    expect(element('b').mat).toBe('m2');

    undoModelChange();
    expect(element('b').mat).toBe('m');
  });

  it('undoes a new end node', () => {
    build();
    changeElementNode(element('b'), 1, '1');
    expect(element('b').nodes).toEqual(['2', '1']);

    undoModelChange();
    expect(element('b').nodes).toEqual(['2', '3']);
  });

  it('undoes swapping the nodes', () => {
    build();
    const a = element('a');
    if (!(a instanceof Beam2D)) throw new Error('Element a is not a beam');
    swapNodes(a);
    expect(element('a').nodes).toEqual(['2', '1']);

    undoModelChange();
    expect(element('a').nodes).toEqual(['1', '2']);
  });

  it('takes back only its own step when an earlier edit was recorded', () => {
    build();
    changeElementProperty(element('a'), 'mat', 'm2');
    changeElementProperty(element('a'), 'cs', 'cs2');

    undoModelChange();
    expect(element('a').cs).toBe('cs');
    expect(element('a').mat).toBe('m2');
  });

  it('leaves no undo step when the same value is picked again', () => {
    build();
    const execute = vi.spyOn(undoRedoManager, 'executeCommand');

    changeElementProperty(element('a'), 'cs', 'cs');
    changeElementNode(element('a'), 0, '1');

    expect(execute).not.toHaveBeenCalled();
    execute.mockRestore();
  });
});
