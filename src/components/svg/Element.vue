<script lang="ts" setup>
import { Matrix } from "mathjs";
import { Node, DofID, LoadCase, Beam2D } from "ts-fem";
import { computed } from "vue";

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
  }>(),
  {
    padding: 10,
  }
);

const elementCoords = computed(() => {
  const nodes = props.element.nodes.map((n) => props.element.domain.nodes.get(n)!.coords);
  return nodes.map((n: number[]) => `${n[0]},${n[2]}`).join(" ");
});

const elementFibers = computed(() => {
  const geo = props.element.computeGeo();
  const nz = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  const nodes = props.element.nodes.map((n) => props.element.domain.nodes.get(n)!.coords);

  return nodes.map((n: number[]) => `${n[0] + (nx * 3) / props.scale},${n[2] + (nz * 3) / props.scale}`).join(" ");
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
  if (!props.loadCase.solved || !props.showDeformedShape) return "";

  let result = "";
  const nseg = 20;
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

    result += `${xc + def.u[s] * scaleBy},${zc + def.w[s] * scaleBy} `;
  }

  return result;
});

const forces = computed(() => {
  if (!props.loadCase.solved || !props.showDeformedShape) return {};

  let result = "";
  let resultV = "";
  let resultM = "";

  const nseg = 1;
  const nsegM = props.loadCase.elementLoadList.filter((l) => l.target === props.element.label).length === 0 ? 1 : 20;
  const scaleBy = props.normalForceMultiplier / props.scale;
  const scaleByV = props.shearForceMultiplier / props.scale;
  const scaleByM = props.bendingMomentMultiplier / props.scale;
  const n1 = props.element.domain.nodes.get(props.element.nodes[0]) as Node;
  const n2 = props.element.domain.nodes.get(props.element.nodes[1]) as Node;
  const forces = props.element.computeNormalForce(props.loadCase, nseg);
  const forcesV = props.element.computeShearForce(props.loadCase, nseg);
  const forcesM = props.element.computeBendingMoment(props.loadCase, nsegM);
  const geo = props.element.computeGeo();
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  const nx = geo.dz / geo.l;
  const ny = -geo.dx / geo.l;

  for (let s = 0; s <= nseg; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nseg;
    const zc = n1.coords[2] + (sin * geo.l * s) / nseg;

    result += `${xc + forces.N[s] * nx * scaleBy},${zc + forces.N[s] * ny * scaleBy} `;
    resultV += `${xc + forcesV.V[s] * nx * scaleByV},${zc + forcesV.V[s] * ny * scaleByV} `;
  }

  // Calculate V(x)=0
  const dV = forcesV.V[nseg] - forcesV.V[0];
  let xmax = 0;

  if (Math.abs(dV) > 1e-6) {
    xmax = -(forcesV.V[0] * geo.l) / dV;
  }

  for (let s = 0; s <= nsegM; s++) {
    const xc = n1.coords[0] + (cos * geo.l * s) / nsegM;
    const zc = n1.coords[2] + (sin * geo.l * s) / nsegM;

    const nx = -geo.dz / geo.l;
    const ny = geo.dx / geo.l;

    resultM += `${xc + forcesM.M[s] * nx * scaleByM},${zc + forcesM.M[s] * ny * scaleByM} `;
  }

  const result2 = [];
  const result2V = [];
  const result2M = [];

  const labelsX = [0, geo.l];
  const labelsXM = xmax > 0 && xmax < geo.l ? [0, xmax, geo.l] : [0, geo.l];

  for (let s = 0; s < labelsX.length; s++) {
    const xc = n1.coords[0] + cos * labelsX[s];
    const zc = n1.coords[2] + sin * labelsX[s];

    let vk = Math.ceil((labelsX[s] / geo.l) * nseg);
    const vN = props.convertForce(forces.N[vk]);
    if (Math.abs(vN) > 1e-8) {
      const p = (vN > 0 ? -4 : 4) / props.scale;
      result2.push([xc + forces.N[vk] * nx * scaleBy + p, zc + forces.N[vk] * ny * scaleBy + p, vN]);
    }

    vk = Math.ceil((labelsX[s] / geo.l) * nseg);
    const vV = props.convertForce(forcesV.V[vk]);
    if (Math.abs(vV) > 1e-8) {
      const p = (vV > 0 ? -4 : 4) / props.scale;
      result2V.push([xc + forcesV.V[vk] * nx * scaleByV + p, zc + forcesV.V[vk] * ny * scaleByV + p, vV]);
    }
  }

  for (let s = 0; s < labelsXM.length; s++) {
    const xc = n1.coords[0] + cos * labelsXM[s];
    const zc = n1.coords[2] + sin * labelsXM[s];

    const vk = Math.ceil((labelsXM[s] / geo.l) * nsegM);
    const vM = props.convertForce(forcesM.M[vk]);
    if (Math.abs(vM) > 1e-8) {
      let p = (vM < 0 ? -4 : 4) / props.scale;

      // if max M
      if (labelsXM.length === 3 && s === 1) {
        p = (vM < 0 ? -6 : 14) / props.scale;
      }

      result2M.push([xc - forcesM.M[vk] * nx * scaleByM + p, zc - forcesM.M[vk] * ny * scaleByM + p, vM]);
    }
  }

  return {
    normal: { values: `${n1.coords[0]},${n1.coords[2]} ${result}${n2.coords[0]},${n2.coords[2]}`, text: result2 },
    shear: { values: `${n1.coords[0]},${n1.coords[2]} ${resultV}${n2.coords[0]},${n2.coords[2]}`, text: result2V },
    moment: { values: `${n1.coords[0]},${n1.coords[2]} ${resultM}${n2.coords[0]},${n2.coords[2]}`, text: result2M },
  };
});

