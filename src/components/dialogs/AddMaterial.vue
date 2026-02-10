<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addMaterial.addNewMaterial') }} </v-card-title>

      <v-card-text class="px-0">
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="matE"
                  :label="$t('dialogs.addMaterial.E')"
                  :suffix="appStore.units.Pressure"
                  hide-details="auto"
                  :rules="numberRules"
                  required
                  autofocus
                  :rounded="0"
                  @keydown="checkNumber($event)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="matG"
                  :label="$t('dialogs.addMaterial.G')"
                  :suffix="appStore.units.Pressure"
                  hide-details="auto"
                  :rules="numberRules"
                  required
                  :rounded="0"
                  @keydown="checkNumber($event)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="matDensity"
                  :label="$t('dialogs.addMaterial.density')"
                  :suffix="densityUnits"
                  hide-details="auto"
                  :rules="numberRules"
                  required
                  :rounded="0"
                  @keydown="checkNumber($event)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="matAlphaTemp"
                  :label="$t('dialogs.addMaterial.alphaT')"
                  :suffix="appStore.units.ThermalExpansion"
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
        <div class="px-2">
          <v-btn
            variant="text"
            density="default"
            size="default"
            class="text-none"
            @click="openModal(MaterialLibraryDialog)"
          >
            {{ $t('dialogs.common.orChooseFromLibrary') }}
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addMaterial" @keydown.enter="addMaterial">
          {{ $t('dialogs.addMaterial.addMaterial') }}
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
import { closeModal, openModal } from 'jenesius-vue-modal';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { checkNumber, numberRules, parseFloat2, setUnsolved } from '@/utils';
import MaterialLibraryDialog from './MaterialLibrary.vue';

const projectStore = useProjectStore();
const appStore = useAppStore();

const open = ref(true);
const valid = ref(false);

const matE = ref(`${appStore.convertPressure(210000e6)}`);
const matG = ref(`${appStore.convertPressure(210000e6 / (2 * (1 + 0.2)))}`);
const matDensity = ref('1000');
const matAlphaTemp = ref('0.000012');

const densityUnits = computed(() => `${appStore.units.Mass}/${appStore.units.Length}3`);

const addMaterial = () => {
  if (valid.value === false) return;

  setUnsolved();

  const domain = projectStore.solver.domain;

  let nid = domain.materials.size + 1;

  while (domain.materials.has(nid.toString())) {
    nid++;
  }

  domain.createMaterial(nid, {
    e: appStore.convertInversePressure(parseFloat2(matE.value)),
    g: appStore.convertInversePressure(parseFloat2(matG.value)),
    alpha: parseFloat2(matAlphaTemp.value),
    d: parseFloat2(matDensity.value),
  });

  domain.materials = new Map(domain.materials);

  projectStore.solve();
  closeModal();
};
</script>
