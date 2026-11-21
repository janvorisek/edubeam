<script setup lang="ts">
/**
 * The model drawn by @edubeam/plot instead of the editor's own drawing (the plot renderer).
 *
 * It never takes the pointer: the editor hit-tests what it draws through the hits it reports (see
 * the plot-hits layer in SVGViewer), and highlights what is hovered and selected here.
 *
 * Plot draws in pixels: a point is a model position plus a pixel offset (a symbol, a label's gap,
 * a diagram ordinate). The scene is built at a reference scale `s0` and scaled back to metres, so
 * the viewBox pans it for free. While a zoom gesture runs the symbols scale with it; once the zoom
 * settles the scene is built again at the new scale, and the labels are placed again.
 */
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import {
  buildStructureScene,
  PLOT_CSS,
  RESULT_LAYERS,
  resolveScene,
  mergePaths,
  toneVars,
  type PlotModel,
  type ReadoutQuantity,
  type ResolvedScene,
  type SceneItem,
  type Tone,
} from '@edubeam/plot';
import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { MouseMode } from '@/mouse';
import PlotReadout from './PlotReadout.vue';
import PlotShapes from './PlotShapes.vue';
import type { PlotHit, PlotHits, PlotLabelHit } from './plotHit';
import { editorResolveOptions, editorSceneOptions, editorTones, readEditorModel } from '@/utils/plotDrawing';
import { useEditorDiagramScales, useEditorLayers, useEditorLook } from '@/utils/useEditorLook';

const props = defineProps<{
  /** The editor's scale, px per metre */
  scale: number;
  /** A zoom gesture is running: keep the last scene, scaled */
  zooming: boolean;
  /** What the pointer is on, as plot names it (`member:E1`, `node:A`, `elementLoad:2`) */
  hovered: string | null;
  /** What is selected, named the same way */
  selected: readonly string[];
  /** The hovered member's diagrams the pointer is over, whose values alone are read; null on its line */
  quantities?: readonly ReadoutQuantity[] | null;
}>();
const emit = defineEmits<{
  ready: [ready: boolean];
  reading: [reading: boolean];
  hits: [hits: PlotHits | null];
}>();

const appStore = useAppStore();
const projectStore = useProjectStore();
const viewerStore = useViewerStore();

/* ── The model, read again after every solve (each one replaces the diagnostics) ──────────── */
const model = shallowRef<PlotModel | null>(null);
const readModel = () => {
  try {
    model.value = readEditorModel(projectStore.solver);
  } catch (error) {
    console.warn('[plot renderer] cannot read the model', error);
    model.value = null;
  }
};
watch(() => projectStore.solveDiagnostics, readModel, { immediate: true });

/* ── The reference scale: follows the editor's, except during a zoom gesture ────────────────── */
const s0 = ref(props.scale);
// At once, not on a later frame: the editor measures what is drawn right after it changes the
// scale (to centre a fit), and a scene still built for the old scale reads its pixel-sized
// symbols as metres there.
watch(
  () => [props.scale, props.zooming] as const,
  ([scale, zooming]) => {
    if (!zooming && scale > 0) s0.value = scale;
  },
  { immediate: true }
);

/* ── The editor's settings, in plot's terms ─────────────────────────────────────────────────── */
const layers = useEditorLayers();
const look = useEditorLook();
const colors = computed(() => toneVars(editorTones(viewerStore.colors)));
const colour = (tone: Tone | 'paper') => `var(--ebp-${tone})`;

const RESULT_GROUPS: ReadonlySet<string> = new Set(['N', 'V', 'M']);

/** Something is being placed: a node, an element, a dimension, a paste, a support or a load */
const placing = computed(() =>
  [
    MouseMode.ADD_NODE,
    MouseMode.ADD_ELEMENT,
    MouseMode.ADD_DIMLINE,
    MouseMode.PASTE_CLIPBOARD,
    MouseMode.ADD_SUPPORT,
    MouseMode.ADD_LOAD,
  ].includes(appStore.mouseMode)
);

