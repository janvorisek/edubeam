<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import SVGElementViewer from './SVGElementViewer.vue';
import { useAppStore } from '@/store/app';
import { BeamConcentratedLoad, BeamElementLoad, LinearStaticSolver, Node } from 'ts-fem';
import { useViewerStore } from '@/store/viewer';
import { createDimensionRenderableNode } from '@/types/dimension';
import { drawableBeam } from '@/utils/drawableBeam';

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
  <div class="element-load-preview" :style="{ height: `${height}px` }">
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
