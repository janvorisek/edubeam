<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addCrossSection.addNewCrossSection') }} </v-card-title>

      <v-card-text class="px-0">
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="csArea"
                  :label="$t('crossSection.area')"
                  :suffix="appStore.units.Area"
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
                  v-model="csIy"
                  :label="$t('crossSection.iy')"
                  :suffix="appStore.units.AreaM2"
                  hide-details="auto"
                  :rules="numberRules"
                  required
                  :rounded="0"
                  @keydown="checkNumber($event)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="csH"
                  :label="$t('crossSection.h')"
                  :suffix="appStore.units.Length"
                  hide-details="auto"
                  :rules="numberRules"
                  required
                  :rounded="0"
                  @keydown="checkNumber($event)"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="csShear"
                  :label="$t('crossSection.k')"
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
            @click="openModal(CrossSectionLibraryDialog)"
          >
            {{ $t('dialogs.common.orChooseFromLibrary') }}
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addCrossSection" @keydown.enter="addCrossSection">
          {{ $t('dialogs.addCrossSection.addCrossSection') }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal" @keydown.enter="closeModal">
          {{ $t('dialogs.common.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { closeModal, openModal } from 'jenesius-vue-modal';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { checkNumber, numberRules, parseFloat2, setUnsolved } from '@/utils';
import CrossSectionLibraryDialog from './CrossSectionLibrary.vue';

const projectStore = useProjectStore();
const appStore = useAppStore();

const open = ref(true);
const valid = ref(false);

const csArea = ref(`${appStore.convertArea(1)}`);
const csIy = ref(`${appStore.convertAreaM2(0.0001)}`);
const csH = ref(`${appStore.convertLength(1)}`);
const csShear = ref('1');

const addCrossSection = () => {
  if (valid.value === false) return;

  setUnsolved();
  const domain = projectStore.solver.domain;

  let nid = domain.crossSections.size + 1;

  while (domain.crossSections.has(nid.toString())) {
    nid++;
  }

  domain.createCrossSection(nid, {
    a: appStore.convertInverseArea(parseFloat2(csArea.value)),
    iy: appStore.convertInverseAreaM2(parseFloat2(csIy.value)),
    h: appStore.convertInverseLength(parseFloat2(csH.value)),
    k: parseFloat2(csShear.value),
  });

  domain.crossSections = new Map(domain.crossSections);

  projectStore.solve();
  closeModal();
};
</script>
