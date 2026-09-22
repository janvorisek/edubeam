<template>
  <v-dialog v-model="open" max-width="820" scrollable>
    <v-card class="pa-1" max-height="90vh">
      <v-card-title class="py-2">
        <div class="d-flex align-center">
          <div class="flex-grow-1">{{ $t('exportImage.title') }}</div>
          <!-- The how-it-works note lives here rather than as a paragraph: the dialog is
               tall already, and the note is read once. -->
          <v-tooltip location="bottom" max-width="420" :text="$t('exportImage.instructions')">
            <template #activator="{ props: tip }">
              <v-icon v-bind="tip" size="18" icon="mdi-information-outline" class="text-medium-emphasis mr-1" />
            </template>
          </v-tooltip>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            class="ml-1"
            :aria-label="$t('dialogs.common.cancel')"
            @click.prevent.stop="closeModal()"
          />
        </div>
      </v-card-title>

      <v-card-text class="pt-0">
        <!--
          What the picture shows, right above the picture. The same two groups as the
          viewer's quick settings, as chips: results first, each in the colour it is
          drawn in, then the drawing itself.
        -->
        <div class="layers mb-1">
          <v-chip-group v-model="resultsOn" multiple class="layers__group">
            <v-chip
              v-for="chip in resultChips"
              :key="chip.key"
              :value="chip.key"
              size="small"
              :color="chip.color"
              :variant="layers[chip.key] ? 'flat' : 'tonal'"
              :disabled="chip.results && dynamic"
            >
              <span class="layers__mark" :class="{ 'layers__mark--on': layers[chip.key] }" />
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="chip.label" />
            </v-chip>
          </v-chip-group>
          <v-chip-group v-model="drawingOn" multiple class="layers__group">
            <v-chip
              v-for="chip in drawingChips"
              :key="chip.key"
              :value="chip.key"
              size="small"
              color="primary"
              :variant="layers[chip.key] ? 'flat' : 'tonal'"
              :disabled="chip.key === 'showLoads' && dynamic"
            >
              <span class="layers__mark" :class="{ 'layers__mark--on': layers[chip.key] }" />
              {{ chip.label }}
            </v-chip>
          </v-chip-group>
        </div>

        <!-- The fit could not honour every layer at this size: say so, and offer the two remedies. -->
        <v-alert v-if="fitOverflow" type="warning" variant="tonal" density="compact" class="mb-2 fit-warning">
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="text-body-2">{{ $t('exportImage.doesNotFit', { px: overflowPx, diagrams: diagramPx }) }}</span>
            <v-spacer />
            <v-btn size="small" variant="outlined" :loading="busy" @click="shrinkDiagrams">
              {{ $t('exportImage.shrinkDiagrams') }}
            </v-btn>
            <v-btn size="small" variant="outlined" :loading="busy" @click="enlargeCanvas">
              {{ $t('exportImage.enlargeCanvas') }}
            </v-btn>
          </div>
        </v-alert>

        <!-- The badge sits outside the scrolling stage so it stays put at 1:1. -->
        <div class="stage-wrap">
          <div ref="stage" class="stage">
            <div class="frame" :class="{ 'frame--checkered': transparent }" :style="frameStyle">
              <img
                v-if="previewUrl"
                :src="previewUrl"
                class="frame__image"
                :class="{ 'frame__image--panning': panning }"
                :style="imageStyle"
                :alt="$t('exportImage.previewAlt')"
                draggable="false"
                @pointerdown="startPan"
                @wheel.prevent="onWheel"
                @load="onPreviewLoaded"
                @contextmenu.prevent
              />
              <!-- Pull an edge to reveal or retract that side of the window; see `startEdgeDrag`. -->
              <template v-if="previewUrl">
                <div
                  v-for="edge in EDGES"
                  :key="edge"
                  class="edge"
                  :class="`edge--${edge}`"
                  :title="$t('exportImage.dragEdge')"
                  @pointerdown="startEdgeDrag($event, edge)"
                />
              </template>
              <div v-else-if="failed" class="text-body-2 text-error pa-4 text-center">
                {{ $t('exportImage.failed') }}
              </div>
              <v-progress-circular v-else indeterminate size="28" color="primary" />
            </div>
          </div>
          <div class="stage-badge">
            <span class="text-caption text-medium-emphasis">
              {{ $t('exportImage.preview') }} {{ Math.round(previewZoom * 100) }}%
            </span>
            <v-btn v-if="previewOverflows" size="x-small" variant="text" @click="fitPreview = !fitPreview">
              {{ fitPreview ? $t('exportImage.actualSize') : $t('exportImage.fitPreview') }}
            </v-btn>
          </div>
        </div>

        <div class="d-flex flex-wrap align-center ga-2 mt-2 mb-4">
          <v-chip
            v-for="option in ratioOptions"
            :key="option.label"
            :variant="activeRatio === option.label ? 'flat' : 'outlined'"
            :color="activeRatio === option.label ? 'primary' : undefined"
            size="small"
            @click="applyRatio(option)"
          >
            {{ option.label }}
          </v-chip>
          <v-spacer />
          <!-- What the file frames: everything drawn, or a window dragged on the main drawing. -->
          <v-chip
            size="small"
            prepend-icon="mdi-fit-to-screen-outline"
            :variant="plotArea === 'fit' ? 'flat' : 'outlined'"
            :color="plotArea === 'fit' ? 'primary' : undefined"
            @click="plotArea = 'fit'"
          >
            {{ $t('exportImage.fitAll') }}
          </v-chip>
          <v-chip
            size="small"
            prepend-icon="mdi-select-drag"
            :variant="plotArea === 'window' ? 'flat' : 'outlined'"
            :color="plotArea === 'window' ? 'primary' : undefined"
            @click="pickWindow"
          >
            {{ $t('exportImage.window') }}
          </v-chip>
        </div>

        <div class="sizes">
          <v-text-field
            v-model="widthText"
            :label="$t('exportImage.width')"
            type="number"
            density="compact"
            variant="outlined"
            hide-details
            suffix="px"
            @blur="commitWidth"
            @keyup.enter="commitWidth"
          />
          <v-btn
            :icon="linkAspect ? 'mdi-link-variant' : 'mdi-link-variant-off'"
            :color="linkAspect ? 'primary' : undefined"
            variant="text"
            density="comfortable"
            :aria-label="$t('exportImage.lockAspect')"
            @click="linkAspect = !linkAspect"
          />
          <v-text-field
            v-model="heightText"
            :label="$t('exportImage.height')"
            type="number"
            density="compact"
            variant="outlined"
            hide-details
            suffix="px"
            @blur="commitHeight"
            @keyup.enter="commitHeight"
          />
          <!-- Pixels per model unit, spoken as a drawing scale at the CSS pixel's 96 DPI. -->
          <v-text-field
            v-model="scaleText"
            :label="$t('exportImage.scale')"
            prefix="1 :"
            type="number"
            density="compact"
            variant="outlined"
            hide-details
            @focus="scaleEditing = true"
            @blur="commitScale"
            @keyup.enter="commitScale"
          />
        </div>
        <div class="text-caption text-medium-emphasis mt-1">{{ scaleCaption }}</div>

        <div class="d-flex align-center justify-space-between flex-wrap">
          <v-switch
            v-model="transparent"
            :label="$t('exportImage.transparentBackground')"
            color="primary"
            density="compact"
            hide-details
            class="switch"
          />
          <v-text-field
            v-model="diagramText"
            :label="$t('exportImage.diagramHeight')"
            type="number"
            :min="MIN_DIAGRAM_PX"
            :max="MAX_DIAGRAM_PX"
            density="compact"
            variant="outlined"
            hide-details
            suffix="px"
            class="diagram-height"
            @blur="commitDiagram"
            @keyup.enter="commitDiagram"
          />
        </div>
      </v-card-text>

      <v-divider />
      <v-card-actions class="d-flex flex-wrap align-center">
        <v-btn variant="tonal" prepend-icon="mdi-download" :loading="busy" @click="save">
          {{ $t('exportImage.download') }}
        </v-btn>
        <v-btn variant="tonal" prepend-icon="mdi-vector-square" :loading="busy" @click="saveVector">
          {{ $t('exportImage.downloadSvg') }}
        </v-btn>
        <v-btn v-if="canCopy" variant="text" prepend-icon="mdi-content-copy" :loading="busy" @click="copy">
          {{ $t('exportImage.copyToClipboard') }}
        </v-btn>
        <v-spacer />
        <span class="text-caption text-medium-emphasis mr-2">
          {{ fileWidth }} × {{ fileHeight }} px · {{ physicalSize }}
        </span>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="feedbackVisible" :color="feedbackType === 'error' ? 'error' : 'primary'" timeout="2600">
      {{ $t(feedbackMessage) }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { useI18n } from 'vue-i18n';
import SVGElementViewer from '../SVGElementViewer.vue';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { useAppStore } from '@/store/app';
import { debounce } from '@/utils/debounce';
import type { ViewBox } from '@/utils/fitBounds';
import { MouseMode } from '@/mouse';
import {
  canCopyImageToClipboard,
  clampExportSide,
  minimumExportSide,
  copyBlobToClipboard,
  downloadBlob,
  createExportRenderer,
  type Overflow,
} from '@/utils/exportImage';

const projectStore = useProjectStore();
const viewerStore = useViewerStore();
const appStore = useAppStore();

const open = ref(true);
const transparent = ref(false);
const linkAspect = ref(true);
const busy = ref(false);
const failed = ref(false);
const previewUrl = ref('');

const feedbackVisible = ref(false);
const feedbackType = ref<'success' | 'error'>('success');
const feedbackMessage = ref('exportImage.copied');

const canCopy = canCopyImageToClipboard();

/**
 * What the picture shows, chosen here rather than read live from the viewer.
 *
 * It starts as a copy of the viewer's own quick settings, so the export opens looking
 * like the editor, but it is a copy: ticking "M(x)" off for a figure must not switch it
 * off in the editor behind the dialog, and the editor changing must not re-frame an
 * export the user has already set up. The dialog is short-lived, so nothing has to be
 * kept in sync.
 */
const layers = reactive({
  showSupports: viewerStore.showSupports,
  showLoads: viewerStore.showLoads,
  showNodeLabels: viewerStore.showNodeLabels,
  showElementLabels: viewerStore.showElementLabels,
  showDeformedShape: viewerStore.showDeformedShape,
  showNormalForce: viewerStore.showNormalForce,
  showShearForce: viewerStore.showShearForce,
  showBendingMoment: viewerStore.showBendingMoment,
  showReactions: viewerStore.showReactions,
});

/** An eigenvalue run has no loads or internal forces to draw; the viewer greys those out too. */
const dynamic = computed(() => projectStore.model === 'EigenValueDynamicSolver');

/**
 * Height of the result diagrams in this export, in pixels.
 *
 * Starts as the editor's value and, like the layers, is a copy: diagrams are fixed
 * pixel sizes, and on a small canvas the editor's height can be more than the canvas
 * can hold — the one thing there is to reduce when the drawing does not fit.
 */
const diagramPx = ref(viewerStore.resultsScalePx_);

/**
 * Below 8 px a diagram is a smudge; above 400 it is bigger than most canvases. The
 * editor's own slider stops at 120, but an export canvas can be far larger than a
 * screen, so the ceiling is looser here.
 */
const MIN_DIAGRAM_PX = 8;
const MAX_DIAGRAM_PX = 400;

const clampDiagram = (value: number) =>
  Math.min(MAX_DIAGRAM_PX, Math.max(MIN_DIAGRAM_PX, Math.round(Number.isFinite(value) ? value : MIN_DIAGRAM_PX)));

// Same as the size fields: text while typing, interpreted and clamped on blur or Enter.
const diagramText = ref(String(diagramPx.value));

watch(diagramPx, (value) => (diagramText.value = String(value)));

const commitDiagram = () => {
  const entered = Number(diagramText.value);

  if (!Number.isFinite(entered) || entered <= 0) return (diagramText.value = String(diagramPx.value));

  diagramPx.value = clampDiagram(entered);
  diagramText.value = String(diagramPx.value);
};

/**
 * Set after every fit: how far the full drawing runs past the canvas, or `null` when it
 * fits. The fit is measured with every layer on, so this warns before a layer that
 * would not fit is even switched on.
 */
const fitOverflow = ref<Overflow | null>(null);

const overflowPx = computed(() => {
  const o = fitOverflow.value;

  return o ? Math.max(o.left + o.right, o.top + o.bottom) : 0;
});

type LayerKey = keyof typeof layers;

const { t } = useI18n();

/**
 * The result chips wear the colour their diagram is drawn in, so a glance at the row says
 * what the red and green in the preview are. Labels carry the subscripts the viewer uses.
 */
const resultChips = computed<{ key: LayerKey; label: string; color: string; results: boolean }[]>(() => [
  {
    key: 'showDeformedShape',
    label: t('sideSettings.showDeformedShape'),
    color: viewerStore.colors.deformedShape,
    results: false,
  },
  { key: 'showNormalForce', label: 'N&nbsp;(x)', color: viewerStore.colors.normalForce, results: true },
  { key: 'showShearForce', label: 'V<sub>z</sub>&nbsp;(x)', color: viewerStore.colors.shearForce, results: true },
  { key: 'showBendingMoment', label: 'M<sub>y</sub>&nbsp;(x)', color: viewerStore.colors.bendingMoment, results: true },
  { key: 'showReactions', label: t('sideSettings.showReactions'), color: viewerStore.colors.reactions, results: false },
]);

const drawingChips = computed<{ key: LayerKey; label: string }[]>(() => [
  { key: 'showSupports', label: t('sideSettings.supports') },
  { key: 'showLoads', label: t('sideSettings.loads') },
  { key: 'showNodeLabels', label: t('sideSettings.nodeLabels') },
  { key: 'showElementLabels', label: t('sideSettings.elementLabels') },
]);

/**
 * A chip group wants its selection as an array of values; the layers are booleans. This
 * bridges the two so the group can be the control and `layers` stays the single source.
 */
const selectionOf = (keys: () => LayerKey[]) =>
  computed<LayerKey[]>({
    get: () => keys().filter((key) => layers[key]),
    set: (on) => keys().forEach((key) => (layers[key] = on.includes(key))),
  });

const resultsOn = selectionOf(() => resultChips.value.map((chip) => chip.key));
const drawingOn = selectionOf(() => drawingChips.value.map((chip) => chip.key));

/**
 * The picture is drawn by a fresh viewer at the chosen canvas size, so the size choice
 * is a real layout decision rather than a zoom: pick a wider canvas and the structure
 * gets more room, not bigger lines. Keeping one size across exports also puts the
 * structure in the same place every time, which is what lets an M, N and V figure stack.
 */
/**
 * Room the decorations need, and the smallest canvas that leaves the structure anything.
 *
 * Both come from the viewer's current settings rather than a fixed number, so raising
 * the font size or the result diagram height raises the minimum with them.
 */
const EXPORT_MARGIN_PX = 8;

const minSide = computed(() => minimumExportSide(EXPORT_MARGIN_PX));

/** Visible preview area in the dialog. */
const STAGE_WIDTH = 660;
const STAGE_HEIGHT = 250;

/** Room for the diagrams and labels at their editor sizes, and still document-sized. */
const DEFAULT_SIZE = 512;

const width = ref(Math.max(DEFAULT_SIZE, minimumExportSide(EXPORT_MARGIN_PX)));
const height = ref(width.value);

const ratioOptions = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '1:1', value: 1 },
];

