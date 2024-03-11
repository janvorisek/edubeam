/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "../store";
import { i18n } from "./i18n";
import VueDraggableResizable from "vue-draggable-resizable";

import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";
import ContextMenu from "@imengyu/vue3-context-menu";

import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();

  app.use(vuetify);
  app.use(pinia);
  app.use(i18n);
  app.use(ContextMenu);
  app.component("VueDraggableResizable", VueDraggableResizable);
  app.use(FloatingVue, {
    themes: {
      tooltip: {
        delay: {
          show: 100,
          hide: 0,
        },
      },
    },
  });
}
