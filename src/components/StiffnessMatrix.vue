<script setup lang="ts">
import { useProjectStore } from "../store/project";

const projStore = useProjectStore();

const props = defineProps<{
  label: string | number;
}>();

const size = projStore.solver.domain.elements
  .get(props.label as number)
  .computeStiffness()
  .size()[0];
</script>

<template>
  <div class="pa-4 fill-height" style="overflow-y: scroll">
    <div>Global stiffness matrix of element {{ props.label }}</div>
    <v-table class="border text-body-2 text-right">
      <tbody>
        <tr v-for="i in size">
          <td v-for="j in size" :class="{ 'bg-grey-lighten-3 font-weight-medium': i === j }">
            {{
              projStore.solver.domain.elements
                .get(props.label as number)
                .computeStiffness()
                .get([i - 1, j - 1])
                .toExponential(4)
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
