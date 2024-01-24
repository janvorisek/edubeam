// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { VitePWA } from "vite-plugin-pwa";

import { resolve, dirname } from "node:path";
import packageJson from "./package.json";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/locales/**"),
      runtimeOnly: false,
      strictMessage: false,
    }),
    VitePWA({ registerType: "autoUpdate" }),
  ],
  define: {
    "process.env": {},
    APP_VERSION: JSON.stringify(packageJson.version),
    APP_RELEASED: JSON.stringify(new Date().toLocaleDateString("en")),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
  },
});
