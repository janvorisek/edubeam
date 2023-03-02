// Utilities
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const dialogs = reactive({
    addNode: false,
    addElement: false,
    addNodalLoad: false,
    addElementLoad: false,
  });

  const zooming = ref(false);

  return { dialogs, zooming };
});
