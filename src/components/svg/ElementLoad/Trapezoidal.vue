<script lang="ts" setup>
import { Node, Beam2D, BeamElementTrapezoidalEdgeLoad, BeamElementUniformEdgeLoad } from 'ts-fem';
import { computed, inject } from 'vue';

const props = withDefaults(
  defineProps<{
    eload: BeamElementTrapezoidalEdgeLoad;
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

const viewer_uuid = inject<string>('viewer_uuid', 'default-viewer');

const target = computed(() => props.eload.domain.elements.get(props.eload.target) as Beam2D);
const n1 = computed(() => props.eload.domain.nodes.get(target.value.nodes[0]) as Node);
const n2 = computed(() => props.eload.domain.nodes.get(target.value.nodes[1]) as Node);

const tolerance = 1e-12;

const signWithTolerance = (value: number) => {
  if (Math.abs(value) <= tolerance) return 0;
  return value > 0 ? 1 : -1;
};

const directionFromComponents = (start: number, end: number) => {
  const sumSign = signWithTolerance(start + end);
  if (sumSign !== 0) return sumSign;

  const startSign = signWithTolerance(start);
  if (startSign !== 0) return startSign;

  const endSign = signWithTolerance(end);
  if (endSign !== 0) return endSign;

  return 1;
};

const valueDirection = (value: number, fallback: number) => {
  const sign = signWithTolerance(value);
  return sign === 0 ? fallback : sign;
};

const maxFxMagnitude = computed(() =>
  Math.max(Math.abs(props.eload.startValues[0]), Math.abs(props.eload.endValues[0]), tolerance)
);
const maxFzMagnitude = computed(() =>
  Math.max(Math.abs(props.eload.startValues[1]), Math.abs(props.eload.endValues[1]), tolerance)
);

const hasFxComponent = computed(() => maxFxMagnitude.value > tolerance);
const hasFzComponent = computed(() => maxFzMagnitude.value > tolerance);
const isFxConstant = computed(() => Math.abs(props.eload.startValues[0] - props.eload.endValues[0]) < tolerance);
const isFzConstant = computed(() => Math.abs(props.eload.startValues[1] - props.eload.endValues[1]) < tolerance);

const fxNormalDirection = computed(() => {
  if (hasFzComponent.value) {
    return directionFromComponents(props.eload.startValues[1], props.eload.endValues[1]);
  }

  return directionFromComponents(props.eload.startValues[0], props.eload.endValues[0]);
});

type Polygon = Array<[number, number]>;

const trapezoidPolygons = computed<Polygon[]>(() => {
  const polygons: Polygon[] = [];
  const geo = target.value.computeGeo();

  const nx = geo.dz / geo.l / props.scale;
  const nz = -geo.dx / geo.l / props.scale;

  const n1x = n1.value.coords[0];
  const n1z = n1.value.coords[2];
  const n2x = n2.value.coords[0];
  const n2z = n2.value.coords[2];

  const fzStart = props.eload.startValues[1];
  const fzEnd = props.eload.endValues[1];
  const fxStart = props.eload.startValues[0];
  const fxEnd = props.eload.endValues[0];

  const fzScale = maxFzMagnitude.value;
  const fxScale = maxFxMagnitude.value;

  const hasFz = hasFzComponent.value;
  const hasFx = hasFxComponent.value;

  if (hasFz) {
    const startOffsetX = (40 * nx * fzStart) / fzScale;
    const startOffsetZ = (40 * nz * fzStart) / fzScale;
    const endOffsetX = (40 * nx * fzEnd) / fzScale;
    const endOffsetZ = (40 * nz * fzEnd) / fzScale;

    polygons.push([
      [n1x + startOffsetX, n1z + startOffsetZ],
      [n2x + endOffsetX, n2z + endOffsetZ],
      [n2x, n2z],
      [n1x, n1z],
    ]);
  }

  if (hasFx) {
    const shiftMagnitude = hasFz ? 40 : 0;
    const startShiftDir = hasFz ? valueDirection(fxStart, fxNormalDirection.value) : 0;
    const endShiftDir = hasFz ? valueDirection(fxEnd, fxNormalDirection.value) : 0;
    const startShiftX = shiftMagnitude * startShiftDir * nx;
    const startShiftZ = shiftMagnitude * startShiftDir * nz;
    const endShiftX = shiftMagnitude * endShiftDir * nx;
    const endShiftZ = shiftMagnitude * endShiftDir * nz;

    const startOffsetX = (20 * nx * fxStart) / fxScale;
    const startOffsetZ = (20 * nz * fxStart) / fxScale;
    const endOffsetX = (20 * nx * fxEnd) / fxScale;
    const endOffsetZ = (20 * nz * fxEnd) / fxScale;

    polygons.push([
      [n1x + startOffsetX + startShiftX, n1z + startOffsetZ + startShiftZ],
      [n2x + endOffsetX + endShiftX, n2z + endOffsetZ + endShiftZ],
      [n2x + endShiftX, n2z + endShiftZ],
      [n1x + startShiftX, n1z + startShiftZ],
    ]);
  }

  return polygons;
});

const eloadPathData = computed(() =>
  trapezoidPolygons.value
    .map((polygon) => polygon.map(([x, z], idx) => `${idx === 0 ? 'M' : 'L'} ${x} ${z}`).join(' ') + ' Z')
    .join(' ')
);
//   const smallestsize = props.eload.values[0] !== 0 && props.eload.values[1] === 0 ? 20 : 40;
//   const nx = (geo.dz * smallestsize) / geo.l / props.scale;
//   const nz = (-geo.dx * smallestsize) / geo.l / props.scale;

//   const nx2 = (geo.dz * 60) / geo.l / props.scale;
//   const nz2 = (-geo.dx * 60) / geo.l / props.scale;

//   let line1 = '',
//     line2 = '',
//     line3 = '';

//   line1 = `${n1.value.coords[0]},${n1.value.coords[2]} ${n2.value.coords[0]},${n2.value.coords[2]}`;

//   line2 = `${n2.value.coords[0] + nx},${n2.value.coords[2] + nz} ${n1.value.coords[0] + nx},${n1.value.coords[2] + nz} ${n1.value.coords[0]},${
//     n1.value.coords[2]
//   }`;

//   line3 =
//     props.eload.values[0] !== 0 && props.eload.values[1] !== 0
//       ? `${n2.value.coords[0]},${n2.value.coords[2]} ${n2.value.coords[0] + nx2},${n2.value.coords[2] + nz2} ${n1.value.coords[0] + nx2},${
//           n1.value.coords[2] + nz2
//         }`
//       : ``;

//   return line1 + ' ' + line2 + ' ' + line3;
//});

const eloadForces = computed(() => {
  const geo = target.value.computeGeo();
  const nx = geo.dz / geo.l / props.scale;
  const nz = -geo.dx / geo.l / props.scale;
  let nseg = Math.ceil((geo.l * props.scale) / 50);
  let segsize = geo.l / nseg;
  const cos = geo.dx / geo.l;
  const sin = geo.dz / geo.l;

  const pts: [number, number, number][] = [];

  const eleAngleDeg = (Math.atan2(geo.dz, geo.dx) * 180) / Math.PI;

  // component fx
  if (hasFxComponent.value) {
    const fxStart = props.eload.startValues[0];
    const fxEnd = props.eload.endValues[0];
    const fallbackDir = directionFromComponents(fxStart, fxEnd);
    const normalMagnitude = 10 + (hasFzComponent.value ? 40 : 0);

    for (let s = 0.5; s < nseg; s += 1) {
      const ratio = s / nseg;
      const value = fxStart + (fxEnd - fxStart) * ratio;
      const dir = valueDirection(value, fallbackDir);

      if (Math.abs(value) <= tolerance) continue;

      const rotation = -90 + eleAngleDeg + (dir < 0 ? 180 : 0);
      const normalOffset = normalMagnitude * dir;

      pts.push([
        n1.value.coords[0] + s * cos * segsize + nx * normalOffset,
        n1.value.coords[2] + s * sin * segsize + nz * normalOffset,
        rotation,
      ]);
    }
  }

  // component fz
  if (hasFzComponent.value) {
    nseg = Math.floor((geo.l * props.scale) / 25);
    segsize = geo.l / nseg;
    const fzStart = props.eload.startValues[1];
    const fzEnd = props.eload.endValues[1];
    const fallbackDir = directionFromComponents(fzStart, fzEnd);

    for (let s = 0.5; s < nseg; s += 1) {
      const ratio = s / nseg;
      const value = fzStart + (fzEnd - fzStart) * ratio;
      const dir = valueDirection(value, fallbackDir);

      if (Math.abs(value) <= tolerance) continue;

      const rotation = eleAngleDeg + (dir < 0 ? 180 : 0);

      pts.push([
        n1.value.coords[0] + s * cos * segsize + nx * 20 * dir,
        n1.value.coords[2] + s * sin * segsize + nz * 20 * dir,
        rotation,
      ]);
    }
  }

  return pts;
});

const elementLoadsOnElement = computed(() =>
  target.value.domain.solver.loadCases[0].getElementLoadsOnElement(props.eload.target)
);

const elementLoadIndex = computed(() => {
  const idx = elementLoadsOnElement.value.indexOf(props.eload);
  return idx < 0 ? 0 : idx;
});

const hasPathData = computed(() => eloadPathData.value.length > 0);
const eloadPathId = computed(() => `trap-eload-path-${viewer_uuid}-${props.eload.target}-${elementLoadIndex.value}`);
const eloadPathHref = computed(() => `#${eloadPathId.value}`);
const eloadClipPathId = computed(() => `${eloadPathId.value}-clip`);
const eloadClipPathUrl = computed(() => (hasPathData.value ? `url(#${eloadClipPathId.value})` : undefined));

const labelTransforms = computed(() => {
  const geo = target.value.computeGeo();
  const nz = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;
  const tx = geo.dx / geo.l;
  const tz = geo.dz / geo.l;
  const dx3 = -(nz * 5) / props.scale;
  const dz3 = (nx * 5) / props.scale;
  const tangentPadding = 10;
  const labelPadding = 0;

  const scaledOffset = (value: number, base: number, max: number, dir: number) => {
    if (max <= tolerance || Math.abs(value) <= tolerance) return 0;
    return ((Math.abs(value) / max) * base + labelPadding) * dir;
  };

  const constantOffset = (base: number, dir: number) => (base + labelPadding) * dir;

  const makeTransform = (node: Node, dist: number, isFx: boolean, anchorRight: boolean) => {
    let x = node.coords[0];
    let z = node.coords[2];

    if (props.eload.lcs) {
      x += (-nx * dist) / props.scale;
      z += (-nz * dist) / props.scale;

      if (anchorRight) {
        x += (tx * tangentPadding) / props.scale;
        z += (tz * tangentPadding) / props.scale;
      }
    } else if (isFx) {
      const dir = anchorRight ? 1 : -1;
      x += (dir * dist) / props.scale;
    } else {
      const dir = anchorRight ? -1 : 1;
      z += (dir * dist) / props.scale;
    }

    x += dx3;
    z += dz3;

    return `translate(${x} ${z})`;
  };

  const fxNormalDir = fxNormalDirection.value;
  const fzFallbackDir = hasFzComponent.value
    ? directionFromComponents(props.eload.startValues[1], props.eload.endValues[1])
    : 1;
  const fzConstantDir = valueDirection(props.eload.startValues[1], fzFallbackDir);
  const fzStartDir = valueDirection(props.eload.startValues[1], fzFallbackDir);
  const fzEndDir = valueDirection(props.eload.endValues[1], fzFallbackDir);

  const fxBaseMagnitude = hasFzComponent.value ? 40 : 0;
  const fxConstantDir = valueDirection(props.eload.startValues[0], fxNormalDir);
  const fxStartDir = fxConstantDir;
  const fxEndDir = valueDirection(props.eload.endValues[0], fxNormalDir);

  const fxConstantDist = fxBaseMagnitude * fxConstantDir + constantOffset(20, fxConstantDir);
  const fzConstantDist = constantOffset(40, fzConstantDir);

  const fxStartDist =
    fxBaseMagnitude * fxStartDir + scaledOffset(props.eload.startValues[0], 20, maxFxMagnitude.value, fxStartDir);
  const fxEndDist =
    fxBaseMagnitude * fxEndDir + scaledOffset(props.eload.endValues[0], 20, maxFxMagnitude.value, fxEndDir);
  const fzStartDist = scaledOffset(props.eload.startValues[1], 40, maxFzMagnitude.value, fzStartDir);
  const fzEndDist = scaledOffset(props.eload.endValues[1], 40, maxFzMagnitude.value, fzEndDir);

  return {
    fx: {
      constant: makeTransform(n1.value, fxConstantDist, true, false),
      start: makeTransform(n1.value, fxStartDist, true, false),
      end: makeTransform(n2.value, fxEndDist, true, true),
    },
    fz: {
      constant: makeTransform(n1.value, fzConstantDist, false, false),
      start: makeTransform(n1.value, fzStartDist, false, false),
      end: makeTransform(n2.value, fzEndDist, false, true),
    },
  };
});

const formatMagnitude = (value: number) => props.numberFormat.format(Math.abs(props.convertForce(value)));

const fxConstantLabel = computed(() => formatMagnitude(props.eload.startValues[0]));
const fxStartLabel = computed(() => formatMagnitude(props.eload.startValues[0]));
const fxEndLabel = computed(() => formatMagnitude(props.eload.endValues[0]));

const fzConstantLabel = computed(() => formatMagnitude(props.eload.startValues[1]));
const fzStartLabel = computed(() => formatMagnitude(props.eload.startValues[1]));
const fzEndLabel = computed(() => formatMagnitude(props.eload.endValues[1]));

/**
 * Calculate stacked transform for multiple loads on same element
 */
const stackedTransform = computed(() => {
  // We cant handle global stacking yet
  if (!props.eload.lcs) {
    return '';
  }

  const geo = target.value.computeGeo();
  const nz = geo.dx / geo.l;
  const nx = -geo.dz / geo.l;

  // calculate index of load on element
  const eloads = target.value.domain.solver.loadCases[0].getElementLoadsOnElement(props.eload.target);

  const index = eloads.indexOf(props.eload);
  let dist = 0;

  for (let i = 0; i < index; i++) {
    const load = eloads[i];
    if (load instanceof BeamElementUniformEdgeLoad) {
      // perpendicular load is 40px
      // TODO: if we allow load scaling, this needs to be dynamic
      if (Math.abs(load.values[1]) > 1e-12) {
        dist += 40;
      }

      // parallel load (horizontal arrows) are not as tall
      // currently fixed at 20px
      // TODO: if we allow load scaling, this needs to be dynamic
      if (Math.abs(load.values[0]) > 1e-12) {
        dist += 20;
      }
    } else if (load instanceof BeamElementTrapezoidalEdgeLoad) {
      // perpendicular load is 40px
      // TODO: if we allow load scaling, this needs to be dynamic
      if (Math.max(Math.abs(load.endValues[1]), Math.abs(load.startValues[1])) > 1e-12) {
        dist += 40;
      }

      // parallel load (horizontal arrows) are not as tall
      // currently fixed at 20px
      // TODO: if we allow load scaling, this needs to be dynamic
      if (Math.max(Math.abs(load.endValues[0]), Math.abs(load.startValues[0])) > 1e-12) {
        dist += 20;
      }
    }
  }

  const dx = props.eload.lcs ? (-nx * dist) / props.scale : 0;
  const dz = props.eload.lcs ? (-nz * dist) / props.scale : -dist / props.scale;

  return `translate(${dx} ${dz})`;
});
</script>

<template>
  <g class="element-load load-1d" :transform="stackedTransform">
    <defs v-if="hasPathData">
      <path
        :id="eloadPathId"
        :d="eloadPathData"
        fill="transparent"
        class="drawable"
        style="stroke: var(--colors-loads)"
        vector-effect="non-scaling-stroke"
      />
      <clipPath :id="eloadClipPathId" clipPathUnits="userSpaceOnUse">
        <use :href="eloadPathHref" :xlink:href="eloadPathHref" />
      </clipPath>
    </defs>
    <use
      v-if="hasPathData"
      :href="eloadPathHref"
      :xlink:href="eloadPathHref"
      fill="transparent"
      class="drawable"
      vector-effect="non-scaling-stroke"
    />
    <g :clip-path="eloadClipPathUrl">
      <g v-for="(load, i) in eloadForces" :key="i">
        <polyline
          :key="`load-force-${i}`"
          :points="`0,0 0,0.0001`"
          vector-effect="non-scaling-stroke"
          class="drawable"
          stroke="red"
          :transform="`translate(${load[0]},${load[1]}) rotate(${load[2]})`"
        />
      </g>
    </g>
    <g>
      <template v-if="hasFxComponent">
        <text
          v-if="isFxConstant"
          :font-size="fontSize / scale"
          font-weight="normal"
          text-anchor="end"
          dominant-baseline="middle"
          :transform="labelTransforms.fx.constant"
        >
          {{ fxConstantLabel }}
        </text>
        <template v-else>
          <text
            :font-size="fontSize / scale"
            font-weight="normal"
            text-anchor="end"
            dominant-baseline="middle"
            :transform="labelTransforms.fx.start"
          >
            {{ fxStartLabel }}
          </text>
          <text
            :font-size="fontSize / scale"
            font-weight="normal"
            text-anchor="start"
            dominant-baseline="middle"
            :transform="labelTransforms.fx.end"
          >
            {{ fxEndLabel }}
          </text>
        </template>
      </template>
      <template v-if="hasFzComponent">
        <text
          v-if="isFzConstant"
          :font-size="fontSize / scale"
          font-weight="normal"
          text-anchor="end"
          dominant-baseline="middle"
          :transform="labelTransforms.fz.constant"
        >
          {{ fzConstantLabel }}
        </text>
        <template v-else>
          <text
            :font-size="fontSize / scale"
            font-weight="normal"
            text-anchor="end"
            dominant-baseline="middle"
            :transform="labelTransforms.fz.start"
          >
            {{ fzStartLabel }}
          </text>
          <text
            :font-size="fontSize / scale"
            font-weight="normal"
            text-anchor="start"
            dominant-baseline="middle"
            :transform="labelTransforms.fz.end"
          >
            {{ fzEndLabel }}
          </text>
        </template>
      </template>
    </g>
  </g>
</template>
