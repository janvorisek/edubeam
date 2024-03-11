<template>
  <v-dialog v-model="open" max-width="420" attach=".v-application">
    <v-card>
      <v-card-title> {{ $t("dialogs.addElementLoad.addNewElementLoad") }} </v-card-title>

      <v-card-text>
        <v-select
          v-model="loadType"
          :items="loadTypes"
          item-title="label"
          item-value="value"
          :label="$t('loadType.loadType')"
        >
        </v-select>
        <v-form v-model="valid">
          <v-row no-gutters>
            <v-col v-if="loadType === 'udl' && 1 === 0" class="d-none d-md-block" cols="12" md="6" align-self="center">
              <div style="height: 200px">
                <SVGElementViewer
                  ref="viewer"
                  class="overflow-hidden pa-1 w-100"
                  :solver="projectStore.solver"
                  :nodes="[]"
                  :elements="[target]"
                  :element-loads="[tmpLoad]"
                  :show-node-labels="true"
                  :show-element-labels="true"
                  :show-deformed-shape="false"
                  :show-reactions="false"
                  :show-loads="true"
                  :show-moments="false"
                  :show-normal-force="false"
                  :show-shear-force="false"
                  :padding="12"
                  :mobile-padding="12"
                  :results-scale-px="32"
                  :convert-force="appStore.convertForce"
                />
              </div>
            </v-col>
            <v-col cols="12" md="12" align-self="center">
              <v-row no-gutters>
                <v-col cols="12" md="12">
                  <v-select
                    v-model="loadElementId"
                    @update:model-value="viewer ? viewer.fitContent() : (() => {})()"
                    :items="projectStore.beams"
                    item-title="label"
                    item-value="label"
                    :label="$t('common.element')"
                    hide-details="auto"
                    required
                  />
                </v-col>

                <template v-if="['udl', 'concentrated'].includes(loadType)">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="loadNodeValueFx"
                      @keydown="checkNumber($event)"
                      :label="`${unitAndLabel.l}x`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="unitAndLabel.u"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="loadNodeValueFz"
                      @keydown="checkNumber($event)"
                      :label="`${unitAndLabel.l}z`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="unitAndLabel.u"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-checkbox
                      v-if="loadType === 'udl'"
                      v-bind="props"
                      v-model="elementLCS"
                      :label="`LCS`"
                      hide-details="auto"
                      v-tooltip.left="$t('common.lcs')"
                    />
                  </v-col>

                  <v-col cols="12" md="12" v-if="loadType === 'concentrated'">
                    <v-text-field
                      v-model="elementLoadPos"
                      @keydown="checkNumber($event)"
                      :label="$t('loads.loadPositionOnBeam')"
                      hide-details="auto"
                      :rules="[...numberRules, minMax]"
                      :suffix="appStore.units.Length"
                    />
                  </v-col>
                </template>

                <template v-if="loadType === 'temperature'">
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="loadNodeValueTc"
                      @keydown="checkNumber($event)"
                      :label="`ΔTc - uniform temperature`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="formatMeasureAsHTML(appStore.units.Temperature)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="loadNodeValueTb"
                      @keydown="checkNumber($event)"
                      :label="`ΔTb - bottom surface`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="formatMeasureAsHTML(appStore.units.Temperature)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="loadNodeValueTu"
                      @keydown="checkNumber($event)"
                      :label="`ΔTu - upper surface`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="formatMeasureAsHTML(appStore.units.Temperature)"
                    ></v-text-field>
                  </v-col>
                </template>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addElementLoad()" @keydown.enter="addElementLoad">
          {{ $t("dialogs.addElementLoad.addElementLoad") }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal" @keydown.enter="closeModal">{{
          $t("dialogs.common.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useProjectStore } from "../../store/project";
import { useAppStore } from "../../store/app";
import { closeModal } from "jenesius-vue-modal";
import { checkNumber, parseFloat2, numberRules } from "@/utils";
import SVGElementViewer from "../SVGElementViewer.vue";
import { BeamElementUniformEdgeLoad } from "ts-fem";
import { formatMeasureAsHTML } from "@/SVGUtils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  label?: string | number;
}>();

const viewer = ref<InstanceType<typeof SVGElementViewer>>();

const open = ref(true);
const valid = ref(false);
const loadType = ref("udl");

const loadTypes = [
  { label: t("loadType.udl"), value: "udl" },
  { label: t("loadType.concentrated"), value: "concentrated" },
  { label: t("loadType.temperature"), value: "temperature" },
];

const unitAndLabel = computed(() => {
  let u = appStore.units.Force;
  let l = "F";

  if (loadType.value === "udl") {
    u += "/m";
    l = "f";
  }

  return { l, u };
});

const loadElementId = ref(props.label ?? [...useProjectStore().solver.domain.elements.values()][0].label);
const loadNodeValueFx = ref(`${appStore.convertForce(4000)}`);
const loadNodeValueFz = ref(`${appStore.convertForce(3000)}`);
const loadNodeValueTc = ref("10.0");
const loadNodeValueTb = ref("0.0");
const loadNodeValueTu = ref("0.0");
const elementLoadPos = ref("0.0");
const elementLCS = ref(true);

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));
const realDist = computed(() => appStore.convertInverseLength(parseFloat2(elementLoadPos.value)));
const realTc = computed(() => appStore.convertInverseTemperature(parseFloat2(loadNodeValueTc.value)));
const realTb = computed(() => appStore.convertInverseTemperature(parseFloat2(loadNodeValueTb.value)));
const realTu = computed(() => appStore.convertInverseTemperature(parseFloat2(loadNodeValueTu.value)));

const tmpLoad = computed(() => {
  return new BeamElementUniformEdgeLoad(
    loadElementId.value,
    projectStore.solver.domain,
    [realFx.value, realFz.value],
    elementLCS.value
  );
});

const minMax = (v) => {
  const geo = target.value.computeGeo();
  if (v < 0 || v > geo.l) {
    return "Enter value between 0 and " + geo.l;
  }
  return true;
};

const addElementLoad = () => {
  if (valid.value === false) return;

  useProjectStore().solver.loadCases[0].solved = false;

  if (loadType.value === "udl")
    useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(
      loadElementId.value,
      [realFx.value, realFz.value],
      elementLCS.value
    );

  if (loadType.value === "concentrated")
    useProjectStore().solver.loadCases[0].createBeamConcentratedLoad(
      loadElementId.value,
      [realFx.value, realFz.value, 0, realDist.value],
      true
    );

  if (loadType.value === "temperature")
    useProjectStore().solver.loadCases[0].createBeamTemperatureLoad(loadElementId.value, [
      realTc.value,
      realTb.value,
      realTu.value,
    ]);

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const target = computed(() => {
  return useProjectStore().solver.domain.elements.get(loadElementId.value)!;
});
</script>
