<script setup lang="ts">
import { useAppStore } from '../store/app';
import { computed, useId } from 'vue';
import { formatScientificNumber } from '../utils';

const props = withDefaults(
  defineProps<{
    fx: number;
    fz: number;
    my: number;
    /** `force` previews Fx/Fz/My, `displacement` previews the dashed Dx/Dz/Ry of a prescribed displacement. */
    type?: 'force' | 'displacement';
  }>(),
  {
    type: 'force',
  }
);

const appStore = useAppStore();

const uid = useId();
const arrowheadId = computed(() => `${uid}-arrowhead`);

const WIDTH = 160;
const HEIGHT = 160;

/** Radius of the moment / rotation arc, in view units. */
const ARC_RADIUS = 20;

const isDisplacement = computed(() => props.type === 'displacement');

const convertMain = (value: number) =>
  isDisplacement.value ? appStore.convertLength(value) : appStore.convertForce(value);

/** A prescribed rotation is stored and shown in radians, a moment in the selected moment unit. */
const convertRotational = (value: number) => (isDisplacement.value ? value : appStore.convertMoment(value));

const formatValue = (value: number) => (isDisplacement.value ? formatScientificNumber(value, 2) : value.toFixed(2));

const loadNodeValueFxInUnits = computed(() => convertMain(props.fx));

const loadNodeValueFzInUnits = computed(() => convertMain(props.fz));

const loadNodeValueMyInUnits = computed(() => convertRotational(props.my));

const hasVector = computed(() => props.fx !== 0 || props.fz !== 0);

const hasRotational = computed(() => Math.abs(props.my) > 1e-32);

/** Kept tight next to the node when an arrow shares the drawing, so the two do not overlap. */
const arcRadius = computed(() => (hasVector.value ? 14 : ARC_RADIUS));

const flen = computed(() => convertMain(Math.sqrt(props.fx ** 2 + props.fz ** 2)));

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

/** Frame whatever is actually drawn - the arrow, the arc, or both - instead of a fixed window. */
const vbox = computed(() => {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  if (hasVector.value) {
    minX = Math.min(minX, end.value.x);
    maxX = Math.max(maxX, end.value.x);
    minY = Math.min(minY, end.value.y);
    maxY = Math.max(maxY, end.value.y);
  }

  if (hasRotational.value) {
    minX = Math.min(minX, -arcRadius.value);
    maxX = Math.max(maxX, arcRadius.value);
    // The rotation value sits above the arc.
    minY = Math.min(minY, -arcRadius.value - 16);
    maxY = Math.max(maxY, arcRadius.value);
  }

  // Room for the value labels hanging off the geometry.
  const padding = 26;
  minX -= padding;
  maxX += padding;
  minY -= padding;
  maxY += padding;

  const size = Math.max(maxX - minX, maxY - minY, 80);

  return `${(minX + maxX) / 2 - size / 2} ${(minY + maxY) / 2 - size / 2} ${size} ${size}`;
});

const angle = computed(() => {
  return (Math.atan2(props.fz, props.fx) * 180) / Math.PI;
});

/**
 * Three quarters of a circle around the node, left open at the bottom so the value fits there.
 * The y axis points down, so a positive sweep flag draws clockwise on screen.
 */
const arcPath = computed(() => {
  const ccw = props.my > 0;
  const startDeg = ccw ? 45 : 135;
  const endDeg = ccw ? startDeg - 270 : startDeg + 270;

  const point = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${(arcRadius.value * Math.cos(rad)).toFixed(3)} ${(arcRadius.value * Math.sin(rad)).toFixed(3)}`;
  };

  return `M ${point(startDeg)} A ${arcRadius.value} ${arcRadius.value} 0 1 ${ccw ? 0 : 1} ${point(endDeg)}`;
});

/** Prescribed displacements are drawn dashed, matching how the drawing renders them. */
const strokeDash = computed(() => (isDisplacement.value ? '4 3' : undefined));
</script>

<template>
  <svg width="160" height="160" :viewBox="vbox" xmlns="http://www.w3.org/2000/svg">
    <!-- Arrowhead marker definition -->
    <defs>
      <marker
        :id="arrowheadId"
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

    <g v-if="hasVector">
      <!-- Arrow -->
      <line
        x1="0"
        y1="0"
        :x2="end.x"
        :y2="end.y"
        stroke="black"
        stroke-width="2"
        :stroke-dasharray="strokeDash"
        vector-effect="non-scaling-stroke"
        :marker-end="`url(#${arrowheadId})`"
      />

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
        v-if="Math.abs(props.fx) > 1e-6 && Math.abs(props.fz) > 1e-6"
        :x="end.x / 2"
        :y="props.fz < 0 ? 5 : -5"
        fill="red"
        font-size="10"
        text-anchor="middle"
        alignment-baseline="middle"
      >
        {{ formatValue(Math.abs(loadNodeValueFxInUnits)) }}
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
        {{ formatValue(Math.abs(loadNodeValueFzInUnits)) }}
      </text>
      <text
        :x="center2.x"
        :y="center2.y"
        fill="black"
        font-size="10"
        text-anchor="middle"
        :transform="`rotate(${props.fx < 0 ? 180 + angle : angle}, ${center2.x}, ${center2.y})`"
      >
        {{ formatValue(flen) }}
      </text>
    </g>

    <!-- Moment / prescribed rotation, drawn about the node itself -->
    <g v-if="hasRotational">
      <path
        :d="arcPath"
        fill="none"
        stroke="black"
        stroke-width="2"
        :stroke-dasharray="strokeDash"
        vector-effect="non-scaling-stroke"
        :marker-end="`url(#${arrowheadId})`"
      />
      <text x="0" :y="-arcRadius - 10" fill="black" font-size="10" text-anchor="middle" alignment-baseline="middle">
        {{ formatValue(Math.abs(loadNodeValueMyInUnits)) }}
      </text>
    </g>
  </svg>
</template>
