<template>
  <div class="container px-3 py-3 fill-height overflow-auto">
    <v-row>
      <v-col cols="6" md="3" lg="3">
        <h3 class="mb-2">{{ $t("settings.language_and_locale") }}</h3>

        <h4 class="mb-1">{{ $t("settings.language") }}</h4>
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

        <h4 class="mb-1 mt-2">{{ $t("settings.units.units") }}</h4>

        <v-select
          v-model="unitSystem"
          item-title="name"
          item-value="code"
          hide-details="auto"
          :items="[
            { name: 'SI Units', code: 'si' },
            { name: 'Imperial', code: 'imperial' },
          ]"
          :label="$t('settings.units.length')"
        >
        </v-select>

        <v-expansion-panels>
          <v-expansion-panel title="More settings" density="compact">
            <template #text>
              <v-select
                v-model="appStore.units.Length"
                item-title="name"
                item-value="code"
                hide-details="auto"
                :items="[
                  { name: 'm', code: 'm' },
                  { name: 'cm', code: 'cm' },
                  { name: 'mm', code: 'mm' },
                  { name: 'in', code: 'in' },
                  { name: 'ft', code: 'ft' },
                ]"
                :label="$t('settings.units.length')"
              >
              </v-select>
              <v-select
                v-model="appStore.units.Area"
                item-title="name"
                item-value="code"
                hide-details="auto"
                :items="[
                  { name: 'm²', code: 'm2' },
                  { name: 'cm²', code: 'cm2' },
                  { name: 'mm²', code: 'mm2' },
                  { name: 'in²', code: 'in2' },
                  { name: 'ft²', code: 'ft2' },
                ]"
                :label="$t('settings.units.area')"
              ></v-select>
              <v-select
                v-model="appStore.units.AreaM2"
                item-title="name"
                item-value="code"
                hide-details="auto"
                :items="[
                  { name: 'm4', code: 'm4' },
                  { name: 'cm4', code: 'cm4' },
                  { name: 'mm4', code: 'mm4' },
                  { name: 'in4', code: 'in4' },
                  { name: 'ft4', code: 'ft4' },
                ]"
                :label="$t('settings.units.areaM2')"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #title><span v-html="formatMeasureAsHTML(item.title)"></span></template>
                  </v-list-item>
                </template>

                <template #selection="{ item }">
                  <span v-html="formatMeasureAsHTML(item.title)"></span>
                </template>
              </v-select>
              <v-select
                v-model="appStore.units.Mass"
                item-title="name"
                item-value="code"
                hide-details="auto"
                :items="[
                  { name: 'kg', code: 'kg' },
                  { name: 'lb', code: 'lb' },
                ]"
                :label="$t('settings.units.mass')"
              >
              </v-select>
              <v-select
                v-model="appStore.units.Force"
                item-title="name"
                item-value="code"
                hide-details="auto"
                :items="[
                  { name: 'N', code: 'N' },
                  { name: 'kN', code: 'kN' },
                  { name: 'MN', code: 'MN' },
                  { name: 'lbf', code: 'lbf' },
                ]"
                :label="$t('settings.units.force')"
              >
              </v-select>
              <v-select
                v-model="appStore.units.Pressure"
                item-title="name"
                item-value="code"
                hide-details="auto"
                :items="[
                  { name: 'Pa', code: 'Pa' },
                  { name: 'kPa', code: 'kPa' },
                  { name: 'MPa', code: 'MPa' },
                  { name: 'GPa', code: 'GPa' },
                  { name: 'psi', code: 'psi' },
                ]"
                :label="$t('settings.units.pressure')"
              >
              </v-select>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="6" md="3" lg="3">
        <h3 class="mb-2">{{ $t("settings.grid") }}</h3>

        <v-checkbox
          class="mt-0"
          :label="$t('settings.show_grid')"
          v-model="viewerStore.showGrid"
          hide-details="auto"
          density="compact"
        />

        <h4 class="mb-1">{{ $t("settings.snap_to_grid") }}</h4>

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

        <h4 class="mb-1 mt-2">{{ $t("settings.results_scale") }}</h4>

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
      </v-col>
      <v-col cols="6" md="3" lg="3">
        <h3 class="mb-2">{{ $t("settings.mouse.mouse") }}</h3>

        <v-select
          v-model="appStore.panButton"
          item-title="name"
          item-value="code"
          hide-details="auto"
          :items="[
            { name: $t('settings.mouse.wheel'), code: 4 },
            { name: $t('settings.mouse.right_button'), code: 2 },
          ]"
          :label="$t('settings.mouse.pan_button')"
        >
        </v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useProjectStore } from "@/store/project";
import { useViewerStore } from "@/store/viewer";
import { availableLocales } from "../plugins/i18n";
import { ref } from "vue";
import { formatMeasureAsHTML } from "../SVGUtils";

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();

const unitSystem = ref("si");

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

<style>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
</style>
