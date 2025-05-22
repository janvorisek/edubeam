<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title v-html="$t('welcome.title')"></v-card-title>

      <v-card-text>
        {{ $t('welcome.description') }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn :text="$t('tour.startTour')" color="primary" variant="flat" @click="startTour()"></v-btn>
        <v-btn
          :text="$t('tour.skipTour')"
          color="black"
          @click="
            appStore.onboardingFinished = true;
            closeModal();
          "
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject } from 'vue';
import { closeModal } from 'jenesius-vue-modal';

import { useVOnboarding } from 'v-onboarding';
import 'v-onboarding/dist/style.css';
import { useAppStore } from '../../store/app';

const wrapper = inject('onboardingWrapper');

const appStore = useAppStore();

const open = ref(true);
const startTour = () => {
  appStore.onboardingFinished = true;

  const { start, goToStep, finish } = useVOnboarding(wrapper);
  start();
  closeModal();
};
</script>
