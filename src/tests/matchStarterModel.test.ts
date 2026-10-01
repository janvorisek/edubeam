import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { buildStarterModel } from '@/utils/starterModel';
import { matchStarterModelToUnits } from '@/utils/matchStarterModel';

const FT = 0.3048;

const openWithStarter = (system: 'si' | 'us') => {
  const projectStore = useProjectStore();
  projectStore.solver = new LinearStaticSolver();
  projectStore.dimensions = [];
  buildStarterModel(projectStore.solver, projectStore.dimensions, system);
  return projectStore;
};

const span = () => useProjectStore().solver.domain.nodes.get('3')!.coords[0];

describe('the starter frame on the welcome screen', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('is redrawn in feet when US units are picked, and back in metres', () => {
    openWithStarter('si');

    expect(matchStarterModelToUnits('us')).toBe(true);
    expect(span()).toBeCloseTo(10 * FT, 12);
    expect(useProjectStore().dimensions).toHaveLength(1);
    // 3 ft below, in model units, whatever the zoom when it is redrawn
    expect(useProjectStore().dimensions[0]).toMatchObject({ distanceUnit: 'world' });
    expect(useProjectStore().dimensions[0].distance).toBeCloseTo(3 * FT, 12);

    expect(matchStarterModelToUnits('si')).toBe(true);
    expect(span()).toBe(3);
  });

  it('leaves a frame someone has changed alone', () => {
    const projectStore = openWithStarter('si');
    projectStore.solver.domain.nodes.get('3')!.coords[0] = 4;

    expect(matchStarterModelToUnits('us')).toBe(false);
    expect(span()).toBe(4);
  });

  it('leaves an empty canvas, or a model from a link, alone', () => {
    const projectStore = useProjectStore();
    projectStore.solver = new LinearStaticSolver();
    projectStore.dimensions = [];

    expect(matchStarterModelToUnits('us')).toBe(false);
    expect(projectStore.solver.domain.nodes.size).toBe(0);
  });
});
