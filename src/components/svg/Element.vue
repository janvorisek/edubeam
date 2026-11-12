<script lang="ts" setup>
import { smoothPath } from '../../utils/smoothPath';
import { Node, LoadCase, Beam2D, BeamConcentratedLoad, BeamElementTrapezoidalEdgeLoad } from 'ts-fem';
import { computed } from 'vue';
import {
  DEFAULT_DIAGRAM_STYLE,
  HATCH_SPACING_PX,
  hatchPositions,
  polynomialDegree,
  type DiagramSamples,
  type DiagramStyle,
} from '@/utils/diagramStyle';

type ResultLabelMode = 'axis' | 'horizontal';
type ResultLabelAnchor = 'start' | 'end' | 'middle';

const props = withDefaults(
  defineProps<{
    element: Beam2D;
    scale: number;
    showDeformedShape: boolean;
    showNormalForce: boolean;
    showShearForce: boolean;
    showBendingMoment: boolean;
    showLabel: boolean;
    showLabelBackground?: boolean;
    convertForce: (f: number) => number;
    convertMoment: (m: number) => number;
    loadCase: LoadCase;
    deformedShapeMultiplier: number;
    normalForceMultiplier: number;
    shearForceMultiplier: number;
    bendingMomentMultiplier: number;
    resultLabelMode?: ResultLabelMode;
    padding?: number;
    fontSize?: number;
    numberFormat?: Intl.NumberFormat;
    showGeometry?: boolean;
    showResults?: boolean;
    diagramStyle?: DiagramStyle;
  }>(),
  {
    padding: 10,
    fontSize: 13,
    showLabelBackground: true,
    resultLabelMode: 'axis',
    numberFormat: () => new Intl.NumberFormat(),
    showGeometry: true,
    showResults: true,
    diagramStyle: () => ({ ...DEFAULT_DIAGRAM_STYLE }),
  }
);

/** A value label of N(x) or V(x): where it goes, the value, and how it is turned. */
type ForceLabel = [x: number, y: number, value: number, angle: number, anchor: ResultLabelAnchor];
/** A value label of M(x), with the leader from the outline to it. */
type MomentLabel = [
  axisX: number,
  axisY: number,
  chartX: number,
  chartY: number,
  labelX: number,
  labelY: number,
  value: number,
  isExtrema: boolean,
  angle: number,
  anchor: ResultLabelAnchor,
];

/** A diagram's outline, its labels, and what the style adds: hatch lines and segment degrees. */
type DiagramDrawing<Label> = {
  values: string;
  text: Label[];
  hatch: string;
  degrees: [x: number, y: number, text: string][];
};
type Diagrams = {
  normal: DiagramDrawing<ForceLabel>;
  shear: DiagramDrawing<ForceLabel>;
  moment: DiagramDrawing<MomentLabel>;
};

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

function resultLabelOffset(rawValue: number, nx: number, ny: number, factor = 0.45) {
  const offset = (props.fontSize * factor) / props.scale;
  const direction = Math.sign(rawValue) || 1;

  return [nx * direction * offset, ny * direction * offset];
}

function resultLabelOrientation(
  rawValue: number,
  nx: number,
  ny: number,
  position: number,
  length: number,
  labelDx: number,
  tangentX: number,
  labelX: number,
  beamMidX: number
): { angle: number; anchor: ResultLabelAnchor } {
  if (props.resultLabelMode === 'horizontal') {
    const endpointTolerance = 1e-6;
    const horizontalAnchor: ResultLabelAnchor =
      Math.abs(labelX - beamMidX) < 1e-6 ? (tangentX >= 0 ? 'start' : 'end') : labelX < beamMidX ? 'end' : 'start';

    if (position <= endpointTolerance) {
      return { angle: 0, anchor: horizontalAnchor };
    }

    if (Math.abs(position - length) <= endpointTolerance) {
      return { angle: 0, anchor: horizontalAnchor };
    }

    return { angle: 0, anchor: 'middle' as ResultLabelAnchor };
  }

  const direction = Math.sign(rawValue) || 1;
  const outwardX = nx * direction;
  const outwardY = ny * direction;
  let angle = (Math.atan2(ny * direction, nx * direction) * 180) / Math.PI;

  if (Math.abs(Math.abs(angle) - 90) < 1e-6) {
    angle = -90;
  } else if (angle > 90) {
    angle -= 180;
  } else if (angle <= -90) {
    angle += 180;
  }

  const angleRad = (angle * Math.PI) / 180;
  const localXWorldX = Math.cos(angleRad);
  const localXWorldY = Math.sin(angleRad);
  const anchor = localXWorldX * outwardX + localXWorldY * outwardY < 0 ? 'end' : 'start';

  return { angle, anchor };
}

