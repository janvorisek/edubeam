<script setup lang="ts">
import { onMounted } from "vue";
import { Beam2D, DofID, Domain } from "ts-fem";
import { max, min } from "mathjs";

import Editor from "@/views/Editor.vue";
import Dialogs from "@/components/Dialogs.vue";
import { useProjectStore } from "./store/project";

onMounted(() => {
  const solver = useProjectStore().solver;
  const domain = solver.domain;

  if (domain.nodes.size > 0) return;

  //@ts-expect-error ts-fem is wrongly typed
  domain.createNode("a", [0, 0, 0], [DofID.Dx, DofID.Ry, DofID.Dz]);
  domain.createNode(2, [1, 0, 0], []);
  domain.createNode(3, [2, 0, 1], []);
  domain.createNode(4, [3, 0, 1], [DofID.Dz]);

  domain.nodes = new Map(domain.nodes);

  //@ts-expect-error ts-fem is wrongly typed
  domain.createBeam2D(1, ["a", 2], 1, 1, [false, true]);
  domain.createBeam2D(2, [2, 3], 1, 1);
  domain.createBeam2D(3, [3, 4], 1, 1);

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

  solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 10, [DofID.Dz]: 0, [DofID.Ry]: 10 });
  //solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 0, [DofID.Dz]: 20 });

  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10], false);

  domain.materials = new Map(domain.materials);
  domain.crossSections = new Map(domain.crossSections);

  solver.domain = domain;

  solve();
});

const solve = () => {
  _solve();
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

// eslint-disable-next-line no-undef
const app_version = APP_VERSION;

// eslint-disable-next-line no-undef
const app_released = APP_RELEASED;
</script>

<template>
  <v-app>
    <v-app-bar clipped-left clipped-right app color="primary" density="compact">
      <div class="ml-3 d-flex align-center font-weight-bold text-uppercase">Edubeam 2</div>

      <v-btn text class="d-none d-sm-inline-flex ml-3" @click="clearMesh">
        <v-icon small>mdi-delete-empty</v-icon>
        <span class="ml-1">Clear mesh</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn text class="d-none d-sm-inline-flex">
        <span class="mr-2">Settings</span>
        <v-icon>mdi-cogs</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Editor />
    </v-main>

    <Dialogs />

    <div
      class="d-none d-sm-flex align-center justify-space-between px-3 text-caption bg-secondary border-t"
      style="height: 24px"
    >
      <div>
        <a class="text-black text-decoration-none font-weight-medium" href="#">Report issue</a>
        <a class="text-black text-decoration-none font-weight-medium ml-3" href="#">Request feature</a>
      </div>
      <div>edubeam v{{ app_version }} released on {{ app_released }}</div>
    </div>
  </v-app>
</template>
