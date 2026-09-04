<script setup lang="ts">
import { openModal } from 'jenesius-vue-modal';
import AddNodalLoadDialog from './dialogs/AddNodalLoad.vue';
import { useProjectStore } from '@/store/project';
import { deleteNode, executeModelMutationWithUndo, setUnsolved, toggleSet } from '@/utils';
import { computed, ref, watch } from 'vue';

const projectStore = useProjectStore();

const lcs = ref('0');

/**
 * The selection can stop resolving while this menu is open - it is cleared, or the node it names
 * is renamed or deleted - and the menu outlives that by a render. Everything here has to cope
 * with there being no node.
 */
const node = computed(() => {
  if (projectStore.selection.label === null) return undefined;

  return projectStore.solver.domain.nodes.get(String(projectStore.selection.label));
});

const angle = computed(() => {
  if (!node.value?.hasLcs()) return 0;

  return 90 - Math.atan2(node.value.lcs[0][0], node.value.lcs[0][2]) * (180 / Math.PI);
});

/**
 * Follow the model rather than only reading it once: an undo, or picking a different node, leaves
 * the field showing an angle the node no longer has - and committing that would re-apply it.
 * Typing moves `lcs` alone, so this never fights the user mid-edit.
 */
watch([node, angle], () => (lcs.value = angle.value.toString()), { immediate: true });

const lcsChange = () => {
  const target = node.value;
  if (!target) return;

  executeModelMutationWithUndo(() => {
    setUnsolved();

    const ang = parseFloat(lcs.value) * (Math.PI / 180);

    if (isNaN(ang) || Math.abs(ang) < 1e-8) {
      target.lcs = undefined;
      return;
    }

    target.updateLcs({ locx: [Math.cos(ang), 0, Math.sin(ang)], locy: [0, 1, 0] });
  });
};

const removeNode = () => {
  if (projectStore.selection.type !== 'node' || projectStore.selection.label === null) return;

  deleteNode(String(projectStore.selection.label));
};
</script>

<template>
  <v-list v-if="node" density="compact" class="py-0">
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
      v-if="node.bcs.size > 0"
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
    <v-divider v-if="projectStore.selection.type === 'node'" />
    <v-list-item v-if="projectStore.selection.type === 'node'" link class="text-body-2 text-error" @click="removeNode">
      <template #prepend>
        <div class="pr-2"><v-icon size="16" color="error" icon="mdi-delete" /></div>
      </template>
      {{ $t('common.delete') }}
    </v-list-item>
  </v-list>
</template>
