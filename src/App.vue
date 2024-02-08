<script lang="ts">
import { container, openModal } from "jenesius-vue-modal";
import { deserializeModel } from "./utils";
import { provide } from "vue";

export default {
  components: { WidgetContainerModal: container },
  name: "App",
};
</script>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { DofID } from "ts-fem";
import { setLocale, availableLocales } from "./plugins/i18n";

import Welcome from "@/components/dialogs/Welcome.vue";
import Share from "@/components/dialogs/Share.vue";
import Editor from "@/views/Editor.vue";
import Dialogs from "@/components/Dialogs.vue";
import { useProjectStore } from "./store/project";
import { useAppStore } from "./store/app";

import { VOnboardingWrapper, VOnboardingStep } from "v-onboarding";
import "v-onboarding/dist/style.css";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const onboardingWrapper = ref(null);
provide("onboardingWrapper", onboardingWrapper);

const steps = computed(() => [
  {
    attachTo: { element: "#viewerControls" },
    content: {
      title: t("tour.viewerControls.title"),
      description: t("tour.viewerControls.description"),
    },
  },
  {
    attachTo: { element: "#viewerSettings" },
    content: {
      title: t("tour.viewerSettings.title"),
      description: t("tour.viewerSettings.description"),
    },
  },
  {
    attachTo: { element: "#bottomBar" },
    content: {
      title: t("tour.bottomBar.title"),
      description: t("tour.bottomBar.description"),
    },
  },
]);

onMounted(() => {
  if (!appStore.onboardingFinished) openModal(Welcome);

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && (e.key === "+" || e.key === "=" || e.key === "-")) {
      e.preventDefault();
    }
  });

  document.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    { passive: false }
  );
});

const appStore = useAppStore();

const menu = ref([
  {
    title: "common.clearMesh",
    action: () => {
      clearMesh();
    },
  },
  {
    title: "common.shareModel",
    action: () => {
      shareMesh();
    },
  },
]);

onMounted(() => {
  const solver = useProjectStore().solver;
  const domain = solver.domain;

  const params = new URL(document.location as unknown as URL).searchParams;
  const name = params.get("model");
  const lang = params.get("lang");

  if (name) {
    deserializeModel(name, solver);
    _solve();

    const url = document.location.href;
    window.history.pushState({}, "", url.split("?")[0]);

    return;
  }

  if (lang && availableLocales.findIndex((l) => l.code === lang) >= 0) {
    appStore.locale = lang;
    const url = document.location.href;
    window.history.pushState({}, "", url.split("?")[0]);
  }

  if (domain.nodes.size > 0) return;

  //@ts-expect-error ts-fem is wrongly typed
  domain.createNode("a", [0, 0, 0], [DofID.Dx, DofID.Ry, DofID.Dz]);
  domain.createNode(2, [0, 0, -3], []);
  domain.createNode(3, [3, 0, -3], []);
  domain.createNode(4, [3, 0, 0], [DofID.Dx, DofID.Dz]);

  domain.nodes = new Map(domain.nodes);

  //@ts-expect-error ts-fem is wrongly typed
  domain.createBeam2D(1, ["a", 2], 1, 1, [false, true]);
  domain.createBeam2D(2, [2, 3], 1, 1);
  domain.createBeam2D(3, [4, 3], 1, 1);

  domain.elements = new Map(domain.elements);

  domain.createCrossSection(1, {
    a: 1,
    iy: 8.356e-5,
    iz: 1.0,
    dyz: 999991.0,
    h: 1,
    k: 1e32,
    j: 99999.0,
  });

  domain.createMaterial(1, {
    e: 210000e6,
    g: 210000e6 / (2 * (1 + 0.2)),
    alpha: 1.0,
    d: 4000 /*kg/m3!!!*/,
  });

  //solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 10000, [DofID.Dz]: 0, [DofID.Ry]: 10000 });
  //solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 0, [DofID.Dz]: 20 });

  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10000], true);
  //solver.loadCases[0].createPrescribedDisplacement("a", { [DofID.Dx]: 0.3, [DofID.Dz]: 0.2, [DofID.Ry]: 0.01 });

  domain.materials = new Map(domain.materials);
  domain.crossSections = new Map(domain.crossSections);

  solver.domain = domain;

  solve();
});

