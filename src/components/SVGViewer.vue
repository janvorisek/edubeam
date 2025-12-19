<script setup lang="ts">
import { closeModal, openModal } from 'jenesius-vue-modal';
import SvgPanZoom from './SVGPanZoom.vue';
import SvgGrid from './SVGGrid.vue';
import SvgViewerDefs from './SVGViewerDefs.vue';
import { useProjectStore } from '../store/project';
import { ref, onMounted, computed, nextTick, watch, reactive, onUnmounted, provide } from 'vue';
import { useDisplay } from 'vuetify';
import { useViewerStore } from '../store/viewer';
import { useAppStore } from '@/store/app';

import AddElementDialog from './dialogs/AddElement.vue';
import AddNodeDialog from './dialogs/AddNode.vue';
import Confirmation from './dialogs/Confirmation.vue';

import EditNodalLoadDialog from './dialogs/EditNodalLoad.vue';
import EditElementLoadDialog from './dialogs/EditElementLoad.vue';

import SVGElementLoad from './svg/ElementLoad.vue';
import SVGElementConcentratedLoad from './svg/ElementConcentratedLoad.vue';
import SVGNodalLoad from './svg/NodalLoad.vue';
import SVGPrescribedDisplacement from './svg/PrescribedDisplacement.vue';
import SVGNode from './svg/Node.vue';
import SVGElement from './svg/Element.vue';
import SVGElementTemperatureLoad from './svg/ElementTemperatureLoad.vue';
import SVGDimensioning from './svg/Dimensioning.vue';

import { formatExpValueAsHTML } from '../SVGUtils';
import { loadType, throttle } from '../utils';
import { createDimensionId, ensureDimensionId } from '@/utils/id';
import {
  Node,
  DofID,
  Beam2D,
  BeamElementLoad,
  NodalLoad,
  PrescribedDisplacement,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
} from 'ts-fem';
import { Matrix } from 'mathjs';
import { useMagicKeys } from '@vueuse/core';
import { OnLongPress } from '@vueuse/components';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import ContextMenuElement from './ContextMenuElement.vue';
import ContextMenuNode from './ContextMenuNode.vue';
import ContextMenuElementLoad from './ContextMenuElementLoad.vue';
import ContextMenuNodalLoad from './ContextMenuNodalLoad.vue';
import ContextMenuDimension from './ContextMenuDimension.vue';

import { MouseMode } from '@/mouse';
import { formatMeasureAsHTML } from '../SVGUtils';

import Selection from './Selection.vue';

import { useLayoutStore } from '@/store/layout';
import { Command, IKeyValue, undoRedoManager } from '../CommandManager';
import { EventType, eventBus } from '../EventBus';
import { BeamConcentratedLoad } from 'ts-fem';
import { useClipboardStore } from '../store/clipboard';
import type { DimensionLine } from '@/types/dimension';

const props = defineProps<{
  id: string;
}>();

const { mobile } = useDisplay();

let mouseStartX = 0;
let mouseStartY = 0;
const mouseXReal = ref(0);
const mouseYReal = ref(0);

const startNode = ref<{ label: string | number; x: number; y: number } | null>(null);
const deltaPaste = ref<{ x: number; y: number } | null>({ x: 0, y: 0 });
const dimlineDist = ref(48); // preview offset

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

provide('viewer_uuid', props.id);

const previewDimensionDistance = computed(() => {
  const currentScale = scale.value || 1;
  const pxOffset = dimlineDist.value;
  return pxOffset / currentScale;
});

const previewDimensionNodes = computed<Node[] | null>(() => {
  if (appStore.mouseMode !== MouseMode.ADD_DIMLINE || !startNode.value) return null;
  const start = projectStore.solver.domain.nodes.get(String(startNode.value.label));
  if (!start) return null;

  const previewEnd = {
    coords: [mouseXReal.value, 0, mouseYReal.value],
  } as unknown as Node;

  return [start, previewEnd];
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

const hideTooltip = (clearHoverState = true) => {
  const tt = tooltip.value as HTMLElement | undefined;
  if (!tt) return;

  tt.style.display = 'none';
  document.body.style.cursor = 'auto';

  if (!clearHoverState) return;

  if ([MouseMode.HOVER, MouseMode.SELECTING, MouseMode.ADD_ELEMENT].includes(appStore.mouseMode)) {
    if (appStore.mouseMode === MouseMode.HOVER) appStore.mouseMode = MouseMode.NONE;

    intersected.value.type = null;
    intersected.value.index = null;
  }
};

const zoom = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.code === 'Equal') {
    panZoom.value?.zoom(svg.value.clientWidth / 2, svg.value.clientHeight / 2, -0.1);
    e.preventDefault();
  }

  if (e.ctrlKey && e.code === 'Minus') {
    panZoom.value?.zoom(svg.value.clientWidth / 2, svg.value.clientHeight / 2, 0.1);
    e.preventDefault();
  }
};

const resetAndFit = () => {
  if (!panZoom.value) return;
  panZoom.value.reset();

  nextTick(() => {
    panZoom.value.fitContent();
  });
};

onMounted(() => {
  window.addEventListener('keydown', zoom);
  eventBus.on(EventType.FIT_CONTENT, resetAndFit);
});

onUnmounted(() => {
  window.removeEventListener('keydown', zoom);
  eventBus.off(EventType.FIT_CONTENT, resetAndFit);
});

onMounted(() => {
  window.setTimeout(() => {
    //fitContent();
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
  panZoom.value.fitContent();
};

const onUpdate = throttle((zooming: boolean) => {
  if (zooming) hideTooltip();
  if (grid.value) grid.value.refreshGrid(zooming);
}, 1000 / 10);

const toggleGridVisibility = () => {
  viewerStore.showGrid = !viewerStore.showGrid;
  nextTick(() => grid.value?.refreshGrid(true));
};

const toggleSnapToGrid = () => {
  viewerStore.snapToGrid = !viewerStore.snapToGrid;
  nextTick(() => grid.value?.refreshGrid(true));
};

const isShortcutBlocked = () => {
  const activeElement = document.activeElement as HTMLElement | null;
  if (!activeElement) return false;
  if (activeElement === document.body) return false;

  return activeElement.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName);
};

const { current, escape, f, c, g, s, _delete } = useMagicKeys({
  aliasMap: {
    _delete: 'delete',
  },
});

const { ctrl_a, ctrl_c, ctrl_v } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (isShortcutBlocked()) return;
    if (e.ctrlKey && e.key === 'a' && e.type === 'keydown') e.preventDefault();
  },
});

watch(f, (v) => {
  if (isShortcutBlocked()) return;
  if (v) fitContent();
});

watch(c, (v) => {
  if (isShortcutBlocked()) return;
  if (v && !current.has('control')) centerContent();
});

watch(g, (v) => {
  if (!v || isShortcutBlocked()) return;
  toggleGridVisibility();
});

watch(s, (v) => {
  if (!v || isShortcutBlocked()) return;
  toggleSnapToGrid();
});

watch(_delete, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    projectStore.deleteSelection2();
    solve();
  }
});

watch(ctrl_a, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    projectStore.selectAll2();
  }
});

watch(ctrl_c, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    useClipboardStore().select(projectStore.selection2);
  }
});

watch(ctrl_v, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    paste();
  }
});

