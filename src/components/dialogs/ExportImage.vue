<template>
  <v-dialog v-model="open" max-width="820" scrollable>
    <v-card class="pa-1" max-height="90vh">
      <v-card-title>
        <div class="d-flex">
          <div class="flex-grow-1">{{ $t('exportImage.title') }}</div>
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
        <p class="text-body-2 text-medium-emphasis mb-3">{{ $t('exportImage.instructions') }}</p>

        <!-- The badge sits outside the scrolling stage so it stays put at 1:1. -->
        <div class="stage-wrap">
          <div class="stage">
            <div class="frame" :class="{ 'frame--checkered': transparent }" :style="frameStyle">
              <img v-if="previewUrl" :src="previewUrl" class="frame__image" :alt="$t('exportImage.previewAlt')" />
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

        <div class="d-flex flex-wrap ga-2 mt-4 mb-3">
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
        </div>

        <div class="d-flex align-center justify-space-between flex-wrap mt-2">
          <v-switch
            v-model="transparent"
            :label="$t('exportImage.transparentBackground')"
            color="primary"
            density="compact"
            hide-details
          />
        </div>
      </v-card-text>

      <v-divider />
      <v-card-actions class="d-flex flex-wrap align-center">
        <v-btn variant="tonal" prepend-icon="mdi-download" :loading="busy" @click="save">
          {{ $t('exportImage.download') }}
        </v-btn>
        <v-btn v-if="canCopy" variant="text" prepend-icon="mdi-content-copy" :loading="busy" @click="copy">
          {{ $t('exportImage.copyToClipboard') }}
        </v-btn>
        <v-spacer />
        <span class="text-caption text-medium-emphasis mr-2">{{ fileWidth }} × {{ fileHeight }} px</span>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="feedbackVisible" :color="feedbackType === 'error' ? 'error' : 'primary'" timeout="2600">
      {{ $t(feedbackMessage) }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import SVGElementViewer from '../SVGElementViewer.vue';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { useAppStore } from '@/store/app';
import { debounce } from '@/utils/debounce';
import {
  canCopyImageToClipboard,
  clampExportSide,
  minimumExportSide,
  copyBlobToClipboard,
  downloadBlob,
  renderModelPng,
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

/** Small enough to drop straight into a document, comfortably above the minimum. */
const DEFAULT_SIZE = 256;

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
  nodalLoads: viewerStore.showLoads ? projectStore.solver.loadCases[0].nodalLoadList : [],
  elementLoads: viewerStore.showLoads ? projectStore.solver.loadCases[0].elementLoadList : [],
  prescribedDisplacements: viewerStore.showLoads ? projectStore.solver.loadCases[0].prescribedBC : [],
  dimlines: dimensionLines.value,
  showLoads: viewerStore.showLoads,
  showSupports: viewerStore.showSupports,
  showNodeLabels: viewerStore.showNodeLabels,
  showElementLabels: viewerStore.showElementLabels,
  showDeformedShape: viewerStore.showDeformedShape,
  showNormalForce: viewerStore.showNormalForce,
  showShearForce: viewerStore.showShearForce,
  showMoments: viewerStore.showBendingMoment,
  showReactions: viewerStore.showReactions,
  colors: viewerStore.colors,
  supportSize: viewerStore.supportSize,
  fontSize: viewerStore.fontSize,
  resultsScalePx: viewerStore.resultsScalePx_,
  resultLabelMode: viewerStore.resultLabelMode,
  convertForce: appStore.convertForce,
  convertMoment: appStore.convertMoment,
  convertLength: appStore.convertLength,
  numberFormat: appStore.numberFormatter,
  padding: EXPORT_MARGIN_PX,
  mobilePadding: EXPORT_MARGIN_PX,
  // The editor reserves ~82 px on every side so the view does not jump when a diagram is
  // toggled, which on a still image is just empty margin. An export has nothing to keep
  // stable, so it fits everything actually drawn — labels, arrows and diagrams included,
  // hence no `fitIgnore` — and keeps only a thin edge.
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

const frameStyle = computed(() => ({
  width: `${Math.round(width.value * previewZoom.value)}px`,
  height: `${Math.round(height.value * previewZoom.value)}px`,
  flex: '0 0 auto',
}));

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
const refreshPreview = async () => {
  const token = ++previewToken;

  try {
    // Rendered at the real export size, then shown smaller by CSS. Rasterizing at the
    // preview's size instead would misrepresent the file: the markers are sized against
    // the canvas they are drawn on, so a reduced render shows small nodes and thin hinge
    // strokes that the exported file does not have.
    const blob = await renderModelPng(SVGElementViewer, viewerProps.value, {
      width: width.value,
      height: height.value,
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

watch([width, height, transparent, fitPreview], schedulePreview, { immediate: true });

onBeforeUnmount(releasePreview);

const render = () =>
  renderModelPng(SVGElementViewer, viewerProps.value, {
    width: width.value,
    height: height.value,
    scale: devicePixels,
    background: transparent.value ? null : '#ffffff',
  });

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

const save = () =>
  run(async () => {
    downloadBlob(await render(), `edubeam-${fileWidth.value}x${fileHeight.value}.png`);
    closeModal();
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
}

.sizes {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
}
</style>
