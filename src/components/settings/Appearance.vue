<template>
  <v-row class="viewer-settings">
    <v-col cols="12" md="6">
      <h3 class="mb-1">{{ $t('settings.viewer_settings') }}</h3>

      <div class="vs-heading">{{ $t('settings.grid') }}</div>
      <div class="vs-group">
        <label class="vs-row vs-row--switch">
          <span>{{ $t('settings.show_grid') }}</span>
          <v-switch v-model="viewerStore.showGrid" color="primary" density="compact" hide-details />
        </label>
        <label class="vs-row vs-row--switch">
          <span>{{ $t('settings.snap_to_grid') }}</span>
          <v-switch v-model="viewerStore.snapToGrid" color="primary" density="compact" hide-details />
        </label>
        <label class="vs-row vs-row--switch">
          <span>{{ $t('settings.show_crosshair') }}</span>
          <v-switch v-model="viewerStore.showCrosshair" color="primary" density="compact" hide-details />
        </label>
        <div class="vs-row">
          <span>{{ $t('settings.grid_snap_step') }}</span>
          <v-text-field
            v-model="gridStepInput"
            class="vs-grid-step"
            :rules="positiveNumberRules"
            :aria-label="$t('settings.grid_snap_step')"
            density="compact"
            variant="outlined"
            hide-details="auto"
            inputmode="decimal"
            :suffix="appStore.units.Length"
            @keydown="checkNumber($event)"
            @change="commitGridStep"
            @blur="commitGridStep"
          />
        </div>
      </div>

      <div class="vs-heading">{{ $t('settings.sizes.sizes') }}</div>
      <div class="vs-group">
        <div class="vs-row">
          <span>{{ $t('settings.results_scale') }}</span>
          <SettingStepper
            v-model="viewerStore.resultsScalePx_"
            :label="$t('settings.results_scale')"
            :min="8"
            :max="120"
            :step="8"
            :format="(v) => `${v} px`"
          />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.sizes.supportSize') }}</span>
          <SettingStepper
            v-model="viewerStore.supportSize"
            :label="$t('settings.sizes.supportSize')"
            :min="0.5"
            :max="1.5"
            :step="0.1"
            :format="(v) => `${Math.round(v * 100)} %`"
          />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.font_size') }}</span>
          <SettingStepper
            v-model="viewerStore.fontSize"
            :label="$t('settings.font_size')"
            :min="10"
            :max="20"
            :step="1"
            :format="(v) => `${v} px`"
          />
        </div>
      </div>

      <div class="vs-heading">{{ $t('settings.result_label_orientation') }}</div>
      <v-btn-toggle
        v-model="viewerStore.resultLabelMode"
        class="vs-toggle"
        color="primary"
        density="compact"
        variant="outlined"
        divided
        mandatory
      >
        <v-btn value="axis">{{ $t('settings.result_label_orientation_axis') }}</v-btn>
        <v-btn value="horizontal">{{ $t('settings.result_label_orientation_horizontal') }}</v-btn>
      </v-btn-toggle>

      <div class="vs-heading">{{ $t('settings.model_checks') }}</div>
      <div class="vs-group">
        <label class="vs-row vs-row--switch">
          <span>{{ $t('settings.show_mechanisms') }}</span>
          <v-switch v-model="viewerStore.showMechanisms" color="primary" density="compact" hide-details />
        </label>
        <label class="vs-row vs-row--switch">
          <span>{{ $t('settings.animate_mechanisms') }}</span>
          <v-switch
            v-model="viewerStore.animateMechanisms"
            :disabled="!viewerStore.showMechanisms"
            color="primary"
            density="compact"
            hide-details
          />
        </label>
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="vs-heading mt-md-8">{{ $t('settings.viewer_preview') }}</div>
      <div class="vs-preview">
        <SVGElementViewer
          v-if="_created"
          id="settings-appearance"
          class="overflow-hidden"
          :solver="solver"
          :nodes="[solver.domain.getNode('a'), solver.domain.getNode('b')]"
          :elements="[solver.domain.getElement(1)]"
          :convert-force="appStore.convertForce"
          :convert-force-distance="appStore.convertForceDistance"
          :convert-moment="appStore.convertMoment"
          :convert-length="appStore.convertLength"
          :convert-displacement="appStore.convertDisplacement"
          :number-format="appStore.numberFormatter"
          :nodal-loads="solver.loadCases[0].nodalLoadList"
          :element-loads="solver.loadCases[0].elementLoadList"
          :show-deformed-shape="showQuantity === 'deformedShape'"
          :show-reactions="showQuantity === 'reactions'"
          :show-loads="true"
          :show-supports="true"
          :show-moments="showQuantity === 'bendingMoment'"
          :show-normal-force="showQuantity === 'normalForce'"
          :show-shear-force="showQuantity === 'shearForce'"
          :padding="PREVIEW_PADDING"
          :mobile-padding="PREVIEW_PADDING"
          :fit-reserve-px="previewReserve"
          :results-scale-px="viewerStore.resultsScalePx_"
          :colors="viewerStore.colors"
          :support-size="viewerStore.supportSize"
          :font-size="viewerStore.fontSize"
          :result-label-mode="viewerStore.resultLabelMode"
          :diagram-style="viewerStore.diagramStyle"
        />
      </div>

      <v-btn-toggle
        v-model="showQuantity"
        class="vs-quantities"
        color="primary"
        variant="outlined"
        density="compact"
        rounded="sm"
        divided
        mandatory
      >
        <!-- Named as the viewer's own layer switches name them -->
        <v-btn value="deformedShape">{{ $t('sideSettings.showDeformedShape') }}</v-btn>
        <v-btn value="normalForce">N&nbsp;(x)</v-btn>
        <v-btn value="shearForce"
          >V<sub>{{ appStore.axes.v }}</sub
          >&nbsp;(x)</v-btn
        >
        <v-btn value="bendingMoment"
          >M<sub>{{ appStore.axes.r }}</sub
          >&nbsp;(x)</v-btn
        >
        <v-btn value="reactions">{{ $t('sideSettings.showReactions') }}</v-btn>
      </v-btn-toggle>

      <!-- Under the preview, which each of these switches to the diagram it is about. -->
      <div class="vs-heading">{{ $t('settings.diagrams.title') }}</div>
      <div class="vs-group">
        <div class="vs-row">
          <span>{{ $t('settings.diagrams.moment') }}</span>
          <v-select
            v-model="momentOnTensionSide"
            class="vs-select"
            :items="momentSides"
            :aria-label="$t('settings.diagrams.moment')"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.diagrams.shear') }}</span>
          <v-select
            v-model="shearOnDashedSide"
            class="vs-select"
            :items="dashedSides"
            :aria-label="$t('settings.diagrams.shear')"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.diagrams.normal') }}</span>
          <v-select
            v-model="normalOnDashedSide"
            class="vs-select"
            :items="dashedSides"
            :aria-label="$t('settings.diagrams.normal')"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.diagrams.fill') }}</span>
          <v-select
            v-model="diagramFill"
            class="vs-select"
            :items="fills"
            :aria-label="$t('settings.diagrams.fill')"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>
        <label class="vs-row vs-row--switch">
          <span>{{ $t('settings.diagrams.degrees') }}</span>
          <v-switch v-model="showDegrees" color="primary" density="compact" hide-details />
        </label>
      </div>
      <div class="vs-note">{{ $t('settings.diagrams.dashedHint') }}</div>

      <div class="vs-heading">{{ $t('settings.colors.colors') }}</div>
      <div class="vs-colors">
        <v-menu v-for="c in colorKeys" :key="c.key" :close-on-content-click="false" location="start">
          <template #activator="{ props }">
            <button v-bind="props" type="button" class="vs-swatch" @click="c.preview && (showQuantity = c.preview)">
              <span class="vs-swatch__dot" :style="{ background: viewerStore.colors[c.key] }"></span>
              <span class="vs-swatch__name">{{ $t(`common.${c.key}`) }}</span>
            </button>
          </template>
          <v-color-picker v-model="viewerStore.colors[c.key]" mode="hex" :modes="['hex']" />
        </v-menu>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useViewerStore } from '@/store/viewer';
