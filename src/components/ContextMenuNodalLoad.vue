<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal';
import EditNodalLoadDialog from './dialogs/EditNodalLoad.vue';
import { deleteNodalLoad } from '@/utils';
import { useProjectStore } from '@/store/project';
import { computed } from 'vue';

const projectStore = useProjectStore();

const load = computed(() => {
  return projectStore.solver.loadCases[0].nodalLoadList[projectStore.selection.label];
});

const removeNodalLoad = () => {
  if (projectStore.selection.label === null) return;

  const nodalIndex = Number(projectStore.selection.label);
  if (Number.isNaN(nodalIndex)) return;

  const selectedLoad = projectStore.solver.loadCases[0].nodalLoadList[nodalIndex];
  if (!selectedLoad) return;

  const elementLoadCount = projectStore.solver.loadCases[0].elementLoadList.length;
  const prescribedCount = projectStore.solver.loadCases[0].prescribedBC.length;
  const aggregatedIndex = elementLoadCount + prescribedCount + nodalIndex;

  deleteNodalLoad(selectedLoad, aggregatedIndex);
};
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item
      link
      class="text-body-2"
      @click="
        openModal(EditNodalLoadDialog, { index: projectStore.selection.label });
        projectStore.selection.type = null;
      "
    >
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-pencil" /></div>
      </template>
      {{ $t('loads.editLoad') }}
    </v-list-item>
    <v-divider />
    <v-list-item link class="text-body-2 text-error" @click="removeNodalLoad">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" color="error" icon="mdi-delete" /></div>
      </template>
      {{ $t('common.delete') }}
    </v-list-item>
  </v-list>
</template>
