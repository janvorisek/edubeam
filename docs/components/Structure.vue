<script lang="ts" setup>
import { LinearStaticSolver, DofID, Node, Beam2D } from "ts-fem";
import { ref, onMounted, reactive, nextTick } from "vue";
import SVGElementViewer from "../../src/components/SVGElementViewer.vue";
import { VTweakpane } from "v-tweakpane";
import { serializeModel, deserializeModel } from "../../src/utils/serializeModel";

const viewer = ref(null);

const props = withDefaults(
  defineProps<{
    nodes: {
      label: string;
      coords: number[];
      dofs: number[];
    }[];
    elements: {
      label: string;
      nodes: string[];
    }[];
    nodalLoads: {
      target: string;
      values: unknown;
    }[];
    showLoads?: boolean;
    showNormalForce?: boolean;
    showShearForce?: boolean;
    showMoment?: boolean;
    showDeformedShape?: boolean;
    showReactions?: boolean;
  }>(),
  {
    solver: new LinearStaticSolver(),
    nodes: () => [],
    elements: () => [],
    nodalLoads: () => [],
    showLoads: false,
    showNormalForce: false,
    showShearForce: false,
    showMoment: false,
    showDeformedShape: false,
    showReactions: false,
  }
);

const colors = {
  normalForce: "#2222ff",
  shearForce: "#00af00",
  bendingMoment: "#ff2222",
  deformedShape: "#555555",
  loads: "#ff8700",
  nodes: "#000000",
  elements: "#000000",
  reactions: "#a020f0",
};

const solver = ref(new LinearStaticSolver());
const domain = solver.value.domain;

{
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

const _created = ref(false);
onMounted(() => {
  for (const node of props.nodes) {
    domain.createNode(node.label, node.coords, node.dofs);
  }

  for (const element of props.elements) {
    domain.createBeam2D(element.label, element.nodes, 1, 1);
  }

  for (const load of props.nodalLoads) {
    solver.value.loadCases[0].createNodalLoad(load.target, load.values);
  }

  solver.value.solve();

  nextTick(() => {
    //viewer.value.fitContent();
  });

  _created.value = true;
});
</script>

<template>
  <div>
    <div class="d-flex" style="width: 100%; min-height: 160px">
      <SVGElementViewer
        ref="viewer"
        v-if="_created"
        class="overflow-hidden pa-1 w-100"
        :solver="solver"
        :nodes="[...solver.domain.nodes.values()]"
        :elements="[...solver.domain.elements.values()]"
        :nodal-loads="solver.loadCases[0].nodalLoadList"
        :element-loads="solver.loadCases[0].elementLoadList"
        :show-node-labels="true"
        :show-element-labels="true"
        :show-deformed-shape="showDeformedShape"
        :show-reactions="showReactions"
        :show-loads="showLoads"
        :show-moments="showMoment"
        :show-normal-force="showNormalForce"
        :show-shear-force="showShearForce"
        :padding="16"
        :mobile-padding="8"
        :results-scale-px="24"
      />
    </div>
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

.element-load.load-1d {
  text {
    fill: v-bind("colors.loads");
  }
  pointer-events: all;
  stroke-linecap: butt;
  &:hover text {
    //fill: blue;
  }
  &:hover path.drawable,
  &:hover polygon.drawable {
    //stroke: blue;
    stroke-width: 3px;
  }
  &:hover polyline {
    marker-end: url(#force_centered_hover);
  }
  polygon,
  path {
    stroke: v-bind("colors.loads");
    stroke-width: 1px;
    &.handle {
      stroke-width: 12px;
      stroke: transparent;
    }
  }
  polyline {
    marker-end: url(#force_centered);
  }

  &.selected {
    text {
      fill: rgb(0, 55, 149);
    }
    polygon {
      stroke-linejoin: round;
      fill: rgba(0, 55, 149, 0.1);
    }
  }
}

.element.element-1d {
  polyline {
    fill: none;
    stroke: black;
    stroke-width: 2px;
    &.handle {
      cursor: pointer;
      stroke-width: 24px;
      stroke: transparent;
    }
    &.decoration {
      stroke-width: 1px;
    }
  }
  &:hover {
    & polyline.drawable {
      stroke: black;
      stroke-width: 5px;
    }
  }
  &.selected {
    & polyline.drawable {
      stroke: rgb(0, 94, 255);
      stroke-width: 5px;
    }
  }

  polyline.fibers {
    stroke: #666;
    stroke-width: 1px;
  }
  polyline.deformedShape {
    stroke: #555;
    stroke-width: 2px;
    &.decoration {
      stroke-width: 1px;
    }
  }
  polyline.normal {
    stroke: v-bind("colors.normalForce");
    stroke-width: 1px;
    fill: v-bind("colors.normalForce");
    fill-opacity: 0.1;
    &:hover {
      fill-opacity: 0.2;
    }
  }
  polyline.shear {
    stroke: v-bind("colors.shearForce");
    stroke-width: 1px;
    fill: v-bind("colors.shearForce");
    fill-opacity: 0.1;
    &:hover {
      fill-opacity: 0.2;
    }
  }
  polyline.moment {
    stroke: v-bind("colors.bendingMoment");
    stroke-width: 1px;
    fill: v-bind("colors.bendingMoment");
    fill-opacity: 0.1;
    &:hover {
      fill-opacity: 0.2;
    }
  }
}

.node {
  polyline {
    stroke: #000;
    stroke-linecap: square;
    stroke-width: 6px;
    vector-effect: non-scaling-stroke;
    &.handle {
      cursor: pointer;
      stroke-width: 24px;
      stroke: transparent;
    }
    &.decoration {
      stroke-width: 1px;
    }
    &.drawable.deformed {
      stroke: #555;
    }
  }
  &:hover polyline.drawable {
    stroke: black;
    stroke-width: 10px;
  }
  &.selected polyline.drawable {
    stroke: rgb(0, 55, 149);
    stroke-width: 8px;
  }
}

.nodal-load {
  text {
    fill: v-bind("colors.loads");
  }
  polyline {
    stroke-linecap: square;
    vector-effect: non-scaling-stroke;
    &.decoration.force {
      marker-end: url(#force);
    }
    &.decoration.moment.cw {
      marker-end: url(#moment_cw);
    }
    &.decoration.moment.ccw {
      marker-end: url(#moment_ccw);
    }
    &.handle {
      stroke: transparent;
      stroke-width: 24px;
    }

    &.handle.moment {
      stroke: transparent;
      stroke-width: 38px;
    }
  }
  &:hover text {
    fill: blue;
  }
  &:hover polyline.decoration.force {
    marker-end: url(#force_hover);
  }
  &:hover polyline.decoration.moment.cw {
    marker-end: url(#moment_cw_hover);
  }
  &:hover polyline.decoration.moment.ccw {
    marker-end: url(#moment_ccw_hover);
  }
  &.selected {
    text {
      fill: rgb(0, 55, 149);
    }
  }
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
  content: "";
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