const activeRatio = computed(() => {
  const current = width.value / height.value;

  return ratioOptions.find((option) => Math.abs(option.value - current) < 0.01)?.label ?? '';
});

const applyRatio = (option: { value: number }) => {
  // Grow the long side rather than shrinking the short one below what fits.
  height.value = clampExportSide(width.value / option.value, minSide.value);
  width.value = clampExportSide(height.value * option.value, minSide.value);
};

/**
 * The fields hold text until the edit is finished.
 *
 * Clamping on every keystroke turns typing "512" into 5 → 64 → 640, so the value is
 * only interpreted on blur or Enter.
 */
const widthText = ref(String(width.value));
const heightText = ref(String(height.value));

watch(width, (value) => (widthText.value = String(value)));
watch(height, (value) => (heightText.value = String(value)));

const commitWidth = () => {
  const entered = Number(widthText.value);

  if (!Number.isFinite(entered) || entered <= 0) return (widthText.value = String(width.value));

  const ratio = width.value / height.value;

  width.value = clampExportSide(entered, minSide.value);
  if (linkAspect.value) height.value = clampExportSide(width.value / ratio, minSide.value);
  widthText.value = String(width.value);
};

const commitHeight = () => {
  const entered = Number(heightText.value);

  if (!Number.isFinite(entered) || entered <= 0) return (heightText.value = String(height.value));

  const ratio = width.value / height.value;

  height.value = clampExportSide(entered, minSide.value);
  if (linkAspect.value) width.value = clampExportSide(height.value * ratio, minSide.value);
  heightText.value = String(height.value);
};

