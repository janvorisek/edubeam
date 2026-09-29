<script setup lang="ts">
import type { SupportType } from '@/utils/supports';

/** A small line drawing of a support, in the text colour, drawn the way the viewer draws it. */
withDefaults(defineProps<{ type: SupportType; size?: number }>(), { size: 24 });
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
    <!-- A faded, dashed pin: no support here. A bare circle would read as a hinge. -->
    <polygon v-if="type === 'free'" points="12,6 5,16 19,16" stroke-dasharray="2 2" opacity="0.6" />

    <template v-else-if="type === 'pin' || type === 'roller'">
      <polygon points="12,6 5,16 19,16" />
      <line v-if="type === 'roller'" x1="4" y1="19.5" x2="20" y2="19.5" />
    </template>

    <template v-else-if="type === 'verticalRoller'">
      <polygon points="6,12 16,5 16,19" />
      <line x1="19.5" y1="4" x2="19.5" y2="20" />
    </template>

    <template v-else-if="type === 'slider'">
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="16" x2="21" y2="16" />
      <line v-for="i in 5" :key="`t${i}`" :x1="2.25 + i * 3.75" y1="8" :x2="i * 3.75 - 0.75" y2="4" />
      <line v-for="i in 5" :key="`b${i}`" :x1="2.25 + i * 3.75" y1="16" :x2="i * 3.75 - 0.75" y2="20" />
    </template>

    <template v-else-if="type === 'verticalSlider'">
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <line x1="8" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="16" y2="21" />
      <line v-for="i in 5" :key="`l${i}`" x1="8" :y1="2.25 + i * 3.75" x2="4" :y2="i * 3.75 - 0.75" />
      <line v-for="i in 5" :key="`r${i}`" x1="16" :y1="2.25 + i * 3.75" x2="20" :y2="i * 3.75 - 0.75" />
    </template>

    <!-- A cross-shaped slot: the node can move either way but not turn -->
    <template v-else-if="type === 'rotation'">
      <path d="M3 9.5 H9.5 V3 M14.5 3 V9.5 H21 M21 14.5 H14.5 V21 M9.5 21 V14.5 H3" />
      <!-- Three thin ticks per corner, kept clear of the slot so they don't fill in at 18px -->
      <g
        v-for="mirror in ['', 'matrix(-1 0 0 1 24 0)', 'matrix(1 0 0 -1 0 24)', 'matrix(-1 0 0 -1 24 24)']"
        :key="mirror"
        :transform="mirror"
        stroke-width="0.75"
      >
        <line x1="7.25" y1="8.25" x2="8.25" y2="7.25" />
        <line x1="4.75" y1="8.25" x2="8.25" y2="4.75" />
        <line x1="3.5" y1="7" x2="7" y2="3.5" />
      </g>
    </template>

    <template v-else-if="type === 'fixed'">
      <line x1="12" y1="4" x2="12" y2="14" stroke-width="2" />
      <line x1="4" y1="14" x2="20" y2="14" stroke-width="2" />
      <line v-for="i in 4" :key="i" :x1="3 + i * 4" y1="14" :x2="i * 4" y2="19" />
    </template>
  </svg>
</template>
