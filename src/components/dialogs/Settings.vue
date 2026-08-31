<template>
  <v-dialog v-model="open" max-width="1150" attach=".v-application">
    <div class="d-flex align-center" style="position: absolute; right: 0; z-index: 10">
      <HelpTip topic="settings" size="small" location="bottom end" align="center" />
      <v-btn icon="mdi-close" size="small" variant="text" small @click.prevent.stop="closeModal" />
    </div>
    <v-card>
      <Settings />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import Settings from '../settings/Settings.vue';
import HelpTip from '../HelpTip.vue';

const open = ref(true);
</script>
