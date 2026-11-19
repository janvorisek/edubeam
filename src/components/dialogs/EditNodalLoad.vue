<template>
  <v-dialog v-model="open" max-width="420">
    <v-card @keydown="submitsForm($event) && editNodalLoad()">
      <v-card-title> {{ $t('dialogs.editNodalLoad.editNodalLoad') }} </v-card-title>

      <v-card-text>
        <!-- On a turned node a force can be given in its own axes; a settlement always is -->
        <v-btn-toggle
          v-if="loadType === 'force' && turnedNode"
          v-model="inNodeAxes"
          class="axes-toggle"
          color="primary"
          density="compact"
          variant="outlined"
          divided
          mandatory
        >
          <v-btn :value="false" size="small">{{ $t('loads.globalAxes') }}</v-btn>
          <v-btn :value="true" size="small">{{ $t('loads.nodeAxes') }}</v-btn>
        </v-btn-toggle>
        <p v-if="loadType === 'displacement' && turnedNode" class="axes-note">
          {{ $t('loads.alongSupportAxes') }}
        </p>
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" align-self="center">
                <div class="d-flex justify-center">
                  <Vector2DHelper
                    :fx="realFx"
                    :fz="realFz"
                    :my="realMy"
                    :type="loadType === 'force' ? 'force' : 'displacement'"
                    :label="loadNodeId"
                    :axes-angle="axesAngle"
                  />
                </div>
              </v-col>

              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-select
                      v-model="loadNodeId"
                      :items="projectStore.nodes"
                      item-title="label"
                      item-value="label"
                      :label="$t('common.node')"
                      hide-details="auto"
                      disabled
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFx"
                      :label="`${mainLabel}x${mark}`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="mainUnits"
                      :disabled="loadType === 'displacement' && !nodeBcs.has(DofID.Dx)"
                      @keydown="checkNumber($event)"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFz"
                      :label="`${mainLabel}${appStore.axes.v}${mark}`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="mainUnits"
                      :disabled="loadType === 'displacement' && !nodeBcs.has(DofID.Dz)"
                      @keydown="checkNumber($event)"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueMy"
                      :label="`${momentLabel}${appStore.axes.r}`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="`${momentUnits}`"
                      :disabled="loadType === 'displacement' && !nodeBcs.has(DofID.Ry)"
                      @keydown="checkNumber($event)"
                    >
                    </v-text-field>
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
          {{ $t('dialogs.editNodalLoad.editNodalLoad') }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal()" @keydown.enter="closeModal">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { submitsForm } from '@/utils/keyboard';
import { onMounted, ref, computed, watch } from 'vue';
import { useProjectStore } from '../../store/project';
import { DofID } from '@edubeam/fem';
import { closeModal } from 'jenesius-vue-modal';
import { useAppStore } from '@/store/app';
import { checkNumber, parseFloat2 } from '@/utils';
import { inPlaneValues } from '@/utils/dofValues';
import Vector2DHelper from '../Vector2DHelper.vue';
import { globalToNode, isTurned, nodeLcsAngle, nodeToGlobal } from '@/utils/nodalLcs';
import { executeModelMutationWithUndo, numberRules } from '../../utils';

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    index: number;
    type?: 'force' | 'displacement';
  }>(),
  {
    type: 'force',
  }
);

const open = ref(true);
const valid = ref(false);

const loadType = ref('force');
const loadNodeValueFx = ref('');
const loadNodeValueFz = ref('');
const loadNodeValueMy = ref('');
// Read from the load before the dialog shows, so opening it converts nothing
const inNodeAxes = ref(
  props.type === 'force' ? useProjectStore().solver.loadCases[0].nodalLoadList[props.index].lcs : false
);

const realFx = computed(() => {
  if (loadType.value === 'force') {
    return appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value));
  }

  return appStore.convertInverseDisplacement(parseFloat2(loadNodeValueFx.value));
});

const realFz = computed(() => {
  if (loadType.value === 'force') {
    return appStore.vertical(appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));
  }

  return appStore.vertical(appStore.convertInverseDisplacement(parseFloat2(loadNodeValueFz.value)));
});

const realMy = computed(() => {
  if (loadType.value === 'force') {
    return appStore.convertInverseMoment(parseFloat2(loadNodeValueMy.value));
  }

  // Prescribed rotation is stored and displayed in radians - no conversion.
  return parseFloat2(loadNodeValueMy.value);
});

const mainLabel = computed(() => (loadType.value === 'force' ? 'F' : 'D'));
const momentLabel = computed(() => (loadType.value === 'force' ? 'M' : 'R'));

