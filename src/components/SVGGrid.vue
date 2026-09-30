<template>
  <g>
    <g class="grid">
      <rect class="chartBorder" x="16" y="16" width="100%" height="100%" />
      <path
        stroke="#ccc"
        vector-effect="non-scaling-stroke"
        :d="gridPath"
        :transform="`translate(${gridTX} ${gridTY})`"
      />
    </g>

    <g class="grid">
      <rect fill="white" x="0" y="0" height="100%" width="16" />
      <rect fill="white" x="100%" y="0" height="100%" width="16" transform="translate(-16 0)" />
      <rect fill="white" x="0" y="0" width="100%" height="16" />
      <rect fill="white" x="0" y="100%" width="100%" height="16" transform="translate(0 -16)" />
      <g v-for="(item, i) in xGridTexts" :key="`x${i}`" :transform="`translate(${item.x + gridTX} ${item.y})`">
        <text text-anchor="middle" dy="0.35em">
          {{ rulerLabel(appStore.convertLength(Number(item.value) + trueOffsetX)) }}
        </text>
      </g>
      <g v-for="(item, i) in yGridTexts" :key="`y${i}`" :transform="`translate(${item.x} ${item.y + gridTY})`">
        <text text-anchor="middle" dy="0.35em" :transform="`rotate(${item.angle})`">
          {{ rulerLabel(vertical(appStore.convertLength(Number(item.value) + trueOffsetY))) }}
        </text>
      </g>
    </g>
    <g v-if="!props.viewMode && axisConvention === 'y-up'" class="cs" :transform="`translate(${csLeft} ${csTop})`">
      <text fill="red" text-anchor="middle" dy="0.35em" x="40" y="-10"> x </text>
      <text fill="green" text-anchor="middle" dy="0.35em" x="10" y="-40"> y </text>
      <line y1="0" x1="0" y2="-40" x2="0" stroke-width="3" stroke="green" stroke-linecap="round" />
      <line y1="0" x1="0" y2="0" x2="40" stroke-width="3" stroke="red" stroke-linecap="round" />
    </g>
    <g v-else-if="!props.viewMode" class="cs" :transform="`translate(${csLeft} ${csTop})`">
      <text fill="red" text-anchor="middle" dy="0.35em" x="40" y="-30"> x </text>
      <text fill="green" text-anchor="middle" dy="0.35em" x="10" y="0"> z </text>
      <line y1="-40" x1="0" y2="0" x2="0" stroke-width="3" stroke="green" stroke-linecap="round" />
      <line y1="-40" x1="0" y2="-40" x2="40" stroke-width="3" stroke="red" stroke-linecap="round" />
    </g>
  </g>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { axisConvention, vertical } from '@/utils/axisConvention';
import { useAppStore } from '@/store/app';
import { formatFeetInches, rulerStep, rulerStepFeet, stepDecimals } from '@/utils/grid';

const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    svg: SVGSVGElement;
    viewport: SVGGElement;
    zoom: number;
    viewMode?: boolean;
  }>(),
  {
    viewMode: false,
  }
);

const gridPath = ref('');
const xGridTexts = ref<{ x: number; y: number; value: number }[]>([]);
const yGridTexts = ref<{ x: number; y: number; value: number; angle: number }[]>([]);
const gridTX = ref(0);
const gridTY = ref(0);
const trueOffsetX = ref(0);
const trueOffsetY = ref(0);
const csLeft = ref(0);
const csTop = ref(0);
const decimals = ref(2);

/** Feet read in feet and inches, as on a US drawing; every other unit as a decimal. */
const inFeet = () => appStore.units.Length === 'ft';
const rulerLabel = (value: number) => (inFeet() ? formatFeetInches(value) : value.toFixed(decimals.value));