/** Dimension lines carry plain points; the viewer draws node-shaped anchors. */
const dimensionLines = computed(() =>
  projectStore.dimensions.map((dimension) => ({
    points: dimension.points.map((point) => ({ coords: [point.x, 0, point.y] as [number, number, number] })),
    distance: dimension.distance,
    numberFormat: appStore.numberFormatter,
    convertLength: appStore.convertLength,
  }))
);

/** Everything the throwaway viewer needs to draw the model exactly as the editor does. */
const viewerProps = computed(() => ({
  id: 'export',
  solver: projectStore.solver,
  nodes: projectStore.nodes,
  elements: projectStore.beams,
  nodalLoads: layers.showLoads ? projectStore.solver.loadCases[0].nodalLoadList : [],
  elementLoads: layers.showLoads ? projectStore.solver.loadCases[0].elementLoadList : [],
  prescribedDisplacements: layers.showLoads ? projectStore.solver.loadCases[0].prescribedBC : [],
  dimlines: dimensionLines.value,
  showLoads: layers.showLoads,
  showSupports: layers.showSupports,
  showNodeLabels: layers.showNodeLabels,
  showElementLabels: layers.showElementLabels,
  showDeformedShape: layers.showDeformedShape,
  showNormalForce: layers.showNormalForce,
  showShearForce: layers.showShearForce,
  showMoments: layers.showBendingMoment,
  showReactions: layers.showReactions,
  colors: viewerStore.colors,
  supportSize: viewerStore.supportSize,
  fontSize: viewerStore.fontSize,
  resultsScalePx: diagramPx.value,
  resultLabelMode: viewerStore.resultLabelMode,
  convertForce: appStore.convertForce,
  // Distributed loads label themselves through this one, not `convertForce`; leaving it
  // off falls back to the identity and prints raw N/m beside a drawing the app shows in
  // kN/m.
  convertForceDistance: appStore.convertForceDistance,
  convertMoment: appStore.convertMoment,
  convertLength: appStore.convertLength,
  numberFormat: appStore.numberFormatter,
  padding: EXPORT_MARGIN_PX,
  mobilePadding: EXPORT_MARGIN_PX,
  // Everything drawn is measured — labels, arrows and diagrams included, hence no
  // `fitIgnore` and no reserve. The frame is kept stable across toggles differently:
  // the fit is measured with every layer on (see `everything`), so there is nothing a
  // reserve would need to guess at, and only a thin edge is kept.
  fitIgnore: '',
  fitReservePx: 0,
}));

