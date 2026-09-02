<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/app';
import { MouseMode } from '@/mouse';

/**
 * The rubber band of a window selection.
 *
 * Its own component because the pointer position it follows is written on every pointer report,
 * and the drawing is one component: read there, a drag would rebuild every node, element and load
 * for each report, all to move a rectangle. Read here, only the rectangle is rendered again.
 */
const appStore = useAppStore();

const box = computed(() => {
  if (appStore.mouseMode !== MouseMode.SELECTING) return null;

  const { x, y, sx, sy } = appStore.mouse;

  return {
    // The drawing does not start at the top of the window unless it is the whole page.
    top: Math.min(y, sy) - (appStore.inViewerMode ? 0 : 84),
    left: Math.min(x, sx),
    width: Math.abs(x - sx),
    height: Math.abs(y - sy),
  };
});
</script>

<template>
  <div
    v-if="box"
    class="selecting"
    :style="`left: ${box.left}px; top: ${box.top}px; width: ${box.width}px; height: ${box.height}px;`"
  ></div>
</template>
