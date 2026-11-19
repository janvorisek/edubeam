<template>
  <v-dialog v-model="open" max-width="420">
    <v-card @keydown="submitsForm($event) && addNodalLoad()">
      <v-card-title class="d-flex align-center">
        <span>{{ $t('dialogs.addNodalLoad.addNewNodalLoad') }}</span>
        <HelpTip topic="nodalLoads" class="ml-1" />
      </v-card-title>

      <div>
        <v-radio-group v-model="loadType" inline density="compact" class="mx-3">
          <v-radio :label="$t('loads.forceMoment')" value="force"></v-radio>
          <v-radio
            :label="$t('loads.prescribedDisplacement')"
            value="displacement"
            :disabled="nodeBcs.size === 0"
          ></v-radio>
        </v-radio-group>
        <!-- On a turned node a force can be given in its own axes; a settlement always is -->
        <v-btn-toggle
          v-if="loadType === 'force' && turnedNode"
          v-model="inNodeAxes"
          class="axes-toggle mx-6"
          color="primary"
          density="compact"
          variant="outlined"
          divided
          mandatory
        >
          <v-btn :value="false" size="small">{{ $t('loads.globalAxes') }}</v-btn>
          <v-btn :value="true" size="small">{{ $t('loads.nodeAxes') }}</v-btn>
        </v-btn-toggle>
        <p v-if="loadType === 'displacement' && turnedNode" class="axes-note mx-6">
          {{ $t('loads.alongSupportAxes') }}
        </p>
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" align-self="center">
                <div class="d-flex justify-center">
                  <Vector2DHelper
                    :fx="loadType === 'force' ? realFx : realDx"
                    :fz="loadType === 'force' ? realFz : realDz"
                    :my="loadType === 'force' ? realMy : realRy"
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
                      required
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
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addNodalLoad()" @keydown.enter="addNodalLoad()">
          {{ $t('dialogs.addNodalLoad.addNodalLoad') }}
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
import HelpTip from '../HelpTip.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useProjectStore } from '../../store/project';
import { DofID } from '@edubeam/fem';
import { closeModal } from 'jenesius-vue-modal';
import { useAppStore } from '@/store/app';
import { checkNumber, executeModelMutationWithUndo, parseFloat2, numberRules } from '@/utils';
import { i18n } from '@/plugins/i18n';
import Vector2DHelper from '../Vector2DHelper.vue';
import { globalToNode, isTurned, nodeLcsAngle, nodeToGlobal } from '@/utils/nodalLcs';

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    label?: string | number;
    type?: 'force' | 'displacement';
  }>(),
  {
    label: undefined,
    type: 'force',
  }
);

const open = ref(true);
const valid = ref(false);

const loadType = ref('force');
const nodes = projectStore.solver.domain.nodes;
const firstNodeLabel = nodes.size > 0 ? [...nodes.values()][0].label : undefined;
const loadNodeId = ref(props.label != null && nodes.has(props.label) ? props.label : firstNodeLabel);

const selectedNode = computed(() => nodes.get(loadNodeId.value));
const nodeBcs = computed<Set<number>>(() => selectedNode.value?.bcs ?? new Set());
const loadNodeValueFx = ref(`${appStore.convertForce(0)}`);
const loadNodeValueFz = ref(`${appStore.convertForce(0)}`);
const loadNodeValueMy = ref('0');
const inNodeAxes = ref(false);

watch(loadNodeId, () => {
  if (nodeBcs.value.size === 0) {
    loadType.value = 'force';
  }
  // A node without axes of its own has only the global ones
  if (!turnedNode.value) inNodeAxes.value = false;
});

const mainLabel = computed(() => (loadType.value === 'force' ? 'F' : 'D'));
const momentLabel = computed(() => (loadType.value === 'force' ? 'M' : 'R'));

const mainUnits = computed(() => (loadType.value === 'force' ? appStore.units.Force : appStore.units.Displacement));
const momentUnits = computed(() => (loadType.value === 'force' ? appStore.units.Moment : 'rad'));

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.vertical(appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value))));
const realMy = computed(() => appStore.convertInverseMoment(parseFloat2(loadNodeValueMy.value)));

const realDx = computed(() => appStore.convertInverseDisplacement(parseFloat2(loadNodeValueFx.value)));
const realDz = computed(() =>
  appStore.vertical(appStore.convertInverseDisplacement(parseFloat2(loadNodeValueFz.value)))
);
const realRy = computed(() => parseFloat2(loadNodeValueMy.value));

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
  if (turnedNode.value) convertForceFields(toNodeAxes);
});

onMounted(() => {
  if (props.type === 'displacement') {
    loadType.value = 'displacement';
  }
});

const addNodalLoad = () => {
  if (valid.value === false || !selectedNode.value) return;

  if (loadType.value !== 'force') {
    // check if the node already has a prescribed displacement
    for (const load of projectStore.solver.loadCases[0].prescribedBC) {
      if (load.target === loadNodeId.value) {
        alert(i18n.global.t('warnings.prescribedDisplacementExists'));
        closeModal();
        return;
      }
    }
  }

  executeModelMutationWithUndo(() => {
    useProjectStore().solver.loadCases[0].solved = false;

    if (loadType.value === 'force') {
      useProjectStore().solver.loadCases[0].createNodalLoad(
        loadNodeId.value,
        {
          [DofID.Dx]: realFx.value,
          [DofID.Dz]: realFz.value,
          [DofID.Ry]: realMy.value,
        },
        inNodeAxes.value && turnedNode.value
      );
    } else {
      useProjectStore().solver.loadCases[0].createPrescribedDisplacement(loadNodeId.value, {
        [DofID.Dx]: realDx.value,
        [DofID.Dz]: realDz.value,
        [DofID.Ry]: realRy.value,
      });
    }
  });

  projectStore.clearSelection();
  closeModal();
};
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
