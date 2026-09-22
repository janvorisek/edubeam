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
/*
 * Where the app is served from.
 *
 * The release has a domain to itself, so everything can be absolute from the root. A copy under a
 * path - a university server, a preview build - has to say so, or every absolute URL points at the
 * root of that host instead of at the app: the assets, the manifest, the service worker and the
 * scope it registers with. An installed copy then opens the host's root rather than the app, and
 * the worker never finds the one it is meant to replace.
 *
 *   VITE_BASE=/edubeam/ npm run build
 */
const base = process.env.VITE_BASE ?? '/';

export default defineConfig({
  base,
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
        // Both follow the base: an installed app opens where the app actually is.
        start_url: base,
        scope: base,
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
    /*
     * Generated for Sentry, but not pointed at from the bundle.
     *
     * The maps are uploaded during the build and then deleted, so nothing serves them - while every
     * chunk still ended with a `sourceMappingURL` comment naming one. A browser with developer
     * tools open asks for it, the SPA fallback answers a missing file with index.html, and the tool
     * reports a source map that begins with "<" and is not JSON.
     *
     * "hidden" writes the maps for the upload and leaves the comment out, which is what the two
     * halves of that want: Sentry can still name a line of the source, and no one else goes looking
     * for a file that was never meant to be public.
     */
    sourcemap: 'hidden',
  },
});
