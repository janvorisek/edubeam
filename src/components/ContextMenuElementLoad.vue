<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal';
import EditElementLoadDialog from './dialogs/EditElementLoad.vue';
import { useProjectStore } from '@/store/project';
import { computed } from 'vue';

const projectStore = useProjectStore();

const load = computed(() => {
  return projectStore.solver.loadCases[0].elementLoadList[projectStore.selection.label];
});
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
  </v-list>
</template>
