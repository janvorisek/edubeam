<script lang="ts" setup>
import { BeamConcentratedLoad } from "ts-fem";
import { computed } from "vue";

const props = defineProps<{
  eload: BeamConcentratedLoad;
  scale: number;
  convertForce: (f: number) => number;
}>();

const target = computed(() => {
  return props.eload.domain.elements.get(props.eload.target)!;
});

const position = computed(() => {
  const n1 = props.eload.domain.nodes.get(target.value.nodes[0])!;
  const geo = target.value.computeGeo();

  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  return {
    x: n1.coords[0] + cos * props.eload.values[3],
    z: n1.coords[2] + sin * props.eload.values[3],
  };
});

const angle = computed(() => {
  const geo = target.value.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  if (props.eload.lcs)
    return -((Math.atan2(props.eload.values[0], props.eload.values[1]) + Math.atan2(cos, sin)) * 180) / Math.PI + 90;
  else return -(Math.atan2(props.eload.values[0], props.eload.values[1]) * 180) / Math.PI;
});

const eloadPts = computed(() => {
  const size = Math.sqrt(
    props.eload.values[0]! * props.eload.values[0]! + props.eload.values[1]! * props.eload.values[1]!
  );
  const sx = -props.eload.values[0]! / size;
  const sz = -props.eload.values[1]! / size;

  return `${position.value.x},${position.value.z} ${position.value.x + (sx * 40) / props.scale},${position.value.z + (sz * 40) / props.scale}`;
});
</script>

<template>
  <g class="nodal-load">
    <polyline
      v-if="eload.values[0] !== 0 || eload.values[1] !== 0"
      points="0,0 0,0"
      vector-effect="non-scaling-stroke"
      class="decoration force"
      :transform="`translate(${position.x} ${position.z}) rotate(${angle})`"
    />

    <polyline :points="eloadPts" class="handle" />

    <text
      v-if="eload.values[0] !== 0 || eload.values[1] !== 0"
      :font-size="13 / scale"
      font-weight="normal"
      :text-anchor="eload.values[0] > 0 ? 'end' : 'start'"
      dominant-baseline="central"
      :transform="`translate(${
        position.x -
        (40 * eload.values[0]) /
          Math.sqrt(eload.values[0] * eload.values[0] + eload.values[1] * eload.values[1]) /
          scale
      }
              ${
                position.z -
                (40 * eload.values[1]) /
                  Math.sqrt(eload.values[0] * eload.values[0] + eload.values[1] * eload.values[1]) /
                  scale
              })`"
    >
      {{ convertForce(Math.sqrt(eload.values[0] * eload.values[0] + eload.values[1] * eload.values[1])).toFixed(2) }}
      <template v-if="eload.values[0] !== 0 && eload.values[1] !== 0">
        ({{ convertForce(eload.values[0]).toFixed(2) }}, {{ convertForce(eload.values[1]).toFixed(2) }})
      </template>
    </text>
  </g>
</template>
