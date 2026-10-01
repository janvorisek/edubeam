<script lang="ts">
import { container, openModal } from 'jenesius-vue-modal';
import {
  deserializeModel,
  parseSerializedModel,
  download,
  exportJSON,
  importJSON,
  redoModelChange,
  undoModelChange,
  replaceModel,
  resetModel,
} from './utils';
import { nextTick } from 'vue';
import { useViewerStore } from './store/viewer';
import Confirmation from './components/dialogs/Confirmation.vue';
import ReloadPrompt from './components/ReloadPrompt.vue';
import { buildStarterModel } from './utils/starterModel';

export default {
  name: 'App',
  components: { WidgetContainerModal: container },
};
</script>

<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue';
import { setLocale, availableLocales } from './plugins/i18n';

import Welcome from '@/components/dialogs/Welcome.vue';
import Share from '@/components/dialogs/Share.vue';
import Examples from '@/components/dialogs/Examples.vue';
import RecentStructures from '@/components/dialogs/RecentStructures.vue';
import ExportImage from '@/components/dialogs/ExportImage.vue';
import Changelog from '@/components/dialogs/Changelog.vue';
import Editor from '@/views/Editor.vue';
import Dialogs from '@/components/Dialogs.vue';
import { useProjectStore } from './store/project';
import { useAppStore } from './store/app';
import { startFirstBeam } from './utils/startFirstBeam';

import { VOnboardingWrapper, VOnboardingStep, useVOnboarding } from 'v-onboarding';
import 'v-onboarding/dist/style.css';

import { useI18n } from 'vue-i18n';
import { eventBus, EventType } from './EventBus';
const { t } = useI18n();

const viewerStore = useViewerStore();

const file = ref(null);

const onboardingWrapper = ref(null);
provide('onboardingWrapper', onboardingWrapper);

const steps = computed(() => [
  {
    attachTo: { element: '#appMenu' },
    content: { title: t('tour.menu.title'), description: t('tour.menu.description') },
  },
  {
    attachTo: { element: '#undoRedo' },
    content: { title: t('tour.undoRedo.title'), description: t('tour.undoRedo.description') },
  },
  {
    attachTo: { element: '#viewerControls' },
    content: {
      title: t('tour.viewerControls.title'),
      description: t('tour.viewerControls.description'),
    },
  },
  {
    attachTo: { element: '#viewerSettings' },
    content: {
      title: t('tour.viewerSettings.title'),
      description: t('tour.viewerSettings.description'),
    },
  },
  {
    attachTo: { element: '#gridAndUnits' },
    content: { title: t('tour.gridUnits.title'), description: t('tour.gridUnits.description') },
  },
  {
    attachTo: { element: '#bottomBar' },
    content: {
      title: t('tour.bottomBar.title'),
      description: t('tour.bottomBar.description'),
    },
  },
  {
    attachTo: { element: '#bottomBarHelp' },
    content: { title: t('tour.help.title'), description: t('tour.help.description') },
  },
]);

/**
 * Also offered in the menu, for anyone who skipped it. The display options are one of its stops.
 *
 * Every step but the first is about the drawing, and the tour can be started from any tab - the
 * menu is always there. Started from Settings, say, a step about the drawing would have nothing to
 * attach to: the pane it is about is hidden, so everything in it measures zero. Switching to it
 * once, before the first step, is simpler than asking each step that needs it to switch for itself.
 */
const startTour = async () => {
  const drawing = appStore.tabs.findIndex((tab) => tab.props.id === 'viewer');

  if (drawing >= 0) appStore.tab = drawing;

  viewerStore.settingsOpen = true;
  await nextTick();
  useVOnboarding(onboardingWrapper).start();
};

// The step slot's own `exit` only emits an event; this is what takes the tour down.
const endTour = () => useVOnboarding(onboardingWrapper).finish();

onMounted(() => {
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && (e.key === '+' || e.key === '=' || e.key === '-')) {
      e.preventDefault();
    }

    // If CTRL+Z undo
    if (e.ctrlKey && !e.shiftKey && e.code === 'KeyZ') {
      e.preventDefault();
      undoModelChange();
    }

    // If CTRL+SHIFT+Z redo
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
      e.preventDefault();
      redoModelChange();
    }

    // Print: the browser's print of the page is meaningless here; the image export is
    // what "print" means in this app.
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyP') {
      e.preventDefault();
      openExportImage();
    }

    // Save project
    if (e.ctrlKey && e.code === 'KeyS') {
      e.preventDefault();
      saveProject();
    }

    // Open project
    if (e.ctrlKey && e.code === 'KeyO') {
      e.preventDefault();
      file.value.click();
    }

    // Leave the tour. Harmless when none is running - finish() just sets the state it is
    // already in.
    if (e.key === 'Escape') {
      endTour();
    }
  });

  document.addEventListener(
    'wheel',
    function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    { passive: false }
  );
});

