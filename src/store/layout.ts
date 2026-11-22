import { defineStore } from 'pinia';
import { Component, Raw, Ref, markRaw, ref } from 'vue';

/** What a widget is opened with: its place, and what it shows (an element's or a node's label) */
export interface WidgetProps {
  x: number;
  y: number;
  label?: string | number;
  node?: string;
}

export interface Widget {
  id: string;
  title: string;
  component: Raw<Component>;
  props: WidgetProps;
  closable: boolean;
}

export const useLayoutStore = defineStore(
  'layout',
  () => {
    const widgets: Ref<Widget[]> = ref([]);

    const removeWidget = (id: string) => {
      const index = widgets.value.findIndex((widget) => widget.id === id);
      if (index !== -1) {
        widgets.value.splice(index, 1);
      }
    };

    const openWidget = (title: string, component: Component, shows: Omit<WidgetProps, 'x' | 'y'>, closable = true) => {
      const id = new Date().getTime().toString();
      // Each one a step down and right of the last, so none hides another
      const step = 12 * widgets.value.length;
      const props: WidgetProps = { ...shows, x: 32 + step, y: 64 + step };

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
