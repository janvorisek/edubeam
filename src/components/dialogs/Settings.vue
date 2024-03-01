<template>
  <v-dialog v-model="open" max-width="1150" attach=".v-application">
    <v-btn
      icon="mdi-close"
      size="small"
      variant="text"
      @click.prevent.stop="closeModal"
      small
      style="position: absolute; right: 0; z-index: 10"
    />
    <v-card>
      <Settings />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { closeModal } from "jenesius-vue-modal";
import Settings from "../settings/Settings.vue";

const open = ref(true);
</script>
