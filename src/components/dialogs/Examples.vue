<template>
  <v-dialog v-model="open" max-width="960" scrollable>
    <v-card class="pa-1">
      <v-card-title>
        <div class="d-flex">
          <div class="flex-grow-1">{{ $t('examples.title') }}</div>
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
        <p class="text-body-2 text-medium-emphasis mb-4">{{ $t('examples.instructions') }}</p>

        <div class="examples-grid">
          <button v-for="example in previews" :key="example.id" class="example-card" @click="load(example)">
            <div class="example-preview" aria-hidden="true">
              <SVGElementViewer
                :id="`example-${example.id}`"
                :solver="example.solver"
                :nodes="example.nodes"
                :elements="example.elements"
                :nodal-loads="example.nodalLoads"
                :element-loads="example.elementLoads"
                :show-loads="example.viewer.showLoads"
                :show-reactions="example.viewer.showReactions"
                :show-deformed-shape="example.viewer.showDeformedShape"
                :show-normal-force="example.viewer.showNormalForce"
                :show-shear-force="example.viewer.showShearForce"
                :show-moments="example.viewer.showMoments"
                :padding="6"
                :mobile-padding="6"
                :results-scale-px="28"
                :convert-force="convertForce"
                :convert-moment="convertMoment"
                :zoom-enabled="false"
                :support-size="0.5"
              />
            </div>
            <div class="example-copy">
              <div class="text-body-2 font-weight-medium">{{ example.title }}</div>
              <div class="text-caption text-medium-emphasis">{{ example.blurb }}</div>
            </div>
          </button>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          variant="text"
          size="small"
          :href="docsUrl('/examples/', 'examples-panel')"
          target="_blank"
          rel="noopener"
          append-icon="mdi-open-in-new"
          @click="trackDocsClick('examples-panel')"
        >
          {{ $t('examples.moreInDocs') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import SVGElementViewer from '../SVGElementViewer.vue';
import { buildExampleSolver, createExampleLibrary, examples, type ExampleDefinition } from '@/utils/examples';
import { docsUrl, trackDocsClick } from '@/utils/docs';
import { executeModelMutationWithUndo } from '@/utils';
import { useProjectStore } from '@/store/project';
import { eventBus, EventType } from '@/EventBus';

const open = ref(true);

// Previews render in SI so a card reads the same whatever units the project uses.
const convertForce = (value: number) => value / 1000;
const convertMoment = (value: number) => value / 1000;

const previews = examples.map((example) => {
  const solver = buildExampleSolver(example);

  return {
    ...example,
    solver,
    nodes: [...solver.domain.nodes.values()],
    elements: [...solver.domain.elements.values()],
    nodalLoads: solver.loadCases[0].nodalLoadList,
    elementLoads: solver.loadCases[0].elementLoadList,
  };
});

/**
 * Replaces the project with the chosen example.
 *
 * Wrapped as a single undoable mutation, so browsing examples never costs anyone the
 * model they were working on — Ctrl+Z brings it straight back.
 */
const load = (example: ExampleDefinition) => {
  const projectStore = useProjectStore();

  executeModelMutationWithUndo(() => {
    const loadCase = projectStore.solver.loadCases[0];

    loadCase.solved = false;
    loadCase.prescribedBC = [];
    loadCase.nodalLoadList = [];
    loadCase.elementLoadList = [];

    projectStore.solver.domain.elements.clear();
    projectStore.solver.domain.nodes.clear();
    projectStore.solver.domain.materials.clear();
    projectStore.solver.domain.crossSections.clear();
    projectStore.dimensions = [];
    projectStore.clearSelection();
    projectStore.clearSelection2();

    createExampleLibrary(projectStore.solver);
    example.build(projectStore.solver);
  });

  closeModal();
  eventBus.emit(EventType.FIT_CONTENT);
};
</script>

<style scoped>
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.example-card {
  display: flex;
  flex-direction: column;
  text-align: left;
  border: 1px solid rgb(var(--v-border-color), 0.25);
  border-radius: 4px;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.example-card:hover,
.example-card:focus-visible {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

.example-preview {
  height: 140px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgb(var(--v-border-color), 0.25);
}

.example-copy {
  padding: 8px 10px 10px;
}
</style>
