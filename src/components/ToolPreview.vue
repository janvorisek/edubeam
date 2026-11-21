<script setup lang="ts">
import { computed, inject } from 'vue';
import {
  buildStructureScene,
  mergePaths,
  resolveScene,
  textRuns,
  type PlotLayer,
  type PlotLoad,
  type PlotModel,
  type PlotNode,
} from '@edubeam/plot';
import { DofID, type Node } from '@edubeam/fem';
import { useProjectStore } from '@/store/project';
import { snapKey } from '@/types/snap';
import { targetOf, toolLoadFits, type ToolLoad } from '@/utils/toolTarget';
import { supportTypes, type SupportType } from '@/utils/supports';
import { editorResolveOptions, editorSceneOptions, plotNodeOf } from '@/utils/plotDrawing';
import { useEditorLook } from '@/utils/useEditorLook';

/**
 * What the support or load tool would add, drawn in grey where a click would put it: on the node
 * or member under the pointer, or fainter at the pointer itself where a click would add nothing.
 * Drawn by the plot renderer, as the real support or load is once added.
 *
 * Its own component for the reason PlacingPreview is: the pointer it follows changes on every
 * report, and read in the drawing it would rebuild every node, element and load each time.
 */
const props = defineProps<{
  /** The editor's scale, px per metre */
  scale: number;
  /** The tool in use, or null for none of these */
  tool: 'support' | 'load' | null;
  support: SupportType;
  /** The load tool's load, or the parts of a load being dragged (a force and a moment together) */
  loads: readonly ToolLoad[];
}>();

const projectStore = useProjectStore();
/** Where the active tool's point snaps (see snapPoint): the same the click goes by */
const snap = inject(snapKey)!;
const look = useEditorLook();

/** The stretch a load on a member is shown over where there is no member under the pointer, px */
const FREE_SPAN_PX = 72;
const FREE = { dx: false, dz: false, ry: false } as const;
const GHOST = '#5f6368';

const target = computed(() => (props.tool === null || !snap.value ? null : targetOf(snap.value)));

/** Whether a click now would add it */
const lands = computed(() => {
  const t = target.value;
  if (!t) return false;
  return props.tool === 'support'
    ? 'node' in t
    : props.loads.length > 0 && props.loads.every((l) => toolLoadFits(t, l));
});

/** The node as the plot model has it, with the support previewed on it if one is */
const plotNode = (node: Node, fixity?: PlotNode['fixity']): PlotNode => ({
  ...plotNodeOf(node),
  fixity: fixity ?? FREE,
});

const fixityOf = (type: SupportType): PlotNode['fixity'] => {
  const dofs: readonly DofID[] = supportTypes[type];
  return { dx: dofs.includes(DofID.Dx), dz: dofs.includes(DofID.Dz), ry: dofs.includes(DofID.Ry) };
};

/** The tool's load on the previewed member, as the plot model has it */
const memberLoad = (l: ToolLoad, at: number): PlotLoad => {
  switch (l.kind) {
    case 'udl':
      return {
        kind: 'distributed',
        member: 'ghost',
        start: { fx: l.qx, fz: l.qz },
        end: { fx: l.qx, fz: l.qz },
        local: l.local,
      };
    case 'trapezoidal':
      return { kind: 'distributed', member: 'ghost', start: l.start, end: l.end, local: l.local };
    case 'temperature':
      return { kind: 'temperature', member: 'ghost', uniform: l.uniform, gradient: l.gradient };
    case 'force':
      return { kind: 'pointForce', member: 'ghost', at, fx: l.fx, fz: l.fz, local: l.local };
    case 'moment':
      return { kind: 'pointMoment', member: 'ghost', at, my: l.my };
  }
};

