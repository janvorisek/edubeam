<script setup lang="ts">
import { closeModal, openModal } from "jenesius-vue-modal";
import SvgPanZoom from "./SVGPanZoom.vue";
import SvgGrid from "./SVGGrid.vue";
import SvgViewerDefs from "./SVGViewerDefs.vue";
import { useProjectStore } from "../store/project";
import { ref, onMounted, computed, nextTick, markRaw, watch, reactive, onUnmounted } from "vue";
import { useViewerStore } from "../store/viewer";
import { useAppStore } from "@/store/app";

import AddElementDialog from "./dialogs/AddElement.vue";
import AddNodeDialog from "./dialogs/AddNode.vue";
import Confirmation from "./dialogs/Confirmation.vue";

//import EditElementDialog from "./dialogs/EditElement.vue";
//import EditNodeDialog from "./dialogs/EditNode.vue";
import EditNodalLoadDialog from "./dialogs/EditNodalLoad.vue";
import EditElementLoadDialog from "./dialogs/EditElementLoad.vue";

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
  formatPrescribedBCAngle,
} from "../SVGUtils";
import { debounce, throttle } from "../utils";
import { Node, DofID, Beam2D, BeamElementLoad, NodalLoad, PrescribedDisplacement } from "ts-fem";
import { Matrix } from "mathjs";
import { useMagicKeys } from "@vueuse/core";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import ContextMenuElement from "./ContextMenuElement.vue";
import ContextMenuNode from "./ContextMenuNode.vue";
import ContextMenuElementLoad from "./ContextMenuElementLoad.vue";
import ContextMenuNodalLoad from "./ContextMenuNodalLoad.vue";

import { MouseMode } from "@/mouse";
import { formatMeasureAsHTML } from "../SVGUtils";

import Selection from "./Selection.vue";

import { useLayoutStore } from "@/store/layout";
import AddNodeVue from "./dialogs/AddNode.vue";
import { Command, IKeyValue, undoRedoManager } from "../CommandManager";

const props = defineProps<{
  id: string;
}>();

let mouseStartX = 0;
let mouseStartY = 0;
const mouseXReal = ref(0);
const mouseYReal = ref(0);

const startNode = ref<{ label: string | number; x: number; y: number } | null>(null);

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();
const layoutStore = useLayoutStore();

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

const zoom = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.code === "Equal") {
    panZoom.value?.zoom(svg.value.clientWidth / 2, svg.value.clientHeight / 2, -0.1);
    e.preventDefault();
  }

  if (e.ctrlKey && e.code === "Minus") {
    panZoom.value?.zoom(svg.value.clientWidth / 2, svg.value.clientHeight / 2, 0.1);
    e.preventDefault();
  }
};

onMounted(() => {
  window.addEventListener("keydown", zoom);
});

onUnmounted(() => {
  window.removeEventListener("keydown", zoom);
});

onMounted(() => {
  window.setTimeout(() => {
    fitContent();
  }, 100);
});

const setUnsolved = () => {
  useProjectStore().solver.loadCases[0].solved = false;
};

const solve = () => {
  nextTick(() => {
    useProjectStore().solve();
  });
};

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
}, 1000 / 30);

const { escape, f, c, _delete } = useMagicKeys({
  aliasMap: {
    _delete: "delete",
  },
});

const { ctrl_a } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if ("activeElement" in document && document.activeElement.tagName !== "BODY") return;
    if (e.ctrlKey && e.key === "a" && e.type === "keydown") e.preventDefault();
  },
});

watch(f, (v) => {
  if ("activeElement" in document && document.activeElement.tagName !== "BODY") return;
  if (v) fitContent();
});

watch(c, (v) => {
  if ("activeElement" in document && document.activeElement.tagName !== "BODY") return;
  if (v) centerContent();
});

watch(_delete, (v) => {
  if ("activeElement" in document && document.activeElement.tagName !== "BODY") return;
  if (v) {
    projectStore.deleteSelection2();
    solve();
  }
});

watch(ctrl_a, (v) => {
  if ("activeElement" in document && document.activeElement.tagName !== "BODY") return;
  if (v) {
    projectStore.selectAll2();
  }
});

