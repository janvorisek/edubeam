<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal';
import EditElementLoadDialog from './dialogs/EditElementLoad.vue';
import { deleteElementLoad } from '@/utils';
import { useProjectStore } from '@/store/project';
import { computed } from 'vue';

const projectStore = useProjectStore();

const load = computed(() => {
  return projectStore.solver.loadCases[0].elementLoadList[projectStore.selection.label];
});

const removeElementLoad = () => {
  if (projectStore.selection.label === null || !load.value) return;

  const index = Number(projectStore.selection.label);
  if (Number.isNaN(index)) return;

  deleteElementLoad(load.value, index);
};
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item
      link
      class="text-body-2"
      @click="
        openModal(EditElementLoadDialog, { index: projectStore.selection.label });
        projectStore.selection.type = null;
      "
    >
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-pencil" /></div>
      </template>
      {{ $t('loads.editLoad') }}
    </v-list-item>
    <v-divider />
    <v-list-item link class="text-body-2 text-error" @click="removeElementLoad">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" color="error" icon="mdi-delete" /></div>
      </template>
      {{ $t('common.delete') }}
    </v-list-item>
  </v-list>
</template>
