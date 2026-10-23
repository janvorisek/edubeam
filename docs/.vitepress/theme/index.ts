// https://vitepress.dev/guide/custom-theme
import { defineAsyncComponent } from 'vue';
import type { Theme } from 'vitepress';
// Without fonts: the docs set Barlow as the base font, so VitePress's Inter would only be downloaded.
import DefaultTheme from 'vitepress/theme-without-fonts';
import MyLayout from './MyLayout.vue';

import './style.css';

// Async, so the solver and app i18n they pull in load only on the pages that use them,
// not with the theme on every page.
const components = {
  TrussElement: () => import('../../components/TrussElement.vue'),
  Structure: () => import('../../components/Structure.vue'),
  ExampleStructure: () => import('../../components/ExampleStructure.vue'),
  FeatureStructures: () => import('../../components/FeatureStructures.vue'),
  LoadShowcase: () => import('../../components/LoadShowcase.vue'),
  ElementariumPromo: () => import('../../components/ElementariumPromo.vue'),
};

export default {
  extends: DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout: MyLayout,
  enhanceApp({ app }) {
    for (const [name, load] of Object.entries(components)) {
      app.component(name, defineAsyncComponent(load));
    }
  },
} satisfies Theme;
