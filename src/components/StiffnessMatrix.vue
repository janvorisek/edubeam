<script setup lang="ts">
import { computed } from 'vue';
import type { Matrix } from 'mathjs';
import { useProjectStore } from '../store/project';

const projStore = useProjectStore();

const props = defineProps<{
  label: string | number;
}>();

/**
 * The widget stays open while the model changes under it, so the element it was opened for can be
 * deleted or renamed. Look it up without `getElement`, which throws for a missing label.
 */
const element = computed(() => projStore.solver.domain.elements.get(String(props.label)));

const elementHasMaterialAndCS = computed(() => {
  const el = element.value;
  if (!el) return false;

  const { materials, crossSections } = projStore.solver.domain;

  return materials.has(String(el.mat)) && crossSections.has(String(el.cs));
});

const stiffness = computed(() =>
  elementHasMaterialAndCS.value ? ((element.value.computeStiffness() as Matrix).toArray() as number[][]) : []
);
</script>

<template>
  <div class="fill-height" style="overflow: auto">
    <div v-if="!element" class="pa-3">{{ $t('warnings.elementMissing', { label: String(props.label) }) }}</div>
    <v-table v-else-if="elementHasMaterialAndCS" class="border-t text-right" density="compact">
      <tbody>
        <tr v-for="(row, i) in stiffness" :key="i">
          <td
            v-for="(value, j) in row"
            :key="j"
            :class="{ 'bg-grey-lighten-3 font-weight-medium': i === j }"
            class="px-1"
          >
            {{ value.toExponential(2) }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-else class="pa-3">{{ $t('warnings.noMaterialOrCrossSection') }}</div>
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
