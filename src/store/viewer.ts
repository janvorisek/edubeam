// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";

export const useViewerStore = defineStore(
  "viewer",
  () => {
    const showSupports = ref(true);
    const showNodeLabels = ref(true);
    const showElementLabels = ref(true);

    const showLoads = ref(true);

    const showNormalForce = ref(false);
    const showShearForce = ref(false);
    const showBendingMoment = ref(false);
    const showDeformedShape = ref(true);

    const showGrid = ref(true);
    const snapToGrid = ref(true);
    const gridStep = ref(0.1);
    const resultsScalePx = ref(128);

    const settingsOpen = ref(true);

    return {
      showNodeLabels,
      showLoads,
      showElementLabels,
      showSupports,
      showNormalForce,
      showShearForce,
      showBendingMoment,
      showDeformedShape,

      showGrid,
      snapToGrid,
      gridStep,
      resultsScalePx,

      settingsOpen,
    };
  },
  { persist: true }
);
