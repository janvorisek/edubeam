<script lang="ts" setup>
import { LinearStaticSolver, DofID } from 'ts-fem';
import { ref, onMounted, reactive, nextTick, computed } from 'vue';
import SVGElementViewer from '../../src/components/SVGElementViewer.vue';
import { VTweakpane } from 'v-tweakpane';
import { serializeModel, deserializeModel } from '../../src/utils/serializeModel';

const colors = {
  normalForce: '#2222ff',
  shearForce: '#00af00',
  bendingMoment: '#ff2222',
  deformedShape: '#555555',
  loads: '#ff8700',
  nodes: '#000000',
  elements: '#000000',
  reactions: '#a020f0',
};

const pane = ref({
  title: 'Simply supported beam',
});

const PARAMS = reactive({
  length: 3,
  loadMagnitude: 10,
});

const onPaneCreated = (pane: any) => {
  pane.addInput(PARAMS, 'length', { min: 1, max: 10, step: 0.1 }).on('change', (e: { value: number }) => {
    domain.getNode('b').coords[0] = e.value;
    solver.value.solve();
  });

  pane
    .addInput(PARAMS, 'loadMagnitude', { label: 'f', min: 1, max: 20, step: 1 })
    .on('change', (e: { value: number }) => {
      solver.value.loadCases[0].elementLoadList[0].values[1] = e.value;
      solver.value.solve();
    });

  const btn = pane.addButton({
    title: 'Open in edubeam',
  });

  btn.on('click', () => {
    window.location.href = 'https://run.edubeam.app?model=' + serializeModel(solver.value);
  });
};

const solver = ref(new LinearStaticSolver());
const domain = solver.value.domain;

domain.createNode('a', [0, 0, 0], [DofID.Dx, DofID.Dz]);
domain.createNode('b', [3, 0, 0], [DofID.Dz]);

domain.createBeam2D('1', ['a', 'b'], 1, 1);

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

solver.value.loadCases[0].createBeamElementUniformEdgeLoad('1', [0, 10000], true);
solver.value.solve();

const quantity = ref<'n' | 'v' | 'm' | 'u'>('m');

const changeQuantity = (q: 'n' | 'v' | 'm' | 'u') => {
  quantity.value = q;
};

const showDefo = computed(() => quantity.value === 'u');
const showNormalForce = computed(() => quantity.value === 'n');
const showShearForce = computed(() => quantity.value === 'v');
const showMoments = computed(() => quantity.value === 'm');

const viewer = ref<InstanceType<typeof SVGElementViewer>>();
</script>

<template>
  <div class="figure">
    <ClientOnly>
      <div class="d-flex" style="width: 100%; height: 160px">
        <SVGElementViewer
          v-if="_created"
          ref="viewer"
          class="overflow-hidden pa-1 w-100"
          :solver="solver"
          :nodes="[domain.getNode('a'), domain.getNode('b')]"
          :elements="[domain.getElement(1)]"
          :element-loads="solver.loadCases[0].elementLoadList"
          :show-node-labels="true"
          :show-element-labels="true"
          :show-deformed-shape="false"
          :show-reactions="false"
          :show-loads="true"
          :show-moments="false"
          :show-normal-force="false"
          :show-shear-force="false"
          :padding="16"
          :mobile-padding="16"
          :results-scale-px="32"
          :convert-force="(v) => v / 1000"
        />
        <div>
          <v-tweakpane class="p-4" style="width: 260px" :pane="pane" @on-pane-created="onPaneCreated" />
        </div>
      </div>
      <div class="d-flex" style="width: 100%">
        <div style="width: 100%">
          <div>
            <div class="if-selector">
              <button :class="{ selected: quantity === 'u' }" @click="changeQuantity('u')">Deformed shape</button>
              <button :class="{ selected: quantity === 'n' }" @click="changeQuantity('n')">Normal force</button>
              <button :class="{ selected: quantity === 'v' }" @click="changeQuantity('v')">Shear force</button>
              <button :class="{ selected: quantity === 'm' }" @click="changeQuantity('m')">Bending moment</button>
            </div>
          </div>
          <SVGElementViewer
            v-if="_created"
            class="overflow-hidden pa-1 w-100"
            style="height: 160px"
            :solver="solver"
            :nodes="[domain.getNode('a'), domain.getNode('b')]"
            :elements="[domain.getElement(1)]"
            :element-loads="solver.loadCases[0].elementLoadList"
            :show-deformed-shape="showDefo"
            :show-reactions="true"
            :show-loads="false"
            :show-moments="showMoments"
            :show-normal-force="showNormalForce"
            :show-shear-force="showShearForce"
            :padding="32"
            :mobile-padding="32"
            :results-scale-px="48"
            :convert-force="(v) => v / 1000"
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss">
.d-flex {
  display: flex;
}

.fill-height {
  height: 100%;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.w-100 {
  width: 100%;
}

.line-height-1 {
  line-height: 1 !important;
}

.svgViewer {
  position: absolute;
  width: 100%;
}

svg {
  display: block;
  *:hover {
    transition: all 0.2s ease-out;
  }
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
</style>
