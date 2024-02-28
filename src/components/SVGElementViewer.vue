<script setup lang="ts">
import SvgPanZoom from "./SVGPanZoom2.vue";
import SvgGrid from "./SVGGrid.vue";
import SvgViewerDefs from "./SVGViewerDefs.vue";
import { ref, onMounted, computed, watch } from "vue";

import {
  formatNode,
  formatElement,
  formatElementFibers,
  formatElementLoad,
  formatElementLoadHatch,
  formatNodalLoadAngle,
  formatElementLoadLabel,
  formatNodalLoad,
  formatElementLabel,
  formatElementAngle,
  formatElementHinge,
  formatSupportNode,
  supportMarker,
  formatResults,
  formatNormalForces,
  formatShearForces,
  formatMoments,
  formatMomentsLabels,
  formatNormalForceLabels,
  formatShearForceLabels,
  formatElementLoadForces,
  formatElementLoadForcesAngle,
  formatExpValueAsHTML,
} from "../SVGUtils";

import { throttle } from "../utils/throttle";
import { Node, DofID, Beam2D, Element, NodalLoad, BeamElementLoad, LinearStaticSolver } from "ts-fem";
import { Matrix, max, min } from "mathjs";

const props = withDefaults(
  defineProps<{
    solver: LinearStaticSolver;
    showGrid?: boolean;
    showElements?: boolean;
    showNodes?: boolean;
    showLoads?: boolean;
    showSupports?: boolean;
    showNodeLabels?: boolean;
    showElementLabels?: boolean;
    showDeformedShape?: boolean;
    showNormalForce?: boolean;
    showShearForce?: boolean;
    showMoments?: boolean;
    showReactions?: boolean;
    elements: Element[];
    nodes: Node[];
    nodalLoads?: NodalLoad[];
    elementLoads?: BeamElementLoad[];
    padding?: number;
    mobilePadding?: number;
    resultsScalePx: number;
    colors?: {
      normalForce: string;
      shearForce: string;
      bendingMoment: string;
      deformedShape: string;
      loads: string;
      nodes: string;
      elements: string;
      reactions: string;
    };
    supportSize?: number;
    convertForce?: (value: number) => number;
    zoomEnabled?: boolean;
  }>(),
  {
    showGrid: false,
    showElements: true,
    showNodes: true,
    showLoads: false,
    showSupports: true,
    showNodeLabels: false,
    showElementLabels: false,
    showDeformedShape: false,
    showNormalForce: false,
    showShearForce: false,
    showMoments: false,
    showReactions: false,
    elements: () => [],
    nodes: () => [],
    nodalLoads: () => [],
    elementLoads: () => [],
    padding: 12,
    mobilePadding: 12,
    colors: () => {
      return {
        normalForce: "#2222ff",
        shearForce: "#00af00",
        bendingMoment: "#ff2222",
        deformedShape: "#555555",
        loads: "#ff8700",
        nodes: "#000000",
        elements: "#000000",
        reactions: "#a020f0",
      };
    },
    supportSize: 1,
    convertForce: (v) => v,
    zoomEnabled: false,
  }
);

const panZoom = ref<InstanceType<typeof SvgPanZoom> | null>(null);
const grid = ref<InstanceType<typeof SvgGrid> | null>(null);

const svg = ref<SVGSVGElement>();
const viewport = ref<SVGGElement>();

