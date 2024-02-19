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
                <img :src="getImageUrl(item.raw.code)" class="mr-3" height="24" />
              </template>
            </v-list-item>
          </template>
        </v-select>

        <h4 class="mb-1 mt-2">{{ $t("settings.units.units") }}</h4>

        <v-row no-gutters>
          <v-col cols="6">
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
          </v-col>
          <v-col cols="6">
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
            ></v-select> </v-col
          ><v-col cols="6">
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
              </template> </v-select
          ></v-col>
          <v-col cols="6"
            ><v-select
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
            </v-select
          ></v-col>

          <v-col cols="6"
            ><v-select
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
            </v-select
          ></v-col>
          <v-col cols="6"
            ><v-select
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
            </v-select
          ></v-col>
        </v-row>
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

        <h3 class="mb-2 mt-4">{{ $t("settings.results.results") }}</h3>

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

        <div style="height: 128px">
          <SVGElementViewer
            v-if="_created"
            class="overflow-hidden pa-1"
            :nodes="[]"
            :elements="[domain.getElement(1), domain.getElement(2), domain.getElement(3)]"
            :padding="1"
            :mobile-padding="1"
          />
        </div>

        <h3 class="mb-2">{{ $t("settings.colors.colors") }}</h3>

        <div style="display: grid; grid-template-columns: 1fr 1fr">
          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.nodes')"
                v-bind="props"
                v-model="viewerStore.colors.nodes"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.nodes};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker mode="hex" v-model="viewerStore.colors.nodes" hide-inputs class="mx-auto"></v-color-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.elements')"
                v-bind="props"
                v-model="viewerStore.colors.elements"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.elements};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker
              mode="hex"
              v-model="viewerStore.colors.elements"
              hide-inputs
              class="mx-auto"
            ></v-color-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.loads')"
                v-bind="props"
                v-model="viewerStore.colors.loads"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.loads};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker mode="hex" v-model="viewerStore.colors.loads" hide-inputs class="mx-auto"></v-color-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.deformedShape')"
                v-bind="props"
                v-model="viewerStore.colors.deformedShape"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.deformedShape};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker
              mode="hex"
              v-model="viewerStore.colors.deformedShape"
              hide-inputs
              class="mx-auto"
            ></v-color-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.normalForce')"
                v-bind="props"
                v-model="viewerStore.colors.normalForce"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.normalForce};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker
              mode="hex"
              v-model="viewerStore.colors.normalForce"
              hide-inputs
              class="mx-auto"
            ></v-color-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.shearForce')"
                v-bind="props"
                v-model="viewerStore.colors.shearForce"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.shearForce};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker
              mode="hex"
              v-model="viewerStore.colors.shearForce"
              hide-inputs
              class="mx-auto"
            ></v-color-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.bendingMoment')"
                v-bind="props"
                v-model="viewerStore.colors.bendingMoment"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.bendingMoment};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker
              mode="hex"
              v-model="viewerStore.colors.bendingMoment"
              hide-inputs
              class="mx-auto"
            ></v-color-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
              <v-text-field
                hide-details="auto"
                :label="$t('common.reactions')"
                v-bind="props"
                v-model="viewerStore.colors.reactions"
              >
                <template #prepend-inner>
                  <div
                    :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.reactions};`"
                  ></div>
                </template>
              </v-text-field>
            </template>
            <v-color-picker
              mode="hex"
              v-model="viewerStore.colors.reactions"
              hide-inputs
              class="mx-auto"
            ></v-color-picker>
          </v-menu>
        </div>
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
import { onMounted, ref } from "vue";
import { formatMeasureAsHTML } from "../SVGUtils";

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();

const unitSystem = ref("si");

import English from "language-icons/icons/en.svg";
import Czech from "language-icons/icons/cs.svg";
import German from "language-icons/icons/de.svg";
import Spanish from "language-icons/icons/es.svg";
import French from "language-icons/icons/fr.svg";
import Chinese from "language-icons/icons/zh.svg";
import SVGElementViewer from "./SVGElementViewer.vue";
import { DofID, LinearStaticSolver } from "ts-fem";

const flags = { en: English, cs: Czech, de: German, es: Spanish, fr: French, cn: Chinese };

function getImageUrl(name) {
  return flags[name];
}

const solver = ref(new LinearStaticSolver());
const domain = solver.value.domain;

domain.createNode("a", [0, 0, 0], [DofID.Dx, DofID.Ry, DofID.Dz]);
domain.createNode(2, [0, 0, -3], []);
domain.createNode(3, [3, 0, -3], []);
domain.createNode(4, [3, 0, 0], [DofID.Dx, DofID.Dz]);

domain.createBeam2D(1, ["a", 2], 1, 1, [false, true]);
domain.createBeam2D(2, [2, 3], 1, 1);
domain.createBeam2D(3, [4, 3], 1, 1);

domain.createCrossSection(1, {
  a: 1,
  iy: 8.356e-5,
  iz: 1.0,
  dyz: 999991.0,
  h: 1,
  k: 1e32,
  j: 99999.0,
});

domain.createMaterial(1, {
  e: 210000e6,
  g: 210000e6 / (2 * (1 + 0.2)),
  alpha: 1.0,
  d: 4000 /*kg/m3!!!*/,
});

const _created = ref(false);
onMounted(() => {
  solver.value.solve();
  _created.value = true;
});

//solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 10000, [DofID.Dz]: 0, [DofID.Ry]: 10000 });
//solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 0, [DofID.Dz]: 20 });

solver.value.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10000], true);
solver.value.solve();
</script>

<style>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
</style>
