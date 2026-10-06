<template>
  <v-row class="viewer-settings">
    <v-col cols="12" md="6">
      <h3 class="mb-3">{{ $t('settings.viewer_settings') }}</h3>

      <div class="vs-heading">{{ $t('settings.grid') }}</div>
      <div class="vs-group">
        <div class="vs-row">
          <span>{{ $t('settings.show_grid') }}</span>
          <v-switch v-model="viewerStore.showGrid" color="primary" density="compact" hide-details inset />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.snap_to_grid') }}</span>
          <v-switch v-model="viewerStore.snapToGrid" color="primary" density="compact" hide-details inset />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.show_crosshair') }}</span>
          <v-switch v-model="viewerStore.showCrosshair" color="primary" density="compact" hide-details inset />
        </div>
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
        density="comfortable"
        variant="outlined"
        divided
        mandatory
      >
        <v-btn value="axis">{{ $t('settings.result_label_orientation_axis') }}</v-btn>
        <v-btn value="horizontal">{{ $t('settings.result_label_orientation_horizontal') }}</v-btn>
      </v-btn-toggle>

      <div class="vs-heading">{{ $t('settings.model_checks') }}</div>
      <div class="vs-group">
        <div class="vs-row">
          <span>{{ $t('settings.show_mechanisms') }}</span>
          <v-switch v-model="viewerStore.showMechanisms" color="primary" density="compact" hide-details inset />
        </div>
        <div class="vs-row">
          <span>{{ $t('settings.animate_mechanisms') }}</span>
          <v-switch
            v-model="viewerStore.animateMechanisms"
            :disabled="!viewerStore.showMechanisms"
            color="primary"
            density="compact"
            hide-details
            inset
          />
        </div>
      </div>
    </v-col>

    <v-col cols="12" md="6">
      <div class="vs-heading mt-md-12">{{ $t('settings.viewer_preview') }}</div>
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
          :show-shear-force="showQuantity === 'shearForce'"
          :padding="PREVIEW_PADDING"
          :mobile-padding="PREVIEW_PADDING"
          :fit-reserve-px="previewReserve"
          :results-scale-px="viewerStore.resultsScalePx_"
          :colors="viewerStore.colors"
          :support-size="viewerStore.supportSize"
          :font-size="viewerStore.fontSize"
          :result-label-mode="viewerStore.resultLabelMode"
        />
      </div>

      <v-chip-group v-model="showQuantity" class="vs-quantities" column mandatory selected-class="text-primary">
        <v-chip v-for="q in previewQuantities" :key="q" :value="q" size="small" variant="outlined">
          {{ $t(`common.${q}`) }}
        </v-chip>
      </v-chip-group>

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

const viewerStore = useViewerStore();
const appStore = useAppStore();

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

// No normal force: a simply supported beam under vertical load carries none
type PreviewQuantity = 'deformedShape' | 'shearForce' | 'bendingMoment' | 'reactions';

const previewQuantities: PreviewQuantity[] = ['deformedShape', 'shearForce', 'bendingMoment', 'reactions'];
const showQuantity = ref<PreviewQuantity>('deformedShape');

/** Picking a result's colour shows that result in the preview, so the change can be seen. */
const colorKeys: { key: keyof typeof viewerStore.colors; preview?: PreviewQuantity }[] = [
  { key: 'nodes' },
  { key: 'elements' },
  { key: 'loads' },
  { key: 'deformedShape', preview: 'deformedShape' },
  { key: 'normalForce' },
  { key: 'shearForce', preview: 'shearForce' },
  { key: 'bendingMoment', preview: 'bendingMoment' },
  { key: 'reactions', preview: 'reactions' },
];

/**
 * A simply supported beam in round numbers of the units in use, so its results are round too:
 * 4 m under 10 kN/m (M = 20 kNm, reactions 20 kN), or 12 ft under 1 kip/ft (M = 18 kip·ft,
 * reactions 6 kip). Labels are in the chosen units, as everywhere else.
 */
const buildPreview = (span: number, load: number) => {
  const preview = new LinearStaticSolver();
  const domain = preview.domain;

  domain.createNode('a', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('b', [span, 0, 0], [DofID.Dz]);

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

  preview.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, load], true);
  preview.solve();

  return preview;
};

const FT = unitSize.length('ft');

const previews: Record<PresetFamily, Ref<LinearStaticSolver>> = {
  metric: ref(buildPreview(4, 10e3)),
  us: ref(buildPreview(12 * FT, unitSize.force('kip') / FT)),
};

const solver = computed(() => previews[presetFamily(appStore.units.Length)].value);

/**
 * The fit only reserves the sides for the end labels, and an equal band above and below for the
 * supports, which keeps the beam in the middle of the preview. The diagrams are not measured, and
 * reserving their height as well would leave the beam no room and the fit nothing to settle on.
 */
const SUPPORT_BAND_PX = 40;
const PREVIEW_PADDING = 8;

const previewReserve = { top: SUPPORT_BAND_PX, bottom: SUPPORT_BAND_PX, left: 48, right: 48 };

const _created = ref(false);
onMounted(() => {
  _created.value = true;
});
</script>

<style scoped>
.vs-heading {
  margin: 16px 0 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(var(--v-theme-on-surface), 0.64);
}

.vs-group {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
}

.vs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 48px;
  padding: 4px 8px 4px 14px;
}

.vs-row + .vs-row {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.vs-row :deep(.v-switch) {
  flex: 0 0 auto;
}

.vs-grid-step {
  flex: 0 0 120px;
}

.vs-toggle {
  width: 100%;
  height: auto;
}

/* Some languages need two lines for an orientation on a phone */
.vs-toggle > .v-btn {
  flex: 1 1 0;
  height: auto;
  min-height: 40px;
  padding-block: 6px;
  text-transform: none;
  letter-spacing: normal;
}

.vs-toggle > .v-btn :deep(.v-btn__content) {
  white-space: normal;
}

.vs-preview {
  /* Room for the load arrows above and the diagrams below at the default sizes */
  height: 220px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  pointer-events: none;
}

.vs-preview > * {
  height: 100%;
}

.vs-quantities :deep(.v-chip) {
  text-transform: none;
}

.vs-colors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 6px;
}

.vs-swatch {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 6px 10px;
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
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
}

.vs-swatch__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
