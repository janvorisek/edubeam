<script lang="ts" setup>
import { computed } from 'vue';
import SVGViewerDefs from '../SVGViewerDefs.vue';
import { supportMarker } from '@/SVGUtils';
import { Node } from 'ts-fem';

const props = defineProps<{
  angle: number;
  node: Node;
}>();

const end = computed(() => {
  const x = 30 * Math.cos((props.angle * Math.PI) / 180);
  const y = 30 * Math.sin((props.angle * Math.PI) / 180) - 40;
  return { x, y };
});

const flag = computed(() => (props.angle > 0 ? 1 : 0));
</script>

<template>
  <svg viewBox="-45 -90 90 100">
    <SVGViewerDefs id="nodeEditDialog" />
    <g class="cs">
      <text fill="red" text-anchor="middle" alignment-baseline="middle" x="40" y="-30">x</text>
      <text fill="green" text-anchor="middle" alignment-baseline="middle" x="10" y="0">z</text>
      <line y1="-40" x1="0" y2="0" x2="0" stroke-width="3" stroke="green" stroke-linecap="round" />
      <line y1="-40" x1="0" y2="-40" x2="40" stroke-width="3" stroke="red" stroke-linecap="round" />

      <g :transform="`rotate(${props.angle} 0 -40)`">
        <line y1="-40" x1="0" y2="0" x2="0" stroke-width="2" stroke="green" stroke-dasharray="4,2" />
        <line y1="-40" x1="0" y2="-40" x2="40" stroke-width="2" stroke="red" stroke-dasharray="4,2" />
      </g>

      <polyline
        :points="`0,-80 10 -80`"
        :marker-start="supportMarker(props.node)"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        :transform="`rotate(${props.angle} 0 -40)`"
      />

      <path
        v-if="props.angle >= -180 && props.angle <= 180"
        :d="`M 30 -40 A 30 30 0 0 ${flag} ${end.x} ${end.y}`"
        fill="none"
        stroke="#444 "
        stroke-width="2"
      />
    </g>
  </svg>
</template>
