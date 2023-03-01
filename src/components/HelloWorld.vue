<template>
  <div class="d-flex flex-column">
    <div>
      <div class="" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
        <v-tabs v-model="tab" height="36" bg-color="secondary">
          <v-tab v-for="item in tabs" :key="item.title">
            {{ item.title }}
            <v-icon small class="ml-1" v-if="item.closable"> mdi-close </v-icon>
          </v-tab>
        </v-tabs>
      </div>
    </div>
    <v-window v-model="tab" class="fill-height">
      <v-window-item
        v-for="item in tabs"
        :key="item.title"
        class="fill-height"
        :transition="false"
        @touchstart.prevent.stop
      >
        <keep-alive>
          <component :is="item.component" />
        </keep-alive>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import SVGViewer from "./SVGViewer.vue";
import Results from "./Results.vue";
import Settings from "./Settings.vue";

const tab = ref(null);

const tabs = [
  { title: "Viewer", component: SVGViewer, closable: false },
  { title: "Results", component: Results, closable: true },
  { title: "Settings", component: Settings, closable: true },
];
</script>