/* ── Hover and selection: a few style rules over the drawn scene, which is not built again ─── */
/** What steps back while a member is hovered: the members and what is drawn on them */
const DIMMED = ['members', 'nodes', 'memberLabels', ...RESULT_LAYERS] as const;
const SELECTED = 'rgb(0, 94, 255)';
const quoted = (entity: string) => `"${entity.replace(/["\\]/g, '\\$&')}"`;
const highlight = computed((): string => {
  const root = '.plot-picture';
  const rules: string[] = [];
  if (props.hovered && hoverLayer.value) {
    const h = `[data-e=${quoted(props.hovered)}]`;
    const top = `${root} > .plot-hover`;
    // A hovered member's structure and diagrams step back, as the editor's own drawing dims its
    // elements; not while something is being placed, when the picture stays as it is to aim by. A
    // hovered load or node is only drawn on top.
    if (props.hovered.startsWith('member:') && !placing.value)
      rules.push(`${root} > :is(${DIMMED.map((g) => `[data-g="${g}"]`).join(', ')}) { opacity: 0.5 }`);
    // It is drawn on top (see hoverLayer), not where it was as well
    rules.push(`${root} > ${h} { visibility: hidden }`);
    // A hovered load glows in its own colour: drawn on top alone it would look no different where
    // nothing covers it, and a thicker outline changed its shape. Selection, blue, stays apart.
    if (/^(elementLoad|nodalLoad|prescribed):/.test(props.hovered))
      rules.push(`${top} { filter: drop-shadow(0 0 2.5px color-mix(in srgb, var(--ebp-load) 65%, transparent)) }`);
    // A hovered member's line thickens, a hovered node's square grows
    rules.push(`${top} > path[data-g="members"]:not([stroke-dasharray]) { stroke-width: 4px }`);
    rules.push(`${top} > rect { transform-box: fill-box; transform-origin: center; transform: scale(1.6) }`);
  }
  if (props.selected.length > 0) {
    const any = `:is(${props.selected.map((e) => `[data-e=${quoted(e)}]`).join(', ')})`;
    const marked = `:is([data-g="members"], [data-g="supports"], [data-g="loads"])`;
    rules.push(`${root} path${any}${marked}:not([stroke="none"]) { stroke: ${SELECTED} }`);
    rules.push(`${root} path${any}${marked}:not([fill="none"]):not([fill="${colour('paper')}"]) { fill: ${SELECTED} }`);
    rules.push(`${root} :is(rect, circle)${any} { stroke: ${SELECTED} }`);
    rules.push(`${root} rect${any} { fill: ${SELECTED} }`);
    rules.push(
      `${root} text${any}:not([data-halo]):is([data-g="loads"], [data-g="nodeLabels"], [data-g="memberLabels"]) { fill: ${SELECTED} }`
    );
  }
  return rules.join('\n');
});

/**
 * Proportional figures, as the editor's own labels: the font's tabular ones give a 1 the width of
 * any other digit, and a value with ones in it reads letter-spaced.
 */
const EDITOR_CSS = '.plot-picture text{font-variant-numeric:normal}';

/** What is painted: not the areas the hit layer points at */
// Alike paths of one member or load joined into one: far fewer elements, the same picture
const mergedPaths = computed(() => mergePaths(picture.value?.resolved.paths ?? []));
const drawnPaths = computed(() => mergedPaths.value.filter((p) => !p.hitArea));

/* ── The values at the pointer ──────────────────────────────────────────────────────────── */
const scales = useEditorDiagramScales();
const readable = computed(() => RESULT_LAYERS.filter((q) => layers.value.has(q)));
// Only while the editor is just looking: not while drawing, moving, pasting or picking a window
const reading = computed(
  () =>
    viewerStore.showReadout &&
    !props.zooming &&
    (appStore.mouseMode === MouseMode.NONE ||
      appStore.mouseMode === MouseMode.SELECTING ||
      appStore.mouseMode === MouseMode.HOVER)
);

/** The pointer is on its way somewhere (see PlotReadout): nothing is brought forward as it passes */
const travelling = ref(false);

/* ── The picture ────────────────────────────────────────────────────────────────────────────── */
interface Picture {
  /** The scene as built, for placing a hovered member's values again on their own */
  readonly items: readonly SceneItem[];
  readonly resolved: ResolvedScene;
  /** Where each node is drawn, px */
  readonly nodes: readonly { readonly id: string; readonly x: number; readonly y: number }[];
}

const picture = computed((): Picture | null => {
  const m = model.value;
  const s = s0.value;
  if (!m || !(s > 0) || m.nodes.length === 0) return null;
  const shown = layers.value;
  try {
    const items = buildStructureScene(m, editorSceneOptions(look.value, shown, s, scales.value));
    // No viewport: a label off screen now may be panned into view
    const resolved = resolveScene(items, { s, tx: 0, ty: 0 }, editorResolveOptions(look.value, shown));
    const nodes = m.nodes.map((n) => ({ id: n.id, x: n.x * s, y: n.z * s }));
    return { items, resolved, nodes };
  } catch (error) {
    console.warn('[plot renderer] cannot draw the model', error);
    return null;
  }
});

/**
 * What is hovered, drawn again over everything else, as the editor's own drawing brings a hovered
 * element forward: its lines, rings, labels and node square. A member's values are placed again
 * against its own drawing alone, so a value left out for want of room shows while it is hovered.
 */