/**
 * One render of the real file, shown either shrunk to the dialog or at 1:1.
 *
 * The zoom is spelled out beside it, because a picture shown at 43% says nothing about
 * how thick a line will really be. Actual size scrolls and is pixel for pixel the file.
 */
const fitPreview = ref(true);

/**
 * Device pixels per CSS pixel on this screen.
 *
 * The width and height are the size the drawing is *laid out* at, in the same units the
 * editor draws in. A HiDPI screen paints each of those as two device pixels, so a 14 px
 * label really occupies 28, and a file containing only the CSS pixels comes out looking
 * half scale next to the app. Rasterizing at this ratio makes the file match the screen;
 * the resulting file size is shown next to the fields so it is not a surprise.
 */
const devicePixels = window.devicePixelRatio || 1;

const fileWidth = computed(() => Math.round(width.value * devicePixels));
const fileHeight = computed(() => Math.round(height.value * devicePixels));

const previewFit = computed(() => Math.min(STAGE_WIDTH / width.value, STAGE_HEIGHT / height.value, 1));
const previewZoom = computed(() => (fitPreview.value ? previewFit.value : 1));
const previewOverflows = computed(() => previewFit.value < 1);

const frameSize = computed(() => ({
  w: Math.round(width.value * previewZoom.value),
  h: Math.round(height.value * previewZoom.value),
}));

const frameStyle = computed(() => ({
  width: `${frameSize.value.w}px`,
  height: `${frameSize.value.h}px`,
  flex: '0 0 auto',
}));

/**
 * What the file frames — AutoCAD's plot area.
 *
 * `fit` is the default: everything drawn, fitted. `window` is a rectangle the user drags
 * on the main drawing: the dialog steps aside, the viewer takes the drag, and the box
 * comes back in model coordinates so it survives a change of canvas size. Its aspect
 * is locked to the canvas's — grown about its centre — so the file shows exactly the
 * rectangle and nothing more, and a change of canvas aspect re-shapes it the same way.
 */
type PlotArea = 'fit' | 'window';

const plotArea = ref<PlotArea>('fit');
const plotWindow = ref<ViewBox | null>(null);

const windowActive = computed(() => plotArea.value === 'window' && plotWindow.value !== null);

/** The window the stage and the file show: the picked one, or none for a fit. */
const stageWindow = computed(() => (windowActive.value ? plotWindow.value : null));

const outputAspect = computed(() => width.value / height.value);

/** Grown, about its centre, to the canvas aspect. */
const shapedToAspect = (box: ViewBox): ViewBox => {
  const aspect = outputAspect.value;

  if (box.w / box.h > aspect) {
    const h = box.w / aspect;

    return { x: box.x, y: box.y + (box.h - h) / 2, w: box.w, h };
  }

  const w = box.h * aspect;

  return { x: box.x + (box.w - w) / 2, y: box.y, w, h: box.h };
};

watch(outputAspect, (aspect) => {
  const box = plotWindow.value;

  // An edge drag changes size and window together and already agree; only a change of
  // aspect from elsewhere (the fields, a ratio chip) needs the window re-shaped.
  if (box && Math.abs(box.w / box.h - aspect) > 1e-9) plotWindow.value = shapedToAspect(box);
});

