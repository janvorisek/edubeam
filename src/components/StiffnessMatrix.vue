<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useProjectStore } from '../store/project';
import { watch } from 'vue';

const projStore = useProjectStore();

const props = defineProps<{
  label: string;
}>();

const size = ref(0);

const update = () => {
  if (!elementHasMaterialAndCS.value) return;

  const el = projStore.solver.domain.getElement(props.label);

  if (!el) return;

  size.value = el.computeStiffness().size()[0];
};

onMounted(() => {
  update();
});

watch(projStore.solver, () => {
  update();
});

const elementHasMaterialAndCS = computed(() => {
  const el = projStore.solver.domain.getElement(props.label);

  if (!el) return false;

  const mat = projStore.solver.domain.materials.get(el.mat);
  const cs = projStore.solver.domain.crossSections.get(el.cs);

  if (!mat || !cs) return false;

  return true;
});
</script>

<template>
  <div class="fill-height" style="overflow: auto">
    <v-table v-if="elementHasMaterialAndCS" class="border-t text-right" density="compact">
      <tbody>
        <tr v-for="i in size">
          <td v-for="j in size" :class="{ 'bg-grey-lighten-3 font-weight-medium': i === j }" class="px-1">
            {{
              projStore.solver.domain.elements
                .get(props.label as number)
                .computeStiffness()
                .get([i - 1, j - 1])
                .toExponential(2)
            }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-else class="pa-3">Element does not specify material or cross section.</div>
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
