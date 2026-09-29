<template>
  <div class="first-beam-task elevation-3 rounded-lg bg-surface" role="status" aria-live="polite">
    <div class="d-flex align-center pl-4 pr-1 pt-1">
      <span class="text-caption text-medium-emphasis">
        {{ $t('firstBeam.title') }} · {{ $t('firstBeam.step', { n: index + 1, total: firstBeamSteps.length }) }}
      </span>
      <v-spacer />
      <v-btn
        icon="mdi-close"
        size="small"
        variant="text"
        density="comfortable"
        :aria-label="$t('firstBeam.close')"
        @click="appStore.firstBeamActive = false"
      />
    </div>
    <div class="px-4 pb-3">
      <div class="text-body-1 font-weight-medium mb-1">{{ $t(`firstBeam.steps.${step.id}.title`) }}</div>
      <div class="text-body-2 text-medium-emphasis">{{ $t(`firstBeam.steps.${step.id}.body`, labels) }}</div>
      <div v-if="step.tip" class="d-flex justify-end mt-2">
        <v-btn color="primary" variant="text" size="small" @click="seen.add(step.id)">
          {{ $t('firstBeam.next') }}
        </v-btn>
      </div>
      <div v-if="step.id === 'results'" class="d-flex justify-end mt-2">
        <v-btn color="primary" variant="flat" size="small" @click="appStore.firstBeamActive = false">
          {{ $t('firstBeam.finish') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { currentFirstBeamStep, firstBeamState, firstBeamSteps, type FirstBeamStepId } from '@/utils/firstBeam';

const emit = defineEmits<{
  /** The beam is drawn; the add element mode would otherwise keep going from its end. */
  (e: 'drawn'): void;
}>();

const { t } = useI18n();
const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();

const seen = reactive(new Set<FirstBeamStepId>());

const step = computed(() =>
  currentFirstBeamStep(
    firstBeamState(
      projectStore.solver,
      appStore.mouseMode,
      projectStore.solveDiagnostics.errors.length + projectStore.solveDiagnostics.incomplete.length,
      viewerStore.settingsOpen,
      seen
    )
  )
);
const index = computed(() => firstBeamSteps.indexOf(step.value));

// The steps name buttons, so they read them from where the buttons do.
const labels = computed(() => ({
  ...appStore.axes,
  elementsTab: t('tabs.elements'),
  addElement: t('elements.addElement'),
  defineSupports: t('nodes.defineSupports'),
  addLoad: t('loads.addLoad'),
  undo: t('common.undo'),
}));

const drawn = computed(() => index.value > firstBeamSteps.findIndex((s) => s.id === 'draw'));

watch(drawn, (isDrawn) => {
  if (isDrawn) emit('drawn');
});

// The step's button is pointed at rather than pressed for the user, so they learn where it is.
// Pressing it is what moves a tip on.
let highlighted: Element | null = null;
let markSeen: (() => void) | null = null;

const highlight = (id?: FirstBeamStepId, selector?: string) => {
  highlighted?.classList.remove('first-beam-target');
  if (markSeen) highlighted?.removeEventListener('click', markSeen);

  highlighted = selector ? document.querySelector(selector) : null;
  markSeen = id ? () => seen.add(id) : null;

  highlighted?.classList.add('first-beam-target');
  if (markSeen) highlighted?.addEventListener('click', markSeen);
};

watch(
  step,
  ({ id, target }) => {
    if (id === 'tool') {
      appStore.bottomBarOpen = true;
      appStore.bottomBarTab = 'tab-elements';
    }
    // The tab has to render before its button can be found.
    requestAnimationFrame(() => {
      if (step.value.id === id) highlight(id, target);
    });
  },
  { immediate: true }
);

onUnmounted(() => highlight());
</script>

<style scoped>
.first-beam-task {
  position: absolute;
  z-index: 100;
  left: 16px;
  /* Clear of the grid and units chips along the bottom edge. */
  bottom: 56px;
  width: min(360px, calc(100% - 32px));
}
</style>

<style>
.first-beam-target {
  animation: first-beam-pulse 1.4s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

@keyframes first-beam-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.7);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(var(--v-theme-primary), 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .first-beam-target {
    animation: none;
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }
}
</style>
