<template>
  <div class="container px-3 py-3 fill-height overflow-auto">
    <v-row>
      <v-col cols="2" style="min-width: 360px">
        <v-sheet rounded="lg">
          <v-list rounded="lg" active-class="bg-primary">
            <v-list-item
              :active="tab === 'lang'"
              value="lang"
              class="py-3"
              color="grey-lighten-4"
              link
              :title="$t('settings.language_and_locale')"
              :subtitle="$t('settings.language_and_locale_subtitle')"
              prepend-icon="mdi-translate"
              @click="tab = 'lang'"
            ></v-list-item>

            <v-divider></v-divider>

            <v-list-item
              :active="tab === 'appearance'"
              value="appearance"
              class="py-3"
              color="grey-lighten-4"
              link
              :title="$t('settings.viewer_settings')"
              :subtitle="$t('settings.viewer_settings_subtitle')"
              prepend-icon="mdi-palette"
              @click="tab = 'appearance'"
            ></v-list-item>

            <v-divider></v-divider>

            <v-list-item
              :active="tab === 'controls'"
              value="controls"
              class="py-3"
              color="grey-lighten-4"
              link
              :title="$t('settings.controls_and_shortcuts')"
              :subtitle="$t('settings.controls_and_shortcuts_subtitle')"
              prepend-icon="mdi-keyboard"
              @click="tab = 'controls'"
            ></v-list-item>

            <v-divider></v-divider>

            <v-btn
              class="mt-3"
              prepend-icon="mdi-restart"
              variant="text"
              @click="
                openModal(Confirmation, {
                  title: t('confirmation.resetSettings.title'),
                  message: t('confirmation.resetSettings.message'),
                  success: resetSettings,
                })
              "
            >
              {{ $t("settings.reset_settings") }}
            </v-btn>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet min-height="70vh" rounded="lg">
          <v-window v-model="tab">
            <v-window-item value="lang">
              <LanguageUnits />
            </v-window-item>
            <v-window-item value="appearance">
              <Appearance />
            </v-window-item>
            <v-window-item value="controls">
              <KeyboardMouse />
            </v-window-item>
          </v-window>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useProjectStore } from "@/store/project";
import { useViewerStore } from "@/store/viewer";
import { availableLocales } from "../../plugins/i18n";
import { onMounted, ref } from "vue";
import { formatMeasureAsHTML } from "../../SVGUtils";

import LanguageUnits from "@/components/settings/LanguageUnits.vue";
import Appearance from "@/components/settings/Appearance.vue";
import KeyboardMouse from "@/components/settings/KeyboardMouse.vue";

import { openModal } from "jenesius-vue-modal";
import Confirmation from "../dialogs/Confirmation.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();

const unitSystem = ref("si");

const tab = ref("lang");

const resetSettings = () => {
  //appStore.reset();
  //projectStore.reset();
  //viewerStore.reset();
};
</script>

<style>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
</style>
