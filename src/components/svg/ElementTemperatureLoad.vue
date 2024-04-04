<script lang="ts" setup>
import { Node, Beam2D, BeamTemperatureLoad } from "ts-fem";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    eload: BeamTemperatureLoad;
    scale: number;
    padding?: number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
  }>(),
  { padding: 10, fontSize: 13, numberFormat: new Intl.NumberFormat() }
);

const target = computed(() => props.eload.domain.elements.get(props.eload.target) as Beam2D);
const n1 = computed(() => props.eload.domain.nodes.get(target.value.nodes[0]) as Node);
const n2 = computed(() => props.eload.domain.nodes.get(target.value.nodes[1]) as Node);

const elementAngle = computed(() => {
  const geo = target.value.computeGeo();
  return Math.atan2(geo.dz, geo.dx) * (180 / Math.PI);
});

const elementLabel = computed(() => {
  const geo = target.value.computeGeo();
  const ny = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  return `translate(${(props.padding * nx) / props.scale}, ${(props.padding * ny) / props.scale})`;
});
</script>

<template>
  <g class="element-load load-1d">
    <text
      :x="(n1.coords[0] + n2.coords[0]) / 2"
      :y="(n1.coords[2] + n2.coords[2]) / 2"
      :font-size="14 / scale"
      font-weight="normal"
      text-anchor="middle"
      dominant-baseline="central"
      :transform="`${elementLabel} rotate(${elementAngle} ${(n1.coords[0] + n2.coords[0]) / 2} ${
        (n1.coords[2] + n2.coords[2]) / 2
      })`"
    >
      <template v-if="eload.values[0] !== 0">ΔTc={{ numberFormat.format(eload.values[0]) }}</template>
      <template v-if="eload.values[1] !== 0 || eload.values[2] !== 0">
        {{ $t("loads.temperatureDeltaTbtNoHTML") }}={{ numberFormat.format(eload.values[1] - eload.values[2]) }}
      </template>
    </text>
  </g>
</template>