const refreshGrid = (isZooming = false) => {
  if (props.viewport === undefined) return;
  const matrix = props.viewport.getCTM() as DOMMatrix;

  const leftTop = props.svg.createSVGPoint();
  leftTop.x = 0;
  leftTop.y = 0;

  const rightBottom = props.svg.createSVGPoint();
  const svgBB = props.svg.getBoundingClientRect();

  rightBottom.x = svgBB.right - svgBB.left;
  rightBottom.y = svgBB.bottom - svgBB.top;

  csLeft.value = 45;
  csTop.value = svgBB.bottom - svgBB.top - 45;

  const inv = matrix.inverse();
  const svgP1 = leftTop.matrixTransform(inv);
  const svgP2 = rightBottom.matrixTransform(inv);

  const realW = rightBottom.x - leftTop.x;
  const realH = rightBottom.y - leftTop.y;
  const w = svgP2.x - svgP1.x;
  const h = svgP2.y - svgP1.y;
  const tickCount = Math.floor(realW / 40);
  const nWpx = w / (tickCount - 1); //(rightBottom.x - leftTop.x) / 20;
  // The step is round in the unit the rulers are read in, then drawn in model metres
  const minStep = appStore.convertLength(nWpx);
  const stepDisplay = inFeet() ? rulerStepFeet(minStep) : rulerStep(minStep);
  const stepW = appStore.convertInverseLength(stepDisplay);
  decimals.value = stepDecimals(stepDisplay);

  trueOffsetX.value = Math.floor(svgP1.x / stepW) * stepW;
  trueOffsetY.value = Math.floor(svgP1.y / stepW) * stepW;

  const offsetX = svgP1.x - Math.floor(svgP1.x / stepW) * stepW; //Math.floor(svgP1.x / stepW) * stepW;
  const offsetY = svgP1.y - Math.floor(svgP1.y / stepW) * stepW; //Math.floor(svgP1.y / stepW) * stepW;

  const gridZoomW = realW / w;
  const gridZoomH = realH / h;

  gridTX.value = props.zoom * -offsetX;
  gridTY.value = props.zoom * -offsetY;

  // const stepPx = stepW * gridZoomW;

  const tickCountY = Math.ceil(h / stepW) + 1;

  if (!isZooming) return;

  let path = '';

  const _xGridTexts = [];
  const _yGridTexts = [];

  for (let i = 0; i < tickCount; i++) {
    const v = i * stepW;
    const x1 = gridZoomW * v;
    const y1 = -gridTY.value;
    const x2 = x1; //stepW;
    const y2 = rightBottom.y - leftTop.y - gridTY.value;

    path += `M ${x1},${y1 - 1000} L ${x2},${1000 + y2} `;

    _xGridTexts.push({
      x: x1,
      y: 10,
      value: v,
    });

    _xGridTexts.push({
      x: x1,
      y: rightBottom.y - leftTop.y - 8,
      value: v,
    });
  }

  for (let i = 0; i < tickCountY; i++) {
    const v = i * stepW;
    const x1 = -1000 - gridTX.value;
    const y1 = gridZoomH * (i * stepW);
    const x2 = 1000 + rightBottom.x - leftTop.x - gridTX.value;
    const y2 = y1; //stepW;

    path += `M ${x1},${y1} L ${x2},${y2} `;

    _yGridTexts.push({
      x: 10,
      y: y1,
      value: v,
      angle: -90.0,
    });

    _yGridTexts.push({
      x: rightBottom.x - leftTop.x - 12,
      y: y1,
      value: v,
      angle: 90,
    });
  }

  xGridTexts.value = _xGridTexts;
  yGridTexts.value = _yGridTexts;

  gridPath.value = path;
};

// The rulers are laid out in the length unit, so another unit is another layout
watch(
  () => appStore.units.Length,
  () => refreshGrid(true)
);

defineExpose({ refreshGrid });
</script>

<style lang="scss" scoped>
.grid {
  font-size: 12px;

  path {
    //transition: all 0.1s linear;
    shape-rendering: crispEdges;
  }

  .chartBorder {
    fill: transparent;
    stroke: #666;
    stroke-width: 1px;
  }
}
</style>