watch(escape, (v) => {
  if (v) {
    cancelDimensionDrag();
    if ('activeElement' in document) (document.activeElement as HTMLElement).blur();
    appStore.mouseMode = MouseMode.NONE;
    projectStore.clearSelection();
    projectStore.clearSelection2();
    startNode.value = null;

    //viewerStore.settingsOpen = false;
  }
});

const refreshTooltipContent = () => {
  const tt = tooltip.value as HTMLElement | undefined;
  if (!tt || tt.style.display === 'none') return;

  if (intersected.value.type === 'node' && intersected.value.index !== null) {
    const node = projectStore.solver.domain.nodes.get(String(intersected.value.index));
    if (!node) return;

    const tooltipContent = tt.querySelector('.content') as HTMLElement | null;
    if (!tooltipContent) return;

    tooltipContent.innerHTML = buildNodeTooltipContent(node as Node);
  }
};

watch(
  () => projectStore.solver.loadCases[0].solved,
  (solved) => {
    if (solved) refreshTooltipContent();
  }
);

const paste = () => {
  const midpoint = useClipboardStore().midpoint();
  deltaPaste.value = {
    x: mouseXReal.value - midpoint[0],
    y: mouseYReal.value - midpoint[2],
  };

  startNode.value = { label: 'null', x: mouseXReal.value, y: mouseYReal.value };
  appStore.mouseMode = MouseMode.PASTE_CLIPBOARD;
};

const onElementHover = (e: MouseEvent, el: Beam2D) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector('.content') as HTMLElement;

  intersected.value.type = 'element';
  intersected.value.index = el.label;

  tt.style.top = e.offsetY + 'px';
  tt.style.left = e.offsetX + 'px';
  tooltipContent.innerHTML = `<strong>${t('common.element')} ${el.label}</strong>`;
  tt.style.display = 'block';
  document.body.style.cursor = 'pointer';

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onElementLoadHover = (e: MouseEvent, el: BeamElementLoad) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector('.content') as HTMLElement;

  //intersected.value.type = "element";
  //intersected.value.index = el.label;

  tt.style.top = e.offsetY + 'px';
  tt.style.left = e.offsetX + 'px';

  let lt = 'loadType.udl';
  const isDistributed = el instanceof BeamElementUniformEdgeLoad || el instanceof BeamElementTrapezoidalEdgeLoad;
  if (el instanceof BeamElementTrapezoidalEdgeLoad) lt = 'loadType.trapezoidal';
  else if (el instanceof BeamConcentratedLoad) lt = 'loadType.concentrated';
  else if (el instanceof BeamTemperatureLoad) lt = 'loadType.temperature';
  const ff = isDistributed ? 'f' : 'F';
  const uu = isDistributed ? `${appStore.units.Force}/${appStore.units.Length}` : `${appStore.units.Force}`;

  tooltipContent.innerHTML = `<strong>${t(lt)}</strong><br>`;

  if (el instanceof BeamTemperatureLoad) {
    if (Math.abs(el.values[0]) > 1e-32) {
      tooltipContent.innerHTML += `${t('loads.temperatureDeltaTs')} = ${appStore.convertTemperature(el.values[0])} ${uu}<br>`;
    }

    if (Math.abs(el.values[1]) > 1e-32) {
      tooltipContent.innerHTML += `${t('loads.temperatureDeltaTbt')} = ${appStore.convertTemperature(el.values[1])} ${uu}`;
    }
  } else if (el instanceof BeamElementTrapezoidalEdgeLoad) {
    if (Math.abs(el.startValues[0]) > 1e-32 || Math.abs(el.endValues[0]) > 1e-32) {
      tooltipContent.innerHTML += `${ff}<sub>x</sub> = ${appStore.convertForce(el.startValues[0])} → ${appStore.convertForce(
        el.endValues[0]
      )} ${uu}<br>`;
    }

    if (Math.abs(el.startValues[1]) > 1e-32 || Math.abs(el.endValues[1]) > 1e-32) {
      tooltipContent.innerHTML += `${ff}<sub>z</sub> = ${appStore.convertForce(el.startValues[1])} → ${appStore.convertForce(
        el.endValues[1]
      )} ${uu}`;
    }
  } else if (el instanceof BeamElementUniformEdgeLoad || el instanceof BeamConcentratedLoad) {
    if (Math.abs(el.values[0]) > 1e-32) {
      tooltipContent.innerHTML += `${ff}<sub>x</sub> = ${appStore.convertForce(el.values[0])} ${uu}<br>`;
    }

    if (Math.abs(el.values[1]) > 1e-32) {
      tooltipContent.innerHTML += `${ff}<sub>z</sub> = ${appStore.convertForce(el.values[1])} ${uu}`;
    }
  }

  tt.style.display = 'block';
  document.body.style.cursor = 'pointer';

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onNodalLoadHover = (e: MouseEvent, el: NodalLoad) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector('.content') as HTMLElement;

  //intersected.value.type = "element";
  //intersected.value.index = el.label;

  tt.style.top = e.offsetY + 'px';
  tt.style.left = e.offsetX + 'px';
  tooltipContent.innerHTML = `<strong>${t('loads.nodalLoad')}</strong><br>`;
  if (Math.abs(el.values[0]) > 1e-32) {
    tooltipContent.innerHTML += `F<sub>x</sub> = ${appStore.convertForce(el.values[0])} ${appStore.units.Force}<br>`;
  }

  if (Math.abs(el.values[2]) > 1e-32) {
    tooltipContent.innerHTML += `F<sub>z</sub> = ${appStore.convertForce(el.values[2])} ${appStore.units.Force}<br>`;
  }

  if (Math.abs(el.values[4]) > 1e-32) {
    tooltipContent.innerHTML += `M<sub>y</sub> = ${appStore.convertForce(el.values[4])} ${appStore.units.Force}${appStore.units.Length}`;
  }

  tt.style.display = 'block';
  document.body.style.cursor = 'pointer';

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onPrescribedBCHover = (e: MouseEvent, el: PrescribedDisplacement) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector('.content') as HTMLElement;

  //intersected.value.type = "element";
  //intersected.value.index = el.label;

  tt.style.top = e.offsetY + 'px';
  tt.style.left = e.offsetX + 'px';
  tooltipContent.innerHTML = `<strong>${t('loads.prescribedDisplacement')}</strong><br>`;
  if (Math.abs(el.prescribedValues[0]) > 1e-32) {
    tooltipContent.innerHTML += `D<sub>x</sub> = ${appStore.convertLength(el.prescribedValues[0])} ${appStore.units.Length}<br>`;
  }

  if (Math.abs(el.prescribedValues[2]) > 1e-32) {
    tooltipContent.innerHTML += `D<sub>z</sub> = ${appStore.convertLength(el.prescribedValues[2])} ${appStore.units.Length}<br>`;
  }

  if (Math.abs(el.prescribedValues[4]) > 1e-32) {
    tooltipContent.innerHTML += `R<sub>y</sub> = ${el.prescribedValues[4]} ${appStore.units.Angle}`;
  }

  tt.style.display = 'block';
  document.body.style.cursor = 'pointer';

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const buildNodeTooltipContent = (node: Node) => {
  let content = `<strong>${t('common.node')} ${node.label}</strong>`;

  if (
    projectStore.solver.loadCases[0].solved &&
    projectStore.beams.some((element) => element.nodes.includes(node.label))
  ) {
    content += '<br>';
    content += `u<sub>x</sub> = ${formatExpValueAsHTML(
      // @ts-expect-error It return value for single Dof
      node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dx]),
      4
    )} m`;
    content += '<br>';
    content += `u<sub>z</sub> = ${formatExpValueAsHTML(
      // @ts-expect-error It return value for single Dof
      node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dz]),
      4
    )} m`;
    content += '<br>';
    content += `φ<sub>y</sub> = ${formatExpValueAsHTML(
      // @ts-expect-error It return value for single Dof
      node.getUnknowns(projectStore.solver.loadCases[0], [DofID.Ry]),
      4
    )} rad`;
  }

  return content;
};