/** A model of only what is previewed: its node or member, and the support or load on it */
const ghost = computed((): { model: PlotModel; layers: ReadonlySet<PlotLayer> } | null => {
  if (props.tool === null) return null;
  const t = lands.value ? target.value : null;
  const here = { x: snap.value?.x ?? 0, z: snap.value?.y ?? 0 };

  if (props.tool === 'support') {
    const fixity = fixityOf(props.support);
    const node = t && 'node' in t ? plotNode(t.node, fixity) : { id: 'ghost', ...here, fixity, angle: 0 };
    return { model: { nodes: [node], members: [], loads: [] }, layers: new Set<PlotLayer>(['supports']) };
  }

  if (t && 'node' in t) {
    const id = String(t.node.label);
    const loads = props.loads.flatMap((l): PlotLoad[] =>
      l.kind === 'force'
        ? [{ kind: 'nodalForce', node: id, fx: l.fx, fz: l.fz }]
        : l.kind === 'moment'
          ? [{ kind: 'nodalMoment', node: id, my: l.my }]
          : []
    );
    return { model: { nodes: [plotNode(t.node)], members: [], loads }, layers: new Set<PlotLayer>(['loads']) };
  }

  // On a member, or on a short one at the pointer standing in for it
  const ends = t && 'beam' in t ? t.beam.nodes.map((id) => projectStore.solver.domain.nodes.get(id)) : [];
  const half = FREE_SPAN_PX / 2 / (props.scale || 1);
  const nodes: PlotNode[] =
    ends[0] && ends[1]
      ? [plotNode(ends[0]), plotNode(ends[1])]
      : [
          { id: 'a', x: here.x - half, z: here.z, fixity: FREE, angle: 0 },
          { id: 'b', x: here.x + half, z: here.z, fixity: FREE, angle: 0 },
        ];
  const member = { id: 'ghost', start: nodes[0].id, end: nodes[1].id, hinges: [false, false] as const };
  const at = t && 'beam' in t ? t.at : half;
  const loads = props.loads.map((l) => memberLoad(l, at));
  return { model: { nodes, members: [member], loads }, layers: new Set<PlotLayer>(['loads']) };
});

const picture = computed(() => {
  const s = props.scale;
  const g = ghost.value;
  if (!g || !(s > 0)) return null;
  try {
    const items = buildStructureScene(g.model, editorSceneOptions(look.value, g.layers, s));
    const resolved = resolveScene(items, { s, tx: 0, ty: 0 }, editorResolveOptions(look.value, g.layers));
    return {
      paths: mergePaths(resolved.paths).filter((p) => !p.hitArea),
      circles: resolved.circles,
      texts: resolved.texts.map((t) => ({ ...t, runs: textRuns(t.text, t.size ?? look.value.fontSize) })),
    };
  } catch (error) {
    console.warn('[plot renderer] cannot draw the tool preview', error);
    return null;
  }
});
</script>

<template>
  <g
    v-if="picture"
    class="tool-preview"
    :class="{ lands }"
    :transform="`scale(${1 / props.scale})`"
    pointer-events="none"
  >
    <path
      v-for="(p, i) in picture.paths"
      :key="`p${i}`"
      :d="p.d"
      :stroke="p.width > 0 ? GHOST : 'none'"
      :stroke-width="p.width > 0 ? p.width : undefined"
      :stroke-dasharray="p.dash"
      :stroke-linecap="p.cap ?? 'round'"
      stroke-linejoin="round"
      :fill="p.fill === 'tone' ? GHOST : p.fill === 'paper' ? '#ffffff' : 'none'"
      :fill-opacity="p.fillOpacity"
    />
    <circle
      v-for="(c, i) in picture.circles"
      :key="`c${i}`"
      :cx="c.cx"
      :cy="c.cy"
      :r="c.r"
      :stroke="GHOST"
      :stroke-width="c.width"
      :fill="c.fill === 'paper' ? '#ffffff' : GHOST"
    />
    <text
      v-for="(t, i) in picture.texts"
      :key="`t${i}`"
      class="ghost-label"
      :x="t.x"
      :y="t.y"
      :text-anchor="t.anchor"
      :transform="t.transform"
      :fill="GHOST"
      :font-weight="t.weight"
      :font-size="t.size ?? look.fontSize"
    >
      <tspan v-for="(r, k) in t.runs" :key="k" :font-size="r.size" :dy="r.dy">{{ r.text }}</tspan>
    </text>
  </g>
</template>

<style scoped lang="scss">
/* Fainter where a click would add nothing */
.tool-preview {
  opacity: 0.4;

  &.lands {
    opacity: 0.9;
  }
}

.ghost-label {
  paint-order: stroke;
  stroke: #ffffff;
  stroke-width: 3px;
  stroke-linejoin: round;
}
</style>
