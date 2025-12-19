<template>
  <v-dialog v-model="open" max-width="480" attach=".v-application">
    <v-card>
      <v-card-title> {{ $t('dialogs.addElementLoad.addNewElementLoad') }} </v-card-title>

      <v-card-text>
        <v-select
          v-model="loadType"
          :items="loadTypes"
          item-title="label"
          item-value="value"
          :label="$t('loadType.loadType')"
          hide-details="auto"
        >
        </v-select>
        <v-form v-model="valid">
          <v-row no-gutters>
            <v-col v-if="previewLoad" cols="12" md="6" class="mb-4 mb-md-0 pe-md-4" align-self="center">
              <ElementLoadPreview class="w-100 pointer-events-none" :load="previewLoad" :show-node-labels="true" />
            </v-col>
            <v-col cols="12" :md="previewLoad ? 6 : 12" align-self="center">
              <v-row no-gutters>
                <v-col cols="12" md="12">
                  <v-select
                    v-model="loadElementId"
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
                      :label="`${unitAndLabel.l}x`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="unitAndLabel.u"
                      @keydown="checkNumber($event)"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="loadNodeValueFz"
                      :label="`${unitAndLabel.l}z`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="unitAndLabel.u"
                      @keydown="checkNumber($event)"
                    ></v-text-field>
                  </v-col>

                  <v-col v-if="loadType === 'concentrated'" cols="12" md="12">
                    <v-text-field
                      v-model="elementLoadPos"
                      :label="$t('loads.loadPositionOnBeam')"
                      hide-details="auto"
                      :rules="[...numberRules, minMax]"
                      :suffix="appStore.units.Length"
                      @keydown="checkNumber($event)"
                    />
                  </v-col>
                </template>

                <template v-else-if="loadType === 'trapezoidal'">
                  <v-col cols="12">
                    <v-row no-gutters>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="loadTrapezoidStartFx"
                          hide-details="auto"
                          :rules="numberRules"
                          :suffix="unitAndLabel.u"
                          @keydown="checkNumber($event)"
                        >
                          <template #label>
                            <span>f<sub>1</sub>x</span>
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="loadTrapezoidEndFx"
                          hide-details="auto"
                          :rules="numberRules"
                          :suffix="unitAndLabel.u"
                          @keydown="checkNumber($event)"
                        >
                          <template #label>
                            <span>f<sub>2</sub>x</span>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-row no-gutters>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="loadTrapezoidStartFz"
                          hide-details="auto"
                          :rules="numberRules"
                          :suffix="unitAndLabel.u"
                          @keydown="checkNumber($event)"
                        >
                          <template #label>
                            <span>f<sub>1</sub>z</span>
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="loadTrapezoidEndFz"
                          hide-details="auto"
                          :rules="numberRules"
                          :suffix="unitAndLabel.u"
                          @keydown="checkNumber($event)"
                        >
                          <template #label>
                            <span>f<sub>2</sub>z</span>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </template>

                <v-col v-if="['udl', 'trapezoidal', 'concentrated'].includes(loadType)" cols="12" md="12">
                  <v-checkbox
                    v-bind="props"
                    v-model="elementLCS"
                    v-tooltip.left="$t('common.lcs')"
                    :label="`LCS`"
                    hide-details="auto"
                    :disabled="loadType === 'trapezoidal'"
                  />
                </v-col>

                <template v-if="loadType === 'temperature'">
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="loadNodeValueTc"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="formatMeasureAsHTML(appStore.units.Temperature)"
                      @keydown="checkNumber($event)"
                    >
                      <template #label>
                        <span v-html="$t('loads.temperatureBending')"></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="loadNodeValueTbt"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="formatMeasureAsHTML(appStore.units.Temperature)"
                      @keydown="checkNumber($event)"
                    >
                      <template #label>
                        <span v-html="$t('loads.temperatureAxial')"></span>
                      </template>
                    </v-text-field>
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
          {{ $t('dialogs.addElementLoad.addElementLoad') }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal" @keydown.enter="closeModal">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useProjectStore } from '../../store/project';
import { useAppStore } from '../../store/app';
import { closeModal } from 'jenesius-vue-modal';
import { checkNumber, parseFloat2, numberRules } from '@/utils';
import ElementLoadPreview from '../ElementLoadPreview.vue';
import {
  BeamConcentratedLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
} from 'ts-fem';
import { formatMeasureAsHTML } from '@/SVGUtils';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  label?: string | number;
}>();

const open = ref(true);
const valid = ref(false);
const loadType = ref('udl');

const loadTypes = [
  { label: t('loadType.udl'), value: 'udl' },
  { label: t('loadType.trapezoidal'), value: 'trapezoidal' },
  { label: t('loadType.concentrated'), value: 'concentrated' },
  { label: t('loadType.temperature'), value: 'temperature' },
];

