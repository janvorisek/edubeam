<script setup lang="ts">
import { computed, ref } from 'vue';
import SVGElementViewer from './SVGElementViewer.vue';
import { useAppStore } from '@/store/app';
import { Beam2D, BeamConcentratedLoad, BeamElementLoad, LinearStaticSolver, Node } from 'ts-fem';

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

const viewer = ref<InstanceType<typeof SVGElementViewer> | null>(null);
const solver = ref(new LinearStaticSolver());
const appStore = useAppStore();

const elements = computed(() => {
  if (!props.load) return [];
  return [props.load.domain.elements.get(props.load.target) as Beam2D];
});

// computed nodes from load's element and domain
const nodes = computed<Node[]>(() => {
  if (!props.load) return [];

  const element = props.load.domain.elements.get(props.load.target);
  if (!element) return [];

  // get nodes from element
  return element.nodes.map((nodeId) => props.load!.domain.nodes.get(nodeId)!);
});

const dimensionLines = computed(() => {
  if (!(props.load instanceof BeamConcentratedLoad)) return [];

  const element = props.load.domain.elements.get(props.load.target) as Beam2D | undefined;
  if (!element) return [];

  const startNode = props.load.domain.nodes.get(element.nodes[0]);
  if (!startNode) return [];

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
      nodes: [startNode, loadNode],
      distance: offset,
      numberFormat: appStore.numberFormatter.value,
      convertLength: appStore.convertLength,
    },
  ];
});
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
      :support-size="0.75"
      :number-format="appStore.numberFormatter"
      :convert-length="appStore.convertLength"
    />
  </div>
</template>

<style scoped>
.element-load-preview {
  min-height: 160px;
}
</style>
