<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import SVGElementViewer from './SVGElementViewer.vue';
import { useAppStore } from '@/store/app';
import {
  BeamConcentratedLoad,
  BeamElementLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  LinearStaticSolver,
  Node,
} from '@edubeam/fem';
import { useViewerStore } from '@/store/viewer';
import { createDimensionRenderableNode } from '@/types/dimension';
import { drawableBeam } from '@/utils/drawableBeam';
import type { Anchor, Fit, PlotLayer, PlotLoad, PlotModel } from '@edubeam/plot';
import PlotFigure from './PlotFigure.vue';
import { alignedDimensionMarkup, plotLoadsOf, plotNodeOf } from '@/utils/plotDrawing';
import { useEditorLook } from '@/utils/useEditorLook';

const props = withDefaults(
  defineProps<{
    load?: BeamElementLoad | null;
    height?: number;
    showElementLabels?: boolean;
    showNodeLabels?: boolean;
  }>(),
  {
    load: null,
    height: 200,
    showElementLabels: true,
    showNodeLabels: false,
  }
);

const viewerStore = useViewerStore();
const viewer = ref<InstanceType<typeof SVGElementViewer> | null>(null);
const solver = ref(new LinearStaticSolver());
const appStore = useAppStore();

/** The loaded element, when it can be drawn; the dialogs only preview loads on such elements. */
const beam = computed(() => (props.load ? drawableBeam(props.load.domain, props.load.target) : undefined));

const elements = computed(() => (beam.value ? [beam.value] : []));

const nodes = computed<Node[]>(() => {
  if (!beam.value || !props.load) return [];

  const domain = props.load.domain;
  return beam.value.nodes.flatMap((label) => domain.nodes.get(label) ?? []);
});

const dimensionLines = computed(() => {
  if (!(props.load instanceof BeamConcentratedLoad)) return [];

  const element = beam.value;
  if (!element) return [];

  const startNode = props.load.domain.nodes.get(element.nodes[0])!;

  const geo = element.computeGeo();
  const elementLength = geo?.l ?? 0;
  if (!elementLength) return [];

  const clampedDist = Math.min(Math.max(props.load.values[3] ?? 0, 0), elementLength);
  const cos = geo.dx / elementLength || 0;
  const sin = geo.dz / elementLength || 0;

  const loadNode = new Node('__preview-load-distance', props.load.domain, [
    startNode.coords[0] + cos * clampedDist,
    startNode.coords[1],
    startNode.coords[2] + sin * clampedDist,
  ]);

  const offset = Math.min(Math.max(elementLength * 0.15, 0.25), 2);

  return [
    {
      points: [
        createDimensionRenderableNode({ x: startNode.coords[0], y: startNode.coords[2] }, startNode.label),
        createDimensionRenderableNode({ x: loadNode.coords[0], y: loadNode.coords[2] }, loadNode.label),
      ],
      distance: offset,
      numberFormat: appStore.numberFormatter,
      convertLength: appStore.convertLength,
    },
  ];
});

/* ── With the plot renderer on: the member drawn by it, as the drawing will show it ──────────── */
const plotOn = computed(() => viewerStore.renderer === 'plot');
const look = useEditorLook();

/** Every value of the load zero: nothing typed yet, so a grey stand-in of its kind shows instead */
const loadIsEmpty = computed(() => {
  const load = props.load;
  if (!load) return false;
  // The sizes, not a point load's place along the member (its fourth value)
  const values =
    load instanceof BeamElementTrapezoidalEdgeLoad
      ? [...load.startValues, ...load.endValues]
      : load instanceof BeamElementUniformEdgeLoad ||
          load instanceof BeamConcentratedLoad ||
          load instanceof BeamTemperatureLoad
        ? load.values.slice(0, 3)
        : [];
  return values.every((v) => !v);
});

/** A load of the kind with a size to draw: down its member's z, a ramp for a linearly varying one */
const standIn = (load: BeamElementLoad, member: string): PlotLoad[] => {
  if (load instanceof BeamElementTrapezoidalEdgeLoad) {
    return [{ kind: 'distributed', member, start: { fx: 0, fz: 0.3 }, end: { fx: 0, fz: 1 }, local: true }];
  }
  if (load instanceof BeamConcentratedLoad) {
    return [{ kind: 'pointForce', member, at: load.values[3] ?? 0, fx: 0, fz: 1, local: true }];
  }
  if (load instanceof BeamTemperatureLoad) return [{ kind: 'temperature', member, uniform: 1, gradient: 0 }];
  return [{ kind: 'distributed', member, start: { fx: 0, fz: 1 }, end: { fx: 0, fz: 1 }, local: true }];
};

