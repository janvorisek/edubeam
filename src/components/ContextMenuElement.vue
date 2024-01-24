<script setup lang="ts">
import { openModal } from "jenesius-vue-modal";
import AddElementLoadDialog from "./dialogs/AddElementLoad.vue";
import { useProjectStore } from "@/store/project";
import { useLayoutStore } from "@/store/layout";
import StiffnessMatrix from "./StiffnessMatrix.vue";
import { computed } from "vue";

const projectStore = useProjectStore();
const layoutStore = useLayoutStore();

const element = computed(() => {
  return useProjectStore().solver.domain.getElement(projectStore.selection.label);
});
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item v-if="projectStore.selection.type === 'element'" link class="text-body-2">
      <template #prepend>
        <div class="pr-2"><v-icon size="x-small" icon="mdi-pencil" /></div>
      </template>
      {{ $t("elements.editElement") }}
      <v-menu activator="parent" open-on-hover location="end" :close-on-content-click="false">
        <v-list density="compact" class="py-0">
          <v-row no-gutters>
            <v-col>
              <v-select
                v-model="element.nodes[0]"
                density="compact"
                label="From"
                hide-details="auto"
                item-title="label"
                item-value="label"
                :items="projectStore.solver.domain.nodes.values()"
                class="menu-select"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="element.nodes[1]"
                density="compact"
                label="To"
                hide-details="auto"
                item-title="label"
                item-value="label"
                :items="projectStore.solver.domain.nodes.values()"
                class="menu-select"
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-select
                v-model="element.mat"
                density="compact"
                label="Material"
                hide-details="auto"
                item-title="label"
                item-value="label"
                :items="projectStore.solver.domain.materials.values()"
                class="menu-select"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="element.cs"
                density="compact"
                label="Cross section"
                hide-details="auto"
                item-title="label"
                item-value="label"
                :items="projectStore.solver.domain.crossSections.values()"
                class="menu-select"
              ></v-select>
            </v-col> </v-row
        ></v-list>
      </v-menu>
    </v-list-item>
    <v-list-item
      v-if="projectStore.selection.type === 'element'"
      link
      class="text-body-2"
      @click="
        openModal(AddElementLoadDialog, { label: projectStore.selection.label });
        projectStore.selection.type = null;
      "
    >
      <template #prepend>
        <div class="pr-2"><v-icon size="x-small" icon="mdi-arrow-down-thin" /></div>
      </template>
      {{ $t("loads.addLoad") }}
    </v-list-item>
    <v-list-item
      link
      class="text-body-2"
      v-if="projectStore.selection.type === 'element'"
      @click="
        layoutStore.openWidget($t('common.stiffnessMatrix'), StiffnessMatrix, { label: projectStore.selection.label });
        projectStore.selection.type = null;
      "
    >
      {{ $t("common.stiffnessMatrix") }}
      <template #prepend>
        <div class="pr-2"><v-icon size="x-small" icon="mdi-matrix" /></div>
      </template>
    </v-list-item>
  </v-list>
</template>
