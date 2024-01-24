<script lang="ts">
import { container, openModal } from "jenesius-vue-modal";
import { serializeModel, deserializeModel } from "./utils";
import { watch } from "vue";
import { useMagicKeys } from "@vueuse/core";

export default {
  components: { WidgetContainerModal: container },
  name: "App",
};
</script>

<script setup lang="ts">
import { onMounted } from "vue";
import { Beam2D, DofID, Domain } from "ts-fem";
import { max, min } from "mathjs";
import { setLocale, async, availableLocales } from "./plugins/i18n";

import Share from "@/components/dialogs/Share.vue";
import Editor from "@/views/Editor.vue";
import Dialogs from "@/components/Dialogs.vue";
import { useProjectStore } from "./store/project";
import { loadLocaleMessages, i18n } from "./plugins/i18n";
import { useAppStore } from "./store/app";

const appStore = useAppStore();
const projectStore = useProjectStore();

const { escape } = useMagicKeys();

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
    <v-app-bar clipped-lefs clipped-right app color="primary" density="compact">
      <!-- <v-app-bar-nav-icon @click="appStore.drawerOpen = !appStore.drawerOpen"></v-app-bar-nav-icon> -->

      <div class="app-title ml-3 d-flex align-center font-weight-bold" style="user-select: none">
        edubeam
        <v-tooltip activator="parent" location="bottom">
          v{{ app_version }} {{ $t("footer.released") }} {{ app_released }}
        </v-tooltip>
      </div>

      <v-btn class="d-none d-sm-inline-flex ml-3" @click="clearMesh">
        <v-icon small>mdi-delete-empty</v-icon>
        <span class="ml-1">{{ $t("common.clearMesh") }}</span>
      </v-btn>

      <v-btn class="d-none d-sm-inline-flex" @click="shareMesh">
        <v-icon small>mdi-share</v-icon> {{ $t("common.shareModel") }}
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn class="d-none d-sm-inline-flex" href="https://edubeam.app" target="_blank">
        {{ $t("common.documentation") }}
        <v-icon class="ml-1">mdi-open-in-new</v-icon>
      </v-btn>

      <v-btn class="d-none d-sm-inline-flex" icon href="https://github.com/janvorisek/edubeam" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
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
