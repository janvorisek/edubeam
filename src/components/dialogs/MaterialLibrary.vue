<template>
  <v-dialog v-model="open" max-width="820">
    <v-card>
      <v-card-title> {{ $t('materials.material_library') }} </v-card-title>

      <v-card-text class="px-0">
        <v-data-table
          class="material-library-table"
          :headers="headers"
          :items="materialPresets"
          density="compact"
          fixed-header
          :height="320"
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="name"
        >
          <template #headers="{ columns }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th class="v-data-table__td v-data-table-column--align-start v-data-table__th">
                  <div class="v-data-table-header__content">
                    <span v-html="column.title"></span>&nbsp;
                    <span
                      v-if="column.units"
                      class="font-weight-regular"
                      v-html="`[${formatMeasureAsHTML(column.units)}]`"
                    ></span>
                  </div>
                </th>
              </template>
            </tr>
          </template>
          <template #item.e="{ item }">
            {{ formatScientificNumber(appStore.convertPressure(item.e)) }}
          </template>
          <template #item.g="{ item }">
            {{ formatScientificNumber(appStore.convertPressure(item.g)) }}
          </template>
          <template #item.alpha="{ item }">
            {{ formatScientificNumber(appStore.convertThermalExpansion(item.alpha)) }}
          </template>
          <template #item.d="{ item }">
            {{ formatScientificNumber(appStore.convertDensity(item.d)) }}
          </template>
          <template #item.actions="{ item }">
            <v-btn density="compact" variant="text" icon="mdi-plus" @click="addPreset(item)"></v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" @click="closeModal" @keydown.enter="closeModal">
          {{ $t('dialogs.common.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { executeModelMutationWithUndo, formatScientificNumber, setUnsolved } from '@/utils';
import { formatMeasureAsHTML } from '@/SVGUtils';
import { useI18n } from 'vue-i18n';
import { materialPresets as allMaterialPresets, type MaterialPreset } from '@/utils/materialPresets';
import { familyFirst, presetFamily } from '@/utils/presetFamily';

const projectStore = useProjectStore();
const appStore = useAppStore();
const { t } = useI18n();

const open = ref(true);

// ASTM grades on top for someone working in feet, the EN ones otherwise
const materialPresets = computed(() => familyFirst(allMaterialPresets, presetFamily(appStore.units.Length)));

const headers = computed(() => [
  { title: t('common.material'), key: 'name', width: 200 },
  { title: t('material.e'), key: 'e', width: 140, units: appStore.units.Pressure },
  { title: t('material.g'), key: 'g', width: 140, units: appStore.units.Pressure },
  { title: t('material.alphaT'), key: 'alpha', width: 120, units: appStore.units.ThermalExpansion },
  { title: t('material.density'), key: 'd', width: 120, units: appStore.units.Density },
  { title: t('common.actions'), key: 'actions', sortable: false },
]);

const addPreset = (preset: MaterialPreset) => {
  const domain = projectStore.solver.domain;
  let label = preset.name;
  let suffix = 2;

  while (domain.materials.has(label)) {
    label = `${preset.name} (${suffix})`;
    suffix++;
  }

  executeModelMutationWithUndo(() => {
    setUnsolved();

    domain.createMaterial(label, {
      e: preset.e,
      g: preset.g,
      alpha: preset.alpha,
      d: preset.d,
    });

    domain.materials = new Map(domain.materials);
  });
};
</script>

<style scoped>
.material-library-table :deep(.v-data-table__td),
.material-library-table :deep(.v-data-table__th) {
  white-space: nowrap;
}

.material-library-table :deep(.v-data-table__td) {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
