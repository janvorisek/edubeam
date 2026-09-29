<template>
  <v-dialog v-model="open" max-width="960" scrollable>
    <v-card class="pa-1">
      <v-card-title>
        <div class="d-flex">
          <div class="flex-grow-1">{{ $t('recentStructures.title') }}</div>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            class="ml-1"
            :aria-label="$t('dialogs.common.cancel')"
            @click.prevent.stop="closeModal()"
          />
        </div>
      </v-card-title>
      <v-card-text class="pt-0">
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ $t('recentStructures.instructions', { count: RECENT_STRUCTURES_LIMIT }) }}
        </p>

        <p v-if="previews.length === 0" class="text-body-2 recent-empty">{{ $t('recentStructures.empty') }}</p>

        <div v-else class="recent-grid">
          <div v-for="{ entry, ...preview } in previews" :key="entry.id" class="recent-card">
            <button class="recent-preview" :aria-label="$t('recentStructures.restore')" @click="restore(entry)">
              <SVGElementViewer
                :id="`recent-${entry.id}`"
                :solver="preview.solver"
                :nodes="preview.nodes"
                :elements="preview.elements"
                :nodal-loads="preview.nodalLoads"
                :element-loads="preview.elementLoads"
                :show-loads="true"
                :show-reactions="false"
                :show-deformed-shape="false"
                :show-normal-force="false"
                :show-shear-force="false"
                :show-moments="false"
                :padding="6"
                :mobile-padding="6"
                :zoom-enabled="false"
                :results-scale-px="28"
                :convert-force="convertForce"
                :convert-moment="convertMoment"
                :convert-force-distance="convertForce"
                :support-size="0.5"
              />
            </button>
            <div class="recent-copy">
              <div class="d-flex align-start">
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ $t(`recentStructures.reasons.${entry.reason}`) }}
                  </div>
                  <div class="text-caption text-medium-emphasis">{{ formatDate(entry.savedAt) }}</div>
                </div>
                <v-btn
                  icon="mdi-delete-outline"
                  size="small"
                  variant="text"
                  density="comfortable"
                  class="mt-n1 mr-n1"
                  :aria-label="$t('recentStructures.remove')"
                  @click="recentStructures.remove(entry.id)"
                />
              </div>
              <div class="d-flex align-center mt-1">
                <div class="flex-grow-1 text-caption text-medium-emphasis">
                  {{ $t('recentStructures.counts', { nodes: entry.nodes, elements: entry.elements }) }}
                </div>
                <v-btn size="small" variant="tonal" color="primary" class="text-none" @click="restore(entry)">
                  {{ $t('recentStructures.restore') }}
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { LinearStaticSolver } from 'ts-fem';
import SVGElementViewer from '../SVGElementViewer.vue';
import { deserializeModel, parseSerializedModel, replaceModel, resetModel } from '@/utils';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { RECENT_STRUCTURES_LIMIT, useRecentStructuresStore, type RecentStructure } from '@/store/recentStructures';
import { eventBus, EventType } from '@/EventBus';
import type { DimensionLine } from '@/types/dimension';

const open = ref(true);
const recentStructures = useRecentStructuresStore();
const appStore = useAppStore();

// Previews render in SI, like the examples gallery, so a card reads the same whatever units the project uses.
const convertForce = (value: number) => value / 1000;
const convertMoment = (value: number) => value / 1000;

const previews = computed(() =>
  recentStructures.entries.map((entry) => {
    const solver = new LinearStaticSolver();
    const dimensions: DimensionLine[] = [];
    deserializeModel(entry.model, solver, dimensions);

    return {
      entry,
      solver,
      nodes: [...solver.domain.nodes.values()],
      elements: [...solver.domain.elements.values()],
      nodalLoads: solver.loadCases[0].nodalLoadList,
      elementLoads: solver.loadCases[0].elementLoadList,
    };
  })
);

const formatDate = (time: number) => {
  try {
    return new Intl.DateTimeFormat(appStore.locale, { dateStyle: 'medium', timeStyle: 'short' }).format(time);
  } catch {
    return new Date(time).toLocaleString();
  }
};

/** Undoable like any other replacement, and the structure it replaces is kept in turn. */
const restore = (entry: RecentStructure) => {
  if (parseSerializedModel(entry.model) === null) return;

  const projectStore = useProjectStore();

  replaceModel('restore', () => {
    resetModel();
    projectStore.clearSelection();
    projectStore.clearSelection2();
    deserializeModel(entry.model, projectStore.solver, projectStore.dimensions);
  });
  projectStore.solve();

  closeModal();
  eventBus.emit(EventType.FIT_CONTENT);
};
</script>

<style scoped>
.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.recent-card {
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(var(--v-border-color), 0.25);
  border-radius: 4px;
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.recent-card:hover,
.recent-card:focus-within {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

.recent-preview {
  height: 140px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgb(var(--v-border-color), 0.25);
  background: transparent;
  cursor: pointer;
}

.recent-copy {
  padding: 8px 8px 8px 10px;
}

.recent-empty {
  padding: 24px 0;
}
</style>
