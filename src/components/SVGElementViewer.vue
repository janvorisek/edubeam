<script setup lang="ts">
import SvgPanZoom from "./SVGPanZoom2.vue";
import SvgGrid from "./SVGGrid.vue";
import SvgViewerDefs from "./SVGViewerDefs.vue";
import { ref, onMounted, computed, watch } from "vue";

import { throttle } from "../utils/throttle";
import {
  Node,
  DofID,
  Beam2D,
  Element,
  NodalLoad,
  BeamElementLoad,
  LinearStaticSolver,
  BeamElementUniformEdgeLoad,
  BeamConcentratedLoad,
  PrescribedDisplacement,
} from "ts-fem";
import { Matrix, max, min } from "mathjs";

import SVGElementLoad from "./svg/ElementLoad.vue";
import SVGElementConcentratedLoad from "./svg/ElementConcentratedLoad.vue";
import SVGNodalLoad from "./svg/NodalLoad.vue";
import SVGPrescribedDisplacement from "./svg/PrescribedDisplacement.vue";
import SVGNode from "./svg/Node.vue";
import SVGElement from "./svg/Element.vue";
import SVGElementTemperatureLoad from "./svg/ElementTemperatureLoad.vue";
import { loadType } from "@/utils";

const props = withDefaults(
  defineProps<{
    solver: LinearStaticSolver;
    showGrid?: boolean;
    showElements?: boolean;
    showNodes?: boolean;
    showLoads?: boolean;
    showSupports?: boolean;
    showNodeLabels?: boolean;
    showElementLabels?: boolean;
    showDeformedShape?: boolean;
    showNormalForce?: boolean;
    showShearForce?: boolean;
    showMoments?: boolean;
    showReactions?: boolean;
    elements: Element[];
    nodes: Node[];
    nodalLoads?: NodalLoad[];
    elementLoads?: BeamElementLoad[];
    prescribedDisplacements?: PrescribedDisplacement[];
    padding?: number;
    mobilePadding?: number;
    resultsScalePx: number;
    colors?: {
      normalForce: string;
      shearForce: string;
      bendingMoment: string;
      deformedShape: string;
      loads: string;
      nodes: string;
      elements: string;
      reactions: string;
    };
    supportSize?: number;
    convertForce?: (value: number) => number;
    convertLength?: (value: number) => number;
    zoomEnabled?: boolean;
  }>(),
  {
    showGrid: false,
    showElements: true,
    showNodes: true,
    showLoads: false,
    showSupports: true,
    showNodeLabels: false,
    showElementLabels: false,
    showDeformedShape: false,
    showNormalForce: false,
    showShearForce: false,
    showMoments: false,
    showReactions: false,
    elements: () => [],
    nodes: () => [],
    nodalLoads: () => [],
    elementLoads: () => [],
    prescribedDisplacements: () => [],
    padding: 12,
    mobilePadding: 12,
    colors: () => {
      return {
        normalForce: "#2222ff",
        shearForce: "#00af00",
        bendingMoment: "#ff2222",
        deformedShape: "#555555",
        loads: "#ff8700",
        nodes: "#000000",
        elements: "#000000",
        reactions: "#a020f0",
      };
    },
    supportSize: 1,
    convertForce: (v) => v,
    convertLength: (v) => v,
    zoomEnabled: false,
  }
);

const panZoom = ref<InstanceType<typeof SvgPanZoom> | null>(null);
const grid = ref<InstanceType<typeof SvgGrid> | null>(null);

const svg = ref<SVGSVGElement>();
const viewport = ref<SVGGElement>();

const update = () => {
  fitContent();

  let maxDefo = 0;
  let maxNormalForce = 0;
  let maxBendingMoment = 0;
  let maxShearForce = 0;

  for (const beam of props.solver.domain.elements.values()) {
    const def = (beam as Beam2D).computeGlobalDefl(props.solver.loadCases[0], 10);

    const n = (beam as Beam2D).computeNormalForce(props.solver.loadCases[0], 10).N as number[];
    const v = (beam as Beam2D).computeShearForce(props.solver.loadCases[0], 10).V as number[];
    const m = (beam as Beam2D).computeBendingMoment(props.solver.loadCases[0], 10).M as number[];

    maxDefo = Math.max(maxDefo, Math.abs(max(def.u)), Math.abs(min(def.u)), Math.abs(max(def.w)), Math.abs(min(def.w)));

    maxNormalForce = Math.max(maxNormalForce, Math.abs(max(n)), Math.abs(min(n)));

    maxBendingMoment = Math.max(maxBendingMoment, Math.abs(max(m)), Math.abs(min(m)));

    maxShearForce = Math.max(maxShearForce, Math.abs(max(v)), Math.abs(min(v)));
  }

  defoScale.value = 1 / maxDefo;
  normalForceScale.value = 1 / maxNormalForce;
  bendingMomentScale.value = 1 / maxBendingMoment;
  shearForceScale.value = 1 / maxShearForce;
};

