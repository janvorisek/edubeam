<template>
  <div>
    <h3 class="mb-2">{{ $t('settings.language_and_locale') }}</h3>

    <v-row>
      <v-col cols="12" md="6">
        <h4 class="mb-1">{{ $t('settings.language') }}</h4>

        <div class="mb-1">{{ $t('settings.language_description') }}</div>

        <v-select
          v-model="appStore.locale"
          item-title="name"
          item-value="code"
          hide-details="auto"
          :items="availableLocales"
          :label="$t('settings.language')"
        >
          <template #item="{ item, props }">
            <v-list-item v-bind="props" color="primary">
              <template #prepend>
                <img :src="getImageUrl(item.raw.code)" class="mr-3" height="24" />
              </template>
            </v-list-item>
          </template>
        </v-select>

        <h4 class="mb-1 mt-3">{{ $t('settings.number_format') }}</h4>

        <div class="mb-1">{{ $t('settings.number_format_description') }}</div>

        <v-select
          v-model="appStore.numberStyle"
          :items="numberStyleItems"
          hide-details="auto"
          :label="$t('settings.number_format')"
        />

        <h4 class="mb-1 mt-3">{{ $t('settings.axisConvention') }}</h4>

        <div class="mb-1">{{ $t('settings.axisConvention_description') }}</div>

        <AxisConventionPicker v-model="appStore.axisConvention" class="mt-2" />
      </v-col>

      <v-col cols="12" md="6">
        <h4 class="mb-1">{{ $t('settings.units.units') }}</h4>

        <div class="mb-1">{{ $t('settings.units_description') }}</div>

        <v-select
          v-model="unitSystemProxy"
          :items="unitSystemItems"
          hide-details="auto"
          class="mb-2"
          :label="$t('settings.units.system')"
        />

        <v-row no-gutters>
          <v-col cols="6">
            <v-select
              :model-value="appStore.units.Length"
              :items="lengthItems"
              hide-details="auto"
              :label="$t('settings.units.length')"
              @update:model-value="appStore.setLengthUnit"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="appStore.units.SectionLength"
              :items="lengthItems"
              hide-details="auto"
              :label="$t('settings.units.sectionLength')"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="appStore.units.Displacement"
              :items="lengthItems"
              hide-details="auto"
              :label="$t('settings.units.displacement')"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="appStore.units.Area"
              :items="areaItems"
              hide-details="auto"
              :label="$t('settings.units.area')"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="appStore.units.AreaM2"
              :items="secondMomentItems"
              hide-details="auto"
              :label="$t('settings.units.areaM2')"
            >
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <template #title><span v-html="formatMeasureAsHTML(item.title)"></span></template>
                </v-list-item>
              </template>

              <template #selection="{ item }">
                <span v-html="formatMeasureAsHTML(item.title)"></span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="appStore.units.Mass"
              :items="massItems"
              hide-details="auto"
              :label="$t('settings.units.mass')"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="appStore.units.Force"
              :items="forceItems"
              hide-details="auto"
              :label="$t('settings.units.force')"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="momentUnitsProxy"
              :items="momentItems"
              hide-details="auto"
              :label="$t('settings.units.moment')"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="appStore.units.Pressure"
              :items="pressureItems"
              hide-details="auto"
              :label="$t('settings.units.pressure')"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="temperatureProxy"
              :items="temperatureItems"
              hide-details="auto"
              :label="$t('settings.units.temperature')"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { availableLocales } from '../../plugins/i18n';
import { formatMeasureAsHTML } from '../../SVGUtils';
import AxisConventionPicker from './AxisConventionPicker.vue';

const appStore = useAppStore();

