<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addNode.addNewNode') }} </v-card-title>

      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" md="6">
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

              <v-col cols="6" md="6">
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
          </v-container>
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
import { ref, reactive, computed } from 'vue';
import { useProjectStore } from '../../store/project';
import { DofID, NodalLoad } from 'ts-fem';
import { closeModal } from 'jenesius-vue-modal';
import { useAppStore } from '@/store/app';
import { checkNumber, changeRefNumValue, numberRules } from '../../utils';

const projectStore = useProjectStore();
const appStore = useAppStore();

const open = ref(true);
const valid = ref(false);

const newNodeX = ref('0');
const newNodeZ = ref('0');

const addNode = () => {
  if (valid.value === false) return;

  useProjectStore().solver.loadCases[0].solved = false;
  const domain = projectStore.solver.domain;

  let nid = domain.nodes.size + 1; //Math.round(Date.now() / 1000);

  while (projectStore.solver.domain.nodes.has(nid.toString())) {
    nid++;
  }

  const nx = appStore.convertInverseLength(changeRefNumValue(newNodeX.value.toString()));
  const nz = appStore.convertInverseLength(changeRefNumValue(newNodeZ.value.toString()));

  domain.createNode(nid, [nx, 0.0, nz]);

  domain.nodes = new Map(domain.nodes);

  closeModal();
  useProjectStore().solve();
};
</script>
