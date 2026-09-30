<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';
import { useViewerStore } from '@/store/viewer';
import { placingKey } from '@/types/placing';
import { vertical } from '@/utils/axisConvention';
import { useAppStore } from '@/store/app';
import { formatFeetInches, stepDecimals } from '@/utils/grid';

/**
 * Lines across the drawing through the point the pointer would place at, with that point's
 * coordinates marked on the rulers. It follows the snapped position, so it shows where a click
 * lands rather than where the pointer is.
 *
 * Drawn in screen space on its own layer above the drawing, and only for a mouse: touch and pen
 * have no hover, so there is no position to show between taps.
 */
const props = defineProps<{
  /** The drawing's svg, whose pointer events tell whether a mouse is over it. */
  target?: SVGSVGElement;
  /** The group the model is drawn in, which maps model units to the screen. */
  viewport?: SVGGElement;
  /** Whether the rulers are drawn, which the values are marked on. */
  rulers: boolean;
}>();

/** The width of the ruler bands, as SVGGrid.vue draws them. */
const RULER = 16;

const viewerStore = useViewerStore();
const appStore = useAppStore();
const placing = inject(placingKey)!;

const overlay = ref<SVGSVGElement | null>(null);

const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const mouseOver = ref(false);

const onPointerMove = (e: PointerEvent) => {
  mouseOver.value = e.pointerType === 'mouse';
};

const onPointerLeave = () => {
  mouseOver.value = false;
};

watch(
  () => props.target,
  (target, previous) => {
    previous?.removeEventListener('pointermove', onPointerMove);
    previous?.removeEventListener('pointerleave', onPointerLeave);
    target?.addEventListener('pointermove', onPointerMove);
    target?.addEventListener('pointerleave', onPointerLeave);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  props.target?.removeEventListener('pointermove', onPointerMove);
  props.target?.removeEventListener('pointerleave', onPointerLeave);
});

/** Bumped when the view pans or zooms, which moves the point on screen without moving the pointer. */
const viewChanged = ref(0);

const refresh = () => {
  viewChanged.value++;
};

defineExpose({ refresh });

const position = computed(() => {
  void viewChanged.value;

  if (!overlay.value || !props.viewport) return null;

  const matrix = props.viewport.getScreenCTM();
  if (!matrix) return null;

  const box = overlay.value.getBoundingClientRect();
  const p = new DOMPoint(placing.x.value, placing.y.value).matrixTransform(matrix);

  return { x: p.x - box.left, y: p.y - box.top, width: box.width, height: box.height };
});

/** Where the lines may go: inside the rulers when they are drawn, the whole layer otherwise. */
const frame = computed(() => {
  const p = position.value;
  if (!p) return null;

  const inset = props.rulers ? RULER : 0;
  const frame = { left: inset, top: inset, right: p.width - inset, bottom: p.height - inset };

  if (p.x < frame.left || p.x > frame.right || p.y < frame.top || p.y > frame.bottom) return null;

  return frame;
});

const visible = computed(() => viewerStore.showCrosshair && hasHover.matches && mouseOver.value && !!frame.value);

/** As many decimals as the snap step has, so a snapped value reads exactly; three when free. */
const decimals = computed(() =>
  viewerStore.snapToGrid ? stepDecimals(appStore.convertLength(viewerStore.gridStep)) : 3
);

const format = (value: number) => {
  const text = value.toFixed(decimals.value);

  // A value just below zero must not print as "-0.00".
  return Number(text) === 0 ? (0).toFixed(decimals.value) : text;
};

// In feet, as the rulers read: feet and inches
const label = (value: number) => (appStore.units.Length === 'ft' ? formatFeetInches(value) : format(value));

const xLabel = computed(() => label(appStore.convertLength(placing.x.value)));
const yLabel = computed(() => label(vertical(appStore.convertLength(placing.y.value))));

/** A tag wide enough for its text; the ruler font is 12 px, about 7 px a character. */
const tagWidth = (text: string) => text.length * 7 + 8;
</script>

<template>
  <svg ref="overlay" class="crosshair w-100 fill-height" aria-hidden="true">
    <g v-if="visible && position && frame">
      <line class="crosshair-line" :x1="frame.left" :x2="frame.right" :y1="position.y" :y2="position.y" />
      <line class="crosshair-line" :x1="position.x" :x2="position.x" :y1="frame.top" :y2="frame.bottom" />

      <template v-if="rulers">
        <g
          v-for="y in [RULER / 2, position.height - RULER / 2]"
          :key="`x${y}`"
          :transform="`translate(${position.x} ${y})`"
        >
          <rect
            class="crosshair-tag"
            :x="-tagWidth(xLabel) / 2"
            :y="-RULER / 2"
            :width="tagWidth(xLabel)"
            :height="RULER"
            rx="3"
          />
          <text text-anchor="middle" dy="0.35em">{{ xLabel }}</text>
        </g>
        <g
          v-for="[x, angle] in [
            [RULER / 2, -90],
            [position.width - RULER / 2, 90],
          ]"
          :key="`y${x}`"
          :transform="`translate(${x} ${position.y}) rotate(${angle})`"
        >
          <rect
            class="crosshair-tag"
            :x="-tagWidth(yLabel) / 2"
            :y="-RULER / 2"
            :width="tagWidth(yLabel)"
            :height="RULER"
            rx="3"
          />
          <text text-anchor="middle" dy="0.35em">{{ yLabel }}</text>
        </g>
      </template>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.crosshair {
  position: absolute;
  top: 0;
  left: 0;
  // Above the drawing (SVGPanZoom sits at 50) and below the controls over it (100).
  z-index: 60;
  pointer-events: none;
  font-size: 12px;
}

.crosshair-line {
  stroke: rgb(var(--v-theme-primary));
  stroke-opacity: 0.45;
  stroke-width: 1px;
  stroke-dasharray: 4 3;
  shape-rendering: crispEdges;
}

.crosshair-tag {
  fill: rgb(var(--v-theme-primary));
}

text {
  fill: rgb(var(--v-theme-on-primary));
}
</style>