watch(escape, (v) => {
  if (v) {
    if ("activeElement" in document) (document.activeElement as HTMLElement).blur();
    appStore.mouseMode = MouseMode.NONE;
    projectStore.clearSelection();
    projectStore.clearSelection2();
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

const onElementLoadHover = (e: MouseEvent, el: BeamElementLoad) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  //intersected.value.type = "element";
  //intersected.value.index = el.label;

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";
  tooltipContent.innerHTML = `<strong>${t("loads.UDL")}</strong><br>`;
  if (Math.abs(el.values[0]) > 1e-32) {
    tooltipContent.innerHTML += `f<sub>x</sub> = ${appStore.convertForce(el.values[0])} ${appStore.units.Force}/${appStore.units.Length}<br>`;
  }

  if (Math.abs(el.values[1]) > 1e-32) {
    tooltipContent.innerHTML += `f<sub>z</sub> = ${appStore.convertForce(el.values[1])} ${appStore.units.Force}/${appStore.units.Length}`;
  }

  tt.style.display = "block";
  document.body.style.cursor = "pointer";

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onNodalLoadHover = (e: MouseEvent, el: NodalLoad) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  //intersected.value.type = "element";
  //intersected.value.index = el.label;

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";
  tooltipContent.innerHTML = `<strong>${t("loads.nodalLoad")}</strong><br>`;
  if (Math.abs(el.values[0]) > 1e-32) {
    tooltipContent.innerHTML += `F<sub>x</sub> = ${appStore.convertForce(el.values[0])} ${appStore.units.Force}<br>`;
  }

  if (Math.abs(el.values[2]) > 1e-32) {
    tooltipContent.innerHTML += `F<sub>z</sub> = ${appStore.convertForce(el.values[2])} ${appStore.units.Force}<br>`;
  }

  if (Math.abs(el.values[4]) > 1e-32) {
    tooltipContent.innerHTML += `M<sub>y</sub> = ${appStore.convertForce(el.values[4])} ${appStore.units.Force}${appStore.units.Length}`;
  }

  tt.style.display = "block";
  document.body.style.cursor = "pointer";

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onPrescribedBCHover = (e: MouseEvent, el: PrescribedDisplacement) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector(".content") as HTMLElement;

  //intersected.value.type = "element";
  //intersected.value.index = el.label;

  tt.style.top = e.offsetY + "px";
  tt.style.left = e.offsetX + "px";
  tooltipContent.innerHTML = `<strong>${t("loads.prescribedDisplacement")}</strong><br>`;
  if (Math.abs(el.prescribedValues[0]) > 1e-32) {
    tooltipContent.innerHTML += `D<sub>x</sub> = ${appStore.convertForce(el.prescribedValues[0])} ${appStore.units.Length}<br>`;
  }

  if (Math.abs(el.prescribedValues[2]) > 1e-32) {
    tooltipContent.innerHTML += `D<sub>z</sub> = ${appStore.convertForce(el.prescribedValues[2])} ${appStore.units.Length}<br>`;
  }

  if (Math.abs(el.prescribedValues[4]) > 1e-32) {
    tooltipContent.innerHTML += `R<sub>y</sub> = ${appStore.convertForce(el.prescribedValues[4])} ${appStore.units.Angle}`;
  }

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

  tooltipContent.innerHTML = `<strong>${t("common.node")} ${node.label}</strong>`;
  if (
    projectStore.solver.loadCases[0].solved &&
    projectStore.beams.some((element) => element.nodes.includes(node.label))
  ) {
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
    )} rad`;
  }
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
  if (
    projectStore.solver.loadCases[0].solved &&
    projectStore.beams.some((element) => element.nodes.includes(node.label))
  ) {
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
    )} rad`;
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

const TTWIDTH = 210;
const onNodeClick = (e: MouseEvent) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 0;

  const target = e.target as HTMLElement;
  const index = target.getAttribute("data-node-id") || "-1";

  useProjectStore().selection.type = "node";
  useProjectStore().selection.label = index;

  projectStore.clearSelection2();
  projectStore.selection2.nodes = [useProjectStore().selection.label];

  //useProjectStore().selection.x = e.offsetX;
  //useProjectStore().selection.y = e.offsetY;

  let nx = target.getBoundingClientRect().left - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top - 64;
};

const onElementClick = (e: MouseEvent) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 1;

  const target = e.target as HTMLElement;
  const index = target.getAttribute("data-element-id") || "-1";

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = "element";
  useProjectStore().selection.label = index;
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;

  projectStore.clearSelection2();
  projectStore.selection2.elements = [useProjectStore().selection.label];
};

const onElementLoadClick = (e: MouseEvent, index: number) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 2;

  const target = e.target as HTMLElement;

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = "element-load";
  useProjectStore().selection.label = index;
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;

  projectStore.clearSelection2();
  projectStore.selection2.elementLoads = [index];
};

const onNodalLoadClick = (e: MouseEvent, index: number) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 2;

  const target = e.target as HTMLElement;

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = "nodal-load";
  useProjectStore().selection.label = index;
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;

  projectStore.clearSelection2();
  projectStore.selection2.nodalLoads = [index];
};

const onPrescribedBCClick = (e: MouseEvent, index: number) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 2;

  const target = e.target as HTMLElement;

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = "prescribedbc-load";
  useProjectStore().selection.label = index;
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;

  projectStore.clearSelection2();
  projectStore.selection2.prescribedBC = [index];
};

