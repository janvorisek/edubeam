<script setup lang="ts">
import { computed, inject } from 'vue';
import SVGElement from './svg/Element.vue';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { useAppStore } from '@/store/app';
import { intersectedKey } from '@/types/hover';

/**
 * The element under the pointer, drawn again on top of the rest so it reads clearly.
 *
 * Its own component because the hover changes as the pointer crosses the model, and the drawing
 * is one component: read there, every node, element and load would be rebuilt each time the
 * pointer moved onto or off something. Read here, only the highlight is drawn again.
 */
const props = defineProps<{
  scale: number;
  isZooming: boolean;
  resultLabelMode: 'axis' | 'horizontal';
}>();

const projectStore = useProjectStore();
const viewerStore = useViewerStore();
const appStore = useAppStore();

const intersected = inject(intersectedKey);

const element = computed(() => {
  const hover = intersected?.value;
  if (!hover || hover.type !== 'element' || hover.index === null) return null;

  return projectStore.beams.find((e) => e.label === hover.index) ?? null;
});

const selected = computed(() => !!element.value && projectStore.selection2.elements.includes(element.value.label));
</script>

<template>
  <g v-if="element">
    <SVGElement
      :key="`element-geometry-${element.label}`"
      class="pointer-events-none"
      :class="{ selected }"
      :show-geometry="true"
      :show-results="false"
      :element="element"
      :scale="props.scale"
      :show-deformed-shape="!props.isZooming && viewerStore.showDeformedShape"
      :show-normal-force="!props.isZooming && viewerStore.showNormalForce"
      :show-shear-force="!props.isZooming && viewerStore.showShearForce"
      :show-bending-moment="!props.isZooming && viewerStore.showBendingMoment"
      :show-label="!props.isZooming && viewerStore.showElementLabels"
      show-label-background
      :load-case="projectStore.solver.loadCases[0]"
      :deformed-shape-multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
      :normal-force-multiplier="projectStore.normalForceScale * viewerStore.resultsScalePx_"
      :shear-force-multiplier="projectStore.shearForceScale * viewerStore.resultsScalePx_"
      :bending-moment-multiplier="projectStore.bendingMomentScale * viewerStore.resultsScalePx_"
      :result-label-mode="props.resultLabelMode"
      :convert-force="appStore.convertForce"
      :convert-moment="appStore.convertMoment"
      :font-size="viewerStore.fontSize"
      :number-format="appStore.numberFormatter"
    />
    <SVGElement
      :key="`element-results-${element.label}`"
      class="pointer-events-none"
      :class="{ selected }"
      :show-geometry="false"
      :show-results="true"
      :element="element"
      :scale="props.scale"
      :show-deformed-shape="!props.isZooming && viewerStore.showDeformedShape"
      :show-normal-force="!props.isZooming && viewerStore.showNormalForce"
      :show-shear-force="!props.isZooming && viewerStore.showShearForce"
      :show-bending-moment="!props.isZooming && viewerStore.showBendingMoment"
      :show-label="!props.isZooming && viewerStore.showElementLabels"
      show-label-background
      :load-case="projectStore.solver.loadCases[0]"
      :deformed-shape-multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
      :normal-force-multiplier="projectStore.normalForceScale * viewerStore.resultsScalePx_"
      :shear-force-multiplier="projectStore.shearForceScale * viewerStore.resultsScalePx_"
      :bending-moment-multiplier="projectStore.bendingMomentScale * viewerStore.resultsScalePx_"
      :result-label-mode="props.resultLabelMode"
      :convert-force="appStore.convertForce"
      :convert-moment="appStore.convertMoment"
      :font-size="viewerStore.fontSize"
      :number-format="appStore.numberFormatter"
    />
  </g>
</template>
