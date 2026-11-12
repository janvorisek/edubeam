<script setup lang="ts">
import type { Beam2D } from 'ts-fem';
import { computed } from 'vue';

/**
 * The invisible, wide hit stroke along an element. Drawn in a layer of its own above every diagram:
 * inside the element's drawing it sat under the diagrams of the members drawn after it, so a column's
 * moment diagram took the hover and the clicks meant for the beam it overlaps.
 */
const props = defineProps<{ element: Beam2D }>();

const emit = defineEmits<{
  elementmousemove: [event: MouseEvent];
  elementpointerup: [event: PointerEvent];
}>();

// The model is x-right, z-down, the same as the SVG.
const points = computed(() =>
  props.element.nodes
    .map((label) => props.element.domain.nodes.get(label)!.coords)
    .map((coords) => `${coords[0]},${coords[2]}`)
    .join(' ')
);
</script>

<template>
  <g class="element element-1d">
    <polyline
      :points="points"
      vector-effect="non-scaling-stroke"
      class="handle"
      :data-element-id="element.label"
      @mousemove="emit('elementmousemove', $event)"
      @pointerup="emit('elementpointerup', $event)"
    />
  </g>
</template>
