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
            {{ formatScientificNumber(item.alpha) }}
          </template>
          <template #item.d="{ item }">
            {{ formatScientificNumber(item.d) }}
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
import { formatScientificNumber, setUnsolved } from '@/utils';
import { formatMeasureAsHTML } from '@/SVGUtils';
import { useI18n } from 'vue-i18n';

const projectStore = useProjectStore();
const appStore = useAppStore();
const { t } = useI18n();

const open = ref(true);

type MaterialPreset = {
  name: string;
  e: number;
  g: number;
  alpha: number;
  d: number;
};

const materialPresets: MaterialPreset[] = [
  {
    name: 'Steel (S235)',
    e: 210e9,
    g: 81e9,
    alpha: 12e-6,
    d: 7850,
  },
  {
    name: 'Aluminum (6061-T6)',
    e: 69e9,
    g: 26e9,
    alpha: 23e-6,
    d: 2700,
  },
  {
    name: 'Concrete (C25/30)',
    e: 30e9,
    g: 12e9,
    alpha: 10e-6,
    d: 2400,
  },
  {
    name: 'Timber (C24)',
    e: 11e9,
    g: 0.69e9,
    alpha: 3e-6,
    d: 500,
  },
  {
    name: 'Steel (S275)',
    e: 210e9,
    g: 81e9,
    alpha: 12e-6,
    d: 7850,
  },
  {
    name: 'Steel (S355)',
    e: 210e9,
    g: 81e9,
    alpha: 12e-6,
    d: 7850,
  },
  {
    name: 'Stainless steel (304)',
    e: 193e9,
    g: 74e9,
    alpha: 17e-6,
    d: 8000,
  },
  {
    name: 'Stainless steel (316)',
    e: 193e9,
    g: 74e9,
    alpha: 16e-6,
    d: 8000,
  },
  {
    name: 'Cast iron (gray)',
    e: 110e9,
    g: 43e9,
    alpha: 11e-6,
    d: 7200,
  },
  {
    name: 'Aluminum (7075-T6)',
    e: 71.7e9,
    g: 26.9e9,
    alpha: 23.6e-6,
    d: 2810,
  },
  {
    name: 'Aluminum (5083)',
    e: 72e9,
    g: 27e9,
    alpha: 23.5e-6,
    d: 2650,
  },
  {
    name: 'Copper',
    e: 110e9,
    g: 44e9,
    alpha: 17e-6,
    d: 8960,
  },
  {
    name: 'Brass (C360)',
    e: 100e9,
    g: 37e9,
    alpha: 19e-6,
    d: 8500,
  },
  {
    name: 'Bronze (C932)',
    e: 105e9,
    g: 40e9,
    alpha: 17e-6,
    d: 8800,
  },
  {
    name: 'Titanium (Grade 2)',
    e: 105e9,
    g: 41e9,
    alpha: 8.6e-6,
    d: 4510,
  },
  {
    name: 'Titanium (Ti-6Al-4V)',
    e: 114e9,
    g: 44e9,
    alpha: 8.6e-6,
    d: 4430,
  },
  {
    name: 'Concrete (C30/37)',
    e: 33e9,
    g: 13.5e9,
    alpha: 10e-6,
    d: 2400,
  },
  {
    name: 'Concrete (C40/50)',
    e: 37e9,
    g: 15e9,
    alpha: 10e-6,
    d: 2400,
  },
  {
    name: 'Concrete (lightweight)',
    e: 15e9,
    g: 6e9,
    alpha: 8e-6,
    d: 1800,
  },
  {
    name: 'Timber (GL24h)',
    e: 11.5e9,
    g: 0.72e9,
    alpha: 3e-6,
    d: 450,
  },
  {
    name: 'Timber (GL32h)',
    e: 13.5e9,
    g: 0.84e9,
    alpha: 3e-6,
    d: 470,
  },
  {
    name: 'Glass (soda-lime)',
    e: 70e9,
    g: 29e9,
    alpha: 9e-6,
    d: 2500,
  },
  {
    name: 'GFRP (quasi-isotropic)',
    e: 25e9,
    g: 9e9,
    alpha: 6e-6,
    d: 1900,
  },
  {
    name: 'CFRP (quasi-isotropic)',
    e: 70e9,
    g: 5e9,
    alpha: 0.5e-6,
    d: 1600,
  },
  {
    name: 'HDPE',
    e: 0.8e9,
    g: 0.3e9,
    alpha: 120e-6,
    d: 950,
  },
  {
    name: 'PVC (rigid)',
    e: 3.0e9,
    g: 1.1e9,
    alpha: 80e-6,
    d: 1400,
  },
  {
    name: 'PMMA (acrylic)',
    e: 3.2e9,
    g: 1.2e9,
    alpha: 70e-6,
    d: 1180,
  },
  {
    name: 'Polycarbonate',
    e: 2.3e9,
    g: 0.9e9,
    alpha: 65e-6,
    d: 1200,
  },
];

const densityUnits = computed(() => `${appStore.units.Mass}/${appStore.units.Length}3`);

const headers = computed(() => [
  { title: t('common.material'), key: 'name', width: 200 },
  { title: t('material.e'), key: 'e', width: 140, units: appStore.units.Pressure },
  { title: t('material.g'), key: 'g', width: 140, units: appStore.units.Pressure },
  { title: t('material.alphaT'), key: 'alpha', width: 120, units: appStore.units.ThermalExpansion },
  { title: t('material.density'), key: 'd', width: 120, units: densityUnits.value },
  { title: t('common.actions'), key: 'actions', sortable: false },
]);

const addPreset = (preset: MaterialPreset) => {
  setUnsolved();

  const domain = projectStore.solver.domain;
  let label = preset.name;
  let suffix = 2;

  while (domain.materials.has(label)) {
    label = `${preset.name} (${suffix})`;
    suffix++;
  }

  domain.createMaterial(label, {
    e: preset.e,
    g: preset.g,
    alpha: preset.alpha,
    d: preset.d,
  });

  domain.materials = new Map(domain.materials);

  projectStore.solve();
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
