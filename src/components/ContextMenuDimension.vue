<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue';
import { useProjectStore } from '@/store/project';
import { ensureDimensionId } from '@/utils/id';
import { resolveDimensionPoints } from '@/types/dimension';
import { executeModelMutationWithUndo, parseFloat2 } from '@/utils';
import { useI18n } from 'vue-i18n';

const projectStore = useProjectStore();
const { t } = useI18n();

const selectedDimensionId = computed(() => {
  if (projectStore.selection.type !== 'dimension') return null;
  return typeof projectStore.selection.label === 'string' ? projectStore.selection.label : null;
});

const selectedDimension = computed(() => {
  if (!selectedDimensionId.value) return null;
  return projectStore.dimensions.find((dim) => ensureDimensionId(dim) === selectedDimensionId.value) ?? null;
});

/**
 * The coordinates the fields show. A point that snaps to a node lives at that node, so the panel
 * has to resolve it the way the drawing does: the x and y stored on the dimension are only the
 * fallback for a point snapped to nothing, and go stale the moment the node is moved.
 */
const resolvedPoints = computed(() => {
  const dim = selectedDimension.value;
  if (!dim) return null;

  return resolveDimensionPoints(dim, projectStore.solver.domain.nodes);
});

const x1 = ref('');
const y1 = ref('');
const x2 = ref('');
const y2 = ref('');

let syncingFromDimension = false;

/**
 * Writes a field, unless what it already says means that same number. Editing a field feeds the
 * point it writes straight back here, and "1." or "-0" would be rewritten as "1" and "0" under
 * the typing hand.
 */
const setInput = (field: Ref<string>, value: number | undefined) => {
  if (value !== undefined && field.value !== '' && parseFloat2(field.value) === value) return;

  field.value = value?.toString() ?? '';
};

const syncInputsFromDimension = () => {
  const points = resolvedPoints.value;

  syncingFromDimension = true;
  setInput(x1, points?.[0].x);
  setInput(y1, points?.[0].y);
  setInput(x2, points?.[1].x);
  setInput(y2, points?.[1].y);
  syncingFromDimension = false;
};

// Follows the points themselves, not just the choice of dimension: a node dragged while the panel
// is open moves the end snapped to it, and the fields have to say so.
watch(
  resolvedPoints,
  () => {
    syncInputsFromDimension();
  },
  { immediate: true }
);

watch(
  [x1, y1, x2, y2],
  ([newX1, newY1, newX2, newY2]) => {
    if (syncingFromDimension) return;
    const dim = selectedDimension.value;
    if (!dim) return;
    if (!newX1 || !newY1 || !newX2 || !newY2) return;

    const nextPoints = [
      { ...dim.points[0], x: parseFloat2(newX1), y: parseFloat2(newY1), sourceNodeLabel: null },
      { ...dim.points[1], x: parseFloat2(newX2), y: parseFloat2(newY2), sourceNodeLabel: null },
    ] as const;

    const unchanged = dim.points.every((point, index) => {
      const nextPoint = nextPoints[index];
      return (
        point.x === nextPoint.x &&
        point.y === nextPoint.y &&
        (point.sourceNodeLabel ?? null) === nextPoint.sourceNodeLabel
      );
    });

    if (unchanged) return;

    dim.points = [nextPoints[0], nextPoints[1]];
  },
  { flush: 'sync' }
);

const snappedLabels = computed(() => {
  const dim = selectedDimension.value;
  if (!dim) return [null, null] as const;

  return [dim.points[0]?.sourceNodeLabel ?? null, dim.points[1]?.sourceNodeLabel ?? null] as const;
});

const reverseDimension = () => {
  const dim = selectedDimension.value;
  if (!dim) return;

  executeModelMutationWithUndo(() => {
    dim.points = [dim.points[1], dim.points[0]];
    dim.distance = -dim.distance;
  });

  syncInputsFromDimension();
};

const removeDimension = () => {
  if (!selectedDimensionId.value) return;

  const idToRemove = selectedDimensionId.value;
  executeModelMutationWithUndo(() => {
    projectStore.dimensions = projectStore.dimensions.filter((dim) => ensureDimensionId(dim) !== idToRemove);
    projectStore.selection2.dimensions = projectStore.selection2.dimensions.filter((id) => id !== idToRemove);
    projectStore.selection.label = null;
    projectStore.selection.type = null;
  });
};
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item v-if="selectedDimension" link class="text-body-2">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-pencil" /></div>
      </template>
      {{ $t('common.edit') }}
      <v-menu activator="parent" open-on-click location="end" :close-on-content-click="false" max-width="200">
        <v-list density="compact" class="py-0">
          <v-row no-gutters>
            <v-col cols="6">
              <v-text-field
                v-model="x1"
                density="compact"
                label="X1"
                hide-details="auto"
                class="menu-select"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="y1"
                density="compact"
                label="Y1"
                hide-details="auto"
                class="menu-select"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="x2"
                density="compact"
                label="X2"
                hide-details="auto"
                class="menu-select"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="y2"
                density="compact"
                label="Y2"
                hide-details="auto"
                class="menu-select"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-list-item v-if="snappedLabels[0] || snappedLabels[1]" class="text-caption px-4 py-1">
            {{ snappedLabels[0] ? `P1 snaps to node ${snappedLabels[0]}` : 'P1 is free' }}
            {{ snappedLabels[1] ? `, P2 snaps to node ${snappedLabels[1]}` : ', P2 is free' }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item>
    <v-divider v-if="selectedDimension" />
    <v-list-item v-if="selectedDimension" link class="text-body-2" @click="reverseDimension">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-swap-horizontal" /></div>
      </template>
      {{ t('common.reverse_orientation') }}
    </v-list-item>
    <v-divider v-if="selectedDimension" />
    <v-list-item link class="text-body-2 text-error" @click="removeDimension">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" color="error" icon="mdi-delete" /></div>
      </template>
      {{ $t('common.delete') }}
    </v-list-item>
  </v-list>
</template>