const emit = defineEmits(["elementmousemove", "elementpointerup"]);
</script>

<template>
  <g class="element element-1d">
    <polyline
      v-if="loadCase.solved && showDeformedShape"
      :points="results"
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
          :font-size="13 / scale"
          class="moment-label"
          filter="url(#textLabel)"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
        </text>
        <text
          :font-size="13 / scale"
          class="moment-label"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
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
          :font-size="13 / scale"
          class="moment-label"
          filter="url(#textLabel)"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
        </text>
        <text
          :font-size="13 / scale"
          class="moment-label"
          font-weight="normal"
          :text-anchor="mv[2] > 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
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
      <g v-for="(mv, mli) in forces.moment.text" :key="mli" :transform="`translate(${mv[0]} ${mv[1]})`">
        <text
          :font-size="13 / scale"
          class="moment-label"
          filter="url(#textLabel)"
          font-weight="normal"
          :text-anchor="mv[2] < 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
        </text>
        <text
          :font-size="13 / scale"
          class="moment-label"
          font-weight="normal"
          :text-anchor="mv[2] < 0 ? 'end' : 'start'"
          dominant-baseline="baseline"
        >
          {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
        </text>
      </g>
    </g>

    <polyline :points="elementCoords" vector-effect="non-scaling-stroke" class="drawable" stroke-linecap="round" />

    <polyline :points="elementFibers" class="fibers" stroke-dasharray="5 4" vector-effect="non-scaling-stroke" />

    <circle
      :transform="`translate(${elementHinges[0]})`"
      :r="6 / scale"
      fill="white"
      stroke="black"
      vector-effect="non-scaling-stroke"
      stroke-width="2"
      v-if="element.hinges[0]"
    />

    <circle
      :transform="`translate(${elementHinges[1]})`"
      :r="6 / scale"
      fill="white"
      stroke="black"
      vector-effect="non-scaling-stroke"
      stroke-width="2"
      v-if="element.hinges[1]"
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
        :font-size="14 / scale"
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