function labelAnchorOffset(anchor: ResultLabelAnchor) {
  if (anchor === 'middle') return 0;
  return anchor === 'end' ? -2 / props.scale : 2 / props.scale;
}

const elementLabel = computed(() => {
  const geo = props.element.computeGeo();
  const ny = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  return `translate(${(-props.padding * nx) / props.scale}, ${(-props.padding * ny) / props.scale})`;
});

/** How far from its node a hinge circle sits, 9px unless the element is drawn shorter than that. */
const HINGE_OFFSET_PX = 9;

const hingeOffset = computed(() => {
  const geo = props.element.computeGeo();

  // In a small preview the element can be only a few pixels long, and an offset taken purely from
  // the scale would put the circle past the far node - drawing the hinge at the wrong end.
  return Math.min(HINGE_OFFSET_PX / props.scale, geo.l / 3);
});

const elementHinges = computed(() => {
  const n1 = props.element.domain.nodes.get(props.element.nodes[0]) as Node;
  const n2 = props.element.domain.nodes.get(props.element.nodes[1]) as Node;

  const geo = props.element.computeGeo();
  const offset = hingeOffset.value;

  const nx = (geo.dx / geo.l) * offset;
  const nz = (geo.dz / geo.l) * offset;

  const line1 = `${n1.coords[0] + nx}, ${n1.coords[2] + nz}`;
  const line2 = `${n2.coords[0] - nx}, ${n2.coords[2] - nz}`;

  return { 0: line1, 1: line2 };
});

/** The circle has to stay inside the element too, for the same reason. */
const hingeRadius = computed(() => Math.min(6 / props.scale, hingeOffset.value * (2 / 3)));