import { useAppStore } from '@/store/app';
import SVGElementViewer from '../SVGElementViewer.vue';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import { unitSize } from '@/utils/unitConversions';
import { presetFamily, type PresetFamily } from '@/utils/presetFamily';
import { checkNumber, parseFloat2, positiveNumberRules } from '@/utils';
import SettingStepper from './SettingStepper.vue';
import { useI18n } from 'vue-i18n';
import type { DiagramFill } from '@/utils/diagramStyle';

const viewerStore = useViewerStore();
const appStore = useAppStore();
const { t } = useI18n();

/**
 * Edited as text rather than `type="number"`: a decimal comma, which is what a phone keyboard
 * offers in most locales, leaves a number input empty and the field then complains that nothing
 * was entered. The store keeps a number, so the text is parsed on change.
 */
const gridStepInput = ref(String(appStore.convertLength(viewerStore.gridStep)));

// The store keeps metres; the field shows the length unit, and follows a change of either
watch([() => viewerStore.gridStep, () => appStore.units.Length], () => {
  const step = appStore.convertLength(viewerStore.gridStep);
  if (parseFloat2(gridStepInput.value) !== step) gridStepInput.value = String(step);
});

const commitGridStep = () => {
  const step = parseFloat2(gridStepInput.value);
  if (!Number.isFinite(step) || step <= 0) return;

  viewerStore.gridStep = appStore.convertInverseLength(step);
};