import English from 'language-icons/icons/en.svg';
import Czech from 'language-icons/icons/cs.svg';
import German from 'language-icons/icons/de.svg';
import Spanish from 'language-icons/icons/es.svg';
import French from 'language-icons/icons/fr.svg';
import Portuguese from 'language-icons/icons/pt.svg';
import Chinese from 'language-icons/icons/zh.svg';
import Polish from 'language-icons/icons/pl.svg';
import Ukrainian from 'language-icons/icons/uk.svg';
import Russian from 'language-icons/icons/ru.svg';
import Turkish from 'language-icons/icons/tr.svg';
import ThaiFlag from '../../assets/th-flag.svg';
import { computed } from 'vue';
import { momentLabel, unitText, type ForceUnit, type LengthUnit, type TemperatureUnit } from '@/utils/unitConversions';
import type { UnitSystem } from '@/utils/unitSystems';
import { useI18n } from 'vue-i18n';

const flags = {
  en: English,
  cs: Czech,
  de: German,
  es: Spanish,
  fr: French,
  pt: Portuguese,
  cn: Chinese,
  th: ThaiFlag,
  pl: Polish,
  uk: Ukrainian,
  ru: Russian,
  tr: Turkish,
};

function getImageUrl(name) {
  return flags[name];
}

const { t } = useI18n();

const numberStyleItems = computed(() => [
  { title: t('settings.number_format_auto'), value: 'auto' },
  { title: t('settings.number_format_scientific'), value: 'scientific' },
  { title: t('settings.number_format_engineering'), value: 'engineering' },
]);

const unit = <T extends string>(value: T, title: string = value) => ({ title, value });

const lengthItems = (['m', 'cm', 'mm', 'ft', 'in'] as const).map((u) => unit(u));
const areaItems = (['m', 'cm', 'mm', 'ft', 'in'] as const).map((u) => unit(`${u}2`, `${u}²`));
const secondMomentItems = (['m', 'cm', 'mm', 'ft', 'in'] as const).map((u) => unit(`${u}4`));
const massItems = (['kg', 'lb'] as const).map((u) => unit(u));
const forceItems = (['N', 'kN', 'MN', 'kgf', 'Tonf', 'lbf', 'kip'] as const).map((u) => unit(u));
const pressureItems = (['Pa', 'kPa', 'MPa', 'GPa', 'ksc', 'psi', 'ksi', 'psf', 'ksf'] as const).map((u) => unit(u));
const temperatureItems = (['C', 'F'] as const).map((u) => unit(u, unitText(u)));

// Each value is a force and a length; the store keeps them apart, the list shows them together.
const momentPairs = [
  ['N', 'mm'],
  ['N', 'm'],
  ['kN', 'm'],
  ['MN', 'm'],
  ['Tonf', 'm'],
  ['lbf', 'in'],
  ['lbf', 'ft'],
  ['kip', 'in'],
  ['kip', 'ft'],
] as const satisfies readonly (readonly [ForceUnit, LengthUnit])[];

const momentItems = momentPairs.map(([force, length]) => unit(`${force}_${length}`, momentLabel(force, length)));

const momentUnitsProxy = computed({
  get: () => `${appStore.momentUnits.force}_${appStore.momentUnits.length}`,
  set: (val: string) => {
    const pair = momentPairs.find(([force, length]) => `${force}_${length}` === val);
    if (pair) appStore.momentUnits = { force: pair[0], length: pair[1] };
  },
});

// A coefficient of thermal expansion is per degree of the same scale, so both change together.
const temperatureProxy = computed({
  get: () => appStore.units.Temperature,
  set: (val: TemperatureUnit) => {
    appStore.units.Temperature = val;
    appStore.units.ThermalExpansion = val === 'F' ? '1/F' : '1/K';
  },
});

const unitSystemItems = computed(() => [
  { title: t('settings.units.systemSI'), value: 'si' },
  { title: t('settings.units.systemUS'), value: 'us' },
  { title: t('settings.units.systemCustom'), value: 'custom', props: { disabled: true } },
]);

// A mix of the two shows as custom, which cannot itself be chosen: it is what a change of any
// single unit below makes.
const unitSystemProxy = computed({
  get: () => appStore.unitSystem ?? 'custom',
  set: (val: UnitSystem | 'custom') => {
    if (val !== 'custom') appStore.unitSystem = val;
  },
});
</script>
