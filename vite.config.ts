import { sentryVitePlugin } from "@sentry/vite-plugin";
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
import { execSync } from "child_process";

const commitDate = execSync("git log -1 --format=%cI").toString().trimEnd();
const commitHash = execSync("git rev-parse HEAD").toString().trimEnd();

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
      include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/locales/**"),
      runtimeOnly: false,
      strictMessage: false,
    }),
    VitePWA({
      mode: "development",
      //registerType: "autoUpdate",
      injectRegister: "script",
      manifest: {
        name: "edubeam",
        short_name: "edubeam",
        description:
          "Explore 2D structural analysis directly in your web browser – tailored for students and educators alike. Solve beam and truss structures.",
        theme_color: "#111133",
      },
    }),
    sentryVitePlugin({
      org: "ctu-prague",
      project: "edubeam-app",
    }),
  ],

  define: {
    "process.env": {},
    APP_VERSION: JSON.stringify(packageJson.version),
    APP_RELEASED: JSON.stringify(commitDate),
    APP_COMMIT: JSON.stringify(commitHash),
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

  build: {
    sourcemap: true,
  },
});
