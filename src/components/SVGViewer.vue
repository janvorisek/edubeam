<script setup lang="ts">
import SvgPanZoom from "./SVGPanZoom.vue";
import SvgGrid from "./SVGGrid.vue";
import SvgViewerDefs from "./SVGViewerDefs.vue";
import { useProjectStore } from "../store/project";
import { ref, onMounted, computed, nextTick, markRaw, watch } from "vue";
import { useViewerStore } from "../store/viewer";
import { useAppStore } from "@/store/app";
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
  formatMomentsLabels,
  formatNormalForceLabels,
  formatShearForceLabels,
  formatElementLoadForces,
  formatElementLoadForcesAngle,
  formatExpValueAsHTML,
} from "../SVGUtils";
import { throttle } from "../utils";
import { Node, DofID, Beam2D } from "ts-fem";
import { Matrix } from "mathjs";
import { useMagicKeys } from "@vueuse/core";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import StiffnessMatrix from "./StiffnessMatrix.vue";
import { MouseMode } from "@/mouse";
import { formatMeasureAsHTML } from "../SVGUtils";

import { openModal } from "jenesius-vue-modal";
import AddNodalLoadDialog from "./dialogs/AddNodalLoad.vue";
import AddElementLoadDialog from "./dialogs/AddElementLoad.vue";

let mouseStartX = 0;
let mouseStartY = 0;
const mouseXReal = ref(0);
const mouseYReal = ref(0);

const startNode = ref<{ label: string | number; x: number; y: number } | null>(null);

const appStore = useAppStore();
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

const intersected = ref<{
  type: string | null;
  index: number | string | null;
  originalPosition: { x: number; y: number };
}>({
  type: null,
  index: null,
  originalPosition: { x: 0, y: 0 },
});

onMounted(() => {
  window.setTimeout(() => {
    fitContent();
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

const { escape, f, c } = useMagicKeys();

watch(f, (v) => {
  console.log(document.activeElement);
  if ("activeElement" in document && document.activeElement.tagName !== "BODY") return;
  if (v) fitContent();
});

watch(c, (v) => {
  if ("activeElement" in document && document.activeElement.tagName !== "BODY") return;
  if (v) centerContent();
});

watch(escape, (v) => {
  if (v) {
    if ("activeElement" in document) (document.activeElement as HTMLElement).blur();
    appStore.mouseMode = MouseMode.NONE;
    projectStore.clearSelection();
    startNode.value = null;

    //viewerStore.settingsOpen = false;
  }
});

const onElementHover = (e: MouseEvent, el: Beam2D) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  intersected.value.type = "element";
  intersected.value.index = el.label;

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";
  tooltipContent.innerHTML = `<strong>${t("common.element")} ${el.label}</strong>`;
  tt.style.display = "block";
  document.body.style.cursor = "pointer";

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onNodalDefoHover = (e: MouseEvent, node: Node) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";

  tooltipContent.innerHTML = `<strong>Node ${node.label}</strong>`;
  tooltipContent.innerHTML += "<br>";
  tooltipContent.innerHTML += `u<sub>x</sub> = ${formatExpValueAsHTML(
    // @ts-expect-error It return value for single Dof
    node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dx]),
    4
  )} m`;
  tooltipContent.innerHTML += "<br>";
  tooltipContent.innerHTML += `u<sub>z</sub> = ${formatExpValueAsHTML(
    // @ts-expect-error It return value for single Dof
    node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dz]),
    4
  )} m`;
  tooltipContent.innerHTML += "<br>";
  tooltipContent.innerHTML += `φ<sub>y</sub> = ${formatExpValueAsHTML(
    // @ts-expect-error It return value for single Dof
    node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Ry]),
    4
  )} m`;
  tt.style.display = "block";
  document.body.style.cursor = "pointer";

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onNodeHover = (e: MouseEvent, node: Node) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  intersected.value.type = "node";
  intersected.value.index = node.label;

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";
  tooltipContent.innerHTML = `<strong>${t("common.node")} ${node.label}</strong>`;
  if (projectStore.solver.loadCases[0].solved) {
    tooltipContent.innerHTML += "<br>";
    tooltipContent.innerHTML += `u<sub>x</sub> = ${formatExpValueAsHTML(
      // @ts-expect-error It return value for single Dof
      node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dx]),
      4
    )} m`;
    tooltipContent.innerHTML += "<br>";
    tooltipContent.innerHTML += `u<sub>z</sub> = ${formatExpValueAsHTML(
      // @ts-expect-error It return value for single Dof
      node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dz]),
      4
    )} m`;
    tooltipContent.innerHTML += "<br>";
    tooltipContent.innerHTML += `φ<sub>y</sub> = ${formatExpValueAsHTML(
      // @ts-expect-error It return value for single Dof
      node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Ry]),
      4
    )} m`;
  }
  tt.style.display = "block";
  document.body.style.cursor = "pointer";

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const hideTooltip = () => {
  const tt = tooltip.value as HTMLElement;
  tt.style.display = "none";
  document.body.style.cursor = "auto";

  if ([MouseMode.HOVER, MouseMode.SELECTING, MouseMode.ADD_ELEMENT].includes(appStore.mouseMode)) {
    if (appStore.mouseMode === MouseMode.HOVER) appStore.mouseMode = MouseMode.NONE;

    intersected.value.type = null;
    intersected.value.index = null;
  }
};

const hasMoved = (e: MouseEvent) => {
  const dx = e.offsetX - mouseStartX;
  const dy = e.offsetY - mouseStartY;
  const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  if (d > 10) return true;

  return false;
};

const onNodeClick = (e: MouseEvent) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 0;

  const target = e.target as HTMLElement;
  const index = target.getAttribute("data-node-id") || "-1";

  useProjectStore().selection.type = "node";
  useProjectStore().selection.label = isNaN(index as unknown as number) ? index : parseInt(index);
  //useProjectStore().selection.x = e.offsetX;
  //useProjectStore().selection.y = e.offsetY;

  let nx = target.getBoundingClientRect().left - 100;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - 200 - 24) nx = window.innerWidth - 200 - 24;

  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top - 64;
};

const onElementClick = (e: MouseEvent) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 1;

  const target = e.target as HTMLElement;
  const index = target.getAttribute("data-element-id") || "-1";

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - 100;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - 200 - 24) nx = window.innerWidth - 200 - 24;

  useProjectStore().selection.type = "element";
  useProjectStore().selection.label = isNaN(index as unknown as number) ? index : parseInt(index);
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;
};

