<script setup lang="ts">
import { closeModal, openModal } from 'jenesius-vue-modal';
import SvgPanZoom from './SVGPanZoom.vue';
import { axisMark } from '@/utils/nodalLcs';
import SvgGrid from './SVGGrid.vue';
import AxesHelper from './AxesHelper.vue';
import Crosshair from './Crosshair.vue';
import SvgViewerDefs from './SVGViewerDefs.vue';
import { useProjectStore } from '../store/project';
import { ref, shallowRef, onMounted, computed, nextTick, watch, reactive, onUnmounted, provide, toRaw } from 'vue';
import { useViewerStore } from '../store/viewer';
import { useAppStore } from '@/store/app';

import AddElementDialog from './dialogs/AddElement.vue';
import AddNodeDialog from './dialogs/AddNode.vue';
import AddMaterialDialog from './dialogs/AddMaterial.vue';
import AddCrossSectionDialog from './dialogs/AddCrossSection.vue';
import SolveDiagnosticsDialog from './dialogs/SolveDiagnostics.vue';
import HelpTip from './HelpTip.vue';
import Confirmation from './dialogs/Confirmation.vue';

import EditNodalLoadDialog from './dialogs/EditNodalLoad.vue';
import EditElementLoadDialog from './dialogs/EditElementLoad.vue';

import SVGElementLoad from './svg/ElementLoad.vue';
import SVGElementConcentratedLoad from './svg/ElementConcentratedLoad.vue';
import SVGNodalLoad from './svg/NodalLoad.vue';
import SVGPrescribedDisplacement from './svg/PrescribedDisplacement.vue';
import SVGNode from './svg/Node.vue';
import PlotPicture from './PlotPicture.vue';
import PlotPastePreview from './PlotPastePreview.vue';
import type { PlotHit, PlotHits } from './plotHit';
import SVGSolveIssues from './svg/SolveIssues.vue';
import SVGElement from './svg/Element.vue';
import SVGElementTemperatureLoad from './svg/ElementTemperatureLoad.vue';
import SVGDimensioning from './svg/Dimensioning.vue';
import SelectionBox from './SelectionBox.vue';
import WindowPickRect from './WindowPickRect.vue';
import { windowDragKey, windowPickBox, type WindowDrag } from '@/types/windowPick';
import HoveredElement from './HoveredElement.vue';
import { intersectedKey } from '@/types/hover';
import PlacingPreview from './PlacingPreview.vue';
import ToolPreview from './ToolPreview.vue';
import { snapKey } from '@/types/snap';
import { snapPoint, type Snap, type SnapTakes } from '@/utils/snap';
import { useDisplayValue } from '@/utils/useDisplayValue';
import SnapMark from './SnapMark.vue';
import FirstBeamTask from './FirstBeamTask.vue';
import { placingKey } from '@/types/placing';

import {
  applyNodeLcsAngle,
  checkNumber,
  executeModelMutationWithUndo,
  loadType,
  parseFloat2,
  redoModelChange,
  throttle,
  undoModelChange,
} from '../utils';
import { createDimensionId, ensureDimensionId } from '@/utils/id';
import { formatDisplacementLabel } from '@/utils/numberDisplay';
import { resultScales, withoutRoundOff } from '@/utils/exportResults';
import { selectionSubtitle } from '@/utils/selectionDetails';
import { boundsFromPoints, type Padding, type ViewBox } from '@/utils/fitBounds';
import { dimensionAnchors, editorCentred, editorFit, readEditorModel } from '@/utils/plotDrawing';
import type { Fit, ReadoutQuantity } from '@edubeam/plot';
import { useEditorDiagramScales, useEditorLayers, useEditorLook } from '@/utils/useEditorLook';
import { useTools, type Tool } from '@/utils/useTools';
import { setSupportType, supportTypes, type SupportType } from '@/utils/supports';
import {
  asToolLoads,
  moveLoad,
  movableTakes,
  putToolLoad,
  toolLoadFits,
  toolTakes,
  targetOf,
  type MovableLoad,
  type ToolLoad,
  type ToolLoadKind,
} from '@/utils/toolTarget';
import SupportIcon from './SupportIcon.vue';
import LoadIcon from './LoadIcon.vue';
import { placePopupNearAnchor, type AnchorRect } from '@/utils/popupPlacement';
import { deviceCanTouch, deviceHasHover } from '@/utils/pointer';
import { forKeyboard, hasShortcutModifier, isApplePlatform, zoomShortcut } from '@/utils/keyboard';
import { splitBeamAtNode } from '@/utils/splitBeam';
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
} from '@edubeam/fem';
import { useMagicKeys } from '@vueuse/core';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

import ContextMenuElement from './ContextMenuElement.vue';
import ContextMenuNode from './ContextMenuNode.vue';
import ContextMenuElementLoad from './ContextMenuElementLoad.vue';
import ContextMenuNodalLoad from './ContextMenuNodalLoad.vue';
import ContextMenuDimension from './ContextMenuDimension.vue';

import { MouseMode } from '@/mouse';
import { formatMeasureAsHTML } from '../SVGUtils';
import { snapToGrid, type LengthDisplay } from '@/utils/grid';

import Selection from './Selection.vue';
import SVGElementHandle from './svg/ElementHandle.vue';

import { useLayoutStore } from '@/store/layout';
import { EventType, eventBus } from '../EventBus';
import { BeamConcentratedLoad } from '@edubeam/fem';
import { useClipboardStore } from '../store/clipboard';
import {
  createDimensionPoint,
  createDimensionPointFromNode,
  createDimensionRenderableNode,
  resolveDimensionPoints,
  type DimensionLine,
  type DimensionPoint,
} from '@/types/dimension';

const props = defineProps<{
  id: string;
  resultLabelMode?: 'axis' | 'horizontal';
}>();

let mouseStartX = 0;
let mouseStartY = 0;
/** Pointers currently down on the canvas; more than one means a pinch or a two finger pan. */
const activePointers = new Set<number>();
/** A touch is down in a placing mode, and still qualifies as a tap. */
let pendingTap = false;
const mouseXReal = ref(0);
const mouseYReal = ref(0);

const startNode = ref<{
  label: string | number | null;
  x: number;
  y: number;
  sourceNodeLabel?: string | number | null;
} | null>(null);
const deltaPaste = ref<{ x: number; y: number } | null>({ x: 0, y: 0 });
const dimlineDist = ref(48); // preview offset

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();
const layoutStore = useLayoutStore();

const resolvedResultLabelMode = computed(() => props.resultLabelMode ?? viewerStore.resultLabelMode);

/**
 * Elements the drawing can place: `projectStore.beams`, which leaves out one naming a node that is
 * gone. A load on any other element, or a copy of one, has no geometry to be drawn on.
 */
const drawableBeamLabels = computed(() => new Set(projectStore.beams.map((beam) => beam.label)));
const pastePreviewBeams = computed(() => {
  const copied = new Set(useClipboardStore().elements);
  return projectStore.beams.filter((beam) => copied.has(beam.label));
});

const panZoom = ref<InstanceType<typeof SvgPanZoom> | null>(null);
const grid = ref<InstanceType<typeof SvgGrid> | null>(null);
const crosshair = ref<InstanceType<typeof Crosshair> | null>(null);

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

const getPointerDimensionPoint = (): DimensionPoint => {
  // A dimension's point: on a node, tied to it; on a member's middle or thirds, or the grid, free
  const snapped = snapNow('either');
  if (snapped.node) return createDimensionPointFromNode(snapped.node);

  return createDimensionPoint(snapped.x, snapped.y);
};