type PreviewQuantity = 'deformedShape' | 'normalForce' | 'shearForce' | 'bendingMoment' | 'reactions';

// The bending moment first: most of the settings here are about how it is drawn.
const showQuantity = ref<PreviewQuantity>('bendingMoment');

/** The diagram settings. Changing one shows the diagram it is about in the preview, as picking a colour does. */
const momentSides = computed(() => [
  { title: t('settings.diagrams.tensionSide'), value: true },
  { title: t('settings.diagrams.compressionSide'), value: false },
]);
const dashedSides = computed(() => [
  { title: t('settings.diagrams.awayFromDashed'), value: false },
  { title: t('settings.diagrams.dashedSide'), value: true },
]);
const fills = computed(() => [
  { title: t('settings.diagrams.fillSolid'), value: 'solid' },
  { title: t('settings.diagrams.fillHatch'), value: 'hatch' },
  { title: t('settings.diagrams.fillNone'), value: 'none' },
]);

const styleSetting = <
  K extends 'momentOnTensionSide' | 'shearOnDashedSide' | 'normalOnDashedSide' | 'fill' | 'showDegrees',
>(
  key: K,
  preview: PreviewQuantity
) =>
  computed({
    get: () => viewerStore.diagramStyle[key],
    set: (value: (typeof viewerStore.diagramStyle)[K]) => {
      viewerStore.diagramStyle[key] = value;
      showQuantity.value = preview;
    },
  });

const momentOnTensionSide = styleSetting('momentOnTensionSide', 'bendingMoment');
const shearOnDashedSide = styleSetting('shearOnDashedSide', 'shearForce');
const normalOnDashedSide = styleSetting('normalOnDashedSide', 'normalForce');
const diagramFill = styleSetting('fill', 'bendingMoment') as Ref<DiagramFill>;
const showDegrees = styleSetting('showDegrees', 'bendingMoment');

/** Picking a result's colour shows that result in the preview, so the change can be seen. */
const colorKeys: { key: keyof typeof viewerStore.colors; preview?: PreviewQuantity }[] = [
  { key: 'nodes' },
  { key: 'elements' },
  { key: 'loads' },
  { key: 'deformedShape', preview: 'deformedShape' },
  { key: 'normalForce', preview: 'normalForce' },
  { key: 'shearForce', preview: 'shearForce' },
  { key: 'bendingMoment', preview: 'bendingMoment' },
  { key: 'reactions', preview: 'reactions' },
];

/**
 * A simply supported beam rising 9 in 40 (so 41 along it) under a vertical load along it: inclined,
 * it carries normal force too, so every diagram and every side setting has something to show, and
 * gently enough that the diagrams stay inside the preview. In round numbers of the units in use, so
 * its results are round too - 4 m across, 0.9 m up, under 10 kN/m: reactions 20.5 kN, M = 20.5 kNm,
 * V = ±20 kN, N = ±4.5 kN; or 20 ft across, 4.5 ft up, under 2 kip/ft: reactions 20.5 kip,
 * M = 102.5 kip·ft, V = ±20 kip, N = ±4.5 kip. Labels are in the chosen units, as everywhere else.
 */
const buildPreview = (span: number, rise: number, load: number) => {
  const preview = new LinearStaticSolver();
  const domain = preview.domain;

  // z points down, so rising to the right is a negative z
  domain.createNode('a', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('b', [span, 0, -rise], [DofID.Dz]);

  domain.createBeam2D(1, ['a', 'b'], 1, 1);

  domain.createCrossSection(1, {
    a: 1e-2,
    iy: 8.356e-5,
    iz: 1.0,
    dyz: 999991.0,
    h: 1,
    k: 1e32,
    j: 99999.0,
  });

  domain.createMaterial(1, {
    e: 210000e6,
    g: 210000e6 / (2 * (1 + 0.2)),
    alpha: 1.0,
    d: 4000,
  });

  // In global axes: vertical, as gravity, and so partly along the inclined member
  preview.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, load], false);
  preview.solve();

  return preview;
};

const FT = unitSize.length('ft');

