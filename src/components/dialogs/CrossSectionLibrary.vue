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
import { executeModelMutationWithUndo, formatScientificNumber, setUnsolved } from '@/utils';
import { formatMeasureAsHTML } from '@/SVGUtils';
import { useI18n } from 'vue-i18n';
import { crossSectionPresets as allCrossSectionPresets, type CrossSectionPreset } from '@/utils/crossSectionPresets';
import { familyFirst, presetFamily } from '@/utils/presetFamily';

const projectStore = useProjectStore();
const appStore = useAppStore();
const { t } = useI18n();

const open = ref(true);

// AISC shapes on top for someone working in feet, the EN ones otherwise
const crossSectionPresets = computed(() => familyFirst(allCrossSectionPresets, presetFamily(appStore.units.Length)));

const headers = computed(() => [
  { title: t('common.crossSection'), key: 'name', width: 220 },
  { title: t('crossSection.area'), key: 'a', width: 140, units: appStore.units.Area },
  { title: t('crossSection.iy'), key: 'iy', width: 140, units: appStore.units.AreaM2 },
  { title: t('crossSection.k'), key: 'k', width: 120 },
  { title: t('common.actions'), key: 'actions', sortable: false },
]);

const addPreset = (preset: CrossSectionPreset) => {
  const domain = projectStore.solver.domain;
  let label = preset.name;
  let suffix = 2;

  while (domain.crossSections.has(label)) {
    label = `${preset.name} (${suffix})`;
    suffix++;
  }

  executeModelMutationWithUndo(() => {
    setUnsolved();

    domain.createCrossSection(label, {
      a: preset.a,
      iy: preset.iy,
      h: preset.h,
      k: preset.k,
    });

    domain.crossSections = new Map(domain.crossSections);
  });
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
