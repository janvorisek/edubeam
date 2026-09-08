/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    // Needed by anything importing `@/plugins/i18n`, which bundles `src/locales/*.json`.
    VueI18nPlugin({
      include: resolve(__dirname, './src/locales/**'),
      runtimeOnly: false,
      strictMessage: false,
    }),
  ],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    // Vuetify components import their own CSS, which Vite has to transform for a test that mounts one.
    server: { deps: { inline: ['vuetify'] } },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // vite-plugin-pwa is not in this config, so its virtual modules do not exist here. A stub
      // lets the components that use them be mounted; a test that cares about the registration
      // mocks it with vi.mock.
      'virtual:pwa-register/vue': resolve(__dirname, './src/tests/stubs/pwa-register.ts'),
    },
  },
});
