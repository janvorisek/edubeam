<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal';
import AddElementLoadDialog from './dialogs/AddElementLoad.vue';
import { useProjectStore } from '@/store/project';
import { useLayoutStore } from '@/store/layout';
import StiffnessMatrix from './StiffnessMatrix.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { deleteElement, setUnsolved, solve } from '../utils';

const projectStore = useProjectStore();
const layoutStore = useLayoutStore();

const n1 = ref('');
const n2 = ref('');

const element = computed(() => {
  return useProjectStore().solver.domain.getElement(projectStore.selection.label);
});

const removeElement = () => {
  if (projectStore.selection.type !== 'element' || projectStore.selection.label === null) return;

  deleteElement(String(projectStore.selection.label));
};

onMounted(() => {
  n1.value = element.value.nodes[0];
  n2.value = element.value.nodes[1];
});

watch([n1, n2], () => {
  setUnsolved();
  element.value.nodes = [n1.value, n2.value];
  solve();
});
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item v-if="projectStore.selection.type === 'element'" link class="text-body-2">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-pencil" /></div>
      </template>
      {{ $t('elements.editElement') }}
      <v-menu activator="parent" open-on-click location="end" :close-on-content-click="false">
        <v-list density="compact" class="py-0">
          <v-row no-gutters>
            <v-col>
              <v-select
                v-model="n1"
                density="compact"
                label="From"
                hide-details="auto"
                item-title="label"
                item-value="label"
                :items="projectStore.nodes"
                class="menu-select"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="n2"
                density="compact"
                label="To"
                hide-details="auto"
                item-title="label"
                item-value="label"
                :items="projectStore.nodes"
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
                :items="projectStore.materials"
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
                :items="projectStore.crossSections"
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
        <div class="pr-2"><v-icon size="16" icon="mdi-arrow-down-thin" /></div>
      </template>
      {{ $t('loads.addLoad') }}
    </v-list-item>
    <v-list-item
      v-if="projectStore.selection.type === 'element'"
      link
      class="text-body-2"
      @click="
        layoutStore.openWidget($t('common.stiffnessMatrix'), StiffnessMatrix, { label: projectStore.selection.label });
        projectStore.selection.type = null;
      "
    >
      {{ $t('common.stiffnessMatrix') }}
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-matrix" /></div>
      </template>
    </v-list-item>
    <v-divider v-if="projectStore.selection.type === 'element'" />
    <v-list-item
      v-if="projectStore.selection.type === 'element'"
      link
      class="text-body-2 text-error"
      @click="removeElement"
    >
      <template #prepend>
        <div class="pr-2"><v-icon size="16" color="error" icon="mdi-delete" /></div>
      </template>
      {{ $t('common.delete') }}
    </v-list-item>
  </v-list>
</template>