watch(props.solver, update);

const defoScale = ref(1);
const normalForceScale = ref(1);
const bendingMomentScale = ref(1);
const shearForceScale = ref(1);

const scale = computed(() => {
  if (panZoom.value) return panZoom.value.scale;

  return 1;
});

onMounted(() => {
  window.setTimeout(() => {
    fitContent();
    update();
  }, 100);
});

const centerContent = () => {
  if (!panZoom.value) return;

  panZoom.value.centerContent();

  if (grid.value) grid.value.refreshGrid(true);
};

const fitContent = () => {
  if (!panZoom.value) return;

  panZoom.value.onWindowResize();

  requestAnimationFrame(() => {
    panZoom.value.fitContent();
    if (grid.value) grid.value.refreshGrid(true);
  });
};

const onUpdate = throttle((zooming: boolean) => {
  if (grid.value) grid.value.refreshGrid(zooming);
}, 100);

defineExpose({ centerContent, fitContent });
</script>

<template>
  <div class="d-flex flex-column fill-height">
    <svg v-if="false" class="w-100 fill-height" style="position: absolute">
      <SvgGrid ref="grid" :svg="svg as SVGSVGElement" :viewport="viewport as SVGGElement" :zoom="scale" />
    </svg>

    <SvgPanZoom
      :on-update="onUpdate"
      ref="panZoom"
      :padding="props.padding"
      :mobile-padding="props.mobilePadding"
      :zoom-enabled="props.zoomEnabled"
      style="overflow: visible; z-index: 50; min-height: 0"
    >
      <svg ref="svg">
        <SvgViewerDefs :colors="colors" :support-size="supportSize" />
        <g ref="viewport">
          <g>
            <g v-if="props.showLoads">
              <template v-for="(eload, index) in props.elementLoads">
                <SVGElementLoad
                  v-if="eload instanceof BeamElementUniformEdgeLoad"
                  :key="`element-udl-${index}`"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="props.convertForce"
                />
                <SVGElementTemperatureLoad
                  v-else-if="loadType(eload) === 'temperature'"
                  :key="`element-temperature-${index}`"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="props.convertForce"
                />
                <SVGElementConcentratedLoad
                  v-else-if="eload instanceof BeamConcentratedLoad"
                  :key="`element-cl-${index}`"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="props.convertForce"
                />
              </template>
              <SVGNodalLoad
                v-for="(nload, index) in props.nodalLoads"
                :key="`nodal-load-${index}`"
                :nload="nload"
                :scale="scale"
                :convert-force="props.convertForce"
              />
              <SVGPrescribedDisplacement
                v-for="(nload, index) in props.prescribedDisplacements"
                :key="`nodal-load-${index}`"
                :nload="nload"
                :scale="scale"
                :convert-length="props.convertLength"
                :multiplier="defoScale * props.resultsScalePx"
              />
            </g>
          </g>
          <g>
            <SVGElement
              v-for="(element, index) in props.elements"
              :key="`element-${index}`"
              :element="element"
              :scale="scale"
              :show-deformed-shape="props.showDeformedShape"
              :show-normal-force="props.showNormalForce"
              :show-shear-force="props.showShearForce"
              :show-bending-moment="props.showMoments"
              :show-label="props.showElementLabels"
              :load-case="props.solver.loadCases[0]"
              :deformed-shape-multiplier="defoScale * props.resultsScalePx"
              :normal-force-multiplier="normalForceScale * props.resultsScalePx"
              :shear-force-multiplier="shearForceScale * props.resultsScalePx"
              :bending-moment-multiplier="bendingMomentScale * props.resultsScalePx"
              :convert-force="props.convertForce"
            />
          </g>

          <g class="nodes">
            <g v-for="(node, index) in props.nodes" :key="`node-${index}`">
              <SVGNode
                :node="node"
                :scale="scale"
                :show-label="props.showNodeLabels"
                :show-supports="props.showSupports"
                :show-deformed-shape="props.showDeformedShape"
                :show-reactions="props.showReactions"
                :convert-force="props.convertForce"
                :load-case="props.solver.loadCases[0]"
                :multiplier="defoScale * props.resultsScalePx"
              />
            </g>
          </g>
        </g>
      </svg>
    </SvgPanZoom>
  </div>
</template>
