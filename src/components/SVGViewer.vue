<script setup lang="ts">
import SvgPanZoom from "./SVGPanZoom.vue";
import SvgGrid from "./SVGGrid.vue";
import SvgViewerDefs from "./SVGViewerDefs.vue";
import { useProjectStore } from "../store/project";
import { ref, onMounted, computed, nextTick } from "vue";
import { useViewerStore } from "../store/viewer";
import {
  formatNode,
  formatElement,
  formatElementFibers,
  formatElementLoad,
  formatElementLoadHatch,
  formatNodalLoadAngle,
  formatElementLoadLabel,
  formatNodalLoad,
  formatElementLabel,
  formatElementAngle,
  formatElementHinge,
  formatSupportNode,
  supportMarker,
  formatResults,
  formatNormalForces,
  formatShearForces,
  formatMoments,
  formatElementLoadForces,
  formatElementLoadForcesAngle,
} from "../SVGUtils";
import { throttle } from "../utils";
import { useAppStore } from "@/store/app";
import { Node, DofID } from "ts-fem";
import { Matrix } from "mathjs";

enum MouseMode {
  NONE,
  SELECTING,
  HOVER,
  MOVING,
}

let mouseMode: MouseMode = MouseMode.NONE;
let mouseX = 0;
let mouseY = 0;
let mouseStartX = 0;
let mouseStartY = 0;
let mouseXReal = 0;
let mouseYReal = 0;

const projectStore = useProjectStore();
const viewerStore = useViewerStore();

const panZoom = ref<InstanceType<typeof SvgPanZoom> | null>(null);
const grid = ref<InstanceType<typeof SvgGrid> | null>(null);

const svg = ref<SVGSVGElement>();
const viewport = ref<SVGGElement>();
const tooltip = ref<Element>();

const scale = computed(() => {
  if (panZoom.value) return panZoom.value.scale;

  return 1;
});

const intersected: {
  type: string | null;
  index: number | string | null;
  originalPosition: { x: number; y: number };
} = {
  type: null,
  index: null,
  originalPosition: { x: 0, y: 0 },
};

onMounted(() => {
  window.setTimeout(() => {
    fitContent();
  }, 1000);
});

const centerContent = () => {
  if (!panZoom.value) return;

  panZoom.value.centerContent();
  grid.value!.refreshGrid(true);
};

const fitContent = () => {
  if (!panZoom.value) return;

  panZoom.value.fitContent();
  grid.value!.refreshGrid(true);
};

const onUpdate = throttle((zooming: boolean) => {
  grid.value!.refreshGrid(zooming);
}, 100);

