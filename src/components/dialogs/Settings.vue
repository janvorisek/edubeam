<template>
  <v-dialog v-model="open" max-width="1080">
    <v-card>
      <Settings />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { closeModal } from "jenesius-vue-modal";
import Settings from "../Settings.vue";

const open = ref(true);
</script>