/**
 * Pulling an edge of the preview reveals or retracts that side of the window.
 *
 * The stage shows exactly the window, so an edge of the frame *is* an edge of the
 * window. Moving it changes that one side: the drawing's scale is kept, so the canvas
 * grows or shrinks by the same number of pixels and nothing else in the picture moves.
 * Everything is computed from the state at the start of the drag, so the frame
 * re-fitting itself under the pointer as the canvas changes cannot feed back into it.
 * From a fit, the first pull turns the fitted view into a window and goes on from there.
 */
type Edge = 'left' | 'right' | 'top' | 'bottom';

const EDGES: Edge[] = ['left', 'right', 'top', 'bottom'];

let edgeDrag: {
  edge: Edge;
  startX: number;
  startY: number;
  box0: ViewBox;
  width0: number;
  height0: number;
  zoom0: number;
} | null = null;

const edgeDragging = ref(false);

/**
 * How the picture behaves while it is being dragged, before the next render exists.
 *
 * Nothing is rendered mid-drag — a render is a layout and a rasterization, and running
 * one per pointer event is exactly the stutter that makes a drag feel broken. Instead
 * the picture already on screen stands in: panning slides it under the pointer, and an
 * edge drag keeps it at its size, anchored to the edge that is *not* moving, so the
 * frame grows or shrinks around it rather than stretching it. The release renders once,
 * and the stand-in is dropped the moment the new picture has loaded.
 */
let pan: { startX: number; startY: number; box0: ViewBox; perUnit: number; zoom0: number } | null = null;

const wheelZoom = ref<{ ox: number; oy: number; factor: number } | null>(null);
const wheeling = ref(false);

const dragFrame = ref<{ anchor: Edge; w: number; h: number } | null>(null);
const panOffset = ref({ x: 0, y: 0 });

const OPPOSITE: Record<Edge, Edge> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' };

const imageStyle = computed(() => {
  const style: Record<string, string> = {};

  if (dragFrame.value) {
    const { anchor, w, h } = dragFrame.value;

    style.position = 'absolute';
    style.width = `${w}px`;
    style.height = `${h}px`;
    style[anchor] = '0';
    style[anchor === 'left' || anchor === 'right' ? 'top' : 'left'] = '0';
  }

  if (panOffset.value.x || panOffset.value.y) {
    style.transform = `translate(${panOffset.value.x}px, ${panOffset.value.y}px)`;
  }

  if (wheelZoom.value) {
    style.transformOrigin = `${wheelZoom.value.ox}px ${wheelZoom.value.oy}px`;
    style.transform = `scale(${wheelZoom.value.factor})`;
  }

  return style;
});

const onPreviewLoaded = () => {
  // A fresh render is on screen; the stand-in geometry has done its job.
  if (!edgeDrag) dragFrame.value = null;
  if (!pan) panOffset.value = { x: 0, y: 0 };
  if (!wheeling.value) wheelZoom.value = null;
};

const onEdgeDrag = (event: PointerEvent) => {
  if (!edgeDrag) return;

  const { edge, box0, width0, height0, zoom0 } = edgeDrag;
  const horizontal = edge === 'left' || edge === 'right';

  // Pointer travel in canvas pixels, signed so that positive means "reveal more".
  const travel = (horizontal ? event.clientX - edgeDrag.startX : event.clientY - edgeDrag.startY) / zoom0;
  const outward = edge === 'right' || edge === 'bottom' ? travel : -travel;

  const side0 = horizontal ? width0 : height0;
  const side = clampExportSide(side0 + outward, minSide.value);
  const grown = side - side0;
  // Canvas pixels per model unit, the same on both axes since the aspect is locked.
  const perUnit = width0 / box0.w;
  const dm = grown / perUnit;

  if (horizontal) {
    width.value = side;
    plotWindow.value = edge === 'left' ? { ...box0, x: box0.x - dm, w: box0.w + dm } : { ...box0, w: box0.w + dm };
  } else {
    height.value = side;
    plotWindow.value = edge === 'top' ? { ...box0, y: box0.y - dm, h: box0.h + dm } : { ...box0, h: box0.h + dm };
  }
};

const endEdgeDrag = () => {
  if (!edgeDrag) return;

  edgeDrag = null;
  edgeDragging.value = false;
  window.removeEventListener('pointermove', onEdgeDrag);
  window.removeEventListener('pointerup', endEdgeDrag);
  refreshPreview();
};

const startEdgeDrag = (event: PointerEvent, edge: Edge) => {
  if (event.button !== 0) return;

  const box0 = stageWindow.value ?? renderer.viewBox();
  if (!box0) return;

  if (!windowActive.value) {
    plotWindow.value = box0;
    plotArea.value = 'window';
  }

  event.preventDefault();
  edgeDrag = {
    edge,
    startX: event.clientX,
    startY: event.clientY,
    box0,
    width0: width.value,
    height0: height.value,
    zoom0: previewZoom.value,
  };
  dragFrame.value = { anchor: OPPOSITE[edge], w: frameSize.value.w, h: frameSize.value.h };
  edgeDragging.value = true;
  window.addEventListener('pointermove', onEdgeDrag);
  window.addEventListener('pointerup', endEdgeDrag);
};

onBeforeUnmount(endEdgeDrag);

/**
 * Dragging the preview pans the window.
 *
 * Any button: the left one because the picture is otherwise inert and a grab is what a
 * picture invites, the middle and right ones because that is how the editor pans. The
 * window moves against the pointer by the same distance in model units, so scale and
 * size are untouched and the drawing follows the hand exactly.
 */
const panning = ref(false);

const onPan = (event: PointerEvent) => {
  if (!pan) return;

  const { startX, startY, box0, perUnit, zoom0 } = pan;
  const sx = event.clientX - startX;
  const sy = event.clientY - startY;

  panOffset.value = { x: sx, y: sy };
  plotWindow.value = { ...box0, x: box0.x - sx / zoom0 / perUnit, y: box0.y - sy / zoom0 / perUnit };
};

