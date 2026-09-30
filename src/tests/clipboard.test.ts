import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { useClipboardStore } from '@/store/clipboard';
import { deleteNode } from '@/utils';

/**
 * The clipboard used to keep labels and load-list indices into the live model. Deleting anything
 * between copy and paste then either threw (`reading 'nodes'`, `reading 'coords'`) or pasted a
 * different load, because the indices had shifted.
 */
const build = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  domain.createNode('2', [4, 0, 0], []);
  domain.createNode('3', [8, 0, 0], []);
  domain.createBeam2D('a', ['1', '2'], 'm', 'cs');
  domain.createBeam2D('b', ['2', '3'], 'm', 'cs');

  return store;
};

const select = (patch: Partial<ReturnType<typeof useProjectStore>['selection2']>) => ({
  nodes: [],
  elements: [],
  nodalLoads: [],
  elementLoads: [],
  prescribedBC: [],
  dimensions: [],
  ...patch,
});

describe('clipboard', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('drops a copied node that was deleted before the paste', () => {
    const store = build();
    const clipboard = useClipboardStore();

    clipboard.select(select({ nodes: ['2', '3'] }));
    deleteNode('3', false);

    expect(clipboard.nodes).toEqual(['2']);
    expect(clipboard.midpoint()).toEqual([4, 0, 0]);

    clipboard.paste({ x: 0, z: 1 });

    expect(store.solver.domain.nodes.size).toBe(3);
  });

  it('pastes the load that was copied, even after an earlier one is deleted', () => {
    const store = build();
    const loads = store.solver.loadCases[0];
    loads.createNodalLoad('2', { [DofID.Dz]: 1000 });
    loads.createNodalLoad('3', { [DofID.Dz]: 2000 });

    const clipboard = useClipboardStore();
    clipboard.select(select({ nodes: ['3'], nodalLoads: [1] }));
    loads.nodalLoadList.splice(0, 1);

    clipboard.paste({ x: 0, z: 1 });

    const pasted = loads.nodalLoadList.at(-1);
    expect(pasted.target).not.toBe('3');
    expect(pasted.values[DofID.Dz]).toBe(2000);
  });

  it('keeps pasted elements connected at a node they share', () => {
    const store = build();
    const clipboard = useClipboardStore();

    clipboard.select(select({ elements: ['a', 'b'] }));
    clipboard.paste({ x: 0, z: 1 });

    // Three new nodes for the two pasted elements, not four.
    expect(store.solver.domain.nodes.size).toBe(6);
    expect(store.solver.domain.elements.size).toBe(4);
  });

  it('has nothing to paste once everything copied is gone', () => {
    build();
    const clipboard = useClipboardStore();

    clipboard.select(select({ nodes: ['3'] }));
    deleteNode('3', false);

    expect(clipboard.isAnythingInClipboard()).toBe(false);
  });
});
