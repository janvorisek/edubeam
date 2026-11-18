<script lang="ts" setup>
import { vertical } from '@/utils/axisConvention';
import { inPlaneValues } from '@/utils/dofValues';
import { actingInGlobalAxes } from '@/utils/nodalLcs';
import { NodalLoad } from 'ts-fem';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    nload: NodalLoad;
    scale: number;
    convertForce?: (f: number) => number;
    convertMoment?: (m: number) => number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
  }>(),
  {
    fontSize: 13,
    numberFormat: new Intl.NumberFormat(),
    convertForce: (f: number) => f,
    convertMoment: (m: number) => m,
  }
);

/** Undefined when the load outlives its node; the drawing then leaves it out rather than throwing. */
const target = computed(() => props.nload.domain.nodes.get(props.nload.target));

/** The values as entered, in the load's own axes; the labels show these. */
const values = computed(() => inPlaneValues(props.nload.values));

/** Where the force points on the drawing: a load in the node's axes turns with the node. */
const drawn = computed(() => actingInGlobalAxes(target.value, values.value, props.nload.lcs));

const angle = computed(() => {
  return -(Math.atan2(drawn.value.x, drawn.value.z) * 180) / Math.PI;
});

/** Length of the force vector; zero for a load that is a pure moment. */
const forceSize = computed(() => {
  return Math.sqrt(drawn.value.x * drawn.value.x + drawn.value.z * drawn.value.z);
});

/** Unit vector pointing back along the arrow, or the origin when there is no force to point along. */
const forceDirection = computed(() => {
  if (forceSize.value === 0) return { x: 0, z: 0 };

  return { x: -drawn.value.x / forceSize.value, z: -drawn.value.z / forceSize.value };
});

/**
 * The moment marker draws its arc at radius 20 inside a viewBox scaled by 50/60 to fit the marker
 * box, so the arc lands here. The handle is a ring on top of it - a degenerate segment with butt
 * caps paints a sliver that is all but impossible to hit.
 */
const momentHandleRadius = computed(() => (20 * (50 / 60)) / props.scale);

const nloadPts = computed(() => {
  // A pure moment has no arrow to grab; its own ring handle covers it instead.
  if (forceSize.value === 0) return `${target.value.coords[0]},${target.value.coords[2]}`;

  return `${target.value!.coords[0]},${target.value!.coords[2]} ${
    target.value!.coords[0] + (forceDirection.value.x * 30) / props.scale
  },${target.value!.coords[2] + (forceDirection.value.z * 30) / props.scale}`;
});

/**
 * Calculate stacked transform for multiple loads on same element
 */
const stackedTransform = computed(() => {
  const nloads = target.value.domain.solver.loadCases[0].nodalLoadList.filter((nl) => nl.target === props.nload.target);

  const index = nloads.indexOf(props.nload);

  // count per angle
  const angleMap = new Map<number, number>();
  for (let i = 0; i < index; i++) {
    // calculate full angle in 360deg space, as drawn
    const { x: fx, z: fz } = actingInGlobalAxes(target.value, inPlaneValues(nloads[i].values), nloads[i].lcs);
    const ang = (360 + -(Math.atan2(fx, fz) * 180) / Math.PI) % 360;

    angleMap.set(ang, (angleMap.get(ang) || 0) + 1);
  }

  // move in force direction by 30 units per same-angle load before this one
  const fullAngle = (360 + (angle.value % 360)) % 360;
  const count = angleMap.get(fullAngle) || 0;

  const { x: sx, z: sz } = forceDirection.value;

  return `translate(${(sx * 30 * count) / props.scale} ${(sz * 30 * count) / props.scale})`;
});
</script>

<template>
  <g v-if="target" class="nodal-load" :transform="stackedTransform">
    <polyline
      v-if="values[0] !== 0 || values[2] !== 0"
      points="0,0 0,0"
      vector-effect="non-scaling-stroke"
      class="decoration force"
      :transform="`translate(${target.coords[0]} ${target.coords[2]}) rotate(${angle})`"
    />

    <polyline
      v-if="values[4] !== 0"
      points="0,0 0,0"
      vector-effect="non-scaling-stroke"
      class="decoration moment"
      :class="{ cw: values[4] < 0, ccw: values[4] > 0 }"
      :transform="`translate(${target.coords[0]}
              ${target.coords[2]})`"
    />

    <polyline :points="nloadPts" class="handle" />
    <circle
      v-if="values[4] !== 0"
      :cx="target.coords[0]"
      :cy="target.coords[2]"
      :r="momentHandleRadius"
      fill="none"
      stroke="transparent"
      stroke-width="18"
      pointer-events="stroke"
      vector-effect="non-scaling-stroke"
    />

    <text
      v-if="values[4] !== 0"
      :font-size="fontSize / scale"
      font-weight="normal"
      text-anchor="start"
      dy="0.35em"
      :transform="`translate(${target.coords[0] + (fontSize + 8) / scale}
              ${target.coords[2] - (fontSize / 2 + 2) / scale})`"
    >
      {{ numberFormat.format(Math.abs(convertMoment(values[4]))) }}
    </text>

    <text
      v-if="values[0] !== 0 || values[2] !== 0"
      :font-size="fontSize / scale"
      font-weight="normal"
      :text-anchor="drawn.x > 0 ? 'end' : 'start'"
      dy="0.35em"
      :transform="`translate(${target.coords[0] + (40 * forceDirection.x) / scale - (drawn.x > 0 ? 4 : -4) / scale}
              ${target.coords[2] + (40 * forceDirection.z) / scale})`"
    >
      {{ numberFormat.format(convertForce(Math.sqrt(values[0] * values[0] + values[2] * values[2]))) }}
      <template v-if="values[0] !== 0 && values[2] !== 0">
        ({{ numberFormat.format(convertForce(values[0])) }};
        {{ numberFormat.format(vertical(convertForce(values[2]))) }})
      </template>
    </text>
  </g>
</template>
