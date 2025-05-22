<script lang="ts" setup>
import { smoothPath } from '../../utils/smoothPath';
import { Matrix } from 'mathjs';
import { Node, DofID, LoadCase, Beam2D, BeamConcentratedLoad, BeamElementUniformEdgeLoad } from 'ts-fem';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    element: Beam2D;
    scale: number;
    showDeformedShape: boolean;
    showNormalForce: boolean;
    showShearForce: boolean;
    showBendingMoment: boolean;
    showLabel: boolean;
    convertForce: (f: number) => number;
    loadCase: LoadCase;
    deformedShapeMultiplier: number;
    normalForceMultiplier: number;
    shearForceMultiplier: number;
    bendingMomentMultiplier: number;
    padding?: number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
  }>(),
  {
    padding: 10,
    fontSize: 13,
    numberFormat: new Intl.NumberFormat(),
  }
);

const elementCoords = computed(() => {
  const nodes = props.element.nodes.map((n) => props.element.domain.nodes.get(n)!.coords);
  return nodes.map((n: number[]) => `${n[0]},${n[2]}`).join(' ');
});

const elementFibers = computed(() => {
  const geo = props.element.computeGeo();
  const nz = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  const nodes = props.element.nodes.map((n) => props.element.domain.nodes.get(n)!.coords);

  return nodes.map((n: number[]) => `${n[0] + (nx * 3) / props.scale},${n[2] + (nz * 3) / props.scale}`).join(' ');
});

const elementAngle = computed(() => {
  const geo = props.element.computeGeo();
  return Math.atan2(geo.dz, geo.dx) * (180 / Math.PI);
});

const elementLabel = computed(() => {
  const geo = props.element.computeGeo();
  const ny = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  return `translate(${(-props.padding * nx) / props.scale}, ${(-props.padding * ny) / props.scale})`;
});

const elementHinges = computed(() => {
  const n1 = props.element.domain.nodes.get(props.element.nodes[0]) as Node;
  const n2 = props.element.domain.nodes.get(props.element.nodes[1]) as Node;

  const geo = props.element.computeGeo();
  const k1 = 1;
  const k2 = -1;

  const nx = ((geo.dx * 9) / geo.l / props.scale) * k1;
  const nz = ((geo.dz * 9) / geo.l / props.scale) * k1;
  const line1 = `${n1.coords[0] + nx}, ${n1.coords[2] + nz}`;

  const nx2 = ((geo.dx * 9) / geo.l / props.scale) * k2;
  const nz2 = ((geo.dz * 9) / geo.l / props.scale) * k2;
  const line2 = `${n2.coords[0] + nx2}, ${n2.coords[2] + nz2}`;

  return { 0: line1, 1: line2 };
});

const results = computed(() => {
  if (!props.loadCase.solved || !props.showDeformedShape) return '';

  const result = [];
  const hinges = props.element.hinges[0] && props.element.hinges[1];
  const eload = props.loadCase.elementLoadList.filter((l) => l.target === props.element.label);
  const truss = hinges && eload.length === 0;

  const nseg = truss ? 1 : 16;
  const scaleBy = props.deformedShapeMultiplier / props.scale;
  const n1 = props.element.domain.nodes.get(props.element.nodes[0]) as Node;
  let def = null;

  def = props.element.computeGlobalDefl(props.loadCase, nseg);

  const geo = props.element.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;
  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    result.push([xc + def.u[s] * scaleBy, zc + def.w[s] * scaleBy]);
  }

  return smoothPath(result);
});