const results = computed(() => {
  if (!props.loadCase.solved || !props.showDeformedShape) return '';

  const result = [];
  const hinges = props.element.hinges[0] && props.element.hinges[1];
  const eload = props.loadCase.elementLoadList.filter((l) => l.target === props.element.label);
  const truss = hinges && eload.length === 0;

  const nseg = truss ? 1 : 16;
  const scaleBy = props.deformedShapeMultiplier / props.scale;
  const n1 = props.element.domain.nodes.get(props.element.nodes[0]) as Node;
  const def = props.element.computeGlobalDefl(props.loadCase, nseg);

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

/**
 * An outline without its tint keeps its fill, at zero opacity: SVG hit-tests painted fill only, so
 * with `fill: none` hovering a hatched diagram caught the lines and fell through the gaps between
 * them, and the hover flickered. Setting `pointer-events` instead would also have overridden the
 * `pointer-events: none` the hover highlight inherits, and the highlight then caught the pointer.
 */
const unfilled = computed(() => (props.diagramStyle.fill === 'solid' ? undefined : 'fill-opacity: 0'));

const noDiagram = () => ({ text: [], values: '', hatch: '', degrees: [] });

const forces = computed((): Diagrams => {
  if (!props.loadCase.solved) return { normal: noDiagram(), shear: noDiagram(), moment: noDiagram() };

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

  const style = props.diagramStyle;

  // Which side of the member each diagram's positive values go: N and V away from the dashed line
  // unless chosen otherwise, M on the dashed side - the tension side of a positive moment.
  const normalSide = style.normalOnDashedSide ? -1 : 1;
  const shearSide = style.shearOnDashedSide ? -1 : 1;
  const momentSide = style.momentOnTensionSide ? 1 : -1;

  const nNx = (normalSide * geo.dz) / geo.l;
  const nNy = (-normalSide * geo.dx) / geo.l;
  const nVx = (shearSide * geo.dz) / geo.l;
  const nVy = (-shearSide * geo.dx) / geo.l;
  const momentNx = (-momentSide * geo.dz) / geo.l;
  const momentNy = (momentSide * geo.dx) / geo.l;

  const normalSamples: [number, number][] = [];
  const shearSamples: [number, number][] = [];
  const momentSamples: [number, number][] = [];

  // Calculate V(x)=0
  //const dV = forcesV.V[nseg] - forcesV.V[0];
  const xmax = 0;

  // if (Math.abs(dV) > 1e-6) {
  //   xmax = -(forcesV.V[0] * geo.l) / dV;
  // }

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
    labelsX.push(c.values[3] - 1e-7);
    labelsX.push(c.values[3] + 1e-7);

    nvvalues.push(c.values[3] - 1e-7);
    nvvalues.push(c.values[3] + 1e-7);

    // if concentrated moment
    if (Math.abs(c.values[2]) > 1e-32) {
      labelsXM.push(c.values[3] - 1e-7);
      labelsXM.push(c.values[3] + 1e-7);
      mvalues.push(c.values[3] - 1e-7);
      mvalues.push(c.values[3] + 1e-7);
    } else {
      labelsXM.push(c.values[3]);
      mvalues.push(c.values[3]);
    }
  }

  // if element contains trapezoidal load, need to use segments
  const hasTrapezoidal = props.loadCase.elementLoadList.some(
    (l) => l.target === props.element.label && l instanceof BeamElementTrapezoidalEdgeLoad
  );

  // Trapezoidal has second degree Vz(x) and third order My(x)
  // TODO: must use odd number so we can guess Vz(x)=0 for max My estimation
  if (hasTrapezoidal) {
    for (let s = 0; s <= 11; s++) {
      nvvalues.push((geo.l * s) / 11);
    }
  }

  // TODO: why is nseg = 1 by default
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

    normalSamples.push([nvvalues[s], vNraw]);
    shearSamples.push([nvvalues[s], vVraw]);

    result += `${xc + vNraw * nNx * scaleBy},${zc + vNraw * nNy * scaleBy} `;
    resultV += `${xc + vVraw * nVx * scaleByV},${zc + vVraw * nVy * scaleByV} `;
  }

  for (let s = 0; s < mvalues.length; s++) {
    const xc = n1.coords[0] + cos * mvalues[s];
    const zc = n1.coords[2] + sin * mvalues[s];

    const vMraw = props.element.computeBendingMomentAt(props.loadCase, mvalues[s]);
    if (Math.abs(vMraw) < 1e-6) nMzero++;

    momentSamples.push([mvalues[s], vMraw]);

    resultM += `${xc + vMraw * momentNx * scaleByM},${zc + vMraw * momentNy * scaleByM} `;
  }

  if (nNzero === nvvalues.length) result = '';
  if (nVzero === nvvalues.length) resultV = '';
  if (nMzero === mvalues.length) resultM = '';

  const result2: ForceLabel[] = [];
  const result2V: ForceLabel[] = [];
  const result2M: MomentLabel[] = [];

  for (let s = 0; s < labelsX.length; s++) {
    const xc = n1.coords[0] + cos * labelsX[s];
    const zc = n1.coords[2] + sin * labelsX[s];

    const vNraw = props.element.computeNormalForceAt(props.loadCase, labelsX[s]);
    const vN = props.convertForce(vNraw);
    if (Math.abs(vN) > 1e-8) {
      const [dx, dy] = resultLabelOffset(vNraw, nNx, nNy);
      const labelX = xc + vNraw * nNx * scaleBy + dx;
      const orientation = resultLabelOrientation(
        vNraw,
        nNx,
        nNy,
        labelsX[s],
        geo.l,
        vNraw * nNx * scaleBy + dx,
        cos,
        labelX,
        (n1.coords[0] + n2.coords[0]) / 2
      );
      result2.push([labelX, zc + vNraw * nNy * scaleBy + dy, vN, orientation.angle, orientation.anchor]);
    }

    const vVraw = props.element.computeShearForceAt(props.loadCase, labelsX[s]);
    const vV = props.convertForce(vVraw);
    if (Math.abs(vV) > 1e-8) {
      const [dx, dy] = resultLabelOffset(vVraw, nVx, nVy);
      const labelX = xc + vVraw * nVx * scaleByV + dx;
      const orientation = resultLabelOrientation(
        vVraw,
        nVx,
        nVy,
        labelsX[s],
        geo.l,
        vVraw * nVx * scaleByV + dx,
        cos,
        labelX,
        (n1.coords[0] + n2.coords[0]) / 2
      );
      result2V.push([labelX, zc + vVraw * nVy * scaleByV + dy, vV, orientation.angle, orientation.anchor]);
    }
  }

  for (let s = 0; s < labelsXM.length; s++) {
    const xc = n1.coords[0] + cos * labelsXM[s];
    const zc = n1.coords[2] + sin * labelsXM[s];

    const vMraw = props.element.computeBendingMomentAt(props.loadCase, labelsXM[s]);
    const vM = props.convertMoment(vMraw);
    if (Math.abs(vMraw) > 1e-8) {
      const isExtrema = labelsXM.length > 2 && s !== 0 && s !== labelsXM.length - 1;
      const chartX = xc + vMraw * momentNx * scaleByM;
      const chartY = zc + vMraw * momentNy * scaleByM;
      const [dx, dy] = resultLabelOffset(vMraw, momentNx, momentNy, isExtrema ? 0.7 : 0.45);
      const orientation = resultLabelOrientation(
        vMraw,
        momentNx,
        momentNy,
        labelsXM[s],
        geo.l,
        chartX + dx - xc,
        cos,
        chartX + dx,
        (n1.coords[0] + n2.coords[0]) / 2
      );

      result2M.push([
        xc,
        zc,
        chartX,
        chartY,
        chartX + dx,
        chartY + dy,
        vM,
        isExtrema,
        orientation.angle,
        orientation.anchor,
      ]);
    }
  }

  /**
   * Hatch lines across the member from its axis to the outline, a fixed distance apart on screen,
   * as diagrams are drawn by hand. They end on the outline because they read the same samples.
   */
  const hatch = (samples: DiagramSamples, scaleBy: number, normalX: number, normalY: number) => {
    if (style.fill !== 'hatch') return '';

    const spacing = HATCH_SPACING_PX / props.scale;
    // shorter than a pixel on screen is no line
    const minimum = 1 / props.scale / Math.max(Math.abs(scaleBy), 1e-300);

    return hatchPositions(samples, geo.l, spacing, minimum)
      .map(([position, value]) => {
        const x = n1.coords[0] + cos * position;
        const z = n1.coords[2] + sin * position;
        return `M${x},${z}L${x + value * normalX * scaleBy},${z + value * normalY * scaleBy}`;
      })
      .join('');
  };

  /**
   * The degree of each piece of a diagram between the points where a point load breaks it, written
   * inside the diagram halfway out from the axis - or just outside it when it is too thin for that.
   */
  const breaks = [...new Set([0, ...concentrated.map((c) => c.values[3]), geo.l])]
    .filter((x) => x >= 0 && x <= geo.l)
    .sort((a, b) => a - b);

  const degrees = (
    valueAt: (x: number) => number,
    scaleBy: number,
    normalX: number,
    normalY: number
  ): [number, number, string][] => {
    if (!style.showDegrees) return [];

    const labels: [number, number, string][] = [];

    for (let i = 0; i < breaks.length - 1; i++) {
      const [a, b] = [breaks[i], breaks[i + 1]];
      if (b - a < 1e-9) continue;

      // five equally spaced points inside the piece, clear of the jumps at its ends
      const degree = polynomialDegree([0.1, 0.3, 0.5, 0.7, 0.9].map((t) => valueAt(a + t * (b - a))));
      if (degree === null) continue;

      const middle = (a + b) / 2;
      const value = valueAt(middle);
      const reachPx = Math.abs(value * scaleBy) * props.scale;
      const outward = Math.sign(value) || 1;
      const fromAxis =
        reachPx >= 2 * props.fontSize
          ? (value * scaleBy) / 2
          : value * scaleBy + (outward * props.fontSize * 0.9) / props.scale;

      labels.push([
        n1.coords[0] + cos * middle + normalX * fromAxis,
        n1.coords[2] + sin * middle + normalY * fromAxis,
        `${degree}°`,
      ]);
    }

    return labels;
  };

  const loadCase = props.loadCase;
  const element = props.element;

  const ret: Diagrams = {
    normal: {
      values: `${n1.coords[0]},${n1.coords[2]} ${result}${n2.coords[0]},${n2.coords[2]}`,
      text: result2,
      hatch: result ? hatch(normalSamples, scaleBy, nNx, nNy) : '',
      // only for a diagram on show: each degree asks the solver for five values
      degrees: props.showNormalForce
        ? degrees((x) => element.computeNormalForceAt(loadCase, x), scaleBy, nNx, nNy)
        : [],
    },
    shear: {
      values: `${n1.coords[0]},${n1.coords[2]} ${resultV}${n2.coords[0]},${n2.coords[2]}`,
      text: result2V,
      hatch: resultV ? hatch(shearSamples, scaleByV, nVx, nVy) : '',
      // only for a diagram on show: each degree asks the solver for five values
      degrees: props.showShearForce ? degrees((x) => element.computeShearForceAt(loadCase, x), scaleByV, nVx, nVy) : [],
    },
    moment: {
      values: `${n1.coords[0]},${n1.coords[2]} ${resultM}${n2.coords[0]},${n2.coords[2]}`,
      text: result2M,
      hatch: resultM ? hatch(momentSamples, scaleByM, momentNx, momentNy) : '',
      // only for a diagram on show: each degree asks the solver for five values
      degrees: props.showBendingMoment
        ? degrees((x) => element.computeBendingMomentAt(loadCase, x), scaleByM, momentNx, momentNy)
        : [],
    },
  };

  if (!props.showBendingMoment) {
    ret.moment = noDiagram();
  }

  if (!props.showShearForce) {
    ret.shear = noDiagram();
  }

  if (!props.showNormalForce) {
    ret.normal = noDiagram();
  }

  return ret;
});

