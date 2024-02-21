<template>
  <v-dialog v-model="open" :max-width="mw">
    <v-card>
      <v-card-title> {{ title }}</v-card-title>

      <v-card-text v-html="message"></v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="props.success" color="green darken-1" @click="_success" @keydown.enter="_success">
          {{ $t("common.confirm") }}
        </v-btn>
        <v-btn
          v-for="action in acs"
          :key="action.label"
          :color="action.color"
          @click="action.action"
          @keydown.enter="action.action"
        >
          {{ action.label }}
        </v-btn>
        <v-btn v-if="props.cancel || acs.length === 0" color="red darken-1" @click="cancel" @keydown.enter="cancel">{{
          $t("dialogs.common.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { closeModal } from "jenesius-vue-modal";
import { computed } from "vue";

const open = ref(true);

const props = defineProps<{
  title: string;
  message: string;
  success?: () => void;
  cancel?: () => void;
  actions: { label: string; color: string; action: () => void }[];
  minWidth?: number;
}>();

const mw = computed(() => props.minWidth || 320);
const acs = computed(() => props.actions || []);

const _success = () => {
  props.success();
  closeModal();
};

const cancel = () => {
  if (props.cancel) {
    props.cancel();
  }
  closeModal();
};
</script>
