<script lang="ts" setup>
import { NodalLoad } from "ts-fem";
import { computed } from "vue";

const props = defineProps<{
  nload: NodalLoad;
  scale: number;
  convertForce: (f: number) => number;
}>();

const target = computed(() => {
  return props.nload.domain.nodes.get(props.nload.target)!;
});

const angle = computed(() => {
  return -(Math.atan2(props.nload.values[0], props.nload.values[2]) * 180) / Math.PI;
});

const nloadPts = computed(() => {
  const size = Math.sqrt(
    props.nload.values[0]! * props.nload.values[0]! + props.nload.values[2]! * props.nload.values[2]!
  );
  const sx = -props.nload.values[0]! / size;
  const sz = -props.nload.values[2]! / size;

  return `${props.nload.domain.nodes.get(props.nload.target)!.coords[0]},${props.nload.domain.nodes.get(props.nload.target)!.coords[2]} ${
    props.nload.domain.nodes.get(props.nload.target)!.coords[0] + (sx * 40) / props.scale
  },${props.nload.domain.nodes.get(props.nload.target)!.coords[2] + (sz * 40) / props.scale}`;
});

const targetCoords = computed(() => {
  return `${target.value.coords[0]},${target.value.coords[2]} ${target.value.coords[0]},${target.value.coords[2]}`;
});
</script>

<template>
  <g class="nodal-load">
    <polyline
      v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
      points="0,0 0,0"
      vector-effect="non-scaling-stroke"
      class="decoration force"
      :transform="`translate(${target.coords[0]} ${target.coords[2]}) rotate(${angle})`"
    />

    <polyline
      v-if="nload.values[4] !== 0"
      points="0,0 0,0"
      vector-effect="non-scaling-stroke"
      class="decoration moment"
      :class="{ cw: nload.values[4] < 0, ccw: nload.values[4] > 0 }"
      :transform="`translate(${target.coords[0]}
              ${target.coords[2]})`"
    />

    <polyline :points="nloadPts" class="handle" />
    <polyline :points="targetCoords" class="handle moment" />

    <text
      v-if="nload.values[4] !== 0"
      :font-size="13 / scale"
      font-weight="normal"
      text-anchor="start"
      dominant-baseline="central"
      :transform="`translate(${target.coords[0] + 15 / scale}
              ${target.coords[2] - 15 / scale})`"
    >
      {{ Math.abs(convertForce(nload.values[4])).toFixed(2) }}
    </text>

    <text
      v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
      :font-size="13 / scale"
      font-weight="normal"
      :text-anchor="nload.values[0] > 0 ? 'end' : 'start'"
      dominant-baseline="central"
      :transform="`translate(${
        target.coords[0] -
        (40 * nload.values[0]) /
          Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
          scale
      }
              ${
                target.coords[2] -
                (40 * nload.values[2]) /
                  Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
                  scale
              })`"
    >
      {{ convertForce(Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2])).toFixed(2) }}
      <template v-if="nload.values[0] !== 0 && nload.values[2] !== 0">
        ({{ convertForce(nload.values[0]).toFixed(2) }}, {{ convertForce(nload.values[2]).toFixed(2) }})
      </template>
    </text>
  </g>
</template>
