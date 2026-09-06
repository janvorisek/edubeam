import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { changeLabel } from '@/utils';

/**
 * A node is referenced by label, so renaming one has to re-point everything that names it. Elements
 * and nodal forces were re-pointed; prescribed displacements were not, and a load left pointing at
 * a node that no longer exists is one the drawing cannot place - it threw on `target.coords`.
 *
 * It surfaced late because a rotation-only prescribed displacement used to draw nothing at all.
 */
const build = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;

  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e-3 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  domain.createNode('2', [4, 0, 0], [DofID.Dz]);
  domain.createBeam2D('b', ['1', '2'], 'm', 'cs');

  return store;
};

/** `changeLabel` reads the new name off the input the table edited. */
const rename = (store: ReturnType<typeof useProjectStore>, from: string, to: string) => {
  const node = store.solver.domain.nodes.get(from)!;

  changeLabel('nodes', node, { value: to } as HTMLInputElement);
};

describe('renaming a node', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('carries a prescribed displacement over to the new name', () => {
    const store = build();
    store.solver.loadCases[0].createPrescribedDisplacement('2', { [DofID.Dz]: 0.002 });

    rename(store, '2', 'support');

    const bc = store.solver.loadCases[0].prescribedBC[0];

    expect(bc.target).toBe('support');
    expect(store.solver.domain.nodes.get(bc.target)).toBeDefined();
  });

  it('carries a nodal force over as well', () => {
    const store = build();
    store.solver.loadCases[0].createNodalLoad('2', { [DofID.Dz]: -1000 });

    rename(store, '2', 'B');

    expect(store.solver.loadCases[0].nodalLoadList[0].target).toBe('B');
  });

  it('leaves no load pointing at a node that is gone', () => {
    const store = build();
    store.solver.loadCases[0].createNodalLoad('2', { [DofID.Dz]: -1000 });
    store.solver.loadCases[0].createPrescribedDisplacement('1', { [DofID.Dx]: 0.001 });

    rename(store, '1', 'A');
    rename(store, '2', 'B');

    const { nodalLoadList, prescribedBC } = store.solver.loadCases[0];
    const nodes = store.solver.domain.nodes;

    for (const load of [...nodalLoadList, ...prescribedBC]) {
      expect(nodes.get(load.target), `load left pointing at "${load.target}"`).toBeDefined();
    }
  });

  it('still re-points the elements', () => {
    const store = build();

    rename(store, '1', 'A');

    expect(store.solver.domain.getElement('b').nodes).toContain('A');
  });
});