const mouseMove = (e: MouseEvent) => {
  appStore.mouse.x = e.offsetX;
  appStore.mouse.y = e.offsetY;

  const matrix = viewport.value!.getCTM() as DOMMatrix;

  const leftTop = svg.value!.createSVGPoint();
  leftTop.x = e.offsetX; //svgBB.left;
  leftTop.y = e.offsetY; //svgBB.top;

  const inv = matrix.inverse();
  const svgP1 = leftTop.matrixTransform(inv);

  const mXReal = svgP1.x; // * zoom;
  const mYReal = svgP1.y; // * zoom;

  const realStep = viewerStore.gridStep;

  mouseXReal.value = /*Math.round(*/ mXReal; /* / realStep) * realStep;*/
  mouseYReal.value = /*Math.round(*/ mYReal; /* / realStep) * realStep;*/

  mouseXReal.value = Math.round(mXReal / realStep) * realStep;
  mouseYReal.value = Math.round(mYReal / realStep) * realStep;

  mouseXReal.value = viewerStore.snapToGrid ? mouseXReal.value : mXReal / scale.value;
  mouseYReal.value = viewerStore.snapToGrid ? mouseYReal.value : mYReal / scale.value;

  if (appStore.mouseMode === MouseMode.MOVING) {
    const index = intersected.value.index;
    if (index === null) return;

    // @ts-expect-error ts-fem is wrongly typed
    useProjectStore().solver.domain.nodes.get(index)!.coords[0] = mouseXReal.value;

    // @ts-expect-error ts-fem is wrongly typed
    useProjectStore().solver.domain.nodes.get(index)!.coords[2] = mouseYReal.value;

    useProjectStore().solver.loadCases[0].solved = false;
    useProjectStore().solve();
  }
};

