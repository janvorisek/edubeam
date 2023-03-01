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

    return {
      showNodeLabels,
      showLoads,
      showElementLabels,
      showSupports,
      showNormalForce,
      showShearForce,
      showBendingMoment,
      showDeformedShape,
    };
  },
  { persist: true }
);
