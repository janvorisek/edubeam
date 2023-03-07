// Utilities
import { defineStore } from "pinia";
import { reactive, ref, markRaw, type Raw, type Ref } from "vue";

import SVGViewer from "../components/SVGViewer.vue";
import Results from "../components//Results.vue";
import Settings from "../components//Settings.vue";
import { MouseMode } from "@/mouse";

export const useAppStore = defineStore("app", () => {
  const dialogs = reactive({
    addNode: false,
    addElement: false,
    addNodalLoad: false,
    addElementLoad: false,
    addMaterial: false,
    addCrossSection: false,
  });

  const zooming = ref(false);

  const tab = ref(null);
  const bottomBarTab = ref(null);

  const mouseMode = ref<MouseMode>(MouseMode.NONE);
  const mouse = ref({ x: 0, y: 0 });

  const tabs: Ref<
    {
      title: string;
      component: any;
      props: unknown;
      closable: boolean;
    }[]
  > = ref([
    { title: "Viewer", component: markRaw(SVGViewer), props: {}, closable: false },
    /*{ title: "Results", component: Results, props: {}, closable: true },
    { title: "Settings", component: Settings, props: {}, closable: true },*/
  ]);

  return { dialogs, zooming, tab, tabs, bottomBarTab, mouseMode, mouse };
});
