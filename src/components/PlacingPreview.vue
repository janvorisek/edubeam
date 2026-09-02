<script setup lang="ts">
import { inject } from 'vue';
import { useAppStore } from '@/store/app';
import { MouseMode } from '@/mouse';
import { placingKey } from '@/types/placing';

/**
 * What a placing mode shows under the pointer: the square that marks where the next node lands,
 * and the rubber line back to the end already placed.
 *
 * Its own component because the pointer position it follows is written on every pointer report,
 * and the drawing is one component: read there, every node, element and load would be rebuilt for
 * each report, all to move a square and a line. Read here, only the preview is drawn again.
 */
defineProps<{ scale: number }>();

const appStore = useAppStore();
const placing = inject(placingKey)!;
</script>

<template>
  <g
    v-if="
      appStore.mouseMode === MouseMode.ADD_NODE ||
      appStore.mouseMode === MouseMode.ADD_ELEMENT ||
      appStore.mouseMode === MouseMode.ADD_DIMLINE
    "
  >
    <rect
      :x="placing.x.value"
      :y="placing.y.value"
      :width="8 / scale"
      :height="8 / scale"
      :transform="`translate(${-8 / 2 / scale},${-8 / 2 / scale})`"
      style="fill: #aaa"
    />
  </g>
  <g
    v-if="
      (appStore.mouseMode === MouseMode.ADD_ELEMENT || appStore.mouseMode === MouseMode.PASTE_CLIPBOARD) &&
      placing.startNode.value !== null
    "
  >
    <line
      :x1="placing.startNode.value.x"
      :y1="placing.startNode.value.y"
      :x2="placing.x.value"
      :y2="placing.y.value"
      :stroke-dasharray="placing.snappedToNode.value ? `none` : `5 4`"
      style="vector-effect: non-scaling-stroke; stroke-width: 2px; stroke: #aaa"
    />
  </g>
</template>
