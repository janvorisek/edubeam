<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import type { FreeMotion } from '@/utils/validateSolverModel';

/**
 * Points at what a solve diagnostic is about: a ring around each node an issue names, and
 * for a mechanism a ghost of the structure swinging through the motion nothing resists.
 * Seeing the frame slide off its rollers teaches more than reading that it can.
 *
 * It plays a few swings after each change and then gets out of the way; a structure
 * swinging the whole time someone works on it is noise. An unfinished model is quieter
 * still: no rings, and its motion only when asked for.
 */
const props = defineProps<{
  scale: number;
  /** Show how an unfinished model can move, not just a wrong one. */
  showIncomplete: boolean;
  /** Keep swinging, while the pointer is on the message that explains it. */
  hold: boolean;
}>();

const projectStore = useProjectStore();
const viewerStore = useViewerStore();

/** Ring radius and swing amplitude, in screen pixels so they read the same at any zoom. */
const RING_RADIUS_PX = 13;
const AMPLITUDE_PX = 36;
/** One full swing, there and back. */
const PERIOD_MS = 2400;
/** Swings played after each change before the ghost goes away. */
const SWINGS = 3;

const rings = computed(() => {
  const levels = new Map<string, 'error' | 'warning'>();
  const { errors } = projectStore.solveDiagnostics;

  for (const issue of projectStore.visibleWarnings) for (const label of issue.nodes ?? []) levels.set(label, 'warning');
  // An error outranks a warning on the same node.
  for (const issue of errors) for (const label of issue.nodes ?? []) levels.set(label, 'error');

  return [...levels]
    .map(([label, level]) => ({ node: projectStore.solver.domain.nodes.get(label), level }))
    .filter((ring) => ring.node !== undefined)
    .map(({ node, level }) => ({ key: String(node!.label), x: node!.coords[0], z: node!.coords[2], level }));
});

const motions = computed(() => {
  // Hidden, the rings still point at the problem; only the outline goes.
  if (!viewerStore.showMechanisms) return [];

  const { errors, incomplete } = projectStore.solveDiagnostics;
  const shown = props.showIncomplete || props.hold ? [...errors, ...incomplete] : errors;

  return shown
    .filter((issue): issue is typeof issue & { motion: FreeMotion } => issue.motion !== undefined)
    .map(({ motion, level }) => ({ motion, level }));
});

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * Without animation the outline stands still at one end of its swing. A still outline is no
 * distraction, so it stays for as long as the issue does instead of going after a few swings.
 */
const still = computed(() => reducedMotion || !viewerStore.animateMechanisms);

/** Where the swing is, from -1 to 1. Held at one end when the viewer asked for less motion. */
const phase = ref(0);
const playing = ref(false);
let frame = 0;
let startedAt = 0;
let endsAt = 0;

const stop = () => {
  cancelAnimationFrame(frame);
  frame = 0;
  playing.value = false;
};

const tick = (time: number) => {
  if (!props.hold && time >= endsAt) return stop();

  phase.value = Math.sin((2 * Math.PI * (time - startedAt)) / PERIOD_MS);
  frame = requestAnimationFrame(tick);
};

const play = () => {
  if (still.value) {
    stop();
    return;
  }

  startedAt = performance.now();
  endsAt = startedAt + SWINGS * PERIOD_MS;
  playing.value = true;
  if (frame === 0) frame = requestAnimationFrame(tick);
};

// Every solve hands over new diagnostics, so each edit that leaves a mechanism shows it again.
watch([motions, still], ([current]) => (current.length > 0 ? play() : stop()), { immediate: true });

// Letting go finishes the swing under way instead of cutting it off mid air.
watch(
  () => props.hold,
  (hold) => {
    if (hold) {
      if (motions.value.length > 0) play();
      return;
    }
    if (!playing.value) return;
    const now = performance.now();
    endsAt = Math.max(endsAt, startedAt + Math.ceil((now - startedAt) / PERIOD_MS) * PERIOD_MS);
  }
);

onBeforeUnmount(stop);

/** Every element whose two ends move, drawn at its displaced position. */
const ghosts = computed(() => {
  const amplitude = (AMPLITUDE_PX / (props.scale || 1)) * (still.value ? 1 : phase.value);
  const lines: { key: string; points: string; level: string }[] = [];
  if (!playing.value && !still.value) return lines;

  motions.value.forEach(({ motion, level }, index) => {
    for (const beam of projectStore.beams) {
      const ends = beam.nodes.map((label) => {
        const node = projectStore.solver.domain.nodes.get(label);
        const move = motion.get(String(label));
        if (!node || !move) return null;

        return `${node.coords[0] + move[0] * amplitude},${node.coords[2] + move[1] * amplitude}`;
      });

      if (ends[0] && ends[1]) lines.push({ key: `${index}-${beam.label}`, points: ends.join(' '), level });
    }
  });

  return lines;
});
</script>

<template>
  <g :class="['solve-issues', { still }]" data-fit-ignore="solve-issues" pointer-events="none">
    <polyline
      v-for="ghost in ghosts"
      :key="ghost.key"
      :points="ghost.points"
      :class="['ghost', ghost.level]"
      vector-effect="non-scaling-stroke"
    />
    <circle
      v-for="ring in rings"
      :key="ring.key"
      :cx="ring.x"
      :cy="ring.z"
      :r="RING_RADIUS_PX / (scale || 1)"
      :class="['ring', ring.level]"
      vector-effect="non-scaling-stroke"
    />
  </g>
</template>

<style scoped>
.ghost {
  fill: none;
  stroke-width: 2.5;
  stroke-dasharray: 6 4;
  stroke-linecap: round;
  opacity: 0.75;
}

.ghost.error {
  stroke: rgb(var(--v-theme-error));
}

.ghost.incomplete {
  stroke: rgb(var(--v-theme-info));
}

.ring {
  fill: none;
  stroke-width: 2.5;
}

.ring.error {
  stroke: rgb(var(--v-theme-error));
  animation: pulse 0.6s ease-in-out 6 alternate;
}

.ring.warning {
  stroke: rgb(var(--v-theme-warning));
}

@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ring.error {
    animation: none;
  }
}

.still .ring.error {
  animation: none;
}
</style>
