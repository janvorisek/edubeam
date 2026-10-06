import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { replaceModel } from '@/utils';
import { clearForFirstBeam } from './firstBeam';

/**
 * Starts the "draw your first beam" task on an empty model, from the welcome dialog or the menu.
 * Kept apart from firstBeam.ts so that stays free of the stores.
 */
export const startFirstBeam = () => {
  const projectStore = useProjectStore();

  // Undoable, so whatever model was here comes back with Ctrl+Z or from the recent structures.
  replaceModel('firstBeam', () => {
    clearForFirstBeam(projectStore.solver);
    projectStore.dimensions = [];
  });
  projectStore.clearSelection();
  projectStore.clearSelection2();

  // Opening the display options is one of the task's steps.
  useViewerStore().settingsOpen = false;
  useAppStore().firstBeamActive = true;
};