let drgNode = null;
let origX = 0;
let origZ = 0;
let finalX = 0;
let finalZ = 0;

const moveNode = () => {
  if (!drgNode) return;

  // undo/redo
  {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        setUnsolved();
        value.item.coords[0] = value.next.x;
        value.item.coords[2] = value.next.z;
        solve();
      },
      (value) => {
        setUnsolved();
        value.item.coords[0] = value.prev.x;
        value.item.coords[2] = value.prev.z;
        solve();
      },
      { item: drgNode, prev: { x: origX, z: origZ }, next: { x: finalX, z: finalZ } }
    );

    undoRedoManager.executeCommand(setCommand); // execute command
  }

  drgNode = null;
};

const mouseMove = (e: MouseEvent) => {
  appStore.mouse.x = e.clientX;
  appStore.mouse.y = e.clientY;

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

  if (appStore.mouseMode === MouseMode.MOVING && intersected.value.type === "node") {
    const index = intersected.value.index;
    if (index === null) return;

    const item = useProjectStore().solver.domain.nodes.get(index)!;

    if (drgNode === null) {
      drgNode = item;
      origX = item.coords[0];
      origZ = item.coords[2];
    }

    // @ts-expect-error ts-fem is wrongly typed
    useProjectStore().solver.domain.nodes.get(index)!.coords[0] = mouseXReal.value;

    // @ts-expect-error ts-fem is wrongly typed
    useProjectStore().solver.domain.nodes.get(index)!.coords[2] = mouseYReal.value;

    finalX = mouseXReal.value;
    finalZ = mouseYReal.value;

    //useProjectStore().solver.loadCases[0].solved = false;
    useProjectStore().solve();
  }
};

