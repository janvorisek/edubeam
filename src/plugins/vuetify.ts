/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';
import { i18n } from './i18n';
import { useI18n } from 'vue-i18n';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#111133',
          secondary: '#eee',
          // The header and the bottom bar's tabs
          appbar: '#111133',
          // Panels over the drawing and in the settings: Material's lightest greys
          panel: '#fafafa',
          'panel-variant': '#f5f5f5',
          'panel-strong': '#eeeeee',
        },
      },
      /*
       * The website's night theme (www.edubeam.app) held back: its navy as a tint of near-black rather
       * than a colour, so the diagrams carry the colour. The drawing's canvas is the darkest thing
       * (see DRAWING_PALETTES), the chrome a step above it with hairlines between, the panels and the
       * tables a step above that, and the brand's violet marks what is chosen.
       */
      dark: {
        dark: true,
        colors: {
          background: '#0b0e19',
          surface: '#131623',
          'surface-bright': '#191d2c',
          'surface-light': '#222738',
          // A step softer than white, as the website's body text: pure white glared
          'on-background': '#e4e6ec',
          'on-surface': '#e4e6ec',
          primary: '#6f73f2', // the website's --brand, a touch lighter for the dark
          'on-primary': '#ffffff',
          // The tab row and the toolbars, as the header
          secondary: '#11141f',
          'on-secondary': '#e4e6ec',
          error: '#ff6b6b',
          appbar: '#11141f',
          'on-appbar': '#e4e6ec',
          panel: '#191d2c',
          'panel-variant': '#161a28',
          'panel-strong': '#222738',
        },
        variables: {
          'border-color': '#cdd1db',
          'high-emphasis-opacity': 0.92,
          'medium-emphasis-opacity': 0.66,
        },
      },
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});
