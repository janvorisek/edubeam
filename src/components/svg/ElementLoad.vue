<script lang="ts" setup>
import { Node, Beam2D, BeamElementUniformEdgeLoad, BeamElementTrapezoidalEdgeLoad } from 'ts-fem';
import { computed } from 'vue';

import SVGElementLoadUDL from './ElementLoad/UDL.vue';
import SVGElementLoadTrapezoidal from './ElementLoad/Trapezoidal.vue';

const props = withDefaults(
  defineProps<{
    eload: BeamElementUniformEdgeLoad | BeamElementTrapezoidalEdgeLoad;
    scale: number;
    convertForce: (f: number) => number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
  }>(),
  {
    fontSize: 13,
    numberFormat: new Intl.NumberFormat(),
  }
);
</script>

<template>
  <SVGElementLoadUDL v-if="props.eload instanceof BeamElementUniformEdgeLoad" v-bind="props" />

  <SVGElementLoadTrapezoidal v-else v-bind="props" />
</template>
