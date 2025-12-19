<script lang="ts" setup>
import { Node } from 'ts-fem';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    nodes: Node[];
    scale: number;
    distance?: number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
    convertLength?: (value: number) => number;
    selected?: boolean;
    interactive?: boolean;
  }>(),
  {
    distance: 42,
    fontSize: 13,
    numberFormat: new Intl.NumberFormat(),
    convertLength: (value: number) => value,
    selected: false,
    interactive: true,
  }
);

const emit = defineEmits<{
  (event: 'dimensionpointerdown', payload: PointerEvent): void;
  (event: 'dimensionpointerup', payload: PointerEvent): void;
}>();

const pxToWorld = (px: number) => {
  const safeScale = Math.max(props.scale, 1e-6);
  return px / safeScale;
};

const LABEL_OFFSET_PX = 10;

const dimCoords = computed(() => {
  const n = normal.value;
  const dnx = -(props.distance * n[0]);
  const dny = -(props.distance * n[1]);

  const pts = props.distance < 0 ? [...props.nodes].reverse() : props.nodes;

  return pts.map((n) => `${n.coords[0] + dnx},${n.coords[2] + dny}`).join(' ');
});

const center = computed(() => {
  const n = normal.value;
  const labelOffsetWorld = pxToWorld(LABEL_OFFSET_PX);
  const dnx = -((props.distance - labelOffsetWorld) * n[0]);
  const dny = -((props.distance - labelOffsetWorld) * n[1]);

  return [
    (props.nodes[0].coords[0] + props.nodes[1].coords[0]) / 2 + dnx,
    (props.nodes[0].coords[2] + props.nodes[1].coords[2]) / 2 + dny,
  ];
});

const normal = computed(() => {
  const dx = props.nodes[1].coords[0] - props.nodes[0].coords[0];
  const dz = props.nodes[1].coords[2] - props.nodes[0].coords[2];
  const length = Math.sqrt(dx * dx + dz * dz);

  if (isNaN(length) || length === 0) return [0, 0];

  return [dz / length, -dx / length];
});

const dimensionLength = computed(() => {
  const dx = props.nodes[1].coords[0] - props.nodes[0].coords[0];
  const dz = props.nodes[1].coords[2] - props.nodes[0].coords[2];
  return Math.sqrt(dx * dx + dz * dz);
});

const angle = computed(() => {
  return (
    Math.atan2(
      props.nodes[1].coords[2] - props.nodes[0].coords[2],
      props.nodes[1].coords[0] - props.nodes[0].coords[0]
    ) *
    (180 / Math.PI)
  );
});

const convertedLength = computed(() => {
  return props.convertLength ? props.convertLength(dimensionLength.value) : dimensionLength.value;
});

const labelText = computed(() => {
  return props.numberFormat.format(convertedLength.value);
});

const handlePointerUp = (event: PointerEvent) => {
  if (!props.interactive) return;
  emit('dimensionpointerup', event);
};

const handlePointerDown = (event: PointerEvent) => {
  if (!props.interactive) return;
  emit('dimensionpointerdown', event);
};
</script>

<template>
  <g
    class="dimensioning"
    :class="{ selected: props.selected, 'dimensioning--interactive': props.interactive }"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
  >
    <polyline :points="dimCoords" class="marker-dimTip drawable" />
    <polyline
      v-if="props.interactive"
      :points="dimCoords"
      class="handle"
      stroke="none"
      :stroke-width="12"
      vector-effect="non-scaling-stroke"
    />
    <g :transform="`rotate(${angle} ${center[0]} ${center[1]})`">
      <text
        :x="center[0]"
        :y="center[1]"
        text-anchor="middle"
        dominant-baseline="middle"
        :font-size="props.fontSize / props.scale"
        pointer-events="visiblePainted"
      >
        {{ labelText }}
      </text>
    </g>
  </g>
</template>