const appStore = useAppStore();

onMounted(() => {
  const solver = useProjectStore().solver;
  const domain = solver.domain;

  const params = new URL(document.location as unknown as URL).searchParams;
  const name = params.get('model');
  const lang = params.get('lang');
  const inViewerMode = params.get('viewer');
  // Documented entry point: run.edubeam.app/?panel=examples opens the gallery straight away.
  const panel = params.get('panel');

  // Someone who has not been through the welcome dialog yet is new here: this version is what
  // they start with, not news, so the changelog waits for the next release.
  if (!appStore.onboardingFinished && currentAppVersion) appStore.lastSeenChangelogVersion = currentAppVersion;

  if (inViewerMode) {
    appStore.inViewerMode = true;
  } else if (panel === 'examples') {
    openExamples();
  } else {
    if (!appStore.onboardingFinished) openModal(Welcome);
    else maybeShowChangelog();
  }

  if (name) {
    // Validate the shared model before touching the current one, so a broken link
    // cannot wipe the project persisted in localStorage.
    if (parseSerializedModel(name) !== null) {
      const saved = replaceModel('link', () => {
        resetModel();
        deserializeModel(name, solver, useProjectStore().dimensions);
      });
      // Opening a link used to overwrite whatever was here without a word.
      if (saved && !appStore.inViewerMode) previousModelSaved.value = true;
    } else {
      console.warn('Ignoring invalid ?model= parameter');
    }
    solve();

    const url = document.location.href;
    window.history.pushState({}, '', url.split('?')[0]);

    return;
  }

  if (lang && availableLocales.findIndex((l) => l.code === lang) >= 0) {
    appStore.locale = lang;
  }

  if (lang || panel) {
    const url = document.location.href;
    window.history.pushState({}, '', url.split('?')[0]);
  }

  if (domain.nodes.size > 0) return solve();

  // The frame in round numbers of the units in use: 3 m, or 10 ft
  buildStarterModel(solver, useProjectStore().dimensions, appStore.unitSystem === 'us' ? 'us' : 'si');

  requestAnimationFrame(solve);
});

const solve = () => {
  useProjectStore().solve();
  nextTick(() => {
    eventBus.emit(EventType.FIT_CONTENT);
  });
};

const clearMesh = (clearMaterials = false, clearCrossSects = false) => {
  // Undoable, and the cleared model is kept in the recent structures.
  replaceModel('clear', () => resetModel({ materials: clearMaterials, crossSections: clearCrossSects }));
  useProjectStore().clearSelection();
  // Otherwise the diagnostics of the model just cleared stay on screen.
  solve();
};

/** Loads a project file over the current model; alerts and keeps the model if it is not one. */
const loadProjectFile = (text: string) => {
  try {
    const json = JSON.parse(text);
    if (typeof json !== 'object' || json === null || typeof json.domain !== 'object') throw new Error('Not a project');
    replaceModel('file', () => {
      resetModel();
      importJSON(json);
    });
    useProjectStore().clearSelection();
    solve();
  } catch (e) {
    alert(t('warnings.importFailed'));
  }
};

const shareMesh = () => {
  openModal(Share);
};

const openExamples = () => {
  openModal(Examples);
};

const openRecentStructures = () => {
  previousModelSaved.value = false;
  openModal(RecentStructures);
};

/** Set when a shared link replaced a model worth keeping, so the user learns where it went. */
const previousModelSaved = ref(false);

const openExportImage = () => {
  openModal(ExportImage);
};

const openChangelog = () => {
  openModal(Changelog);
};
const currentAppVersion = APP_VERSION;

const maybeShowChangelog = () => {
  if (appStore.inViewerMode) return;
  if (!currentAppVersion) return;
  if (appStore.lastSeenChangelogVersion === currentAppVersion) return;
  openModal(Changelog);
};

onMounted(() => {
  setLocale(appStore.locale);
});