const update = () => {
  fitContent();

  let maxDefo = 0;
  let maxNormalForce = 0;
  let maxBendingMoment = 0;
  let maxShearForce = 0;

  for (const beam of props.solver.domain.elements.values()) {
    const def = (beam as Beam2D).computeGlobalDefl(props.solver.loadCases[0], 10);

    const n = (beam as Beam2D).computeNormalForce(props.solver.loadCases[0], 10).N as number[];
    const v = (beam as Beam2D).computeShearForce(props.solver.loadCases[0], 10).V as number[];
    const m = (beam as Beam2D).computeBendingMoment(props.solver.loadCases[0], 10).M as number[];

    maxDefo = Math.max(maxDefo, Math.abs(max(def.u)), Math.abs(min(def.u)), Math.abs(max(def.w)), Math.abs(min(def.w)));

    maxNormalForce = Math.max(maxNormalForce, Math.abs(max(n)), Math.abs(min(n)));

    maxBendingMoment = Math.max(maxBendingMoment, Math.abs(max(m)), Math.abs(min(m)));

    maxShearForce = Math.max(maxShearForce, Math.abs(max(v)), Math.abs(min(v)));
  }

  defoScale.value = 1 / maxDefo;
  normalForceScale.value = 1 / maxNormalForce;
  bendingMomentScale.value = 1 / maxBendingMoment;
  shearForceScale.value = 1 / maxShearForce;
};

watch(props.solver, update);

const defoScale = ref(1);
const normalForceScale = ref(1);
const bendingMomentScale = ref(1);
const shearForceScale = ref(1);

const scale = computed(() => {
  if (panZoom.value) return panZoom.value.scale;

  return 1;
});

onMounted(() => {
  window.setTimeout(() => {
    fitContent();
    update();
  }, 100);
});

const centerContent = () => {
  if (!panZoom.value) return;

  panZoom.value.centerContent();

  if (grid.value) grid.value.refreshGrid(true);
};

const fitContent = () => {
  if (!panZoom.value) return;

  panZoom.value.onWindowResize();

  requestAnimationFrame(() => {
    panZoom.value.fitContent();
    if (grid.value) grid.value.refreshGrid(true);
  });
};

const onUpdate = throttle((zooming: boolean) => {
  if (grid.value) grid.value.refreshGrid(zooming);
}, 100);

const isSupported = (node: Node, dof: DofID) => {
  return node.bcs.has(dof);
};

const getReaction = (node: Node, dof: DofID) => {
  const r = node.getReactions(props.solver.loadCases[0], true);
  const i = r.dofs.findIndex((e) => e === dof);

  return "get" in r.values ? (r.values as unknown as Matrix).get([i]) : r.values[i];
};

const isLoaded = computed(() => {
  return (
    props.solver.loadCases[0].nodalLoadList.length > 0 ||
    props.solver.loadCases[0].elementLoadList.length > 0 ||
    props.solver.loadCases[0].prescribedBC.length > 0
  );
});

defineExpose({ centerContent, fitContent });
</script>