const previewDimensionPoints = computed(() => {
  if (appStore.mouseMode !== MouseMode.ADD_DIMLINE || !startNode.value) return null;

  const previewEnd = getPointerDimensionPoint();

  return [
    createDimensionRenderableNode({ x: startNode.value.x, y: startNode.value.y }, startNode.value.sourceNodeLabel),
    createDimensionRenderableNode(previewEnd, previewEnd.sourceNodeLabel),
  ];
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

// The highlight reads it; the drawing only writes it. See HoveredElement.vue.
provide(intersectedKey, intersected);

/* PROTOTYPE: what the plot drawing marks, named as plot names the things it draws */
const plotHoveredLoad = ref<string | null>(null);
const plotHovered = computed((): string | null => {
  if (plotHoveredLoad.value) return plotHoveredLoad.value;
  const { type, index } = intersected.value;
  if (index === null) return null;
  if (type === 'element') return `member:${index}`;
  if (type === 'node') return `node:${index}`;
  return null;
});
const plotSelected = computed((): string[] => [
  ...projectStore.selection2.elements.map((id) => `member:${id}`),
  ...projectStore.selection2.nodes.map((id) => `node:${id}`),
  ...projectStore.selection2.nodalLoads.map((i) => `nodalLoad:${i}`),
  ...projectStore.selection2.elementLoads.map((i) => `elementLoad:${i}`),
  ...projectStore.selection2.prescribedBC.map((i) => `prescribed:${i}`),
]);

/**
 * What the placing preview draws, handed over as the refs themselves so that the drawing writes
 * the pointer position without reading it. See PlacingPreview.vue.
 */

const pasteLayer = ref<SVGGElement | null>(null);

/**
 * The clipboard preview is carried under the pointer by its own transform rather than a bound
 * one: what it holds does not depend on the pointer, and binding it in the drawing rebuilt the
 * whole scene on every report of the gesture.
 */
watch(
  [mouseXReal, mouseYReal, startNode, deltaPaste, () => appStore.mouseMode],
  ([x, y, start, delta]) => {
    if (!pasteLayer.value || !start || !delta) return;

    pasteLayer.value.setAttribute('transform', `translate(${x - start.x + delta.x}, ${y - start.y + delta.y})`);
  },
  // After the paste layer is in the document, so entering the mode places it before it is seen.
  { flush: 'post', immediate: true }
);

const geometryLayer = ref<SVGGElement | null>(null);
const resultsLayer = ref<SVGGElement | null>(null);

/**
 * Hovering an element dims the rest of the drawing behind the highlighted copy. Set on the layers
 * rather than bound in the template: reading the hover while rendering rebuilds every node,
 * element and load each time the pointer moves onto or off something.
 */
watch(
  () => intersected.value.type === 'element',
  (dim) => {
    for (const layer of [geometryLayer.value, resultsLayer.value]) layer?.classList.toggle('dimmed', dim);
  }
);

/**
 * Writes the tooltip only when what it says has changed. A pointer reports many times per frame
 * while it rests on the same element, and rebuilding the markup on every report throws away the
 * nodes and parses them again for nothing.
 */
let shownTooltip = '';

const writeTooltip = (content: HTMLElement, html: string) => {
  if (html === shownTooltip) return;

  shownTooltip = html;
  content.innerHTML = html;
};

const hideTooltip = (clearHoverState = true) => {
  const tt = tooltip.value as HTMLElement | undefined;
  if (!tt) return;

  tt.style.display = 'none';
  document.body.style.cursor = 'auto';
  shownTooltip = '';

  if (!clearHoverState) return;

  if (
    [
      MouseMode.HOVER,
      MouseMode.SELECTING,
      MouseMode.ADD_ELEMENT,
      MouseMode.ADD_DIMLINE,
      MouseMode.ADD_SUPPORT,
      MouseMode.ADD_LOAD,
    ].includes(appStore.mouseMode)
  ) {
    if (appStore.mouseMode === MouseMode.HOVER) appStore.mouseMode = MouseMode.NONE;

    intersected.value.type = null;
    intersected.value.index = null;
  }
};

const zoom = (e: KeyboardEvent) => {
  const direction = zoomShortcut(e);
  if (direction === null) return;

  panZoom.value?.zoom(svg.value.clientWidth / 2, svg.value.clientHeight / 2, direction === 'in' ? -0.1 : 0.1);
  e.preventDefault();
};

/*
 * A fit asked for while the view cannot fit yet - the canvas not yet mounted when a link or a saved
 * model opens, or the plot drawing not yet showing the model it replaced, solved - is tried again on
 * the next frames rather than dropped.
 */
let fitRetry = 0;
const resetAndFit = () => {
  cancelAnimationFrame(fitRetry);
  const attempt = async (left: number) => {
    const ready = !plotMode.value || (plotRendererReady.value && plotDrawsCurrentModel());
    const done = ready && panZoom.value ? await fitSettled() : false;
    if (done || left <= 0) return;
    fitRetry = requestAnimationFrame(() => attempt(left - 1));
  };
  attempt(60);
};

/**
 * Whether the plot drawing shows the model as it is now: it is drawn once the model is solved, a
 * moment after an example or a file replaces it, and a fit before that would frame the old one.
 */
const plotDrawsCurrentModel = (): boolean => {
  const hits = plotHits.value;
  const nodes = projectStore.nodes;
  if (!hits || hits.nodes.length !== nodes.length) return false;
  const drawn = new Map(hits.nodes.map((n) => [n.id, n]));
  const tolerance = 1e-6 * Math.max(1, ...nodes.map((n) => Math.abs(n.coords[0]) + Math.abs(n.coords[2])));
  return nodes.every((node) => {
    const d = drawn.get(String(node.label));
    return (
      d !== undefined &&
      Math.abs(d.x / hits.scale - node.coords[0]) <= tolerance &&
      Math.abs(d.y / hits.scale - node.coords[2]) <= tolerance
    );
  });
};

/** A fit, and the grid redrawn for its zoom */
const fitSettled = async (): Promise<boolean> => {
  if (!panZoom.value) return false;
  const done = await panZoom.value.fitContent();
  if (grid.value) grid.value.refreshGrid(true);
  return done;
};

/** Answers EventType.REQUEST_VIEWER_SVG so exports can reach the element we own. */
const provideSvgForExport = (respond: (svg: SVGSVGElement | null) => void) => {
  respond((svg.value as SVGSVGElement) ?? null);
};

/**
 * A drag the drawing began, let go of outside it (over a panel, off the window): finished as a
 * release where the pointer last was over the drawing, as a drag with the pointer kept would be.
 * Left alone, the load or node stayed on the pointer and the next press anywhere dropped it.
 */
const releaseOutside = (e: PointerEvent) => {
  // The DOM's Node: the solver's is imported under that name here
  if (e.target instanceof globalThis.Node && svg.value?.contains(e.target)) return;
  if (appStore.mouseMode === MouseMode.MOVING || appStore.mouseMode === MouseMode.SELECTING || loadDrag.value) {
    onMouseUp(e);
  }
};

onMounted(() => {
  window.addEventListener('keydown', zoom);
  window.addEventListener('pointerup', releaseOutside);
  eventBus.on(EventType.FIT_CONTENT, resetAndFit);
  eventBus.on(EventType.REQUEST_VIEWER_SVG, provideSvgForExport);
});

onUnmounted(() => {
  cancelAnimationFrame(fitRetry);
  window.removeEventListener('keydown', zoom);
  window.removeEventListener('pointerup', releaseOutside);
  eventBus.off(EventType.FIT_CONTENT, resetAndFit);
  eventBus.off(EventType.REQUEST_VIEWER_SVG, provideSvgForExport);
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

/**
 * Why there are no results, if anything. A model still being drawn gets the next step in
 * neutral colours, not an error: a beam without supports is unfinished, not wrong. The first
 * beam task asks for the supports itself, so there the chip stays out of its way.
 */
const solveBanner = computed(() => {
  const { errors, incomplete } = projectStore.solveDiagnostics;

  if (errors.length > 0) {
    // A single error says what it is; a count only helps once there are several.
    const text =
      errors.length === 1
        ? (errors[0].summary ?? errors[0].message)
        : t('solveDiagnostics.summaryErrors', { errors: errors.length });

    // The exclamation mark the other viewer alerts use; `$error` is a cross that reads as "close".
    return { type: 'error' as const, icon: '$warning', text };
  }

  if (incomplete.length > 0 && !appStore.firstBeamActive) {
    // Only a chip: this is where every model passes through, so it should not shout.
    const text =
      incomplete.length === 1
        ? (incomplete[0].summary ?? incomplete[0].message)
        : t('solveDiagnostics.summaryIncomplete', { count: incomplete.length });

    return { type: 'incomplete' as const, icon: 'mdi-information-outline', text };
  }

  return null;
});

/** The errors on screen, by what they are and where, so a re-solve of the same model matches. */
const errorsKey = computed(() =>
  projectStore.solveDiagnostics.errors
    .map((issue) => `${issue.code}|${[...(issue.nodes ?? [])].sort().join(',')}`)
    .join(';')
);

/**
 * The errors whose banner was closed. Closing only folds it into a chip: an error is why there
 * are no results, so it never goes away entirely, but on a small screen the banner has to make
 * room. A different error unfolds it again; any other edit leaves it folded.
 */
const collapsedErrorsKey = ref<string | null>(null);
const errorsCollapsed = computed(() => collapsedErrorsKey.value === errorsKey.value);

/**
 * Warnings get a banner of their own. They do not stop the solve, and some are on purpose - a
 * spare node kept for later - so they can be closed, also while an error is shown.
 */
const warningBanner = computed(() => {
  const warnings = projectStore.visibleWarnings;
  if (warnings.length === 0) return null;

  return warnings.length === 1
    ? warnings[0].message
    : t('solveDiagnostics.summaryWarnings', { warnings: warnings.length });
});

/** Whether the canvas has a motion to show, and so the banner an outline to hide. */
const hasFreeMotion = computed(() => projectStore.solveDiagnostics.errors.some((issue) => issue.motion));

const motionToggleLabel = computed(() =>
  t(viewerStore.showMechanisms ? 'solveDiagnostics.hideMotion' : 'solveDiagnostics.showMotion')
);

/** While the pointer is on the message, the canvas keeps showing the motion it describes. */
const holdFreeMotion = ref(false);

/**
 * An unfinished model shows how it can move only once it is loaded. Loads usually come after
 * the supports, so loading a structure that is still not held means results are expected, and
 * the motion explains why there are none. Before that the student is simply still drawing.
 */
const modelHasLoads = computed(() => {
  const loadCase = projectStore.solver.loadCases[0];

  return loadCase.nodalLoadList.length + loadCase.elementLoadList.length + loadCase.prescribedBC.length > 0;
});

const openSolveDiagnostics = () => {
  openModal(SolveDiagnosticsDialog, { diagnostics: projectStore.solveDiagnostics });
};

const centerContent = () => {
  if (!panZoom.value) return;

  panZoom.value.centerContent();

  if (grid.value) grid.value.refreshGrid(true);
};

const fitContent = async () => {
  await fitSettled();
};

/** Distributed load arrows are drawn 60 px long (see ElementLoad/UDL.vue). */
const LOAD_DECORATION_PX = 60;

/* PROTOTYPE: the drawing by @edubeam/plot (PlotPicture). Until it has a picture, the editor draws. */
const plotPictureReady = ref(false);
/** The plot drawing is showing the values at the pointer: the member's tooltip gives way */
const plotReading = ref(false);
/** The plot drawing's loads, hit-tested where it draws them (see the plot-hits layer) */
const plotHits = shallowRef<PlotHits | null>(null);
/** The plot drawing is on: the editor's own drawing is not mounted at all */
const plotMode = computed(() => viewerStore.renderer === 'plot');
const plotElementLoadHits = computed(
  () => plotHits.value?.loads.filter((h) => h.entity.startsWith('elementLoad:')) ?? []
);
const plotNodalLoadHits = computed(
  () => plotHits.value?.loads.filter((h) => !h.entity.startsWith('elementLoad:')) ?? []
);
const plotLabelHits = (test: (entity: string) => boolean) =>
  computed(() => plotHits.value?.labels.filter((l) => test(l.entity)) ?? []);
const plotElementLoadLabelHits = plotLabelHits((e) => e.startsWith('elementLoad:'));
const plotNodalLoadLabelHits = plotLabelHits((e) => e.startsWith('nodalLoad:') || e.startsWith('prescribed:'));
const plotMemberLabelHits = plotLabelHits((e) => e.startsWith('member:'));
/**
 * A load's hit stroke, px: wide along its arrows, to be easy to point at; none round an area, which
 * is hit inside and would otherwise reach into the band stacked on it. Fingers get more of both.
 */
const hitStroke = (h: PlotHit) => (h.area ? (coarsePointer ? 16 : 0) : coarsePointer ? 32 : h.width);
/** Fingers are blunter than cursors: wider hit strokes, as the editor's own */
const coarsePointer = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
const plotRendererReady = computed(() => viewerStore.renderer === 'plot' && plotPictureReady.value);

/*
 * The fit's padding, screen px. With the plot drawing's tight reserve, it also clears what floats
 * over the canvas, which the editor's own wide reserve used to clear by itself: the rulers along
 * the edges, the undo and view buttons in the top corners, the axes and the grid and unit chips
 * in the bottom ones.
 */
const PLOT_FIT_PADDING = { top: 56, right: 40, bottom: 56, left: 40 } as const;
const fitPadding = computed(() => (plotMode.value ? PLOT_FIT_PADDING : 16));
/**
 * A straight beam has no height: fitted exactly it would run edge to edge. Both drawings fit it as
 * if it were at least half as tall as it is wide, as a structure of ordinary proportions sits.
 */
const FIT_MIN_ASPECT = 0.5;
const fitMobilePadding = computed(() => (plotMode.value ? PLOT_FIT_PADDING : 12));

/**
 * Space kept around the structure for everything that can be switched on: result
 * diagrams, reactions and loads plus one line of labels. Reserving it whether or
 * not they are shown keeps the fitted view identical across display settings.
 * (The plot drawing is fitted by `plotFitView` instead.)
 */
const fitReserve = computed(() => Math.max(viewerStore.resultsScalePx_, LOAD_DECORATION_PX) + viewerStore.fontSize + 8);

const editorLook = useEditorLook();
const editorLayers = useEditorLayers();
const editorDiagramScales = useEditorDiagramScales();

/**
 * The plot drawing's fit, worked out rather than measured: plot knows how far everything it draws
 * reaches at any zoom, labels included. Read at the moment of the fit, from the model as it is.
 */
const plotDimensionAnchors = (fontSize: number) =>
  dimensionAnchors(
    normalizedDimensions.value.flatMap((dim) => {
      const points = getDimensionRenderableNodes(dim);
      return points ? [{ points, distance: dim.distance }] : [];
    }),
    fontSize
  );

/** A fit's transform, px, as the view box of a canvas this size */
const viewOf = (fit: Pick<Fit, 's' | 'tx' | 'ty'>, width: number, height: number): ViewBox => ({
  x: -fit.tx / fit.s,
  y: -fit.ty / fit.s,
  w: width / fit.s,
  h: height / fit.s,
});

const plotFitView = (width: number, height: number, padding: Padding): ViewBox | null => {
  try {
    const model = readEditorModel(projectStore.solver);
    if (model.nodes.length === 0) return null;
    const look = editorLook.value;
    const fit = editorFit(
      model,
      look,
      editorLayers.value,
      { width: width - padding.left - padding.right, height: height - padding.top - padding.bottom, padding: 0 },
      { extra: plotDimensionAnchors(look.fontSize), diagramScale: editorDiagramScales.value, minAspect: FIT_MIN_ASPECT }
    );
    return viewOf({ s: fit.s, tx: fit.tx + padding.left, ty: fit.ty + padding.top }, width, height);
  } catch (error) {
    console.warn('[plot renderer] cannot fit the model', error);
    return null;
  }
};

/** The plot drawing centred at the zoom it has, on the same as its fit (C, as F does) */
const plotCenterView = (width: number, height: number, scale: number): ViewBox | null => {
  try {
    const model = readEditorModel(projectStore.solver);
    if (model.nodes.length === 0 || !(scale > 0)) return null;
    const look = editorLook.value;
    const fit = editorCentred(
      model,
      look,
      editorLayers.value,
      scale,
      { width, height },
      { extra: plotDimensionAnchors(look.fontSize), diagramScale: editorDiagramScales.value }
    );
    return viewOf(fit, width, height);
  } catch (error) {
    console.warn('[plot renderer] cannot centre the model', error);
    return null;
  }
};

const modelBounds = () => boundsFromPoints(projectStore.nodes.map((node) => [node.coords[0], node.coords[2]] as const));

/**
 * Screen to model, held for the frame it was measured in.
 *
 * Reading the matrix flushes the layout of the whole drawing, and a pointer reports many times
 * per frame - moving over an element was paying for that on every report. Nothing can move the
 * view within a frame, so the matrix is measured once and dropped at the end of it.
 */
let pointerMatrix: DOMMatrix | null = null;

const invalidatePointerMatrix = () => {
  pointerMatrix = null;
};

const screenToModelMatrix = (): DOMMatrix => {
  if (!pointerMatrix) {
    pointerMatrix = (viewport.value!.getScreenCTM() as DOMMatrix).inverse();
    requestAnimationFrame(invalidatePointerMatrix);
  }

  return pointerMatrix;
};

const onUpdate = throttle((zooming: boolean) => {
  invalidatePointerMatrix();
  if (zooming) hideTooltip();
  if (grid.value) grid.value.refreshGrid(zooming);

  // The view moved under a resting mouse, so the model point beneath it changed without a report.
  if (lastPointerType === 'mouse') updatePointerPosition({ clientX: appStore.mouse.x, clientY: appStore.mouse.y });
  crosshair.value?.refresh();
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

const {
  current,
  escape,
  f,
  c,
  g,
  s,
  n: nKey,
  e: eKey,
  d: dKey,
  v: vKey,
  u: uKey,
  l: lKey,
  alt: altKey,
  _delete,
} = useMagicKeys({
  aliasMap: {
    _delete: 'delete',
  },
});

const { ctrl_a, ctrl_c, ctrl_v, meta_a, meta_c, meta_v } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (isShortcutBlocked()) return;
    if (hasShortcutModifier(e) && e.key === 'a' && e.type === 'keydown') e.preventDefault();
  },
});

// Cmd on a Mac does what Ctrl does elsewhere.
const APPLE_KEYBOARD = isApplePlatform();
const selectAllKeys = computed(() => ctrl_a.value || meta_a.value);
const copyKeys = computed(() => ctrl_c.value || meta_c.value);
const pasteKeys = computed(() => ctrl_v.value || meta_v.value);

/** F, C, G and S are shortcuts on their own; held with a modifier they belong to the browser or to save. */
const withModifier = () => current.has('control') || current.has('meta') || current.has('alt');

watch(f, (v) => {
  if (!v || isShortcutBlocked() || withModifier()) return;
  fitContent();
});

watch(c, (v) => {
  if (!v || isShortcutBlocked() || withModifier()) return;
  centerContent();
});

watch(g, (v) => {
  if (!v || isShortcutBlocked() || withModifier()) return;
  toggleGridVisibility();
});

watch(s, (v) => {
  if (!v || isShortcutBlocked() || withModifier()) return;
  toggleSnapToGrid();
});

/* ── The tools (see the tool rail) ─────────────────────────────────────────────────────────── */
const TOOLS = [
  { id: 'select', icon: 'mdi:mdi-cursor-default-outline', label: 'viewer.select', key: 'V' },
  { id: 'node', icon: 'mdi:mdi-vector-point-plus', label: 'nodes.addNode', key: 'N' },
  { id: 'element', icon: 'mdi:mdi-vector-polyline-plus', label: 'elements.addElement', key: 'E' },
  { id: 'support', icon: 'mdi:mdi-triangle-outline', label: 'sideSettings.supports', key: 'U' },
  { id: 'load', icon: 'mdi:mdi-arrow-down-thin', label: 'sideSettings.loads', key: 'L' },
  { id: 'dimension', icon: 'mdi:mdi-arrow-expand-horizontal', label: 'dimensioning.add_dimension', key: 'D' },
] as const satisfies readonly { id: Tool; icon: string; label: string; key: string }[];

const { active: activeTool, choose: chooseTool } = useTools();

/** A tool taken up starts afresh: no element or dimension half drawn from the last one */
const pickTool = (tool: Tool) => {
  endPointerWork();
  startNode.value = null;
  // Box select is put down with any tool taken up: back to Select, one finger pans again
  boxSelecting.value = false;
  chooseTool(tool);
};

/*
 * Box select, beside the pointer where a finger can reach the screen: a one finger drag draws a
 * selection box, the way a mouse drag does natively, until it is pressed again or the pointer
 * chosen. Two fingers still pan and zoom. A button of its own, not hidden in a flyout: on a touch
 * screen it is the only way to select more than one thing.
 */
const boxSelecting = ref(false);
const toggleBoxSelect = () => {
  const on = !touchSelectArmed.value;
  endPointerWork();
  startNode.value = null;
  if (activeTool.value !== 'select') chooseTool('select');
  boxSelecting.value = on;
};

/** The rail's buttons: the tools, and Box select after the pointer where a finger can reach */
type RailButton = { readonly id: Tool | 'box'; readonly icon: string; readonly label: string; readonly key?: string };
const BOX_SELECT: RailButton = { id: 'box', icon: 'mdi:mdi-select-drag', label: 'viewer.boxSelect' };
const railButtons = computed((): readonly RailButton[] =>
  deviceCanTouch.value ? [TOOLS[0], BOX_SELECT, ...TOOLS.slice(1)] : TOOLS
);
const railPressed = (id: Tool | 'box') =>
  id === 'box'
    ? touchSelectArmed.value
    : id === 'select'
      ? activeTool.value === 'select' && !touchSelectArmed.value
      : activeTool.value === id;
const onRailClick = (e: MouseEvent, id: Tool | 'box') => (id === 'box' ? toggleBoxSelect() : onToolClick(e, id));

// Single keys, as the other drawing shortcuts: not while typing, not with Ctrl or Cmd, and only
// while the drawing is the tab on show
const toolKey = (tool: Tool) => (pressed: boolean) => {
  if (!pressed || isShortcutBlocked() || withModifier() || appStore.inViewerMode) return;
  if (appStore.openedTab?.props.id !== 'viewer') return;
  pickTool(tool);
};
watch(vKey, toolKey('select'));
watch(nKey, toolKey('node'));
watch(eKey, toolKey('element'));
watch(dKey, toolKey('dimension'));
watch(uKey, toolKey('support'));
watch(lKey, toolKey('load'));

/* ── What the support and load tools put on what is clicked ───────────────────────────────── */
/** The support the support tool gives a node; Free takes one away */
const toolSupport = ref<SupportType>('pin');
const SUPPORT_TYPES = Object.keys(supportTypes) as SupportType[];
/** The load tool's kinds: on a node a force or a moment, on a member also a distributed load */
const TOOL_LOAD_KINDS = [
  { id: 'force', label: 'settings.units.force' },
  { id: 'moment', label: 'loads.moment' },
  { id: 'udl', label: 'loadType.udl' },
  { id: 'trapezoidal', label: 'loadType.trapezoidal' },
  { id: 'temperature', label: 'loadType.temperature' },
] as const satisfies readonly { id: ToolLoadKind; label: string }[];
const toolLoadKind = ref<ToolLoadKind>('force');
const loadKindLabel = (kind: ToolLoadKind) => t(TOOL_LOAD_KINDS.find((k) => k.id === kind)!.label);

/*
 * A tool with kinds of its own (a support, a load) has them in a flyout, as in drawing programs: a
 * small triangle in its corner says so, and a long press, a right click, a click on the triangle or
 * a click on the tool already in use opens it. A plain mouse click takes the tool up with the kind
 * last chosen, which its button shows. A tap of a finger or a pen always opens it: there is no right
 * button, the triangle is too small for a finger and a long press is not seen, and choosing the
 * kind is one tap more only when the tool is taken up - it then stays for every node or member.
 */
type FlyoutTool = 'support' | 'load';
const hasFlyout = (tool: Tool | 'box'): tool is FlyoutTool => tool === 'support' || tool === 'load';
const flyout = ref<FlyoutTool | null>(null);
/** How long a press takes to open the flyout, ms; and the corner whose click opens it, px */
const FLYOUT_PRESS_MS = 350;
const FLYOUT_CORNER_PX = 14;
let flyoutTimer: number | null = null;
let flyoutOpenedByPress = false;
/** What pressed the rail's button last: a click alone does not tell a tap from a mouse click everywhere */
let railPressType = '';

const cancelFlyoutPress = () => {
  if (flyoutTimer !== null) window.clearTimeout(flyoutTimer);
  flyoutTimer = null;
};
const startFlyoutPress = (e: PointerEvent, tool: Tool | 'box') => {
  cancelFlyoutPress();
  flyoutOpenedByPress = false;
  railPressType = e.pointerType;
  if (!hasFlyout(tool) || e.button !== 0) return;
  flyoutTimer = window.setTimeout(() => {
    flyoutTimer = null;
    flyoutOpenedByPress = true;
    flyout.value = tool;
  }, FLYOUT_PRESS_MS);
};
const onToolClick = (e: MouseEvent, tool: Tool) => {
  cancelFlyoutPress();
  // The press that opened the flyout ends in a click, which must not take the tool up or down
  if (flyoutOpenedByPress) {
    flyoutOpenedByPress = false;
    return;
  }
  if (hasFlyout(tool)) {
    const box = e.currentTarget instanceof HTMLElement ? e.currentTarget.getBoundingClientRect() : null;
    const onCorner =
      box !== null &&
      e.detail > 0 &&
      e.clientX > box.right - FLYOUT_CORNER_PX &&
      e.clientY > box.bottom - FLYOUT_CORNER_PX;
    const tapped = e.detail > 0 && (railPressType === 'touch' || railPressType === 'pen');
    if (onCorner || tapped || activeTool.value === tool) {
      flyout.value = tool;
      return;
    }
  }
  pickTool(tool);
};
const openFlyout = (tool: Tool | 'box') => {
  cancelFlyoutPress();
  if (hasFlyout(tool)) flyout.value = tool;
};
const closeFlyout = (open: boolean) => {
  if (!open) flyout.value = null;
};
/** A kind chosen in a flyout is taken up at once, with its tool */
const pickSupport = (type: SupportType) => {
  toolSupport.value = type;
  flyout.value = null;
  if (activeTool.value !== 'support') pickTool('support');
};
const pickLoadKind = (kind: ToolLoadKind) => {
  toolLoadKind.value = kind;
  flyout.value = null;
  if (activeTool.value !== 'load') pickTool('load');
};
// Typed as the load dialogs take them: the units on show, vertical components with the display's
// sign, and kept as the loads they mean when the units or axes change (see useDisplayValue). They
// start at a round 10 in whatever units are on show, forces pointing down; a linearly varying load
// from nothing to 10.
const toolFx = useDisplayValue('Force', false, 0);
const toolFz = useDisplayValue('Force', true, 10);
const toolMy = useDisplayValue('Moment', false, 10);
const toolQx = useDisplayValue('ForceDistance', false, 0);
const toolQz = useDisplayValue('ForceDistance', true, 10);
/** A force or distributed load on a member in its own axes, as the element load dialog has it by default */
const toolLcs = ref(true);
const toolQ1x = useDisplayValue('ForceDistance', false, 0);
const toolQ1z = useDisplayValue('ForceDistance', true, 0);
const toolQ2x = useDisplayValue('ForceDistance', false, 0);
const toolQ2z = useDisplayValue('ForceDistance', true, 10);
// A warming of 10 degrees, typed as the element load dialog takes it
const toolTc = ref('10');
const toolTbt = ref('0');

/** The tool whose addition is previewed under the pointer (see ToolPreview) */
const previewTool = computed((): 'support' | 'load' | null =>
  activeTool.value === 'support' || activeTool.value === 'load' ? activeTool.value : null
);

/* ── Snapping: one engine for every tool (see snapPoint) ────────────────────────────────────── */
/** Where the pointer is in model units, never snapped: what decides the node or member it is on */
const pointerExact = reactive({ x: 0, y: 0 });

/** How near a node or a member the pointer has to be to snap to it, px; a fingertip is blunter */
const SNAP_REACH_PX = { mouse: 12, touch: 24 } as const;

/** Where the pointer snaps now, for a tool that puts down what it `takes` */
/**
 * Where the pointer snaps now, for a tool that puts down what it `takes`. A member's middle and
 * thirds always pull, as a drawing program's object snaps do, apart from the grid's snap (S);
 * Alt held places freely: on no mark and no grid point, only still on the node or member it is on.
 */
const snapNow = (takes: SnapTakes): Snap => {
  const free = altKey.value;
  return snapPoint({
    nodes: projectStore.solver.domain.nodes,
    beams: projectStore.beams,
    exact: pointerExact,
    grid: free ? { x: pointerExact.x, y: pointerExact.y } : { x: mouseXReal.value, y: mouseYReal.value },
    reach: SNAP_REACH_PX[coarsePointer || lastPointerType === 'touch' ? 'touch' : 'mouse'] / (scale.value || 1),
    takes,
    snapping: !free,
  });
};

/** What the active tool puts down, and so snaps to; null while none puts a point down */
const snapTakes = computed((): SnapTakes | null => {
  switch (appStore.mouseMode) {
    case MouseMode.ADD_NODE:
    case MouseMode.ADD_ELEMENT:
    case MouseMode.ADD_DIMLINE:
      return 'either';
    case MouseMode.ADD_SUPPORT:
      return 'node';
    case MouseMode.ADD_LOAD:
      return toolTakes('load', toolLoad.value);
    case MouseMode.MOVING: {
      // A dimension's point dragged snaps as a new one does (see getPointerDimensionPoint)
      if (intersected.value.type === 'dimension-point') return 'either';
      const d = loadDrag.value;
      const load = d?.started || d?.lifted ? draggedLoadOf(d) : undefined;
      return load ? movableTakes(load) : null;
    }
    default:
      return null;
  }
});

/** Where the point the active tool puts down goes: what its preview, its snap mark and its click use */
const snap = computed((): Snap | null => (snapTakes.value === null ? null : snapNow(snapTakes.value)));
provide(snapKey, snap);

/** The modes whose placing preview stands where the point snaps: a node's, an element's end, a dimension's */
const placingNodes = computed(
  () =>
    appStore.mouseMode === MouseMode.ADD_NODE ||
    appStore.mouseMode === MouseMode.ADD_ELEMENT ||
    appStore.mouseMode === MouseMode.ADD_DIMLINE
);

provide(placingKey, {
  x: computed(() => (placingNodes.value && snap.value ? snap.value.x : mouseXReal.value)),
  y: computed(() => (placingNodes.value && snap.value ? snap.value.y : mouseYReal.value)),
  startNode,
  snappedToNode: computed(() =>
    placingNodes.value ? snap.value?.node !== undefined : intersected.value.type === 'node'
  ),
});

/** Puts the support tool's support or the load tool's load on what the click lands on, as one undo step */
const applyToolAt = () => {
  const target = snap.value && targetOf(snap.value);
  if (!target) return;

  if (appStore.mouseMode === MouseMode.ADD_SUPPORT) {
    if ('node' in target) setSupportType(target.node, toolSupport.value);
    return;
  }

  const load = toolLoad.value;
  if (!toolLoadFits(target, load)) return;
  executeModelMutationWithUndo(() => {
    const lc = projectStore.solver.loadCases[0];
    lc.solved = false;
    putToolLoad(lc, target, load);
  });
};

/** The load tool's load from what the banner has typed, SI and z down */
const toolLoad = computed((): ToolLoad => {
  const force = (typed: string) => appStore.convertInverseForce(parseFloat2(typed));
  const intensity = (typed: string) => appStore.convertInverseForceDistance(parseFloat2(typed));
  if (toolLoadKind.value === 'force')
    return {
      kind: 'force',
      fx: force(toolFx.value),
      fz: appStore.vertical(force(toolFz.value)),
      local: toolLcs.value,
    };
  if (toolLoadKind.value === 'udl') {
    return {
      kind: 'udl',
      qx: intensity(toolQx.value),
      qz: appStore.vertical(intensity(toolQz.value)),
      local: toolLcs.value,
    };
  }
  if (toolLoadKind.value === 'trapezoidal') {
    // Always in the member's axes, as the element load dialog has it
    return {
      kind: 'trapezoidal',
      start: { fx: intensity(toolQ1x.value), fz: appStore.vertical(intensity(toolQ1z.value)) },
      end: { fx: intensity(toolQ2x.value), fz: appStore.vertical(intensity(toolQ2z.value)) },
      local: true,
    };
  }
  if (toolLoadKind.value === 'temperature') {
    const temperature = (typed: string) => appStore.convertInverseTemperature(parseFloat2(typed));
    return { kind: 'temperature', uniform: temperature(toolTc.value), gradient: temperature(toolTbt.value) };
  }
  return { kind: 'moment', my: appStore.convertInverseMoment(parseFloat2(toolMy.value)) };
});

watch(_delete, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    projectStore.deleteSelection2();
    solve();
  }
});

watch(selectAllKeys, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    projectStore.selectAll2();
  }
});

