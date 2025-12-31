<script lang="ts" setup>
import { LinearStaticSolver, DofID, Node, Beam2D } from 'ts-fem';
import { ref, onMounted, reactive } from 'vue';
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

const solver = ref(new LinearStaticSolver());
const domain = solver.value.domain;

{
  domain.createNode('a', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
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
}

const nodes = ref<Node[]>([domain.getNode('a'), domain.getNode('b')]);
const elements = ref<Beam2D[]>([]);
const showLoads = ref(false);
const showShearForces = ref(false);
const showMoments = ref(false);
const showDeformedShape = ref(false);
const resultsScalePx = ref(48);

const functionsArray: (() => void)[] = [
  () => {
    elements.value = [domain.getElement(1)];
  },
  () => {
    showLoads.value = false;
    showShearForces.value = false;
    showMoments.value = false;
    showDeformedShape.value = false;
  },
  () => {
    showLoads.value = true;
  },
  () => {
    resultsScalePx.value = 24;
    showDeformedShape.value = true;
  },
  () => {
    showLoads.value = false;
    showDeformedShape.value = false;
    resultsScalePx.value = 48;
    showShearForces.value = true;
  },
  () => {
    showMoments.value = true;
  },
];

// Initialize current function index
let currentFunctionIndex = 0;

// Function to cycle through functions
function cycleFunctions() {
  // Execute the current function
  functionsArray[currentFunctionIndex]();

  // Move to the next function index
  currentFunctionIndex++;

  // If reached the end of the array, start from the beginning
  if (currentFunctionIndex >= functionsArray.length) {
    currentFunctionIndex = 0;
  }
}

onMounted(() => {
  window.setInterval(() => {
    cycleFunctions();
  }, 1000);
});

const _created = ref(false);
onMounted(() => {
  solver.value.solve();
  _created.value = true;
});

//solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 10000, [DofID.Dz]: 0, [DofID.Ry]: 10000 });
//solver.loadCases[0].createNodalLoad(3, { [DofID.Dx]: 0, [DofID.Dz]: 20 });

solver.value.loadCases[0].createBeamElementUniformEdgeLoad('1', [0, 10], true);
solver.value.solve();
</script>

<template>
  <div>
    <ClientOnly>
      <div class="d-flex" style="width: 100%; min-height: 120px">
        <SVGElementViewer
          v-if="_created"
          class="overflow-hidden pa-1 w-100"
          :colors="colors"
          :solver="solver"
          :nodes="nodes"
          :elements="elements"
          :element-loads="solver.loadCases[0].elementLoadList"
          :show-node-labels="true"
          :show-element-labels="true"
          :show-deformed-shape="showDeformedShape"
          :show-reactions="false"
          :show-loads="showLoads"
          :show-moments="showMoments"
          :show-normal-force="false"
          :show-shear-force="showShearForces"
          :padding="32"
          :mobile-padding="32"
          :results-scale-px="resultsScalePx"
          :support-size="0.75"
        />
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