const emit = defineEmits(['elementresultsmousemove', 'elementpointerup']);
</script>

<template>
  <g class="element element-1d">
    <path
      v-if="showResults && loadCase.solved && showDeformedShape"
      data-fit-ignore="results"
      :d="results"
      vector-effect="non-scaling-stroke"
      class="deformedShape pointer-events-none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />

    <g
      v-if="showResults && loadCase.solved && showNormalForce"
      class="normal"
      data-fit-ignore="results"
      @mousemove="emit('elementresultsmousemove', $event, element)"
      @pointerup="emit('elementpointerup', $event)"
    >
      <polyline
        :points="forces.normal.values"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="unfilled"
      />
      <path v-if="forces.normal.hatch" :d="forces.normal.hatch" class="hatch" vector-effect="non-scaling-stroke" />
      <template v-for="(degree, di) in forces.normal.degrees" :key="`degree-${di}`">
        <text
          v-if="showLabelBackground"
          :font-size="fontSize / scale"
          class="moment-label degree-label filter-text-label"
          :x="degree[0]"
          :y="degree[1]"
          text-anchor="middle"
          dy="0.35em"
        >
          {{ degree[2] }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label degree-label"
          :x="degree[0]"
          :y="degree[1]"
          text-anchor="middle"
          dy="0.35em"
        >
          {{ degree[2] }}
        </text>
      </template>
      <g
        v-for="(mv, mli) in forces.normal.text"
        :key="mli"
        :transform="`translate(${mv[0]} ${mv[1]}) rotate(${mv[3]})`"
      >
        <text
          v-if="showLabelBackground"
          :font-size="fontSize / scale"
          class="moment-label filter-text-label"
          font-weight="normal"
          :x="labelAnchorOffset(mv[4])"
          y="0"
          :text-anchor="mv[4]"
          dy="0.35em"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label"
          font-weight="normal"
          :x="labelAnchorOffset(mv[4])"
          y="0"
          :text-anchor="mv[4]"
          dy="0.35em"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
      </g>
    </g>
    <g
      v-if="showResults && loadCase.solved && showShearForce"
      class="shear"
      data-fit-ignore="results"
      @mousemove="emit('elementresultsmousemove', $event, element)"
      @pointerup="emit('elementpointerup', $event)"
    >
      <polyline
        :points="forces.shear.values"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="unfilled"
      />
      <path v-if="forces.shear.hatch" :d="forces.shear.hatch" class="hatch" vector-effect="non-scaling-stroke" />
      <template v-for="(degree, di) in forces.shear.degrees" :key="`degree-${di}`">
        <text
          v-if="showLabelBackground"
          :font-size="fontSize / scale"
          class="moment-label degree-label filter-text-label"
          :x="degree[0]"
          :y="degree[1]"
          text-anchor="middle"
          dy="0.35em"
        >
          {{ degree[2] }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label degree-label"
          :x="degree[0]"
          :y="degree[1]"
          text-anchor="middle"
          dy="0.35em"
        >
          {{ degree[2] }}
        </text>
      </template>
      <g v-for="(mv, mli) in forces.shear.text" :key="mli" :transform="`translate(${mv[0]} ${mv[1]}) rotate(${mv[3]})`">
        <text
          v-if="showLabelBackground"
          :font-size="fontSize / scale"
          class="moment-label filter-text-label"
          font-weight="normal"
          :x="labelAnchorOffset(mv[4])"
          y="0"
          :text-anchor="mv[4]"
          dy="0.35em"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label"
          font-weight="normal"
          :x="labelAnchorOffset(mv[4])"
          y="0"
          :text-anchor="mv[4]"
          dy="0.35em"
        >
          {{ numberFormat.format(Math.abs(mv[2]) < 1e-6 ? 0 : mv[2]) }}
        </text>
      </g>
    </g>

    <g
      v-if="showResults && loadCase.solved && showBendingMoment"
      class="moment"
      data-fit-ignore="results"
      @mousemove="emit('elementresultsmousemove', $event, element)"
      @pointerup="emit('elementpointerup', $event)"
    >
      <polyline
        :points="forces.moment.values"
        vector-effect="non-scaling-stroke"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="unfilled"
      />
      <path v-if="forces.moment.hatch" :d="forces.moment.hatch" class="hatch" vector-effect="non-scaling-stroke" />
      <template v-for="(degree, di) in forces.moment.degrees" :key="`degree-${di}`">
        <text
          v-if="showLabelBackground"
          :font-size="fontSize / scale"
          class="moment-label degree-label filter-text-label"
          :x="degree[0]"
          :y="degree[1]"
          text-anchor="middle"
          dy="0.35em"
        >
          {{ degree[2] }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label degree-label"
          :x="degree[0]"
          :y="degree[1]"
          text-anchor="middle"
          dy="0.35em"
        >
          {{ degree[2] }}
        </text>
      </template>
      <g v-for="(mv, mli) in forces.moment.text" :key="mli">
        <polyline
          :points="`${mv[0]},${mv[1]} ${mv[2]},${mv[3]}`"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <text
          v-if="showLabelBackground"
          :font-size="fontSize / scale"
          class="moment-label filter-text-label"
          font-weight="normal"
          :x="labelAnchorOffset(mv[9])"
          y="0"
          :text-anchor="mv[9]"
          dy="0.35em"
          :transform="`translate(${mv[4]} ${mv[5]}) rotate(${mv[8]})`"
        >
          {{ numberFormat.format(Math.abs(mv[6]) < 1e-6 ? 0 : mv[6]) }}
        </text>
        <text
          :font-size="fontSize / scale"
          class="moment-label"
          font-weight="normal"
          :x="labelAnchorOffset(mv[9])"
          y="0"
          :text-anchor="mv[9]"
          dy="0.35em"
          :transform="`translate(${mv[4]} ${mv[5]}) rotate(${mv[8]})`"
        >
          {{ numberFormat.format(Math.abs(mv[6]) < 1e-6 ? 0 : mv[6]) }}
        </text>
      </g>
    </g>

    <template v-if="showGeometry">
      <polyline :points="elementCoords" vector-effect="non-scaling-stroke" class="drawable" stroke-linecap="round" />

      <polyline :points="elementFibers" class="fibers" stroke-dasharray="5 4" vector-effect="non-scaling-stroke" />

      <circle
        v-if="element.hinges[0]"
        :transform="`translate(${elementHinges[0]})`"
        :r="hingeRadius"
        fill="white"
        stroke="black"
        vector-effect="non-scaling-stroke"
        stroke-width="2"
      />

      <circle
        v-if="element.hinges[1]"
        :transform="`translate(${elementHinges[1]})`"
        :r="hingeRadius"
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
          dy="0.35em"
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
    </template>
  </g>
</template>
