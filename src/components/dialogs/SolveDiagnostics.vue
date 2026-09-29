<template>
  <v-dialog v-model="open" max-width="760">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-text>
        <p class="mb-4">{{ description }}</p>

        <div v-if="props.diagnostics.errors.length > 0" class="mb-4">
          <div class="text-subtitle-1 font-weight-medium mb-2">{{ $t('solveDiagnostics.errors') }}</div>
          <div v-for="issue in props.diagnostics.errors" :key="issue.code + issue.message" class="issue">
            <v-icon color="error" size="small" class="issue-icon">mdi-alert-circle</v-icon>
            <span class="issue-message">{{ issue.message }}</span>
          </div>
        </div>

        <div v-if="props.diagnostics.incomplete.length > 0" class="mb-4">
          <div class="text-subtitle-1 font-weight-medium mb-2">{{ $t('solveDiagnostics.incomplete') }}</div>
          <div v-for="issue in props.diagnostics.incomplete" :key="issue.code + issue.message" class="issue">
            <v-icon color="info" size="small" class="issue-icon">mdi-information</v-icon>
            <span class="issue-message">{{ issue.message }}</span>
          </div>
        </div>

        <div v-if="props.diagnostics.warnings.length > 0">
          <div class="text-subtitle-1 font-weight-medium mb-2">{{ $t('solveDiagnostics.warnings') }}</div>
          <div v-for="issue in props.diagnostics.warnings" :key="issue.code + issue.message" class="issue">
            <v-icon color="warning" size="small" class="issue-icon">mdi-alert</v-icon>
            <span class="issue-message">{{ issue.message }}</span>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-switch
          v-if="hasFreeMotion"
          v-model="viewerStore.showMechanisms"
          :label="$t('settings.show_mechanisms')"
          color="primary"
          density="compact"
          hide-details
          inset
          class="ml-2 flex-grow-0"
        />
        <v-btn
          variant="text"
          size="small"
          :href="docsUrl('/reference/troubleshooting', 'solve-diagnostics')"
          target="_blank"
          rel="noopener"
          append-icon="mdi-open-in-new"
          @click="trackDocsClick('solve-diagnostics')"
        >
          {{ $t('help.troubleshooting') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">{{ $t('common.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { popModal } from 'jenesius-vue-modal';
import type { SolveDiagnostics } from '@/utils/validateSolverModel';
import { docsUrl, trackDocsClick } from '@/utils/docs';
import { useViewerStore } from '@/store/viewer';

const { t } = useI18n();

const open = ref(true);

const props = defineProps<{
  diagnostics: SolveDiagnostics;
}>();

/** Errors say something is wrong, an unfinished model only that it is not done yet. */
const state = computed(() =>
  props.diagnostics.errors.length > 0 ? 'blocked' : props.diagnostics.incomplete.length > 0 ? 'incomplete' : 'warnings'
);

const viewerStore = useViewerStore();

const hasFreeMotion = computed(() =>
  [...props.diagnostics.errors, ...props.diagnostics.incomplete].some((issue) => issue.motion)
);

const title = computed(() => t(`solveDiagnostics.${state.value}Title`));
const description = computed(() => t(`solveDiagnostics.${state.value}Description`));

const close = () => {
  popModal();
};
</script>

<style scoped>
.issue {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 5px 0;
}

.issue + .issue {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.issue-icon {
  flex: 0 0 auto;
  margin-top: 3px;
}

.issue-message {
  /* The messages name nodes and directions; they have to wrap or the fix is cut off. */
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 0.875rem;
  line-height: 1.45;
}
</style>
