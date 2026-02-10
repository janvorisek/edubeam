<template>
  <v-dialog v-model="open" max-width="820">
    <v-card>
      <v-card-title> {{ $t('materials.section_library') }} </v-card-title>

      <v-card-text class="px-0">
        <v-data-table
          class="cross-section-library-table"
          :headers="headers"
          :items="crossSectionPresets"
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
          <template #item.a="{ item }">
            {{ formatScientificNumber(appStore.convertArea(item.a)) }}
          </template>
          <template #item.iy="{ item }">
            {{ formatScientificNumber(appStore.convertAreaM2(item.iy)) }}
          </template>
          <template #item.k="{ item }">
            {{ formatScientificNumber(item.k) }}
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

type CrossSectionPreset = {
  name: string;
  a: number;
  iy: number;
  h: number;
  k: number;
};

const crossSectionPresets: CrossSectionPreset[] = [
  // Rectangular (b x h), k ~= 5/6
  { name: 'Rect 100x10 mm', a: 0.1 * 0.01, iy: (0.1 * Math.pow(0.01, 3)) / 12, h: 0.01, k: 0.833 },
  { name: 'Rect 100x20 mm', a: 0.1 * 0.02, iy: (0.1 * Math.pow(0.02, 3)) / 12, h: 0.02, k: 0.833 },
  { name: 'Rect 200x20 mm', a: 0.2 * 0.02, iy: (0.2 * Math.pow(0.02, 3)) / 12, h: 0.02, k: 0.833 },
  { name: 'Rect 200x50 mm', a: 0.2 * 0.05, iy: (0.2 * Math.pow(0.05, 3)) / 12, h: 0.05, k: 0.833 },
  // Square, k ~= 5/6
  { name: 'Square 50x50 mm', a: 0.05 * 0.05, iy: (0.05 * Math.pow(0.05, 3)) / 12, h: 0.05, k: 0.833 },
  { name: 'Square 100x100 mm', a: 0.1 * 0.1, iy: (0.1 * Math.pow(0.1, 3)) / 12, h: 0.1, k: 0.833 },
  // Circular (solid), k ~= 0.9
  { name: 'Circular Ø20 mm', a: Math.PI * Math.pow(0.01, 2), iy: (Math.PI * Math.pow(0.02, 4)) / 64, h: 0.02, k: 0.9 },
  { name: 'Circular Ø50 mm', a: Math.PI * Math.pow(0.025, 2), iy: (Math.PI * Math.pow(0.05, 4)) / 64, h: 0.05, k: 0.9 },
  { name: 'Circular Ø100 mm', a: Math.PI * Math.pow(0.05, 2), iy: (Math.PI * Math.pow(0.1, 4)) / 64, h: 0.1, k: 0.9 },
  // I-shaped (approximate), k ~= 0.9
  { name: 'IPE 100 (approx)', a: 0.00103, iy: 0.000000067, h: 0.1, k: 0.9 },
  { name: 'IPE 200 (approx)', a: 0.00262, iy: 0.000000865, h: 0.2, k: 0.9 },
  { name: 'HEA 100 (approx)', a: 0.00212, iy: 0.000000237, h: 0.096, k: 0.9 },
  { name: 'HEA 200 (approx)', a: 0.00621, iy: 0.00000332, h: 0.19, k: 0.9 },
  // Hollow rectangular (approx)
  { name: 'RHS 100x50x3 (approx)', a: 0.00138, iy: 0.000000102, h: 0.05, k: 0.85 },
  { name: 'RHS 150x100x5 (approx)', a: 0.0028, iy: 0.00000052, h: 0.1, k: 0.85 },
  // Hollow circular (approx)
  { name: 'CHS Ø60x3 (approx)', a: 0.00053, iy: 0.00000011, h: 0.06, k: 0.9 },
  { name: 'CHS Ø114x5 (approx)', a: 0.00171, iy: 0.00000076, h: 0.114, k: 0.9 },
];

const headers = computed(() => [
  { title: t('common.crossSection'), key: 'name', width: 220 },
  { title: t('crossSection.area'), key: 'a', width: 140, units: appStore.units.Area },
  { title: t('crossSection.iy'), key: 'iy', width: 140, units: appStore.units.AreaM2 },
  { title: t('crossSection.k'), key: 'k', width: 120 },
  { title: t('common.actions'), key: 'actions', sortable: false },
]);

const addPreset = (preset: CrossSectionPreset) => {
  setUnsolved();

  const domain = projectStore.solver.domain;
  let label = preset.name;
  let suffix = 2;

  while (domain.crossSections.has(label)) {
    label = `${preset.name} (${suffix})`;
    suffix++;
  }

  domain.createCrossSection(label, {
    a: preset.a,
    iy: preset.iy,
    h: preset.h,
    k: preset.k,
  });

  domain.crossSections = new Map(domain.crossSections);

  projectStore.solve();
};
</script>

<style scoped>
.cross-section-library-table :deep(.v-data-table__td),
.cross-section-library-table :deep(.v-data-table__th) {
  white-space: nowrap;
}

.cross-section-library-table :deep(.v-data-table__td) {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