const onMouseDown = (e: PointerEvent) => {
  //if (this.svgPanZoom == null) return;
  projectStore.selection.type = null;

  console.log(e);

  if ("activeElement" in document) (document.activeElement as HTMLElement).blur();

  if (e.button === 0 /* && typeof e.button !== "undefined" */) {
    //this.svgPanZoom.disablePan();
    mouseStartX = e.offsetX;
    mouseStartY = e.offsetY;

    if (appStore.mouseMode === MouseMode.ADD_NODE) {
      mouseStartX = -9999;
      projectStore.solver.loadCases[0].solved = false;
      const newNodeId = projectStore.solver.domain.nodes.size + 1;
      projectStore.solver.domain.createNode(newNodeId, [mouseXReal.value, 0, mouseYReal.value]);
      return;
    }

    if (appStore.mouseMode === MouseMode.ADD_ELEMENT) {
      mouseStartX = -9999;
      if (startNode.value === null) {
        startNode.value = { label: intersected.value.index, x: mouseXReal.value, y: mouseYReal.value };
      } else if (intersected.value.type === "node") {
        projectStore.solver.loadCases[0].solved = false;
        const newElId = projectStore.solver.domain.elements.size + 1;
        const nid = startNode.value.label;
        // @ts-expect-error ts-fem is wrongly typed
        projectStore.solver.domain.createBeam2D(newElId, [nid, intersected.value.index], 1, 1);

        startNode.value = { label: intersected.value.index, x: mouseXReal.value, y: mouseYReal.value };
        projectStore.solve();
      }

      return;
    }

    if (appStore.mouseMode === MouseMode.HOVER) {
      appStore.mouseMode = MouseMode.MOVING;
    } else if (e.pointerType === "mouse") {
      appStore.mouseMode = MouseMode.SELECTING;
      appStore.mouse.sx = e.offsetX;
      appStore.mouse.sy = e.offsetY;
    }
  } else {
    appStore.mouseMode = MouseMode.NONE;
    //svgPanZoom.enablePan();
  }
};

const lineIntersectsrect = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rx1: number,
  ry1: number,
  rx2: number,
  ry2: number
) => {
  // completely outside
  if (x1 < rx1 && x2 < rx1) return false;
  if (y1 < ry1 && y2 < ry1) return false;
  if (x1 > rx2 && x2 > rx2) return false;
  if (y1 > ry2 && y2 > ry2) return false;

  // completely inside
  if (x1 > rx1 && x1 < rx2 && y1 > ry1 && y1 < ry2) return true;
  if (x2 > rx1 && x2 < rx2 && y2 > ry1 && y2 < ry2) return true;

  // line intersects rectangle
  if (x1 > rx1 && x1 < rx2) return true;
  if (x2 > rx1 && x2 < rx2) return true;
  if (y1 > ry1 && y1 < ry2) return true;
  if (y2 > ry1 && y2 < ry2) return true;

  return false;
};