const forces = computed(() => {
  if (!props.loadCase.solved)
    return {
      normal: {
        text: [],
        values: '',
      },
      shear: {
        text: [],
        values: '',
      },
      moment: {
        text: [],
        values: '',
      },
    };

  let result = '';
  let resultV = '';
  let resultM = '';

  const nseg = 1;
  const nsegM = props.loadCase.elementLoadList.filter((l) => l.target === props.element.label).length === 0 ? 1 : 20;
  const scaleBy = props.normalForceMultiplier / props.scale;
  const scaleByV = props.shearForceMultiplier / props.scale;
  const scaleByM = props.bendingMomentMultiplier / props.scale;
  const n1 = props.element.domain.nodes.get(props.element.nodes[0]) as Node;
  const n2 = props.element.domain.nodes.get(props.element.nodes[1]) as Node;

  const geo = props.element.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  const nx = geo.dz / geo.l;
  const ny = -geo.dx / geo.l;

  // Calculate V(x)=0
  //const dV = forcesV.V[nseg] - forcesV.V[0];
  const xmax = 0;

  /*if (Math.abs(dV) > 1e-6) {
    xmax = -(forcesV.V[0] * geo.l) / dV;
  }*/

  const labelsX = [0, geo.l];
  const labelsXM = xmax > 0 && xmax < geo.l ? [0, xmax, geo.l] : [0, geo.l];

  // values from 0 to element length
  const nvvalues = [];
  const mvalues = [];

  // Check if concentrated forces are present
  const concentrated = props.loadCase.elementLoadList.filter(
    (l) => l.target === props.element.label && l instanceof BeamConcentratedLoad
  ) as BeamConcentratedLoad[];

  for (const c of concentrated) {
    labelsXM.push(c.values[3]);
    labelsX.push(c.values[3] - 1e-7);
    labelsX.push(c.values[3] + 1e-7);
    mvalues.push(c.values[3]);
    nvvalues.push(c.values[3] - 1e-7);
    nvvalues.push(c.values[3] + 1e-7);
  }

  for (let s = 0; s <= nseg; s++) {
    nvvalues.push((geo.l * s) / nseg);
  }

  for (let s = 0; s <= nsegM; s++) {
    mvalues.push((geo.l * s) / nsegM);
  }

  labelsXM.sort((a, b) => a - b);
  mvalues.sort((a, b) => a - b);
  nvvalues.sort((a, b) => a - b);

  // Now go over V intervals to find potential max M
  for (let i = 0; i < nvvalues.length - 1; i++) {
    const v1 = nvvalues[i];
    const v2 = nvvalues[i + 1];
    const dv = v2 - v1;

    if (dv < 1e-6) continue;

    const vV1 = props.element.computeShearForceAt(props.loadCase, v1);
    const vV2 = props.element.computeShearForceAt(props.loadCase, v2);

    const v0 = (-vV1 * dv) / (vV2 - vV1) + v1;

    if (v0 > v1 && v0 < v2) {
      mvalues.push(v0);
      labelsXM.push(v0);
    }
  }

  labelsXM.sort((a, b) => a - b);
  mvalues.sort((a, b) => a - b);

  let nNzero = 0;
  let nVzero = 0;
  let nMzero = 0;

  for (let s = 0; s < nvvalues.length; s++) {
    const xc = n1.coords[0] + cos * nvvalues[s];
    const zc = n1.coords[2] + sin * nvvalues[s];

    const vNraw = props.element.computeNormalForceAt(props.loadCase, nvvalues[s]);
    const vVraw = props.element.computeShearForceAt(props.loadCase, nvvalues[s]);

    if (Math.abs(vNraw) < 1e-6) nNzero++;
    if (Math.abs(vVraw) < 1e-6) nVzero++;

    result += `${xc + vNraw * nx * scaleBy},${zc + vNraw * ny * scaleBy} `;
    resultV += `${xc + vVraw * nx * scaleByV},${zc + vVraw * ny * scaleByV} `;
  }

  for (let s = 0; s < mvalues.length; s++) {
    const xc = n1.coords[0] + cos * mvalues[s];
    const zc = n1.coords[2] + sin * mvalues[s];

    const nx = -geo.dz / geo.l;
    const ny = geo.dx / geo.l;

    const vMraw = props.element.computeBendingMomentAt(props.loadCase, mvalues[s]);
    if (Math.abs(vMraw) < 1e-6) nMzero++;

    resultM += `${xc + vMraw * nx * scaleByM},${zc + vMraw * ny * scaleByM} `;
  }

  if (nNzero === nvvalues.length) result = '';
  if (nVzero === nvvalues.length) resultV = '';
  if (nMzero === mvalues.length) resultM = '';

  const result2 = [];
  const result2V = [];
  const result2M = [];

  for (let s = 0; s < labelsX.length; s++) {
    const xc = n1.coords[0] + cos * labelsX[s];
    const zc = n1.coords[2] + sin * labelsX[s];

    const vNraw = props.element.computeNormalForceAt(props.loadCase, labelsX[s]);
    const vN = props.convertForce(vNraw);
    if (Math.abs(vN) > 1e-8) {
      const p = (vN > 0 ? -4 : 4) / props.scale;
      result2.push([xc + vNraw * nx * scaleBy + p, zc + vNraw * ny * scaleBy + p, vN]);
    }

    const vVraw = props.element.computeShearForceAt(props.loadCase, labelsX[s]);
    const vV = props.convertForce(vVraw);
    if (Math.abs(vV) > 1e-8) {
      const p = (vV > 0 ? -4 : 4) / props.scale;
      result2V.push([xc + vVraw * nx * scaleByV + p, zc + vVraw * ny * scaleByV + p, vV]);
    }
  }

  for (let s = 0; s < labelsXM.length; s++) {
    const xc = n1.coords[0] + cos * labelsXM[s];
    const zc = n1.coords[2] + sin * labelsXM[s];

    const vMraw = props.element.computeBendingMomentAt(props.loadCase, labelsXM[s]);
    const vM = props.convertForce(vMraw);
    if (Math.abs(vMraw) > 1e-8) {
      let px = 0,
        pz = 0;
      px = pz = (vM < 0 ? -props.fontSize / 4 : props.fontSize / 4) / props.scale;

      // if max M
      if (labelsXM.length > 2 && s !== 0 && s !== labelsXM.length - 1) {
        px = 3 / props.scale;
        pz = (vM < 0 ? -props.fontSize / 2 : props.fontSize) / props.scale;
      }

      result2M.push([
        xc,
        zc,
        xc - vMraw * nx * scaleByM,
        zc - vMraw * ny * scaleByM,
        xc - vMraw * nx * scaleByM + px,
        zc - vMraw * ny * scaleByM + pz,
        vM,
      ]);
    }
  }

  const ret = {
    normal: { values: `${n1.coords[0]},${n1.coords[2]} ${result}${n2.coords[0]},${n2.coords[2]}`, text: result2 },
    shear: { values: `${n1.coords[0]},${n1.coords[2]} ${resultV}${n2.coords[0]},${n2.coords[2]}`, text: result2V },
    moment: { values: `${n1.coords[0]},${n1.coords[2]} ${resultM}${n2.coords[0]},${n2.coords[2]}`, text: result2M },
  };

  if (!props.showBendingMoment) {
    ret.moment.text = [];
    ret.moment.values = '';
  }

  if (!props.showShearForce) {
    ret.shear.text = [];
    ret.shear.values = '';
  }

  if (!props.showNormalForce) {
    ret.normal.text = [];
    ret.normal.values = '';
  }

  return ret;
});

