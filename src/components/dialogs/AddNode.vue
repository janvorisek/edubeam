<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addNode.addNewNode') }} </v-card-title>

      <v-card-text>
        <v-form v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="6">
                  <v-text-field
                    v-model="newNodeX"
                    :label="$t('dialogs.addNode.coordinate_x')"
                    :suffix="appStore.units.Length"
                    hide-details="auto"
                    :rules="numberRules"
                    autofocus
                    required
                    :rounded="0"
                    @keydown="checkNumber($event)"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="newNodeZ"
                    :label="$t('dialogs.addNode.coordinate_z')"
                    :suffix="appStore.units.Length"
                    hide-details="auto"
                    :rules="numberRules"
                    required
                    :rounded="0"
                    @keydown="checkNumber($event)"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <div class="d-flex justify-center mb-6" style="height: 64px">
                <SupportHelper :angle="angleVal" :node="tmpNode" />
              </div>
              <div>
                <v-row no-gutters>
                  <v-col cols="6">
                    <div class="text-caption">{{ $t('dofs.bcs') }}</div>
                    <v-row no-gutters>
                      <v-col cols="4">
                        <v-checkbox
                          density="compact"
                          label="Dx"
                          hide-details="auto"
                          :model-value="tmpNode.bcs.has(0)"
                          @click="toggleSet(tmpNode, 'bcs', 0)"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4">
                        <v-checkbox
                          density="compact"
                          label="Dz"
                          hide-details="auto"
                          :model-value="tmpNode.bcs.has(2)"
                          @click="toggleSet(tmpNode, 'bcs', 2)"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4">
                        <v-checkbox
                          density="compact"
                          label="Ry"
                          hide-details="auto"
                          :model-value="tmpNode.bcs.has(4)"
                          @click="toggleSet(tmpNode, 'bcs', 4)"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="nodalAngle"
                      :label="$t('nodes.lcsAngle')"
                      hide-details="auto"
                      :rules="[...numberRules, minMax]"
                      :suffix="`°`"
                      :rounded="0"
                      @keydown="checkNumber($event)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addNode" @keydown.enter="addNode">
          {{ $t('dialogs.addNode.addNode') }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal" @keydown.enter="closeModal">
          {{ $t('dialogs.common.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useProjectStore } from '../../store/project';
import { Node } from 'ts-fem';
import { closeModal } from 'jenesius-vue-modal';
import { useAppStore } from '@/store/app';
import SupportHelper from '../svg/SupportHelper.vue';
import { checkNumber, changeRefNumValue, executeModelMutationWithUndo, numberRules, toggleSet } from '../../utils';

const projectStore = useProjectStore();
const appStore = useAppStore();

const open = ref(true);
const valid = ref(false);

const newNodeX = ref('0');
const newNodeZ = ref('0');
const nodalAngle = ref('0');
const tmpNode = ref(new Node('tmp', undefined, [0, 0, 0]));

const angleVal = computed(() => {
  const val = parseFloat(nodalAngle.value);
  return isNaN(val) ? 0 : val;
});

const minMax = (v) => {
  const val = parseFloat(v);
  if (val < -180 || val > 180) {
    return 'Enter value between -180 and 180.';
  }
  return true;
};

const addNode = () => {
  if (valid.value === false) return;

  const domain = projectStore.solver.domain;

  let nid = domain.nodes.size + 1; //Math.round(Date.now() / 1000);

  while (projectStore.solver.domain.nodes.has(nid.toString())) {
    nid++;
  }

  const nx = appStore.convertInverseLength(changeRefNumValue(newNodeX.value.toString()));
  const nz = appStore.convertInverseLength(changeRefNumValue(newNodeZ.value.toString()));
  const ang = parseFloat(nodalAngle.value) * (Math.PI / 180);

  executeModelMutationWithUndo(() => {
    const node = domain.createNode(nid, [nx, 0.0, nz], [...tmpNode.value.bcs.values()]);

    if (!isNaN(ang) && Math.abs(ang) >= 1e-8) {
      const locx = [Math.cos(ang), 0, Math.sin(ang)];
      const locy = [0, 1, 0];
      node.updateLcs({ locx, locy });
    }

    domain.nodes = new Map(domain.nodes);
  });

  closeModal();
};
</script>