const onMouseUp = (e: MouseEvent) => {
  if (appStore.mouseMode === MouseMode.ADD_NODE) return;
  if (appStore.mouseMode === MouseMode.ADD_ELEMENT) return;

  if (appStore.mouseMode === MouseMode.SELECTING) {
    const selectedNodes = [];
    const selectedElements = [];

    const b = (e.target as HTMLElement).getBoundingClientRect();
    const rx1 = Math.min(appStore.mouse.sx + b.left, appStore.mouse.x + b.left);
    const rx2 = Math.max(appStore.mouse.sx + b.left, appStore.mouse.x + b.left);
    const ry1 = Math.min(appStore.mouse.sy + b.top, appStore.mouse.y + b.top);
    const ry2 = Math.max(appStore.mouse.sy + b.top, appStore.mouse.y + b.top);

    // Loop over nodes and check if node in rectangle
    for (const [label, n] of useProjectStore().solver.domain.nodes) {
      const {
        top, // x position on viewport (window)
        left, // y position on viewport (window)
      } = document.querySelector(`.node .drawable[data-label="${n.label}"]`).getBoundingClientRect();

      console.log({ top, left, m: appStore.mouse });

      if (left > rx1 && left < rx2 && top > ry1 && top < ry2) {
        selectedNodes.push(label);
      }
    }

    // Loop over elements and check if element in rectangle
    for (const [label, el] of useProjectStore().solver.domain.elements) {
      const n1 = useProjectStore().solver.domain.nodes.get(el.nodes[0])!;
      const n2 = useProjectStore().solver.domain.nodes.get(el.nodes[1])!;

      const n1el = document.querySelector(`.node .drawable[data-label="${n1.label}"]`).getBoundingClientRect();
      const n2el = document.querySelector(`.node .drawable[data-label="${n2.label}"]`).getBoundingClientRect();

      const n1x = n1el.left;
      const n1y = n1el.top;
      const n2x = n2el.left;
      const n2y = n2el.top;

      if (lineIntersectsrect(n1x, n1y, n2x, n2y, rx1, ry1, rx2, ry2)) {
        selectedElements.push(label);
      }
    }

    console.log({ selectedNodes, selectedElements });
  }

  appStore.mouseMode = MouseMode.NONE;

  intersected.value.type = null;
  intersected.value.index = null;
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
    <div class="text-body-2 d-flex line-height-1" style="position: absolute; z-index: 10; bottom: 24px; right: 24px">
      <v-chip-group>
        <v-chip class="justify-end mr-1" density="compact" @click="appStore.openSettings()">
          <div class="d-flex ga-1">
            <span v-html="formatMeasureAsHTML(appStore.units.Length)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Area)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Force)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Pressure)"></span>
          </div>
        </v-chip>
      </v-chip-group>

      <v-chip-group>
        <v-chip density="compact">
          {{ projectStore.solver.neq }} free DOFs {{ projectStore.solver.pneq }} supported DOFs
        </v-chip>
      </v-chip-group>
    </div>
    <div class="text-black d-flex" style="position: absolute; z-index: 100; top: 24px; right: 24px">
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
        class="mr-1"
        rounded="lg"
        title="Fit content to screen"
        @click="fitContent"
      ></v-btn>
      <v-btn
        icon="mdi:mdi-cog"
        size="32"
        density="comfortable"
        rounded="lg"
        title="Settings"
        :color="viewerStore.settingsOpen ? 'primary' : 'default'"
        @click="viewerStore.settingsOpen = !viewerStore.settingsOpen"
      ></v-btn>
    </div>

    <div class="tooltip body-2 black--text" ref="tooltip" style="display: none">
      <div class="content"></div>
    </div>

    <svg v-if="viewerStore.showGrid" class="w-100 fill-height" style="position: absolute">
      <SvgGrid ref="grid" :svg="svg as SVGSVGElement" :viewport="viewport as SVGGElement" :zoom="scale" />
    </svg>

    <SvgPanZoom :on-update="onUpdate" ref="panZoom" style="overflow: visible; z-index: 50; min-height: 0">
      <svg ref="svg" @pointermove="mouseMove" @pointerdown="onMouseDown" @pointerup="onMouseUp">
        <SvgViewerDefs />
        <g ref="viewport">
          <g v-if="appStore.mouseMode === MouseMode.ADD_NODE">
            <rect
              :x="mouseXReal"
              :y="mouseYReal"
              :width="8 / scale"
              :height="8 / scale"
              :transform="`translate(${-8 / 2 / scale},${-8 / 2 / scale})`"
              style="fill: #aaa"
            />
          </g>
          <g v-if="appStore.mouseMode === MouseMode.ADD_ELEMENT && startNode !== null">
            <line
              :x1="startNode.x"
              :y1="startNode.y"
              :x2="mouseXReal"
              :y2="mouseYReal"
              :stroke-dasharray="intersected.type === 'node' ? `none` : `5 4`"
              style="vector-effect: non-scaling-stroke; stroke-width: 2px; stroke: #aaa"
            />
          </g>
          <g>
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
                    {{ Math.abs(appStore.convertForce(eload.values[0])).toFixed(2) }}
                  </text>
                  <text
                    v-if="eload.values[1] !== 0"
                    :font-size="13 / scale"
                    font-weight="normal"
                    text-anchor="end"
                    alignment-baseline="middle"
                    :transform="formatElementLoadLabel(eload, scale, 1)"
                  >
                    {{ Math.abs(appStore.convertForce(eload.values[1])).toFixed(2) }}
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
                  :transform="`translate(${useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0]}
              ${useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2]}) rotate(${formatNodalLoadAngle(
                nload
              )})`"
                />

                <polyline
                  v-if="nload.values[4] !== 0"
                  points="0,0 0,0"
                  vector-effect="non-scaling-stroke"
                  class="decoration moment"
                  :class="{ cw: nload.values[4] < 0, ccw: nload.values[4] > 0 }"
                  :transform="`translate(${useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0]}
              ${useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2]})`"
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
                  :transform="`translate(${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0] + 15 / scale
                  }
              ${useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2] - 15 / scale})`"
                >
                  {{ Math.abs(appStore.convertForce(nload.values[4])).toFixed(2) }}
                </text>

                <text
                  v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
                  :font-size="13 / scale"
                  font-weight="normal"
                  :text-anchor="nload.values[0] > 0 ? 'end' : 'start'"
                  alignment-baseline="central"
                  :transform="`translate(${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0] -
                    (40 * nload.values[0]) /
                      Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
                      scale
                  }
              ${
                useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2] -
                (40 * nload.values[2]) /
                  Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
                  scale
              })`"
                >
                  {{
                    appStore
                      .convertForce(Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]))
                      .toFixed(2)
                  }}
                  <template v-if="nload.values[0] !== 0 && nload.values[2] !== 0">
                    ({{ appStore.convertForce(nload.values[0]).toFixed(2) }},
                    {{ appStore.convertForce(nload.values[2]).toFixed(2) }}
                  </template>
                </text>
              </g>
            </g>

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
              <!--<polyline
                v-if="
                  !useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showDeformedShape
                "
                :points="formatResults(element, scale)"
                vector-effect="non-scaling-stroke"
                class="deformedShape decoration"
                stroke-linecap="round"
                stroke-linejoin="round"
              />-->

              <g
                v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showNormalForce"
              >
                <polyline
                  :points="formatNormalForces(element, scale)"
                  vector-effect="non-scaling-stroke"
                  class="normal"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <g
                  v-for="(mv, mli) in formatNormalForceLabels(element, scale)"
                  :key="mli"
                  :transform="`translate(${mv[0] + (mv[2] < 0 ? -4 : 4) / scale} ${
                    mv[1] + (mv[2] < 0 ? -4 : 4) / scale
                  })`"
                >
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    filter="url(#textLabel)"
                    fill="blue"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    fill="blue"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>
              <g v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showShearForce">
                <polyline
                  :points="formatShearForces(element, scale)"
                  vector-effect="non-scaling-stroke"
                  class="shear"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <g
                  v-for="(mv, mli) in formatShearForceLabels(element, scale)"
                  :key="mli"
                  :transform="`translate(${mv[0] + (mv[2] < 0 ? -4 : 4) / scale} ${
                    mv[1] + (mv[2] < 0 ? -4 : 4) / scale
                  })`"
                >
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    filter="url(#textLabel)"
                    fill="green"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    fill="green"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>

              <g
                v-if="
                  !useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showBendingMoment
                "
              >
                <polyline
                  :points="formatMoments(element, scale)"
                  vector-effect="non-scaling-stroke"
                  class="moment"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <g
                  v-for="(mv, mli) in formatMomentsLabels(element, scale)"
                  :key="mli"
                  :transform="`translate(${mv[0] + (mv[2] < 0 ? -4 : 4) / scale} ${
                    mv[1] + (mv[2] < 0 ? -4 : 4) / scale
                  })`"
                >
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    filter="url(#textLabel)"
                    fill="red"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    fill="red"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>

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
                    projectStore.solver.domain.nodes.get(element.nodes[1])!.coords,
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
                  :transform="`${formatElementLabel(element, scale, 10)} rotate(${formatElementAngle(element)} ${
                    (projectStore.solver.domain.nodes.get(element.nodes[0])!.coords[0] +
                      projectStore.solver.domain.nodes.get(element.nodes[1])!.coords[0]) /
                    2
                  } ${
                    (projectStore.solver.domain.nodes.get(element.nodes[0])!.coords[2] +
                      projectStore.solver.domain.nodes.get(element.nodes[1])!.coords[2]) /
                    2
                  })`"
                >
                  {{ element.label }}
                </text>
              </g>

              <polyline
                :points="
                  formatElement([
                    projectStore.solver.domain.nodes.get(element.nodes[0])!.coords,
                    projectStore.solver.domain.nodes.get(element.nodes[1])!.coords,
                  ])
                "
                vector-effect="non-scaling-stroke"
                class="handle"
                :data-element-id="element.label"
                @mousemove="onElementHover($event, element)"
                @mouseleave="hideTooltip"
                @pointerup="onElementClick"
              />
            </g>
          </g>

          <g class="nodes">
            <g class="node" v-for="(node, index) in projectStore.solver.domain.nodes.values()" :key="`node-${index}`">
              <polyline
                v-if="viewerStore.showSupports && supportMarker(node) !== 'none'"
                :points="formatSupportNode(node)"
                :marker-start="supportMarker(node)"
                class="decoration"
              />

              <polyline :data-label="node.label" :points="formatNode(node.coords)" class="drawable" />

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
                fill="#FF8700"
                font-weight="normal"
                text-anchor="end"
                alignment-baseline="baseline"
                :transform="`translate(${node.coords[0]}
              ${node.coords[2] - (40 * Math.sign(getReaction(node, DofID.Dz))) / scale})`"
              >
                {{ appStore.convertForce(Math.abs(getReaction(node, DofID.Dz))).toFixed(2) }}
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
                fill="#FF8700"
                font-weight="normal"
                :text-anchor="getReaction(node, DofID.Dx) > 0 ? 'end' : 'start'"
                alignment-baseline="baseline"
                :transform="`translate(${node.coords[0] - (Math.sign(getReaction(node, DofID.Dx)) * 40) / scale}
              ${node.coords[2]})`"
              >
                {{ appStore.convertForce(Math.abs(getReaction(node, DofID.Dx))).toFixed(2) }}
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
                fill="#FF8700"
                font-weight="normal"
                text-anchor="start"
                alignment-baseline="baseline"
                :transform="`translate(${node.coords[0] + 15 / scale}
              ${node.coords[2] - 15 / scale})`"
              >
                {{ appStore.convertForce(Math.abs(getReaction(node, DofID.Ry))).toFixed(2) }}
              </text>

              <g
                v-if="
                  !useAppStore().zooming && projectStore.solver.loadCases[0].solved && viewerStore.showDeformedShape
                "
                :transform="`translate(${
                  node.coords[0] +
                  // @ts-expect-error ts-fem is wrongly typed
                  (node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dx]) *
                    projectStore.defoScale *
                    projectStore.resultsScalePx) /
                    scale
                }, ${
                  node.coords[2] +
                  // @ts-expect-error ts-fem is wrongly typed
                  (node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dz]) *
                    projectStore.defoScale *
                    projectStore.resultsScalePx) /
                    scale
                })`"
              >
                <polyline points="0,0 0,0" class="drawable deformed" />

                <polyline
                  points="0,0 0 0"
                  class="handle"
                  :data-node-id="node.label"
                  @mousemove="onNodalDefoHover($event, node)"
                  @mouseleave="hideTooltip"
                />
              </g>

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
                @mousemove="onNodeHover($event, node)"
                @mouseleave="hideTooltip"
                @pointerup="onNodeClick"
              />
            </g>
          </g>
        </g>
      </svg>
    </SvgPanZoom>

    <div
      v-if="appStore.mouseMode === MouseMode.SELECTING"
      class="selecting"
      :style="`left: ${Math.min(appStore.mouse.x, appStore.mouse.sx)}px; top: ${Math.min(
        appStore.mouse.y,
        appStore.mouse.sy
      )}px; width: ${Math.abs(appStore.mouse.x - appStore.mouse.sx)}px; height: ${Math.abs(
        appStore.mouse.y - appStore.mouse.sy
      )}px;`"
    ></div>

    <div
      v-if="projectStore.selection.type !== null"
      class="selection-tooltip elevation-1"
      :style="`position: absolute; left: ${projectStore.selection.x}px; top: ${projectStore.selection.y}px;`"
    >
      <div class="d-flex justify-space-between">
        <div class="font-weight-medium px-4 py-2">
          {{ projectStore.selection.type }} {{ projectStore.selection.label }}
        </div>
        <v-btn variant="text" icon="mdi-close" size="x-small" @click="projectStore.selection.type = null" />
      </div>
      <div>
        <v-list density="compact" class="py-0">
          <v-list-item
            v-if="projectStore.selection.type === 'node'"
            link
            class="text-body-2"
            @click="openModal(AddNodalLoadDialog, { label: projectStore.selection.label })"
          >
            <template #prepend>
              <div class="pr-2"><v-icon icon="mdi-weight" /></div>
            </template>
            Add load
          </v-list-item>
          <v-list-item
            v-if="projectStore.selection.type === 'element'"
            link
            class="text-body-2"
            @click="openModal(AddElementLoadDialog, { label: projectStore.selection.label })"
          >
            <template #prepend>
              <div class="pr-2"><v-icon icon="mdi-weight" /></div>
            </template>
            Add load
          </v-list-item>
          <v-list-item link class="text-body-2" v-if="projectStore.selection.type === 'element'">
            Show details
            <template #prepend>
              <div class="pr-2"><v-icon icon="mdi-function-variant" /></div>
            </template>
          </v-list-item>
          <v-list-item
            link
            class="text-body-2"
            v-if="projectStore.selection.type === 'element'"
            @click="
              projectStore.selection.type = null;
              appStore.tabs.push({
                title: `stiffness matrix (element ${projectStore.selection.label})`,
                component: markRaw(StiffnessMatrix),
                props: markRaw({ label: projectStore.selection.label }),
                closable: true,
              });
              appStore.tab = appStore.tabs.length - 1;
            "
          >
            Stiffness matrix
            <template #prepend>
              <div class="pr-2"><v-icon icon="mdi-matrix" /></div>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <div v-if="viewerStore.settingsOpen" class="" style="position: absolute; right: 24px; top: 64px; z-index: 600">
      <div class="d-flex flex-sm-column pa-1 overflow-y-auto ga-2 align-end justify-end">
        <div
          color="grey-lighten-5"
          rounded="lg"
          class="d-sm-flex bg-grey-lighten-5 elevation-1 rounded"
          style="width: fit-content"
        >
          <v-checkbox
            :label="$t('sideSettings.showDeformedShape')"
            v-model="useViewerStore().showDeformedShape"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
          <v-checkbox
            label=""
            v-model="useViewerStore().showNormalForce"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label>N (x)</template>
          </v-checkbox>
          <v-checkbox
            label="Vz (x)"
            v-model="useViewerStore().showShearForce"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label>V<sub>z</sub>&nbsp;(x)</template>
          </v-checkbox>
          <v-checkbox
            label="My (x)"
            v-model="useViewerStore().showBendingMoment"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label>M<sub>y</sub>&nbsp;(x)</template>
          </v-checkbox>
        </div>

        <div color="grey-lighten-5" rounded="lg" height="32" class="d-sm-flex bg-grey-lighten-5 elevation-1 rounded">
          <v-checkbox
            :label="$t('sideSettings.supports')"
            v-model="useViewerStore().showSupports"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
          <v-checkbox
            :label="$t('sideSettings.loads')"
            dense
            v-model.number="useViewerStore().showLoads"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          />

          <v-checkbox
            :label="$t('sideSettings.nodeLabels')"
            v-model="useViewerStore().showNodeLabels"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
          <v-checkbox
            :label="$t('sideSettings.elementLabels')"
            v-model="useViewerStore().showElementLabels"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
        </div>
      </div>
      <div class="text-right text-sm-body-2">
        <button class="text-decoration-underline bg-white" @click="appStore.openSettings()">
          {{ $t("sideSettings.more_settings") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.line-height-1 {
  line-height: 1 !important;
}

.svgViewer {
  position: absolute;
  width: 100%;
}

svg {
  display: block;
  *:hover {
    transition: all 0.2s ease-out;
  }
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
  position: absolute;
  border: 1px solid #2f00ff;
  background: rgba(0, 0, 255, 0.2);
}

.element-load.load-1d {
  text {
    fill: #ff8700;
  }
  pointer-events: all;
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
    marker-end: url(#force_centered_hover);
  }
  polygon,
  path {
    stroke: #ff8700;
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
    fill: #2222ff;
    fill-opacity: 0.1;
    &:hover {
      fill-opacity: 0.2;
    }
  }
  polyline.shear {
    stroke: #00af00;
    stroke-width: 1px;
    fill: #00af00;
    fill-opacity: 0.1;
    &:hover {
      fill-opacity: 0.2;
    }
  }
  polyline.moment {
    stroke: #ff2222;
    stroke-width: 1px;
    fill: #ff2222;
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
    }
    &.drawable.deformed {
      stroke: #555;
    }
  }
  &:hover polyline.drawable {
    stroke: blue;
    stroke-width: 8px;
  }
}

.nodal-load {
  text {
    fill: #ff8700;
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
  //font-weight: bold;
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
