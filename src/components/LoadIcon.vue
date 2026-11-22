<script setup lang="ts">
import type { ToolLoadKind } from '@/utils/toolTarget';

/** A small line drawing of a load, in the text colour, in the hand of SupportIcon. */
withDefaults(defineProps<{ type: ToolLoadKind; size?: number }>(), { size: 24 });
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- One arrow down onto a point -->
    <template v-if="type === 'force'">
      <line x1="12" y1="3" x2="12" y2="19" />
      <polyline points="7.5,14.5 12,19.5 16.5,14.5" />
      <line x1="5" y1="21.5" x2="19" y2="21.5" />
    </template>

    <!-- Three quarters of a circle round the node, turning counter-clockwise as the drawing shows a
         positive moment, a filled head at its end -->
    <template v-else-if="type === 'moment'">
      <path d="M5 13 A7 7 0 1 0 12.5 6" />
      <path d="M8.5 6 L12.75 3 L12.75 9 Z" fill="currentColor" stroke-width="1" />
      <circle cx="12" cy="13" r="1.25" fill="currentColor" />
    </template>

    <!-- Arrows growing along the member under a sloping line -->
    <template v-else-if="type === 'trapezoidal'">
      <line x1="3" y1="15" x2="21" y2="4" />
      <line x1="2" y1="20.5" x2="22" y2="20.5" />
      <template
        v-for="[x, top] in [
          [5, 13.8],
          [12, 9.5],
          [19, 5.2],
        ]"
        :key="x"
      >
        <line :x1="x" :y1="top" :x2="x" y2="17.5" />
        <polyline :points="`${x - 2.5},14.5 ${x},17.5 ${x + 2.5},14.5`" />
      </template>
    </template>

    <!-- A thermometer over the member -->
    <template v-else-if="type === 'temperature'">
      <path d="M10 13.5 V5 a2 2 0 0 1 4 0 V13.5 a3.5 3.5 0 1 1 -4 0 Z" />
      <circle cx="12" cy="16.25" r="1.5" fill="currentColor" />
      <line x1="12" y1="8" x2="12" y2="14.5" />
      <line x1="2" y1="21.5" x2="22" y2="21.5" />
    </template>

    <!-- A row of arrows under one line -->
    <template v-else>
      <line x1="3" y1="5" x2="21" y2="5" />
      <template v-for="x in [5, 12, 19]" :key="x">
        <line :x1="x" y1="5" :x2="x" y2="17" />
        <polyline :points="`${x - 2.5},14 ${x},17.5 ${x + 2.5},14`" />
      </template>
      <line x1="2" y1="20.5" x2="22" y2="20.5" />
    </template>
  </svg>
</template>
