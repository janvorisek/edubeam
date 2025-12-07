<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import SVGElementViewer from './SVGElementViewer.vue';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import type { BeamElementLoad, LinearStaticSolver } from 'ts-fem';

const props = withDefaults(
  defineProps<{
    load?: BeamElementLoad | null;
    solver?: LinearStaticSolver;
    height?: number;
    showElementLabels?: boolean;
    showNodeLabels?: boolean;
  }>(),
  {
    load: null,
    solver: undefined,
    height: 200,
    showElementLabels: true,
    showNodeLabels: false,
  }
);

const projectStore = useProjectStore();
const appStore = useAppStore();

const activeSolver = computed(() => props.solver ?? projectStore.solver);

const targetElement = computed(() => {
  if (!props.load) return null;
  return activeSolver.value.domain.elements.get(props.load.target) ?? null;
});

const previewElements = computed(() => {
  if (!targetElement.value) return [];
  return [targetElement.value];
});

const previewElementLoads = computed(() => {
  if (!props.load) return [];
  return [props.load];
});

const previewDimensioning = computed(() => {
  return [];
  // TODO: do we want any dims?
  if (!targetElement.value) return [];
  return [
    {
      nodes: [
        activeSolver.value.domain.nodes.get(targetElement.value.nodes[0])!,
        activeSolver.value.domain.nodes.get(targetElement.value.nodes[1])!,
      ],
      distance: previewElementLoads.value[0]?.lcs ? 32 : 64,
    },
  ];
});

const hasPreview = computed(() => previewElements.value.length > 0 && previewElementLoads.value.length > 0);

const viewer = ref<InstanceType<typeof SVGElementViewer> | null>(null);

const fitPreview = () => {
  nextTick(() => viewer.value?.fitContent());
};

watch([previewElements, previewElementLoads], () => {
  if (!hasPreview.value) return;
  fitPreview();
});

onMounted(() => {
  if (hasPreview.value) {
    fitPreview();
  }
});
</script>

<template>
  <div class="element-load-preview" :style="{ height: `${height}px` }">
    <SVGElementViewer
      v-if="hasPreview"
      ref="viewer"
      class="overflow-hidden pa-1 w-100"
      :solver="activeSolver"
      :nodes="[]"
      :elements="previewElements"
      :dimlines="previewDimensioning"
      :element-loads="previewElementLoads"
      :show-node-labels="showNodeLabels"
      :show-element-labels="showElementLabels"
      :show-deformed-shape="false"
      :show-reactions="false"
      :show-loads="true"
      :show-moments="false"
      :show-normal-force="false"
      :show-shear-force="false"
      :padding="12"
      :mobile-padding="12"
      :results-scale-px="32"
      :convert-force="appStore.convertForce"
      :convert-moment="appStore.convertMoment"
      :convert-length="appStore.convertLength"
    />
    <div v-else class="d-flex align-center justify-center fill-height text-medium-emphasis">Preview unavailable</div>
  </div>
</template>

<style scoped>
.element-load-preview {
  min-height: 160px;
}
</style>
