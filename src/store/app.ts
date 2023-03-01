// Utilities
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppStore = defineStore("app", () => {
  const dialogs = reactive({
    addNode: false,
    addElement: false,
    addNodalLoad: false,
    addElementLoad: false,
  });

  return { dialogs };
});