const endPan = () => {
  if (!pan) return;

  pan = null;
  panning.value = false;
  window.removeEventListener('pointermove', onPan);
  window.removeEventListener('pointerup', endPan);
  refreshPreview();
};

/**
 * At actual size with the picture larger than the stage, a left drag scrolls the stage
 * — the hand tool every image viewer has — rather than moving the window. Looking and
 * changing are different gestures: the middle and right buttons still move the window,
 * and once the picture fits there is nothing to scroll, so the left button moves it too.
 */
const stage = ref<HTMLElement | null>(null);

let scrollDrag: { startX: number; startY: number; left: number; top: number } | null = null;

const onScrollDrag = (event: PointerEvent) => {
  if (!scrollDrag || !stage.value) return;

  stage.value.scrollLeft = scrollDrag.left - (event.clientX - scrollDrag.startX);
  stage.value.scrollTop = scrollDrag.top - (event.clientY - scrollDrag.startY);
};

const endScrollDrag = () => {
  scrollDrag = null;
  panning.value = false;
  window.removeEventListener('pointermove', onScrollDrag);
  window.removeEventListener('pointerup', endScrollDrag);
};

const startScrollDrag = (event: PointerEvent) => {
  if (!stage.value) return;

  event.preventDefault();
  scrollDrag = {
    startX: event.clientX,
    startY: event.clientY,
    left: stage.value.scrollLeft,
    top: stage.value.scrollTop,
  };
  panning.value = true;
  window.addEventListener('pointermove', onScrollDrag);
  window.addEventListener('pointerup', endScrollDrag);
};

onBeforeUnmount(endScrollDrag);

const startPan = (event: PointerEvent) => {
  if (event.button === 0 && previewOverflows.value && !fitPreview.value) return startScrollDrag(event);

  const box0 = stageWindow.value ?? renderer.viewBox();
  if (!box0) return;

  if (!windowActive.value) {
    plotWindow.value = box0;
    plotArea.value = 'window';
  }

  event.preventDefault();
  pan = {
    startX: event.clientX,
    startY: event.clientY,
    box0,
    perUnit: width.value / box0.w,
    zoom0: previewZoom.value,
  };
  panning.value = true;
  window.addEventListener('pointermove', onPan);
  window.addEventListener('pointerup', endPan);
};

onBeforeUnmount(endPan);

/**
 * The drawing scale.
 *
 * Pixels per model unit is `width / window.w`, and a CSS pixel is 1/96 in — the
 * convention SVG, Word and LaTeX all read the file with — so that number *is* a paper
 * scale: at 1 : 200 a 10 m cantilever is 5 cm on the page. The field shows the scale of
 * whatever the stage shows, fitted or windowed, and setting it resizes the window about
 * its centre so the canvas maps to exactly that many model units. Model units are
 * metres internally, whatever the display unit.
 */
const PX_PER_CM = 96 / 2.54;
const PX_PER_METRE = PX_PER_CM * 100;

/** The model-space box the stage currently shows, refreshed after every render. */
const shownBox = ref<ViewBox | null>(null);

const scaleDenominator = computed(() => (shownBox.value ? PX_PER_METRE / (width.value / shownBox.value.w) : null));

const formatScale = (n: number) => String(n >= 100 ? Math.round(n) : Number(n.toPrecision(3)));

const scaleText = ref('');
const scaleEditing = ref(false);

watch(scaleDenominator, (n) => {
  if (!scaleEditing.value) scaleText.value = n ? formatScale(n) : '';
});

const scaleCaption = computed(() => {
  const n = scaleDenominator.value;
  if (!n) return '';

  const cmPerMetre = 100 / n;
  const cm = cmPerMetre >= 10 ? cmPerMetre.toFixed(0) : cmPerMetre >= 1 ? cmPerMetre.toFixed(1) : cmPerMetre.toFixed(2);

  return t('exportImage.scaleCaption', { cm });
});

const physicalSize = computed(
  () => `${(width.value / PX_PER_CM).toFixed(1)} × ${(height.value / PX_PER_CM).toFixed(1)} cm`
);

