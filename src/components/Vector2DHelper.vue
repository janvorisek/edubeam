<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { computed } from "vue";

const props = defineProps<{
  fx: number;
  fz: number;
  my: number;
}>();

const appStore = useAppStore();

const WIDTH = 160;
const HEIGHT = 160;

const loadNodeValueFxInUnits = computed(() => {
  return appStore.convertForce(props.fx);
});

const loadNodeValueFzInUnits = computed(() => {
  return appStore.convertForce(props.fz);
});

const flen = computed(() => appStore.convertForce(Math.sqrt(props.fx ** 2 + props.fz ** 2)));

const end = computed(() => {
  const x = ((loadNodeValueFxInUnits.value / flen.value) * WIDTH) / 2;
  const y = ((loadNodeValueFzInUnits.value / flen.value) * HEIGHT) / 2;
  return { x, y };
});

const center = computed(() => {
  return { x: end.value.x / 2, y: end.value.y / 2 };
});

const vbox = computed(() => {
  return `${center.value.x - 60} ${center.value.y - 60} ${WIDTH - 40} ${HEIGHT - 40}`;
});

const angle = computed(() => {
  return Math.atan2(props.fz, props.fx);
});
</script>

<template>
  <svg width="160" height="160" :viewBox="vbox" xmlns="http://www.w3.org/2000/svg">
    <!-- Arrow -->
    <line
      x1="0"
      y1="0"
      :x2="end.x"
      :y2="end.y"
      stroke="black"
      stroke-width="2"
      vector-effect="non-scaling-stroke"
      marker-end="url(#arrowhead)"
    />

    <!-- Arrowhead marker definition -->
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        markerUnits="strokeWidth"
        refX="10"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" vector-effect="non-scaling-stroke" fill="black" />
      </marker>
    </defs>

    <!-- Decomposition lines -->
    <line
      v-if="Math.abs(props.fx) > 1e-6 && Math.abs(props.fz) > 1e-6"
      x1="0"
      y1="0"
      :x2="end.x"
      y2="0"
      stroke="red"
      stroke-width="1"
      stroke-dasharray="5"
      vector-effect="non-scaling-stroke"
    />
    <line
      v-if="Math.abs(props.fz) > 1e-6 && Math.abs(props.fx) > 1e-6"
      :x1="end.x"
      y1="0"
      :x2="end.x"
      :y2="end.y"
      stroke="blue"
      stroke-width="1"
      stroke-dasharray="5"
      vector-effect="non-scaling-stroke"
    />

    <text
      v-if="Math.abs(props.fx) > 1e-6"
      :x="end.x / 2"
      :y="props.fz < 0 ? 10 : -10"
      fill="red"
      font-size="10"
      text-anchor="middle"
      alignment-baseline="middle"
    >
      {{ Math.abs(loadNodeValueFxInUnits) }}
    </text>
    <text
      v-if="Math.abs(props.fz) > 1e-6"
      :x="props.fx < 0 ? end.x - 5 : end.x + 5"
      :y="end.y / 2"
      fill="blue"
      font-size="10"
      :text-anchor="props.fx < 0 ? 'end' : 'start'"
      alignment-baseline="middle"
    >
      {{ Math.abs(loadNodeValueFzInUnits) }}
    </text>
    <g>
      <text
        :x="center.x"
        :y="center.y"
        fill="black"
        font-size="10"
        text-anchor="middle"
        alignment-baseline="baseline"
        :transform="`rotate(${(angle * 180) / Math.PI}, ${center.x}, ${center.y})`"
      >
        {{ flen.toFixed(2) }}
      </text>
    </g>
  </svg>
</template>
