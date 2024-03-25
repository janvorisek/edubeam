<script lang="ts" setup>
import { Node, Beam2D, BeamElementUniformEdgeLoad } from "ts-fem";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    eload: BeamElementUniformEdgeLoad;
    scale: number;
    convertForce: (f: number) => number;
    fontSize?: number;
  }>(),
  {
    fontSize: 13,
  }
);

const target = computed(() => props.eload.domain.elements.get(props.eload.target) as Beam2D);
const n1 = computed(() => props.eload.domain.nodes.get(target.value.nodes[0]) as Node);
const n2 = computed(() => props.eload.domain.nodes.get(target.value.nodes[1]) as Node);

const eloadAngles = computed(() => {
  const geo = target.value.computeGeo();

  // Calculate angle
  {
    if (!props.eload.lcs) {
      return { 0: props.eload.values[0] < 0 ? 90 : 270, 1: props.eload.values[1] > 0 ? 0 : 180 };
    } else {
      const v0 = (Math.atan2(geo.dz, geo.dx) * 180) / Math.PI - 90 * Math.sign(props.eload.values[0]);

      const v1 =
        props.eload.values[1] < 0
          ? (Math.atan2(geo.dz, geo.dx) * 180) / Math.PI + 180
          : (Math.atan2(geo.dz, geo.dx) * 180) / Math.PI;

      return { 0: v0, 1: v1 };
    }
  }
});

const eloadPoints = computed(() => {
  const geo = target.value.computeGeo();

  const smallestsize = props.eload.values[0] !== 0 && props.eload.values[1] === 0 ? 20 : 40;
  const nx = (geo.dz * smallestsize) / geo.l / props.scale;
  const nz = (-geo.dx * smallestsize) / geo.l / props.scale;

  const nx2 = (geo.dz * 60) / geo.l / props.scale;
  const nz2 = (-geo.dx * 60) / geo.l / props.scale;

  let line1 = "",
    line2 = "",
    line3 = "";

  if (props.eload.lcs) {
    line1 = `${n1.value.coords[0]},${n1.value.coords[2]} ${n2.value.coords[0]},${n2.value.coords[2]}`;

    line2 = `${n2.value.coords[0] + nx},${n2.value.coords[2] + nz} ${n1.value.coords[0] + nx},${n1.value.coords[2] + nz} ${n1.value.coords[0]},${
      n1.value.coords[2]
    }`;

    line3 =
      props.eload.values[0] !== 0 && props.eload.values[1] !== 0
        ? `${n2.value.coords[0]},${n2.value.coords[2]} ${n2.value.coords[0] + nx2},${n2.value.coords[2] + nz2} ${n1.value.coords[0] + nx2},${
            n1.value.coords[2] + nz2
          }`
        : ``;
  } else {
    if (props.eload.values[1] !== 0) {
      line1 = `${n1.value.coords[0]},${n1.value.coords[2]} ${n1.value.coords[0]},${n1.value.coords[2] - 40 / props.scale} ${n2.value.coords[0]},${
        n2.value.coords[2] - 40 / props.scale
      } ${n2.value.coords[0]},${n2.value.coords[2]}`;
    }

    if (props.eload.values[0] !== 0) {
      line2 = `${n1.value.coords[0]},${n1.value.coords[2]} ${n1.value.coords[0] - (Math.sign(nx) * 40) / props.scale},${n1.value.coords[2]} ${
        n2.value.coords[0] - (Math.sign(nx) * 40) / props.scale
      },${n2.value.coords[2]} ${n2.value.coords[0]},${n2.value.coords[2]}`;
    }
  }

  return line1 + " " + line2 + " " + line3;
});

const eloadLabels = computed(() => {
  // Calculate load labels
  {
    const geo = target.value.computeGeo();
    const nz = geo.dx / geo.l;
    const nx = -geo.dz / geo.l;

    const ncx = n1.value.coords[0];
    const ncz = n1.value.coords[2];

    const dist = 40;
    const dist2 = props.eload.values[1] !== 0 ? 60 : 20;

    const dx = props.eload.lcs ? (-nx * dist) / props.scale : 0;
    const dz = props.eload.lcs ? (-nz * dist) / props.scale : -dist / props.scale;

    const dx3 = -(nz * 5) / props.scale;
    const dz3 = (nx * 5) / props.scale;

    if (props.eload.lcs) {
      const dx2 = (-nx * dist2) / props.scale;
      const dz2 = (-nz * dist2) / props.scale;

      return {
        0: `translate(${ncx + dx2 + dx3}, ${ncz + dz2 + dz3})`,
        1: `translate(${ncx + dx + dx3}, ${ncz + dz + dz3})`,
      };
    } else {
      return {
        0: `translate(${ncx - dist / props.scale + dx3}, ${ncz + dz3})`,
        1: `translate(${ncx + dx3}, ${ncz - dist / props.scale + dz3})`,
      };
    }
  }
});