const emit = defineEmits(['elementmousemove', 'elementpointerup']);
</script>

<template>
  <g class="element element-1d">
    <path
      v-if="loadCase.solved && showDeformedShape"
      :d="results"
      vector-effect="non-scaling-stroke"
      class="deformedShape"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <g v-if="loadCase.solved && showNormalForce" class="normal">
      <polyline
        :points="forces.normal.values"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g v-for="(mv, mli) in forces.normal.text" :key="mli" :transform="`translate(${mv[0]} ${mv[1]})`">
        <text
          :font-size="fontSize / scale"
          class="moment-label filter-text-label"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
      </g>
    </g>
    <g v-if="loadCase.solved && showShearForce" class="shear">
      <polyline
        :points="forces.shear.values"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g v-for="(mv, mli) in forces.shear.text" :key="mli" :transform="`translate(${mv[0]} ${mv[1]})`">
        <text
          :font-size="fontSize / scale"
          class="moment-label filter-text-label"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
      </g>
    </g>

    <g v-if="loadCase.solved && showBendingMoment" class="moment">
      <polyline
        :points="forces.moment.values"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g v-for="(mv, mli) in forces.moment.text" :key="mli">
        <polyline
          :points="`${mv[0]},${mv[1]} ${mv[2]},${mv[3]}`"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <text
          :font-size="fontSize / scale"
          class="moment-label filter-text-label"
          font-weight="normal"
          :text-anchor="mv[6] < 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
          :transform="`translate(${mv[4]} ${mv[5]})`"
        >
          {{ numberFormat.format(Math.abs(mv[6]) < 1e-6 ? 0 : mv[6]) }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label"
          font-weight="normal"
          :text-anchor="mv[6] < 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
          :transform="`translate(${mv[4]} ${mv[5]})`"
        >
          {{ numberFormat.format(Math.abs(mv[6]) < 1e-6 ? 0 : mv[6]) }}
        </text>
      </g>
    </g>

    <polyline :points="elementCoords" vector-effect="non-scaling-stroke" class="drawable" stroke-linecap="round" />

    <polyline :points="elementFibers" class="fibers" stroke-dasharray="5 4" vector-effect="non-scaling-stroke" />

    <circle
      v-if="element.hinges[0]"
      :transform="`translate(${elementHinges[0]})`"
      :r="6 / scale"
      fill="white"
      stroke="black"
      vector-effect="non-scaling-stroke"
      stroke-width="2"
    />

    <circle
      v-if="element.hinges[1]"
      :transform="`translate(${elementHinges[1]})`"
      :r="6 / scale"
      fill="white"
      stroke="black"
      vector-effect="non-scaling-stroke"
      stroke-width="2"
    />

    <g>
      <text
        v-if="showLabel"
        :x="
          (element.domain.nodes.get(element.nodes[0])!.coords[0] +
            element.domain.nodes.get(element.nodes[1])!.coords[0]) /
          2
        "
        :y="
          (element.domain.nodes.get(element.nodes[0])!.coords[2] +
            element.domain.nodes.get(element.nodes[1])!.coords[2]) /
          2
        "
        :font-size="fontSize / scale"
        font-weight="normal"
        text-anchor="middle"
        dominant-baseline="central"
        :transform="`${elementLabel} rotate(${elementAngle} ${
          (element.domain.nodes.get(element.nodes[0])!.coords[0] +
            element.domain.nodes.get(element.nodes[1])!.coords[0]) /
          2
        } ${
          (element.domain.nodes.get(element.nodes[0])!.coords[2] +
            element.domain.nodes.get(element.nodes[1])!.coords[2]) /
          2
        })`"
      >
        {{ element.label }}
      </text>
    </g>

    <polyline
      :points="elementCoords"
      vector-effect="non-scaling-stroke"
      class="handle"
      :data-element-id="element.label"
      @mousemove="emit('elementmousemove', $event, element)"
      @pointerup="emit('elementpointerup', $event)"
    />
  </g>
</template>