const onMouseDown = (e: PointerEvent) => {
  //if (this.svgPanZoom == null) return;
  projectStore.selection.type = null;

  if ("activeElement" in document) (document.activeElement as HTMLElement).blur();

  mouseStartX = e.offsetX;
  mouseStartY = e.offsetY;

  if (e.button === 0 /* && typeof e.button !== "undefined" */) {
    //this.svgPanZoom.disablePan();
    //mouseStartX = e.offsetX;
    //mouseStartY = e.offsetY;

    if (appStore.mouseMode === MouseMode.ADD_NODE) {
      mouseStartX = -9999;

      let newNodeId = projectStore.solver.domain.nodes.size + 1;

      while (projectStore.solver.domain.nodes.has(newNodeId.toString())) {
        newNodeId++;
      }

      // Check whether the node is being placed onto some of the existing elements
      // If so, we need to ask the user if they want split the existing element or place individual node
      for (const [label, el] of projectStore.solver.domain.elements) {
        const n1 = projectStore.solver.domain.nodes.get(el.nodes[0])!;
        const n2 = projectStore.solver.domain.nodes.get(el.nodes[1])!;

        const dist = distanceToLineSegment(
          { x: mouseXReal.value, y: mouseYReal.value },
          { x: n1.coords[0], y: n1.coords[2] },
          { x: n2.coords[0], y: n2.coords[2] }
        );

        if (dist < 0.1) {
          openModal(Confirmation, {
            title: t("confirmation.splitElementAndPlaceNode.title"),
            message: t("confirmation.splitElementAndPlaceNode.message", { label: el.label }),
            actions: [
              {
                label: t("confirmation.splitElementAndPlaceNode.split"),
                color: "green darken-1",
                action: () => {
                  projectStore.solver.loadCases[0].solved = false;

                  // Create the new node
                  projectStore.solver.domain.createNode(newNodeId, [mouseXReal.value, 0, mouseYReal.value]);

                  const prevHinges = el.hinges;

                  // Add two new elements
                  projectStore.solver.domain.createBeam2D(el.label + "a", [el.nodes[0], newNodeId], el.mat, el.cs, [
                    prevHinges[0],
                    false,
                  ]);

                  projectStore.solver.domain.createBeam2D(el.label + "b", [newNodeId, el.nodes[1]], el.mat, el.cs, [
                    false,
                    prevHinges[1],
                  ]);

                  // Move old load to new elements
                  for (const loadCase of projectStore.solver.loadCases) {
                    loadCase.solved = false;
                    for (let i = loadCase.elementLoadList.length - 1; i >= 0; i--) {
                      if (loadCase.elementLoadList[i].target === el.label) {
                        //loadCase.elementLoadList.splice(i, 1);

                        loadCase.elementLoadList[i].target = el.label + "a";
                        loadCase.createBeamElementUniformEdgeLoad(
                          el.label + "b",
                          loadCase.elementLoadList[i].values,
                          loadCase.elementLoadList[i].lcs
                        );
                      }
                    }
                  }

                  // Remove old element
                  projectStore.solver.domain.elements.delete(el.label);

                  appStore.mouseMode = MouseMode.NONE;
                  solve();
                  closeModal();
                },
              },
              {
                label: t("confirmation.placeIndividualNode"),
                color: "blue darken-1",
                action: () => {
                  projectStore.solver.loadCases[0].solved = false;

                  // Just add the node, its up to the user to connect it wherever he wants to
                  projectStore.solver.domain.createNode(newNodeId, [mouseXReal.value, 0, mouseYReal.value]);

                  appStore.mouseMode = MouseMode.NONE;
                  solve();
                  closeModal();
                },
              },
              {
                label: t("dialogs.common.cancel"),
                color: "red darken-1",
                action: () => {
                  closeModal();
                },
              },
            ],
            minWidth: 480,
          });

          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }

      // No existing element was found, just add the node
      projectStore.solver.domain.createNode(newNodeId, [mouseXReal.value, 0, mouseYReal.value]);
      solve();
      return;
    }

    if (appStore.mouseMode === MouseMode.ADD_ELEMENT) {
      mouseStartX = -9999;
      if (startNode.value === null) {
        startNode.value = { label: intersected.value.index, x: mouseXReal.value, y: mouseYReal.value };
      } else if (intersected.value.type === "node") {
        projectStore.solver.loadCases[0].solved = false;
        let newElId = projectStore.solver.domain.elements.size + 1;

        while (projectStore.solver.domain.elements.has(newElId.toString())) {
          newElId++;
        }

        const nid = startNode.value.label;
        // @ts-expect-error ts-fem is wrongly typed
        projectStore.solver.domain.createBeam2D(newElId, [nid, intersected.value.index], 1, 1);

        startNode.value = { label: intersected.value.index, x: mouseXReal.value, y: mouseYReal.value };
        solve();
      }

      return;
    }

    if (appStore.mouseMode === MouseMode.HOVER) {
      appStore.mouseMode = MouseMode.MOVING;
    } else if (e.pointerType === "mouse") {
      appStore.mouseMode = MouseMode.SELECTING;
      appStore.mouse.sx = e.clientX;
      appStore.mouse.sy = e.clientY;
    }
  } else {
    appStore.mouseMode = MouseMode.NONE;
    //svgPanZoom.enablePan();
  }
};

interface Point {
  x: number;
  y: number;
}

function distanceToLineSegment(point: Point, lineStart: Point, lineEnd: Point): number {
  const lengthSquared = (v: Point) => v.x * v.x + v.y * v.y;
  const dot = (v: Point, w: Point) => v.x * w.x + v.y * w.y;
  const sub = (v: Point, w: Point) => ({ x: v.x - w.x, y: v.y - w.y });
  const l2 = lengthSquared(sub(lineStart, lineEnd));
  if (l2 === 0) return Math.sqrt(lengthSquared(sub(point, lineStart))); // Line is a point.
  const t = Math.max(0, Math.min(1, dot(sub(point, lineStart), sub(lineEnd, lineStart)) / l2));
  const projection = { x: lineStart.x + t * (lineEnd.x - lineStart.x), y: lineStart.y + t * (lineEnd.y - lineStart.y) };
  return Math.sqrt(lengthSquared(sub(point, projection)));
}

const isIntersecting = (lineStart: Point, lineEnd: Point, rectStart: Point, rectEnd: Point): boolean => {
  const isInside = (p: Point): boolean => {
    return (
      p.x >= Math.min(rectStart.x, rectEnd.x) &&
      p.x <= Math.max(rectStart.x, rectEnd.x) &&
      p.y >= Math.min(rectStart.y, rectEnd.y) &&
      p.y <= Math.max(rectStart.y, rectEnd.y)
    );
  };

  const doesIntersect = (p1: Point, p2: Point, q1: Point, q2: Point): boolean => {
    const o1 = (q1.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (q1.x - p1.x);
    const o2 = (q2.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (q2.x - p1.x);
    const o3 = (q1.y - p2.y) * (p1.x - p2.x) - (p1.y - p2.y) * (q1.x - p2.x);
    const o4 = (q2.y - p2.y) * (p1.x - p2.x) - (p1.y - p2.y) * (q2.x - p2.x);

    return o1 * o2 < 0 && o3 * o4 < 0;
  };

  if (lineStart.y < rectStart.y && lineEnd.y < rectStart.y) return false;
  if (lineStart.y > rectEnd.y && lineEnd.y > rectEnd.y) return false;
  if (lineStart.x < rectStart.x && lineEnd.x < rectStart.x) return false;
  if (lineStart.x > rectEnd.x && lineEnd.x > rectEnd.x) return false;

  return (
    isInside(lineStart) ||
    isInside(lineEnd) ||
    doesIntersect(lineStart, lineEnd, rectStart, { x: rectStart.x, y: rectEnd.y }) ||
    doesIntersect(lineStart, lineEnd, { x: rectStart.x, y: rectEnd.y }, rectEnd) ||
    doesIntersect(lineStart, lineEnd, rectEnd, { x: rectStart.x, y: rectStart.y }) ||
    doesIntersect(lineStart, lineEnd, { x: rectStart.x, y: rectStart.y }, rectStart)
  );
};

const clientToSvgCoords = (ecoords: { x: number; y: number }, svgElement: SVGSVGElement): { x: number; y: number } => {
  const pt = svgElement.createSVGPoint();
  pt.x = ecoords.x;
  pt.y = ecoords.y;

  const cursorPt = pt.matrixTransform(svgElement.getScreenCTM().inverse());

  return { x: cursorPt.x, y: cursorPt.y };
};

const onMouseUp = (e: MouseEvent) => {
  if (appStore.mouseMode === MouseMode.ADD_NODE) return;
  if (appStore.mouseMode === MouseMode.ADD_ELEMENT) return;

  if (appStore.mouseMode === MouseMode.MOVING) {
    moveNode();
  }

  if (appStore.mouseMode === MouseMode.SELECTING) {
    const selectedNodes = [];
    const selectedElements = [];

    const current = clientToSvgCoords({ x: e.clientX, y: e.clientY }, svg.value!);
    const prev = clientToSvgCoords({ x: appStore.mouse.sx, y: appStore.mouse.sy }, svg.value!);

    const rx1 = Math.min(current.x, prev.x);
    const rx2 = Math.max(current.x, prev.x);
    const ry1 = Math.min(current.y, prev.y);
    const ry2 = Math.max(current.y, prev.y);

    // Loop over nodes and check if node in rectangle
    for (const [label, n] of useProjectStore().solver.domain.nodes) {
      if (n.coords[0] > rx1 && n.coords[0] < rx2 && n.coords[2] > ry1 && n.coords[2] < ry2) {
        selectedNodes.push(label);
      }
    }

    // Loop over elements and check if element in rectangle
    for (const [label, el] of useProjectStore().solver.domain.elements) {
      const n1 = useProjectStore().solver.domain.nodes.get(el.nodes[0])!;
      const n2 = useProjectStore().solver.domain.nodes.get(el.nodes[1])!;

      if (
        isIntersecting(
          { x: n1.coords[0], y: n1.coords[2] },
          { x: n2.coords[0], y: n2.coords[2] },
          { x: rx1, y: ry1 },
          { x: rx2, y: ry2 }
        )
      ) {
        selectedElements.push(label);
      }
    }

    /*if (selectedElements.length > 0 || selectedNodes.length > 0) {
      appStore.rightDrawerOpen = true;
    } else {
      appStore.rightDrawerOpen = false;
    }*/

    projectStore.clearSelection2();
    projectStore.selection2.elements = selectedElements;
    projectStore.selection2.nodes = selectedNodes;
  }

  appStore.mouseMode = MouseMode.NONE;

  intersected.value.type = null;
  intersected.value.index = null;
};

const isSupported = (node: Node, dof: DofID) => {
  return node.bcs.has(dof);
};

const isConnected = (node: Node) => {
  return [...projectStore.solver.domain.elements.values()].some((el) => el.nodes.includes(node.label));
};

const getReaction = (node: Node, dof: DofID) => {
  const r = node.getReactions(useProjectStore().solver.loadCases[0], true);
  const i = r.dofs.findIndex((e) => e === dof);

  return "get" in r.values ? (r.values as unknown as Matrix).get([i]) : r.values[i];
};

const showCtxMenu = ref(false);
const optionsCtxMenu = reactive({
  zIndex: 3000,
  minWidth: 230,
  x: 0,
  y: 0,
});

const openCtxMenu = (e: MouseEvent) => {
  if (hasMoved(e)) return;

  optionsCtxMenu.x = e.clientX;
  optionsCtxMenu.y = e.clientY;

  showCtxMenu.value = true;
};

const alertContextMenuItemClicked = (s: string) => {
  //
};

const isLoaded = computed(() => {
  return (
    projectStore.solver.loadCases[0].nodalLoadList.length > 0 ||
    projectStore.solver.loadCases[0].elementLoadList.length > 0 ||
    projectStore.solver.loadCases[0].prescribedBC.length > 0
  );
});

defineExpose({ centerContent, fitContent });
</script>

<template>
  <div class="d-flex flex-column fill-height">
    <div class="text-body-2 d-flex line-height-1" style="position: absolute; z-index: 100; bottom: 24px; right: 24px">
      <v-chip-group>
        <v-chip class="justify-end" density="compact" @click="appStore.openSettings()">
          <div class="d-flex ga-1">
            <span v-html="formatMeasureAsHTML(appStore.units.Length)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Area)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Force)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Pressure)"></span>
          </div>
        </v-chip>
      </v-chip-group>

      <!-- <v-chip-group>
        <v-chip density="compact">
          {{ projectStore.solver.neq }} free DOFs {{ projectStore.solver.pneq }} supported DOFs
        </v-chip>
      </v-chip-group> -->
    </div>
    <div id="undoRedo" style="position: absolute; top: 24px; left: 24px; z-index: 100">
      <v-btn
        icon="mdi:mdi-undo"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        title="Center content"
        @click.native="undoRedoManager.undo()"
      ></v-btn>
      <v-btn
        icon="mdi:mdi-redo"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        title="Center content"
        @click.native="undoRedoManager.redo()"
      ></v-btn>
    </div>
    <div id="viewerControls" class="text-black d-flex" style="position: absolute; z-index: 100; top: 24px; right: 24px">
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
      >
      </v-btn>
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

    <context-menu v-model:show="showCtxMenu" :options="optionsCtxMenu">
      <context-menu-item
        @click.ctrl="appStore.mouseMode = MouseMode.ADD_NODE"
        @click.exact="openModal(AddNodeDialog, {})"
      >
        <template #icon>
          <v-icon size="x-small">mdi-vector-point-plus</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t("nodes.addNode") }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">Hold Ctrl to add using mouse</span>
        </template>
      </context-menu-item>
      <context-menu-item
        @click.ctrl="appStore.mouseMode = MouseMode.ADD_ELEMENT"
        @click.exact="openModal(AddElementDialog, {})"
      >
        <template #icon>
          <v-icon size="x-small">mdi-vector-polyline-plus</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t("elements.addElement") }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">Hold Ctrl to add using mouse</span>
        </template>
      </context-menu-item>
      <context-menu-sperator />
      <context-menu-item
        :label="$t('common.edit')"
        :disabled="!projectStore.isAnythingSelected2()"
        @click="layoutStore.openWidget('Selection', Selection, {})"
      >
        <template #icon>
          <v-icon size="x-small">mdi-pencil</v-icon>
        </template>
      </context-menu-item>
      <context-menu-item
        :label="$t('common.copy')"
        :disabled="!projectStore.isAnythingSelected2()"
        @click="alertContextMenuItemClicked('Item1')"
      >
        <template #icon>
          <v-icon size="x-small">mdi-content-copy</v-icon>
        </template>
      </context-menu-item>
      <context-menu-item
        :label="$t('common.delete')"
        :disabled="!projectStore.isAnythingSelected2()"
        @click="
          projectStore.deleteSelection2();
          solve();
        "
      >
        <template #icon>
          <v-icon size="x-small">mdi-delete</v-icon>
        </template>
      </context-menu-item>
    </context-menu>

    <div class="tooltip body-2 black--text" ref="tooltip" style="display: none">
      <div class="content"></div>
    </div>

    <svg v-if="viewerStore.showGrid" class="w-100 fill-height" style="position: absolute">
      <SvgGrid ref="grid" :svg="svg as SVGSVGElement" :viewport="viewport as SVGGElement" :zoom="scale" />
    </svg>

    <SvgPanZoom
      :on-update="onUpdate"
      ref="panZoom"
      :padding="128"
      :mobile-padding="32"
      style="overflow: visible; z-index: 50; min-height: 0"
    >
      <svg
        ref="svg"
        @click.right.prevent="openCtxMenu($event)"
        @pointermove="mouseMove"
        @pointerdown="onMouseDown"
        @pointerup="onMouseUp"
      >
        <SvgViewerDefs v-if="props.id === appStore.openedTab!.props.id" />
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
                :class="{ selected: projectStore.selection2.elementLoads.includes(index) }"
                @mousemove="onElementLoadHover($event, eload)"
                @mouseleave="hideTooltip"
                @pointerup="onElementLoadClick($event, index)"
                @dblclick="
                  openModal(EditElementLoadDialog, { index });
                  projectStore.clearSelection();
                "
                v-for="(eload, index) in useProjectStore().solver.loadCases[0].elementLoadList"
                :key="`element-load-${index}`"
                :data-element-load-id="index"
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
                    dominant-baseline="middle"
                    :transform="formatElementLoadLabel(eload, scale, 0)"
                  >
                    {{ Math.abs(appStore.convertForce(eload.values[0])).toFixed(2) }}
                  </text>
                  <text
                    v-if="eload.values[1] !== 0"
                    :font-size="13 / scale"
                    font-weight="normal"
                    text-anchor="end"
                    dominant-baseline="middle"
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
                :class="{ selected: projectStore.selection2.nodalLoads.includes(index) }"
                @mousemove="onNodalLoadHover($event, nload)"
                @mouseleave="hideTooltip"
                @pointerup="onNodalLoadClick($event, index)"
                @dblclick="
                  openModal(EditNodalLoadDialog, { index });
                  projectStore.clearSelection();
                "
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
                  dominant-baseline="central"
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
                  dominant-baseline="central"
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
              <g
                class="nodal-load"
                :class="{ selected: projectStore.selection2.nodalLoads.includes(index) }"
                @mousemove="onPrescribedBCHover($event, nload)"
                @mouseleave="hideTooltip"
                @pointerup="onPrescribedBCClick($event, index)"
                @dblclick="
                  openModal(EditNodalLoadDialog, { index, type: 'displacement' });
                  projectStore.clearSelection();
                "
                v-for="(nload, index) in useProjectStore().solver.loadCases[0].prescribedBC"
                :key="`nodal-load-${index}`"
              >
                <polyline
                  v-if="nload.prescribedValues[0] !== 0 || nload.prescribedValues[2] !== 0"
                  :points="`${useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0]},${useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2]} ${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0] +
                    (nload.prescribedValues[0] * projectStore.defoScale * projectStore.resultsScalePx) / scale
                  } ${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2] +
                    (nload.prescribedValues[2] * projectStore.defoScale * projectStore.resultsScalePx) / scale
                  }`"
                  :stroke="viewerStore.colors.loads"
                  vector-effect="non-scaling-stroke"
                  stroke-dasharray="2,4"
                  marker-end="url(#forceTip)"
                  class="decoration"
                />

                <text
                  v-if="nload.prescribedValues[0] !== 0 || nload.prescribedValues[2] !== 0"
                  :font-size="13 / scale"
                  font-weight="normal"
                  :text-anchor="nload.prescribedValues[0] > 0 ? 'start' : 'end'"
                  dominant-baseline="central"
                  :transform="`translate(${
                    useProjectStore().solver.domain.nodes.get(nload.target)!.coords[0] +
                    (nload.prescribedValues[0] > 0 ? 10 / scale : -10 / scale) +
                    (nload.prescribedValues[0] * projectStore.defoScale * projectStore.resultsScalePx) / scale
                  }
              ${
                useProjectStore().solver.domain.nodes.get(nload.target)!.coords[2] +
                (nload.prescribedValues[2] * projectStore.defoScale * projectStore.resultsScalePx) / scale
              })`"
                >
                  {{ appStore.convertLength(nload.prescribedValues[0]).toFixed(2) }},
                  {{ appStore.convertLength(nload.prescribedValues[2]).toFixed(2) }},
                  {{ appStore.convertLength(nload.prescribedValues[4]).toFixed(2) }}
                </text>
              </g>
            </g>

            <g
              class="element element-1d"
              :class="{ selected: projectStore.selection2.elements.includes(element.label) }"
              v-for="(element, index) in projectStore.beams"
              :key="`element-${index}`"
            >
              <polyline
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showDeformedShape
                "
                :points="formatResults(element, scale)"
                vector-effect="non-scaling-stroke"
                class="deformedShape"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <g
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showNormalForce
                "
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
                    :fill="viewerStore.colors.normalForce"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    dominant-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    :fill="viewerStore.colors.normalForce"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    dominant-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>
              <g
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showShearForce
                "
              >
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
                    :fill="viewerStore.colors.shearForce"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    dominant-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    :fill="viewerStore.colors.shearForce"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    dominant-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>

              <g
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showBendingMoment
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
                    :fill="viewerStore.colors.bendingMoment"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    dominant-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    :fill="viewerStore.colors.bendingMoment"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    dominant-baseline="baseline"
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
                  dominant-baseline="central"
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
            <g
              class="node"
              :class="{ selected: projectStore.selection2.nodes.includes(node.label) }"
              v-for="(node, index) in projectStore.solver.domain.nodes.values()"
              :key="`node-${index}`"
            >
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
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showReactions &&
                  isSupported(node, DofID.Dz) &&
                  isConnected(node) &&
                  Math.abs(getReaction(node, DofID.Dz)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                marker-start="url(#reaction)"
                :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
                  Math.sign(getReaction(node, DofID.Dz)) >= 0 ? 0 : 180
                })`"
              />

              <text
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showReactions &&
                  isSupported(node, DofID.Dz) &&
                  isConnected(node) &&
                  Math.abs(getReaction(node, DofID.Dz)) > 1e-32
                "
                :font-size="13 / scale"
                :fill="viewerStore.colors.reactions"
                font-weight="normal"
                text-anchor="end"
                dominant-baseline="baseline"
                :transform="`translate(${node.coords[0]}
              ${node.coords[2] - (40 * Math.sign(getReaction(node, DofID.Dz))) / scale})`"
              >
                {{ appStore.convertForce(Math.abs(getReaction(node, DofID.Dz))).toFixed(2) }}
              </text>

              <polyline
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showReactions &&
                  isSupported(node, DofID.Dx) &&
                  isConnected(node) &&
                  Math.abs(getReaction(node, DofID.Dx)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                marker-start="url(#reaction)"
                :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
                  -90 * Math.sign(getReaction(node, DofID.Dx))
                })`"
              />

              <text
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showReactions &&
                  isSupported(node, DofID.Dx) &&
                  isConnected(node) &&
                  Math.abs(getReaction(node, DofID.Dx)) > 1e-32
                "
                :font-size="13 / scale"
                :fill="viewerStore.colors.reactions"
                font-weight="normal"
                :text-anchor="getReaction(node, DofID.Dx) > 0 ? 'end' : 'start'"
                dominant-baseline="baseline"
                :transform="`translate(${node.coords[0] - (Math.sign(getReaction(node, DofID.Dx)) * 40) / scale}
              ${node.coords[2]})`"
              >
                {{ appStore.convertForce(Math.abs(getReaction(node, DofID.Dx))).toFixed(2) }}
              </text>

              <polyline
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showReactions &&
                  isSupported(node, DofID.Ry) &&
                  isConnected(node) &&
                  Math.abs(getReaction(node, DofID.Ry)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                :marker-start="`url(#${getReaction(node, DofID.Ry) > 0 ? 'moment_reaction_ccw' : 'moment_reaction_cw'})`"
                :transform="`translate(${node.coords[0]} ${node.coords[2]})`"
              />

              <text
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showReactions &&
                  isSupported(node, DofID.Ry) &&
                  isConnected(node) &&
                  Math.abs(getReaction(node, DofID.Ry)) > 1e-32
                "
                :font-size="13 / scale"
                :fill="viewerStore.colors.reactions"
                font-weight="normal"
                text-anchor="start"
                dominant-baseline="baseline"
                :transform="`translate(${node.coords[0] + 15 / scale}
              ${node.coords[2] - 15 / scale})`"
              >
                {{ appStore.convertForce(Math.abs(getReaction(node, DofID.Ry))).toFixed(2) }}
              </text>

              <g
                v-if="
                  !useAppStore().zooming &&
                  isLoaded &&
                  projectStore.solver.loadCases[0].solved &&
                  viewerStore.showDeformedShape &&
                  // check if node is connected to anything
                  projectStore.beams.some((element) => element.nodes.includes(node.label))
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
                  dominant-baseline="central"
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
      :style="`left: ${Math.min(appStore.mouse.x, appStore.mouse.sx)}px; top: ${
        Math.min(appStore.mouse.y, appStore.mouse.sy) - 84
      }px; width: ${Math.abs(appStore.mouse.x - appStore.mouse.sx)}px; height: ${Math.abs(
        appStore.mouse.y - appStore.mouse.sy
      )}px;`"
    ></div>

    <div
      v-if="projectStore.selection.type !== null"
      class="selection-tooltip elevation-1"
      :style="`position: absolute; left: ${projectStore.selection.x}px; top: ${projectStore.selection.y}px;`"
    >
      <div class="d-flex justify-space-between">
        <div class="font-weight-medium text-body-2 px-4 pt-2">
          {{ $t("selection." + projectStore.selection.type) }}
          <span v-if="['node', 'element'].includes(projectStore.selection.type)">{{
            projectStore.selection.label
          }}</span>
        </div>
        <v-btn variant="text" icon="mdi-close" size="x-small" @click="projectStore.selection.type = null" />
      </div>
      <div>
        <ContextMenuNode v-if="projectStore.selection.type === 'node'"></ContextMenuNode>
        <ContextMenuElement v-if="projectStore.selection.type === 'element'"></ContextMenuElement>
        <ContextMenuElementLoad v-if="projectStore.selection.type === 'element-load'"></ContextMenuElementLoad>
        <ContextMenuNodalLoad v-if="projectStore.selection.type === 'nodal-load'"></ContextMenuNodalLoad>
        <!-- <ContextMenuNodalLoad v-if="projectStore.selection.type === 'nodal-load'"></ContextMenuNodalLoad>
        <ContextMenuElementLoad v-if="projectStore.selection.type === 'element-load'"></ContextMenuElementLoad> -->
      </div>
    </div>

    <div v-if="viewerStore.settingsOpen" class="" style="position: absolute; right: 24px; top: 64px; z-index: 600">
      <div id="viewerSettings" class="d-flex flex-sm-column pa-1 overflow-y-auto ga-2 align-end justify-end">
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
          <v-checkbox
            :label="$t('sideSettings.showReactions')"
            v-model="useViewerStore().showReactions"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
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
