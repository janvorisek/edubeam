<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectStore } from '../store/project';
import { watch } from 'vue';

const projectStore = useProjectStore();
</script>

<template>
  <div class="fill-height" style="overflow: auto">
    <div>
      <v-table v-if="projectStore.selection2.nodes.length > 0" density="compact">
        <thead>
          <tr>
            <th>{{ $t('common.node') }}</th>
            <th>x</th>
            <th>z</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="label in projectStore.selection2.nodes">
            <td>{{ label }}</td>
            <td>{{ projectStore.solver.domain.nodes.get(label).coords[0].toFixed(2) }}</td>
            <td>{{ projectStore.solver.domain.nodes.get(label).coords[1].toFixed(2) }}</td>
          </tr>
        </tbody>
      </v-table>
      <v-table v-if="projectStore.selection2.elements.length > 0" density="compact">
        <thead>
          <tr>
            <th>{{ $t('common.element') }}</th>
            <th>{{ $t('common.type') }}</th>
            <th colspan="2">{{ $t('common.nodes') }}</th>
            <th>{{ $t('common.material') }}</th>
            <th>{{ $t('common.crossSection') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="label in projectStore.selection2.elements">
            <td>{{ label }}</td>
            <td>Beam2D</td>
            <td>{{ projectStore.solver.domain.elements.get(label).nodes[0] }}</td>
            <td>{{ projectStore.solver.domain.elements.get(label).nodes[1] }}</td>
            <td>{{ projectStore.solver.domain.elements.get(label).mat }}</td>
            <td>{{ projectStore.solver.domain.elements.get(label).cs }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<style scoped>
table th + th {
  border-left: 1px solid #dddddd;
}
table td + td {
  border-left: 1px solid #dddddd;
}
</style>
