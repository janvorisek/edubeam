<script setup lang="ts">
import { openModal } from "jenesius-vue-modal";
import AddNodalLoadDialog from "./dialogs/AddNodalLoad.vue";
import { useProjectStore } from "@/store/project";
import { toggleSet } from "@/utils";
import { computed } from "vue";

const projectStore = useProjectStore();

const node = computed(() => {
  return projectStore.solver.domain.nodes.get(projectStore.selection.label);
});
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
        <div class="pr-2"><v-icon size="16" icon="mdi-arrow-down-thin" /></div>
      </template>
      {{ $t("loads.addLoad") }}
    </v-list-item>
    <v-list-item link class="text-body-2">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-triangle-outline" /></div>
      </template>
      {{ $t("nodes.defineSupports") }}
      <v-menu activator="parent" open-on-click min-width="150" location="end" :close-on-content-click="false">
        <v-list density="compact" class="py-0">
          <v-row no-gutters class="px-1">
            <v-col>
              <v-checkbox
                density="compact"
                label="Dx"
                hide-details="auto"
                :model-value="node.bcs.has(0)"
                @click="toggleSet(node, 'bcs', 0)"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                density="compact"
                label="Dz"
                hide-details="auto"
                :model-value="node.bcs.has(2)"
                @click="toggleSet(node, 'bcs', 2)"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                density="compact"
                label="Ry"
                hide-details="auto"
                :model-value="node.bcs.has(4)"
                @click="toggleSet(node, 'bcs', 4)"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-list>
      </v-menu>
    </v-list-item>
    <v-list-item
      v-if="projectStore.solver.domain.nodes.get(projectStore.selection.label).bcs.size > 0"
      link
      class="text-body-2"
      @click="
        openModal(AddNodalLoadDialog, { label: projectStore.selection.label, type: 'displacement' });
        projectStore.selection.type = null;
      "
    >
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-ruler" /></div>
      </template>
      {{ $t("loads.addPrescribedDisplacement") }}
    </v-list-item>
  </v-list>
</template>