watch(copyKeys, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    useClipboardStore().select(projectStore.selection2);
  }
});

watch(pasteKeys, (v) => {
  if (isShortcutBlocked()) return;
  if (v) {
    paste();
  }
});

/** Leaves whatever mode the canvas is in - what Esc does, and what the mode banner button calls. */
const cancelActiveMode = () => {
  endPointerWork();
  boxSelecting.value = false;
  if ('activeElement' in document) (document.activeElement as HTMLElement).blur();
  appStore.mouseMode = MouseMode.NONE;
  projectStore.clearSelection();
  projectStore.clearSelection2();
  startNode.value = null;
};

/** Supports given to every node placed by the add node mode; kept across placements. */
const addNodeBcs = ref<DofID[]>([]);
/** Local system angle given to every node placed by the add node mode, in degrees. */
const addNodeAngle = ref('0');

/** Places a node at the pointer with whatever the add node banner currently has set. */
const placeNode = (label: number | string, x: number, z: number) => {
  const node = projectStore.solver.domain.createNode(label, [x, 0, z], [...addNodeBcs.value]);

  applyNodeLcsAngle(node, appStore.angle(parseFloat2(addNodeAngle.value)));

  return node;
};

/** End hinges given to every element placed by the add element mode. */
const addElementHinges = ref<[boolean, boolean]>([false, false]);

/**
 * A mode where clicking the canvas places something. There is no cursor and no Esc key on touch,
 * so the mode has to be both visible and cancellable on screen.
 */
const activeAddMode = computed(() => {
  if (appStore.mouseMode === MouseMode.ADD_NODE) return { icon: 'mdi-vector-point-plus', label: t('nodes.addNode') };

  if (appStore.mouseMode === MouseMode.ADD_ELEMENT) {
    return { icon: 'mdi-vector-polyline-plus', label: t('elements.addElement') };
  }

  if (appStore.mouseMode === MouseMode.ADD_DIMLINE) {
    return { icon: 'mdi-arrow-expand-horizontal', label: t('dimensioning.add_dimension') };
  }

  if (appStore.mouseMode === MouseMode.ADD_SUPPORT) {
    return { icon: 'mdi-triangle-outline', label: t(`supports.${toolSupport.value}`) };
  }

  if (appStore.mouseMode === MouseMode.ADD_LOAD) {
    return { icon: 'mdi-arrow-down-thin', label: loadKindLabel(toolLoadKind.value) };
  }

  if (appStore.mouseMode === MouseMode.PASTE_CLIPBOARD) return { icon: 'mdi-content-paste', label: t('common.paste') };

  if (appStore.mouseMode === MouseMode.PICK_WINDOW) {
    return { icon: 'mdi-select-drag', label: t('exportImage.pickWindowHint') };
  }

  return null;
});

/* ---- window pick: the export dialog asks for a rectangle of the drawing ---- */

/** Where the pointer is in model units, unsnapped. */
const screenToModel = (e: PointerEvent) => {
  const point = svg.value!.createSVGPoint();

  point.x = e.clientX;
  point.y = e.clientY;

  const p = point.matrixTransform(screenToModelMatrix());

  return { x: p.x, y: p.y };
};

const windowDrag = ref<WindowDrag>(null);

// The overlay reads it; the drawing only writes it. See WindowPickRect.vue.
provide(windowDragKey, windowDrag);

const finishWindowPick = (box: { x: number; y: number; w: number; h: number } | null) => {
  windowDrag.value = null;
  appStore.mouseMode = MouseMode.NONE;
  viewerStore.finishWindowPick(box);
};