const solve = () => {
  try {
    _solve();
  } catch (e) {
    console.log(e);
  }
};

const _solve = () => {
  useProjectStore().solve();
};

const clearMesh = () => {
  useProjectStore().solver.loadCases[0].solved = false;
  useProjectStore().solver.loadCases[0].nodalLoadList = [];
  useProjectStore().solver.loadCases[0].elementLoadList = [];
  useProjectStore().solver.domain.elements.clear();
  useProjectStore().solver.domain.nodes.clear();
};

const shareMesh = () => {
  openModal(Share);
};

onMounted(() => {
  console.log(appStore.locale);
  setLocale(appStore.locale);
});

// eslint-disable-next-line no-undef
const app_version = APP_VERSION;

// eslint-disable-next-line no-undef
const app_released = APP_RELEASED;
</script>

<template>
  <v-app>
    <VOnboardingWrapper
      ref="onboardingWrapper"
      :steps="steps"
      :options="{
        popper: {
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
      <template #default="{ previous, next, step, exit, isFirst, isLast, index }">
        <VOnboardingStep>
          <div class="bg-white shadow rounded-lg" style="max-width: 400px">
            <div class="px-4 py-5 sm:p-6">
              <div class="sm:flex sm:items-center sm:justify-between">
                <div v-if="step.content">
                  <h3 v-if="step.content.title" class="text-lg font-medium leading-6 text-gray-900">
                    {{ step.content.title }}
                  </h3>
                  <div v-if="step.content.description" class="mt-2 max-w-xl text-sm text-gray-500">
                    <p>{{ step.content.description }}</p>
                  </div>
                </div>
                <div class="mt-5 space-x-4 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center relative">
                  <template v-if="!isFirst">
                    <v-btn @click="previous" type="button" flat color="grey-lighten-3">
                      {{ $t("tour.previousButton") }}
                    </v-btn>
                  </template>
                  <v-btn @click="next" type="button" color="primary" flat class="ml-1">
                    {{ isLast ? $t("tour.finishButton") : $t("tour.nextButton") }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </VOnboardingStep>
      </template>
    </VOnboardingWrapper>

    <v-app-bar clipped-lefs clipped-right app color="primary" density="compact">
      <!-- <v-app-bar-nav-icon @click="appStore.drawerOpen = !appStore.drawerOpen"></v-app-bar-nav-icon> -->

      <div class="app-title ml-3 d-flex align-center font-weight-bold" style="user-select: none">
        edubeam
        <v-tooltip activator="parent" location="bottom">
          v{{ app_version }} {{ $t("footer.released") }} {{ app_released }}
        </v-tooltip>
      </div>

      <v-btn class="d-none d-sm-inline-flex ml-3" @click="clearMesh">
        <v-icon>mdi-delete-empty</v-icon>
        <span>{{ $t("common.clearMesh") }}</span>
      </v-btn>

      <v-btn class="d-none d-sm-inline-flex" @click="shareMesh">
        <v-icon>mdi-share</v-icon> {{ $t("common.shareModel") }}
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn class="d-inline-flex" href="https://edubeam.app" target="_blank">
        {{ $t("common.documentation") }}
        <v-icon class="ml-1">mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn class="d-none d-sm-inline-flex" icon href="https://github.com/janvorisek/edubeam" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>

      <template #append>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
          <v-menu activator="parent">
            <v-list>
              <v-list-item v-for="(item, index) in menu" :key="index" :value="index" @click="item.action">
                <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="appStore.drawerOpen" temporary>
      <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/9.jpg" title="Jane Doe"></v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
      </v-list>
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
  </v-app>
</template>
