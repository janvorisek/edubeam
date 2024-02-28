<script lang="ts" setup>
import { Matrix } from "mathjs";
import { Node, DofID, LoadCase } from "ts-fem";
import { computed } from "vue";

const props = defineProps<{
  node: Node;
  scale: number;
  showSupports: boolean;
  showReactions: boolean;
  showLabel: boolean;
  convertForce: (f: number) => number;
  showDeformedShape: boolean;
  loadCase: LoadCase;
  multiplier: number;
}>();

const supportMarker = computed(() => {
  const sdofs = Array.from(props.node.bcs);

  // cantilever
  if (sdofs.includes(DofID.Dx) && sdofs.includes(DofID.Dz) && sdofs.includes(DofID.Ry)) return `url(#dot)`;

  // Hinge XY
  if (sdofs.includes(DofID.Dx) && sdofs.includes(DofID.Dz)) return `url(#hinge-xy)`;

  // Hinge X
  if (sdofs.includes(DofID.Dx)) return `url(#hinge-y)`;

  // Hinge Z
  if (sdofs.includes(DofID.Dz)) return `url(#hinge-x)`;

  return `none`;
});

const nodeCoords = computed(() => {
  return `${props.node.coords[0]},${props.node.coords[2]} ${props.node.coords[0]},${props.node.coords[2]}`;
});

const orientedNodeCoords = computed(() => {
  // find first element which has this node
  const elements = props.node.domain.elements.values();

  for (const el of elements) {
    if (el.nodes.includes(props.node.label)) {
      const idx = el.nodes.indexOf(props.node.label);

      if (idx === 0) {
        const node2 = props.node.domain.nodes.get(el.nodes[1])!;
        const n2x = (node2.coords[0] + props.node.coords[0]) / 2;
        const n2z = (node2.coords[2] + props.node.coords[2]) / 2;

        return `${props.node.coords[0]},${props.node.coords[2]} ${n2x},${n2z}`;
      }

      const node2 = props.node.domain.nodes.get(el.nodes[0])!;
      const n2x = (node2.coords[0] + props.node.coords[0]) / 2;
      const n2z = (node2.coords[2] + props.node.coords[2]) / 2;

      return `${props.node.coords[0]},${props.node.coords[2]} ${n2x},${n2z}`;
    }
  }

  return nodeCoords.value;
});

const isConnected = computed(() => {
  return [...props.node.domain.elements.values()].some((element) => element.nodes.includes(props.node.label));
});

const isSupported = (node: Node, dof: DofID) => {
  return node.bcs.has(dof);
};

const getReaction = (node: Node, dof: DofID) => {
  const r = node.getReactions(props.loadCase, true);
  const i = r.dofs.findIndex((e) => e === dof);

  return "get" in r.values ? (r.values as unknown as Matrix).get([i]) : r.values[i];
};

const emit = defineEmits(["nodemousemove", "nodepointerup", "nodedefomousemove"]);
</script>

<template>
  <g class="node">
    <polyline
      v-if="showSupports && supportMarker !== 'none'"
      :points="orientedNodeCoords"
      :marker-start="supportMarker"
      class="decoration"
    />

    <polyline :data-label="node.label" :points="nodeCoords" class="drawable" />

    <polyline
      v-if="
        loadCase.solved &&
        showReactions &&
        isSupported(node, DofID.Dz) &&
        isConnected &&
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
        loadCase.solved &&
        showReactions &&
        isSupported(node, DofID.Dz) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Dz)) > 1e-32
      "
      class="reaction"
      :font-size="13 / scale"
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
        loadCase.solved &&
        showReactions &&
        isSupported(node, DofID.Dx) &&
        isConnected &&
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
        loadCase.solved &&
        showReactions &&
        isSupported(node, DofID.Dx) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Dx)) > 1e-32
      "
      class="reaction"
      :font-size="13 / scale"
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
        loadCase.solved &&
        showReactions &&
        isSupported(node, DofID.Ry) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Ry)) > 1e-32
      "
      points="0,0 0,0"
      class="decoration"
      :marker-start="`url(#${getReaction(node, DofID.Ry) > 0 ? 'moment_reaction_ccw' : 'moment_reaction_cw'})`"
      :transform="`translate(${node.coords[0]} ${node.coords[2]})`"
    />

    <text
      v-if="
        loadCase.solved &&
        showReactions &&
        isSupported(node, DofID.Ry) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Ry)) > 1e-32
      "
      class="reaction"
      :font-size="13 / scale"
      font-weight="normal"
      text-anchor="start"
      dominant-baseline="baseline"
      :transform="`translate(${node.coords[0] + 15 / scale}
              ${node.coords[2] - 15 / scale})`"
    >
      {{ convertForce(Math.abs(getReaction(node, DofID.Ry))).toFixed(2) }}
    </text>

    <g
      v-if="loadCase.solved && showDeformedShape && isConnected"
      @mousemove="emit('nodedefomousemove', $event, node)"
      :transform="`translate(${
        node.coords[0] +
        // @ts-expect-error getUnknowns return number | number[]
        (node.getUnknowns(loadCase, [DofID.Dx]) * multiplier) / scale
      }, ${
        node.coords[2] +
        // @ts-expect-error getUnknowns return number | number[]
        (node.getUnknowns(loadCase, [DofID.Dz]) * multiplier) / scale
      })`"
    >
      <polyline points="0,0 0,0" class="drawable deformed" />

      <polyline points="0,0 0 0" class="handle" :data-node-id="node.label" />
    </g>

    <g
      v-if="showLabel"
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

    <polyline
      :points="nodeCoords"
      class="handle"
      :data-node-id="node.label"
      @mousemove="emit('nodemousemove', $event, node)"
      @pointerup="emit('nodepointerup', $event)"
    />
  </g>
</template>
