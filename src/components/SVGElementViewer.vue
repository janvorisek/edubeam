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
import { loadType } from "../utils/loadType";

const props = withDefaults(
  defineProps<{
    id?: string;
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
    resultsScalePx?: number;
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
    fontSize?: number;
  }>(),
  {
    id: new Date().getTime().toString(),
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
    resultsScalePx: 64,
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
    fontSize: 13,
  }
);

const panZoom = ref<InstanceType<typeof SvgPanZoom> | null>(null);
const grid = ref<InstanceType<typeof SvgGrid> | null>(null);

const svg = ref<SVGSVGElement>();
const viewport = ref<SVGGElement>();

const update = () => {
  fitContent();

  if (!props.solver.loadCases[0].solved) return;

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
watch(props.elements, update);
watch(() => props.showDeformedShape, update);
watch(() => props.showNormalForce, update);
watch(() => props.showShearForce, update);
watch(() => props.showMoments, update);

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

const dynamicMarker = (label: string) => {
  return `url(#${props.id}-${label})`;
};

defineExpose({ centerContent, fitContent });
</script>

<template>
  <div class="d-flex flex-column fill-height svg-viewer">
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
        <SvgViewerDefs :id="id" :colors="colors" :support-size="supportSize" :scale="scale" />
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
                  :font-size="props.fontSize"
                />
                <SVGElementTemperatureLoad
                  v-else-if="loadType(eload) === 'temperature'"
                  :key="`element-temperature-${index}`"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="props.convertForce"
                  :font-size="props.fontSize"
                />
                <SVGElementConcentratedLoad
                  v-else-if="eload instanceof BeamConcentratedLoad"
                  :key="`element-cl-${index}`"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="props.convertForce"
                  :font-size="props.fontSize"
                />
              </template>
              <SVGNodalLoad
                v-for="(nload, index) in props.nodalLoads"
                :key="`nodal-load-${index}`"
                :nload="nload"
                :scale="scale"
                :convert-force="props.convertForce"
                :font-size="props.fontSize"
              />
              <SVGPrescribedDisplacement
                v-for="(nload, index) in props.prescribedDisplacements"
                :key="`nodal-load-${index}`"
                :nload="nload"
                :scale="scale"
                :convert-length="props.convertLength"
                :multiplier="defoScale * props.resultsScalePx"
                :font-size="props.fontSize"
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
              :font-size="props.fontSize"
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
                :font-size="props.fontSize"
              />
            </g>
          </g>
        </g>
      </svg>
    </SvgPanZoom>
  </div>
</template>

<style lang="scss" scoped>
.svg-viewer :deep(*) {
  .element-load.load-1d {
    text {
      fill: v-bind("colors.loads");
    }
    stroke-linecap: butt;
    &:hover text {
      //fill: blue;
    }
    &:hover path.drawable,
    &:hover polygon.drawable {
      //stroke: blue;
      stroke-width: 3px;
    }
    &:hover polyline {
      marker-end: v-bind(dynamicMarker("force_centered_hover"));
    }
    polygon,
    path {
      stroke: v-bind("colors.loads");
      stroke-width: 1px;
      &.handle {
        stroke-width: 12px;
        stroke: transparent;
      }
    }
    polyline {
      marker-end: v-bind(dynamicMarker("force_centered"));
    }

    &.selected {
      text {
        fill: rgb(0, 55, 149);
      }
      polygon {
        stroke-linejoin: round;
        fill: rgba(0, 55, 149, 0.1);
      }
    }
  }

  .element.element-1d {
    polyline {
      fill: none;
      stroke: black;
      stroke-width: 2px;
      &.handle {
        cursor: pointer;
        stroke-width: 24px;
        stroke: transparent;
      }
      &.decoration {
        stroke-width: 1px;
      }
    }
    &:hover {
      & polyline.drawable {
        stroke: black;
        stroke-width: 5px;
      }
    }
    &.selected {
      & polyline.drawable {
        stroke: rgb(0, 94, 255);
        stroke-width: 5px;
      }
    }

    polyline.fibers {
      stroke: #666;
      stroke-width: 1px;
    }
    path.deformedShape {
      fill: none;
      stroke: v-bind("colors.deformedShape");
      stroke-width: 2px;
      &.decoration {
        stroke-width: 1px;
      }
    }
    .normal polyline {
      stroke: v-bind("colors.normalForce");
      stroke-width: 1px;
      fill: v-bind("colors.normalForce");
      fill-opacity: 0.1;
      &:hover {
        fill-opacity: 0.2;
      }
    }
    .shear polyline {
      stroke: v-bind("colors.shearForce");
      stroke-width: 1px;
      fill: v-bind("colors.shearForce");
      fill-opacity: 0.1;
      &:hover {
        fill-opacity: 0.2;
      }
    }
    .moment polyline {
      stroke: v-bind("colors.bendingMoment");
      stroke-width: 1px;
      fill: v-bind("colors.bendingMoment");
      fill-opacity: 0.1;
      &:hover {
        fill-opacity: 0.2;
      }
    }
  }

  .node {
    polyline {
      stroke: #000;
      stroke-linecap: square;
      stroke-width: 6px;
      vector-effect: non-scaling-stroke;
      &.handle {
        cursor: pointer;
        stroke-width: 24px;
        stroke: transparent;
      }
      &.decoration {
        stroke-width: 1px;
        stroke: none;
      }
      &.drawable.deformed {
        stroke: v-bind("colors.deformedShape");
      }
    }
    &:hover polyline.drawable {
      stroke: black;
      stroke-width: 10px;
    }
    &.selected polyline.drawable {
      stroke: rgb(0, 55, 149);
      stroke-width: 8px;
    }
  }

  .prescribed polyline {
    stroke: v-bind("colors.loads");
  }

  .nodal-load {
    text {
      fill: v-bind("colors.loads");
    }
    polyline {
      stroke-linecap: square;
      vector-effect: non-scaling-stroke;
      &.decoration.force {
        marker-end: v-bind(dynamicMarker("force"));
      }
      &.decoration.moment.cw {
        marker-end: v-bind(dynamicMarker("moment_cw"));
      }
      &.decoration.moment.ccw {
        marker-end: v-bind(dynamicMarker("#moment_ccw"));
      }
      &.handle {
        stroke: transparent;
        stroke-width: 24px;
      }

      &.handle.moment {
        stroke: transparent;
        stroke-width: 38px;
      }
    }
    &:hover text {
      fill: blue;
    }
    &:hover polyline.decoration.force {
      marker-end: v-bind(dynamicMarker("force_hover"));
    }
    &:hover polyline.decoration.moment.cw {
      marker-end: v-bind(dynamicMarker("moment_cw_hover"));
    }
    &:hover polyline.decoration.moment.ccw {
      marker-end: v-bind(dynamicMarker("moment_ccw_hover"));
    }
    &.selected {
      text {
        fill: rgb(0, 55, 149);
      }
    }
  }

  .normal text {
    fill: v-bind("colors.normalForce");
  }

  .shear text {
    fill: v-bind("colors.shearForce");
  }

  .moment text {
    fill: v-bind("colors.bendingMoment");
  }

  .reaction {
    fill: v-bind("colors.reactions");
  }

  .marker-reaction {
    marker-start: v-bind(dynamicMarker("reaction"));
  }

  .marker-moment_reaction_ccw {
    marker-start: v-bind(dynamicMarker("moment_reaction_ccw"));
  }

  .marker-moment_reaction_cw {
    marker-start: v-bind(dynamicMarker("moment_reaction_cw"));
  }

  .marker-dot {
    marker-start: v-bind(dynamicMarker("dot"));
  }

  .marker-hinge-xy {
    marker-start: v-bind(dynamicMarker("hinge-xy"));
  }

  .marker-hinge-x {
    marker-start: v-bind(dynamicMarker("hinge-x"));
  }

  .marker-hinge-y {
    marker-start: v-bind(dynamicMarker("hinge-y"));
  }

  .marker-forceTip {
    marker-end: v-bind(dynamicMarker("forceTip"));
  }

  .filter-text-label {
    filter: v-bind(dynamicMarker("textLabel"));
  }
}
</style>
