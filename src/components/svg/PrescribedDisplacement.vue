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

const hasTranslation = computed(() => props.nload.prescribedValues[0] !== 0 || props.nload.prescribedValues[2] !== 0);

/** A prescribed rotation is stored in radians and is never unit-converted. */
const rotation = computed(() => props.nload.prescribedValues[4] ?? 0);

const hasRotation = computed(() => Math.abs(rotation.value) > 1e-32);

const translationTip = computed(() => {
  return {
    x: target.value.coords[0] + (props.nload.prescribedValues[0] * props.multiplier) / props.scale,
    z: target.value.coords[2] + (props.nload.prescribedValues[2] * props.multiplier) / props.scale,
  };
});

const translationPoints = computed(() => {
  return `${target.value.coords[0]},${target.value.coords[2]} ${translationTip.value.x} ${translationTip.value.z}`;
});

/** Resultant of the prescribed translation, labelled the way a nodal force is. */
const translationMagnitude = computed(() => {
  const dx = props.nload.prescribedValues[0];
  const dz = props.nload.prescribedValues[2];

  return Math.sqrt(dx * dx + dz * dz);
});

const hasBothTranslationComponents = computed(
  () => props.nload.prescribedValues[0] !== 0 && props.nload.prescribedValues[2] !== 0
);

/**
 * The rotation marker draws its arc at radius 20 inside a viewBox that is scaled by 50/60 to fit
 * the marker box, so the arc lands here. The handle is a ring on top of it - a degenerate segment
 * with butt caps, as the moment handles use, paints a sliver that is all but impossible to hit.
 */
const rotationHandleRadius = computed(() => (20 * (50 / 60)) / props.scale);
</script>

<template>
  <g class="nodal-load prescribed">
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
      :text-anchor="nload.prescribedValues[0] > 0 ? 'start' : 'end'"
      dominant-baseline="central"
      :transform="`translate(${translationTip.x + (nload.prescribedValues[0] > 0 ? 10 / scale : -10 / scale)}
              ${translationTip.z})`"
    >
      {{ formatScientificNumber(convertLength(translationMagnitude), 2) }}
      <template v-if="hasBothTranslationComponents">
        ({{ formatScientificNumber(convertLength(nload.prescribedValues[0]), 2) }};
        {{ formatScientificNumber(convertLength(nload.prescribedValues[2]), 2) }})
      </template>
    </text>

    <text
      v-if="hasRotation"
      :font-size="fontSize / scale"
      font-weight="normal"
      text-anchor="start"
      dominant-baseline="central"
      :transform="`translate(${target.coords[0] + (fontSize + 8) / scale}
              ${target.coords[2] - (fontSize / 2 + 2) / scale})`"
    >
      {{ formatScientificNumber(rotation, 2) }}
    </text>
  </g>
</template>
