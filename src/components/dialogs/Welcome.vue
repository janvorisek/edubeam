<template>
  <v-dialog v-model="open" max-width="440">
    <v-card>
      <v-card-title v-html="$t('welcome.title')"></v-card-title>

      <v-card-text class="pb-2">
        <p class="mb-4">{{ $t('welcome.description') }}</p>

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
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :text="$t('welcome.skip')" variant="text" @click="skip()"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import { closeModal, openModal } from 'jenesius-vue-modal';
import { useVOnboarding } from 'v-onboarding';

import Examples from './Examples.vue';
import { useAppStore } from '../../store/app';
import { useViewerStore } from '../../store/viewer';
import { startFirstBeam } from '@/utils/startFirstBeam';

const appStore = useAppStore();
const onboardingWrapper = inject('onboardingWrapper');

const open = ref(true);

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
</style>
