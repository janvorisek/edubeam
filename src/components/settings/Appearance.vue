<template>
  <div style="display: grid; gap: 16px 16px; grid-template-columns: clamp(200px, 365px, 50%) clamp(200px, 365px, 50%)">
    <div>
      <h3 class="mb-2">{{ $t('settings.viewer_preview') }}</h3>

      <div style="height: 256px">
        <SVGElementViewer
          v-if="_created"
          id="settings-appearance"
          class="overflow-hidden pa-1"
          :solver="solver"
          :nodes="[domain.getNode('a'), domain.getNode('b'), domain.getNode('c'), domain.getNode('d')]"
          :elements="[domain.getElement(1), domain.getElement(2), domain.getElement(3)]"
          :element-loads="solver.loadCases[0].elementLoadList"
          :show-deformed-shape="showQuantity === 'deformedShape'"
          :show-reactions="showQuantity === 'reactions'"
          :show-loads="true"
          :show-moments="showQuantity === 'bendingMoment'"
          :show-normal-force="showQuantity === 'normalForce'"
          :show-shear-force="showQuantity === 'shearForce'"
          :padding="48"
          :mobile-padding="48"
          :results-scale-px="viewerStore.resultsScalePx_"
          :colors="viewerStore.colors"
          :support-size="viewerStore.supportSize"
          :font-size="viewerStore.fontSize"
        />
      </div>

      <h3 class="mb-2">{{ $t('settings.grid') }}</h3>

      <v-row>
        <v-col>
          <v-checkbox
            v-model="viewerStore.showGrid"
            class="mt-0"
            :label="$t('settings.show_grid')"
            hide-details="auto"
            density="compact"
          />
        </v-col>
        <v-col>
          <v-checkbox
            v-model="viewerStore.snapToGrid"
            class="mt-0"
            :label="$t('settings.snap_to_grid')"
            hide-details="auto"
            density="compact"
          />
        </v-col>
      </v-row>

      <v-text-field
        v-model.number="viewerStore.gridStep"
        :label="$t('settings.grid_snap_step')"
        hide-details="auto"
        type="number"
        step="0.001"
        suffix="m"
      />
    </div>
    <div>
      <h3 class="mb-2">{{ $t('settings.sizes.sizes') }}</h3>

      <v-row>
        <v-col>
          <h4 class="mb-1">{{ $t('settings.results_scale') }}</h4>
          <v-slider v-model="viewerStore.resultsScalePx_" step="1" max="120" thumb-label></v-slider>
        </v-col>
        <v-col>
          <h4 class="mb-1">{{ $t('settings.sizes.supportSize') }}</h4>
          <v-slider v-model="viewerStore.supportSize" step="0.1" max="1.5" min="0.5" thumb-label></v-slider>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <h4 class="mb-1">{{ $t('settings.font_size') }}</h4>
          <v-slider v-model="viewerStore.fontSize" step="1" min="10" max="20" thumb-label></v-slider>
        </v-col>
      </v-row>

      <h3 class="mb-2">{{ $t('settings.colors.colors') }}</h3>

      <div style="display: grid; grid-template-columns: 1fr 1fr">
        <v-menu :close-on-content-click="false" offset-y location="left">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.nodes"
              hide-details="auto"
              :label="$t('common.nodes')"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.nodes};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker v-model="viewerStore.colors.nodes" mode="hex" hide-inputs class="mx-auto"></v-color-picker>
        </v-menu>

        <v-menu :close-on-content-click="false" offset-y location="right">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.elements"
              hide-details="auto"
              :label="$t('common.elements')"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.elements};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker v-model="viewerStore.colors.elements" mode="hex" hide-inputs class="mx-auto"></v-color-picker>
        </v-menu>

        <v-menu :close-on-content-click="false" offset-y location="left">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.loads"
              hide-details="auto"
              :label="$t('common.loads')"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.loads};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker v-model="viewerStore.colors.loads" mode="hex" hide-inputs class="mx-auto"></v-color-picker>
        </v-menu>

        <v-menu :close-on-content-click="false" offset-y location="right">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.deformedShape"
              hide-details="auto"
              :label="$t('common.deformedShape')"
              @focus="showQuantity = 'deformedShape'"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.deformedShape};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker
            v-model="viewerStore.colors.deformedShape"
            mode="hex"
            hide-inputs
            class="mx-auto"
          ></v-color-picker>
        </v-menu>

        <v-menu :close-on-content-click="false" offset-y location="left">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.normalForce"
              hide-details="auto"
              :label="$t('common.normalForce')"
              @focus="showQuantity = 'normalForce'"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.normalForce};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker
            v-model="viewerStore.colors.normalForce"
            mode="hex"
            hide-inputs
            class="mx-auto"
          ></v-color-picker>
        </v-menu>

        <v-menu :close-on-content-click="false" offset-y location="right">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.shearForce"
              hide-details="auto"
              :label="$t('common.shearForce')"
              @focus="showQuantity = 'shearForce'"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.shearForce};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker
            v-model="viewerStore.colors.shearForce"
            mode="hex"
            hide-inputs
            class="mx-auto"
          ></v-color-picker>
        </v-menu>

        <v-menu :close-on-content-click="false" offset-y location="left">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.bendingMoment"
              hide-details="auto"
              :label="$t('common.bendingMoment')"
              @focus="showQuantity = 'bendingMoment'"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.bendingMoment};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker
            v-model="viewerStore.colors.bendingMoment"
            mode="hex"
            hide-inputs
            class="mx-auto"
          ></v-color-picker>
        </v-menu>

        <v-menu :close-on-content-click="false" offset-y location="right">
          <template #activator="{ props }">
            <v-text-field
              v-bind="props"
              v-model="viewerStore.colors.reactions"
              hide-details="auto"
              :label="$t('common.reactions')"
              @focus="showQuantity = 'reactions'"
            >
              <template #prepend-inner>
                <div
                  :style="`width: 24px; height: 24px; border-radius: 100%; background: ${viewerStore.colors.reactions};`"
                ></div>
              </template>
            </v-text-field>
          </template>
          <v-color-picker
            v-model="viewerStore.colors.reactions"
            mode="hex"
            hide-inputs
            class="mx-auto"
          ></v-color-picker>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import SVGElementViewer from '../SVGElementViewer.vue';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { ref, onMounted } from 'vue';

const viewerStore = useViewerStore();
const projectStore = useProjectStore();
const showQuantity = ref('deformedShape');

const solver = ref(new LinearStaticSolver());
const domain = solver.value.domain;

domain.createNode('a', [0, 0, 0], [DofID.Dx, DofID.Ry, DofID.Dz]);
domain.createNode('b', [0, 0, -3], []);
domain.createNode('c', [3, 0, -3], []);
domain.createNode('d', [3, 0, 0], [DofID.Dx, DofID.Dz]);

domain.createBeam2D(1, ['a', 'b'], 1, 1, [false, true]);
domain.createBeam2D(2, ['b', 'c'], 1, 1);
domain.createBeam2D(3, ['d', 'c'], 1, 1);

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

const _created = ref(false);
onMounted(() => {
  solver.value.solve();
  _created.value = true;
});

//solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 10000, [DofID.Dz]: 0, [DofID.Ry]: 10000 });
//solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 0, [DofID.Dz]: 20 });

solver.value.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10000], true);
solver.value.solve();
</script>