watch(escape, (v) => {
  if (v) {
    cancelActiveMode();

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

    writeTooltip(tooltipContent, renderDetails(buildNodeDetails(node as Node)));
  }
};

watch(
  () => projectStore.solver.loadCases[0].solved,
  (solved) => {
    if (solved) refreshTooltipContent();
  }
);

/**
 * How far the copy goes from where it was taken, in the length unit on show.
 *
 * Pasting by pointing needs the place to be on screen already, and on a touch screen moving the
 * view to bring it into sight ends the paste. The offset is kept between pastes, so a second bay of
 * the same frame is a matter of pressing the button again.
 */
const pasteOffsetX = ref(0);
const pasteOffsetZ = ref(0);

const pasteAtOffset = () => {
  const metres = (value: number) => (Number.isFinite(value) ? appStore.convertInverseLength(value) : 0);

  useClipboardStore().paste({ x: metres(pasteOffsetX.value), z: metres(pasteOffsetZ.value) });
  appStore.mouseMode = MouseMode.NONE;
  startNode.value = null;
};

const paste = () => {
  if (!useClipboardStore().isAnythingInClipboard()) return;

  const midpoint = useClipboardStore().midpoint();
  deltaPaste.value = {
    x: mouseXReal.value - midpoint[0],
    y: mouseYReal.value - midpoint[2],
  };

  startNode.value = { label: 'null', x: mouseXReal.value, y: mouseYReal.value };
  appStore.mouseMode = MouseMode.PASTE_CLIPBOARD;
};

/** Labels come from share links / imported files, so never interpolate them into HTML unescaped. */
const escapeHtml = (value: unknown) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * What is known about one entity: a heading naming it, and a body of rows. The hover tooltip shows
 * both; the selection panel names its selection in its own header, so it shows the body.
 */
type EntityDetails = { title: string; body: string };

const renderDetails = (details: EntityDetails) =>
  `<strong>${details.title}</strong>${details.body ? `<br>${details.body}` : ''}`;

/**
 * The pointer kind behind the current gesture. The compatibility mouse events a tap fires carry no
 * pointer type of their own, so the last one seen on the canvas answers for them.
 */
let lastPointerType = 'mouse';

/**
 * Touch and pen have no hover. Acting on the compatibility mouse events a tap fires would leave a
 * tooltip under the finger with nothing left to dismiss it, and the item hover latched, so that
 * the next drag would move it instead of panning. A tap opens the selection panel, which carries
 * the same content, instead.
 */
const isMousePointer = (e: MouseEvent | PointerEvent) =>
  ('pointerType' in e ? (e as PointerEvent).pointerType : lastPointerType) === 'mouse';

const showEntityTooltip = (e: MouseEvent, details: EntityDetails) => {
  // A tool putting a point down shows what it snaps to right there; a tooltip would cover it
  if (snapTakes.value !== null) return;
  const tt = tooltip.value as HTMLElement;
  const tooltipContent = tt.querySelector('.content') as HTMLElement;

  tt.style.top = e.offsetY + 'px';
  tt.style.left = e.offsetX + 'px';
  writeTooltip(tooltipContent, renderDetails(details));
  tt.style.display = 'block';
  document.body.style.cursor = 'pointer';
};

/** A load value as the drawing labels it, so a tooltip does not show round-off the label hides. */
const shownValue = (value: number) => appStore.numberFormatter.format(value);

/** A prescribed displacement or rotation, as its label on the drawing writes it. */
const shownDisplacement = (value: number) => formatDisplacementLabel(value, appStore.numberFormatter);

const buildElementDetails = (el: Beam2D): EntityDetails => ({
  title: `${t('common.element')} ${escapeHtml(el.label)}`,
  body: `CS=${escapeHtml(el.cs)}, Mat=${escapeHtml(el.mat)}`,
});

const buildElementLoadDetails = (el: BeamElementLoad): EntityDetails => {
  let lt = 'loadType.udl';
  const isDistributed = el instanceof BeamElementUniformEdgeLoad || el instanceof BeamElementTrapezoidalEdgeLoad;
  if (el instanceof BeamElementTrapezoidalEdgeLoad) lt = 'loadType.trapezoidal';
  else if (el instanceof BeamConcentratedLoad) lt = 'loadType.concentrated';
  else if (el instanceof BeamTemperatureLoad) lt = 'loadType.temperature';
  const ff = isDistributed ? 'f' : 'F';
  // A distributed load is an intensity, a concentrated one a force; both parts of the unit count.
  const convertIntensity = isDistributed ? appStore.convertForceDistance : appStore.convertForce;
  let uu = isDistributed ? appStore.units.ForceDistance : appStore.units.Force;
  if (el instanceof BeamTemperatureLoad) uu = formatMeasureAsHTML(appStore.units.Temperature);

  const rows: string[] = [];

  if (el instanceof BeamTemperatureLoad) {
    if (Math.abs(el.values[0]) > 1e-32) {
      rows.push(`${t('loads.temperatureDeltaTs')} = ${shownValue(appStore.convertTemperature(el.values[0]))} ${uu}`);
    }

    if (Math.abs(el.values[1]) > 1e-32) {
      rows.push(`${t('loads.temperatureDeltaTbt')} = ${shownValue(appStore.convertTemperature(el.values[1]))} ${uu}`);
    }
  } else if (el instanceof BeamElementTrapezoidalEdgeLoad) {
    if (Math.abs(el.startValues[0]) > 1e-32 || Math.abs(el.endValues[0]) > 1e-32) {
      rows.push(
        `${ff}<sub>x</sub> = ${shownValue(convertIntensity(el.startValues[0]))} → ` +
          `${shownValue(convertIntensity(el.endValues[0]))} ${uu}`
      );
    }

    if (Math.abs(el.startValues[1]) > 1e-32 || Math.abs(el.endValues[1]) > 1e-32) {
      rows.push(
        `${ff}<sub>${appStore.axes.v}</sub> = ${shownValue(appStore.vertical(convertIntensity(el.startValues[1])))} → ` +
          `${shownValue(appStore.vertical(convertIntensity(el.endValues[1])))} ${uu}`
      );
    }
  } else if (el instanceof BeamElementUniformEdgeLoad || el instanceof BeamConcentratedLoad) {
    if (Math.abs(el.values[0]) > 1e-32) {
      rows.push(`${ff}<sub>x</sub> = ${shownValue(convertIntensity(el.values[0]))} ${uu}`);
    }

    if (Math.abs(el.values[1]) > 1e-32) {
      rows.push(
        `${ff}<sub>${appStore.axes.v}</sub> = ${shownValue(appStore.vertical(convertIntensity(el.values[1])))} ${uu}`
      );
    }
  }

  return { title: t(lt), body: rows.join('<br>') };
};

const buildNodalLoadDetails = (el: NodalLoad): EntityDetails => {
  const rows: string[] = [];
  const mark = axisMark(projectStore.solver.domain.nodes.get(el.target), el.lcs);

  if (Math.abs(el.values[0]) > 1e-32) {
    rows.push(`F<sub>x${mark}</sub> = ${shownValue(appStore.convertForce(el.values[0]))} ${appStore.units.Force}`);
  }

  if (Math.abs(el.values[2]) > 1e-32) {
    rows.push(
      `F<sub>${appStore.axes.v}${mark}</sub> = ${shownValue(appStore.vertical(appStore.convertForce(el.values[2])))} ` +
        appStore.units.Force
    );
  }

  if (Math.abs(el.values[4]) > 1e-32) {
    rows.push(
      `M<sub>${appStore.axes.r}</sub> = ${shownValue(appStore.convertMoment(el.values[4]))} ${appStore.units.Moment}`
    );
  }

  return { title: t('loads.nodalLoad'), body: rows.join('<br>') };
};

const buildPrescribedBCDetails = (el: PrescribedDisplacement): EntityDetails => {
  const rows: string[] = [];
  // Along the support's own axes, which a turned support marks with a prime
  const mark = axisMark(projectStore.solver.domain.nodes.get(el.target), true);

  if (Math.abs(el.prescribedValues[0]) > 1e-32) {
    rows.push(
      `D<sub>x${mark}</sub> = ${shownDisplacement(appStore.convertDisplacement(el.prescribedValues[0]))} ` +
        appStore.units.Displacement
    );
  }

  if (Math.abs(el.prescribedValues[2]) > 1e-32) {
    rows.push(
      `D<sub>${appStore.axes.v}${mark}</sub> = ` +
        `${shownDisplacement(appStore.vertical(appStore.convertDisplacement(el.prescribedValues[2])))} ` +
        appStore.units.Displacement
    );
  }

  if (Math.abs(el.prescribedValues[4]) > 1e-32) {
    rows.push(`R<sub>${appStore.axes.r}</sub> = ${shownDisplacement(el.prescribedValues[4])} ${appStore.units.Angle}`);
  }

  return { title: t('loads.prescribedDisplacement'), body: rows.join('<br>') };
};

/** Round-off against the largest result of its kind reads as 0, as in the results table. Once per solve. */
const roundOffScales = computed(() => resultScales(projectStore.solver));

const buildNodeDetails = (node: Node): EntityDetails => {
  const rows: string[] = [];
  const loadCase = projectStore.solver.loadCases[0];

  if (loadCase.solved && projectStore.beams.some((element) => element.nodes.includes(node.label))) {
    const scales = roundOffScales.value;
    // Typed as a matrix, but a single DOF comes back as a plain number (see readUnknown).
    const unknown = (dof: DofID) =>
      withoutRoundOff(
        node.getUnknowns(loadCase, [dof]) as unknown as number,
        dof === DofID.Ry ? scales.rotation : scales.displacement
      );

    rows.push(
      `u<sub>x</sub> = ${appStore.formatResultHTML(appStore.convertDisplacement(unknown(DofID.Dx)))} ` +
        appStore.units.Displacement
    );

    rows.push(
      `u<sub>${appStore.axes.v}</sub> = ` +
        `${appStore.formatResultHTML(appStore.vertical(appStore.convertDisplacement(unknown(DofID.Dz))))} ` +
        appStore.units.Displacement
    );

    rows.push(
      `φ<sub>${appStore.axes.r}</sub> = ${appStore.formatResultHTML(unknown(DofID.Ry))} ${appStore.units.Angle}`
    );
  }

  return { title: `${t('common.node')} ${escapeHtml(node.label)}`, body: rows.join('<br>') };
};

const onElementHover = (e: MouseEvent, el: Beam2D, showTooltip = true) => {
  if (appStore.mouseMode === MouseMode.MOVING || !isMousePointer(e)) return;

  intersected.value.type = 'element';
  intersected.value.index = el.label;

  if (showTooltip) showEntityTooltip(e, buildElementDetails(el));
  else hideTooltip(false);

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onElementLoadHover = (e: MouseEvent, el: BeamElementLoad) => {
  if (appStore.mouseMode === MouseMode.MOVING || !isMousePointer(e)) return;

  showEntityTooltip(e, buildElementLoadDetails(el));

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onNodalLoadHover = (e: MouseEvent, el: NodalLoad) => {
  if (appStore.mouseMode === MouseMode.MOVING || !isMousePointer(e)) return;

  showEntityTooltip(e, buildNodalLoadDetails(el));

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onPrescribedBCHover = (e: MouseEvent, el: PrescribedDisplacement) => {
  if (appStore.mouseMode === MouseMode.MOVING || !isMousePointer(e)) return;

  showEntityTooltip(e, buildPrescribedBCDetails(el));

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

const onNodeHover = (e: MouseEvent, node: Node) => {
  if (appStore.mouseMode === MouseMode.MOVING || !isMousePointer(e)) return;

  intersected.value.type = 'node';
  intersected.value.index = node.label;

  showEntityTooltip(e, buildNodeDetails(node));

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

/**
 * A press latches the node for dragging, and for the add element mode to snap onto it. Unlike the
 * hover above it answers every pointer kind, being the only such signal a finger gives.
 */
const onNodePress = (e: PointerEvent, node: Node) => {
  if (appStore.mouseMode === MouseMode.MOVING) return;

  intersected.value.type = 'node';
  intersected.value.index = node.label;

  if (appStore.mouseMode === MouseMode.NONE) appStore.mouseMode = MouseMode.HOVER;
};

/**
 * A long press stands in for the right button: it opens the same canvas menu, which is otherwise
 * unreachable on a touch screen. It only arms where nothing else owns the gesture: not in a
 * placing mode, and not on a node or a dimension, whose press starts a drag.
 */
const LONG_PRESS_MS = 500;
let longPressTimer: number | null = null;
/** True from the moment the menu opened until the gesture's pointerup has been swallowed. */
let longPressFired = false;

const cancelLongPress = () => {
  if (longPressTimer !== null) window.clearTimeout(longPressTimer);
  longPressTimer = null;
};

/**
 * After a long press some browsers still fire a compatibility click at the touch point, which now
 * lies on the freshly opened menu and would activate or close it. Eat the first click, briefly.
 */
const swallowNextClick = () => {
  const swallow = (ev: MouseEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
  };

  window.addEventListener('click', swallow, { capture: true });
  window.setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 700);
};

/** A one finger drag draws a selection box while Box select is on (see the tool rail) */
const touchSelectArmed = computed(() => activeTool.value === 'select' && boxSelecting.value);

/** The canvas menu, at a point on screen. Shared by the long press and by a box drawn by finger. */
const openCanvasMenu = (clientX: number, clientY: number, element: Beam2D | null = null) => {
  swallowNextClick();

  ctxMenuElement.value = element;
  optionsCtxMenu.x = clientX;
  optionsCtxMenu.y = clientY;
  showCtxMenu.value = true;
};

const startLongPress = (e: PointerEvent) => {
  cancelLongPress();

  const { clientX, clientY } = e;
  const element = elementAtEvent(e);

  longPressTimer = window.setTimeout(() => {
    longPressTimer = null;
    longPressFired = true;
    // On a load, the long press lifts it; its menu waits for the finger to lift unmoved
    if (liftLoad(clientX, clientY, element)) return;
    openCanvasMenu(clientX, clientY, element);
  }, LONG_PRESS_MS);
};

/**
 * Whether a press has turned into a drag: the pointer has travelled further than a click's jitter,
 * or a finger resting on the screen, moves it. Until then a press on a node or a dimension point is
 * a click, and moves nothing. Fingers jitter more than a mouse.
 */
const dragStarted = (e: PointerEvent) => {
  const slop = e.pointerType === 'mouse' ? 4 : 10;
  return Math.hypot(e.clientX - mouseStartX, e.clientY - mouseStartY) > slop;
};

const hasMoved = (e: MouseEvent | PointerEvent) => {
  const dx = e.clientX - mouseStartX;
  const dy = e.clientY - mouseStartY;
  const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  if (d > 10) return true;

  return false;
};

const TTWIDTH = 210;
/** Kept clear of the window edges, and of the item the panel belongs to. */
const SELECTION_PANEL_MARGIN = 8;

const selectionPanel = ref<HTMLElement | null>(null);
/** Screen rectangle the open panel is kept clear of: what the pointer itself covers. */
let selectionAnchor: AnchorRect | null = null;

/** Room the pointer takes: a cursor tip, or the fingertip the panel opens just below. */
const POINTER_RADIUS_PX = 4;
const FINGER_RADIUS_PX = 8;

/**
 * Puts the panel below the item it describes, or above it where the bottom of the window is
 * closer, so a finger never covers what it has just opened. Measured once the panel has rendered,
 * since it is as tall as the selection has to say.
 */
const clampSelectionPanel = () => {
  const panel = selectionPanel.value;
  if (!panel) return;

  // The panel is positioned absolutely, so its coordinates are those of its offset parent.
  const origin = (panel.offsetParent as HTMLElement | null)?.getBoundingClientRect();
  const originLeft = origin?.left ?? 0;
  const originTop = origin?.top ?? 0;

  const { left, top } = placePopupNearAnchor({
    anchor: selectionAnchor,
    width: panel.offsetWidth || TTWIDTH,
    height: panel.offsetHeight,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    margin: SELECTION_PANEL_MARGIN,
  });

  projectStore.selection.x = left - originLeft;
  projectStore.selection.y = top - originTop;
};

/**
 * Whether the open panel was opened by a finger. A mouse reads the same properties from the hover
 * tooltip, so it is only the pointers that get no tooltip that need them in the panel.
 */
const selectionOpenedByTouch = ref(false);

/**
 * Opens the selection panel at the point that was clicked or tapped, rather than at the item: the
 * handle of an element spans the whole beam, and its box would put the panel far from the pointer.
 */
const placeSelectionPanel = (e: MouseEvent) => {
  selectionOpenedByTouch.value = lastPointerType !== 'mouse';

  const radius = selectionOpenedByTouch.value ? FINGER_RADIUS_PX : POINTER_RADIUS_PX;
  selectionAnchor = {
    left: e.clientX - radius,
    right: e.clientX + radius,
    top: e.clientY - radius,
    bottom: e.clientY + radius,
  };

  // A first guess, so the panel is not seen at the previous selection for a frame.
  projectStore.selection.x = e.clientX - TTWIDTH / 2;
  projectStore.selection.y = selectionAnchor.bottom;

  nextTick(clampSelectionPanel);
};

const onNodeClick = (e: MouseEvent) => {
  // A placing mode owns the canvas: a press there places, it does not select.
  if (hasMoved(e) || longPressFired || activeAddMode.value) return;

  appStore.bottomBarTab = 'tab-nodes';

  const target = e.target as HTMLElement;
  const index = target.getAttribute('data-node-id') || '-1';

  projectStore.selection.type = 'node';
  projectStore.selection.label = index;

  projectStore.clearSelection2();
  projectStore.selection2.nodes = [index];

  placeSelectionPanel(e);
};

const onElementClick = (e: MouseEvent, element: Beam2D) => {
  // A placing mode owns the canvas: a press there places, it does not select.
  if (hasMoved(e) || longPressFired || activeAddMode.value) return;

  appStore.bottomBarTab = 'tab-elements';

  projectStore.selection.type = 'element';
  projectStore.selection.label = element.label;

  projectStore.clearSelection2();
  projectStore.selection2.elements = [String(element.label)];

  placeSelectionPanel(e);
};

const onDimensionClick = (e: PointerEvent, dimensionId: string) => {
  // A placing mode owns the canvas: a press there places, it does not select.
  if (hasMoved(e) || longPressFired || activeAddMode.value) return;

  projectStore.clearSelection();
  projectStore.clearSelection2();
  projectStore.selection2.dimensions = [dimensionId];

  projectStore.selection.type = 'dimension';
  projectStore.selection.label = dimensionId;

  placeSelectionPanel(e);
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

const onDimensionPointPointerDown = (e: PointerEvent, dimensionId: string, pointIndex: number) => {
  const dimension = findDimensionById(dimensionId);
  if (!dimension || pointIndex < 0 || pointIndex > 1) return;

  ensureDimensionSelected(dimensionId);
  convertDistanceToWorld(dimension);

  const currentPoint = dimension.points[pointIndex];
  dragDimensionPoint = {
    id: dimensionId,
    dimension,
    pointIndex: pointIndex as 0 | 1,
    startPoint: createDimensionPoint(currentPoint.x, currentPoint.y, currentPoint.sourceNodeLabel ?? null),
    lastPoint: createDimensionPoint(currentPoint.x, currentPoint.y, currentPoint.sourceNodeLabel ?? null),
    started: false,
  };

  pointerDownOriginatesFromDimension = true;
  intersected.value.type = 'dimension-point';
  intersected.value.index = `${dimensionId}:${pointIndex}`;
  appStore.mouseMode = MouseMode.MOVING;
  e.stopPropagation();
};

const onDimensionPointPointerUp = (e: PointerEvent, dimensionId: string) => {
  if (isDraggingDimensionPoint()) {
    finishDimensionPointDrag();
    return;
  }

  onDimensionClick(e, dimensionId);
};

/* PROTOTYPE: the plot drawing's loads, by what each drawn piece belongs to (`elementLoad:3`) */
const plotLoadAt = (e: Event): { kind: string; index: number } | null => {
  const entity = (e.target as Element | null)?.getAttribute?.('data-e') ?? '';
  const [kind, i] = entity.split(':');
  const index = Number(i);
  return kind && Number.isInteger(index) ? { kind, index } : null;
};
const onPlotLoadHover = (e: PointerEvent) => {
  const hit = plotLoadAt(e);
  if (!hit) return;
  const lc = projectStore.solver.loadCases[0];
  plotHoveredLoad.value = `${hit.kind}:${hit.index}`;
  if (hit.kind === 'elementLoad' && lc.elementLoadList[hit.index]) onElementLoadHover(e, lc.elementLoadList[hit.index]);
  else if (hit.kind === 'nodalLoad' && lc.nodalLoadList[hit.index]) onNodalLoadHover(e, lc.nodalLoadList[hit.index]);
  else if (hit.kind === 'prescribed' && lc.prescribedBC[hit.index]) onPrescribedBCHover(e, lc.prescribedBC[hit.index]);
};
const plotMember = (id: string) => projectStore.beams.find((beam) => String(beam.label) === id);
const plotNode = (id: string) => projectStore.solver.domain.nodes.get(id);
const plotMemberHover = (e: MouseEvent, id: string) => {
  // On the line: everything on show is read
  plotHoveredQuantities.value = null;
  const member = plotMember(id);
  if (member) onElementHover(e, member);
};
const plotMemberClick = (e: PointerEvent, id: string) => {
  const member = plotMember(id);
  if (member) onElementClick(e, member);
};
/** The member whose diagram is under the pointer */
const plotResultMember = (e: Event) => {
  const handle = e.target instanceof Element ? e.target.closest('[data-element-id]') : null;
  const id = handle?.getAttribute('data-element-id');
  return id ? plotMember(id) : null;
};
/** The diagrams of the hovered member the pointer is over (see PlotReadout), null on its line */
const plotHoveredQuantities = ref<ReadoutQuantity[] | null>(null);
const READ_GROUPS: ReadonlySet<string> = new Set<ReadoutQuantity>(['N', 'V', 'M', 'w']);

// Over a diagram: its member hovered, without a tooltip (the values at the pointer show instead),
// and only the diagrams under the pointer read - a value read is its own diagram's
const onPlotResultHover = (e: PointerEvent) => {
  const member = plotResultMember(e);
  if (!member) return;
  const id = String(member.label);
  const groups = document
    .elementsFromPoint(e.clientX, e.clientY)
    .filter((el) => el.closest('.plot-hits') && el.getAttribute('data-element-id') === id)
    .map((el) => el.getAttribute('data-g') ?? '')
    .filter((g): g is ReadoutQuantity => READ_GROUPS.has(g));
  plotHoveredQuantities.value = groups.length > 0 ? [...new Set(groups)] : null;
  onElementHover(e, member, false);
};
const onPlotResultLeave = () => {
  plotHoveredQuantities.value = null;
  hideTooltip();
};
const onPlotResultClick = (e: PointerEvent) => {
  const member = plotResultMember(e);
  if (member) onElementClick(e, member);
};
const plotNodeHover = (e: MouseEvent, id: string) => {
  const node = plotNode(id);
  if (node) onNodeHover(e, node);
};
const plotNodePress = (e: PointerEvent, id: string) => {
  const node = plotNode(id);
  if (node) onNodePress(e, node);
};
const onPlotLoadLeave = () => {
  plotHoveredLoad.value = null;
  hideTooltip();
};
const onPlotLoadClick = (e: PointerEvent) => {
  const hit = plotLoadAt(e);
  if (!hit) return;
  if (hit.kind === 'elementLoad') onElementLoadClick(e, hit.index);
  else if (hit.kind === 'nodalLoad') onNodalLoadClick(e, hit.index);
  else if (hit.kind === 'prescribed') onPrescribedBCClick(e, hit.index);
};
const onPlotLoadDblClick = (e: MouseEvent) => {
  const hit = plotLoadAt(e);
  if (!hit) return;
  if (hit.kind === 'elementLoad') openModal(EditElementLoadDialog, { index: hit.index });
  else if (hit.kind === 'nodalLoad') openModal(EditNodalLoadDialog, { index: hit.index });
  else if (hit.kind === 'prescribed') openModal(EditNodalLoadDialog, { index: hit.index, type: 'displacement' });
  projectStore.clearSelection();
};

const onElementLoadClick = (e: MouseEvent, index: number) => {
  // A placing mode owns the canvas: a press there places, it does not select. A load dragged away is
  // moved, not selected.
  if (hasMoved(e) || longPressFired || activeAddMode.value || loadDrag.value?.started) return;

  appStore.bottomBarTab = 'tab-loads';

  projectStore.selection.type = 'element-load';
  projectStore.selection.label = index;

  projectStore.clearSelection2();
  projectStore.selection2.elementLoads = [index];

  placeSelectionPanel(e);
};

const onNodalLoadClick = (e: MouseEvent, index: number) => {
  // A placing mode owns the canvas: a press there places, it does not select. A load dragged away is
  // moved, not selected.
  if (hasMoved(e) || longPressFired || activeAddMode.value || loadDrag.value?.started) return;

  appStore.bottomBarTab = 'tab-loads';

  projectStore.selection.type = 'nodal-load';
  projectStore.selection.label = index;

  projectStore.clearSelection2();
  projectStore.selection2.nodalLoads = [index];

  placeSelectionPanel(e);
};

const onPrescribedBCClick = (e: MouseEvent, index: number) => {
  // A placing mode owns the canvas: a press there places, it does not select.
  if (hasMoved(e) || longPressFired || activeAddMode.value) return;

  appStore.bottomBarTab = 'tab-loads';

  projectStore.selection.type = 'prescribedbc-load';
  projectStore.selection.label = index;

  projectStore.clearSelection2();
  projectStore.selection2.prescribedBC = [index];

  placeSelectionPanel(e);
};

/**
 * What the panel says about the current selection, worded as the hover tooltip words it, so a tap
 * reaches everything a mouse reads by hovering. The panel header already names a node and an
 * element, hence the subtitle only where the kind of the thing carries information of its own.
 */
const resolveSelectionDetails = (): { subtitle: string | null; body: string } | null => {
  const { type, label } = projectStore.selection;
  if (type === null || label === null || !selectionOpenedByTouch.value) return null;

  const loadCase = projectStore.solver.loadCases[0];

  if (type === 'node') {
    const node = projectStore.solver.domain.nodes.get(String(label));
    return node ? { subtitle: null, body: buildNodeDetails(node as Node).body } : null;
  }

  if (type === 'element') {
    const element = projectStore.solver.domain.elements.get(String(label));
    return element ? { subtitle: null, body: buildElementDetails(element as Beam2D).body } : null;
  }

  const withKind = (details: EntityDetails) => ({ subtitle: details.title, body: details.body });

  if (type === 'element-load') {
    const load = loadCase.elementLoadList[Number(label)];
    return load ? withKind(buildElementLoadDetails(load)) : null;
  }

  if (type === 'nodal-load') {
    const load = loadCase.nodalLoadList[Number(label)];
    return load ? withKind(buildNodalLoadDetails(load)) : null;
  }

  if (type === 'prescribedbc-load') {
    const bc = loadCase.prescribedBC[Number(label)];
    return bc ? withKind(buildPrescribedBCDetails(bc)) : null;
  }

  return null;
};

/** What the selection panel is headed by. */
const selectionTitle = computed(() =>
  projectStore.selection.type ? t('selection.' + projectStore.selection.type) : ''
);

const selectionDetails = computed(() => {
  const details = resolveSelectionDetails();
  if (!details) return null;

  const subtitle = selectionSubtitle(selectionTitle.value, details.subtitle);

  return subtitle || details.body ? { subtitle, body: details.body } : null;
});

let drgNode: Node | null = null;
/** Where the node is from the point it was grabbed at, so it moves with the pointer instead of jumping onto it. */
let grabX = 0;
let grabZ = 0;
let origX = 0;
let origZ = 0;
let finalX = 0;
let finalZ = 0;
let dragDimension: { id: string; dimension: DimensionEntry; startDistance: number; lastDistance: number } | null = null;
let dragDimensionPoint: {
  id: string;
  dimension: DimensionEntry;
  pointIndex: 0 | 1;
  startPoint: DimensionPoint;
  lastPoint: DimensionPoint;
  /** False until the pointer has travelled far enough for the press to be a drag. */
  started: boolean;
} | null = null;
let pendingDimensionId: string | null = null;
let pointerDownOriginatesFromDimension = false;

const moveNode = () => {
  if (!drgNode) return;

  // undo/redo: rewind to the drag origin so the snapshot captures the pre-drag state,
  // then apply the final position as a single undoable mutation.
  {
    const node = drgNode;
    node.coords[0] = origX;
    node.coords[2] = origZ;

    executeModelMutationWithUndo(() => {
      setUnsolved();
      node.coords[0] = finalX;
      node.coords[2] = finalZ;
    });
  }

  drgNode = null;
};

/** A node drag left unfinished: the node back where it was, nothing recorded */
const cancelNodeDrag = () => {
  if (!drgNode) return;
  drgNode.coords[0] = origX;
  drgNode.coords[2] = origZ;
  drgNode = null;
};

/**
 * Ends whatever the pointer is in the middle of, when a tool is taken up or Esc pressed: a window
 * being picked for an export (which then gets its answer), a load, node or dimension being dragged
 * (put back where it was). Left running, each held on to the pointer under the new tool.
 */
const endPointerWork = () => {
  if (appStore.mouseMode === MouseMode.PICK_WINDOW) finishWindowPick(null);
  loadDrag.value = null;
  touchedLoad = null;
  cancelDimensionDrag();
  cancelDimensionPointDrag();
  cancelNodeDrag();
};

const isDraggingDimension = () => dragDimension !== null;

const isDraggingDimensionPoint = () => dragDimensionPoint !== null;

const updateDimensionPointFromPointer = () => {
  if (!dragDimensionPoint) return;

  const nextPoint = getPointerDimensionPoint();
  const updatedPoint = createDimensionPoint(nextPoint.x, nextPoint.y, nextPoint.sourceNodeLabel ?? null);
  dragDimensionPoint.dimension.points[dragDimensionPoint.pointIndex] = updatedPoint;
  dragDimensionPoint.lastPoint = updatedPoint;
};

const updateDimensionDistanceFromPointer = () => {
  if (!dragDimension) return;
  const points = getDimensionResolvedPoints(dragDimension.dimension);
  if (!points) return;

  convertDistanceToWorld(dragDimension.dimension);

  const dx = points[1].x - points[0].x;
  const dz = points[1].y - points[0].y;
  const length = Math.sqrt(dx * dx + dz * dz);
  if (!isFinite(length) || length === 0) return;

  const normalX = dz / length;
  const normalY = -dx / length;
  const offset = (mouseXReal.value - points[0].x) * normalX + (mouseYReal.value - points[0].y) * normalY;
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
    dimension.distance = startDistance;
    dimension.distanceUnit = 'world';

    executeModelMutationWithUndo(() => {
      dimension.distance = lastDistance;
      dimension.distanceUnit = 'world';
    });
  } else if (!shouldCommit) {
    dimension.distance = startDistance;
    dimension.distanceUnit = 'world';
  }

  dragDimension = null;
  appStore.mouseMode = MouseMode.NONE;
  pendingDimensionId = null;
};

const finishDimensionPointDrag = (shouldCommit = true) => {
  if (!dragDimensionPoint) return;

  const { dimension, pointIndex, startPoint, lastPoint } = dragDimensionPoint;
  const changed =
    Math.abs(lastPoint.x - startPoint.x) > 1e-9 ||
    Math.abs(lastPoint.y - startPoint.y) > 1e-9 ||
    (lastPoint.sourceNodeLabel ?? null) !== (startPoint.sourceNodeLabel ?? null);

  if (shouldCommit && changed) {
    dimension.points[pointIndex] = createDimensionPoint(startPoint.x, startPoint.y, startPoint.sourceNodeLabel ?? null);

    executeModelMutationWithUndo(() => {
      dimension.points[pointIndex] = createDimensionPoint(lastPoint.x, lastPoint.y, lastPoint.sourceNodeLabel ?? null);
    });
  } else if (!shouldCommit) {
    dimension.points[pointIndex] = createDimensionPoint(startPoint.x, startPoint.y, startPoint.sourceNodeLabel ?? null);
  }

  dragDimensionPoint = null;
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

const cancelDimensionPointDrag = () => {
  if (!dragDimensionPoint) return;
  finishDimensionPointDrag(false);
};

/**
 * Model coordinates under the pointer, snapped to the grid when enabled.
 *
 * Screen coordinates are used rather than `offsetX`/`offsetY`, which are relative to whatever
 * element the pointer happens to be over: a node handle, a load glyph or the grid. That differs
 * between a pointerdown and the pointerup that follows it, and a touch lands on a child element
 * far more often than a mouse does, which put placed nodes anywhere but under the finger.
 */
const lengthDisplay: LengthDisplay = {
  toDisplay: (metres) => appStore.convertLength(metres),
  toMetres: (display) => appStore.convertInverseLength(display),
};

const updatePointerPosition = (e: Pick<PointerEvent, 'clientX' | 'clientY'>) => {
  appStore.mouse.x = e.clientX;
  appStore.mouse.y = e.clientY;

  const pointer = svg.value!.createSVGPoint();
  pointer.x = e.clientX;
  pointer.y = e.clientY;

  const svgP1 = pointer.matrixTransform(screenToModelMatrix());

  const mXReal = svgP1.x;
  const mYReal = svgP1.y;
  pointerExact.x = mXReal;
  pointerExact.y = mYReal;

  const realStep = viewerStore.gridStep;
  const canSnap = viewerStore.snapToGrid && Number.isFinite(realStep) && realStep > 0;

  const snappedX = snapToGrid(mXReal, realStep, lengthDisplay);
  const snappedY = snapToGrid(mYReal, realStep, lengthDisplay);

  mouseXReal.value = canSnap ? snappedX : mXReal;
  mouseYReal.value = canSnap ? snappedY : mYReal;
};

const mouseMove = (e: PointerEvent) => {
  lastPointerType = e.pointerType;

  if (longPressTimer !== null && hasMoved(e)) cancelLongPress();

  updatePointerPosition(e);

  if (loadDrag.value && appStore.mouseMode === MouseMode.MOVING) moveDraggedLoad(e);

  if (windowDrag.value) {
    const p = screenToModel(e);

    windowDrag.value = { ...windowDrag.value, x1: p.x, y1: p.y };

    return;
  }

  if (pendingDimensionId && !isDraggingDimension() && hasMoved(e)) {
    if (startDimensionDrag(pendingDimensionId)) {
      updateDimensionDistanceFromPointer();
    }
  }

  if (isDraggingDimensionPoint()) {
    if (!dragDimensionPoint!.started && dragStarted(e)) dragDimensionPoint!.started = true;
    if (dragDimensionPoint!.started) updateDimensionPointFromPointer();
  }

  if (isDraggingDimension()) {
    updateDimensionDistanceFromPointer();
  }

  if (appStore.mouseMode === MouseMode.MOVING && intersected.value.type === 'node') {
    const index = intersected.value.index;
    if (index === null) return;

    // The hovered node can vanish under the pointer (undo, delete, a newly opened model) while the
    // hover state still names it, so the drag has nothing to move.
    const item = useProjectStore().solver.domain.nodes.get(String(index));
    if (!item) {
      appStore.mouseMode = MouseMode.NONE;
      intersected.value.type = null;
      intersected.value.index = null;
      return;
    }

    if (drgNode === null) {
      if (!dragStarted(e)) return;

      drgNode = item;
      origX = item.coords[0];
      origZ = item.coords[2];

      // Measured from where the press began, in the model, so the node keeps its place under the
      // pointer - grabbed off its centre, or where its deformed shape is drawn, it used to jump
      const start = screenToModel({ clientX: mouseStartX, clientY: mouseStartY } as PointerEvent);
      grabX = item.coords[0] - start.x;
      grabZ = item.coords[2] - start.y;
    }

    // The node's new place snaps to the grid, not the pointer's
    const p = screenToModel(e);
    const step = viewerStore.gridStep;
    const snap = viewerStore.snapToGrid && Number.isFinite(step) && step > 0;
    const x = snap ? snapToGrid(p.x + grabX, step, lengthDisplay) : p.x + grabX;
    const z = snap ? snapToGrid(p.y + grabZ, step, lengthDisplay) : p.y + grabZ;

    item.coords[0] = x;
    item.coords[2] = z;

    finalX = x;
    finalZ = z;

    // The crosshair and its ruler labels follow the node, not the pointer that holds it off-centre:
    // the coordinates read are where the node goes
    mouseXReal.value = x;
    mouseYReal.value = z;

    //useProjectStore().solver.loadCases[0].solved = false;
    solve();
  }
};

/** Whether an element joins these two nodes already */
const connects = (a: string | number | null, b: string | number) =>
  a !== null &&
  projectStore.beams.some((beam) => {
    const [n1, n2] = beam.nodes.map(String);
    return (n1 === String(a) && n2 === String(b)) || (n1 === String(b) && n2 === String(a));
  });

/**
 * A node placed on an element: asks whether it joins the element - split there, the two parts
 * meeting at the node - or stands on its own over it. `place` makes the node and whatever comes
 * with it, told whether the element is split there; one undo step with the split. `then` follows
 * either way, and nothing at all follows Cancel.
 */
const askToJoinMember = (
  beam: Beam2D,
  nodeLabel: number | string,
  place: (split: boolean) => void,
  then: () => void
) => {
  const placed = (split: boolean) => () => {
    executeModelMutationWithUndo(() => {
      projectStore.solver.loadCases[0].solved = false;
      place(split);
      if (split) splitBeamAtNode(projectStore.solver, beam, String(nodeLabel));
    });
    then();
    closeModal();
  };
  openModal(Confirmation, {
    title: t('confirmation.splitElementAndPlaceNode.title'),
    message: t('confirmation.splitElementAndPlaceNode.message', { label: String(beam.label) }),
    actions: [
      { label: t('confirmation.splitElementAndPlaceNode.split'), color: 'green darken-1', action: placed(true) },
      { label: t('confirmation.placeIndividualNode'), color: 'blue darken-1', action: placed(false) },
      { label: t('dialogs.common.cancel'), color: 'red darken-1', action: () => closeModal() },
    ],
    minWidth: 480,
  });
};

/**
 * Runs the placing modes for a pointer at the current position. Returns whether it consumed the
 * event. Called on pointerdown for a mouse, and on pointerup for touch, where a gesture only turns
 * out to be a tap once the finger lifts.
 */
const placeAtPointer = (e: PointerEvent) => {
  if (appStore.mouseMode === MouseMode.ADD_SUPPORT || appStore.mouseMode === MouseMode.ADD_LOAD) {
    applyToolAt();
    return true;
  }

  if (appStore.mouseMode === MouseMode.PASTE_CLIPBOARD) {
    appStore.mouseMode = MouseMode.NONE;
    useClipboardStore().paste({
      x: mouseXReal.value - startNode.value.x + deltaPaste.value.x,
      z: mouseYReal.value - startNode.value.y + deltaPaste.value.y,
    });
    startNode.value = null;
    return true;
  }

  if (appStore.mouseMode === MouseMode.ADD_NODE) {
    mouseStartX = -9999;

    let newNodeId = projectStore.solver.domain.nodes.size + 1;

    while (projectStore.solver.domain.nodes.has(newNodeId.toString())) {
      newNodeId++;
    }

    // Where the preview stands: a node already there needs no other on top of it
    const { x, y, node, beam } = snapNow('either');
    if (node) return true;

    // Onto an element: split it there, or place the node on its own
    if (beam) {
      askToJoinMember(
        beam,
        newNodeId,
        () => placeNode(newNodeId, x, y),
        () => (appStore.mouseMode = MouseMode.NONE)
      );
      e.stopPropagation();
      e.preventDefault();
      return true;
    }

    executeModelMutationWithUndo(() => {
      placeNode(newNodeId, x, y);
    });

    return true;
  }

  if (appStore.mouseMode === MouseMode.ADD_ELEMENT) {
    mouseStartX = -9999;
    const domain = projectStore.solver.domain;

    // An undo while the mode is open can take away the node the chain goes on from, or every
    // material or cross section. An element built on either names something that is gone, and
    // every drawing and selection pass after it fails on the missing node.
    if (startNode.value !== null && !domain.nodes.has(String(startNode.value.label))) startNode.value = null;

    const mat = [...domain.materials.values()][0]?.label;
    const cs = [...domain.crossSections.values()][0]?.label;
    if (mat === undefined || cs === undefined) {
      alert(t(mat === undefined ? 'warnings.addMaterialFirst' : 'warnings.addCrossSectionFirst'));
      cancelActiveMode();
      return true;
    }

    // Where the preview stands: a node, a place on an element, or a grid point
    const spot = snapNow('either');
    const hoveredNode = spot.node;

    if (startNode.value === null) {
      const n = hoveredNode;

      // No node selected, but want to add element
      // So we add a node for the user
      if (!n) {
        let newNodeId = projectStore.solver.domain.nodes.size + 1;

        while (projectStore.solver.domain.nodes.has(newNodeId.toString())) {
          newNodeId++;
        }

        const [x, z] = [spot.x, spot.y];
        const create = () => projectStore.solver.domain.createNode(newNodeId, [x, 0, z]);
        const startHere = () => (startNode.value = { label: newNodeId, x, y: z });

        // Started on an element: joined to it, as a node placed there is
        if (spot.beam) {
          askToJoinMember(spot.beam, newNodeId, create, startHere);
          return true;
        }

        executeModelMutationWithUndo(create);
        startHere();

        return true;
      }

      startNode.value = { label: n.label, x: n.coords[0], y: n.coords[2] };
    } else if (hoveredNode && String(hoveredNode.label) === String(startNode.value.label)) {
      // Back on the node it starts from: an element there would have no length. Nothing is added.
      return true;
    } else if (hoveredNode && connects(startNode.value.label, hoveredNode.label)) {
      // An element is there already: a second would double it. The chain goes on from the node.
      startNode.value = { label: hoveredNode.label, x: hoveredNode.coords[0], y: hoveredNode.coords[2] };
    } else if (hoveredNode) {
      projectStore.solver.loadCases[0].solved = false;
      let newElId = projectStore.solver.domain.elements.size + 1;

      while (projectStore.solver.domain.elements.has(newElId.toString())) {
        newElId++;
      }

      const nid = startNode.value.label;
      if (nid === null) return true;
      executeModelMutationWithUndo(() => {
        projectStore.solver.domain.createBeam2D(newElId, [String(nid), hoveredNode.label], mat, cs, [
          addElementHinges.value[0],
          addElementHinges.value[1],
        ]);
      });

      startNode.value = { label: hoveredNode.label, x: hoveredNode.coords[0], y: hoveredNode.coords[2] };
    } else {
      projectStore.solver.loadCases[0].solved = false;

      // No end node selected, just add new
      let newNodeId = projectStore.solver.domain.nodes.size + 1;

      while (projectStore.solver.domain.nodes.has(newNodeId.toString())) {
        newNodeId++;
      }

      let newElId = projectStore.solver.domain.elements.size + 1;

      while (projectStore.solver.domain.elements.has(newElId.toString())) {
        newElId++;
      }

      const nid = startNode.value.label;
      if (nid === null) return true;
      const [x, z] = [spot.x, spot.y];
      const hinges: [boolean, boolean] = [addElementHinges.value[0], addElementHinges.value[1]];
      const create = (split = false) => {
        projectStore.solver.domain.createNode(newNodeId, [x, 0, z]);
        // Split from the node the chain starts at, the element's part up to here is that element
        if (split && spot.beam?.nodes.includes(String(nid))) return;
        projectStore.solver.domain.createBeam2D(newElId, [String(nid), String(newNodeId)], mat, cs, hinges);
      };
      const goOnFromHere = () => (startNode.value = { label: newNodeId, x, y: z });

      // Ended on an element: joined to it, as a node placed there is
      if (spot.beam) {
        askToJoinMember(spot.beam, newNodeId, create, goOnFromHere);
        return true;
      }

      executeModelMutationWithUndo(create);
      goOnFromHere();
    }

    return true;
  }

  if (appStore.mouseMode === MouseMode.ADD_DIMLINE) {
    mouseStartX = -9999;
    if (startNode.value === null) {
      const startPoint = getPointerDimensionPoint();
      startNode.value = {
        label: startPoint.sourceNodeLabel ?? null,
        x: startPoint.x,
        y: startPoint.y,
        sourceNodeLabel: startPoint.sourceNodeLabel ?? null,
      };
    } else {
      const endPoint = getPointerDimensionPoint();
      const samePoint = Math.hypot(endPoint.x - startNode.value.x, endPoint.y - startNode.value.y) < 1e-9;

      if (samePoint) {
        startNode.value = null;
        appStore.mouseMode = MouseMode.NONE;
        return true;
      }

      executeModelMutationWithUndo(() => {
        projectStore.dimensions.push({
          id: createDimensionId(),
          distance: dimlineDist.value / (scale.value || 1),
          distanceUnit: 'world',
          points: [
            createDimensionPoint(startNode.value!.x, startNode.value!.y, startNode.value!.sourceNodeLabel ?? null),
            endPoint,
          ],
        });
      });

      startNode.value = null;
      appStore.mouseMode = MouseMode.NONE;
    }

    return true;
  }

  return false;
};

/*
 * Dragging a load to another place: a nodal load to another node, a member's load to another member,
 * a point load also along its own. A mouse press on a load arms it; it moves only once the pointer
 * has gone a few px (see dragStarted), so a click still selects and a double click still edits. A
 * finger on a load pans as anywhere else: only held still for a long press does the load lift, and
 * then a move drags it, while lifting the finger unmoved opens the menu a long press opens. Until
 * dropped, the load stays where it is and a grey copy shows where it would go. A drop is one undo
 * step; a drop where it cannot go, or Esc, leaves it where it was.
 */
type LoadDrag = {
  readonly kind: 'nodal' | 'element';
  /** The load itself, not its place in the list: an undo or a delete during the drag moves the others */
  readonly load: MovableLoad;
  started: boolean;
  /** Lifted by a long press of a finger: where that press's menu opens if the finger lifts unmoved */
  readonly lifted?: {
    readonly x: number;
    readonly y: number;
    readonly element: Beam2D | null;
    /** The finger that lifted it: another finger's lifting ends nothing */
    readonly pointerId: number;
  };
};
const loadDrag = ref<LoadDrag | null>(null);
/** The load a finger is on, until its long press lifts it or the finger leaves */
let touchedLoad: { readonly kind: LoadDrag['kind']; readonly load: MovableLoad; readonly pointerId: number } | null =
  null;

/** A long press of a finger on a load: lifts it to be dragged, instead of opening the menu */
const liftLoad = (x: number, y: number, element: Beam2D | null): boolean => {
  const touched = touchedLoad;
  touchedLoad = null;
  if (!touched || appStore.mouseMode === MouseMode.MOVING) return false;
  loadDrag.value = {
    kind: touched.kind,
    load: touched.load,
    started: false,
    lifted: { x, y, element, pointerId: touched.pointerId },
  };
  appStore.mouseMode = MouseMode.MOVING;
  hideTooltip(false);
  navigator.vibrate?.(10);
  return true;
};

/** The dragged load, while it is still in the model: one an undo or a delete took away is not dropped */
const draggedLoadOf = (d: LoadDrag | null): MovableLoad | undefined => {
  if (d === null) return undefined;
  const lc = projectStore.solver.loadCases[0];
  const list: readonly MovableLoad[] = d.kind === 'nodal' ? lc.nodalLoadList : lc.elementLoadList;
  return list.find((l) => toRaw(l) === toRaw(d.load));
};

/** The dragged load as the preview draws it, once the drag has begun */
const draggedLoad = computed(() => {
  const d = loadDrag.value;
  const load = d?.started || d?.lifted ? draggedLoadOf(d) : undefined;
  if (!load) return null;
  const loads = asToolLoads(load);
  return loads.length > 0 ? { loads, takes: movableTakes(load) } : null;
});

/** A press on a load: a mouse's arms the drag, a finger's waits for its long press. Not while a placing mode owns the canvas. */
const pressLoad = (e: PointerEvent, kind: LoadDrag['kind'], index: number) => {
  if (e.button !== 0 || activeAddMode.value || appStore.inViewerMode) return;
  const lc = projectStore.solver.loadCases[0];
  const load = kind === 'nodal' ? lc.nodalLoadList[index] : lc.elementLoadList[index];
  if (!load) return;
  if (e.pointerType === 'mouse') loadDrag.value = { kind, load, started: false };
  else touchedLoad = { kind, load, pointerId: e.pointerId };
};
const onPlotLoadPress = (e: PointerEvent) => {
  const hit = plotLoadAt(e);
  if (hit?.kind === 'nodalLoad') pressLoad(e, 'nodal', hit.index);
  else if (hit?.kind === 'elementLoad') pressLoad(e, 'element', hit.index);
};

const moveDraggedLoad = (e: PointerEvent) => {
  const d = loadDrag.value;
  if (!d || d.started || !dragStarted(e)) return;
  d.started = true;
  hideTooltip(false);
};

/** Drops the dragged load where the pointer is */
const dropLoad = (d: LoadDrag) => {
  const load = draggedLoadOf(d);
  if (!d.started || !load) return;
  const target = targetOf(snapNow(movableTakes(load)));
  if (!target || !asToolLoads(load).every((l) => toolLoadFits(target, l))) return;
  executeModelMutationWithUndo(() => {
    if (moveLoad(load, target)) setUnsolved();
  });
};

const onMouseDown = (e: PointerEvent) => {
  lastPointerType = e.pointerType;

  // Identity, not a flag: a press that lands outside the canvas then leaves nothing armed here.
  if (e === ctxMenuDismissEvent) {
    ctxMenuDismissEvent = null;
    return;
  }

  // Picking a window: the drag is the whole interaction, nothing is selected or placed.
  if (appStore.mouseMode === MouseMode.PICK_WINDOW) {
    if (e.button !== 0) return;

    const p = screenToModel(e);

    windowDrag.value = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };

    // Keeps the drag when the pointer leaves the drawing; refused for synthetic events.
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      /* not a real pointer */
    }

    return;
  }

  //if (this.svgPanZoom == null) return;
  const skipClearingSelection = pointerDownOriginatesFromDimension;
  pointerDownOriginatesFromDimension = false;

  if (!skipClearingSelection) {
    projectStore.clearSelection();

    if (e.button !== 2) projectStore.clearSelection2();
  }

  if ('activeElement' in document) (document.activeElement as HTMLElement).blur();

  // The primary pointer starts a fresh gesture; anything left over from a lost pointerup is stale.
  if (e.isPrimary) activePointers.clear();
  activePointers.add(e.pointerId);

  // A second finger turns the gesture into a pinch or a two finger pan. Nothing may be placed by
  // it, and the tap the first finger had started is off.
  if (activePointers.size > 1) {
    pendingTap = false;
    cancelLongPress();
    return;
  }

  updatePointerPosition(e);

  mouseStartX = e.clientX;
  mouseStartY = e.clientY;

  // Touch has no hover and no way to take a press back, so a placing mode waits for the finger to
  // lift: by then a pinch, a pan or a drag has ruled itself out.
  if (e.pointerType !== 'mouse' && e.button === 0 && activeAddMode.value) {
    pendingTap = true;
    return;
  }

  if (
    e.pointerType !== 'mouse' &&
    e.button === 0 &&
    appStore.mouseMode !== MouseMode.MOVING &&
    !touchSelectArmed.value
  ) {
    startLongPress(e);
  }

  if (e.button === 0 /* && typeof e.button !== "undefined" */) {
    //this.svgPanZoom.disablePan();
    //mouseStartX = e.offsetX;
    //mouseStartY = e.offsetY;

    if (placeAtPointer(e)) return;

    // A press on a load: it is dragged, not a box drawn from it
    if (loadDrag.value) {
      cancelLongPress();
      appStore.mouseMode = MouseMode.MOVING;
      return;
    }

    if (appStore.mouseMode === MouseMode.HOVER) {
      if (intersected.value.type === 'node') hideTooltip(false);
      appStore.mouseMode = MouseMode.MOVING;
    } else if ((e.pointerType === 'mouse' || touchSelectArmed.value) && appStore.mouseMode !== MouseMode.MOVING) {
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

/**
 * A model saved before dimension distances were kept in world units brings them in pixels, and
 * only the viewer knows the scale to convert them by. Migrated when the dimensions arrive rather
 * than while the drawing is being rendered: a computed that writes to what it reads invalidates
 * itself, and this ran over every dimension on every render for something that happens once.
 */
watch(
  () => projectStore.dimensions,
  (dimensions) => dimensions.forEach((dim) => convertDistanceToWorld(dim as DimensionEntry)),
  { immediate: true }
);

const normalizedDimensions = computed(() => projectStore.dimensions as DimensionEntry[]);

const getDimensionResolvedPoints = (dim: DimensionEntry): [DimensionPoint, DimensionPoint] | null =>
  resolveDimensionPoints(dim, projectStore.solver.domain.nodes);

const getDimensionRenderableNodes = (dim: DimensionEntry) => {
  const points = getDimensionResolvedPoints(dim);
  if (!points) return null;

  return [
    createDimensionRenderableNode(points[0], dim.points[0].sourceNodeLabel ?? null),
    createDimensionRenderableNode(points[1], dim.points[1].sourceNodeLabel ?? null),
  ];
};

const getDimensionSegment = (dim: DimensionEntry): { start: Point; end: Point } | null => {
  const points = getDimensionResolvedPoints(dim);
  if (!points) return null;

  const dx = points[1].x - points[0].x;
  const dz = points[1].y - points[0].y;
  const length = Math.sqrt(dx * dx + dz * dz);

  if (!isFinite(length) || length === 0) return null;

  const normalX = dz / length;
  const normalY = -dx / length;
  const offset = -(dim.distance ?? 0);

  const dnx = offset * normalX;
  const dny = offset * normalY;

  return {
    start: { x: points[0].x + dnx, y: points[0].y + dny },
    end: { x: points[1].x + dnx, y: points[1].y + dny },
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

/** The browser took the gesture over (scroll, pinch, palm rejection); it places nothing. */
const onPointerCancel = (e: PointerEvent) => {
  activePointers.delete(e.pointerId);
  // A lifted load let go of by the browser: back to panning, which the lift had held off
  if (loadDrag.value?.lifted) appStore.mouseMode = MouseMode.NONE;
  loadDrag.value = null;
  touchedLoad = null;
  pendingTap = false;
  cancelLongPress();
  longPressFired = false;
};

const onMouseUp = (e: PointerEvent) => {
  activePointers.delete(e.pointerId);
  cancelLongPress();
  // Every release disarms a load drag, however it ends: a press armed but never followed must not
  // drag that load on the next press elsewhere. The load's own pointerup has read it already.
  const drag = loadDrag.value;
  // A second finger let go while the first still drags the load it lifted: nothing ends
  if (drag?.lifted && drag.lifted.pointerId !== e.pointerId) return;
  loadDrag.value = null;
  touchedLoad = null;

  // A load a finger lifted: dropped where it was dragged, or the long press's menu where it was not
  if (drag?.lifted) {
    longPressFired = false;
    appStore.mouseMode = MouseMode.NONE;
    if (drag.started) dropLoad(drag);
    else openCanvasMenu(drag.lifted.x, drag.lifted.y, drag.lifted.element);
    return;
  }

  // The press became the menu; its release is not a tap and must not select or place.
  if (longPressFired) {
    longPressFired = false;
    return;
  }

  if (windowDrag.value) {
    const box = windowPickBox(windowDrag.value);

    // A click that never became a drag is not a window; keep waiting for one.
    if (box && box.w > 0 && box.h > 0) finishWindowPick(box);
    else windowDrag.value = null;

    return;
  }

  if (pendingTap) {
    pendingTap = false;

    // One finger, and no second one that would have made this a pinch. Pasting is placed wherever
    // the finger ends, since carrying the preview there is how it is aimed; the other modes place
    // only if it stayed put, so a pan or a drag still places nothing.
    const carried = appStore.mouseMode === MouseMode.PASTE_CLIPBOARD;

    if (activePointers.size === 0 && (carried || !hasMoved(e))) {
      updatePointerPosition(e);
      placeAtPointer(e);
    }

    return;
  }

  if (appStore.mouseMode === MouseMode.ADD_NODE) return;
  if (appStore.mouseMode === MouseMode.ADD_ELEMENT) return;
  if (appStore.mouseMode === MouseMode.ADD_DIMLINE) return;
  if (appStore.mouseMode === MouseMode.ADD_SUPPORT) return;
  if (appStore.mouseMode === MouseMode.ADD_LOAD) return;

  if (appStore.mouseMode === MouseMode.MOVING) {
    if (drag) {
      dropLoad(drag);
    } else if (intersected.value.type === 'node') {
      moveNode();
    } else if (intersected.value.type === 'dimension-point') {
      finishDimensionPointDrag();
    } else if (intersected.value.type === 'dimension') {
      finishDimensionDrag();
    }
  }

  if (!isDraggingDimension() && !isDraggingDimensionPoint()) {
    pendingDimensionId = null;
  }

  // A tap on a member, a load or a node with Box select on: that one was selected by its own click
  // just now, and an empty box from the same tap must not take it away again
  const tappedEntity =
    !hasMoved(e) && e.target instanceof Element && e.target.closest('.plot-hits .hit, .handle') !== null;
  if (appStore.mouseMode === MouseMode.SELECTING && tappedEntity) {
    appStore.mouseMode = MouseMode.NONE;
    return;
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
    for (const el of projectStore.beams) {
      const label = el.label;
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

    const selectedByBox =
      selectedNodes.length +
      selectedElements.length +
      selectedNodalLoads.length +
      selectedElementLoads.length +
      selectedPrescribedBC.length +
      selectedDimensions.length;
    const wasMouse = e.pointerType === 'mouse';

    projectStore.clearSelection2();
    projectStore.selection2.elements = selectedElements;
    projectStore.selection2.nodes = selectedNodes;
    projectStore.selection2.nodalLoads = selectedNodalLoads;
    projectStore.selection2.elementLoads = selectedElementLoads;
    projectStore.selection2.prescribedBC = selectedPrescribedBC;
    projectStore.selection2.dimensions = selectedDimensions;

    /*
     * A box drawn by finger opens the menu on release.
     *
     * The toggle only ever selected: a long press on what it selected is read as a press on the
     * canvas and takes the selection away again, so Copy, Paste and Delete could not be reached at
     * all. Offering them where the finger lifts is what makes a multiple selection worth having,
     * and it costs no extra gesture. A box that caught nothing opens nothing.
     */

    if (!wasMouse && selectedByBox > 0) openCanvasMenu(e.clientX, e.clientY);
  }

  appStore.mouseMode = MouseMode.NONE;

  intersected.value.type = null;
  intersected.value.index = null;
};

const showCtxMenu = ref(false);
/** The element the menu was opened over, if any: what a dimension can be built from directly. */
const ctxMenuElement = ref<Beam2D | null>(null);
/** The very press that dismissed the menu: the canvas must not read it as a press of its own. */
let ctxMenuDismissEvent: PointerEvent | null = null;
const optionsCtxMenu = reactive({
  zIndex: 3000,
  minWidth: 230,
  x: 0,
  y: 0,
});

/** The element under a pointer, from the handle it landed on. */
const elementAtEvent = (e: Event) => {
  const handle = e.target instanceof Element ? e.target.closest('[data-element-id]') : null;
  const label = handle?.getAttribute('data-element-id');
  if (label === null || label === undefined) return null;

  return projectStore.beams.find((beam) => String(beam.label) === label) ?? null;
};

const openCtxMenu = (e: MouseEvent) => {
  if (hasMoved(e) || longPressFired) return;

  ctxMenuElement.value = elementAtEvent(e);
  optionsCtxMenu.x = e.clientX;
  optionsCtxMenu.y = e.clientY;

  showCtxMenu.value = true;
};

/**
 * The menu closes itself on a click outside, but the canvas suppresses the compatibility click a
 * tap would fire (SVGPanZoom prevents the touch defaults), so on a touch screen nothing ever
 * dismissed it. Watch presses instead, and swallow the one that closed the menu.
 */
const closeCtxMenuOnOutsidePress = (e: PointerEvent) => {
  if (e.target instanceof Element && e.target.closest('.mx-context-menu')) return;

  ctxMenuDismissEvent = e;
  showCtxMenu.value = false;
};

watch(showCtxMenu, (open) => {
  if (open) {
    document.addEventListener('pointerdown', closeCtxMenuOnOutsidePress, true);
    return;
  }

  document.removeEventListener('pointerdown', closeCtxMenuOnOutsidePress, true);
  ctxMenuElement.value = null;
});

onUnmounted(() => document.removeEventListener('pointerdown', closeCtxMenuOnOutsidePress, true));

/** Dimensions the element the menu was opened over, end node to end node. */
const addDimensionAlongElement = () => {
  const element = ctxMenuElement.value;
  if (!element) return;

  const nodes = element.nodes.map((label) => projectStore.solver.domain.nodes.get(String(label)));
  if (!nodes[0] || !nodes[1]) return;

  executeModelMutationWithUndo(() => {
    projectStore.dimensions.push({
      id: createDimensionId(),
      distance: dimlineDist.value / (scale.value || 1),
      distanceUnit: 'world',
      points: [createDimensionPointFromNode(nodes[0]!), createDimensionPointFromNode(nodes[1]!)],
    });
  });
};

/** The drawing stays invisible until the first fit has landed, so it never jumps into place. */
const isFitted = computed(() => panZoom.value?.fitted ?? false);

// Nothing is moving before the pan zoom is in the document, and these are read as booleans.
const isZooming = computed(() => panZoom.value?.zooming ?? false);

const isPanning = computed(() => panZoom.value?.panning ?? false);

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

const markerRotationCw = computed(() => dynamicMarker('rotation_cw'));
const markerRotationCcw = computed(() => dynamicMarker('rotation_ccw'));

const markerRotationCwHover = computed(() => dynamicMarker('rotation_cw_hover'));
const markerRotationCwSelected = computed(() => dynamicMarker('rotation_cw_selected'));
const markerRotationCcwHover = computed(() => dynamicMarker('rotation_ccw_hover'));
const markerRotationCcwSelected = computed(() => dynamicMarker('rotation_ccw_selected'));

const markerReaction = computed(() => dynamicMarker('reaction'));
const markerMomentReactionCcw = computed(() => dynamicMarker('moment_reaction_ccw'));
const markerMomentReactionCw = computed(() => dynamicMarker('moment_reaction_cw'));
const markerDot = computed(() => dynamicMarker('dot'));
const markerDotMovingX = computed(() => dynamicMarker('dot-moving-x'));
const markerDotTorsion = computed(() => dynamicMarker('dot-torsion'));
const markerHingeXY = computed(() => dynamicMarker('hinge-xy'));
const markerHingeX = computed(() => dynamicMarker('hinge-x'));
const markerHingeY = computed(() => dynamicMarker('hinge-y'));
const markerForceTip = computed(() => dynamicMarker('forceTip'));
const markerForceTipHover = computed(() => dynamicMarker('forceTip_hover'));
const markerForceTipSelected = computed(() => dynamicMarker('forceTip_selected'));
const markerDimTip = computed(() => dynamicMarker('dimTip'));

const markerTextLabel = computed(() => dynamicMarker('textLabel'));

defineExpose({ centerContent, fitContent });
</script>

<template>
  <div class="d-flex flex-column fill-height svg-viewer">
    <!-- <div style="position: absolute; top: 0; left: 0; background: red; z-index: 101">{{ intersected }}</div> -->
    <div
      v-if="!appStore.inViewerMode"
      id="gridAndUnits"
      class="text-body-2 d-flex ga-1 line-height-1"
      style="position: absolute; z-index: 100; bottom: 16px; right: 16px"
    >
      <div class="d-flex align-center ga-1">
        <v-chip density="compact" class="d-flex pa-0 overflow-hidden">
          <!-- Grid toggle -->
          <v-tooltip :text="$t('viewer.toggleGrid')" location="top" :open-on-click="!deviceHasHover">
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
          <v-tooltip :text="$t('viewer.toggleSnap')" location="top" :open-on-click="!deviceHasHover">
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
      <!--
        The crosshair follows a mouse and is drawn for nothing else, so the switch for it is
        offered only where there is one. Its own icon rather than a letter: G and S name the keys
        that do the same thing, and this has no key of its own - c centres the view.
      -->
      <v-tooltip
        v-if="deviceHasHover"
        :text="$t('viewer.toggleCrosshair')"
        location="top"
        :open-on-click="!deviceHasHover"
      >
        <template #activator="{ props: tooltipProps }">
          <v-chip
            v-bind="tooltipProps"
            density="compact"
            class="pa-0 justify-center align-self-center"
            :class="viewerStore.showCrosshair ? 'text-black' : 'text-grey'"
            style="min-width: 28px"
            @click="viewerStore.showCrosshair = !viewerStore.showCrosshair"
          >
            <!-- what it draws: two dashed lines crossing, with the point they cross at marked -->
            <svg class="crosshair-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                d="M0.5 8H5.5M10.5 8H15.5M8 0.5V5.5M8 10.5V15.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
                stroke-dasharray="2 1"
              />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            </svg>
          </v-chip>
        </template>
      </v-tooltip>

      <v-chip-group>
        <v-chip class="justify-end" density="compact" @click="appStore.openSettings('lang')">
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
        :title="$t('common.undo')"
        @click="undoModelChange()"
      ></v-btn>
      <v-btn
        icon="mdi:mdi-redo"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        :title="$t('common.redo')"
        @click="redoModelChange()"
      ></v-btn>
    </div>
    <!--
      The tools: what a click on the drawing does, on one sheet down the middle of the drawing's
      left edge. Only what is done by clicking on the drawing is here; one-off commands stay in the
      menus, view controls top right. Each has a key, and Esc or choosing it again goes back to Select.
    -->
    <v-sheet
      v-if="!appStore.inViewerMode"
      id="toolRail"
      class="tool-rail"
      elevation="2"
      rounded="lg"
      role="toolbar"
      aria-orientation="vertical"
      :aria-label="$t('viewer.tools')"
    >
      <v-btn
        v-for="tool in railButtons"
        :key="tool.id"
        :title="tool.key ? `${$t(tool.label)} (${tool.key})` : $t(tool.label)"
        icon
        size="32"
        density="comfortable"
        rounded="lg"
        :variant="railPressed(tool.id) ? 'flat' : 'text'"
        :color="railPressed(tool.id) ? 'primary' : undefined"
        :aria-label="$t(tool.label)"
        :aria-pressed="railPressed(tool.id)"
        :aria-haspopup="hasFlyout(tool.id) ? 'menu' : undefined"
        :data-tool="tool.id"
        @click="onRailClick($event, tool.id)"
        @pointerdown="startFlyoutPress($event, tool.id)"
        @pointerup="cancelFlyoutPress"
        @pointerleave="cancelFlyoutPress"
        @contextmenu.prevent="openFlyout(tool.id)"
      >
        <SupportIcon v-if="tool.id === 'support'" :type="toolSupport" :size="22" />
        <LoadIcon v-else-if="tool.id === 'load'" :type="toolLoadKind" :size="22" />
        <v-icon v-else size="20" :icon="tool.icon" />
        <span v-if="hasFlyout(tool.id)" class="flyout-mark" aria-hidden="true" />
      </v-btn>
      <v-menu
        :model-value="flyout === 'support'"
        activator="#toolRail [data-tool=support]"
        :open-on-click="false"
        location="end"
        offset="8"
        @update:model-value="closeFlyout"
      >
        <v-list density="compact" class="py-1" :aria-label="$t('sideSettings.supports')">
          <v-list-item
            v-for="type in SUPPORT_TYPES"
            :key="type"
            :active="toolSupport === type"
            color="primary"
            @click="pickSupport(type)"
          >
            <template #prepend><SupportIcon :type="type" :size="22" class="mr-3" /></template>
            <v-list-item-title class="text-body-2">{{ $t(`supports.${type}`) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu
        :model-value="flyout === 'load'"
        activator="#toolRail [data-tool=load]"
        :open-on-click="false"
        location="end"
        offset="8"
        @update:model-value="closeFlyout"
      >
        <v-list density="compact" class="py-1" :aria-label="$t('sideSettings.loads')">
          <v-list-item
            v-for="kind in TOOL_LOAD_KINDS"
            :key="kind.id"
            :active="toolLoadKind === kind.id"
            color="primary"
            @click="pickLoadKind(kind.id)"
          >
            <template #prepend><LoadIcon :type="kind.id" :size="22" class="mr-3" /></template>
            <v-list-item-title class="text-body-2">{{ $t(kind.label) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-sheet>
    <div id="viewerControls" class="text-black d-flex" style="position: absolute; z-index: 100; top: 24px; right: 24px">
      <v-btn
        icon="mdi:mdi-image-filter-center-focus"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        :title="$t('viewer.centerContent')"
        @click="centerContent"
      ></v-btn>
      <v-btn
        id="fitContentButton"
        icon="mdi:mdi-fit-to-screen-outline"
        size="32"
        density="comfortable"
        class="mr-1"
        rounded="lg"
        :title="$t('viewer.fitContent')"
        @click="fitContent"
      >
      </v-btn>
      <v-btn
        id="viewerSettingsToggle"
        icon="mdi:mdi-cog"
        size="32"
        density="comfortable"
        rounded="lg"
        :title="$t('common.settings')"
        :color="viewerStore.settingsOpen ? 'primary' : 'default'"
        @click="viewerStore.settingsOpen = !viewerStore.settingsOpen"
      ></v-btn>
    </div>

    <div
      v-if="activeAddMode"
      id="addModeBanner"
      class="d-flex flex-column pl-3 pr-1 py-1 elevation-2 rounded-lg bg-surface"
      style="
        position: absolute;
        z-index: 100;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        max-width: calc(100% - 160px);
      "
    >
      <div class="d-flex align-center ga-2">
        <SupportIcon v-if="appStore.mouseMode === MouseMode.ADD_SUPPORT" :type="toolSupport" :size="18" />
        <LoadIcon v-else-if="appStore.mouseMode === MouseMode.ADD_LOAD" :type="toolLoadKind" :size="18" />
        <v-icon v-else size="16" :icon="activeAddMode.icon" />
        <span class="text-body-2 text-no-wrap">{{ activeAddMode.label }}</span>
        <!-- Where a keyboard is at hand: how to put a point down off the snaps -->
        <span v-if="snapTakes !== null && deviceHasHover" class="text-caption text-medium-emphasis text-no-wrap ml-2">
          {{ $t('viewer.placeFreely') }}
        </span>
        <v-spacer />
        <v-btn size="small" variant="text" color="error" density="comfortable" @click="cancelActiveMode">
          {{ $t('dialogs.common.cancel') }}
        </v-btn>
      </div>

      <!-- What the next placement gets; the mode stays open, so the options live with it -->
      <div v-if="appStore.mouseMode === MouseMode.ADD_NODE" class="d-flex align-center ga-3">
        <v-checkbox-btn v-model="addNodeBcs" :value="DofID.Dx" density="compact" label="Dx" class="flex-grow-0" />
        <v-checkbox-btn
          v-model="addNodeBcs"
          :value="DofID.Dz"
          density="compact"
          :label="`D${appStore.axes.v}`"
          class="flex-grow-0"
        />
        <v-checkbox-btn
          v-model="addNodeBcs"
          :value="DofID.Ry"
          density="compact"
          :label="`R${appStore.axes.r}`"
          class="flex-grow-0"
        />
        <v-text-field
          v-model="addNodeAngle"
          :title="$t('nodes.lcsAngle')"
          prefix="&alpha;"
          suffix="°"
          density="compact"
          variant="plain"
          hide-details
          style="width: 70px"
          class="flex-grow-0 add-node-angle"
          @keydown="checkNumber($event)"
        />
      </div>

      <!-- The load the next node or member clicked gets, in global axes; its kind is the tool's -->
      <div v-if="appStore.mouseMode === MouseMode.ADD_LOAD" class="d-flex flex-wrap align-center ga-2 pr-2 pb-1">
        <template v-if="toolLoadKind === 'force'">
          <v-text-field
            v-model="toolFx"
            prefix="Fx"
            :suffix="appStore.units.Force"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
          <v-text-field
            v-model="toolFz"
            :prefix="`F${appStore.axes.v}`"
            :suffix="appStore.units.Force"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
        </template>
        <v-text-field
          v-if="toolLoadKind === 'moment'"
          v-model="toolMy"
          :prefix="`M${appStore.axes.r}`"
          :suffix="appStore.units.Moment"
          density="compact"
          variant="plain"
          hide-details
          class="flex-grow-0 tool-value"
          @keydown="checkNumber($event)"
        />
        <template v-if="toolLoadKind === 'udl'">
          <v-text-field
            v-model="toolQx"
            prefix="fx"
            :suffix="appStore.units.ForceDistance"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
          <v-text-field
            v-model="toolQz"
            :prefix="`f${appStore.axes.v}`"
            :suffix="appStore.units.ForceDistance"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
        </template>
        <template v-if="toolLoadKind === 'trapezoidal'">
          <v-text-field
            v-model="toolQ1x"
            prefix="f₁x"
            :suffix="appStore.units.ForceDistance"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
          <v-text-field
            v-model="toolQ1z"
            :prefix="`f₁${appStore.axes.v}`"
            :suffix="appStore.units.ForceDistance"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
          <v-text-field
            v-model="toolQ2x"
            prefix="f₂x"
            :suffix="appStore.units.ForceDistance"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
          <v-text-field
            v-model="toolQ2z"
            :prefix="`f₂${appStore.axes.v}`"
            :suffix="appStore.units.ForceDistance"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
        </template>
        <template v-if="toolLoadKind === 'temperature'">
          <v-text-field
            v-model="toolTc"
            :prefix="$t('loads.temperatureDeltaTsNoHTML')"
            :suffix="appStore.units.Temperature"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
          <v-text-field
            v-model="toolTbt"
            :prefix="$t('loads.temperatureDeltaTbtNoHTML')"
            :suffix="appStore.units.Temperature"
            density="compact"
            variant="plain"
            hide-details
            class="flex-grow-0 tool-value"
            @keydown="checkNumber($event)"
          />
        </template>
        <!-- As the element load dialog: on a member, in its own axes unless unticked; a linearly
             varying load always is -->
        <v-checkbox-btn
          v-if="toolLoadKind !== 'moment' && toolLoadKind !== 'temperature'"
          :model-value="toolLoadKind === 'trapezoidal' ? true : toolLcs"
          :disabled="toolLoadKind === 'trapezoidal'"
          :title="$t('common.lcs')"
          density="compact"
          label="LCS"
          class="flex-grow-0"
          @update:model-value="toolLcs = !!$event"
        />
      </div>

      <!--
        Point at the place, or say how far from where it was copied. The second is the only way when
        the place is off screen, since moving the view to find it ends the paste.
      -->
      <div v-if="appStore.mouseMode === MouseMode.PASTE_CLIPBOARD" class="d-flex align-center ga-2">
        <v-text-field
          v-model.number="pasteOffsetX"
          type="number"
          density="compact"
          variant="plain"
          hide-details
          prefix="&Delta;x"
          :suffix="appStore.units.Length"
          style="width: 108px"
          class="flex-grow-0"
          @keydown.enter="pasteAtOffset"
        />
        <v-text-field
          v-model.number="pasteOffsetZ"
          type="number"
          density="compact"
          variant="plain"
          hide-details
          prefix="&Delta;z"
          :suffix="appStore.units.Length"
          style="width: 108px"
          class="flex-grow-0"
          @keydown.enter="pasteAtOffset"
        />
        <v-btn size="small" variant="tonal" density="comfortable" @click="pasteAtOffset">
          {{ $t('common.paste') }}
        </v-btn>
      </div>

      <div v-if="appStore.mouseMode === MouseMode.ADD_ELEMENT" class="d-flex align-center ga-3">
        <v-checkbox-btn
          v-model="addElementHinges[0]"
          density="compact"
          :label="$t('elements.hingeStart')"
          class="flex-grow-0"
        />
        <v-checkbox-btn
          v-model="addElementHinges[1]"
          density="compact"
          :label="$t('elements.hingeEnd')"
          class="flex-grow-0"
        />
      </div>
    </div>

    <context-menu v-model:show="showCtxMenu" :options="optionsCtxMenu">
      <context-menu-item
        @click.ctrl="appStore.mouseMode = MouseMode.ADD_NODE"
        @click.meta="appStore.mouseMode = MouseMode.ADD_NODE"
        @click.exact="openModal(AddNodeDialog, {})"
      >
        <template #icon>
          <v-icon size="x-small">mdi-vector-point-plus</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t('nodes.addNode') }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">{{ $t('viewer.holdCtrl') }}</span>
        </template>
      </context-menu-item>
      <context-menu-item
        @click.ctrl="appStore.mouseMode = MouseMode.ADD_ELEMENT"
        @click.meta="appStore.mouseMode = MouseMode.ADD_ELEMENT"
        @click.exact="openModal(AddElementDialog, {})"
      >
        <template #icon>
          <v-icon size="x-small">mdi-vector-polyline-plus</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t('elements.addElement') }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">{{ $t('viewer.holdCtrl') }}</span>
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
      <!-- Opened over an element: its two end nodes already say where the dimension goes. -->
      <context-menu-item v-if="ctxMenuElement" @click="addDimensionAlongElement()">
        <template #icon>
          <v-icon size="x-small">mdi-arrow-expand-horizontal</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t('dimensioning.add_along_element', { label: ctxMenuElement.label }) }}</span>
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
          <span class="ml-auto text-right" style="font-size: 10px">{{ forKeyboard('Ctrl + C', APPLE_KEYBOARD) }}</span>
        </template>
      </context-menu-item>
      <context-menu-item :disabled="!useClipboardStore().isAnythingInClipboard()" @click="paste()">
        <template #icon>
          <v-icon size="x-small">mdi-content-copy</v-icon>
        </template>
        <template #label>
          <span class="label">{{ $t('common.paste') }}</span>
          <span class="ml-auto text-right" style="font-size: 10px">{{ forKeyboard('Ctrl + V', APPLE_KEYBOARD) }}</span>
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

    <div
      ref="tooltip"
      class="tooltip body-2 black--text"
      :class="{ 'plot-reading': plotReading, 'plot-mode': plotMode }"
      style="display: none"
    >
      <div class="content"></div>
    </div>

    <div class="text-body-2 warning ga-1 d-flex flex-column pr-6">
      <div style="width: fit-content">
        <v-chip
          v-if="solveBanner?.type === 'incomplete'"
          color="info"
          variant="flat"
          size="small"
          :prepend-icon="solveBanner.icon"
          :title="solveBanner.text"
          @click="openSolveDiagnostics"
          @mouseenter="holdFreeMotion = true"
          @mouseleave="holdFreeMotion = false"
        >
          {{ $t('solveDiagnostics.incompleteChip') }}
        </v-chip>
        <v-chip
          v-else-if="solveBanner && errorsCollapsed"
          color="error"
          variant="flat"
          size="small"
          :prepend-icon="solveBanner.icon"
          :title="solveBanner.text"
          @click="collapsedErrorsKey = null"
          @mouseenter="holdFreeMotion = true"
          @mouseleave="holdFreeMotion = false"
        >
          {{ $t('solveDiagnostics.blockedTitle') }}
        </v-chip>
        <!-- Close labels are keys, not texts: Vuetify translates them itself, through the i18n adapter. -->
        <v-alert
          v-else-if="solveBanner"
          :model-value="true"
          :icon="solveBanner.icon"
          density="compact"
          :type="solveBanner.type"
          closable
          close-label="solveDiagnostics.collapseErrors"
          @click:close="collapsedErrorsKey = errorsKey"
          @mouseenter="holdFreeMotion = true"
          @mouseleave="holdFreeMotion = false"
        >
          <template #text>
            <div class="d-flex align-center flex-wrap">
              {{ solveBanner.text }}
              <v-btn variant="text" density="compact" size="small" @click="openSolveDiagnostics">{{
                $t('solveDiagnostics.showDetails')
              }}</v-btn>
              <v-btn
                v-if="hasFreeMotion"
                variant="text"
                density="compact"
                size="small"
                :icon="viewerStore.showMechanisms ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :title="motionToggleLabel"
                :aria-label="motionToggleLabel"
                @click="viewerStore.showMechanisms = !viewerStore.showMechanisms"
              />
            </div>
          </template>
        </v-alert>
      </div>
      <div style="width: fit-content">
        <v-alert
          v-if="warningBanner"
          :model-value="true"
          icon="$warning"
          density="compact"
          type="warning"
          closable
          close-label="solveDiagnostics.dismissWarnings"
          @click:close="projectStore.dismissWarnings()"
        >
          <template #text>
            <div class="d-flex align-center flex-wrap">
              {{ warningBanner }}
              <v-btn variant="text" density="compact" size="small" @click="openSolveDiagnostics">{{
                $t('solveDiagnostics.showDetails')
              }}</v-btn>
            </div>
          </template>
        </v-alert>
      </div>
      <div style="width: fit-content">
        <v-alert v-if="projectStore.materials.length === 0" icon="$warning" density="compact" type="error">
          <template #text>
            <div class="d-flex align-center flex-wrap">
              {{ $t('warnings.noMaterialsDefined') }}
              <v-btn variant="text" density="compact" size="small" @click="openModal(AddMaterialDialog)">{{
                $t('common.addNew')
              }}</v-btn>
            </div>
          </template>
        </v-alert>
      </div>
      <div style="width: fit-content">
        <v-alert v-if="projectStore.crossSections.length === 0" icon="$warning" density="compact" type="error">
          <template #text>
            <div class="d-flex align-center flex-wrap">
              {{ $t('warnings.noCrossSectionsDefined') }}
              <v-btn variant="text" density="compact" size="small" @click="openModal(AddCrossSectionDialog)">
                {{ $t('common.addNew') }}
              </v-btn>
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
    <AxesHelper v-if="viewerStore.showGrid && !appStore.inViewerMode" />

    <Crosshair
      v-if="!appStore.inViewerMode"
      ref="crosshair"
      :target="svg"
      :viewport="viewport"
      :rulers="viewerStore.showGrid"
    />

    <SvgPanZoom
      ref="panZoom"
      :padding="fitPadding"
      :mobile-padding="fitMobilePadding"
      :touch="appStore.mouseMode !== MouseMode.MOVING && appStore.mouseMode !== MouseMode.SELECTING"
      :can-fit-content="projectStore.solver.domain.nodes.size >= 2"
      :model-bounds="modelBounds"
      fit-ignore="[data-fit-ignore]"
      :fit-reserve="fitReserve"
      :fit-min-aspect="FIT_MIN_ASPECT"
      :fit-view="plotMode ? plotFitView : null"
      :center-view="plotMode ? plotCenterView : null"
      center-after-fit
      style="overflow: visible; z-index: 50; min-height: 0"
      @update="onUpdate"
    >
      <svg
        ref="svg"
        :style="{
          opacity: isFitted ? 1 : 0,
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
          '--marker-rotation-cw': markerRotationCw,
          '--marker-rotation-ccw': markerRotationCcw,
          '--marker-rotation-cw-hover': markerRotationCwHover,
          '--marker-rotation-cw-selected': markerRotationCwSelected,
          '--marker-rotation-ccw-hover': markerRotationCcwHover,
          '--marker-rotation-ccw-selected': markerRotationCcwSelected,
          '--marker-reaction': markerReaction,
          '--marker-moment-reaction-ccw': markerMomentReactionCcw,
          '--marker-moment-reaction-cw': markerMomentReactionCw,
          '--marker-dot': markerDot,
          '--marker-dot-moving-x': markerDotMovingX,
          '--marker-dot-torsion': markerDotTorsion,
          '--marker-hinge-xy': markerHingeXY,
          '--marker-hinge-x': markerHingeX,
          '--marker-hinge-y': markerHingeY,
          '--marker-force-tip': markerForceTip,
          '--marker-force-tip-hover': markerForceTipHover,
          '--marker-force-tip-selected': markerForceTipSelected,
          '--marker-dim-tip': markerDimTip,
          '--filter-text-label': markerTextLabel,
          '--colors-loads': viewerStore.colors.loads,
        }"
        :class="{ 'plot-renderer': plotRendererReady, 'load-dragging': loadDrag?.started }"
        @click.right.prevent="openCtxMenu($event)"
        @pointermove="mouseMove"
        @pointerdown="onMouseDown"
        @pointerup="onMouseUp"
        @pointercancel="onPointerCancel"
      >
        <SvgViewerDefs
          :id="props.id"
          :colors="viewerStore.colors"
          :support-size="viewerStore.supportSize"
          :scale="scale"
        />
        <g ref="viewport" :class="{ disablePointerEvents: isZooming || isPanning }">
          <!-- PROTOTYPE: the opt-in drawing, under the editor's layers, which then draw transparent -->
          <PlotPicture
            v-if="viewerStore.renderer === 'plot'"
            :scale="scale"
            :zooming="isZooming"
            :hovered="plotHovered"
            :selected="plotSelected"
            :quantities="plotHoveredQuantities"
            @ready="plotPictureReady = $event"
            @reading="plotReading = $event"
            @hits="plotHits = $event"
          />
          <!-- Where the next node lands and the line back to the last one; its own component
               so that following the pointer does not render the drawing again. -->
          <PlacingPreview :scale="scale" />
          <!-- The editor's own drawing: not mounted at all while the plot drawing is on -->
          <template v-if="!plotMode">
            <g>
              <g v-if="!isZooming && useViewerStore().showLoads" data-fit-ignore="loads">
                <template v-for="(eload, index) in useProjectStore().solver.loadCases[0].elementLoadList">
                  <template v-if="drawableBeamLabels.has(String(eload.target))">
                    <SVGElementLoad
                      v-if="
                        eload instanceof BeamElementUniformEdgeLoad || eload instanceof BeamElementTrapezoidalEdgeLoad
                      "
                      :key="`element-udl-${index}`"
                      :class="{ selected: projectStore.selection2.elementLoads.includes(index) }"
                      :data-element-load-id="index"
                      :eload="eload"
                      :scale="scale"
                      :convert-force-distance="appStore.convertForceDistance"
                      :font-size="viewerStore.fontSize"
                      :number-format="appStore.numberFormatter"
                      @mousemove="
                        onElementLoadHover($event, eload);
                        plotHoveredLoad = `elementLoad:${index}`;
                      "
                      @mouseleave="
                        hideTooltip();
                        plotHoveredLoad = null;
                      "
                      @pointerdown="pressLoad($event, 'element', index)"
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
                      :convert-temperature="appStore.convertTemperature"
                      :font-size="viewerStore.fontSize"
                      :number-format="appStore.numberFormatter"
                      @mousemove="
                        onElementLoadHover($event, eload);
                        plotHoveredLoad = `elementLoad:${index}`;
                      "
                      @mouseleave="
                        hideTooltip();
                        plotHoveredLoad = null;
                      "
                      @pointerdown="pressLoad($event, 'element', index)"
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
                      :convert-moment="appStore.convertMoment"
                      :font-size="viewerStore.fontSize"
                      :number-format="appStore.numberFormatter"
                      @mousemove="
                        onElementLoadHover($event, eload);
                        plotHoveredLoad = `elementLoad:${index}`;
                      "
                      @mouseleave="
                        hideTooltip();
                        plotHoveredLoad = null;
                      "
                      @pointerdown="pressLoad($event, 'element', index)"
                      @pointerup="onElementLoadClick($event, index)"
                      @dblclick="
                        openModal(EditElementLoadDialog, { index });
                        projectStore.clearSelection();
                      "
                    />
                  </template>
                </template>
              </g>
            </g>
            <g ref="geometryLayer" class="elements-layer">
              <SVGElement
                v-for="(element, index) in projectStore.beams"
                :key="`element-geometry-${index}`"
                :class="{ selected: projectStore.selection2.elements.includes(element.label) }"
                :show-geometry="true"
                :show-results="false"
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
                :result-label-mode="resolvedResultLabelMode"
                :diagram-style="viewerStore.diagramStyle"
                :convert-force="appStore.convertForce"
                :convert-moment="appStore.convertMoment"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
              />
            </g>

            <g ref="resultsLayer" class="elements-layer">
              <SVGElement
                v-for="(element, index) in projectStore.beams"
                :key="`element-results-${index}`"
                :class="{ selected: projectStore.selection2.elements.includes(element.label) }"
                :show-geometry="false"
                :show-results="true"
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
                :result-label-mode="resolvedResultLabelMode"
                :diagram-style="viewerStore.diagramStyle"
                :convert-force="appStore.convertForce"
                :convert-moment="appStore.convertMoment"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
                @elementresultsmousemove="onElementHover($event, element, false)"
                @mouseleave="hideTooltip"
                @elementpointerup="onElementClick($event, element)"
              />
            </g>

            <!-- The elements' hit strokes, above every diagram so a member stays hoverable where the
               diagram of another one is drawn over it; loads and nodes still come after. -->
            <g class="element-handles">
              <SVGElementHandle
                v-for="(element, index) in projectStore.beams"
                :key="`element-handle-${index}`"
                :element="element"
                @elementmousemove="onElementHover($event, element)"
                @mouseleave="hideTooltip"
                @elementpointerup="onElementClick($event, element)"
              />
            </g>

            <!--
            Nodal loads sit above the elements so their handles win the hit test: a moment arc or a
            prescribed displacement drawn along a beam would otherwise be swallowed by the beam's own
            handle. Nodes still come last, so they keep priority over the loads attached to them.
          -->
            <g v-if="!isZooming && useViewerStore().showLoads" data-fit-ignore="loads">
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
                @mousemove="
                  onNodalLoadHover($event, nload);
                  plotHoveredLoad = `nodalLoad:${index}`;
                "
                @mouseleave="
                  hideTooltip();
                  plotHoveredLoad = null;
                "
                @pointerdown="pressLoad($event, 'nodal', index)"
                @pointerup="onNodalLoadClick($event, index)"
                @dblclick="
                  openModal(EditNodalLoadDialog, { index });
                  projectStore.clearSelection();
                "
              />
              <SVGPrescribedDisplacement
                v-for="(nload, index) in useProjectStore().solver.loadCases[0].prescribedBC"
                :key="`prescribed-bc-${index}`"
                :class="{ selected: projectStore.selection2.prescribedBC.includes(index) }"
                :nload="nload"
                :scale="scale"
                :convert-displacement="appStore.convertDisplacement"
                :multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
                @mousemove="
                  onPrescribedBCHover($event, nload);
                  plotHoveredLoad = `prescribed:${index}`;
                "
                @mouseleave="
                  hideTooltip();
                  plotHoveredLoad = null;
                "
                @pointerup="onPrescribedBCClick($event, index)"
                @dblclick="
                  openModal(EditNodalLoadDialog, { index, type: 'displacement' });
                  projectStore.clearSelection();
                "
              />
            </g>
            <g class="nodes">
              <SVGNode
                v-for="(node, index) in projectStore.nodes"
                :key="`node-${index}`"
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
                @nodepointerdown="onNodePress($event, node)"
                @mouseleave="hideTooltip"
                @nodepointerup="onNodeClick"
              />
            </g>
          </template>
          <!-- PROTOTYPE: the plot drawing's hit targets, where it draws things, stacked as the editor's
               own: element loads under the members, nodal loads over them, the nodes on top -->
          <g
            v-if="plotMode && plotHits && !isZooming"
            class="plot-hits"
            :class="{ coarse: coarsePointer }"
            :transform="`scale(${1 / plotHits.scale})`"
          >
            <!-- Under everything else: over a diagram is over its member, as in the editor's own drawing -->
            <g @pointermove="onPlotResultHover" @pointerleave="onPlotResultLeave" @pointerup="onPlotResultClick">
              <path
                v-for="(h, i) in plotHits.results"
                :key="`r${i}`"
                :d="h.d"
                :data-element-id="h.entity.slice('member:'.length)"
                :data-g="h.group"
                class="hit area result"
              />
              <!-- A member's values and name are its own, as its diagram is -->
              <text
                v-for="(l, i) in plotMemberLabelHits"
                :key="`rl${i}`"
                :x="l.x"
                :y="l.y"
                :text-anchor="l.anchor"
                :transform="l.transform"
                :font-size="l.size"
                :data-element-id="l.entity.slice('member:'.length)"
                :data-g="l.group"
                class="hit label"
              >
                {{ l.text }}
              </text>
            </g>
            <g
              data-fit-ignore="loads"
              class="load-hits"
              @pointermove="onPlotLoadHover"
              @pointerleave="onPlotLoadLeave"
              @pointerdown="onPlotLoadPress"
              @pointerup="onPlotLoadClick"
              @dblclick="onPlotLoadDblClick"
            >
              <path
                v-for="(h, i) in plotElementLoadHits"
                :key="`el${i}`"
                :d="h.d"
                :data-e="h.entity"
                class="hit"
                :class="{ area: h.area }"
                :stroke-width="hitStroke(h)"
              />
              <!-- A load's values are part of it -->
              <text
                v-for="(l, i) in plotElementLoadLabelHits"
                :key="`ell${i}`"
                :x="l.x"
                :y="l.y"
                :text-anchor="l.anchor"
                :transform="l.transform"
                :font-size="l.size"
                :data-e="l.entity"
                class="hit label"
              >
                {{ l.text }}
              </text>
            </g>
            <g class="element-handles">
              <line
                v-for="m in plotHits.members"
                :key="`m${m.id}`"
                :x1="m.x1"
                :y1="m.y1"
                :x2="m.x2"
                :y2="m.y2"
                class="hit member"
                :data-element-id="m.id"
                @mousemove="plotMemberHover($event, m.id)"
                @mouseleave="hideTooltip()"
                @pointerup="plotMemberClick($event, m.id)"
              />
            </g>
            <g
              data-fit-ignore="loads"
              class="load-hits"
              @pointermove="onPlotLoadHover"
              @pointerleave="onPlotLoadLeave"
              @pointerdown="onPlotLoadPress"
              @pointerup="onPlotLoadClick"
              @dblclick="onPlotLoadDblClick"
            >
              <path
                v-for="(h, i) in plotNodalLoadHits"
                :key="`nl${i}`"
                :d="h.d"
                :data-e="h.entity"
                class="hit"
                :class="{ area: h.area }"
                :stroke-width="hitStroke(h)"
              />
              <text
                v-for="(l, i) in plotNodalLoadLabelHits"
                :key="`nll${i}`"
                :x="l.x"
                :y="l.y"
                :text-anchor="l.anchor"
                :transform="l.transform"
                :font-size="l.size"
                :data-e="l.entity"
                class="hit label"
              >
                {{ l.text }}
              </text>
            </g>
            <g class="nodes">
              <line
                v-for="n in plotHits.nodes"
                :key="`n${n.id}`"
                :x1="n.x - 0.5"
                :y1="n.y"
                :x2="n.x + 0.5"
                :y2="n.y"
                class="hit node"
                :data-node-id="n.id"
                :data-label="n.id"
                @mousemove="plotNodeHover($event, n.id)"
                @mouseleave="hideTooltip()"
                @pointerdown="plotNodePress($event, n.id)"
                @pointerup="onNodeClick"
              />
            </g>
          </g>
          <SVGSolveIssues v-if="!isZooming" :scale="scale" :show-incomplete="modelHasLoads" :hold="holdFreeMotion" />
          <g>
            <SVGDimensioning
              v-for="dim in normalizedDimensions"
              :key="getDimensionId(dim)"
              :points="getDimensionRenderableNodes(dim)!"
              :distance="dim.distance"
              :scale="scale"
              :font-size="viewerStore.fontSize"
              :number-format="appStore.numberFormatter"
              :convert-length="appStore.convertLength"
              :selected="projectStore.selection2.dimensions.includes(getDimensionId(dim))"
              :show-points="projectStore.selection2.dimensions.includes(getDimensionId(dim))"
              @dimensionpointerdown="onDimensionPointerDown($event, getDimensionId(dim))"
              @dimensionpointerup="onDimensionPointerUp($event, getDimensionId(dim))"
              @dimensionpointpointerdown="onDimensionPointPointerDown($event.event, getDimensionId(dim), $event.index)"
              @dimensionpointpointerup="onDimensionPointPointerUp($event.event, getDimensionId(dim))"
            />
            <SVGDimensioning
              v-if="previewDimensionPoints"
              key="add-dimline"
              :points="previewDimensionPoints"
              :distance="previewDimensionDistance"
              :scale="scale"
              :font-size="viewerStore.fontSize"
              :number-format="appStore.numberFormatter"
              :convert-length="appStore.convertLength"
              :show-points="true"
              :interactive="false"
            />
          </g>
          <!-- Currently hovered; drawn by its own component so the hover leaves the scene alone. -->
          <HoveredElement
            v-if="!plotMode"
            :scale="scale"
            :is-zooming="isZooming"
            :result-label-mode="resolvedResultLabelMode"
            :diagram-style="viewerStore.diagramStyle"
          />
          <!-- Paste preview -->
          <g v-if="appStore.mouseMode === MouseMode.PASTE_CLIPBOARD" ref="pasteLayer">
            <PlotPastePreview v-if="plotMode" :scale="scale" />
            <g v-if="!plotMode">
              <SVGElement
                v-for="(element, index) in pastePreviewBeams"
                :key="`element-${index}`"
                :element="element"
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
                :result-label-mode="resolvedResultLabelMode"
                :diagram-style="viewerStore.diagramStyle"
                :convert-force="appStore.convertForce"
                :convert-moment="appStore.convertMoment"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
              />
            </g>
            <g v-if="!plotMode" class="nodes">
              <SVGNode
                v-for="(node, index) in useClipboardStore().nodes"
                :key="`node-${index}`"
                :node="projectStore.solver.domain.nodes.get(node) as Node"
                :scale="scale"
                :show-label="false"
                :show-supports="viewerStore.showSupports"
                :show-deformed-shape="false"
                :show-reactions="false"
                :convert-force="appStore.convertForce"
                :convert-moment="appStore.convertMoment"
                :load-case="projectStore.solver.loadCases[0]"
                :multiplier="projectStore.defoScale * viewerStore.resultsScalePx_"
                :font-size="viewerStore.fontSize"
                :number-format="appStore.numberFormatter"
              />
            </g>
          </g>
          <ToolPreview :scale="scale" :tool="previewTool" :support="toolSupport" :loads="[toolLoad]" />
          <!-- A load being dragged, where it would be dropped -->
          <ToolPreview
            v-if="draggedLoad"
            :scale="scale"
            tool="load"
            :support="toolSupport"
            :loads="draggedLoad.loads"
          />
          <!-- What the point being put down has snapped to -->
          <SnapMark :scale="scale" />
        </g>
        <!-- The window being picked for an image export; on top of everything, in model units. -->
        <WindowPickRect />
      </svg>
    </SvgPanZoom>

    <SelectionBox />

    <FirstBeamTask
      v-if="appStore.firstBeamActive && !appStore.inViewerMode"
      @drawn="if (appStore.mouseMode === MouseMode.ADD_ELEMENT) cancelActiveMode();"
    />

    <div
      v-if="projectStore.selection.type !== null"
      ref="selectionPanel"
      class="selection-tooltip elevation-1"
      :style="`position: absolute; left: ${projectStore.selection.x}px; top: ${projectStore.selection.y}px;`"
    >
      <!-- Aligned with the list rows below it, and no taller than the close button needs. -->
      <div class="d-flex justify-space-between align-center pr-1 py-1">
        <div class="font-weight-medium text-body-2 px-4">
          {{ selectionTitle }}
          <span v-if="['node', 'element'].includes(projectStore.selection.type)">{{
            projectStore.selection.label
          }}</span>
        </div>
        <v-btn
          variant="text"
          icon="mdi-close"
          size="x-small"
          density="comfortable"
          @click="projectStore.selection.type = null"
        />
      </div>
      <!-- What a mouse reads from the hover tooltip, and the only way to it on a touch screen. -->
      <div v-if="selectionDetails" class="selection-details text-body-2 px-4 pb-2 pt-1">
        <div v-if="selectionDetails.subtitle" class="font-weight-medium">{{ selectionDetails.subtitle }}</div>
        <div v-if="selectionDetails.body" v-html="selectionDetails.body"></div>
      </div>
      <div>
        <ContextMenuNode v-if="projectStore.selection.type === 'node'"></ContextMenuNode>
        <ContextMenuElement v-if="projectStore.selection.type === 'element'"></ContextMenuElement>
        <ContextMenuElementLoad v-if="projectStore.selection.type === 'element-load'"></ContextMenuElementLoad>
        <ContextMenuNodalLoad
          v-if="['nodal-load', 'prescribedbc-load'].includes(projectStore.selection.type)"
        ></ContextMenuNodalLoad>
        <ContextMenuDimension v-if="projectStore.selection.type === 'dimension'"></ContextMenuDimension>
        <!-- <ContextMenuNodalLoad v-if="projectStore.selection.type === 'nodal-load'"></ContextMenuNodalLoad>
        <ContextMenuElementLoad v-if="projectStore.selection.type === 'element-load'"></ContextMenuElementLoad> -->
      </div>
    </div>

    <div v-if="viewerStore.settingsOpen" class="display-options">
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
            :label="`V${appStore.axes.v} (x)`"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label
              >V<sub>{{ appStore.axes.v }}</sub
              >&nbsp;(x)</template
            >
          </v-checkbox>
          <v-checkbox
            v-model="useViewerStore().showBendingMoment"
            :label="`M${appStore.axes.r} (x)`"
            hide-details
            density="compact"
            class="inline-checkbox mr-2 flex-shrink-0 text-no-wrap"
            :disabled="useProjectStore().model === 'EigenValueDynamicSolver'"
          >
            <template #label
              >M<sub>{{ appStore.axes.r }}</sub
              >&nbsp;(x)</template
            >
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
      <div class="text-right text-sm-body-2 d-flex align-center justify-end display-options-links">
        <HelpTip topic="diagrams" location="bottom end" />
        <button class="text-decoration-underline bg-white" @click="appStore.openSettings('appearance')">
          {{ $t('sideSettings.more_settings') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* A long press opens the drawing's menu; iOS would otherwise also pop up its own callout over it. */
.svg-viewer {
  -webkit-touch-callout: none;
}

/*
 * The display options float over the top of the viewer, where the model's messages sit too.
 * Only the panels themselves take the pointer; the gaps around them, which on a phone fall
 * right across the messages, let taps through to what is underneath.
 */
.display-options {
  position: absolute;
  right: 24px;
  top: 64px;
  z-index: 600;
  pointer-events: none;
}

.display-options #viewerSettings > *,
.display-options-links > * {
  pointer-events: auto;
}

/*
 * The plain variant reserves 8px above the text for a floating label this field does not use,
 * which drops the angle below the Dx/Dz/Ry labels sitting next to it in the banner.
 */
.add-node-angle :deep(.v-field__input),
.add-node-angle :deep(.v-text-field__prefix),
.add-node-angle :deep(.v-text-field__suffix) {
  padding-top: 0;
}

/* Keeps the number against its degree sign rather than adrift in the middle of the field. */
.add-node-angle :deep(input) {
  text-align: right;
}

/* Toggled from the script when an element is hovered; see the watch on `intersected`. */
.elements-layer.dimmed {
  opacity: 0.5 !important;
}

.disablePointerEvents {
  pointer-events: none;
}

/* The read only properties sit above the actions the panel offers, divided from them. */
.selection-details {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
  line-height: 1.5;
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

    use {
      stroke: v-bind('viewerStore.colors.loads');
    }

    use:hover {
      stroke-width: 3px; /* affects the referenced element */
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
        stroke-width: 20px;
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

      use {
        stroke-width: 3px; /* affects the referenced element */
        stroke: rgb(0, 94, 255);
      }
    }
  }

  .element.element-1d {
    polyline {
      fill: none;
      stroke: black;
      stroke-width: 2px;

      // Narrower than the other handles: it lies above the diagrams, and the band it covers is
      // taken from hovering the diagram along the member.
      &.handle {
        cursor: pointer;
        stroke-width: 16px;
        stroke: transparent;
      }

      &.decoration {
        stroke-width: 1px;
      }
    }

    // The copy HoveredElement draws on top; the element's own group never has the pointer, as its
    // hit stroke lies in a layer above the diagrams.
    &.hovered {
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
    // Hatch lines across the member, drawn like the outline but lighter.
    .normal path.hatch {
      stroke: v-bind('viewerStore.colors.normalForce');
      stroke-width: 1px;
      stroke-opacity: 0.55;
      fill: none;
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
    // Hatch lines across the member, drawn like the outline but lighter.
    .shear path.hatch {
      stroke: v-bind('viewerStore.colors.shearForce');
      stroke-width: 1px;
      stroke-opacity: 0.55;
      fill: none;
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
    // Hatch lines across the member, drawn like the outline but lighter.
    .moment path.hatch {
      stroke: v-bind('viewerStore.colors.bendingMoment');
      stroke-width: 1px;
      stroke-opacity: 0.55;
      fill: none;
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

      &.decoration.rotation.cw {
        marker-end: var(--marker-rotation-cw);
      }

      &.decoration.rotation.ccw {
        marker-end: var(--marker-rotation-ccw);
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

    &:hover polyline.decoration.rotation.cw {
      marker-end: var(--marker-rotation-cw-hover);
    }

    &:hover polyline.decoration.rotation.ccw {
      marker-end: var(--marker-rotation-ccw-hover);
    }

    /* The prescribed translation is a real line, so it gets the highlight the arrow markers give. */
    &:hover polyline.decoration.marker-forceTip {
      marker-end: var(--marker-force-tip-hover);
      stroke-width: 2px;
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

    &.selected polyline.decoration.rotation.cw {
      marker-end: var(--marker-rotation-cw-selected);
    }

    &.selected polyline.decoration.rotation.ccw {
      marker-end: var(--marker-rotation-ccw-selected);
    }

    &.selected polyline.decoration.marker-forceTip {
      marker-end: var(--marker-force-tip-selected);
      stroke: rgb(0, 55, 149);
      stroke-width: 2px;
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

  .marker-dot-moving-x {
    marker-start: var(--marker-dot-moving-x);
  }

  .marker-dot-torsion {
    marker-start: var(--marker-dot-torsion);
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

/* Fingers are blunter than cursors: widen the invisible hit strokes and the floating controls. */
@media (pointer: coarse) {
  .svg-viewer :deep(*) {
    .element-load.load-1d polygon.handle,
    .element-load.load-1d path.handle,
    .node polyline.handle,
    .nodal-load polyline.handle {
      stroke-width: 32px;
    }

    .element.element-1d polyline.handle {
      stroke-width: 26px;
    }

    .nodal-load polyline.handle.moment {
      stroke-width: 44px;
    }
  }

  /* size="32" lands as an inline style, so only !important can grow it. */
  #undoRedo .v-btn,
  #toolRail .v-btn,
  #viewerControls .v-btn {
    width: 40px !important;
    height: 40px !important;
  }
}
</style>

<style lang="scss">
/*
 * PROTOTYPE: with the plot drawing on, the editor's own picture stays in place for the pointer but
 * is not seen.
 */
/* Under undo and redo, on their left edge */
.tool-rail {
  position: absolute;
  top: 64px;
  left: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 4px;
}

/* A load can be picked up and dragged, in either renderer; held while it is */
.svg-viewer :is(.element-load, .nodal-load) .handle {
  cursor: grab;
}

.load-dragging,
.load-dragging * {
  cursor: grabbing !important;
}

/* Undo and redo are 40 px for a finger (see the coarse pointer rules above) */
@media (pointer: coarse) {
  .tool-rail {
    top: 72px;
  }
}

/* A long press opens a flyout: not the browser's own callout, text selection or double tap zoom */
.tool-rail .v-btn {
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* A tool with kinds of its own: a small triangle in the corner, as drawing programs mark a flyout */
.tool-rail .flyout-mark {
  position: absolute;
  right: 4px;
  bottom: 4px;
  border-left: 5px solid transparent;
  border-bottom: 5px solid currentColor;
  opacity: 0.7;
  pointer-events: none;
}

/* The load tool's values, in the mode banner */
/* Room for a value of a few digits between its symbol and a unit as long as kN/m */
.tool-value {
  width: 116px;
}

/*
 * The mode banner's fields as small filled boxes: plain text on the banner read as a label and
 * gave nothing to aim at. A tint, not an outline, so the banner stays one quiet strip.
 */
#addModeBanner .v-field {
  min-height: 30px;
  padding: 0 8px;
  border-radius: 6px;
  background: rgba(var(--v-theme-on-surface), 0.06);
  transition: background-color 0.12s;

  &:hover {
    background: rgba(var(--v-theme-on-surface), 0.09);
  }

  &.v-field--focused {
    background: rgba(var(--v-theme-primary), 0.08);
    box-shadow: inset 0 -2px 0 rgb(var(--v-theme-primary));
  }

  .v-field__input,
  .v-text-field__prefix,
  .v-text-field__suffix {
    min-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    align-items: center;
  }
}

.plot-hits {
  .hit {
    fill: transparent;
    stroke: transparent;
    stroke-linecap: round;
    pointer-events: stroke;
  }
  // A load can be picked up and dragged (see the load drag in the script); a prescribed
  // displacement belongs to its support and stays
  .load-hits .hit:is([data-e^='nodalLoad:'], [data-e^='elementLoad:']) {
    cursor: grab;
  }
  // A band is hit anywhere inside, not only along its arrows
  .hit.area {
    pointer-events: all;
  }
  .hit.member {
    cursor: pointer;
    stroke-width: 16px;
  }
  .hit.node {
    cursor: pointer;
    stroke-width: 24px;
  }
  // A label is hit over its letters' boxes
  .hit.label {
    pointer-events: all;
  }
  &.coarse .hit.member {
    stroke-width: 26px;
  }
  &.coarse .hit.node {
    stroke-width: 32px;
  }
}

// The tooltip only shows values: with the plot drawing, it never takes the pointer from what is
// under it, so the hit targets always know where the pointer is
.tooltip.plot-mode {
  pointer-events: none;
}

.tooltip.plot-reading {
  visibility: hidden;
}
</style>
