<script lang="ts" setup>
import { formatScientificNumber } from '@/utils/index';
import { PrescribedDisplacement } from 'ts-fem';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    nload: PrescribedDisplacement;
    scale: number;
    convertLength: (f: number) => number;
    multiplier: number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
  }>(),
  {
    fontSize: 13,
    numberFormat: new Intl.NumberFormat(),
  }
);

const target = computed(() => {
  return props.nload.domain.nodes.get(props.nload.target)!;
});
</script>

<template>
  <g class="nodal-load prescribed">
    <polyline
      v-if="nload.prescribedValues[0] !== 0 || nload.prescribedValues[2] !== 0"
      :points="`${target.coords[0]},${target.coords[2]} ${
        target.coords[0] + (nload.prescribedValues[0] * props.multiplier) / scale
      } ${target.coords[2] + (nload.prescribedValues[2] * props.multiplier) / scale}`"
      vector-effect="non-scaling-stroke"
      stroke-dasharray="2,4"
      class="decoration marker-forceTip"
    />

    <text
      v-if="nload.prescribedValues[0] !== 0 || nload.prescribedValues[2] !== 0"
      :font-size="fontSize / scale"
      font-weight="normal"
      :text-anchor="nload.prescribedValues[0] > 0 ? 'start' : 'end'"
      dominant-baseline="central"
      :transform="`translate(${
        target.coords[0] +
        (nload.prescribedValues[0] > 0 ? 10 / scale : -10 / scale) +
        (nload.prescribedValues[0] * props.multiplier) / scale
      }
              ${target.coords[2] + (nload.prescribedValues[2] * props.multiplier) / scale})`"
    >
      {{ formatScientificNumber(convertLength(nload.prescribedValues[0]), 2) }};
      {{ formatScientificNumber(convertLength(nload.prescribedValues[2]), 2) }};
      {{ formatScientificNumber(convertLength(nload.prescribedValues[4]), 2) }}
    </text>
  </g>
</template>
