<template>
  <div class="d-flex fill-height">
    <div class="w-50 overflow-auto">
      <v-data-table :headers="headers" :items="nodes">
        <template #item.solution[0]="{ item }">
          <div v-html="formatExpValueAsHTML(item.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dx]), 4)"></div>
        </template>
        <template #item.solution[1]="{ item }">
          <div v-html="formatExpValueAsHTML(item.getUnknowns(projectStore.solver.loadCases[0], [DofID.Dz]), 4)"></div>
        </template>
        <template #item.solution[2]="{ item }">
          <div v-html="formatExpValueAsHTML(item.getUnknowns(projectStore.solver.loadCases[0], [DofID.Ry]), 4)"></div>
        </template>
      </v-data-table>
    </div>
    <div class="w-50 overflow-auto">
      <v-data-table :headers="elementsHeaders" :items="elements"></v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProjectStore } from '../store/project';

import { Node, Element, DofID } from 'ts-fem';
import { formatExpValueAsHTML } from '../SVGUtils';

import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
const { t } = useI18n();

const projectStore = useProjectStore();

const headers = reactive([
  { title: t('common.node'), value: 'label' },
  {
    title: 'Displacements & Rotations',
    align: 'center',
    children: [
      { title: 'U_x', value: 'solution[0]' },
      { title: 'U_z', value: 'solution[1]' },
      { title: 'R_y', value: 'solution[2]' },
    ],
  },
]);

const elementsHeaders = reactive([{ title: t('common.element'), value: 'label' }]);

const nodes = computed(() => {
  const nodeVals = projectStore.solver.domain.nodes.values();
  const display: Node[] = [];

  for (const node of nodeVals) {
    display.push(node);
  }

  // @ts-expect-error ts-fem is wrongly typed
  return display.sort((a, b) => ('' + a.label).localeCompare(b.label, undefined, { numeric: true }));
});

const elements = computed(() => {
  const elements = projectStore.solver.domain.elements.values();
  const display: Element[] = [];

  for (const element of elements) {
    display.push(element);
  }

  return display;
});
</script>