const plotModel = computed((): PlotModel | null => {
  const b = beam.value;
  const [a, z] = nodes.value;
  if (!b || !props.load || !a || !z) return null;
  const id = String(b.label);
  return {
    nodes: [plotNodeOf(a), plotNodeOf(z)],
    members: [{ id, start: String(a.label), end: String(z.label), hinges: [b.hinges[0], b.hinges[1]] }],
    loads: loadIsEmpty.value ? standIn(props.load, id) : plotLoadsOf(props.load, id),
  };
});

const plotLayers = computed(
  () =>
    new Set<PlotLayer>([
      'members',
      'supports',
      'loads',
      ...(props.showNodeLabels ? (['nodeLabels'] as const) : []),
      ...(props.showElementLabels ? (['memberLabels'] as const) : []),
    ])
);

/** A point load's place: how far along the member, m, and the side its dimension goes, px off the member */
const pointDimension = computed(() => {
  const [a, z] = nodes.value;
  if (!(props.load instanceof BeamConcentratedLoad) || !a || !z) return null;
  const dx = z.coords[0] - a.coords[0];
  const dz = z.coords[2] - a.coords[2];
  const length = Math.hypot(dx, dz);
  if (!(length > 0)) return null;
  const [ux, uz] = [dx / length, dz / length];
  const at = Math.min(Math.max(props.load.values[3] ?? 0, 0), length);
  // The side the force comes from has its arrow; the dimension goes on the other
  const [fx = 0, fz = 0] = props.load.values;
  const [gx, gz] = props.load.lcs ? [fx * ux - fz * uz, fx * uz + fz * ux] : [fx, fz];
  const side = -uz * gx + ux * gz >= 0 ? 1 : -1;
  return {
    a: { x: a.coords[0], z: a.coords[2] },
    b: { x: a.coords[0] + ux * at, z: a.coords[2] + uz * at },
    offset: 26 * side,
    normal: { x: -uz * side, z: ux * side },
  };
});

const DIMENSION_ROOM_PX = 44;
const plotExtra = computed((): Anchor[] => {
  const d = pointDimension.value;
  if (!d) return [];
  const [dx, dy] = [d.normal.x * DIMENSION_ROOM_PX, d.normal.z * DIMENSION_ROOM_PX];
  return [
    { ...d.a, dx, dy },
    { ...d.b, dx, dy },
  ];
});
const plotOver = (fit: Fit) => {
  const d = pointDimension.value;
  return d ? alignedDimensionMarkup(fit, d.a, d.b, d.offset, look.value) : '';
};

watch(
  () => props.load,
  async (target, previousTarget) => {
    if (!target || target === previousTarget) return;

    await nextTick();
    viewer.value?.fitContent();
  },
  { flush: 'post' }
);
</script>

<template>
  <PlotFigure
    v-if="plotOn"
    class="element-load-preview"
    :model="plotModel"
    :layers="plotLayers"
    :height="height"
    :extra="plotExtra"
    :over="plotOver"
    :ghost-loads="loadIsEmpty"
  />
  <div v-else class="element-load-preview" :style="{ height: `${height}px` }">
    <SVGElementViewer
      :id="`element-load-preview`"
      ref="viewer"
      class="overflow-hidden pa-1 w-100"
      :solver="solver"
      :nodes="nodes"
      :elements="elements"
      :dimlines="dimensionLines"
      :element-loads="[load]"
      :show-node-labels="showNodeLabels"
      :show-element-labels="showElementLabels"
      :show-deformed-shape="false"
      :show-reactions="false"
      :show-loads="true"
      :show-moments="false"
      :show-normal-force="false"
      :show-shear-force="false"
      :padding="24"
      :mobile-padding="24"
      :results-scale-px="32"
      fit-ignore="[data-fit-ignore='results']"
      :fit-reserve-px="0"
      :support-size="0.75"
      :number-format="appStore.numberFormatter"
      :convert-force="appStore.convertForce"
      :convert-force-distance="appStore.convertForceDistance"
      :convert-moment="appStore.convertMoment"
      :convert-length="appStore.convertLength"
      :convert-temperature="appStore.convertTemperature"
      :convert-displacement="appStore.convertDisplacement"
      :colors="viewerStore.colors"
    />
  </div>
</template>

<style scoped>
.element-load-preview {
  min-height: 160px;
}
</style>
