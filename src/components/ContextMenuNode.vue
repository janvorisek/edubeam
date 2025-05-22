<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal';
import AddNodalLoadDialog from './dialogs/AddNodalLoad.vue';
import { useProjectStore } from '@/store/project';
import { setUnsolved, solve, toggleSet } from '@/utils';
import { computed, onMounted, ref } from 'vue';
import { Node } from 'ts-fem';

const projectStore = useProjectStore();

const lcs = ref('0');

onMounted(() => {
  lcs.value = node.value.hasLcs() ? angle.value.toString() : '0';
});

const lcsChange = () => {
  setUnsolved();

  const ang = parseFloat(lcs.value) * (Math.PI / 180);

  if (isNaN(ang) || Math.abs(ang) < 1e-8) {
    node.value.lcs = undefined;
    solve();
    return;
  }

  const locx = [Math.cos(ang), 0, Math.sin(ang)];
  const locy = [0, 1, 0];

  node.value.updateLcs({ locx, locy });

  solve();
};

const angle = computed(() => {
  if (!node.value.hasLcs()) {
    return 0;
  }

  return 90 - Math.atan2(node.value.lcs[0][0], node.value.lcs[0][2]) * (180 / Math.PI);
});

const node = computed(() => {
  return projectStore.solver.domain.nodes.get(projectStore.selection.label);
});
</script>

<template>
  <v-list density="compact" class="py-0">
    <v-list-item
      link
      class="text-body-2"
      @click="
        openModal(AddNodalLoadDialog, { label: projectStore.selection.label });
        projectStore.selection.type = null;
      "
    >
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-arrow-down-thin" /></div>
      </template>
      {{ $t('loads.addLoad') }}
    </v-list-item>
    <v-list-item link class="text-body-2">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-triangle-outline" /></div>
      </template>
      {{ $t('nodes.defineSupports') }}
      <v-menu activator="parent" open-on-click min-width="170" location="end" :close-on-content-click="false">
        <v-list density="compact" class="py-0">
          <v-row no-gutters class="px-1">
            <v-col>
              <v-checkbox
                density="compact"
                label="Dx"
                hide-details="auto"
                :model-value="node.bcs.has(0)"
                @click="toggleSet(node, 'bcs', 0)"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                density="compact"
                label="Dz"
                hide-details="auto"
                :model-value="node.bcs.has(2)"
                @click="toggleSet(node, 'bcs', 2)"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                density="compact"
                label="Ry"
                hide-details="auto"
                :model-value="node.bcs.has(4)"
                @click="toggleSet(node, 'bcs', 4)"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-text-field
                v-model="lcs"
                :label="$t('nodes.lcsAngle')"
                suffix="°"
                density="compact"
                hide-details="auto"
                :rounded="0"
                @change="lcsChange"
              />
            </v-col>
          </v-row>
        </v-list>
      </v-menu>
    </v-list-item>
    <v-list-item
      v-if="projectStore.solver.domain.nodes.get(projectStore.selection.label).bcs.size > 0"
      link
      class="text-body-2"
      @click="
        openModal(AddNodalLoadDialog, { label: projectStore.selection.label, type: 'displacement' });
        projectStore.selection.type = null;
      "
    >
      <template #prepend>
        <div class="pr-2"><v-icon size="16" icon="mdi-ruler" /></div>
      </template>
      {{ $t('loads.addPrescribedDisplacement') }}
    </v-list-item>
  </v-list>
</template>