const mainUnits = computed(() => (loadType.value === 'force' ? appStore.units.Force : appStore.units.Displacement));
const momentUnits = computed(() => (loadType.value === 'force' ? appStore.units.Moment : 'rad'));

onMounted(() => {
  if (props.type === 'displacement') {
    loadType.value = 'displacement';
  }

  if (props.type === 'displacement') {
    const values = inPlaneValues(useProjectStore().solver.loadCases[0].prescribedBC[props.index].prescribedValues);
    loadNodeValueFx.value = appStore.convertDisplacement(values[DofID.Dx]).toString();
    loadNodeValueFz.value = appStore.vertical(appStore.convertDisplacement(values[DofID.Dz])).toString();
    loadNodeValueMy.value = values[DofID.Ry].toString();
  } else {
    const values = inPlaneValues(useProjectStore().solver.loadCases[0].nodalLoadList[props.index].values);
    loadNodeValueFx.value = appStore.convertForce(values[DofID.Dx]).toString();
    loadNodeValueFz.value = appStore.vertical(appStore.convertForce(values[DofID.Dz])).toString();
    loadNodeValueMy.value = appStore.convertMoment(values[DofID.Ry]).toString();
  }
});

const editNodalLoad = () => {
  if (valid.value === false) return;

  executeModelMutationWithUndo(() => {
    if (props.type === 'displacement') {
      const load = useProjectStore().solver.loadCases[0].prescribedBC[props.index];
      load.prescribedValues[DofID.Dx] = realFx.value;
      load.prescribedValues[DofID.Dz] = realFz.value;
      load.prescribedValues[DofID.Ry] = realMy.value;
    } else {
      const load = useProjectStore().solver.loadCases[0].nodalLoadList[props.index];
      load.values[DofID.Dx] = realFx.value;
      load.values[DofID.Dz] = realFz.value;
      load.values[DofID.Ry] = realMy.value;
      load.lcs = inNodeAxes.value && turnedNode.value;
    }
  });

  projectStore.clearSelection();
  closeModal();
};

const loadNodeId = computed(() => {
  if (props.type === 'displacement') return useProjectStore().solver.loadCases[0].prescribedBC[props.index].target;

  return useProjectStore().solver.loadCases[0].nodalLoadList[props.index].target;
});

/** DOFs supported (constrained) at the target node - only those can carry a prescribed displacement. */
const nodeBcs = computed<Set<number>>(() => projectStore.solver.domain.nodes.get(loadNodeId.value)?.bcs ?? new Set());

const selectedNode = computed(() => projectStore.solver.domain.nodes.get(loadNodeId.value));

/** A node whose axes are turned: a turned support. */
const turnedNode = computed(() => isTurned(selectedNode.value));

/** Whether the components are in the node's own axes: a force when asked to, a settlement always. */
const primed = computed(() => turnedNode.value && (loadType.value === 'displacement' || inNodeAxes.value));
const mark = computed(() => (primed.value ? '′' : ''));
const axesAngle = computed(() => (primed.value ? nodeLcsAngle(selectedNode.value) : 0));

/** As many digits as are worth showing, so a turned 10 does not read 8.660254037844387. */
const shown = (v: number) => String(Number(v.toPrecision(12)));

/**
 * Switching the axes keeps the force where it is: the fields are rewritten with its components in
 * the other axes, rather than the same numbers suddenly pointing elsewhere.
 */
const convertForceFields = (toNodeAxes: boolean) => {
  const turnedValues = (toNodeAxes ? globalToNode : nodeToGlobal)(selectedNode.value, realFx.value, realFz.value);
  // Turning leaves round-off where a component should vanish: 10 kN down, in axes turned back, has
  // an x of 2e-12; that is zero, not a number to show
  const size = Math.max(...turnedValues.map(Math.abs));
  const [x, z] = turnedValues.map((v) => (Math.abs(v) < 1e-12 * size ? 0 : v));
  loadNodeValueFx.value = shown(appStore.convertForce(x));
  loadNodeValueFz.value = shown(appStore.vertical(appStore.convertForce(z)));
};

watch(inNodeAxes, (toNodeAxes) => {
  if (turnedNode.value && loadType.value === 'force') convertForceFields(toNodeAxes);
});
</script>

<style scoped>
.axes-toggle {
  height: 30px;
}

.axes-toggle .v-btn {
  text-transform: none;
  letter-spacing: normal;
}

.axes-note {
  margin: 2px 0 0;
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-surface), 0.64);
}
</style>