<template>
  <div class="d-flex flex-column fill-height">
    <svg v-if="false" class="w-100 fill-height" style="position: absolute">
      <SvgGrid ref="grid" :svg="svg as SVGSVGElement" :viewport="viewport as SVGGElement" :zoom="scale" />
    </svg>

    <SvgPanZoom
      :on-update="onUpdate"
      ref="panZoom"
      :padding="props.padding"
      :mobile-padding="props.mobilePadding"
      :zoom-enabled="props.zoomEnabled"
      style="overflow: visible; z-index: 50; min-height: 0"
    >
      <svg ref="svg">
        <SvgViewerDefs :colors="colors" :support-size="supportSize" />
        <g ref="viewport">
          <g>
            <g v-if="showLoads">
              <g class="element-load load-1d" v-for="(eload, index) in elementLoads" :key="`element-load-${index}`">
                <g v-if="eload.values[0] !== 0">
                  <polyline
                    v-for="(load, i) in formatElementLoadForces(eload, scale, 0)"
                    :key="`load-force-${i}`"
                    points="0,0 0,0"
                    vector-effect="non-scaling-stroke"
                    class="drawable"
                    :transform="`translate(${load[0]} ${load[1]}) rotate(${formatElementLoadForcesAngle(eload, 0)})`"
                  />
                </g>
                <g v-if="eload.values[1] !== 0">
                  <polyline
                    v-for="(load, i) in formatElementLoadForces(eload, scale, 1)"
                    :key="`load-force-${i}`"
                    points="0,0 0,0"
                    vector-effect="non-scaling-stroke"
                    class="drawable"
                    :transform="`translate(${load[0]} ${load[1]}) rotate(${formatElementLoadForcesAngle(eload, 1)})`"
                  />
                </g>
                <g v-if="showLoads">
                  <text
                    v-if="eload.values[0] !== 0"
                    :font-size="13 / scale"
                    font-weight="normal"
                    text-anchor="end"
                    dominant-baseline="middle"
                    :transform="formatElementLoadLabel(eload, scale, 0)"
                  >
                    {{ Math.abs(convertForce(eload.values[0])).toFixed(2) }}
                  </text>
                  <text
                    v-if="eload.values[1] !== 0"
                    :font-size="13 / scale"
                    font-weight="normal"
                    text-anchor="end"
                    dominant-baseline="middle"
                    :transform="formatElementLoadLabel(eload, scale, 1)"
                  >
                    {{ Math.abs(convertForce(eload.values[1])).toFixed(2) }}
                  </text>
                </g>
                <!--<path
                :d="formatElementLoadHatch(eload, scale)"
                vector-effect="non-scaling-stroke"
                class="drawable"
                stroke-linecap="round"
              />-->
                <polygon
                  :points="formatElementLoad(eload, scale)"
                  fill="transparent"
                  class="drawable"
                  vector-effect="non-scaling-stroke"
                />
              </g>
              <g class="nodal-load" v-for="(nload, index) in nodalLoads" :key="`nodal-load-${index}`">
                <polyline
                  v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
                  points="0,0 0,0"
                  vector-effect="non-scaling-stroke"
                  class="decoration force"
                  :transform="`translate(${solver.domain.nodes.get(nload.target)!.coords[0]}
                                  ${solver.domain.nodes.get(nload.target)!.coords[2]}) rotate(${formatNodalLoadAngle(
                                    nload
                                  )})`"
                />

                <polyline
                  v-if="nload.values[4] !== 0"
                  points="0,0 0,0"
                  vector-effect="non-scaling-stroke"
                  class="decoration moment"
                  :class="{ cw: nload.values[4] < 0, ccw: nload.values[4] > 0 }"
                  :transform="`translate(${solver.domain.nodes.get(nload.target)!.coords[0]}
                                  ${solver.domain.nodes.get(nload.target)!.coords[2]})`"
                />

                <polyline :points="formatNodalLoad(nload, scale)" class="handle" />
                <polyline :points="formatNode(solver.domain.nodes.get(nload.target).coords)" class="handle moment" />

                <text
                  v-if="nload.values[4] !== 0"
                  :font-size="13 / scale"
                  font-weight="normal"
                  text-anchor="start"
                  dominant-baseline="central"
                  :transform="`translate(${solver.domain.nodes.get(nload.target)!.coords[0] + 15 / scale}
                                  ${solver.domain.nodes.get(nload.target)!.coords[2] - 15 / scale})`"
                >
                  {{ Math.abs(convertForce(nload.values[4])).toFixed(2) }}
                </text>

                <text
                  v-if="nload.values[0] !== 0 || nload.values[2] !== 0"
                  :font-size="13 / scale"
                  font-weight="normal"
                  :text-anchor="nload.values[0] > 0 ? 'end' : 'start'"
                  dominant-baseline="central"
                  :transform="`translate(${
                    solver.domain.nodes.get(nload.target)!.coords[0] -
                    (40 * nload.values[0]) /
                      Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
                      scale
                  }
                                  ${
                                    solver.domain.nodes.get(nload.target)!.coords[2] -
                                    (40 * nload.values[2]) /
                                      Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2]) /
                                      scale
                                  })`"
                >
                  {{
                    convertForce(
                      Math.sqrt(nload.values[0] * nload.values[0] + nload.values[2] * nload.values[2])
                    ).toFixed(2)
                  }}
                  <template v-if="nload.values[0] !== 0 && nload.values[2] !== 0">
                    ({{ convertForce(nload.values[0]).toFixed(2) }}, {{ convertForce(nload.values[2]).toFixed(2) }})
                  </template>
                </text>
              </g>
            </g>

            <g class="element element-1d" v-for="(element, index) in elements" :key="`element-${index}`">
              <polyline
                v-if="props.solver.loadCases[0].solved && props.showDeformedShape"
                :points="formatResults(element, scale, defoScale, resultsScalePx)"
                vector-effect="non-scaling-stroke"
                class="deformedShape"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!--<polyline
                v-if="
                   props.solver.loadCases[0].solved && props.showDeformedShape
                "
                :points="formatResults(element, scale)"
                vector-effect="non-scaling-stroke"
                class="deformedShape decoration"
                stroke-linecap="round"
                stroke-linejoin="round"
              />-->

              <g v-if="props.solver.loadCases[0].solved && props.showNormalForce">
                <polyline
                  :points="formatNormalForces(element, scale, normalForceScale, resultsScalePx)"
                  vector-effect="non-scaling-stroke"
                  class="normal"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <g
                  v-for="(mv, mli) in formatNormalForceLabels(
                    element,
                    scale,
                    normalForceScale,
                    convertForce,
                    resultsScalePx
                  )"
                  :key="mli"
                  :transform="`translate(${mv[0] + (mv[2] < 0 ? -4 : 4) / scale} ${
                    mv[1] + (mv[2] < 0 ? -4 : 4) / scale
                  })`"
                >
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    filter="url(#textLabel)"
                    fill="blue"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    fill="blue"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>
              <g v-if="props.solver.loadCases[0].solved && props.showShearForce">
                <polyline
                  :points="formatShearForces(element, scale, shearForceScale, resultsScalePx)"
                  vector-effect="non-scaling-stroke"
                  class="shear"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <g
                  v-for="(mv, mli) in formatShearForceLabels(
                    element,
                    scale,
                    shearForceScale,
                    convertForce,
                    resultsScalePx
                  )"
                  :key="mli"
                  :transform="`translate(${mv[0] + (mv[2] < 0 ? -4 : 4) / scale} ${
                    mv[1] + (mv[2] < 0 ? -4 : 4) / scale
                  })`"
                >
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    filter="url(#textLabel)"
                    fill="green"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    fill="green"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>

              <g v-if="props.solver.loadCases[0].solved && props.showMoments">
                <polyline
                  :points="formatMoments(element, scale, bendingMomentScale, resultsScalePx)"
                  vector-effect="non-scaling-stroke"
                  class="moment"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <g
                  v-for="(mv, mli) in formatMomentsLabels(
                    element,
                    scale,
                    bendingMomentScale,
                    convertForce,
                    resultsScalePx
                  )"
                  :key="mli"
                  :transform="`translate(${mv[0] + (mv[2] < 0 ? -4 : 4) / scale} ${
                    mv[1] + (mv[2] < 0 ? -4 : 4) / scale
                  })`"
                >
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    filter="url(#textLabel)"
                    fill="red"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                  <text
                    :font-size="13 / scale"
                    class="moment-label"
                    fill="red"
                    font-weight="normal"
                    :text-anchor="mv[2] < 0 ? 'end' : 'start'"
                    alignment-baseline="baseline"
                  >
                    {{ Math.abs(mv[2]) < 1e-6 ? 0 : mv[2].toFixed(2) }}
                  </text>
                </g>
              </g>

              <!--<polyline
                :points="
                  formatElement([
                    solver.domain.nodes.get(element.nodes[0]).coords,
                    solver.domain.nodes.get(element.nodes[1]).coords
                  ])
                "
                vector-effect="non-scaling-stroke"
                class="decoration"
                stroke-linecap="round"
                :marker-start="elementStartMarker(element)"
                :marker-end="elementEndMarker(element)"
              />-->
              <polyline
                :points="
                  formatElement([
                    props.solver.domain.nodes.get(element.nodes[0])!.coords,
                    props.solver.domain.nodes.get(element.nodes[1])!.coords,
                  ])
                "
                vector-effect="non-scaling-stroke"
                class="drawable"
                stroke-linecap="round"
              />

              <polyline
                :points="formatElementFibers(element, scale)"
                class="fibers"
                stroke-dasharray="5 4"
                vector-effect="non-scaling-stroke"
              />

              <circle
                :transform="`translate(${formatElementHinge(element, 0, scale)})`"
                :r="6 / scale"
                fill="white"
                stroke="black"
                vector-effect="non-scaling-stroke"
                stroke-width="2"
                v-if="element.hinges[0]"
              />

              <circle
                :transform="`translate(${formatElementHinge(element, 1, scale)})`"
                :r="6 / scale"
                fill="white"
                stroke="black"
                vector-effect="non-scaling-stroke"
                stroke-width="2"
                v-if="element.hinges[1]"
              />

              <g>
                <text
                  v-if="props.showElementLabels"
                  :x="
                    (props.solver.domain.nodes.get(element.nodes[0])!.coords[0] +
                      props.solver.domain.nodes.get(element.nodes[1])!.coords[0]) /
                    2
                  "
                  :y="
                    (props.solver.domain.nodes.get(element.nodes[0])!.coords[2] +
                      props.solver.domain.nodes.get(element.nodes[1])!.coords[2]) /
                    2
                  "
                  :font-size="14 / scale"
                  font-weight="normal"
                  text-anchor="middle"
                  alignment-baseline="central"
                  :transform="`${formatElementLabel(element, scale, 10)} rotate(${formatElementAngle(element)} ${
                    (props.solver.domain.nodes.get(element.nodes[0])!.coords[0] +
                      props.solver.domain.nodes.get(element.nodes[1])!.coords[0]) /
                    2
                  } ${
                    (props.solver.domain.nodes.get(element.nodes[0])!.coords[2] +
                      props.solver.domain.nodes.get(element.nodes[1])!.coords[2]) /
                    2
                  })`"
                >
                  {{ element.label }}
                </text>
              </g>

              <polyline
                :points="
                  formatElement([
                    props.solver.domain.nodes.get(element.nodes[0])!.coords,
                    props.solver.domain.nodes.get(element.nodes[1])!.coords,
                  ])
                "
                vector-effect="non-scaling-stroke"
                class="handle"
                :data-element-id="element.label"
              />
            </g>
          </g>

          <g class="nodes">
            <g class="node" v-for="(node, index) in nodes" :key="`node-${index}`">
              <polyline
                v-if="showSupports && supportMarker(node) !== 'none'"
                :points="formatSupportNode(node)"
                :marker-start="supportMarker(node)"
                class="decoration"
              />

              <polyline :data-label="node.label" :points="formatNode(node.coords)" class="drawable" />

              <polyline
                v-if="
                  isLoaded &&
                  solver.loadCases[0].solved &&
                  props.showReactions &&
                  isSupported(node, DofID.Dz) &&
                  Math.abs(getReaction(node, DofID.Dz)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                marker-start="url(#reaction)"
                :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
                  Math.sign(getReaction(node, DofID.Dz)) >= 0 ? 0 : 180
                })`"
              />

              <text
                v-if="
                  isLoaded &&
                  solver.loadCases[0].solved &&
                  props.showReactions &&
                  isSupported(node, DofID.Dz) &&
                  Math.abs(getReaction(node, DofID.Dz)) > 1e-32
                "
                :font-size="13 / scale"
                :fill="colors.reactions"
                font-weight="normal"
                text-anchor="end"
                dominant-baseline="baseline"
                :transform="`translate(${node.coords[0]}
                                ${node.coords[2] - (40 * Math.sign(getReaction(node, DofID.Dz))) / scale})`"
              >
                {{ convertForce(Math.abs(getReaction(node, DofID.Dz))).toFixed(2) }}
              </text>

              <polyline
                v-if="
                  isLoaded &&
                  solver.loadCases[0].solved &&
                  props.showReactions &&
                  isSupported(node, DofID.Dx) &&
                  Math.abs(getReaction(node, DofID.Dx)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                marker-start="url(#reaction)"
                :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
                  -90 * Math.sign(getReaction(node, DofID.Dx))
                })`"
              />

              <text
                v-if="
                  isLoaded &&
                  solver.loadCases[0].solved &&
                  props.showReactions &&
                  isSupported(node, DofID.Dx) &&
                  Math.abs(getReaction(node, DofID.Dx)) > 1e-32
                "
                :font-size="13 / scale"
                :fill="colors.reactions"
                font-weight="normal"
                :text-anchor="getReaction(node, DofID.Dx) > 0 ? 'end' : 'start'"
                dominant-baseline="baseline"
                :transform="`translate(${node.coords[0] - (Math.sign(getReaction(node, DofID.Dx)) * 40) / scale}
                                ${node.coords[2]})`"
              >
                {{ convertForce(Math.abs(getReaction(node, DofID.Dx))).toFixed(2) }}
              </text>

              <polyline
                v-if="
                  isLoaded &&
                  solver.loadCases[0].solved &&
                  props.showReactions &&
                  isSupported(node, DofID.Ry) &&
                  Math.abs(getReaction(node, DofID.Ry)) > 1e-32
                "
                points="0,0 0,0"
                class="decoration"
                :marker-start="`url(#${getReaction(node, DofID.Ry) > 0 ? 'moment_reaction_ccw' : 'moment_reaction_cw'})`"
                :transform="`translate(${node.coords[0]} ${node.coords[2]})`"
              />

              <text
                v-if="
                  isLoaded &&
                  solver.loadCases[0].solved &&
                  props.showReactions &&
                  isSupported(node, DofID.Ry) &&
                  Math.abs(getReaction(node, DofID.Ry)) > 1e-32
                "
                :font-size="13 / scale"
                :fill="colors.reactions"
                font-weight="normal"
                text-anchor="start"
                dominant-baseline="baseline"
                :transform="`translate(${node.coords[0] + 15 / scale}
                                ${node.coords[2] - 15 / scale})`"
              >
                {{ convertForce(Math.abs(getReaction(node, DofID.Ry))).toFixed(2) }}
              </text>

              <g
                v-if="
                  isLoaded &&
                  solver.loadCases[0].solved &&
                  props.showDeformedShape &&
                  // check if node is connected to anything
                  elements.some((element) => element.nodes.includes(node.label))
                "
                :transform="`translate(${
                  node.coords[0] +
                  // @ts-expect-error ts-fem is wrongly typed
                  (node.getUnknowns(solver.loadCases[0], [DofID.Dx]) * defoScale * resultsScalePx) / scale
                }, ${
                  node.coords[2] +
                  // @ts-expect-error ts-fem is wrongly typed
                  (node.getUnknowns(solver.loadCases[0], [DofID.Dz]) * defoScale * resultsScalePx) / scale
                })`"
              >
                <polyline points="0,0 0,0" class="drawable deformed" />

                <polyline points="0,0 0 0" class="handle" :data-node-id="node.label" />
              </g>

              <g
                v-if="showNodeLabels"
                :transform="`translate(${(-12 - (node.label.toString().length - 1) * 2) / scale}, ${-12 / scale})`"
              >
                <circle
                  :cx="node.coords[0]"
                  :cy="node.coords[2]"
                  :r="(8 * (1 + Math.pow(node.label.toString().length - 1, 1.7) * 0.2)) / scale"
                  fill="transparent"
                  stroke="black"
                  vector-effect="non-scaling-stroke"
                ></circle>
                <text
                  :x="node.coords[0]"
                  :y="node.coords[2]"
                  :font-size="14 / scale"
                  font-weight="normal"
                  text-anchor="middle"
                  dominant-baseline="central"
                >
                  {{ node.label }}
                </text>
              </g>

              <polyline :points="formatNode(node.coords)" class="handle" :data-node-id="node.label" />
            </g>
          </g>
        </g>
      </svg>
    </SvgPanZoom>
  </div>
</template>
