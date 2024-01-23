<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useProjectStore } from "../store/project";
import { watch } from "vue";

const projStore = useProjectStore();

const props = defineProps<{
  label: string | number;
}>();

const size = ref(0);

const update = () => {
  const el = projStore.solver.domain.elements.get(props.label as number);

  if (!el) return;

  size.value = el.computeStiffness().size()[0];
};

onMounted(() => {
  update();
});

watch(projStore.solver, () => {
  update();
});
</script>

<template>
  <div class="fill-height" style="overflow: auto">
    <v-table class="border-t text-right" density="compact">
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
