<script lang="ts" setup>
import { Matrix, inv, multiply } from "mathjs";
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
  const isHinge =
    (isSupported(props.node, DofID.Dx) || isSupported(props.node, DofID.Dz)) && !isSupported(props.node, DofID.Ry);

  // Rotate hinge if has lcs
  if (props.node.hasLcs() && isHinge) {
    const angle = getSupportAngle(props.node);
    const x = props.node.coords[0] + 1 * Math.cos((angle * Math.PI) / 180);
    const z = props.node.coords[2] + 1 * Math.sin((angle * Math.PI) / 180);

    return `${props.node.coords[0]},${props.node.coords[2]} ${x},${z}`;
  }

  // if not cantilever
  if (isHinge) {
    return `${props.node.coords[0]},${props.node.coords[2]} ${props.node.coords[0] + 1e-6},${props.node.coords[2]}`;
  }

  // find first element which has this node
  const elements = props.node.domain.elements.values();

  for (const el of elements) {
    if (el.nodes.includes(props.node.label)) {
      const idx = el.nodes.indexOf(props.node.label);

      let node2 = props.node.domain.nodes.get(el.nodes[0])!;
      if (idx === 0) {
        node2 = props.node.domain.nodes.get(el.nodes[1])!;
      }

      let n2x = (node2.coords[0] + props.node.coords[0]) / 2;
      let n2z = (node2.coords[2] + props.node.coords[2]) / 2;

      const l = el.computeGeo().l * 0.5;
      const dx = (n2x - props.node.coords[0]) / l;
      const dz = (n2z - props.node.coords[2]) / l;

      n2x = props.node.coords[0] + dx * 1;
      n2z = props.node.coords[2] + dz * 1;

      return `${props.node.coords[0]},${props.node.coords[2]} ${n2x},${n2z}`;
    }
  }

  return nodeCoords.value;
});

const deformedPosition = computed(() => {
  const x = props.node.coords[0];
  // @ts-expect-error wrongly typed getUnknowns
  let dx = (props.node.getUnknowns(props.loadCase, [DofID.Dx]) * props.multiplier) / props.scale;

  const z = props.node.coords[2];
  // @ts-expect-error wrongly typed getUnknowns
  let dz = (props.node.getUnknowns(props.loadCase, [DofID.Dz]) * props.multiplier) / props.scale;

  if (props.node.hasLcs()) {
    const lcs = props.node.lcs;
    const dx1 = multiply(dx, lcs[0]);
    const dz1 = multiply(dz, lcs[2]);

    dx = dx1[0] + dz1[0];
    dz = dx1[2] + dz1[2];
  }

  return `translate(${x + dx}, ${z + dz})`;
});

const reactionLabelX = computed(() => {
  if (props.node.hasLcs()) {
    const rxx = props.node.lcs[0][0];
    const rxz = props.node.lcs[0][2];

    const x = `translate(${props.node.coords[0] - (Math.sign(getReaction(props.node, DofID.Dx)) * 40 * rxx) / props.scale}
              ${props.node.coords[2] - (Math.sign(getReaction(props.node, DofID.Dx)) * 40 * rxz) / props.scale})`;

    return x;
  }

  const x = `translate(${props.node.coords[0] - (Math.sign(getReaction(props.node, DofID.Dx)) * 40) / props.scale}
              ${props.node.coords[2]})`;
  return x;
});

const reactionLabelZ = computed(() => {
  if (props.node.hasLcs()) {
    const rzx = props.node.lcs[2][0];
    const rzz = props.node.lcs[2][2];

    const z = `translate(${props.node.coords[0] - (Math.sign(getReaction(props.node, DofID.Dz)) * 40 * rzx) / props.scale}
              ${props.node.coords[2] - (Math.sign(getReaction(props.node, DofID.Dz)) * 40 * rzz) / props.scale})`;

    return z;
  }

  const z = `translate(${props.node.coords[0]}
              ${props.node.coords[2] - (Math.sign(getReaction(props.node, DofID.Dz)) * 40) / props.scale})`;

  return z;
});

const isConnected = computed(() => {
  return [...props.node.domain.elements.values()].some((element) => element.nodes.includes(props.node.label));
});

const isSupported = (node: Node, dof: DofID) => {
  return node.bcs.has(dof);
};

const getReaction = (node: Node, dof: DofID) => {
  const r = node.getReactions(props.loadCase, !node.hasLcs());
  const i = r.dofs.findIndex((e) => e === dof);

  if (i === -1) return 0;

  return "get" in r.values ? (r.values as unknown as Matrix).get([i]) : r.values[i];
};

const getSupportAngle = (node: Node) => {
  if (!node.hasLcs()) return 90;

  const lx = node.lcs[0];

  return Math.atan2(lx[2], lx[0]) * (180 / Math.PI);
};

const getRotSupportAngle = (node: Node, dof: DofID) => {
  if (!node.hasLcs()) return 0;

  const angle = getSupportAngle(node);

  return angle;
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
        (node.hasLcs() || isSupported(node, DofID.Dz)) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Dz)) > 1e-32
      "
      points="0,0 0,0"
      class="decoration"
      marker-start="url(#reaction)"
      :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
        (Math.sign(getReaction(node, DofID.Dz)) >= 0 ? 0 : 180) + getRotSupportAngle(node, DofID.Dz)
      })`"
    />

    <text
      v-if="
        loadCase.solved &&
        showReactions &&
        (node.hasLcs() || isSupported(node, DofID.Dz)) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Dz)) > 1e-32
      "
      class="reaction"
      :font-size="13 / scale"
      font-weight="normal"
      text-anchor="end"
      dominant-baseline="baseline"
      :transform="reactionLabelZ"
    >
      {{ convertForce(Math.abs(getReaction(node, DofID.Dz))).toFixed(2) }}
    </text>

    <polyline
      v-if="
        loadCase.solved &&
        showReactions &&
        (node.hasLcs() || isSupported(node, DofID.Dx)) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Dx)) > 1e-32
      "
      points="0,0 0,0"
      class="decoration"
      marker-start="url(#reaction)"
      :transform="`translate(${node.coords[0]} ${node.coords[2]}) rotate(${
        -90 * Math.sign(getReaction(node, DofID.Dx)) + getRotSupportAngle(node, DofID.Dx)
      })`"
    />

    <text
      v-if="
        loadCase.solved &&
        showReactions &&
        (node.hasLcs() || isSupported(node, DofID.Dx)) &&
        isConnected &&
        Math.abs(getReaction(node, DofID.Dx)) > 1e-32
      "
      class="reaction"
      :font-size="13 / scale"
      font-weight="normal"
      :text-anchor="getReaction(node, DofID.Dx) > 0 ? 'end' : 'start'"
      dominant-baseline="baseline"
      :transform="reactionLabelX"
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
      :transform="deformedPosition"
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