<template>
  <v-dialog v-model="open" max-width="520" attach=".v-application">
    <v-card>
      <v-card-title> {{ $t('dialogs.editElementLoad.editElementLoad') }} </v-card-title>
      <v-card-subtitle>{{ $t('loadType.' + loadType) }}</v-card-subtitle>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col v-if="previewLoad" cols="12" md="6" class="mb-4 mb-md-0 pe-md-4" align-self="center">
                <ElementLoadPreview class="w-100 pointer-events-none" :load="previewLoad" :show-node-labels="true" />
              </v-col>
              <v-col cols="12" :md="previewLoad ? 6 : 12" align-self="center">
                <v-row no-gutters>
                  <v-col cols="12" md="12">
                    <v-select
                      v-model="elementd"
                      :items="projectStore.beams"
                      item-title="label"
                      item-value="label"
                      label="Element id"
                      hide-details="auto"
                      required
                      disabled
                      autofocus
                    />
                  </v-col>

                  <template v-if="['udl', 'concentrated'].includes(loadType)">
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="elementNodeValueFx"
                        :label="`${unitAndLabel.l}x`"
                        hide-details="auto"
                        :rules="numberRules"
                        :suffix="unitAndLabel.u"
                        @keydown="checkNumber($event)"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="elementNodeValueFz"
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
                            v-model="trapezoidStartFx"
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
                            v-model="trapezoidEndFx"
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
                            v-model="trapezoidStartFz"
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
                            v-model="trapezoidEndFz"
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
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="editNodalLoad()" @keydown.enter="editNodalLoad">
          {{ $t('dialogs.editElementLoad.editElementLoad') }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal()" @keydown.enter="closeModal">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useProjectStore } from '@/store/project';
import { closeModal } from 'jenesius-vue-modal';
import { onMounted } from 'vue';
import { useAppStore } from '@/store/app';
import { checkNumber, numberRules, parseFloat2, loadType as LT } from '@/utils';
import {
  BeamConcentratedLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
} from 'ts-fem';
import ElementLoadPreview from '../ElementLoadPreview.vue';

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  index: number;
}>();

const open = ref(true);
const valid = ref(false);

const target = computed(() => {
  return useProjectStore().solver.domain.elements.get(load.value.target)!;
});

const elementd = computed(() => {
  return useProjectStore().solver.loadCases[0].elementLoadList[props.index].target;
});

const load = computed(() => {
  return useProjectStore().solver.loadCases[0].elementLoadList[props.index];
});

const loadType = computed(() => LT(load.value));
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

const elementNodeValueFx = ref('0.0');
const elementNodeValueFz = ref('0.0');
const trapezoidStartFx = ref('0.0');
const trapezoidStartFz = ref('0.0');
const trapezoidEndFx = ref('0.0');
const trapezoidEndFz = ref('0.0');
const elementLoadPos = ref('0.0');
const elementLCS = ref(false);

const minMax = (v) => {
  const geo = target.value.computeGeo();
  if (v < 0 || v > geo.l) {
    return 'Enter value between 0 and ' + geo.l;
  }
  return true;
};

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(elementNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(elementNodeValueFz.value)));
const realTrapStartFx = computed(() => appStore.convertInverseForce(parseFloat2(trapezoidStartFx.value)));
const realTrapStartFz = computed(() => appStore.convertInverseForce(parseFloat2(trapezoidStartFz.value)));
const realTrapEndFx = computed(() => appStore.convertInverseForce(parseFloat2(trapezoidEndFx.value)));
const realTrapEndFz = computed(() => appStore.convertInverseForce(parseFloat2(trapezoidEndFz.value)));
const realDist = computed(() => appStore.convertInverseLength(parseFloat2(elementLoadPos.value)));

const previewLoad = computed(() => {
  const domain = projectStore.solver.domain;

  if (loadType.value === 'udl') {
    return new BeamElementUniformEdgeLoad(load.value.target, domain, [realFx.value, realFz.value], elementLCS.value);
  }

  if (loadType.value === 'trapezoidal') {
    return new BeamElementTrapezoidalEdgeLoad(
      load.value.target,
      domain,
      [realTrapStartFx.value, realTrapStartFz.value],
      [realTrapEndFx.value, realTrapEndFz.value],
      elementLCS.value
    );
  }

  if (loadType.value === 'concentrated') {
    return new BeamConcentratedLoad(
      load.value.target,
      domain,
      [realFx.value, realFz.value, 0, realDist.value],
      elementLCS.value
    );
  }

  if (loadType.value === 'temperature') {
    return load.value as BeamTemperatureLoad;
  }

  return null;
});

onMounted(() => {
  if (load.value instanceof BeamElementUniformEdgeLoad || load.value instanceof BeamConcentratedLoad) {
    elementNodeValueFx.value = appStore.convertForce(load.value.values[0]).toString();
    elementNodeValueFz.value = appStore.convertForce(load.value.values[1]).toString();
  }
  elementLCS.value = load.value.lcs;

  if (load.value instanceof BeamElementTrapezoidalEdgeLoad) {
    trapezoidStartFx.value = appStore.convertForce(load.value.startValues[0]).toString();
    trapezoidStartFz.value = appStore.convertForce(load.value.startValues[1]).toString();
    trapezoidEndFx.value = appStore.convertForce(load.value.endValues[0]).toString();
    trapezoidEndFz.value = appStore.convertForce(load.value.endValues[1]).toString();
  }

  if (loadType.value === 'concentrated') elementLoadPos.value = appStore.convertLength(load.value.values[3]).toString();

  //elementNodeValueMy.value = load.values[DofID.Ry];
});

const editNodalLoad = () => {
  if (valid.value === false) return;

  if (load.value instanceof BeamElementUniformEdgeLoad || load.value instanceof BeamConcentratedLoad) {
    load.value.values[0] = realFx.value;
    load.value.values[1] = realFz.value;
  }

  load.value.lcs = elementLCS.value;

  if (load.value instanceof BeamElementTrapezoidalEdgeLoad) {
    load.value.change(
      load.value.target,
      [realTrapStartFx.value, realTrapStartFz.value],
      [realTrapEndFx.value, realTrapEndFz.value],
      elementLCS.value
    );
  }

  if (load.value instanceof BeamConcentratedLoad) load.value.values[3] = realDist.value;

  //load.values[DofID.Ry] = loadNodeValueMy.value;

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};
</script>
