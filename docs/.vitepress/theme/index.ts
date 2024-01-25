// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";

import Edubeam from "../../components/edubeam.vue"
import TrussElement from "../../components/TrussElement.vue";

import "./style.css";
import component from '../../../src/vite-env';

export default {
  extends: DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }) {
    app.component('Edubeam', Edubeam);
    app.component('TrussElement', TrussElement);
  },
} satisfies Theme;
