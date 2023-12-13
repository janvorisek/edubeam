// Utilities
import { defineStore } from "pinia";
import { reactive, ref, markRaw, type Raw, type Ref, watch } from "vue";

import SVGViewer from "../components/SVGViewer.vue";
import Results from "../components//Results.vue";
import Settings from "../components//Settings.vue";
import { MouseMode } from "@/mouse";
import { setLocale } from "@/plugins/i18n";

export const useAppStore = defineStore(
  "app",
  () => {
    const drawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const locale = ref("en");

    watch(locale, (newLocale) => {
      setLocale(newLocale);
    });

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
      { title: "tabView.viewer", component: markRaw(SVGViewer), props: {}, closable: false },
      { title: "tabView.results", component: markRaw(Results), props: {}, closable: true },
      { title: "tabView.settings", component: markRaw(Settings), props: {}, closable: true },
    ]);

    const openSettings = () => {
      const si = tabs.value.findIndex((t) => t.title === "tabView.settings");

      // If settings already open, switch to it
      if (si !== -1) {
        tab.value = si;
        return;
      }

      tabs.value.push({ title: "tabView.settings", component: markRaw(Settings), props: {}, closable: true });
      tab.value = tabs.value.length - 1;
    };

    return {
      drawerOpen,
      rightDrawerOpen,
      locale,
      dialogs,
      zooming,
      tab,
      tabs,
      bottomBarTab,
      mouseMode,
      mouse,
      openSettings,
    };
  },
  { persist: { storage: localStorage, paths: ["locale", "tab"] } }
);
