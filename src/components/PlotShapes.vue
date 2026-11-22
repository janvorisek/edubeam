<script setup lang="ts">
/**
 * Shapes of the plot drawing, in the drawing's px: its paths, the node squares, the circles and the
 * labels, in that order. Rendered without a wrapper of its own, so they are children of whatever
 * group holds them (the drawing, or the copy of what is hovered drawn on top of it). Each carries
 * the entity and the group it draws, for the highlight's style rules.
 */
import { textRuns, type ResolvedCircle, type ResolvedPath, type ResolvedText, type Tone } from '@edubeam/plot';
import { NODE_SIZE } from '@/utils/plotDrawing';

const props = defineProps<{
  paths: readonly ResolvedPath[];
  nodes: readonly { readonly id: string; readonly x: number; readonly y: number }[];
  circles: readonly ResolvedCircle[];
  texts: readonly ResolvedText[];
  /** The labels' size where a label has none of its own, px */
  fontSize: number;
}>();

/** A label's text in runs: a power of ten's exponent raised (see textRuns) */
const runsOf = (t: ResolvedText) => textRuns(t.text, t.size ?? props.fontSize);

/** Colours come from the drawing's CSS custom properties */
const colour = (tone: Tone | 'paper') => `var(--ebp-${tone})`;
</script>

<template>
  <path
    v-for="(p, i) in paths"
    :key="`p${i}`"
    :data-e="p.entity"
    :data-g="p.group"
    :d="p.d"
    :stroke="p.width > 0 ? colour(p.tone) : 'none'"
    :stroke-width="p.width > 0 ? p.width : undefined"
    :stroke-opacity="p.opacity"
    :stroke-dasharray="p.dash"
    :stroke-linecap="p.cap ?? 'round'"
    stroke-linejoin="round"
    :fill="p.fill === 'tone' ? colour(p.tone) : p.fill === 'paper' ? colour('paper') : 'none'"
    :fill-opacity="p.fillOpacity"
  />
  <!-- The nodes, as the editor draws them: a small square on each, under a hinge's circle -->
  <rect
    v-for="n in nodes"
    :key="`n${n.id}`"
    :data-e="`node:${n.id}`"
    data-g="nodes"
    :x="n.x - NODE_SIZE / 2"
    :y="n.y - NODE_SIZE / 2"
    :width="NODE_SIZE"
    :height="NODE_SIZE"
    :fill="colour('ink')"
  />
  <circle
    v-for="(c, i) in circles"
    :key="`c${i}`"
    :data-e="c.entity"
    :data-g="c.group"
    :cx="c.cx"
    :cy="c.cy"
    :r="c.r"
    :stroke="colour(c.tone)"
    :stroke-width="c.width"
    :fill="c.fill === 'paper' ? colour('paper') : colour(c.tone)"
  />
  <template v-for="(t, i) in texts" :key="`t${i}`">
    <!-- A label in more than one run (a raised exponent) gets its halo as a text of its own
         underneath: painted per run, the exponent's halo would cover the end of the digit before it -->
    <text
      v-if="runsOf(t).length > 1"
      aria-hidden="true"
      data-halo
      :data-e="t.entity"
      :data-g="t.group"
      :x="t.x"
      :y="t.y"
      :text-anchor="t.anchor"
      :transform="t.transform"
      :fill="colour('paper')"
      :font-weight="t.weight"
      :font-size="t.size"
      :font-style="t.italic ? 'italic' : undefined"
    >
      <tspan v-for="(r, k) in runsOf(t)" :key="k" :font-size="r.size" :dy="r.dy">{{ r.text }}</tspan>
    </text>
    <text
      :class="{ 'ebp-nohalo': runsOf(t).length > 1 }"
      :data-e="t.entity"
      :data-g="t.group"
      :x="t.x"
      :y="t.y"
      :text-anchor="t.anchor"
      :transform="t.transform"
      :fill="colour(t.tone)"
      :font-weight="t.weight"
      :font-size="t.size"
      :font-style="t.italic ? 'italic' : undefined"
    >
      <tspan v-for="(r, k) in runsOf(t)" :key="k" :font-size="r.size" :dy="r.dy">{{ r.text }}</tspan>
    </text>
  </template>
</template>
