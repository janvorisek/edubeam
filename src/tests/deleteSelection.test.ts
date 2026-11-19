import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from '@edubeam/fem';
import { useProjectStore } from '@/store/project';

/**
 * Two structures side by side, each with a nodal load: a window around the one on the left picks
 * up its nodes, its element and the load on it. Deleting that has to leave the right one alone -
 * the selected loads were deleted by index after the nodes had taken theirs with them, so the
 * index of the left load named the load on the right by then.
 */
const twoStructures = () => {
  const store = useProjectStore();
  const domain = store.solver.domain;
  const loadCase = store.solver.loadCases[0];

  domain.createMaterial('m', { e: 30e9, g: 12.5e9, alpha: 1.2e-5, d: 2500 });
  domain.createCrossSection('cs', { a: 0.06, iy: 4.5e-4, h: 0.3, k: 1e32 });
  domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  domain.createNode('2', [4, 0, 3]);
  domain.createNode('3', [6, 0, 1], [DofID.Dx, DofID.Dz, DofID.Ry]);
  domain.createNode('4', [10.5, 0, 1]);
  domain.createBeam2D('1', ['1', '2'], 'm', 'cs');
  domain.createBeam2D('2', ['3', '4'], 'm', 'cs');

  const left = loadCase.createNodalLoad('2', { [DofID.Dx]: 0, [DofID.Dz]: 5000, [DofID.Ry]: 0 });
  const right = loadCase.createNodalLoad('4', { [DofID.Dx]: -3000, [DofID.Dz]: 0, [DofID.Ry]: 0 });
  const onLeftBeam = loadCase.createBeamElementUniformEdgeLoad('1', [0, 1000], true);
  const onRightBeam = loadCase.createBeamElementUniformEdgeLoad('2', [0, 2000], true);

  return { store, loadCase, left, right, onLeftBeam, onRightBeam };
};

describe('deleting a selection', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('takes the loads it selected and leaves the others, whatever the nodes took first', () => {
    const { store, loadCase, right, onRightBeam } = twoStructures();

    store.selection2.nodes = ['1', '2'];
    store.selection2.elements = ['1'];
    store.selection2.nodalLoads = [0];
    store.selection2.elementLoads = [0];
    store.deleteSelection2();

    expect([...store.solver.domain.nodes.keys()]).toEqual(['3', '4']);
    expect(loadCase.nodalLoadList).toEqual([right]);
    expect(loadCase.elementLoadList).toEqual([onRightBeam]);
  });

  it('deletes a selected load on a node that stays', () => {
    const { store, loadCase, left } = twoStructures();

    store.selection2.nodalLoads = [1];
    store.deleteSelection2();

    expect(loadCase.nodalLoadList).toEqual([left]);
  });
});
