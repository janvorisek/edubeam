import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';

/** Simply supported beam under a transverse load: bending and shear, but no normal force. */
const bendingOnlyBeam = () => {
  const projectStore = useProjectStore();
  const domain = projectStore.solver.domain;

  domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode(2, [4, 0, 0], [DofID.Dz]);
  domain.createMaterial(1, { e: 210000e6, g: 8.75e10, alpha: 12e-6, d: 4000 });
  domain.createCrossSection(1, { a: 1, iy: 8.356e-5, iz: 1, dyz: 999991, h: 1, k: 1e32, j: 99999 });
  domain.createBeam2D(1, [1, 2], 1, 1);
  projectStore.solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 1000], true);

  projectStore.solve();

  return projectStore;
};

describe('automatic result scaling', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('scales the quantities the model actually has', () => {
    const projectStore = bendingOnlyBeam();

    expect(projectStore.bendingMomentScale).toBeGreaterThan(0);
    expect(projectStore.shearForceScale).toBeGreaterThan(0);
    expect(projectStore.defoScale).toBeGreaterThan(0);
  });

  it('leaves a quantity that is zero unscaled, rather than magnifying its round-off', () => {
    const projectStore = bendingOnlyBeam();

    // 1 / 1e-32 would draw the numerical dust of the normal force at full height
    expect(projectStore.normalForceScale).toBe(0);
  });

  it('leaves an unsolved model unscaled', () => {
    const projectStore = useProjectStore();

    expect(projectStore.defoScale).toBe(1);
  });
});
