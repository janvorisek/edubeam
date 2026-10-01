import { useProjectStore } from '@/store/project';
import { isUntouchedStarterModel } from '@/store/recentStructures';
import { resetModel } from '@/utils';
import { buildStarterModel } from './starterModel';
import { serializeModel } from './serializeModel';
import type { UnitSystem } from './unitSystems';

/**
 * Redraws the starter frame in the round numbers of a newly chosen unit system, 3 m or 10 ft, so
 * someone picking US units on the welcome screen does not start from a 9.8425 ft frame. Anything
 * else on the canvas - a shared link, an edited frame - is left alone.
 *
 * Not an undo step: nothing the person drew changes, and undoing it would bring back the frame
 * of the units they just turned away from.
 */
export const matchStarterModelToUnits = (system: UnitSystem) => {
  const projectStore = useProjectStore();
  if (!isUntouchedStarterModel(serializeModel(projectStore.solver, projectStore.dimensions))) return false;

  resetModel();
  buildStarterModel(projectStore.solver, projectStore.dimensions, system);
  projectStore.solve();

  return true;
};
