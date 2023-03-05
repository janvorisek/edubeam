<template>
  <div class="d-flex flex-column">
    <div>
      <div class="" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12)">
        <v-tabs v-model="appStore.tab" height="36" bg-color="secondary">
          <v-tab v-for="(item, index) in appStore.tabs" :key="item.title" :class="{ 'pr-0': item.closable }">
            {{ item.title }}
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="text"
              @click.prevent.stop="
                appStore.tab = 0;
                appStore.tabs.splice(index, 1);
              "
              small
              class="ml-1"
              v-if="item.closable"
            />
          </v-tab>
        </v-tabs>
      </div>
    </div>
    <v-window
      v-model="appStore.tab"
      class="fill-height"
      :style="`${projStore.selection.type !== null ? 'overflow: visible !important;' : ''}`"
    >
      <v-window-item
        v-for="item in appStore.tabs"
        :key="item.title"
        class="fill-height overflow-hidden"
        :transition="false"
        :reverse-transition="false"
        @touchstart.stop
      >
        <keep-alive>
          <component :is="item.component" v-bind="item.props" />
        </keep-alive>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "../store/app";
import { useProjectStore } from "../store/project";

const appStore = useAppStore();
const projStore = useProjectStore();
</script>
