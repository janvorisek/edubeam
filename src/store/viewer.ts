// Utilities
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useViewerStore = defineStore(
  "viewer",
  () => {
    const showSupports = ref(true);
    const showNodeLabels = ref(true);
    const showElementLabels = ref(true);

    const showLoads = ref(true);

    const showNormalForce = ref(false);
    const showShearForce = ref(false);
    const showBendingMoment = ref(true);
    const showDeformedShape = ref(true);
    const showReactions = ref(true);

    const colors = reactive({
      normalForce: "#2222ff", // used
      shearForce: "#00af00", // used
      bendingMoment: "#ff2222", // used
      deformedShape: "#555555", // used
      loads: "#ff8700", // used
      nodes: "#000000",
      elements: "#000000",
      reactions: "#a020f0", // used
    });

    const showGrid = ref(true);
    const snapToGrid = ref(true);
    const gridStep = ref(0.1);
    const resultsScalePx_ = ref(48);
    const supportSize = ref(1);

    const fontSize = ref(14);

    const settingsOpen = ref(true);

    return {
      colors,
      showNodeLabels,
      showLoads,
      showElementLabels,
      showSupports,
      showNormalForce,
      showShearForce,
      showBendingMoment,
      showDeformedShape,
      showReactions,

      showGrid,
      snapToGrid,
      gridStep,
      resultsScalePx_: resultsScalePx_,

      fontSize,

      supportSize,

      settingsOpen,
    };
  },
  { persist: true }
);
