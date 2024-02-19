<template>
  <v-dialog v-model="open" max-width="320">
    <v-card>
      <v-card-title> {{ title }}</v-card-title>

      <v-card-text>{{ message }}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="_success"> {{ $t("common.confirm") }} </v-btn>
        <v-btn color="red darken-1" @click="closeModal">{{ $t("dialogs.common.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { closeModal } from "jenesius-vue-modal";

const open = ref(true);

const props = defineProps<{
  title: string;
  message: string;
  success: () => void;
}>();

const _success = () => {
  props.success();
  closeModal();
};
</script>