const eloadForces = computed(() => {
  const geo = target.value.computeGeo();
  const nx = geo.dz / geo.l / props.scale;
  const nz = -geo.dx / geo.l / props.scale;
  let nseg = Math.ceil((geo.l * props.scale) / 20);
  let segsize = geo.l / nseg;
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  const pts0: [number, number][] = [];
  const pts1: [number, number][] = [];

  if (props.eload.lcs) {
    // component 1 (z)
    {
      const moveDist = props.eload.values[1] >= 0 ? 0 : 2;

      for (let s = 0; s <= nseg; s++) {
        pts1.push([
          n1.value.coords[0] + s * cos * segsize + nx * 20 + nx * moveDist,
          n1.value.coords[2] + s * sin * segsize + nz * 20 + nz * moveDist,
        ]);
      }
    }

    // component 0 (x)
    {
      nseg = Math.floor((geo.l * props.scale) / 45);
      segsize = geo.l / nseg;
      const mx = (cos * segsize) / 2;
      const mz = (sin * segsize) / 2;
      const moveDist = props.eload.values[0] !== 0 && props.eload.values[1] === 0 ? 10 : 50;
      for (let s = 0; s < nseg; s++) {
        pts0.push([
          n1.value.coords[0] + mx + s * cos * segsize + nx * moveDist,
          mz + n1.value.coords[2] + s * sin * segsize + nz * moveDist,
        ]);
      }
    }
  } else {
    // component 1 (z)
    {
      for (let s = 0; s <= nseg; s++) {
        pts1.push([n1.value.coords[0] + s * cos * segsize, n1.value.coords[2] + s * sin * segsize - 20 / props.scale]);
      }
    }

    // component 0 (x)
    {
      for (let s = 0; s <= nseg; s++) {
        pts0.push([
          n1.value.coords[0] + s * cos * segsize - (Math.sign(nx) * 20) / props.scale,
          n1.value.coords[2] + s * sin * segsize,
        ]);
      }
    }
  }

  return { 0: pts0, 1: pts1 };
});
</script>

<template>
  <g class="element-load load-1d">
    <g v-if="eload.values[0] !== 0">
      <polyline
        v-for="(load, i) in eloadForces[0]"
        :key="`load-force-${i}`"
        points="0,0 0,0"
        vector-effect="non-scaling-stroke"
        class="drawable"
        :transform="`translate(${load[0]} ${load[1]}) rotate(${eloadAngles[0]})`"
      />
    </g>
    <g v-if="eload.values[1] !== 0">
      <polyline
        v-for="(load, i) in eloadForces[1]"
        :key="`load-force-${i}`"
        points="0,0 0,0"
        vector-effect="non-scaling-stroke"
        class="drawable"
        :transform="`translate(${load[0]} ${load[1]}) rotate(${eloadAngles[1]})`"
      />
    </g>
    <g>
      <text
        v-if="eload.values[0] !== 0"
        :font-size="fontSize / scale"
        font-weight="normal"
        text-anchor="end"
        dominant-baseline="middle"
        :transform="eloadLabels[0]"
      >
        {{ Math.abs(convertForce(eload.values[0])).toFixed(2) }}
      </text>
      <text
        v-if="eload.values[1] !== 0"
        :font-size="fontSize / scale"
        font-weight="normal"
        text-anchor="end"
        dominant-baseline="middle"
        :transform="eloadLabels[1]"
      >
        {{ Math.abs(convertForce(eload.values[1])).toFixed(2) }}
      </text> </g
    >``
    <polygon
      v-if="eload.values[0] !== 0 || eload.values[1] !== 0"
      :points="eloadPoints"
      fill="transparent"
      class="drawable"
      vector-effect="non-scaling-stroke"
    />
  </g>
</template>
