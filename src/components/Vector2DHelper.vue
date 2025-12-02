<script setup lang="ts">
import { useAppStore } from '../store/app';
import { computed } from 'vue';
import { useViewerStore } from '../store/viewer';

const props = defineProps<{
  fx: number;
  fz: number;
  my: number;
}>();

const appStore = useAppStore();
const viewerStore = useViewerStore();

const WIDTH = 160;
const HEIGHT = 160;

const loadNodeValueFxInUnits = computed(() => {
  return appStore.convertForce(props.fx);
});

const loadNodeValueFzInUnits = computed(() => {
  return appStore.convertForce(props.fz);
});

const loadNodeValueMyInUnits = computed(() => {
  return appStore.convertMoment(props.my);
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

const center2 = computed(() => {
  let y = loadNodeValueFxInUnits.value / flen.value;
  let x = -(loadNodeValueFzInUnits.value / flen.value);

  if (props.fx < 0) {
    x *= -1;
    y *= -1;
  }

  if (props.fz < 0) {
    x *= -2 / 10;
    y *= -2 / 10;
  }

  return { x: center.value.x + x * 10, y: center.value.y + y * 10 };
});

const vbox = computed(() => {
  if (props.fx === 0 && props.fz === 0) {
    return `0 0 ${WIDTH} ${HEIGHT}`;
  }

  return `${center.value.x - 60} ${center.value.y - 60} ${WIDTH - 40} ${HEIGHT - 40}`;
});

const angle = computed(() => {
  return (Math.atan2(props.fz, props.fx) * 180) / Math.PI;
});
</script>

<template>
  <svg width="160" height="160" :viewBox="vbox" xmlns="http://www.w3.org/2000/svg">
    <g v-if="props.fx !== 0 || props.fz !== 0">
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
          <polygon points="3 1, 10 3.5, 3 6" vector-effect="non-scaling-stroke" fill="black" />
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

      <g v-if="Math.abs(props.my) > 1e-32">
        <polyline
          points="0,0 0,0"
          :marker-end="`url(${props.my > 0 ? '#moment_ccw' : '#moment_cw'})`"
          fill="none"
          :transform="`translate(${end.x} ${end.y})`"
        />
        <text
          :x="end.x"
          :y="end.y + (props.fz < 0 ? -5 : 7)"
          :fill="viewerStore.colors.loads"
          font-size="10"
          :text-anchor="'middle'"
          alignment-baseline="middle"
        >
          {{ Math.abs(loadNodeValueMyInUnits).toFixed(2) }}
        </text>
      </g>

      <text
        v-if="Math.abs(props.fx) > 1e-6 && Math.abs(props.fz) > 1e-6"
        :x="end.x / 2"
        :y="props.fz < 0 ? 5 : -5"
        fill="red"
        font-size="10"
        text-anchor="middle"
        alignment-baseline="middle"
      >
        {{ Math.abs(loadNodeValueFxInUnits).toFixed(2) }}
      </text>
      <text
        v-if="Math.abs(props.fx) > 1e-6 && Math.abs(props.fz) > 1e-6"
        :x="props.fx < 0 ? end.x - 3 : end.x + 3"
        :y="end.y / 2"
        fill="blue"
        font-size="10"
        :text-anchor="props.fx < 0 ? 'end' : 'start'"
        alignment-baseline="middle"
      >
        {{ Math.abs(loadNodeValueFzInUnits).toFixed(2) }}
      </text>
      <g>
        <text
          :x="center2.x"
          :y="center2.y"
          fill="black"
          font-size="10"
          text-anchor="middle"
          :transform="`rotate(${props.fx < 0 ? 180 + angle : angle}, ${center2.x}, ${center2.y})`"
        >
          {{ flen.toFixed(2) }}
        </text>
      </g>
    </g>
  </svg>
</template>
