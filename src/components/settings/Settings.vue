<template>
  <div class="settings-layout fill-height">
    <div class="settings-shell">
      <div class="settings-sidebar-wrapper">
        <v-sheet class="settings-panel settings-sidebar">
          <v-list class="settings-sidebar-scroll" active-class="bg-primary">
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
                pushModal(Confirmation, {
                  title: t('confirmation.resetSettings.title'),
                  message: t('confirmation.resetSettings.message'),
                  success: resetSettings,
                })
              "
            >
              {{ $t('settings.reset_settings') }}
            </v-btn>
          </v-list>
        </v-sheet>
      </div>

      <div class="settings-content-wrapper">
        <v-sheet class="settings-panel settings-content" rounded="lg">
          <div class="settings-content-scroll">
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
          </div>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { availableLocales } from '../../plugins/i18n';
import { onMounted, ref } from 'vue';
import { formatMeasureAsHTML } from '../../SVGUtils';

import LanguageUnits from '@/components/settings/LanguageUnits.vue';
import Appearance from '@/components/settings/Appearance.vue';
import KeyboardMouse from '@/components/settings/KeyboardMouse.vue';

import { pushModal } from 'jenesius-vue-modal';
import Confirmation from '../dialogs/Confirmation.vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();

const unitSystem = ref('si');

const tab = ref('lang');

const resetSettings = () => {
  // appStore.reset();
  viewerStore.reset();
};
</script>

<style>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}

.settings-layout {
  height: 100%;
  overflow: hidden;
}

.settings-shell {
  display: flex;
  flex-direction: row;
  gap: 12px;
  height: 100%;
}

.settings-sidebar-wrapper,
.settings-content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.settings-sidebar-wrapper {
  flex: 0 0 340px;
  max-width: 360px;
  border-right: 1px solid rgba(var(--v-border-color), 0.15);
  & .v-list,
  & .v-sheet {
    padding: 0;
  }

  & .v-sheet,
  & .v-list-item {
    border-radius: 0;
  }
}

.settings-content-wrapper {
  flex: 1 1 auto;
}

.settings-panel {
  background-color: rgb(var(--v-theme-surface));
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}

.settings-sidebar {
  padding: 8px 0;
}

.settings-sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.settings-content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

@media (max-width: 1100px) {
  .settings-shell {
    flex-direction: column;
  }

  .settings-sidebar-wrapper {
    flex: 0 0 auto;
    max-width: none;
  }
}
</style>
