<script setup lang="ts">
import { computed } from 'vue';
import { useProjectStore } from '@/store/project';
import { ensureDimensionId } from '@/utils/id';

const projectStore = useProjectStore();

const selectedDimensionId = computed(() => {
  if (projectStore.selection.type !== 'dimension') return null;
  return typeof projectStore.selection.label === 'string' ? projectStore.selection.label : null;
});

const removeDimension = () => {
  if (!selectedDimensionId.value) return;

  const idToRemove = selectedDimensionId.value;
  projectStore.dimensions = projectStore.dimensions.filter((dim) => ensureDimensionId(dim) !== idToRemove);
  projectStore.selection2.dimensions = projectStore.selection2.dimensions.filter((id) => id !== idToRemove);
  projectStore.selection.label = null;
  projectStore.selection.type = null;
};
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item link class="text-body-2 text-error" @click="removeDimension">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" color="error" icon="mdi-delete" /></div>
      </template>
      {{ $t('common.delete') }}
    </v-list-item>
  </v-list>
</template>
