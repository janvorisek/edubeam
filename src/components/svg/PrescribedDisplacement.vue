<script lang="ts" setup>
import { vertical } from '@/utils/axisConvention';
import { formatDisplacementLabel } from '@/utils/numberDisplay';
import { inPlaneValues } from '@/utils/dofValues';
import { actingInGlobalAxes } from '@/utils/nodalLcs';
import { PrescribedDisplacement } from '@edubeam/fem';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    nload: PrescribedDisplacement;
    scale: number;
    convertDisplacement: (f: number) => number;
    multiplier: number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
  }>(),
  {
    fontSize: 13,
    numberFormat: new Intl.NumberFormat(),
  }
);

/** Undefined when the load outlives its node; the drawing then leaves it out rather than throwing. */
const target = computed(() => props.nload.domain.nodes.get(props.nload.target));

/** The values as entered, along the support's own axes; the labels show these. */
const values = computed(() => inPlaneValues(props.nload.prescribedValues));

/** Where the node is moved on the drawing: a turned support moves along its own axes. */
const drawn = computed(() => actingInGlobalAxes(target.value, values.value, true));

const hasTranslation = computed(() => values.value[0] !== 0 || values.value[2] !== 0);

/** A prescribed rotation is stored in radians and is never unit-converted. */
const rotation = computed(() => values.value[4]);

const hasRotation = computed(() => Math.abs(rotation.value) > 1e-32);

const translationTip = computed(() => {
  return {
    x: target.value.coords[0] + (drawn.value.x * props.multiplier) / props.scale,
    z: target.value.coords[2] + (drawn.value.z * props.multiplier) / props.scale,
  };
});

const translationPoints = computed(() => {
  return `${target.value.coords[0]},${target.value.coords[2]} ${translationTip.value.x} ${translationTip.value.z}`;
});

/** Resultant of the prescribed translation, labelled the way a nodal force is. */
const translationMagnitude = computed(() => {
  const dx = values.value[0];
  const dz = values.value[2];

  return Math.sqrt(dx * dx + dz * dz);
});

const hasBothTranslationComponents = computed(() => values.value[0] !== 0 && values.value[2] !== 0);

/**
 * The rotation marker draws its arc at radius 20 inside a viewBox that is scaled by 50/60 to fit
 * the marker box, so the arc lands here. The handle is a ring on top of it - a degenerate segment
 * with butt caps, as the moment handles use, paints a sliver that is all but impossible to hit.
 */
const rotationHandleRadius = computed(() => (20 * (50 / 60)) / props.scale);
</script>

<template>
  <g v-if="target" class="nodal-load prescribed">
    <polyline
      v-if="hasTranslation"
      :points="translationPoints"
      vector-effect="non-scaling-stroke"
      stroke-dasharray="2,4"
      class="decoration marker-forceTip"
    />

    <polyline
      v-if="hasRotation"
      points="0,0 0,0"
      vector-effect="non-scaling-stroke"
      class="decoration rotation"
      :class="{ cw: rotation < 0, ccw: rotation > 0 }"
      :transform="`translate(${target.coords[0]} ${target.coords[2]})`"
    />

    <polyline v-if="hasTranslation" :points="translationPoints" class="handle" />
    <circle
      v-if="hasRotation"
      :cx="target.coords[0]"
      :cy="target.coords[2]"
      :r="rotationHandleRadius"
      fill="none"
      stroke="transparent"
      stroke-width="18"
      pointer-events="stroke"
      vector-effect="non-scaling-stroke"
    />

    <text
      v-if="hasTranslation"
      :font-size="fontSize / scale"
      font-weight="normal"
      :text-anchor="drawn.x > 0 ? 'start' : 'end'"
      dy="0.35em"
      :transform="`translate(${translationTip.x + (drawn.x > 0 ? 10 / scale : -10 / scale)}
              ${translationTip.z})`"
    >
      {{ formatDisplacementLabel(convertDisplacement(translationMagnitude), numberFormat) }}
      <template v-if="hasBothTranslationComponents">
        ({{ formatDisplacementLabel(convertDisplacement(values[0]), numberFormat) }};
        {{ formatDisplacementLabel(vertical(convertDisplacement(values[2])), numberFormat) }})
      </template>
    </text>

    <text
      v-if="hasRotation"
      :font-size="fontSize / scale"
      font-weight="normal"
      text-anchor="start"
      dy="0.35em"
      :transform="`translate(${target.coords[0] + (fontSize + 8) / scale}
              ${target.coords[2] - (fontSize / 2 + 2) / scale})`"
    >
      {{ formatDisplacementLabel(rotation, numberFormat) }}
    </text>
  </g>
</template>
