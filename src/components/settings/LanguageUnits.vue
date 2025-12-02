<template>
  <div style="display: grid; grid-template-columns: clamp(200px, 365px, 50%) auto">
    <div>
      <h3 class="mb-2">{{ $t('settings.language_and_locale') }}</h3>

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

      <h4 class="mb-1 mt-3">{{ $t('settings.units.units') }}</h4>

      <div class="mb-1">{{ $t('settings.units_description') }}</div>

      <v-row no-gutters>
        <v-col cols="6">
          <v-select
            v-model="appStore.units.Length"
            item-title="name"
            item-value="code"
            hide-details="auto"
            :items="[
              { name: 'm', code: 'm' },
              { name: 'cm', code: 'cm' },
              { name: 'mm', code: 'mm' },
              { name: 'in', code: 'in' },
              { name: 'ft', code: 'ft' },
            ]"
            :label="$t('settings.units.length')"
          >
          </v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="appStore.units.Area"
            item-title="name"
            item-value="code"
            hide-details="auto"
            :items="[
              { name: 'm²', code: 'm2' },
              { name: 'cm²', code: 'cm2' },
              { name: 'mm²', code: 'mm2' },
              { name: 'in²', code: 'in2' },
              { name: 'ft²', code: 'ft2' },
            ]"
            :label="$t('settings.units.area')"
          ></v-select> </v-col
        ><v-col cols="6">
          <v-select
            v-model="appStore.units.AreaM2"
            item-title="name"
            item-value="code"
            hide-details="auto"
            :items="[
              { name: 'm4', code: 'm4' },
              { name: 'cm4', code: 'cm4' },
              { name: 'mm4', code: 'mm4' },
              { name: 'in4', code: 'in4' },
              { name: 'ft4', code: 'ft4' },
            ]"
            :label="$t('settings.units.areaM2')"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #title><span v-html="formatMeasureAsHTML(item.title)"></span></template>
              </v-list-item>
            </template>

            <template #selection="{ item }">
              <span v-html="formatMeasureAsHTML(item.title)"></span>
            </template> </v-select
        ></v-col>
        <v-col cols="6"
          ><v-select
            v-model="appStore.units.Mass"
            item-title="name"
            item-value="code"
            hide-details="auto"
            :items="[
              { name: 'kg', code: 'kg' },
              { name: 'lb', code: 'lb' },
            ]"
            :label="$t('settings.units.mass')"
          >
          </v-select
        ></v-col>

        <v-col cols="6"
          ><v-select
            v-model="appStore.units.Force"
            item-title="name"
            item-value="code"
            hide-details="auto"
            :items="[
              { name: 'N', code: 'N' },
              { name: 'kN', code: 'kN' },
              { name: 'MN', code: 'MN' },
              { name: 'lbf', code: 'lbf' },
              { name: 'Tonf', code: 'Tonf' },
              { name: 'kgf', code: 'kgf' },
            ]"
            :label="$t('settings.units.force')"
          >
          </v-select
        ></v-col>

        <v-col cols="6"
          ><v-select
            v-model="momentUnitsProxy"
            item-title="name"
            item-value="code"
            hide-details="auto"
            :items="[
              { name: 'Nmm', code: 'N_mm' },
              { name: 'Nm', code: 'N_m' },
              { name: 'kNm', code: 'kN_m' },
              { name: 'MNm', code: 'MN_m' },
              { name: 'Tonf·m', code: 'Tonf_m' },
              { name: 'lbf·in', code: 'lbf_in' },
              { name: 'lbf·ft', code: 'lbf_ft' },
            ]"
            :label="$t('settings.units.moment')"
          >
          </v-select
        ></v-col>

        <v-col cols="6"
          ><v-select
            v-model="appStore.units.Pressure"
            item-title="name"
            item-value="code"
            hide-details="auto"
            :items="[
              { name: 'Pa', code: 'Pa' },
              { name: 'kPa', code: 'kPa' },
              { name: 'MPa', code: 'MPa' },
              { name: 'GPa', code: 'GPa' },
              { name: 'psi', code: 'psi' },
              { name: 'ksc', code: 'ksc' },
            ]"
            :label="$t('settings.units.pressure')"
          >
          </v-select
        ></v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { availableLocales } from '../../plugins/i18n';
import { formatMeasureAsHTML } from '../../SVGUtils';

const appStore = useAppStore();

import English from 'language-icons/icons/en.svg';
import Czech from 'language-icons/icons/cs.svg';
import German from 'language-icons/icons/de.svg';
import Spanish from 'language-icons/icons/es.svg';
import French from 'language-icons/icons/fr.svg';
import Chinese from 'language-icons/icons/zh.svg';
import ThaiFlag from '../../assets/th-flag.svg';
import { computed } from 'vue';

const flags = { en: English, cs: Czech, de: German, es: Spanish, fr: French, cn: Chinese, th: ThaiFlag };

function getImageUrl(name) {
  return flags[name];
}

const momentUnitsProxy = computed({
  get: () => `${appStore.momentUnits.force}_${appStore.momentUnits.length}`,
  set: (val: string) => {
    const [force, length] = val.split('_');
    appStore.momentUnits.force = force;
    appStore.momentUnits.length = length;
  },
});
</script>
