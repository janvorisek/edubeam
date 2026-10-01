<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { ensureDimensionId } from '@/utils/id';
import { resolveDimensionPoints } from '@/types/dimension';
import {
  dimensionFieldValues,
  dimensionPointsFromFields,
  fieldMeans,
  type DimensionFieldUnits,
  type DimensionFields,
} from '@/utils/dimensionFields';
import { executeModelMutationWithUndo } from '@/utils';
import { useI18n } from 'vue-i18n';

const projectStore = useProjectStore();
const appStore = useAppStore();
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

const fields = reactive<DimensionFields>({ x1: '', v1: '', x2: '', v2: '' });

const fieldUnits: DimensionFieldUnits = {
  toDisplay: (metres) => appStore.convertLength(metres),
  toMetres: (display) => appStore.convertInverseLength(display),
  vertical: (value) => appStore.vertical(value),
};

const syncInputsFromDimension = () => {
  const points = resolvedPoints.value;
  const values = points ? dimensionFieldValues(points, fieldUnits) : null;

  for (const key of ['x1', 'v1', 'x2', 'v2'] as const) {
    const value = values?.[key];
    if (value !== undefined && fieldMeans(fields[key], value)) continue;

    fields[key] = value?.toString() ?? '';
  }
};

// Follows the points themselves, not just the choice of dimension: a node dragged while the panel
// is open moves the end snapped to it, and the fields have to say so. The units and the axis
// convention change what the same points read as.
watch([resolvedPoints, () => appStore.units.Length, () => appStore.axisConvention], syncInputsFromDimension, {
  immediate: true,
});

/** A field is done with on Enter or on leaving it; each such edit is one step to undo. */
const commitFields = () => {
  const dim = selectedDimension.value;
  const current = resolvedPoints.value;
  if (!dim || !current) return;

  const nextPoints = dimensionPointsFromFields(current, fields, fieldUnits);
  if (!nextPoints) return;

  const unchanged = dim.points.every((point, index) => {
    const nextPoint = nextPoints[index];
    return (
      point.x === nextPoint.x &&
      point.y === nextPoint.y &&
      (point.sourceNodeLabel ?? null) === nextPoint.sourceNodeLabel
    );
  });

  if (unchanged) return;

  executeModelMutationWithUndo(() => {
    dim.points = nextPoints;
  });
};

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
                v-model="fields.x1"
                density="compact"
                label="X1"
                :suffix="appStore.units.Length"
                hide-details="auto"
                class="menu-select"
                @change="commitFields"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="fields.v1"
                density="compact"
                :label="`${appStore.axes.v.toUpperCase()}1`"
                :suffix="appStore.units.Length"
                hide-details="auto"
                class="menu-select"
                @change="commitFields"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="fields.x2"
                density="compact"
                label="X2"
                :suffix="appStore.units.Length"
                hide-details="auto"
                class="menu-select"
                @change="commitFields"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="fields.v2"
                density="compact"
                :label="`${appStore.axes.v.toUpperCase()}2`"
                :suffix="appStore.units.Length"
                hide-details="auto"
                class="menu-select"
                @change="commitFields"
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
