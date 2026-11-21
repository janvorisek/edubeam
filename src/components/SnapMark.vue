<script setup lang="ts">
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { snapKey } from '@/types/snap';

/**
 * What the point the active tool puts down has snapped to, at the point: a small mark for each
 * kind of snap, as drawing programs show theirs, and a word for it beside. A square on a node, a
 * triangle at a member's middle, a diamond at a third, an hourglass anywhere else on a member. The
 * grid and the bare pointer have none: there it is the pointer's own place.
 */
const props = defineProps<{
  /** The editor's scale, px per metre */
  scale: number;
}>();

const { t } = useI18n();
const snap = inject(snapKey)!;

/** The mark's half size, px */
const R = 6;

const mark = computed(() => {
  const s = snap.value;
  if (!s || s.kind === 'grid' || s.kind === 'free') return null;
  const words = {
    node: `${t('common.node')} ${s.node?.label ?? ''}`,
    middle: t('viewer.snapMiddle'),
    third: t('viewer.snapThird'),
    member: t('viewer.snapOnElement', { label: String(s.beam?.label ?? '') }),
  } as const;
  const shapes = {
    node: `M${-R} ${-R}H${R}V${R}H${-R}Z`,
    middle: `M0 ${-R - 1}L${R + 1} ${R}H${-R - 1}Z`,
    third: `M0 ${-R - 1}L${R + 1} 0L0 ${R + 1}L${-R - 1} 0Z`,
    member: `M${-R} ${-R}H${R}L${-R} ${R}H${R}Z`,
  } as const;
  return { x: s.x, y: s.y, shape: shapes[s.kind], word: words[s.kind] };
});
</script>

<template>
  <g
    v-if="mark"
    class="snap-mark"
    :transform="`translate(${mark.x} ${mark.y}) scale(${1 / props.scale})`"
    pointer-events="none"
  >
    <path :d="mark.shape" class="snap-mark-halo" />
    <path :d="mark.shape" class="snap-mark-shape" />
    <!-- Up and to the right: a pointer's arrow covers the space down and to the right of its tip -->
    <text :x="R + 6" :y="-R - 4" class="snap-mark-word">{{ mark.word }}</text>
  </g>
</template>

<style scoped lang="scss">
/* Its own colour: not a load's, a result's, a reaction's, nor the selection's blue */
.snap-mark {
  --snap: #0f9d58;
}

.snap-mark-shape {
  fill: none;
  stroke: var(--snap);
  stroke-width: 2px;
  stroke-linejoin: round;
}

.snap-mark-halo {
  fill: none;
  stroke: #ffffff;
  stroke-width: 5px;
  stroke-linejoin: round;
  opacity: 0.9;
}

.snap-mark-word {
  fill: var(--snap);
  font-size: 12px;
  font-weight: 600;
  paint-order: stroke;
  stroke: #ffffff;
  stroke-width: 3.5px;
  stroke-linejoin: round;
}
</style>
