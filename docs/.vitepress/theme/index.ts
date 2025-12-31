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
import ExamplesGallery from '../../components/ExamplesGallery.vue';
import FeatureStructures from '../../components/FeatureStructures.vue';
import LoadShowcase from '../../components/LoadShowcase.vue';

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
    app.component('ExamplesGallery', ExamplesGallery);
    app.component('FeatureStructures', FeatureStructures);
    app.component('LoadShowcase', LoadShowcase);
  },
} satisfies Theme;