const applyScale = (n: number) => {
  const box = stageWindow.value ?? renderer.viewBox();
  if (!box) return;

  const perMetre = PX_PER_METRE / n;
  const w = width.value / perMetre;
  const h = height.value / perMetre;

  plotWindow.value = { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
  plotArea.value = 'window';
};

const commitScale = () => {
  scaleEditing.value = false;

  const n = Number(scaleText.value);

  if (!Number.isFinite(n) || n <= 0) {
    scaleText.value = scaleDenominator.value ? formatScale(scaleDenominator.value) : '';
    return;
  }

  applyScale(n);
};

/**
 * Wheel zoom on the preview, about the pointer.
 *
 * The window shrinks or grows around the point under the cursor, which is what changes
 * the scale while the canvas stays put. As with dragging, nothing renders per event:
 * the picture is scaled about the same point as a stand-in, and the real render runs
 * once the wheel has been quiet for a moment.
 */
let wheelTimer: number | undefined;

const WHEEL_STEP = 1.1;

const onWheel = (event: WheelEvent) => {
  const box0 = stageWindow.value ?? renderer.viewBox();
  if (!box0 || !event.deltaY) return;

  if (!windowActive.value) {
    plotWindow.value = box0;
    plotArea.value = 'window';
  }

  const image = event.currentTarget as HTMLElement;
  const rect = image.getBoundingClientRect();
  const fx = (event.clientX - rect.left) / rect.width;
  const fy = (event.clientY - rect.top) / rect.height;
  const factor = event.deltaY < 0 ? WHEEL_STEP : 1 / WHEEL_STEP;

  const box = plotWindow.value ?? box0;
  const w = box.w / factor;
  const h = box.h / factor;

  plotWindow.value = { x: box.x + fx * (box.w - w), y: box.y + fy * (box.h - h), w, h };

  const previous = wheelZoom.value;

  wheelZoom.value = {
    ox: previous?.ox ?? event.clientX - rect.left,
    oy: previous?.oy ?? event.clientY - rect.top,
    factor: (previous?.factor ?? 1) * factor,
  };

  wheeling.value = true;
  window.clearTimeout(wheelTimer);
  wheelTimer = window.setTimeout(() => {
    wheeling.value = false;
    refreshPreview();
  }, 150);
};

onBeforeUnmount(() => window.clearTimeout(wheelTimer));

/**
 * Hands the drawing over to the user for a rectangle.
 *
 * The dialog hides rather than closes, so everything set in it — size, layers, the
 * previous window — is still here when it comes back. Escape or the cancel button in
 * the viewer resolves `null`, and whatever was framed before stays framed.
 */
const pickWindow = async () => {
  open.value = false;

  // Clear the deck: the navigation drawer this dialog was opened from is still open
  // underneath, and its scrim would sit over the drawing; the quick-settings panel
  // covers a corner of it. Neither is wanted while the user is choosing a rectangle.
  appStore.drawerOpen = false;
  const settingsWereOpen = viewerStore.settingsOpen;
  viewerStore.settingsOpen = false;

  appStore.mouseMode = MouseMode.PICK_WINDOW;

  try {
    const box = await viewerStore.pickWindow();

    if (box) {
      plotWindow.value = shapedToAspect(box);
      plotArea.value = 'window';
    }
  } finally {
    viewerStore.settingsOpen = settingsWereOpen;
    open.value = true;
  }
};

const notify = (message: string, type: 'success' | 'error' = 'success') => {
  feedbackMessage.value = message;
  feedbackType.value = type;
  feedbackVisible.value = true;
};

const releasePreview = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = '';
};

let previewToken = 0;

/**
 * The preview is the export, drawn smaller.
 *
 * The layout is done at the real canvas size — decorations are laid out for whatever
 * canvas they are given, so previewing a different size would show different
 * proportions — and only the raster is scaled down. Letting CSS shrink a full size
 * bitmap instead would resample it and misrepresent how crisp the file is.
 */
/** Mounted once for the dialog; every preview and export is a re-layout of it. */
const renderer = createExportRenderer(SVGElementViewer);

/**
 * The same drawing with every layer on — what a fit is measured against.
 *
 * Fitting only what is shown makes the structure jump whenever a layer is toggled: a
 * moment diagram switched on needs room, so the structure shrinks to make it. Fitting
 * with everything on, and then showing only the chosen layers in that view, gives one
 * frame for every combination — the M, N and V figures line up, and toggling a layer
 * changes nothing but the layer. The room the hidden layers would have taken stays
 * empty, which is the price of the frame not moving.
 */
const everything = computed(() => {
  const loadCase = projectStore.solver.loadCases[0];
  const results = !dynamic.value;

  return {
    ...viewerProps.value,
    nodalLoads: loadCase.nodalLoadList,
    elementLoads: loadCase.elementLoadList,
    prescribedDisplacements: loadCase.prescribedBC,
    showLoads: !dynamic.value,
    showSupports: true,
    showNodeLabels: true,
    showElementLabels: true,
    showDeformedShape: true,
    showNormalForce: results,
    showShearForce: results,
    showMoments: results,
    showReactions: true,
  };
});

const layout = (window: ViewBox | null) =>
  renderer.update(viewerProps.value, width.value, height.value, window, window ? null : everything.value);

const refreshPreview = async () => {
  const token = ++previewToken;

  try {
    const info = await layout(stageWindow.value);
    if (token !== previewToken) return;

    shownBox.value = renderer.viewBox();
    fitOverflow.value = stageWindow.value ? null : info.overflow;

    // Rendered at the real export size, then shown smaller by CSS. Rasterizing at the
    // preview's size instead would misrepresent the file: the markers are sized against
    // the canvas they are drawn on, so a reduced render shows small nodes and thin hinge
    // strokes that the exported file does not have.
    const blob = await renderer.png({
      scale: previewZoom.value * devicePixels,
      background: transparent.value ? null : '#ffffff',
    });

    if (token !== previewToken) return;

    releasePreview();
    previewUrl.value = URL.createObjectURL(blob);
    failed.value = false;
  } catch (e) {
    console.error(e);
    if (token === previewToken) failed.value = true;
  }
};

const schedulePreview = debounce(refreshPreview, 150);

watch([width, height, transparent, fitPreview, diagramPx], schedulePreview, { immediate: true });
// A chip click is one discrete change, not a keystroke in a run of them: nothing to
// coalesce, so it renders at once. Overlapping renders are settled by `previewToken`.
// While the picture is being dragged the window changes on every pointer move and the
// picture on screen stands in for the result (see `imageStyle`); the release renders.
watch([layers, stageWindow], () => {
  if (!edgeDragging.value && !panning.value && !wheeling.value) refreshPreview();
});

onBeforeUnmount(() => {
  releasePreview();
  renderer.dispose();
});

const render = async () => {
  await layout(stageWindow.value);

  return renderer.png({ scale: devicePixels, background: transparent.value ? null : '#ffffff' });
};

/**
 * The vector file is sized in layout pixels, not the bitmap's.
 *
 * `devicePixels` only ever existed to give the raster enough dots to match this screen;
 * an SVG has no dots, and multiplying by it here would hand someone with a HiDPI laptop
 * a figure twice the nominal size of the one their colleague exports.
 */
const renderVector = async () => {
  await layout(stageWindow.value);

  return renderer.svg({ background: transparent.value ? null : '#ffffff' });
};

