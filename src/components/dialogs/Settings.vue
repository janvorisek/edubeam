<template>
  <v-dialog v-model="open" max-width="1150" attach=".v-application">
    <div class="d-flex align-center" style="position: absolute; right: 0; z-index: 10">
      <HelpTip topic="settings" size="small" location="bottom end" align="center" />
      <v-btn icon="mdi-close" size="small" variant="text" small @click.prevent.stop="closeModal" />
    </div>
    <v-card class="settings-card">
      <Settings :tab="tab" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import Settings from '../settings/Settings.vue';
import HelpTip from '../HelpTip.vue';
import type { SettingsTab } from '@/store/app';

defineProps<{ tab?: SettingsTab }>();

const open = ref(true);
</script>

<style>
/* A fixed height keeps the dialog from jumping when switching between tabs of different length */
@media (min-width: 1101px) {
  .v-dialog > .v-overlay__content > .v-card.settings-card {
    flex: 0 0 auto;
    height: min(760px, calc(100vh - 48px));
  }
}
</style>
