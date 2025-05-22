// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import MyLayout from './MyLayout.vue';

import Edubeam from '../../components/edubeam.vue';
import TrussElement from '../../components/TrussElement.vue';
import Structure from '../../components/Structure.vue';
import ExampleStructure from '../../components/ExampleStructure.vue';
import WelcomeStructure from '../../components/WelcomeStructure.vue';

import './style.css';

export default {
  extends: DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }) {
    app.component('Edubeam', Edubeam);
    app.component('TrussElement', TrussElement);
    app.component('Structure', Structure);
    app.component('WelcomeStructure', WelcomeStructure);
    app.component('ExampleStructure', ExampleStructure);
  },
} satisfies Theme;
