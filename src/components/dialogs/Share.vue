<template>
  <v-dialog v-model="open" max-width="1080">
    <v-card class="pa-1">
      <v-card-title class="text-h5">
        <div class="d-flex">
          <div class="flex-grow-1">{{ $t("sharing.shareViaURL") }}</div>
          <v-btn icon="mdi-close" size="small" variant="text" @click.prevent.stop="closeModal()" small class="ml-1" />
        </div>
      </v-card-title>
      <v-textarea v-model="val" readonly no-resize variant="outlined" hide-details></v-textarea>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { closeModal } from "jenesius-vue-modal";
import Settings from "../Settings.vue";
import { serializeModel } from "@/utils";
import { useProjectStore } from "@/store/project";
import { onMounted } from "vue";

const open = ref(true);
const val = ref("");

const shareMesh = () => {
  const hash = serializeModel(useProjectStore().solver);

  const modelURL = new URL(window.location as unknown as URL);
  modelURL.searchParams.set("model", hash);

  val.value = modelURL.toString();
  //window.history.pushState({}, "", modelURL);
};

onMounted(() => {
  shareMesh();
});
</script>

<style lang="scss">
textarea {
  font-size: 12px !important;
}
</style>
