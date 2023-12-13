// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Google Analytics
import VueGtag from "vue-gtag";

// Plugins
import { registerPlugins } from "@/plugins";

import "./assets/main.scss";

const app = createApp(App);

app.config.globalProperties.window = window;

if (import.meta.env.PROD) {
  app.use(VueGtag, {
    config: { id: "G-RFM73PGN79" },
  });
}

registerPlugins(app);

app.mount("#app");
