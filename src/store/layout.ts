import { defineStore } from 'pinia';
import { Component, Raw, Ref, markRaw, ref } from 'vue';

import SVGElementViewer from '@/components/SVGElementViewer.vue';

export const useLayoutStore = defineStore(
  'layout',
  () => {
    const widgets: Ref<
      {
        id: string;
        title: string;
        component: Raw<Component>;
        props: unknown;
        closable: boolean;
      }[]
    > = ref([]);

    const removeWidget = (id: string) => {
      const index = widgets.value.findIndex((widget) => widget.id === id);
      if (index !== -1) {
        widgets.value.splice(index, 1);
      }
    };

    const openWidget = (title: string, component: Component, props: unknown, closable = true) => {
      const id = new Date().getTime().toString();

      props.x = 32;
      props.y = 64;

      if (widgets.value.length > 0) {
        props.x += 12 * widgets.value.length;
        props.y += 12 * widgets.value.length;
      }

      widgets.value.push({ id, title, component: markRaw(component), props, closable });
      return id;
    };

    const bottomBarResultsTab = ref<'nodes' | 'elements'>('nodes');

    return {
      widgets,
      openWidget,
      removeWidget,
      bottomBarResultsTab,
    };
  },
  {
    persist: {
      pick: [],
    },
  }
);
