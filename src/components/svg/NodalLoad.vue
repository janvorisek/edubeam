<script lang="ts" setup>
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

const target = computed(() => {
  return props.nload.domain.nodes.get(props.nload.target)!;
});

const angle = computed(() => {
  return -(Math.atan2(props.nload.values[0], props.nload.values[2]) * 180) / Math.PI;
});

/** Length of the force vector; zero for a load that is a pure moment. */
const forceSize = computed(() => {
  return Math.sqrt(props.nload.values[0]! * props.nload.values[0]! + props.nload.values[2]! * props.nload.values[2]!);
});

/** Unit vector pointing back along the arrow, or the origin when there is no force to point along. */
const forceDirection = computed(() => {
  if (forceSize.value === 0) return { x: 0, z: 0 };

  return { x: -props.nload.values[0]! / forceSize.value, z: -props.nload.values[2]! / forceSize.value };
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
    // calculate full angle in 360deg space
    const ang = (360 + -(Math.atan2(nloads[i].values[0], nloads[i].values[2]) * 180) / Math.PI) % 360;

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
  <g class="nodal-load" :transform="stackedTransform">
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
    <circle
      v-if="nload.values[4] !== 0"
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
      v-if="nload.values[4] !== 0"
      :font-size="fontSize / scale"
      font-weight="normal"
      text-anchor="start"
      dominant-baseline="central"
      :transform="`translate(${target.coords[0] + (fontSize + 8) / scale}
              ${target.coords[2] - (fontSize / 2 + 2) / scale})`"
    >
      {{ numberFormat.format(Math.abs(convertMoment(nload.values[4]))) }}
    </text>

    <text
      v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
      :font-size="fontSize / scale"
      font-weight="normal"
      :text-anchor="nload.values[0] > 0 ? 'end' : 'start'"
      dominant-baseline="central"
      :transform="`translate(${
        target.coords[0] -
        (40 * nload.values[0]) /
          Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
          scale -
        (nload.values[0] > 0 ? 4 : -4) / scale
      }
              ${
                target.coords[2] -
                (40 * nload.values[2]) /
                  Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
                  scale
              })`"
    >
      {{
        numberFormat.format(
          convertForce(Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]))
        )
      }}
      <template v-if="nload.values[0] !== 0 && nload.values[2] !== 0">
        ({{ numberFormat.format(convertForce(nload.values[0])) }};
        {{ numberFormat.format(convertForce(nload.values[2])) }})
      </template>
    </text>
  </g>
</template>
