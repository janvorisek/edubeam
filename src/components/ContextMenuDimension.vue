<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useProjectStore } from '@/store/project';
import { ensureDimensionId } from '@/utils/id';

const projectStore = useProjectStore();

const selectedDimensionId = computed(() => {
  if (projectStore.selection.type !== 'dimension') return null;
  return typeof projectStore.selection.label === 'string' ? projectStore.selection.label : null;
});

const selectedDimension = computed(() => {
  if (!selectedDimensionId.value) return null;
  return projectStore.dimensions.find((dim) => ensureDimensionId(dim) === selectedDimensionId.value) ?? null;
});

const n1 = ref('');
const n2 = ref('');

let syncingFromDimension = false;

watch(
  selectedDimension,
  (dim) => {
    syncingFromDimension = true;
    n1.value = dim?.nodes[0]?.label?.toString() ?? '';
    n2.value = dim?.nodes[1]?.label?.toString() ?? '';
    syncingFromDimension = false;
  },
  { immediate: true }
);

watch([n1, n2], ([newN1, newN2]) => {
  if (syncingFromDimension) return;
  const dim = selectedDimension.value;
  if (!dim) return;
  if (!newN1 || !newN2) return;
  if (newN1 === newN2) return;

  const currentN1 = dim.nodes[0]?.label?.toString();
  const currentN2 = dim.nodes[1]?.label?.toString();
  if (currentN1 === newN1 && currentN2 === newN2) return;

  const node1 = projectStore.solver.domain.nodes.get(newN1);
  const node2 = projectStore.solver.domain.nodes.get(newN2);
  if (!node1 || !node2) return;

  dim.nodes = [node1, node2];
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
    <v-list-item v-if="selectedDimension" link class="text-body-2">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-pencil" /></div>
      </template>
      {{ $t('common.edit') }}
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
                style="width: 90px"
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
                style="width: 90px"
              ></v-select>
            </v-col>
          </v-row>
        </v-list>
      </v-menu>
    </v-list-item>
    <v-divider v-if="selectedDimension" class="my-1" />
    <v-list-item link class="text-body-2 text-error" @click="removeDimension">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" color="error" icon="mdi-delete" /></div>
      </template>
      {{ $t('common.delete') }}
    </v-list-item>
  </v-list>
</template>