function preventDefaults(e) {
  e.preventDefault();
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop'];

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

function onDrop(e) {
  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    const file = e.dataTransfer.files[i];
    const reader = new FileReader();
    reader.onload = function (e) {
      loadProjectFile(e.target.result.toString());
    };
    reader.readAsText(file);
  }
}

function openFile(e) {
  // check if no file uploaded
  if (!e.target.files.length) return;

  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    loadProjectFile(e.target.result.toString());

    appStore.tab = 0;
    appStore.drawerOpen = false;
  };
  reader.readAsText(file);
}

const saveProject = () => {
  download('project.json', JSON.stringify(exportJSON()));
};

const app_version = currentAppVersion;
const app_released = APP_RELEASED;
const app_commit = APP_COMMIT;
</script>

<template>
  <v-app @drop.prevent="onDrop">
    <VOnboardingWrapper
      ref="onboardingWrapper"
      :steps="steps"
      :options="{
        popper: {
          /*
           * Laid out against the window, not the document. Absolutely positioned, a bubble that
           * lands low can make the page taller than the window, and the page then scrolls to show
           * it - the app slides up and a strip of blank appears under it.
           */
          strategy: 'fixed',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ],
        },
        scrollToStep: {
          enabled: false,
        },
      }"
    >
      <template #default="{ previous, next, step, isFirst, isLast, index }">
        <VOnboardingStep>
          <v-card v-if="step.content" max-width="400" elevation="6" class="pa-4">
            <div class="d-flex align-start">
              <h3 class="text-h6 flex-grow-1">{{ step.content.title }}</h3>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                density="comfortable"
                class="mt-n1 mr-n2"
                :aria-label="$t('tour.close')"
                @click="endTour"
              />
            </div>
            <p class="mt-2 text-body-2">{{ step.content.description }}</p>
            <div class="d-flex align-center ga-2 mt-4">
              <span class="text-caption text-medium-emphasis">{{ index + 1 }} / {{ steps.length }}</span>
              <v-spacer />
              <v-btn v-if="!isFirst" flat color="grey-lighten-3" @click="previous">
                {{ $t('tour.previousButton') }}
              </v-btn>
              <v-btn color="primary" flat @click="next">
                {{ isLast ? $t('tour.finishButton') : $t('tour.nextButton') }}
              </v-btn>
            </div>
          </v-card>
        </VOnboardingStep>
      </template>
    </VOnboardingWrapper>

    <v-app-bar v-if="!appStore.inViewerMode" clipped-lefs clipped-right app color="primary" density="compact">
      <v-app-bar-nav-icon id="appMenu" @click="appStore.drawerOpen = !appStore.drawerOpen"></v-app-bar-nav-icon>

      <div class="app-title ml-3 d-flex align-center" style="user-select: none">edubeam</div>

      <v-btn
        class="d-none d-sm-inline-flex ml-3"
        @click="
          openModal(Confirmation, {
            title: t('confirmation.clearMesh.title'),
            message: t('confirmation.clearMesh.message'),
            success: (params) => clearMesh(params.checkboxes[0].value, params.checkboxes[1].value),
            checkboxes: [
              { label: t('confirmation.clearMesh.materials'), value: false },
              { label: t('confirmation.clearMesh.crossSections'), value: false },
            ],
          })
        "
      >
        <v-icon>mdi-delete-empty</v-icon>
        <span>{{ $t('common.clearMesh') }}</span>
      </v-btn>

      <v-btn class="d-none d-sm-inline-flex" @click="shareMesh">
        <v-icon>mdi-share</v-icon> {{ $t('common.shareModel') }}
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn class="d-none d-sm-inline-flex" @click="openChangelog">
        <v-icon class="mr-1">mdi-history</v-icon>
        <span>{{ $t('common.whatisnew') }}</span>
      </v-btn>

      <v-btn class="d-inline-flex" href="https://edubeam.app" target="_blank">
        {{ $t('common.documentation') }}
        <v-icon class="ml-1">mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn class="d-none d-sm-inline-flex" icon href="https://github.com/janvorisek/edubeam" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="appStore.drawerOpen" temporary>
      <!-- <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/9.jpg" title="Jane Doe"></v-list-item> -->

      <v-divider></v-divider>

      <!-- Every item opens something else or acts on the model, so the menu gets out of the way -->
      <v-list density="compact" nav @click="appStore.drawerOpen = false">
        <v-list-item
          prepend-icon="mdi-folder-open-outline"
          :title="$t('common.openProject')"
          value="home"
          @click="$refs.file.click()"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-folder-arrow-down-outline"
          :title="$t('common.saveProject')"
          value="about"
          @click="saveProject"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-backup-restore"
          :title="$t('recentStructures.title')"
          value="recentStructures"
          @click="openRecentStructures"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-image-outline"
          :title="$t('exportImage.title')"
          value="exportImage"
          @click="openExportImage"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-share"
          :title="$t('common.shareModel')"
          value="share"
          @click="shareMesh"
        ></v-list-item>
        <v-divider class="my-1"></v-divider>
        <v-list-item
          prepend-icon="mdi-bookshelf"
          :title="$t('examples.title')"
          value="examples"
          @click="openExamples"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-vector-polyline-plus"
          :title="$t('welcome.drawFirstBeam')"
          value="firstBeam"
          @click="startFirstBeam"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-map-marker-path"
          :title="$t('welcome.showAround')"
          value="tour"
          @click="startTour"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-delete-empty"
          :title="$t('common.clearMesh')"
          value="clear"
          @click="
            openModal(Confirmation, {
              title: t('confirmation.clearMesh.title'),
              message: t('confirmation.clearMesh.message'),
              success: (params) => clearMesh(params.checkboxes[0].value, params.checkboxes[1].value),
              checkboxes: [
                { label: t('confirmation.clearMesh.materials'), value: false },
                { label: t('confirmation.clearMesh.crossSections'), value: false },
              ],
            })
          "
        ></v-list-item>
      </v-list>
      <v-divider />
      <div class="pa-3 text-grey-darken-2" style="font-size: 12px">
        v{{ app_version }}<br />{{ new Date(app_released).toLocaleDateString(appStore.locale) }}
        {{ new Date(app_released).toLocaleTimeString(appStore.locale) }}<br />
        <span style="font-size: 10px">{{ app_commit }}</span>
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="appStore.rightDrawerOpen" location="right" temporary :scrim="false">
      -
    </v-navigation-drawer>

    <v-main>
      <Editor />
    </v-main>

    <Dialogs />

    <widget-container-modal />

    <!-- <div
      class="d-none d-sm-flex align-center justify-space-between px-3 text-caption bg-secondary border-t"
      style="height: 24px"
    >
      <div>
        <a
          class="text-black text-decoration-none font-weight-medium"
          href="https://github.com/janvorisek/edubeam/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=%5BBUG%5D"
          target="_blank"
          >{{ $t("footer.reportIssue") }}</a
        >
        <a
          class="text-black text-decoration-none font-weight-medium ml-3"
          href="https://github.com/janvorisek/edubeam/issues/new?assignees=&labels=&projects=&template=feature_request.md&title="
          target="_blank"
          >{{ $t("footer.requestFeature") }}</a
        >
      </div>
      <div>edubeam v{{ app_version }} {{ $t("footer.released") }} {{ app_released }}</div>
    </div> -->
    <ReloadPrompt />
    <v-snackbar v-model="previousModelSaved" :timeout="10000" location="bottom">
      {{ $t('recentStructures.linkNotice') }}
      <template #actions>
        <v-btn variant="text" color="primary" @click="openRecentStructures">
          {{ $t('recentStructures.show') }}
        </v-btn>
      </template>
    </v-snackbar>
    <input ref="file" type="file" style="display: none" @change="openFile" />
  </v-app>
</template>

<style lang="scss">
.line-height-1 {
  line-height: 1 !important;
}

.svgViewer {
  position: absolute;
  width: 100%;
}

svg {
  display: block;
}

svg text {
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.mouse {
  font-size: 12px;
}

.selecting {
  position: absolute;
  border: 1px solid #2f00ff;
  background: rgba(0, 0, 255, 0.2);
}

.tooltip {
  font-size: 14px;
  position: absolute;
  margin-top: -6px;
  margin-left: 18px;
}

.tooltip .content {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  z-index: 100;
  padding: 3px 8px;
  //font-weight: bold;
  box-shadow: 1px 1px 1px #ddd;
}

.tooltip .content:after {
  content: '';
  position: absolute;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  left: -6px;
  top: 8px;
  border-right: 6px solid rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

.inline-checkbox {
  .v-input--selection-controls__input {
    margin-right: 0px !important;
  }
}
</style>
