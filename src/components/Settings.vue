<template>
  <div class="container px-3 py-3 fill-height overflow-auto">
    <div class="d-flex flex-row ga-3">
      <div style="max-width: 300px">
        <h4 class="mb-3">{{ $t("settings.language_and_locale") }}</h4>
        <v-select
          v-model="appStore.locale"
          item-title="name"
          item-value="code"
          hide-details="auto"
          :items="availableLocales"
          :label="$t('settings.language')"
        >
          <template #item="{ item, props }">
            <v-list-item v-bind="props" color="primary">
              <template #prepend>
                <img :src="getImageUrl(item.raw.code + '.svg')" class="mr-3" />
              </template>
            </v-list-item>
          </template>
        </v-select>

        <h4 class="mb-1 mt-3">{{ $t("settings.snap_to_grid") }}</h4>

        <v-checkbox
          class="mt-0"
          :label="$t('settings.snap_to_grid')"
          v-model="viewerStore.snapToGrid"
          hide-details="auto"
          density="compact"
        />

        <v-text-field
          :label="$t('settings.grid_snap_step')"
          v-model.number="viewerStore.gridStep"
          hide-details="auto"
          type="number"
          step="0.001"
          suffix="m"
        />
      </div>

      <div>
        <h4 class="mb-3">{{ $t("settings.results_scale") }}</h4>

        <v-text-field
          :label="$t('settings.results_scale')"
          v-model.number="projectStore.resultsScalePx"
          hide-details="auto"
          type="number"
          step="10"
          min="0"
          suffix="px"
        />

        <v-slider v-model="projectStore.resultsScalePx" step="1" max="200"></v-slider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useProjectStore } from "@/store/project";
import { useViewerStore } from "@/store/viewer";
import { availableLocales } from "../plugins/i18n";

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();

// updated with your project's assets folder setup
function getImageUrl(name) {
  return new URL(`../assets/images/flags/${name}`, import.meta.url).href;
}

// showNodeLabels,
//       showLoads,
//       showElementLabels,
//       showSupports,
//       showNormalForce,
//       showShearForce,
//       showBendingMoment,
//       showDeformedShape,
</script>
