<script setup lang="ts">
import { computed, inject } from 'vue';
import { windowDragKey, windowPickBox } from '@/types/windowPick';

/**
 * The window being picked for an image export, drawn in model units inside the drawing.
 *
 * Its own component for the same reason as the selection box: the drag is written on every
 * pointer report of the gesture, and the drawing is one component, so reading it there would
 * rebuild every node, element and load for each report. The drag arrives as the ref itself, so
 * the drawing hands it over without ever reading it.
 */
const drag = inject(windowDragKey);

const rect = computed(() => windowPickBox(drag?.value ?? null));
</script>

<template>
  <rect
    v-if="rect"
    :x="rect.x"
    :y="rect.y"
    :width="rect.w"
    :height="rect.h"
    class="window-pick"
    vector-effect="non-scaling-stroke"
    pointer-events="none"
  />
</template>

<style lang="scss" scoped>
.window-pick {
  fill: rgba(25, 118, 210, 0.12);
  stroke: #1976d2;
  stroke-width: 1.5px;
  stroke-dasharray: 6 3;
}
</style>
