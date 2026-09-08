import { sentryVitePlugin } from '@sentry/vite-plugin';
// Plugins
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { VitePWA } from 'vite-plugin-pwa';

import { resolve, dirname } from 'node:path';
import packageJson from './package.json';

// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { execSync } from 'child_process';

const commitDate = execSync('git log -1 --format=%cI').toString().trimEnd();
const commitHash = execSync('git rev-parse HEAD').toString().trimEnd();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }), // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      runtimeOnly: false,
      strictMessage: false,
    }),
    VitePWA({
      /*
       * The update prompt owns the registration.
       *
       * `injectRegister: 'script'` used to emit registerSW.js and register the worker from
       * index.html, while ReloadPrompt registered it a second time through workbox-window. The
       * update button then messaged a registration that was not the one holding the waiting
       * worker, so SKIP_WAITING never arrived, `controllerchange` never fired, and the spinner
       * ran forever - a hard reload was the only way out. One registration, and it is the one the
       * prompt can talk to.
       */
      injectRegister: null,
      workbox: {
        // The app bundle is a single chunk slightly over workbox's 2 MiB default; without
        // this it would be dropped from the precache and the app would stop working offline.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      manifest: {
        name: 'edubeam',
        short_name: 'edubeam',
        description:
          'Explore 2D structural analysis directly in your web browser – tailored for students and educators alike. Solve beam and truss structures.',
        theme_color: '#111133',
        background_color: '#111133',
        // Installed, it opens in its own window with no address bar - the drawing needs the height.
        display: 'standalone',
        start_url: '/',
        scope: '/',
        /*
         * Without these a browser will not treat the app as installable: it offers a plain
         * shortcut instead, which opens in a tab and keeps the address bar whatever the manifest
         * asks for. The maskable one is padded to the safe zone so Android can crop it to
         * whatever shape the launcher uses without eating the mark.
         */
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
    sentryVitePlugin({
      org: 'ctu-prague',
      project: 'edubeam-app',
    }),
  ],

  define: {
    'process.env': {},
    APP_VERSION: JSON.stringify(packageJson.version),
    APP_RELEASED: JSON.stringify(commitDate),
    APP_COMMIT: JSON.stringify(commitHash),
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },

  server: {
    port: 3000,
  },

  build: {
    sourcemap: true,
  },
});
