<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addElement.addNewElement') }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" md="6">
                <v-select
                  v-model="newElementFrom"
                  :items="projectStore.nodes"
                  item-title="label"
                  item-value="label"
                  :label="$t('dialogs.addElement.fromNodeId')"
                  hide-details="auto"
                  required
                  autofocus
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-select
                  v-model="newElementTo"
                  :items="projectStore.nodes"
                  item-title="label"
                  item-value="label"
                  :label="$t('dialogs.addElement.toNodeId')"
                  hide-details="auto"
                  required
                />
              </v-col>
            </v-row>

            <div class="d-flex flex-column ga-3 py-3">
              <div style="width: fit-content">
                <v-alert v-if="projectStore.materials.length === 0" icon="$warning" density="compact" type="error">
                  <template #text>
                    <div class="d-flex align-center">
                      {{ $t('warnings.noMaterialsDefined') }}
                      <v-btn variant="text" density="compact" size="small" @click="openModal(AddMaterialDialog)">{{
                        $t('common.addNew')
                      }}</v-btn>
                    </div>
                  </template>
                </v-alert>
              </div>

              <div style="width: fit-content">
                <v-alert v-if="projectStore.crossSections.length === 0" icon="$warning" density="compact" type="error">
                  <template #text>
                    <div class="d-flex align-center">
                      {{ $t('warnings.noCrossSectionsDefined') }}
                      <v-btn variant="text" density="compact" size="small" @click="openModal(AddCrossSectionDialog)">{{
                        $t('common.addNew')
                      }}</v-btn>
                    </div>
                  </template>
                </v-alert>
              </div>
            </div>

            <v-row v-if="projectStore.materials.length > 0 && projectStore.crossSections.length > 0" no-gutters>
              <v-col cols="6">
                <v-select
                  v-model="newElementMat"
                  :items="projectStore.materials"
                  item-title="label"
                  item-value="label"
                  :label="$t('dialogs.addElement.material')"
                  hide-details="auto"
                  required
                  autofocus
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-select
                  v-model="newElementCS"
                  :items="projectStore.crossSections"
                  item-title="label"
                  item-value="label"
                  :label="$t('dialogs.addElement.crossSection')"
                  hide-details="auto"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addElement()" @keydown.enter="addElement">
          {{ $t('dialogs.addElement.addElement') }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal()" @keydown.enter="closeModal">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useProjectStore } from '../../store/project';
import { DofID, NodalLoad } from 'ts-fem';
import { closeModal, openModal } from 'jenesius-vue-modal';
import { useAppStore } from '@/store/app';
import { checkNumber } from '@/utils';
import { onMounted } from 'vue';
import AddMaterialDialog from './AddMaterial.vue';
import AddCrossSectionDialog from './AddCrossSection.vue';

const projectStore = useProjectStore();
const appStore = useAppStore();

const open = ref(true);

const newElementFrom = ref('');
const newElementTo = ref('');
const newElementMat = ref('');
const newElementCS = ref('');

onMounted(() => {
  if (projectStore.solver.domain.nodes.size >= 2) {
    newElementFrom.value = [...useProjectStore().solver.domain.nodes.values()][0].label;
    newElementTo.value = [...useProjectStore().solver.domain.nodes.values()][1].label;
  }

  if (projectStore.solver.domain.materials.size > 0) {
    newElementMat.value = [...useProjectStore().solver.domain.materials.values()][0].label;
  }

  if (projectStore.solver.domain.crossSections.size > 0) {
    newElementCS.value = [...useProjectStore().solver.domain.crossSections.values()][0].label;
  }
});

const addElement = () => {
  // check if material and cross section are selected
  if (newElementMat.value === '' || newElementCS.value === '') {
    return alert('Please select a material and cross section');
  }

  useProjectStore().solver.loadCases[0].solved = false;
  const domain = useProjectStore().solver.domain;

  //if (domain.elements.has(999)) return alert("Element id 999 already exists");

  let nid = domain.elements.size + 1;

  while (projectStore.solver.domain.elements.has(nid.toString())) {
    nid++;
  }

  domain.createBeam2D(nid, [newElementFrom.value, newElementTo.value], newElementMat.value, newElementCS.value);

  domain.elements = new Map(domain.elements);

  useAppStore().dialogs.addElement = false;

  useProjectStore().solve();

  closeModal();
};
</script>