const onNodeHover = (e: MouseEvent, node: Node) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector('.content') as HTMLElement;

  intersected.value.type = 'node';
  intersected.value.index = node.label;

  tt.style.top = e.offsetY + 'px';
  tt.style.left = e.offsetX + 'px';
  tooltipContent.innerHTML = buildNodeTooltipContent(node);
  tt.style.display = 'block';
  document.body.style.cursor = 'pointer';

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const hasMoved = (e: MouseEvent | PointerEvent) => {
  const dx = e.offsetX - mouseStartX;
  const dy = e.offsetY - mouseStartY;
  const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  if (d > 10) return true;

  return false;
};

const onNodeLongPress = (e, node: Node) => {
  e.stopImmediatePropagation();
  e.preventDefault();

  intersected.value.index = node.label;
  intersected.value.type = 'node';

  hideTooltip(false);
  appStore.mouseMode = MouseMode.MOVING;

  const canVibrate = window.navigator.vibrate;
  if (canVibrate) window.navigator.vibrate(300);
};

const TTWIDTH = 210;
const onNodeClick = (e: MouseEvent) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 'tab-nodes';

  const target = e.target as HTMLElement;
  const index = target.getAttribute('data-node-id') || '-1';

  useProjectStore().selection.type = 'node';
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

  appStore.bottomBarTab = 'tab-elements';

  const target = e.target as HTMLElement;
  const index = target.getAttribute('data-element-id') || '-1';

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = 'element';
  useProjectStore().selection.label = index;
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;

  projectStore.clearSelection2();
  projectStore.selection2.elements = [useProjectStore().selection.label];
};

const onDimensionClick = (e: PointerEvent, dimensionId: string) => {
  if (hasMoved(e)) return;

  projectStore.clearSelection();
  projectStore.clearSelection2();
  projectStore.selection2.dimensions = [dimensionId];

  const targetElement = e.currentTarget instanceof Element ? e.currentTarget : null;
  const bounds = targetElement?.getBoundingClientRect();

  let nx = e.clientX - TTWIDTH / 2;
  let ny = e.clientY - 64;

  if (bounds) {
    nx = bounds.left + bounds.width / 2 - TTWIDTH / 2;
    ny = bounds.top + bounds.height / 2 - 64;
  }

  if (nx < 24) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  projectStore.selection.type = 'dimension';
  projectStore.selection.label = dimensionId;
  projectStore.selection.x = nx;
  projectStore.selection.y = ny;
};

const onDimensionPointerDown = (e: PointerEvent, dimensionId: string) => {
  const dimension = findDimensionById(dimensionId);
  if (dimension) convertDistanceToWorld(dimension);

  pendingDimensionId = dimensionId;
  pointerDownOriginatesFromDimension = true;
  intersected.value.type = 'dimension';
  intersected.value.index = dimensionId;
  appStore.mouseMode = MouseMode.MOVING;
};

const onDimensionPointerUp = (e: PointerEvent, dimensionId: string) => {
  if (isDraggingDimension()) return;

  pendingDimensionId = null;
  onDimensionClick(e, dimensionId);
};

const onElementLoadClick = (e: MouseEvent, index: number) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 'tab-loads';

  const target = e.target as HTMLElement;

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = 'element-load';
  useProjectStore().selection.label = index;
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;

  projectStore.clearSelection2();
  projectStore.selection2.elementLoads = [index];
};

const onNodalLoadClick = (e: MouseEvent, index: number) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 'tab-loads';

  const target = e.target as HTMLElement;

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = 'nodal-load';
  useProjectStore().selection.label = index;
  useProjectStore().selection.x = nx;
  useProjectStore().selection.y = target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 - 64;

  projectStore.clearSelection2();
  projectStore.selection2.nodalLoads = [index];
};

