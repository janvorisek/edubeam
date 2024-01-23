<script setup lang="ts">
import { openModal } from "jenesius-vue-modal";
import AddNodalLoadDialog from "./dialogs/AddNodalLoad.vue";
import { useProjectStore } from "@/store/project";

const projectStore = useProjectStore();
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item
      link
      class="text-body-2"
      @click="
        openModal(AddNodalLoadDialog, { label: projectStore.selection.label });
        projectStore.selection.type = null;
      "
    >
      <template #prepend>
        <div class="pr-2"><v-icon icon="mdi-weight" /></div>
      </template>
      {{ $t("loads.addLoad") }}
    </v-list-item>
  </v-list>
</template>
