<template>
  <v-dialog v-model="open" max-width="760">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-text>
        <p class="mb-4">{{ description }}</p>

        <div v-if="props.diagnostics.errors.length > 0" class="mb-4">
          <div class="text-subtitle-1 font-weight-medium mb-2">Errors</div>
          <v-list density="compact" class="py-0">
            <v-list-item v-for="issue in props.diagnostics.errors" :key="issue.code + issue.message">
              <template #prepend>
                <v-icon color="error" size="small">mdi-alert-circle</v-icon>
              </template>
              <v-list-item-title>{{ issue.message }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <div v-if="props.diagnostics.warnings.length > 0">
          <div class="text-subtitle-1 font-weight-medium mb-2">Warnings</div>
          <v-list density="compact" class="py-0">
            <v-list-item v-for="issue in props.diagnostics.warnings" :key="issue.code + issue.message">
              <template #prepend>
                <v-icon color="warning" size="small">mdi-alert</v-icon>
              </template>
              <v-list-item-title>{{ issue.message }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { popModal } from 'jenesius-vue-modal';
import type { SolveDiagnostics } from '@/utils/validateSolverModel';

const open = ref(true);

const props = defineProps<{
  diagnostics: SolveDiagnostics;
  blocked: boolean;
}>();

const title = computed(() => (props.blocked ? 'Cannot solve model' : 'Model warnings'));
const description = computed(() =>
  props.blocked
    ? 'Fix the listed errors before solving the model.'
    : 'The model was solved, but the following warnings were detected.'
);

const close = () => {
  popModal();
};
</script>
