<script lang="ts" setup>
import { Node } from "ts-fem";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    nodes: Node[];
    scale: number;
    distance?: number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
  }>(),
  {
    distance: 42,
    fontSize: 13,
    numberFormat: new Intl.NumberFormat(),
  }
);

const dimCoords = computed(() => {
  const n = normal.value;
  const dnx = -(props.distance * n[0]) / props.scale;
  const dny = -(props.distance * n[1]) / props.scale;
  return `${props.nodes[0].coords[0] + dnx},${props.nodes[0].coords[2] + dny} ${props.nodes[1].coords[0] + dnx},${props.nodes[1].coords[2] + dny}`;
});

const center = computed(() => {
  const n = normal.value;
  const dnx = -((props.distance - 4) * n[0]) / props.scale;
  const dny = -((props.distance - 4) * n[1]) / props.scale;

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

const length = computed(() => {
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
</script>

<template>
  <g class="dimensioning">
    <polyline :points="dimCoords" class="marker-dimTip" />
    <text
      :x="center[0]"
      :y="center[1]"
      :font-size="props.fontSize / props.scale"
      :transform="`rotate(${angle} ${center[0]} ${center[1]})`"
      >{{ numberFormat.format(length) }}</text
    >
  </g>
</template>
