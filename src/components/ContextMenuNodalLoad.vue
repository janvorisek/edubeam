<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal';
import EditNodalLoadDialog from './dialogs/EditNodalLoad.vue';
import { deleteNodalLoad, deletePrescribedDisplacement } from '@/utils';
import { useProjectStore } from '@/store/project';
import { computed } from 'vue';

const projectStore = useProjectStore();

/** The same menu serves nodal forces and prescribed displacements - they only differ in the list they live in. */
const isPrescribed = computed(() => projectStore.selection.type === 'prescribedbc-load');

const loadIndex = computed(() => {
  if (projectStore.selection.label === null) return null;

  const index = Number(projectStore.selection.label);
  return Number.isNaN(index) ? null : index;
});

const editNodalLoad = () => {
  if (loadIndex.value === null) return;

  openModal(EditNodalLoadDialog, {
    index: loadIndex.value,
    type: isPrescribed.value ? 'displacement' : 'force',
  });
  projectStore.selection.type = null;
};

const removeNodalLoad = () => {
  if (loadIndex.value === null) return;

  const loadCase = projectStore.solver.loadCases[0];

  if (isPrescribed.value) {
    const prescribed = loadCase.prescribedBC[loadIndex.value];
    if (prescribed) deletePrescribedDisplacement(prescribed);
    return;
  }

  const nodalLoad = loadCase.nodalLoadList[loadIndex.value];
  if (nodalLoad) deleteNodalLoad(nodalLoad);
};
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item link class="text-body-2" @click="editNodalLoad">
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