const unitAndLabel = computed(() => {
  let u = appStore.units.Force;
  let l = 'F';

  if (loadType.value === 'udl' || loadType.value === 'trapezoidal') {
    u += '/m';
    l = 'f';
  }

  return { l, u };
});

// TODO: LCS is forced on trapezoidal loads for now, rendering GCS load is not supported graphically
watch(loadType, (newVal) => {
  if (newVal === 'trapezoidal') {
    elementLCS.value = true;
  }
});

const loadElementId = ref(props.label ?? [...useProjectStore().solver.domain.elements.values()][0].label);
const loadNodeValueFx = ref(`${appStore.convertForce(4000)}`);
const loadNodeValueFz = ref(`${appStore.convertForce(3000)}`);
const loadTrapezoidStartFx = ref(`${appStore.convertForce(0)}`);
const loadTrapezoidStartFz = ref(`${appStore.convertForce(1000)}`);
const loadTrapezoidEndFx = ref(`${appStore.convertForce(0)}`);
const loadTrapezoidEndFz = ref(`${appStore.convertForce(2000)}`);
const loadNodeValueTc = ref('10.0');
const loadNodeValueTbt = ref('0.0');
const elementLoadPos = ref('0.0');
const elementLCS = ref(true);

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));
const realTrapStartFx = computed(() => appStore.convertInverseForce(parseFloat2(loadTrapezoidStartFx.value)));
const realTrapStartFz = computed(() => appStore.convertInverseForce(parseFloat2(loadTrapezoidStartFz.value)));
const realTrapEndFx = computed(() => appStore.convertInverseForce(parseFloat2(loadTrapezoidEndFx.value)));
const realTrapEndFz = computed(() => appStore.convertInverseForce(parseFloat2(loadTrapezoidEndFz.value)));
const realDist = computed(() => appStore.convertInverseLength(parseFloat2(elementLoadPos.value)));
const realTc = computed(() => appStore.convertInverseTemperature(parseFloat2(loadNodeValueTc.value)));
const realTbt = computed(() => appStore.convertInverseTemperature(parseFloat2(loadNodeValueTbt.value)));

const previewLoad = computed(() => {
  const domain = projectStore.solver.domain;

  if (loadType.value === 'udl') {
    return new BeamElementUniformEdgeLoad(loadElementId.value, domain, [realFx.value, realFz.value], elementLCS.value);
  }

  if (loadType.value === 'trapezoidal') {
    return new BeamElementTrapezoidalEdgeLoad(
      loadElementId.value,
      domain,
      [realTrapStartFx.value, realTrapStartFz.value],
      [realTrapEndFx.value, realTrapEndFz.value],
      elementLCS.value
    );
  }

  if (loadType.value === 'concentrated') {
    return new BeamConcentratedLoad(
      loadElementId.value,
      domain,
      [realFx.value, realFz.value, 0, realDist.value],
      elementLCS.value
    );
  }

  if (loadType.value === 'temperature') {
    return new BeamTemperatureLoad(loadElementId.value, domain, [realTc.value, realTbt.value, 0]);
  }

  return null;
});

const minMax = (v) => {
  const geo = target.value.computeGeo();
  if (v < 0 || v > geo.l) {
    return 'Enter value between 0 and ' + geo.l;
  }
  return true;
};

const addElementLoad = () => {
  if (valid.value === false) return;

  useProjectStore().solver.loadCases[0].solved = false;

  if (loadType.value === 'udl')
    useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(
      loadElementId.value,
      [realFx.value, realFz.value],
      elementLCS.value
    );

  if (loadType.value === 'trapezoidal')
    useProjectStore().solver.loadCases[0].createBeamElementTrapezoidalEdgeLoad(
      loadElementId.value,
      [realTrapStartFx.value, realTrapStartFz.value],
      [realTrapEndFx.value, realTrapEndFz.value],
      elementLCS.value
    );

  if (loadType.value === 'concentrated')
    useProjectStore().solver.loadCases[0].createBeamConcentratedLoad(
      loadElementId.value,
      [realFx.value, realFz.value, 0, realDist.value],
      elementLCS.value
    );

  if (loadType.value === 'temperature')
    useProjectStore().solver.loadCases[0].createBeamTemperatureLoad(loadElementId.value, [
      realTc.value,
      realTbt.value,
      0,
    ]);

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const target = computed(() => {
  return useProjectStore().solver.domain.elements.get(loadElementId.value)!;
});

// default concentrated load position to mid-span
watch(loadType, () => {
  if (loadType.value === 'concentrated') {
    const geo = target.value.computeGeo();
    elementLoadPos.value = `${appStore.convertLength(Math.max(Math.min(Math.floor(geo.l / 2), 5.0), geo.l / 10))}`;
  }
});
</script>