const run = async (action: () => Promise<void>) => {
  busy.value = true;

  try {
    await action();
  } catch (e) {
    console.error(e);
    notify('exportImage.failed', 'error');
  } finally {
    busy.value = false;
  }
};

// Saving leaves the dialog open: exporting M, N and V one after another is the common
// case, and closing would throw away the size, layers and window each time.
/**
 * The two ways out when the drawing does not fit: make the diagrams smaller, or the
 * canvas bigger. Both repeat until the fit reports no overflow, a few rounds at most.
 */
const shrinkDiagrams = () =>
  run(async () => {
    const before = diagramPx.value;

    for (let round = 0; round < 6 && fitOverflow.value && diagramPx.value > MIN_DIAGRAM_PX; round++) {
      diagramPx.value = clampDiagram(diagramPx.value * 0.75);
      await refreshPreview();
    }

    // Diagrams were not what did not fit — loads, reactions and labels are fixed sizes
    // too — so shrinking them bought nothing but a worse picture. Put them back and say so.
    if (fitOverflow.value) {
      diagramPx.value = before;
      await refreshPreview();
      notify('exportImage.shrinkNotEnough', 'error');
    }
  });

const enlargeCanvas = () =>
  run(async () => {
    for (let round = 0; round < 3 && fitOverflow.value; round++) {
      const o = fitOverflow.value;

      width.value = clampExportSide(width.value + o.left + o.right + 8, minSide.value);
      height.value = clampExportSide(height.value + o.top + o.bottom + 8, minSide.value);
      await refreshPreview();
    }
  });

const save = () =>
  run(async () => {
    downloadBlob(await render(), `edubeam-${fileWidth.value}x${fileHeight.value}.png`);
    notify('exportImage.exported');
  });

const saveVector = () =>
  run(async () => {
    downloadBlob(await renderVector(), `edubeam-${width.value}x${height.value}.svg`);
    notify('exportImage.exported');
  });

const copy = () =>
  run(async () => {
    await copyBlobToClipboard(await render());
    notify('exportImage.copied');
  });
</script>

<style scoped>
.stage-wrap {
  position: relative;
}

/* Translucent so it reads over the drawing without hiding a corner of it. */
.stage-badge {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 2px 0 6px;
  border-radius: 4px;
  background: rgb(var(--v-theme-surface), 0.82);
  backdrop-filter: blur(2px);
  pointer-events: auto;
}

.stage {
  display: flex;
  height: 266px;
  padding: 8px;
  overflow: auto;
  background: rgb(var(--v-theme-surface-light, 245, 245, 245));
  border-radius: 4px;
}

.frame {
  /* `margin: auto` centres inside a scroll container without pushing the top and left
     of an overflowing child out of reach, which flex centring does. */
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.18);
}

/* Makes a transparent background visible instead of looking like a white one. */
.frame--checkered {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #e6e6e6 25%, transparent 25%), linear-gradient(-45deg, #e6e6e6 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e6e6e6 75%), linear-gradient(-45deg, transparent 75%, #e6e6e6 75%);
  background-size: 16px 16px;
  background-position:
    0 0,
    0 8px,
    8px -8px,
    -8px 0;
}

.frame__image {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.frame__image--panning {
  cursor: grabbing;
}

.frame {
  position: relative;
}

/* Edge handles: a short pill in the middle of each side of the frame. */
.edge {
  position: absolute;
  background: rgb(var(--v-theme-primary));
  border-radius: 3px;
  opacity: 0.5;
  touch-action: none;
  transition: opacity 0.12s;
}

.edge:hover {
  opacity: 1;
}

.edge--left,
.edge--right {
  top: 50%;
  width: 6px;
  height: 36px;
  margin-top: -18px;
  cursor: ew-resize;
}

.edge--left {
  left: 2px;
}

.edge--right {
  right: 2px;
}

.edge--top,
.edge--bottom {
  left: 50%;
  width: 36px;
  height: 6px;
  margin-left: -18px;
  cursor: ns-resize;
}

.edge--top {
  top: 2px;
}

.edge--bottom {
  bottom: 2px;
}

/* One line, always: what the picture shows must stay above the picture as a single row,
   so the groups never wrap and the chips are cut tighter than Vuetify's default. */
.layers {
  display: flex;
  flex-wrap: nowrap;
  gap: 0 12px;
  overflow-x: auto;
}

.layers__group {
  flex: 0 0 auto;
  flex-wrap: nowrap;
}

.layers__group :deep(.v-chip) {
  margin-right: 4px;
  padding: 0 7px;
}

/* A checkbox in miniature: an outlined square, with a check inside when the layer is on.
   Box and check are both drawn in the chip's text colour, so they read on a tinted chip
   and on a filled one alike, and the box is the same size in both states. */
.layers__mark {
  position: relative;
  display: inline-block;
  width: 11px;
  height: 11px;
  margin-right: 5px;
  flex: 0 0 auto;
  box-sizing: border-box;
  border: 1.5px solid currentColor;
  border-radius: 2px;
}

/* The check: a short-and-tall rectangle showing only its right and bottom edges, turned. */
.layers__mark::after {
  content: '';
  position: absolute;
  left: 2.5px;
  top: 0;
  width: 3px;
  height: 6px;
  border: solid currentColor;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.12s;
}

.layers__mark--on::after {
  opacity: 1;
}

/* Vuetify gives a compact switch generous vertical padding; the row above already spaces it. */
.switch :deep(.v-selection-control) {
  min-height: 32px;
}

.diagram-height {
  flex: 0 0 150px;
}

.fit-warning :deep(.v-alert__content) {
  width: 100%;
}

.sizes {
  display: grid;
  grid-template-columns: 1fr auto 1fr 1fr;
  align-items: center;
  gap: 8px;
}
</style>