const previews: Record<PresetFamily, Ref<LinearStaticSolver>> = {
  metric: ref(buildPreview(4, 0.9, 10e3)),
  us: ref(buildPreview(20 * FT, 4.5 * FT, (2 * unitSize.force('kip')) / FT)),
};

const solver = computed(() => previews[presetFamily(appStore.units.Length)].value);

/**
 * The fit reserves the sides for the end labels, and an equal band above and below for what reaches
 * past the inclined beam's ends: a diagram as tall as the results scale and its value label, or the
 * supports. The band keeps the beam in the middle of the preview. It stops growing at 84px, or a large
 * results scale would leave the beam no room at all; past that the diagrams may run over the edge.
 */
const SUPPORT_BAND_PX = 40;
const LABEL_PX = 30;
const MAX_BAND_PX = 84;
const PREVIEW_PADDING = 8;

const previewReserve = computed(() => {
  const band = Math.min(MAX_BAND_PX, Math.max(SUPPORT_BAND_PX, viewerStore.resultsScalePx_ + LABEL_PX));
  return { top: band, bottom: band, left: 48, right: 48 };
});

const _created = ref(false);
onMounted(() => {
  _created.value = true;
});
</script>

<style scoped>
.vs-heading {
  margin: 12px 0 4px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(var(--v-theme-on-surface), 0.64);
}

.vs-group {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  /* Keeps a hovered row's tint inside the rounded corners */
  overflow: hidden;
}

.vs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
  padding: 2px 6px 2px 12px;
  font-size: 0.875rem;
}

/* Fingers need the room the mouse does not */
@media (pointer: coarse) {
  .vs-row {
    min-height: 44px;
  }

  .vs-swatch {
    min-height: 40px;
  }
}

.vs-row + .vs-row {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.vs-row :deep(.v-switch) {
  flex: 0 0 auto;
  /* The thumb overhangs the track; this ends it where the fields and buttons in the other rows end. */
  margin-inline-end: 6px;
}

/* The whole row is the switch's label, so a click anywhere on it flips the switch. */
.vs-row--switch {
  cursor: pointer;
}

.vs-row--switch:hover {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.vs-row--switch:has(.v-selection-control--disabled) {
  cursor: default;
  background: none;
}

.vs-row :deep(.v-switch .v-selection-control) {
  min-height: 32px;
}

/*
 * The fields in a row 32px tall rather than the 40px of Vuetify's compact density, with what they
 * hold - a value and its unit, or a selection - centred in that height.
 */
.vs-row :deep(.v-field) {
  font-size: 0.875rem;
}

.vs-row :deep(.v-field__field) {
  align-items: center;
}

.vs-row :deep(.v-field__input) {
  min-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
}

/* The unit after a value, which Vuetify holds to 40px whatever the field's height */
.vs-row :deep(.v-text-field__suffix) {
  min-height: 32px;
  padding-top: 0;
  padding-bottom: 0;
}

.vs-grid-step {
  flex: 0 0 110px;
}

.vs-select {
  /* One width for all of them, however long the option names in a row are */
  flex: 0 0 min(200px, 55%);
}

.vs-note {
  margin: 6px 2px 0;
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.64);
}

.vs-toggle {
  width: 100%;
  height: auto;
}

/* Some languages need two lines for an orientation on a phone */
.vs-toggle > .v-btn {
  flex: 1 1 0;
  height: auto;
  min-height: 32px;
  padding-block: 4px;
  text-transform: none;
  letter-spacing: normal;
}

.vs-toggle > .v-btn :deep(.v-btn__content) {
  white-space: normal;
}

.vs-preview {
  /*
   * Room for the load arrows, and for the diagrams at the default sizes: at the ends of the inclined
   * beam they reach up from the higher end and down from the lower one.
   */
  height: 260px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  pointer-events: none;
}

.vs-preview > * {
  height: 100%;
}

/* As tall as the other controls, with no more padding than the names need */
.vs-quantities {
  height: 32px;
  margin-top: 6px;
}

.vs-quantities > .v-btn {
  height: 100%;
  min-width: 0;
  padding-inline: 10px;
  font-size: 0.8125rem;
  text-transform: none;
  letter-spacing: normal;
}

/* Each as wide as its name, so as many share a line as fit */
.vs-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.vs-swatch {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 2px 10px 2px 8px;
  font-size: 0.8125rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
}

.vs-swatch:hover,
.vs-swatch:focus-visible {
  background: rgba(var(--v-theme-on-surface), 0.04);
}

.vs-swatch__dot {
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
}

.vs-swatch__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
