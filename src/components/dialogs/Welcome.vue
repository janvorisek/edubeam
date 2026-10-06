<template>
  <v-dialog v-model="open" max-width="760">
    <v-card>
      <v-card-title><span v-html="$t('welcome.title')"></span></v-card-title>

      <v-card-text class="pb-2">
        <p class="mb-3">{{ $t('welcome.description') }}</p>

        <!-- Side by side on a wide screen, so the setup adds width rather than height -->
        <v-row>
          <v-col cols="12" md="6">
            <div class="welcome-heading">{{ $t('welcome.start') }}</div>
            <div class="d-flex flex-column ga-2">
              <v-btn
                class="welcome-choice"
                color="primary"
                variant="flat"
                size="large"
                prepend-icon="mdi-map-marker-path"
                @click="showAround()"
              >
                <div class="text-left">
                  <div>{{ $t('welcome.showAround') }}</div>
                  <div class="text-caption welcome-hint">{{ $t('welcome.showAroundHint') }}</div>
                </div>
              </v-btn>
              <v-btn
                class="welcome-choice"
                variant="outlined"
                size="large"
                prepend-icon="mdi-vector-polyline-plus"
                @click="drawFirstBeam()"
              >
                <div class="text-left">
                  <div>{{ $t('welcome.drawFirstBeam') }}</div>
                  <div class="text-caption welcome-hint">{{ $t('welcome.drawFirstBeamHint') }}</div>
                </div>
              </v-btn>
              <v-btn
                class="welcome-choice"
                variant="outlined"
                size="large"
                prepend-icon="mdi-book-open-variant"
                @click="openExamples()"
              >
                <div class="text-left">
                  <div>{{ $t('welcome.openExample') }}</div>
                  <div class="text-caption welcome-hint">{{ $t('welcome.openExampleHint') }}</div>
                </div>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="welcome-setup">
            <div class="welcome-heading">{{ $t('settings.units.system') }}</div>
            <div class="welcome-units mb-3" role="radiogroup" :aria-label="$t('settings.units.system')">
              <v-card
                v-for="system in unitSystemOptions"
                :key="system.value"
                class="welcome-unit"
                :class="{ 'welcome-unit--active': unitSystem === system.value }"
                variant="outlined"
                role="radio"
                :aria-checked="unitSystem === system.value"
                :tabindex="radioTabIndex(unitSystems, system.value, unitSystem)"
                @click="unitSystem = system.value"
                @keydown="onRadioKeydown($event, unitSystems, system.value, (value) => (unitSystem = value))"
              >
                <div class="text-body-2">{{ system.title }}</div>
                <div class="text-caption welcome-hint">{{ system.hint }}</div>
              </v-card>
            </div>

            <div class="welcome-heading">{{ $t('settings.axisConvention') }}</div>
            <AxisConventionPicker v-model="appStore.axisConvention" compact />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :text="$t('welcome.skip')" variant="text" @click="skip()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { closeModal, openModal } from 'jenesius-vue-modal';
import { useVOnboarding } from 'v-onboarding';

import Examples from './Examples.vue';
import { useAppStore } from '../../store/app';
import { useViewerStore } from '../../store/viewer';
import { startFirstBeam } from '@/utils/startFirstBeam';
import AxisConventionPicker from '../settings/AxisConventionPicker.vue';
import { matchStarterModelToUnits } from '@/utils/matchStarterModel';
import type { UnitSystem } from '@/utils/unitSystems';
import { onRadioKeydown, radioTabIndex } from '@/utils/radioGroup';

const appStore = useAppStore();
const onboardingWrapper = inject('onboardingWrapper');

const open = ref(true);
const { t } = useI18n();

const unitSystems: readonly UnitSystem[] = ['si', 'us'];

// The symbols each system shows, so the choice says what it means without opening the settings
const unitSystemOptions = computed(() => [
  { value: 'si' as const, title: t('settings.units.systemSI'), hint: 'm · kN · kNm · MPa' },
  { value: 'us' as const, title: t('settings.units.systemUS'), hint: 'ft · kip · kip·ft · ksi' },
]);

/**
 * A custom mix of units selects neither. Picking one also redraws the starter frame in that
 * system's round numbers, if it is still the untouched starter frame.
 */
const unitSystem = computed({
  get: () => appStore.unitSystem ?? undefined,
  set: (system: UnitSystem | undefined) => {
    if (!system || system === appStore.unitSystem) return;

    appStore.unitSystem = system;
    matchStarterModelToUnits(system);
  },
});

const finish = () => {
  appStore.onboardingFinished = true;
  closeModal();
};

// Anyone skipping or opening an example gets the display options straight away. The task keeps
// them closed, as opening them is one of its steps.
const skip = () => {
  useViewerStore().settingsOpen = true;
  finish();
};

// The tour points at the display options, so they have to be open for it.
const showAround = () => {
  useViewerStore().settingsOpen = true;
  finish();
  useVOnboarding(onboardingWrapper).start();
};

const drawFirstBeam = () => {
  startFirstBeam();
  finish();
};

const openExamples = () => {
  appStore.onboardingFinished = true;
  useViewerStore().settingsOpen = true;
  // Replaces this dialog rather than stacking on it.
  openModal(Examples);
};
</script>

<style scoped>
.welcome-choice {
  height: auto !important;
  min-height: 56px;
  padding-block: 8px;
  justify-content: flex-start;
  text-transform: none;
  letter-spacing: normal;
  white-space: normal;
}

.welcome-choice :deep(.v-btn__content) {
  white-space: normal;
}

.welcome-hint {
  opacity: 0.8;
}

/* One heading style for both columns, so their tops line up */
.welcome-heading {
  margin-bottom: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(var(--v-theme-on-surface), 0.64);
}

.welcome-units {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Styled as the compact axis cards below, so the two choices read as one set */
.welcome-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  text-align: center;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

.welcome-unit:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.welcome-unit--active {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
  background: rgba(var(--v-theme-primary), 0.06);
  /* The wider border comes out of the padding, so choosing a card does not reflow its text */
  padding: 7px 5px;
}

/* Stacked on a phone: the setup follows the choices closely, with smaller drawings */
@media (max-width: 959px) {
  .welcome-setup {
    padding-top: 4px;
  }

  .welcome-setup :deep(.axis-picker__drawing) {
    max-width: 60px;
  }
}
</style>