const hoverLayer = computed(() => {
  const hovered = props.hovered;
  const p = picture.value;
  if (!hovered || !p || props.zooming || travelling.value) return null;
  const mine = (entity: string | undefined) => entity === hovered;
  const member = hovered.startsWith('member:');
  const layer = {
    paths: drawnPaths.value.filter((path) => mine(path.entity)),
    nodes: p.nodes.filter((n) => `node:${n.id}` === hovered),
    circles: p.resolved.circles.filter((c) => mine(c.entity)),
    texts: member && !placing.value ? memberTexts(p.items, hovered) : p.resolved.texts.filter((t) => mine(t.entity)),
  };
  return layer.paths.length + layer.nodes.length + layer.circles.length + layer.texts.length > 0 ? layer : null;
});

/** A member's values, placed against its own drawing alone */
const memberTexts = (items: readonly SceneItem[], member: string) => {
  const own = items.filter((item) => item.entity === member && item.group !== 'loads');
  try {
    return resolveScene(own, { s: s0.value, tx: 0, ty: 0 }, editorResolveOptions(look.value, layers.value)).texts;
  } catch (error) {
    console.warn('[plot renderer] cannot place the hovered member', error);
    return [];
  }
};

watch(
  () => picture.value !== null,
  (ready) => emit('ready', ready),
  { immediate: true }
);
// The loads where they are drawn: the editor hit-tests them there, not where it would draw them
watch(
  () => picture.value,
  (p) => {
    if (!p) return emit('hits', null);
    // Bands under everything smaller, so a point load drawn through a band can still be reached
    const broad = new Set(
      (model.value?.loads ?? []).flatMap((l) =>
        l.source && (l.kind === 'distributed' || l.kind === 'temperature') ? [l.source] : []
      )
    );
    const loads = mergedPaths.value
      .flatMap((path): PlotHit[] =>
        path.entity && /^(nodalLoad|elementLoad|prescribed):/.test(path.entity)
          ? [{ entity: path.entity, d: path.d, width: Math.max(12, path.width + 10), area: path.hitArea === true }]
          : []
      )
      .sort((a, b) => Number(broad.has(b.entity)) - Number(broad.has(a.entity)));
    const at = new Map(p.nodes.map((n) => [n.id, n]));
    const members = (model.value?.members ?? []).flatMap((m) => {
      const a = at.get(m.start);
      const b = at.get(m.end);
      return a && b ? [{ id: m.id, x1: a.x, y1: a.y, x2: b.x, y2: b.y }] : [];
    });
    const results = mergedPaths.value.flatMap((path): PlotHit[] =>
      path.hitArea && path.entity?.startsWith('member:') && RESULT_GROUPS.has(path.group)
        ? [{ entity: path.entity, group: path.group, d: path.d, width: 0, area: true }]
        : []
    );
    const labels = p.resolved.texts.flatMap((t): PlotLabelHit[] =>
      t.entity && /^(nodalLoad|elementLoad|prescribed|member):/.test(t.entity)
        ? [
            {
              entity: t.entity,
              group: t.group,
              x: t.x,
              y: t.y,
              anchor: t.anchor,
              transform: t.transform,
              text: t.text,
              size: t.size ?? viewerStore.fontSize,
            },
          ]
        : []
    );
    emit('hits', { scale: s0.value, loads, results, labels, members, nodes: p.nodes });
  },
  { immediate: true }
);
onBeforeUnmount(() => emit('ready', false));
</script>

<template>
  <g
    v-if="picture"
    class="ebp-svg plot-picture"
    data-fit-ignore="plot"
    :transform="`scale(${1 / s0})`"
    :style="colors"
    :font-size="viewerStore.fontSize"
    pointer-events="none"
  >
    <component :is="'style'">{{ PLOT_CSS + EDITOR_CSS }}</component>
    <component :is="'style'">{{ highlight }}</component>
    <PlotShapes
      :paths="drawnPaths"
      :nodes="picture.nodes"
      :circles="picture.resolved.circles"
      :texts="picture.resolved.texts"
      :font-size="viewerStore.fontSize"
    />
    <!-- What is hovered, drawn again over everything else, as the editor's own drawing does -->
    <g v-if="hoverLayer" class="plot-hover">
      <PlotShapes
        :paths="hoverLayer.paths"
        :nodes="hoverLayer.nodes"
        :circles="hoverLayer.circles"
        :texts="hoverLayer.texts"
        :font-size="viewerStore.fontSize"
      />
    </g>
    <PlotReadout
      v-if="model?.results"
      :model="model"
      :scale="s0"
      :shown="readable"
      :k="scales"
      :diagram-style="viewerStore.diagramStyle"
      :units="look.units"
      :number-format="look.numberFormat"
      :displacement-text="look.displacementText"
      :font-size="viewerStore.fontSize"
      :enabled="reading"
      :member="props.hovered?.startsWith('member:') ? props.hovered.slice('member:'.length) : null"
      :quantities="props.quantities ?? null"
      @reading="emit('reading', $event)"
      @travelling="travelling = $event"
    />
  </g>
</template>
