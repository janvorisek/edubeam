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
import { Node, DofID, Beam2D, Element, NodalLoad, BeamElementLoad } from "ts-fem";
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

const props = withDefaults(
  defineProps<{
    showGrid: boolean;
    showElements: boolean;
    showNodes: boolean;
    showLoads: boolean;
    showSupports: boolean;
    showNodeLabels: boolean;
    showElementLabels: boolean;
    showDeformedShape: boolean;
    showNormalForce: boolean;
    showShearForce: boolean;
    showMoments: boolean;
    elements: Element[];
    nodes: Node[];
    nodalLoads: NodalLoad[];
    elementLoads: BeamElementLoad[];
    padding: number;
    mobilePadding: number;
  }>(),
  {
    showGrid: false,
    showElements: true,
    showNodes: true,
    showLoads: false,
    showSupports: false,
    showNodeLabels: false,
    showElementLabels: false,
    showDeformedShape: false,
    showNormalForce: false,
    showShearForce: false,
    showMoments: false,
    elements: () => [],
    nodes: () => [],
    nodalLoads: () => [],
    elementLoads: () => [],
    padding: 12,
    mobilePadding: 12,
  }
);

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

watch(projectStore.solver, () => {
  fitContent();
});

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
    <svg v-if="false" class="w-100 fill-height" style="position: absolute">
      <SvgGrid ref="grid" :svg="svg as SVGSVGElement" :viewport="viewport as SVGGElement" :zoom="scale" />
    </svg>

    <SvgPanZoom
      :on-update="onUpdate"
      ref="panZoom"
      :padding="props.padding"
      :mobile-padding="props.mobilePadding"
      style="overflow: visible; z-index: 50; min-height: 0"
    >
      <svg ref="svg" @pointermove="mouseMove" @pointerdown="onMouseDown" @pointerup="onMouseUp">
        <SvgViewerDefs />
        <g ref="viewport">
          <g>
            <g v-if="!useAppStore().zooming && props.showLoads">
              <g
                class="element-load load-1d"
                v-for="(eload, index) in props.elementLoads"
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
              <g class="nodal-load" v-for="(nload, index) in props.nodalLoads" :key="`nodal-load-${index}`">
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
                    {{ appStore.convertForce(nload.values[2]).toFixed(2) }})
                  </template>
                </text>
              </g>
            </g>

            <g class="element element-1d" v-for="(element, index) in props.elements" :key="`element-${index}`">
              <polyline
                v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && props.showDeformedShape"
                :points="formatResults(element, scale)"
                vector-effect="non-scaling-stroke"
                class="deformedShape"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!--<polyline
                v-if="
                  !useAppStore().zooming && projectStore.solver.loadCases[0].solved && props.showDeformedShape
                "
                :points="formatResults(element, scale)"
                vector-effect="non-scaling-stroke"
                class="deformedShape decoration"
                stroke-linecap="round"
                stroke-linejoin="round"
              />-->

              <g v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && props.showNormalForce">
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
              <g v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && props.showShearForce">
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

              <g v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && props.showBendingMoment">
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
                  v-if="!useAppStore().zooming && props.showElementLabels"
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
              />
            </g>
          </g>

          <g class="nodes">
            <g class="node" v-for="(node, index) in props.nodes" :key="`node-${index}`">
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
                  props.showLoads &&
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
                  props.showLoads &&
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
                  props.showLoads &&
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
                  props.showLoads &&
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
                  props.showLoads &&
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
                  props.showLoads &&
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
                v-if="!useAppStore().zooming && projectStore.solver.loadCases[0].solved && props.showDeformedShape"
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

                <polyline points="0,0 0 0" class="handle" :data-node-id="node.label" />
              </g>

              <g
                v-if="!useAppStore().zooming && props.showNodeLabels"
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

              <polyline :points="formatNode(node.coords)" class="handle" :data-node-id="node.label" />
            </g>
          </g>
        </g>
      </svg>
    </SvgPanZoom>
  </div>
</template>