const onElementHover = (e: MouseEvent) => {
  if (mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  const target = e.target as HTMLElement;
  const index = parseInt(target.getAttribute("data-element-id") || "-1");

  intersected.type = "element";
  intersected.index = index;

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";
  tooltipContent.innerHTML = `Element ${index}`;
  tt.style.display = "block";

  if (mouseMode === MouseMode.NONE) mouseMode = MouseMode.HOVER;
};

const onNodeHover = (e: MouseEvent) => {
  if (mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  const target = e.target as HTMLElement;
  const index = target.getAttribute("data-node-id") || "-1";

  intersected.type = "node";
  intersected.index = isNaN(index as unknown as number) ? index : parseInt(index);

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";
  tooltipContent.innerHTML = `Node ${index}`;
  tt.style.display = "block";

  if (mouseMode === MouseMode.NONE) mouseMode = MouseMode.HOVER;
};

const hideTooltip = () => {
  const tt = tooltip.value as HTMLElement;
  tt.style.display = "none";

  if ([MouseMode.HOVER, MouseMode.SELECTING].includes(mouseMode)) {
    if (mouseMode === MouseMode.HOVER) mouseMode = MouseMode.NONE;

    intersected.type = null;
    intersected.index = null;
    //dialog.type = null;
    //dialog.index = null;
  }
};

const mouseMove = (e: MouseEvent) => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;

  //stepPx = (this.$refs.grid as Grid).stepPx;
  //gridTX = (this.$refs.grid as Grid).gridTX;
  //gridTY = (this.$refs.grid as Grid).gridTY;

  const matrix = viewport.value!.getCTM() as DOMMatrix;

  const leftTop = svg.value!.createSVGPoint();
  leftTop.x = e.offsetX; //svgBB.left;
  leftTop.y = e.offsetY; //svgBB.top;

  const inv = matrix.inverse();
  const svgP1 = leftTop.matrixTransform(inv);

  const mXReal = svgP1.x; // * zoom;
  const mYReal = svgP1.y; // * zoom;

  /*this.mouseXReal =
      (Math.round(mXReal / (this.stepPx / 4)) * this.stepPx) / 4 / zoom;
    this.mouseYReal =
      (Math.round(mYReal / (this.stepPx / 4)) * this.stepPx) / 4 / zoom;*/

  const realStep = 0.1;
  const snapToGrid = true;

  mouseXReal = /*Math.round(*/ mXReal; /* / realStep) * realStep;*/
  mouseYReal = /*Math.round(*/ mYReal; /* / realStep) * realStep;*/

  if (mouseMode === MouseMode.MOVING) {
    mouseXReal = Math.round(mXReal / realStep) * realStep;
    mouseYReal = Math.round(mYReal / realStep) * realStep;

    const xReal = snapToGrid ? mouseXReal : mXReal / scale.value;
    const yReal = snapToGrid ? mouseYReal : mYReal / scale.value;

    const index = intersected.index;
    if (index === null) return;

    //Vue.set((this.solver.domain.nodes.get(index) as Node).coords, 0, xReal);
    //Vue.set((this.solver.domain.nodes.get(index) as Node).coords, 2, yReal);

    // @ts-expect-error ts-fem is wrongly typed
    useProjectStore().solver.domain.nodes.get(index)!.coords[0] = xReal;

    // @ts-expect-error ts-fem is wrongly typed
    useProjectStore().solver.domain.nodes.get(index)!.coords[2] = yReal;

    useProjectStore().solver.loadCases[0].solved = false;
    useProjectStore().solve();

    mouseStartX = mouseX;
    mouseStartY = mouseY;

    //(this.$root.$children[0] as App).solve();
  }
};

const onMouseDown = (e: MouseEvent) => {
  //if (this.svgPanZoom == null) return;

  if ("activeElement" in document) (document.activeElement as HTMLElement).blur();

  if (e.button === 0 /* && typeof e.button !== "undefined" */) {
    //this.svgPanZoom.disablePan();
    mouseStartX = e.offsetX;
    mouseStartY = e.offsetY;

    if (mouseMode === MouseMode.HOVER) {
      mouseMode = MouseMode.MOVING;
    } else {
      mouseMode = MouseMode.SELECTING;
    }
  } else {
    mouseMode = MouseMode.NONE;
    //svgPanZoom.enablePan();
  }
};

const onMouseUp = () => {
  if (intersected.type === "element") {
    //this.dialog.type = this.intersected.type;
    //this.dialog.index = this.intersected.index;
    //this.showDialog = true;
  }

  mouseMode = MouseMode.NONE;

  intersected.type = null;
  intersected.index = null;
};

const isSupported = (node: Node, dof: DofID) => {
  return node.bcs.has(dof);
};

const getReaction = (node: Node, dof: DofID) => {
  const r = node.getReactions(useProjectStore().solver.loadCases[0], true);
  const i = r.dofs.findIndex((e) => e === dof);

  return "get" in r.values ? (r.values as unknown as Matrix).get([i]) : r.values[i];
};

defineExpose({ centerContent, fitContent });
</script>

<template>
  <div class="d-flex flex-column fill-height">
    <div class="text-black" style="position: absolute; z-index: 100; top: 32px; right: 32px">
      <v-btn
        icon="mdi:mdi-image-filter-center-focus"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        title="Center content"
        @click.native="centerContent"
      ></v-btn>
      <v-btn
        icon="mdi:mdi-fit-to-screen-outline"
        size="32"
        density="comfortable"
        rounded="lg"
        title="Fit content to screen"
        @click="fitContent"
      ></v-btn>
    </div>

    <div class="tooltip body-2 black--text" ref="tooltip" style="display: none">
      <div class="content"></div>
    </div>

    <svg class="w-100 fill-height" style="position: absolute">
      <SvgGrid ref="grid" :svg="svg as SVGSVGElement" :viewport="viewport as SVGGElement" :zoom="scale" />
    </svg>
    <SvgPanZoom :on-update="onUpdate" ref="panZoom" style="z-index: 50; min-height: 0">
      <svg ref="svg" @mousemove="mouseMove" @mousedown="onMouseDown" @mouseup="onMouseUp">
        <SvgViewerDefs />
        <g ref="viewport">
          <g>
            <g class="element element-1d" v-for="(element, index) in projectStore.beams" :key="`element-${index}`">
              <polyline
                v-if="
                  !useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showDeformedShape
                "
                :points="formatResults(element, scale)"
                vector-effect="non-scaling-stroke"
                class="deformedShape"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                v-if="
                  !useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showDeformedShape
                "
                :points="formatResults(element, scale)"
                vector-effect="non-scaling-stroke"
                class="deformedShape decoration"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <polyline
                v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showNormalForce"
                :points="formatNormalForces(element, scale)"
                vector-effect="non-scaling-stroke"
                class="normal"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showShearForce"
                :points="formatShearForces(element, scale)"
                vector-effect="non-scaling-stroke"
                class="shear"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polyline
                v-if="
                  !useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showBendingMoment
                "
                :points="formatMoments(element, scale)"
                vector-effect="non-scaling-stroke"
                class="moment"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!--<polyline
                :points="
                  formatElement([
                    solver.domain.nodes.get(element.nodes[0]).coords,
                    solver.domain.nodes.get(element.nodes[1]).coords
                  ])
                "
                vector-effect="non-scaling-stroke"
                class="decoration"
                stroke-linecap="round"
                :marker-start="elementStartMarker(element)"
                :marker-end="elementEndMarker(element)"
              />-->
              <polyline
                :points="
                  formatElement([
                  projectStore.solver.domain.nodes.get(element.nodes[0])!.coords,
                  projectStore.solver.domain.nodes.get(element.nodes[1])!.coords
                  ])
                "
                vector-effect="non-scaling-stroke"
                class="drawable"
                stroke-linecap="round"
              />

              <polyline
                :points="formatElementFibers(element, scale)"
                class="fibers"
                stroke-dasharray="5 4"
                vector-effect="non-scaling-stroke"
              />

              <circle
                :transform="`translate(${formatElementHinge(element, 0, scale)})`"
                :r="6 / scale"
                fill="white"
                stroke="black"
                vector-effect="non-scaling-stroke"
                stroke-width="2"
                v-if="element.hinges[0]"
              />

              <circle
                :transform="`translate(${formatElementHinge(element, 1, scale)})`"
                :r="6 / scale"
                fill="white"
                stroke="black"
                vector-effect="non-scaling-stroke"
                stroke-width="2"
                v-if="element.hinges[1]"
              />

              <g>
                <text
                  v-if="!useAppStore().zooming && viewerStore.showElementLabels"
                  :x="
                    (projectStore.solver.domain.nodes.get(element.nodes[0])!.coords[0] +
                    projectStore.solver.domain.nodes.get(element.nodes[1])!.coords[0]) /
                      2
                  "
                  :y="
                    (projectStore.solver.domain.nodes.get(element.nodes[0])!.coords[2] +
                    projectStore.solver.domain.nodes.get(element.nodes[1])!.coords[2]) /
                      2
                  "
                  :font-size="14 / scale"
                  font-weight="normal"
                  text-anchor="middle"
                  alignment-baseline="central"
                  :transform="
                    `${formatElementLabel(
                      element,
                      scale,
                      10
                    )} rotate(${formatElementAngle(
                      element
                    )} ${(projectStore.solver.domain.nodes.get(element.nodes[0])!.coords[0] +
                      projectStore.solver.domain.nodes.get(element.nodes[1])!.coords[0]) /
                      2} ${(projectStore.solver.domain.nodes.get(element.nodes[0])!
                      .coords[2] +
                      projectStore.solver.domain.nodes.get(element.nodes[1])!.coords[2]) /
                      2})`
                  "
                >
                  {{ element.label }}
                </text>
              </g>

              <polyline
                :points="
                  formatElement([
                  projectStore.solver.domain.nodes.get(element.nodes[0])!.coords,
                  projectStore.solver.domain.nodes.get(element.nodes[1])!.coords
                  ])
                "
                vector-effect="non-scaling-stroke"
                class="handle"
                :data-element-id="element.label"
                @mousemove="onElementHover"
                @mouseleave="hideTooltip"
              />
            </g>
          </g>
          <g v-if="!useAppStore().zooming && useViewerStore().showLoads">
            <g
              class="element-load load-1d"
              v-for="(eload, index) in useProjectStore().solver.loadCases[0].elementLoadList"
              :key="`element-load-${index}`"
            >
              <g v-if="eload.values[0] !== 0">
                <polyline
                  v-for="(load, i) in formatElementLoadForces(eload, scale, 0)"
                  :key="`load-force-${i}`"
                  points="0,0 0,0"
                  vector-effect="non-scaling-stroke"
                  class="drawable"
                  :transform="`translate(${load[0]} ${load[1]}) rotate(${formatElementLoadForcesAngle(eload, 0)})`"
                />
              </g>
              <g v-if="eload.values[1] !== 0">
                <polyline
                  v-for="(load, i) in formatElementLoadForces(eload, scale, 1)"
                  :key="`load-force-${i}`"
                  points="0,0 0,0"
                  vector-effect="non-scaling-stroke"
                  class="drawable"
                  :transform="`translate(${load[0]} ${load[1]}) rotate(${formatElementLoadForcesAngle(eload, 1)})`"
                />
              </g>
              <g v-if="!useAppStore().zooming && viewerStore.showLoads">
                <text
                  v-if="eload.values[0] !== 0"
                  :font-size="13 / scale"
                  font-weight="normal"
                  text-anchor="end"
                  alignment-baseline="middle"
                  :transform="formatElementLoadLabel(eload, scale, 0)"
                >
                  {{ Math.abs(eload.values[0]).toFixed(2) }}
                </text>
                <text
                  v-if="eload.values[1] !== 0"
                  :font-size="13 / scale"
                  font-weight="normal"
                  text-anchor="end"
                  alignment-baseline="middle"
                  :transform="formatElementLoadLabel(eload, scale, 1)"
                >
                  {{ Math.abs(eload.values[1]).toFixed(2) }}
                </text>
              </g>
              <!--<path
                :d="formatElementLoadHatch(eload, scale)"
                vector-effect="non-scaling-stroke"
                class="drawable"
                stroke-linecap="round"
              />-->
              <polygon
                :points="formatElementLoad(eload, scale)"
                fill="transparent"
                class="drawable"
                vector-effect="non-scaling-stroke"
              />
            </g>
            <g
              class="nodal-load"
              v-for="(nload, index) in useProjectStore().solver.loadCases[0].nodalLoadList"
              :key="`nodal-load-${index}`"
            >
              <polyline
                v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
                points="0,0 0,0"
                vector-effect="non-scaling-stroke"
                class="decoration force"
                :transform="
                  `translate(${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0]
                  }
              ${
                useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2]
              }) rotate(${formatNodalLoadAngle(nload)})`
                "
              />

              <polyline
                v-if="nload.values[4] !== 0"
                points="0,0 0,0"
                vector-effect="non-scaling-stroke"
                class="decoration moment"
                :class="{ cw: nload.values[4] < 0, ccw: nload.values[4] > 0 }"
                :transform="
                  `translate(${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0]
                  }
              ${
                useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2]
              })`
                "
              />

              <polyline :points="formatNodalLoad(nload, scale)" class="handle" />
              <polyline
                :points="formatNode(useProjectStore().solver.domain.nodes.get(nload.target).coords)"
                class="handle moment"
              />

              <text
                v-if="nload.values[4] !== 0"
                :font-size="13 / scale"
                font-weight="normal"
                text-anchor="start"
                alignment-baseline="central"
                :transform="
                  `translate(${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0] + 15 / scale
                  }
              ${
                useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2] - 15 / scale
              })`
                "
              >
                {{ Math.abs(nload.values[4]).toFixed(2) }}
              </text>

              <text
                v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
                :font-size="13 / scale"
                font-weight="normal"
                :text-anchor="nload.values[0] > 0 ? 'end' : 'start'"
                alignment-baseline="central"
                :transform="
                  `translate(${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0] - 40*nload.values[0] / Math.sqrt(nload.values[0]*nload.values[0] + nload.values[2]*nload.values[2]) / scale
                  }
              ${
                useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2] - 40*nload.values[2] / Math.sqrt(nload.values[0]*nload.values[0] + nload.values[2]*nload.values[2]) / scale
              })`
                "
              >
                {{ Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]).toFixed(2) }}
                <template v-if="nload.values[0] !== 0 && nload.values[2] !== 0">
                  ({{ nload.values[0].toFixed(2) }}, {{ nload.values[2].toFixed(2) }})
                </template>
              </text>
            </g>
          </g>
          <g>
            <g class="node" v-for="(node, index) in projectStore.solver.domain.nodes.values()" :key="`node-${index}`">
              <polyline
                v-if="viewerStore.showSupports && supportMarker(node) !== 'none'"
                :points="formatSupportNode(node)"
                :marker-start="supportMarker(node)"
                class="decoration"
              />

              <polyline :points="formatNode(node.coords)" class="drawable" />

              <polyline
                v-if="
                  !useAppStore().zooming &&
                  projectStore.solver.loadCases[0].solved &&
                  isSupported(node, DofID.Dz) &&
                  Math.abs(getReaction(node, DofID.Dz)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                marker-start="url(#force)"
                :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
                  Math.sign(getReaction(node, DofID.Dz)) >= 0 ? 0 : 180
                })`"
              />

              <text
                v-if="
                  !useAppStore().zooming &&
                  projectStore.solver.loadCases[0].solved &&
                  isSupported(node, DofID.Dz) &&
                  Math.abs(getReaction(node, DofID.Dz)) > 1e-32
                "
                :font-size="13 / scale"
                fill="red"
                font-weight="normal"
                text-anchor="end"
                alignment-baseline="baseline"
                :transform="`translate(${node.coords[0]}
              ${node.coords[2] - (40 * Math.sign(getReaction(node, DofID.Dz))) / scale})`"
              >
                {{ Math.abs(getReaction(node, DofID.Dz)).toFixed(2) }}
              </text>

              <polyline
                v-if="
                  !useAppStore().zooming &&
                  projectStore.solver.loadCases[0].solved &&
                  isSupported(node, DofID.Dx) &&
                  Math.abs(getReaction(node, DofID.Dx)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                marker-start="url(#force)"
                :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
                  -90 * Math.sign(getReaction(node, DofID.Dx))
                })`"
              />

              <text
                v-if="
                  !useAppStore().zooming &&
                  projectStore.solver.loadCases[0].solved &&
                  isSupported(node, DofID.Dx) &&
                  Math.abs(getReaction(node, DofID.Dx)) > 1e-32
                "
                :font-size="13 / scale"
                fill="red"
                font-weight="normal"
                :text-anchor="getReaction(node, DofID.Dx) > 0 ? 'end' : 'start'"
                alignment-baseline="baseline"
                :transform="`translate(${node.coords[0] - (Math.sign(getReaction(node, DofID.Dx)) * 40) / scale}
              ${node.coords[2]})`"
              >
                {{ Math.abs(getReaction(node, DofID.Dx)).toFixed(2) }}
              </text>

              <polyline
                v-if="
                  !useAppStore().zooming &&
                  projectStore.solver.loadCases[0].solved &&
                  isSupported(node, DofID.Ry) &&
                  Math.abs(getReaction(node, DofID.Ry)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                :marker-start="`url(#${getReaction(node, DofID.Ry) > 0 ? 'moment_ccw' : 'moment_cw'})`"
                :transform="`translate(${node.coords[0]} ${node.coords[2]})`"
              />

              <text
                v-if="
                  !useAppStore().zooming &&
                  projectStore.solver.loadCases[0].solved &&
                  isSupported(node, DofID.Ry) &&
                  Math.abs(getReaction(node, DofID.Ry)) > 1e-32
                "
                :font-size="13 / scale"
                fill="red"
                font-weight="normal"
                text-anchor="start"
                alignment-baseline="baseline"
                :transform="`translate(${node.coords[0] + 15 / scale}
              ${node.coords[2] - 15 / scale})`"
              >
                {{ Math.abs(getReaction(node, DofID.Ry)).toFixed(2) }}
              </text>

              <g
                v-if="!useAppStore().zooming && viewerStore.showNodeLabels"
                :transform="`translate(${(-12 - (node.label.toString().length - 1) * 2) / scale}, ${-12 / scale})`"
              >
                <circle
                  :cx="node.coords[0]"
                  :cy="node.coords[2]"
                  :r="(8 * (1 + Math.pow(node.label.toString().length - 1, 1.7) * 0.2)) / scale"
                  fill="transparent"
                  stroke="black"
                  vector-effect="non-scaling-stroke"
                ></circle>
                <text
                  :x="node.coords[0]"
                  :y="node.coords[2]"
                  :font-size="14 / scale"
                  font-weight="normal"
                  text-anchor="middle"
                  alignment-baseline="central"
                >
                  {{ node.label }}
                </text>
              </g>

              <polyline
                :points="formatNode(node.coords)"
                class="handle"
                :data-node-id="node.label"
                @mousemove="onNodeHover"
                @mouseleave="hideTooltip"
              />
            </g>
          </g>
        </g>
      </svg>
    </SvgPanZoom>

    <div class="d-none d-sm-inline-flex" style="position: absolute; right: 112px; top: 32px; z-index: 60">
      <v-toolbar color="grey-lighten-5" rounded="lg" height="32" class="elevation-1">
        <v-checkbox
          label="Deformed shape"
          v-model="useViewerStore().showDeformedShape"
          hide-details
          class="inline-checkbox mr-2"
        />
        <v-checkbox
          label="N (x)"
          v-model="useViewerStore().showNormalForce"
          hide-details
          class="inline-checkbox mr-2"
          :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
        />
        <v-checkbox
          label="Vz (x)"
          v-model="useViewerStore().showShearForce"
          hide-details
          class="inline-checkbox mr-2"
          :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
        />
        <v-checkbox
          label="My (x)"
          v-model="useViewerStore().showBendingMoment"
          hide-details
          class="inline-checkbox mr-2"
          :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
        />
      </v-toolbar>
    </div>
    <div class="d-none d-sm-inline-flex" style="position: absolute; right: 32px; top: 76px; z-index: 60">
      <v-toolbar color="grey-lighten-5" rounded="lg" height="32" class="elevation-1">
        <v-checkbox
          label="Supports"
          v-model="useViewerStore().showSupports"
          hide-details
          class="inline-checkbox mr-2"
        />
        <v-checkbox
          label="Loads"
          dense
          v-model.number="useViewerStore().showLoads"
          hide-details
          class="inline-checkbox mr-2"
          :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
        />

        <v-checkbox
          label="Node labels"
          v-model="useViewerStore().showNodeLabels"
          hide-details
          class="inline-checkbox mr-2"
        />
        <v-checkbox
          label="Element labels"
          v-model="useViewerStore().showElementLabels"
          hide-details
          class="inline-checkbox mr-2"
        />
      </v-toolbar>
    </div>
  </div>
</template>

<style lang="scss">
.svgViewer {
  position: absolute;
  width: 100%;
}

svg {
  display: block;
}

svg text {
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.mouse {
  font-size: 12px;
}

.selecting {
  stroke-width: 1px;
  stroke: #2f00ff;
  fill: rgba(0, 0, 255, 0.2);
}

.element-load.load-1d {
  text {
    fill: red;
  }
  pointer-events: all;
  stroke-linecap: butt;
  &:hover text {
    fill: blue;
  }
  &:hover path.drawable,
  &:hover polygon.drawable {
    stroke: blue;
    stroke-width: 3px;
  }
  &:hover polyline {
    marker-end: url(#force_centered_hover);
  }
  polygon,
  path {
    stroke: red;
    stroke-width: 1px;
    &.handle {
      stroke-width: 12px;
      stroke: transparent;
    }
  }
  polyline {
    marker-end: url(#force_centered);
  }
}

.element.element-1d {
  polyline {
    fill: none;
    stroke: black;
    stroke-width: 2px;
    &.handle {
      stroke-width: 24px;
      stroke: transparent;
    }
    &.decoration {
      stroke-width: 1px;
    }
  }
  &:hover polyline.drawable {
    stroke: blue;
    stroke-width: 5px;
  }
  polyline.fibers {
    stroke: #666;
    stroke-width: 1px;
  }
  polyline.deformedShape {
    stroke: #555;
    stroke-width: 2px;
    &.decoration {
      stroke-width: 1px;
    }
  }
  polyline.normal {
    stroke: #2222ff;
    stroke-width: 1px;
  }
  polyline.shear {
    stroke: #00af00;
    stroke-width: 1px;
  }
  polyline.moment {
    stroke: #ff2222;
    stroke-width: 1px;
  }
}

.node {
  polyline {
    stroke: #000;
    stroke-linecap: square;
    stroke-width: 6px;
    vector-effect: non-scaling-stroke;
    &.handle {
      stroke-width: 24px;
      stroke: transparent;
    }
    &.decoration {
      stroke-width: 1px;
    }
  }
  &:hover polyline.drawable {
    stroke: blue;
    stroke-width: 8px;
  }
}

.nodal-load {
  text {
    fill: red;
  }
  polyline {
    stroke-linecap: square;
    vector-effect: non-scaling-stroke;
    &.decoration.force {
      marker-end: url(#force);
    }
    &.decoration.moment.cw {
      marker-end: url(#moment_cw);
    }
    &.decoration.moment.ccw {
      marker-end: url(#moment_ccw);
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
    marker-end: url(#force_hover);
  }
  &:hover polyline.decoration.moment.cw {
    marker-end: url(#moment_cw_hover);
  }
  &:hover polyline.decoration.moment.ccw {
    marker-end: url(#moment_ccw_hover);
  }
}

.tooltip {
  font-size: 14px;
  position: absolute;
  margin-top: -6px;
  margin-left: 18px;
}

.tooltip .content {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  z-index: 100;
  padding: 3px 8px;
  font-weight: bold;
  box-shadow: 1px 1px 1px #ddd;
}

.tooltip .content:after {
  content: "";
  position: absolute;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  left: -6px;
  top: 8px;
  border-right: 6px solid rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

.inline-checkbox {
  .v-input--selection-controls__input {
    margin-right: 0px !important;
  }
}
</style>
