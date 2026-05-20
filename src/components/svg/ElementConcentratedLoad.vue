<script lang="ts" setup>
import { BeamConcentratedLoad } from 'ts-fem';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    eload: BeamConcentratedLoad;
    scale: number;
    convertForce: (f: number) => number;
    convertMoment?: (m: number) => number;
    fontSize?: number;
    numberFormat: Intl.NumberFormat;
  }>(),
  { fontSize: 13, convertMoment: (m: number) => m }
);

const target = computed(() => {
  return props.eload.domain.elements.get(props.eload.target)!;
});

const position = computed(() => {
  const n1 = props.eload.domain.nodes.get(target.value.nodes[0]);

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

const labelPosition = computed(() => {
  const size = Math.sqrt(props.eload.values[0] * props.eload.values[0] + props.eload.values[1] * props.eload.values[1]);
  const fx = props.eload.values[0] / size;
  const fz = props.eload.values[1] / size;

  if (!props.eload.lcs)
    return `translate(${position.value.x - (45 / props.scale) * fx} ${position.value.z - (45 / props.scale) * fz})`;

  let px = 0;
  let pz = 0;

  const geo = target.value.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  // local to global
  const fxl = cos * fx - sin * fz;
  const fzl = sin * fx + cos * fz;

  px += position.value.x - (fxl * 45) / props.scale;
  pz += position.value.z - (fzl * 45) / props.scale;

  return `translate(${px} ${pz})`;
});

const momentHandlePoints = computed(() => {
  return `${position.value.x},${position.value.z} ${position.value.x + 1e-6},${position.value.z}`;
});

const momentLabelPosition = computed(() => {
  return `translate(${position.value.x + (props.fontSize + 8) / props.scale}
          ${position.value.z - (props.fontSize / 2 + 2) / props.scale})`;
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

    <polyline
      v-if="eload.values[2] !== 0"
      points="0,0 0,0"
      vector-effect="non-scaling-stroke"
      class="decoration moment"
      :class="{ cw: eload.values[2] < 0, ccw: eload.values[2] > 0 }"
      :transform="`translate(${position.x} ${position.z})`"
    />

    <polyline
      v-if="eload.values[0] !== 0 || eload.values[1] !== 0"
      :points="`${position.x},${position.z} ${position.x + 40 / scale},${position.z}`"
      :transform="`rotate(${angle - 90} ${position.x} ${position.z})`"
      class="handle"
    />

    <polyline v-if="eload.values[2] !== 0" :points="momentHandlePoints" class="handle moment" />

    <text
      v-if="eload.values[2] !== 0"
      :font-size="fontSize / scale"
      font-weight="normal"
      text-anchor="start"
      dominant-baseline="central"
      :transform="momentLabelPosition"
    >
      {{ numberFormat.format(Math.abs(convertMoment(eload.values[2]))) }}
    </text>

    <text
      v-if="eload.values[0] !== 0 || eload.values[1] !== 0"
      :font-size="fontSize / scale"
      font-weight="normal"
      dominant-baseline="central"
      :text-anchor="eload.values[0] > 0 ? 'end' : 'start'"
      :transform="labelPosition"
    >
      {{
        numberFormat.format(
          convertForce(Math.sqrt(eload.values[0] * eload.values[0] + eload.values[1] * eload.values[1]))
        )
      }}
      <template v-if="eload.values[0] !== 0 && eload.values[1] !== 0">
        ({{ numberFormat.format(convertForce(eload.values[0])) }};
        {{ numberFormat.format(convertForce(eload.values[1])) }})
      </template>
    </text>
  </g>
</template>