const onPrescribedBCClick = (e: MouseEvent, index: number) => {
  if (hasMoved(e)) return;

  appStore.bottomBarTab = 'tab-loads';

  const target = e.target as HTMLElement;

  let nx = target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 - TTWIDTH / 2;

  if (nx < 0) nx = 24;
  if (nx > window.innerWidth - TTWIDTH - 24) nx = window.innerWidth - TTWIDTH - 24;

  useProjectStore().selection.type = 'prescribedbc-load';
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
let dragDimension: { id: string; dimension: DimensionEntry; startDistance: number; lastDistance: number } | null = null;
let pendingDimensionId: string | null = null;
let pointerDownOriginatesFromDimension = false;

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

const isDraggingDimension = () => dragDimension !== null;

const updateDimensionDistanceFromPointer = () => {
  if (!dragDimension) return;
  const nodes = dragDimension.dimension.nodes;
  if (!nodes[0] || !nodes[1]) return;

  convertDistanceToWorld(dragDimension.dimension);

  const dx = nodes[1].coords[0] - nodes[0].coords[0];
  const dz = nodes[1].coords[2] - nodes[0].coords[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  if (!isFinite(length) || length === 0) return;

  const normalX = dz / length;
  const normalY = -dx / length;
  const offset = (mouseXReal.value - nodes[0].coords[0]) * normalX + (mouseYReal.value - nodes[0].coords[2]) * normalY;
  const newDistance = -offset;

  if (!Number.isFinite(newDistance)) return;

  dragDimension.dimension.distance = newDistance;
  dragDimension.dimension.distanceUnit = 'world';
  dragDimension.lastDistance = newDistance;
};

const startDimensionDrag = (dimensionId: string) => {
  const dimension = findDimensionById(dimensionId);
  if (!dimension) {
    pendingDimensionId = null;
    return false;
  }

  ensureDimensionSelected(dimensionId);
  convertDistanceToWorld(dimension);
  dimension.distanceUnit = 'world';

  dragDimension = {
    id: dimensionId,
    dimension,
    startDistance: dimension.distance ?? 0,
    lastDistance: dimension.distance ?? 0,
  };
  pendingDimensionId = null;
  appStore.mouseMode = MouseMode.MOVING;
  intersected.value.type = 'dimension';
  intersected.value.index = dimensionId;
  return true;
};

const finishDimensionDrag = (shouldCommit = true) => {
  if (!dragDimension) return;

  const { dimension, startDistance, lastDistance } = dragDimension;
  if (shouldCommit && Math.abs(lastDistance - startDistance) > 1e-6) {
    const setCommand = new Command<IKeyValue>(
      (value) => {
        value.item.distance = value.next as number;
        value.item.distanceUnit = 'world';
      },
      (value) => {
        value.item.distance = value.prev as number;
        value.item.distanceUnit = 'world';
      },
      { item: dimension, prev: startDistance, next: lastDistance }
    );

    undoRedoManager.executeCommand(setCommand);
  } else if (!shouldCommit) {
    dimension.distance = startDistance;
    dimension.distanceUnit = 'world';
  }

  dragDimension = null;
  appStore.mouseMode = MouseMode.NONE;
  pendingDimensionId = null;
};

const cancelDimensionDrag = () => {
  if (!dragDimension) {
    pendingDimensionId = null;
    return;
  }

  finishDimensionDrag(false);
};

const mouseMove = (e: PointerEvent) => {
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

  const snappedX = Math.round(mXReal / realStep) * realStep;
  const snappedY = Math.round(mYReal / realStep) * realStep;

  mouseXReal.value = viewerStore.snapToGrid ? snappedX : mXReal;
  mouseYReal.value = viewerStore.snapToGrid ? snappedY : mYReal;

  if (pendingDimensionId && !isDraggingDimension() && hasMoved(e)) {
    if (startDimensionDrag(pendingDimensionId)) {
      updateDimensionDistanceFromPointer();
    }
  }

  if (isDraggingDimension()) {
    updateDimensionDistanceFromPointer();
  }

  if (appStore.mouseMode === MouseMode.MOVING && intersected.value.type === 'node') {
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
    solve();
  }
};

const onMouseDown = (e: PointerEvent) => {
  //if (this.svgPanZoom == null) return;
  const skipClearingSelection = pointerDownOriginatesFromDimension;
  pointerDownOriginatesFromDimension = false;

  if (!skipClearingSelection) {
    projectStore.clearSelection();

    if (e.button !== 2) projectStore.clearSelection2();
  }

  if ('activeElement' in document) (document.activeElement as HTMLElement).blur();

  mouseStartX = e.offsetX;
  mouseStartY = e.offsetY;

  if (e.button === 0 /* && typeof e.button !== "undefined" */) {
    //this.svgPanZoom.disablePan();
    //mouseStartX = e.offsetX;
    //mouseStartY = e.offsetY;

    if (appStore.mouseMode === MouseMode.PASTE_CLIPBOARD) {
      appStore.mouseMode = MouseMode.NONE;
      useClipboardStore().paste({
        x: mouseXReal.value - startNode.value.x + deltaPaste.value.x,
        z: mouseYReal.value - startNode.value.y + deltaPaste.value.y,
      });
      startNode.value = null;
      return;
    }

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
            title: t('confirmation.splitElementAndPlaceNode.title'),
            message: t('confirmation.splitElementAndPlaceNode.message', { label: el.label }),
            actions: [
              {
                label: t('confirmation.splitElementAndPlaceNode.split'),
                color: 'green darken-1',
                action: () => {
                  projectStore.solver.loadCases[0].solved = false;

                  // Create the new node
                  projectStore.solver.domain.createNode(newNodeId, [mouseXReal.value, 0, mouseYReal.value]);

                  const prevHinges = el.hinges;

                  const startNode = projectStore.solver.domain.nodes.get(el.nodes[0])!;
                  const endNode = projectStore.solver.domain.nodes.get(el.nodes[1])!;
                  const newNode = projectStore.solver.domain.nodes.get(newNodeId)!;
                  const totalLength = Math.hypot(
                    endNode.coords[0] - startNode.coords[0],
                    endNode.coords[2] - startNode.coords[2]
                  );
                  const partialLength = Math.hypot(
                    newNode.coords[0] - startNode.coords[0],
                    newNode.coords[2] - startNode.coords[2]
                  );
                  const splitRatio = totalLength > 0 ? Math.min(Math.max(partialLength / totalLength, 0), 1) : 0.5;

                  // Add two new elements
                  projectStore.solver.domain.createBeam2D(el.label + 'a', [el.nodes[0], newNodeId], el.mat, el.cs, [
                    prevHinges[0],
                    false,
                  ]);

                  projectStore.solver.domain.createBeam2D(el.label + 'b', [newNodeId, el.nodes[1]], el.mat, el.cs, [
                    false,
                    prevHinges[1],
                  ]);

                  // Move old load to new elements
                  for (const loadCase of projectStore.solver.loadCases) {
                    loadCase.solved = false;
                    for (let i = loadCase.elementLoadList.length - 1; i >= 0; i--) {
                      const load = loadCase.elementLoadList[i];
                      if (load.target !== el.label) continue;

                      if (load instanceof BeamElementUniformEdgeLoad) {
                        load.target = el.label + 'a';
                        loadCase.createBeamElementUniformEdgeLoad(el.label + 'b', [...load.values], load.lcs);
                      } else if (load instanceof BeamElementTrapezoidalEdgeLoad) {
                        const midValues: [number, number] = [
                          load.startValues[0] + (load.endValues[0] - load.startValues[0]) * splitRatio,
                          load.startValues[1] + (load.endValues[1] - load.startValues[1]) * splitRatio,
                        ];
                        const startValues: [number, number] = [...load.startValues] as [number, number];
                        const endValues: [number, number] = [...load.endValues] as [number, number];
                        load.change(el.label + 'a', startValues, midValues, load.lcs);
                        loadCase.createBeamElementTrapezoidalEdgeLoad(el.label + 'b', midValues, endValues, load.lcs);
                      } else {
                        load.target = el.label + 'a';
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
                label: t('confirmation.placeIndividualNode'),
                color: 'blue darken-1',
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
                label: t('dialogs.common.cancel'),
                color: 'red darken-1',
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
        const n = projectStore.solver.domain.nodes.get(intersected.value.index as string);

        // No node selected, but want to add element
        // So we add a node for the user
        if (!n) {
          let newNodeId = projectStore.solver.domain.nodes.size + 1;

          while (projectStore.solver.domain.nodes.has(newNodeId.toString())) {
            newNodeId++;
          }

          projectStore.solver.domain.createNode(newNodeId, [mouseXReal.value, 0, mouseYReal.value]);
          startNode.value = { label: newNodeId, x: mouseXReal.value, y: mouseYReal.value };

          return;
        }

        startNode.value = { label: intersected.value.index, x: n.coords[0], y: n.coords[2] };
      } else if (intersected.value.type === 'node') {
        projectStore.solver.loadCases[0].solved = false;
        let newElId = projectStore.solver.domain.elements.size + 1;

        while (projectStore.solver.domain.elements.has(newElId.toString())) {
          newElId++;
        }

        const nid = startNode.value.label;
        const mat = [...useProjectStore().solver.domain.materials.values()][0].label;
        const cs = [...useProjectStore().solver.domain.crossSections.values()][0].label;
        projectStore.solver.domain.createBeam2D(newElId, [nid, intersected.value.index], mat, cs);

        const n = projectStore.solver.domain.nodes.get(intersected.value.index as string)!;
        startNode.value = { label: intersected.value.index, x: n.coords[0], y: n.coords[2] };
        solve();
      } else {
        projectStore.solver.loadCases[0].solved = false;

        // No end node selected, just add new
        let newNodeId = projectStore.solver.domain.nodes.size + 1;

        while (projectStore.solver.domain.nodes.has(newNodeId.toString())) {
          newNodeId++;
        }

        projectStore.solver.domain.createNode(newNodeId, [mouseXReal.value, 0, mouseYReal.value]);

        let newElId = projectStore.solver.domain.elements.size + 1;

        while (projectStore.solver.domain.elements.has(newElId.toString())) {
          newElId++;
        }

        const nid = startNode.value.label;
        const mat = [...useProjectStore().solver.domain.materials.values()][0].label;
        const cs = [...useProjectStore().solver.domain.crossSections.values()][0].label;
        projectStore.solver.domain.createBeam2D(newElId, [nid, newNodeId], mat, cs);

        startNode.value = { label: newNodeId, x: mouseXReal.value, y: mouseYReal.value };

        solve();
      }

      return;
    }

    if (appStore.mouseMode === MouseMode.ADD_DIMLINE) {
      mouseStartX = -9999;
      if (startNode.value === null && intersected.value.type === 'node') {
        const n = projectStore.solver.domain.nodes.get(intersected.value.index as string);
        startNode.value = { label: intersected.value.index, x: n.coords[0], y: n.coords[2] };
      } else if (intersected.value.type === 'node') {
        const n1 = projectStore.solver.domain.nodes.get(startNode.value.label)!;
        const n2 = projectStore.solver.domain.nodes.get(intersected.value.index as string)!;

        if (n1.label === n2.label) {
          startNode.value = null;
          appStore.mouseMode = MouseMode.NONE;
          return;
        }

        projectStore.dimensions.push({
          id: createDimensionId(),
          distance: dimlineDist.value / (scale.value || 1),
          distanceUnit: 'world',
          nodes: [n1, n2],
        });

        startNode.value = null;
        appStore.mouseMode = MouseMode.NONE;
      } else {
        // No effect when no node selected as end
      }

      return;
    }

    if (appStore.mouseMode === MouseMode.HOVER) {
      if (intersected.value.type === 'node') hideTooltip(false);
      appStore.mouseMode = MouseMode.MOVING;
    } else if (e.pointerType === 'mouse' && appStore.mouseMode !== MouseMode.MOVING) {
      appStore.mouseMode = MouseMode.SELECTING;
      appStore.mouse.sx = e.clientX;
      appStore.mouse.sy = e.clientY;
    }
  } else {
    appStore.mouseMode = MouseMode.NONE;
    startNode.value = null;
    //svgPanZoom.enablePan();
  }
};

interface Point {
  x: number;
  y: number;
}

type DimensionEntry = DimensionLine;

const getDimensionId = (dim: { id?: string }) => {
  return ensureDimensionId(dim);
};

const convertDistanceToWorld = (dim: DimensionEntry) => {
  if (dim.distanceUnit === 'world') return;

  const currentScale = scale.value || 1;
  const baseline = dim.distance ?? dimlineDist.value;
  const worldDistance = baseline / (currentScale === 0 ? 1 : currentScale);

  dim.distance = worldDistance;
  dim.distanceUnit = 'world';
};

const normalizedDimensions = computed(() => {
  projectStore.dimensions.forEach((dim) => convertDistanceToWorld(dim as DimensionEntry));
  return projectStore.dimensions as DimensionEntry[];
});

const getDimensionSegment = (dim: DimensionEntry): { start: Point; end: Point } | null => {
  if (!dim.nodes[0] || !dim.nodes[1]) return null;

  convertDistanceToWorld(dim);

  const dx = dim.nodes[1].coords[0] - dim.nodes[0].coords[0];
  const dz = dim.nodes[1].coords[2] - dim.nodes[0].coords[2];
  const length = Math.sqrt(dx * dx + dz * dz);

  if (!isFinite(length) || length === 0) return null;

  const normalX = dz / length;
  const normalY = -dx / length;
  const offset = -(dim.distance ?? 0);

  const dnx = offset * normalX;
  const dny = offset * normalY;

  return {
    start: { x: dim.nodes[0].coords[0] + dnx, y: dim.nodes[0].coords[2] + dny },
    end: { x: dim.nodes[1].coords[0] + dnx, y: dim.nodes[1].coords[2] + dny },
  };
};

const findDimensionById = (dimensionId: string): DimensionEntry | undefined => {
  return projectStore.dimensions.find((dim) => getDimensionId(dim) === dimensionId);
};

const ensureDimensionSelected = (dimensionId: string) => {
  if (!projectStore.selection2.dimensions.includes(dimensionId)) {
    projectStore.clearSelection2();
    projectStore.selection2.dimensions = [dimensionId];
  }
};

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

const onMouseUp = (e: PointerEvent) => {
  if (appStore.mouseMode === MouseMode.ADD_NODE) return;
  if (appStore.mouseMode === MouseMode.ADD_ELEMENT) return;
  if (appStore.mouseMode === MouseMode.ADD_DIMLINE) return;

  if (appStore.mouseMode === MouseMode.MOVING) {
    if (intersected.value.type === 'node') {
      moveNode();
    } else if (intersected.value.type === 'dimension') {
      finishDimensionDrag();
    }
  }

  if (!isDraggingDimension()) {
    pendingDimensionId = null;
  }

  if (appStore.mouseMode === MouseMode.SELECTING) {
    const selectedNodes = [];
    const selectedElements = [];
    const selectedNodalLoads = [];
    const selectedElementLoads = [];
    const selectedPrescribedBC = [];
    const selectedDimensions = [];

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

        // Also select corresponding nodal load
        for (let i = 0; i < useProjectStore().solver.loadCases[0].nodalLoadList.length; i++) {
          const nl = useProjectStore().solver.loadCases[0].nodalLoadList[i];
          if (nl.target === label) {
            selectedNodalLoads.push(i);
          }
        }

        // Also select corresponding prescribed BC
        for (let i = 0; i < useProjectStore().solver.loadCases[0].prescribedBC.length; i++) {
          const nl = useProjectStore().solver.loadCases[0].prescribedBC[i];
          if (nl.target === label) {
            selectedPrescribedBC.push(i);
          }
        }
      }
    }

    for (const dim of normalizedDimensions.value) {
      const segment = getDimensionSegment(dim);
      if (!segment) continue;

      if (isIntersecting(segment.start, segment.end, { x: rx1, y: ry1 }, { x: rx2, y: ry2 })) {
        selectedDimensions.push(getDimensionId(dim));
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

        // Select corresponding element loads
        for (let i = 0; i < useProjectStore().solver.loadCases[0].elementLoadList.length; i++) {
          const el = useProjectStore().solver.loadCases[0].elementLoadList[i];
          if (el.target === label) {
            selectedElementLoads.push(i);
          }
        }
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
    projectStore.selection2.nodalLoads = selectedNodalLoads;
    projectStore.selection2.elementLoads = selectedElementLoads;
    projectStore.selection2.prescribedBC = selectedPrescribedBC;
    projectStore.selection2.dimensions = selectedDimensions;
  }

  appStore.mouseMode = MouseMode.NONE;

  intersected.value.type = null;
  intersected.value.index = null;
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

const isZooming = computed(() => {
  return panZoom.value?.zooming;
});

const isPanning = computed(() => {
  return panZoom.value?.panning;
});

const dynamicMarker = (label: string) => {
  return `url(#${props.id}-${label})`;
};

// Computed dynamic markers
const markerForce = computed(() => dynamicMarker('force'));
const markerForceHover = computed(() => dynamicMarker('force_hover'));
const markerForceSelected = computed(() => dynamicMarker('force_selected'));
const markerCentered = computed(() => dynamicMarker('force_centered'));
const markerCenteredHover = computed(() => dynamicMarker('force_centered_hover'));

const markerMomentCw = computed(() => dynamicMarker('moment_cw'));
const markerMomentCwHover = computed(() => dynamicMarker('moment_cw_hover'));
const markerMomentCwSelected = computed(() => dynamicMarker('moment_cw_selected'));

const markerMomentCcw = computed(() => dynamicMarker('moment_ccw'));
const markerMomentCcwHover = computed(() => dynamicMarker('moment_ccw_hover'));
const markerMomentCcwSelected = computed(() => dynamicMarker('moment_ccw_selected'));

const markerReaction = computed(() => dynamicMarker('reaction'));
const markerMomentReactionCcw = computed(() => dynamicMarker('moment_reaction_ccw'));
const markerMomentReactionCw = computed(() => dynamicMarker('moment_reaction_cw'));
const markerDot = computed(() => dynamicMarker('dot'));
const markerHingeXY = computed(() => dynamicMarker('hinge-xy'));
const markerHingeX = computed(() => dynamicMarker('hinge-x'));
const markerHingeY = computed(() => dynamicMarker('hinge-y'));
const markerForceTip = computed(() => dynamicMarker('forceTip'));
const markerDimTip = computed(() => dynamicMarker('dimTip'));

const markerTextLabel = computed(() => dynamicMarker('textLabel'));

defineExpose({ centerContent, fitContent });
</script>

<template>
  <div class="d-flex flex-column fill-height svg-viewer">
    <div
      v-if="!appStore.inViewerMode"
      class="text-body-2 d-flex ga-1 line-height-1"
      style="position: absolute; z-index: 100; bottom: 16px; right: 16px"
    >
      <div v-if="!mobile" class="d-flex align-center ga-1">
        <v-chip density="compact" class="d-flex pa-0 overflow-hidden">
          <!-- Grid toggle -->
          <v-tooltip text="Toggle grid (G)" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                size="24"
                density="compact"
                variant="text"
                rounded="0"
                :class="viewerStore.showGrid ? 'text-black' : 'text-grey'"
                @click="toggleGridVisibility"
              >
                <div>G</div>
              </v-btn>
            </template>
          </v-tooltip>
          <!-- Snap to grid -->
          <v-tooltip text="Toggle snap to grid (S)" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                size="24"
                density="compact"
                variant="text"
                rounded="0"
                :class="viewerStore.snapToGrid ? 'text-black' : 'text-grey'"
                @click="toggleSnapToGrid"
              >
                <div>S</div>
              </v-btn>
            </template>
          </v-tooltip>
        </v-chip>
      </div>
      <v-chip-group>
        <v-chip class="justify-end" density="compact" @click="appStore.openSettings()">
          <div class="d-flex ga-1">
            <span v-html="formatMeasureAsHTML(appStore.units.Length)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Area)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Force)"></span>
            <span v-html="formatMeasureAsHTML(appStore.units.Moment)"></span>
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
    <div v-if="!appStore.inViewerMode" id="undoRedo" style="position: absolute; top: 24px; left: 24px; z-index: 100">
      <v-btn
        icon="mdi:mdi-undo"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        title="Undo"
        @click.native="undoRedoManager.undo()"
      ></v-btn>
      <v-btn
        icon="mdi:mdi-redo"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        title="Redo"
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
          <span class="label">{{ $t('nodes.addNode') }}</span>
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
          <span class="label">{{ $t('elements.addElement') }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">Hold Ctrl to add using mouse</span>
        </template>
      </context-menu-item>
      <context-menu-item @click="appStore.mouseMode = MouseMode.ADD_DIMLINE">
        <template #icon>
          <v-icon size="x-small">mdi-arrow-expand-horizontal</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t('dimensioning.add_dimension') }}</span>
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
        :disabled="!projectStore.isAnythingSelected2()"
        @click="useClipboardStore().select(projectStore.selection2)"
      >
        <template #icon>
          <v-icon size="x-small">mdi-content-copy</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t('common.copy') }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">Ctrl + C</span>
        </template>
      </context-menu-item>
      <context-menu-item :disabled="!useClipboardStore().isAnythingInClipboard()" @click="paste()">
        <template #icon>
          <v-icon size="x-small">mdi-content-copy</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t('common.paste') }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">Ctrl + V</span>
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

    <div ref="tooltip" class="tooltip body-2 black--text" style="display: none">
      <div class="content"></div>
    </div>

    <div class="text-body-2 warning ga-1 d-flex flex-column pr-6">
      <div style="width: fit-content">
        <v-alert v-if="projectStore.materials.length === 0" icon="$warning" density="compact" type="error">
          <template #text>
            <div class="d-flex align-center">
              {{ $t('warnings.noMaterialsDefined') }}
              <v-btn variant="text" density="compact" size="small" @click="appStore.dialogs['addMaterial'] = true">{{
                $t('common.addNew')
              }}</v-btn>
            </div>
          </template>
        </v-alert>
      </div>
      <div style="width: fit-content">
        <v-alert v-if="projectStore.crossSections.length === 0" icon="$warning" density="compact" type="error">
          <template #text>
            <div class="d-flex align-center">
              {{ $t('warnings.noCrossSectionsDefined') }}
              <v-btn
                variant="text"
                density="compact"
                size="small"
                @click="appStore.dialogs['addCrossSection'] = true"
                >{{ $t('common.addNew') }}</v-btn
              >
            </div>
          </template>
        </v-alert>
      </div>
    </div>

    <svg v-if="viewerStore.showGrid" class="w-100 fill-height" style="position: absolute">
      <SvgGrid
        ref="grid"
        :svg="svg as SVGSVGElement"
        :viewport="viewport as SVGGElement"
        :zoom="scale"
        :view-mode="appStore.inViewerMode"
      />
    </svg>

    <SvgPanZoom
      ref="panZoom"
      :on-update="onUpdate"
      :padding="128"
      :mobile-padding="32"
      :touch="appStore.mouseMode !== MouseMode.MOVING"
      :can-fit-content="projectStore.solver.domain.nodes.size >= 2"
      style="overflow: visible; z-index: 50; min-height: 0"
    >
      <svg
        ref="svg"
        :style="{
          '--marker-force': markerForce,
          '--marker-force-hover': markerForceHover,
          '--marker-force-selected': markerForceSelected,
          '--marker-centered': markerCentered,
          '--marker-centered-hover': markerCenteredHover,
          '--marker-moment-cw': markerMomentCw,
          '--marker-moment-cw-hover': markerMomentCwHover,
          '--marker-moment-cw-selected': markerMomentCwSelected,
          '--marker-moment-ccw': markerMomentCcw,
          '--marker-moment-ccw-hover': markerMomentCcwHover,
          '--marker-moment-ccw-selected': markerMomentCcwSelected,
          '--marker-reaction': markerReaction,
          '--marker-moment-reaction-ccw': markerMomentReactionCcw,
          '--marker-moment-reaction-cw': markerMomentReactionCw,
          '--marker-dot': markerDot,
          '--marker-hinge-xy': markerHingeXY,
          '--marker-hinge-x': markerHingeX,
          '--marker-hinge-y': markerHingeY,
          '--marker-force-tip': markerForceTip,
          '--marker-dim-tip': markerDimTip,
          '--filter-text-label': markerTextLabel,
        }"
        @click.right.prevent="openCtxMenu($event)"
        @pointermove="mouseMove"
        @pointerdown="onMouseDown"
        @pointerup="onMouseUp"
      >
        <SvgViewerDefs
          :id="props.id"
          :colors="viewerStore.colors"
          :support-size="viewerStore.supportSize"
          :scale="scale"
        />
        <g ref="viewport" :class="{ disablePointerEvents: isZooming || isPanning }">
          <g
            v-if="
              appStore.mouseMode === MouseMode.ADD_NODE ||
              appStore.mouseMode === MouseMode.ADD_ELEMENT ||
              appStore.mouseMode === MouseMode.ADD_DIMLINE
            "
          >
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
          <g v-if="appStore.mouseMode === MouseMode.PASTE_CLIPBOARD">
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
            <g v-if="!isZooming && useViewerStore().showLoads">
              <template v-for="(eload, index) in useProjectStore().solver.loadCases[0].elementLoadList">
                <SVGElementLoad
                  v-if="eload instanceof BeamElementUniformEdgeLoad || eload instanceof BeamElementTrapezoidalEdgeLoad"
                  :key="`element-udl-${index}`"
                  :class="{ selected: projectStore.selection2.elementLoads.includes(index) }"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="appStore.convertForce"
                  :font-size="viewerStore.fontSize"
                  :number-format="appStore.numberFormatter"
                  @mousemove="onElementLoadHover($event, eload)"
                  @mouseleave="hideTooltip"
                  @pointerup="onElementLoadClick($event, index)"
                  @dblclick="
                    openModal(EditElementLoadDialog, { index });
                    projectStore.clearSelection();
                  "
                />
                <SVGElementTemperatureLoad
                  v-else-if="loadType(eload) === 'temperature'"
                  :key="`element-temperature-${index}`"
                  :class="{ selected: projectStore.selection2.elementLoads.includes(index) }"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="appStore.convertForce"
                  :font-size="viewerStore.fontSize"
                  :number-format="appStore.numberFormatter"
                  @mousemove="onElementLoadHover($event, eload)"
                  @mouseleave="hideTooltip"
                  @pointerup="onElementLoadClick($event, index)"
                  @dblclick="
                    openModal(EditElementLoadDialog, { index });
                    projectStore.clearSelection();
                  "
                />
                <SVGElementConcentratedLoad
                  v-else-if="eload instanceof BeamConcentratedLoad"
                  :key="`element-cl-${index}`"
                  :class="{ selected: projectStore.selection2.elementLoads.includes(index) }"
                  :data-element-load-id="index"
                  :eload="eload"
                  :scale="scale"
                  :convert-force="appStore.convertForce"
                  :font-size="viewerStore.fontSize"
                  :number-format="appStore.numberFormatter"
                  @mousemove="onElementLoadHover($event, eload)"
                  @mouseleave="hideTooltip"
                  @pointerup="onElementLoadClick($event, index)"
                  @dblclick="
                    openModal(EditElementLoadDialog, { index });
                    projectStore.clearSelection();
                  "
                />
              </template>
              <SVGNodalLoad
                v-for="(nload, index) in useProjectStore().solver.loadCases[0].nodalLoadList"
                :key="`nodal-load-${index}`"
                :class="{ selected: projectStore.selection2.nodalLoads.includes(index) }"
                :nload="nload"
                :scale="scale"
                :convert-force="appStore.convertForce"
                :convert-moment="appStore.convertMoment"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
                @mousemove="onNodalLoadHover($event, nload)"
                @mouseleave="hideTooltip"
                @pointerup="onNodalLoadClick($event, index)"
                @dblclick="
                  openModal(EditNodalLoadDialog, { index });
                  projectStore.clearSelection();
                "
              />
              <SVGPrescribedDisplacement
                v-for="(nload, index) in useProjectStore().solver.loadCases[0].prescribedBC"
                :key="`nodal-load-${index}`"
                :class="{ selected: projectStore.selection2.nodalLoads.includes(index) }"
                :nload="nload"
                :scale="scale"
                :convert-length="appStore.convertLength"
                :multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
                @mousemove="onPrescribedBCHover($event, nload)"
                @mouseleave="hideTooltip"
                @pointerup="onPrescribedBCClick($event, index)"
                @dblclick="
                  openModal(EditNodalLoadDialog, { index, type: 'displacement' });
                  projectStore.clearSelection();
                "
              />
            </g>
          </g>
          <g>
            <SVGElement
              v-for="(element, index) in projectStore.beams"
              :key="`element-${index}`"
              :class="{ selected: projectStore.selection2.elements.includes(element.label) }"
              :element="element"
              :scale="scale"
              :show-deformed-shape="!isZooming && viewerStore.showDeformedShape"
              :show-normal-force="!isZooming && viewerStore.showNormalForce"
              :show-shear-force="!isZooming && viewerStore.showShearForce"
              :show-bending-moment="!isZooming && viewerStore.showBendingMoment"
              :show-label="!isZooming && viewerStore.showElementLabels"
              :load-case="projectStore.solver.loadCases[0]"
              :deformed-shape-multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
              :normal-force-multiplier="projectStore.normalForceScale * viewerStore.resultsScalePx_"
              :shear-force-multiplier="projectStore.shearForceScale * viewerStore.resultsScalePx_"
              :bending-moment-multiplier="projectStore.bendingMomentScale * viewerStore.resultsScalePx_"
              :convert-force="appStore.convertForce"
              :convert-moment="appStore.convertMoment"
              :font-size="viewerStore.fontSize"
              :number-format="appStore.numberFormatter"
              @elementmousemove="onElementHover($event, element)"
              @mouseleave="hideTooltip"
              @elementpointerup="onElementClick"
            />
          </g>

          <g class="nodes">
            <OnLongPress
              v-for="(node, index) in projectStore.nodes"
              :key="`node-${index}`"
              as="g"
              @trigger="onNodeLongPress($event, node)"
            >
              <SVGNode
                :class="{ selected: projectStore.selection2.nodes.includes(node.label) }"
                :node="node"
                :scale="scale"
                :show-label="!isZooming && viewerStore.showNodeLabels"
                :show-supports="viewerStore.showSupports"
                :show-deformed-shape="!isZooming && viewerStore.showDeformedShape"
                :show-reactions="!isZooming && viewerStore.showReactions"
                :convert-force="appStore.convertForce"
                :convert-moment="appStore.convertMoment"
                :load-case="projectStore.solver.loadCases[0]"
                :multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
                @nodemousemove="onNodeHover($event, node)"
                @nodedefomousemove="onNodeHover($event, node)"
                @mouseleave="hideTooltip"
                @nodepointerup="onNodeClick"
              />
            </OnLongPress>
          </g>
          <g>
            <SVGDimensioning
              v-for="(dim, index) in normalizedDimensions"
              :key="getDimensionId(dim)"
              :nodes="dim.nodes"
              :distance="dim.distance"
              :scale="scale"
              :font-size="viewerStore.fontSize"
              :number-format="appStore.numberFormatter"
              :selected="projectStore.selection2.dimensions.includes(getDimensionId(dim))"
              @dimensionpointerdown="onDimensionPointerDown($event, getDimensionId(dim))"
              @dimensionpointerup="onDimensionPointerUp($event, getDimensionId(dim))"
            />
            <SVGDimensioning
              v-if="previewDimensionNodes"
              key="add-dimline"
              :nodes="previewDimensionNodes"
              :distance="previewDimensionDistance"
              :scale="scale"
              :font-size="viewerStore.fontSize"
              :number-format="appStore.numberFormatter"
              :interactive="false"
            />
          </g>
          <!-- Paste preview -->
          <g
            v-if="appStore.mouseMode === MouseMode.PASTE_CLIPBOARD"
            :transform="`translate(${mouseXReal - startNode.x + deltaPaste.x}, ${mouseYReal - startNode.y + deltaPaste.y})`"
          >
            <g>
              <SVGElement
                v-for="(element, index) in useClipboardStore().selection.elements"
                :key="`element-${index}`"
                :element="projectStore.solver.domain.elements.get(element) as Beam2D"
                :scale="scale"
                :show-deformed-shape="false"
                :show-normal-force="false"
                :show-shear-force="false"
                :show-bending-moment="false"
                :show-label="false"
                :load-case="projectStore.solver.loadCases[0]"
                :deformed-shape-multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
                :normal-force-multiplier="projectStore.normalForceScale * viewerStore.resultsScalePx_"
                :shear-force-multiplier="projectStore.shearForceScale * viewerStore.resultsScalePx_"
                :bending-moment-multiplier="projectStore.bendingMomentScale * viewerStore.resultsScalePx_"
                :convert-force="appStore.convertForce"
                :convert-moment="appStore.convertMoment"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
              />
            </g>
            <g class="nodes">
              <SVGNode
                v-for="(node, index) in useClipboardStore().selection.nodes"
                :key="`node-${index}`"
                :node="projectStore.solver.domain.nodes.get(node) as Node"
                :scale="scale"
                :show-label="false"
                :show-supports="viewerStore.showSupports"
                :show-deformed-shape="false"
                :show-reactions="false"
                :convert-force="appStore.convertForce"
                :load-case="projectStore.solver.loadCases[0]"
                :multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
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
        Math.min(appStore.mouse.y, appStore.mouse.sy) - (useAppStore().inViewerMode ? 0 : 84)
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
          {{ $t('selection.' + projectStore.selection.type) }}
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
        <ContextMenuDimension v-if="projectStore.selection.type === 'dimension'"></ContextMenuDimension>
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
            v-model="useViewerStore().showDeformedShape"
            :label="$t('sideSettings.showDeformedShape')"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
          <v-checkbox
            v-model="useViewerStore().showNormalForce"
            label=""
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label>N (x)</template>
          </v-checkbox>
          <v-checkbox
            v-model="useViewerStore().showShearForce"
            label="Vz (x)"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label>V<sub>z</sub>&nbsp;(x)</template>
          </v-checkbox>
          <v-checkbox
            v-model="useViewerStore().showBendingMoment"
            label="My (x)"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label>M<sub>y</sub>&nbsp;(x)</template>
          </v-checkbox>
          <v-checkbox
            v-model="useViewerStore().showReactions"
            :label="$t('sideSettings.showReactions')"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
        </div>

        <div color="grey-lighten-5" rounded="lg" height="32" class="d-sm-flex bg-grey-lighten-5 elevation-1 rounded">
          <v-checkbox
            v-model="useViewerStore().showSupports"
            :label="$t('sideSettings.supports')"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
          <v-checkbox
            v-model.number="useViewerStore().showLoads"
            :label="$t('sideSettings.loads')"
            dense
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          />

          <v-checkbox
            v-model="useViewerStore().showNodeLabels"
            :label="$t('sideSettings.nodeLabels')"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
          <v-checkbox
            v-model="useViewerStore().showElementLabels"
            :label="$t('sideSettings.elementLabels')"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
          />
        </div>
      </div>
      <div class="text-right text-sm-body-2">
        <button class="text-decoration-underline bg-white" @click="appStore.openSettings()">
          {{ $t('sideSettings.more_settings') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.disablePointerEvents {
  pointer-events: none;
}

.svg-viewer :deep(*) {
  .element-load.load-1d {
    text {
      fill: v-bind('viewerStore.colors.loads');
    }

    stroke-linecap: butt;

    &:hover text {
      //fill: blue;
      font-weight: bold;
    }

    &:hover path.drawable,
    &:hover polygon.drawable {
      //stroke: blue;
      stroke-width: 3px;
    }

    &:hover polyline {
      marker-end: var(--marker-centered-hover);
    }

    polygon,
    path {
      stroke: v-bind('viewerStore.colors.loads');
      stroke-width: 1px;

      &.handle {
        stroke-width: 12px;
        stroke: transparent;
      }
    }

    polyline {
      marker-end: var(--marker-centered);
    }

    &.selected {
      text {
        fill: rgb(0, 55, 149);
      }

      polygon.drawable,
      path.drawable {
        stroke: rgb(0, 94, 255);
        stroke-width: 4px;
        stroke-linejoin: round;
        fill: rgba(0, 55, 149, 0.15);
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
      stroke: v-bind('viewerStore.colors.deformedShape');
      stroke-width: 2px;

      &.decoration {
        stroke-width: 1px;
      }
    }

    .normal polyline {
      stroke: v-bind('viewerStore.colors.normalForce');
      stroke-width: 1px;
      fill: v-bind('viewerStore.colors.normalForce');
      fill-opacity: 0.1;

      &:hover {
        fill-opacity: 0.2;
      }
    }

    .shear polyline {
      stroke: v-bind('viewerStore.colors.shearForce');
      stroke-width: 1px;
      fill: v-bind('viewerStore.colors.shearForce');
      fill-opacity: 0.1;

      &:hover {
        fill-opacity: 0.2;
      }
    }

    .moment polyline {
      stroke: v-bind('viewerStore.colors.bendingMoment');
      stroke-width: 1px;
      fill: v-bind('viewerStore.colors.bendingMoment');
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
        stroke: v-bind('viewerStore.colors.deformedShape');
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
    stroke: v-bind('viewerStore.colors.loads');
  }

  .nodal-load {
    text {
      fill: v-bind('viewerStore.colors.loads');
    }

    polyline {
      stroke-linecap: butt;
      vector-effect: non-scaling-stroke;

      &.decoration.force {
        marker-end: var(--marker-force);
      }

      &.decoration.moment.cw {
        marker-end: var(--marker-moment-cw);
      }

      &.decoration.moment.ccw {
        marker-end: var(--marker-moment-ccw);
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
      //fill: blue;
      font-weight: bold;
    }

    &:hover polyline.decoration.force {
      marker-end: var(--marker-force-hover);
    }

    &:hover polyline.decoration.moment.cw {
      marker-end: var(--marker-moment-cw-hover);
    }

    &:hover polyline.decoration.moment.ccw {
      marker-end: var(--marker-moment-ccw-hover);
    }

    &.selected polyline.decoration.force {
      marker-end: var(--marker-force-selected);
    }

    &.selected polyline.decoration.moment.cw {
      marker-end: var(--marker-moment-cw-selected);
    }

    &.selected polyline.decoration.moment.ccw {
      marker-end: var(--marker-moment-ccw-selected);
    }

    &.selected {
      text {
        fill: rgb(0, 55, 149);
      }
    }
  }

  .normal text {
    fill: v-bind('viewerStore.colors.normalForce');
  }

  .shear text {
    fill: v-bind('viewerStore.colors.shearForce');
  }

  .moment text {
    fill: v-bind('viewerStore.colors.bendingMoment');
  }

  .reaction {
    fill: v-bind('viewerStore.colors.reactions');
  }

  .marker-reaction {
    marker-start: var(--marker-reaction);
  }

  .marker-moment_reaction_ccw {
    marker-start: var(--marker-moment-reaction-ccw);
  }

  .marker-moment_reaction_cw {
    marker-start: var(--marker-moment-reaction-cw);
  }

  .marker-dot {
    marker-start: var(--marker-dot);
  }

  .marker-hinge-xy {
    marker-start: var(--marker-hinge-xy);
  }

  .marker-hinge-x {
    marker-start: var(--marker-hinge-x);
  }

  .marker-hinge-y {
    marker-start: var(--marker-hinge-y);
  }

  .marker-forceTip {
    marker-end: var(--marker-force-tip);
  }

  .marker-dimTip {
    marker-start: var(--marker-dim-tip);
    marker-end: var(--marker-dim-tip);
  }

  .filter-text-label {
    filter: var(--filter-text-label);
  }
}
</style>
