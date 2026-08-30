<template>
  <svg
    class="section-thumbnail"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <!-- Mirrored so that the section y axis points left, matching the editor -->
    <g transform="scale(-1 1)">
      <path v-for="(d, i) in outlinePaths" :key="`o${i}`" :d="d" class="thumb-outline" />
      <path v-for="(d, i) in holePaths" :key="`h${i}`" :d="d" class="thumb-hole" />
      <circle v-if="showCentroid" :cx="props.cy" :cy="props.cz" :r="dotR" class="thumb-centroid" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { computeSectionProperties, type SectionShape } from '@/utils/sectionProperties';

const p = withDefaults(
  defineProps<{
    shape: SectionShape;
    size?: number;
    showCentroid?: boolean;
  }>(),
  { size: 28, showCentroid: false }
);

const props = computed(() => computeSectionProperties(p.shape));

const contourPath = (points: [number, number][]) => `M${points.map((q) => `${q[0]},${q[1]}`).join('L')}Z`;

const outlinePaths = computed(() =>
  p.shape.contours.filter((c) => !c.hole && c.points.length >= 3).map((c) => contourPath(c.points))
);
const holePaths = computed(() =>
  p.shape.contours.filter((c) => c.hole && c.points.length >= 3).map((c) => contourPath(c.points))
);

const viewBox = computed(() => {
  let ymin = Infinity;
  let ymax = -Infinity;
  let zmin = Infinity;
  let zmax = -Infinity;
  for (const c of p.shape.contours) {
    for (const [y, z] of c.points) {
      ymin = Math.min(ymin, y);
      ymax = Math.max(ymax, y);
      zmin = Math.min(zmin, z);
      zmax = Math.max(zmax, z);
    }
  }
  if (!Number.isFinite(ymin)) return '0 0 1 1';
  const span = Math.max(ymax - ymin, zmax - zmin, 1e-9);
  const pad = span * 0.08;
  const s = span + 2 * pad;
  // Screen x = -y, so the box starts at -(ymax + pad).
  return `${-((ymin + ymax) / 2 + s / 2)} ${(zmin + zmax) / 2 - s / 2} ${s} ${s}`;
});

const dotR = computed(() => {
  const parts = viewBox.value.split(' ').map(Number);
  return parts[2] * 0.05;
});
</script>

<style scoped>
.section-thumbnail {
  display: inline-block;
  vertical-align: middle;
  flex: 0 0 auto;
}

.thumb-outline {
  fill: rgba(var(--v-theme-primary), 0.3);
  stroke: rgb(var(--v-theme-primary));
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
}

.thumb-hole {
  fill: rgb(var(--v-theme-surface));
  stroke: rgb(var(--v-theme-primary));
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
}

.thumb-centroid {
  fill: #e67e22;
}
</style>
