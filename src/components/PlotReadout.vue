<script setup lang="ts">
/**
 * PROTOTYPE: the results at the pointer, read off the member it is over. Each shown quantity gets
 * a tag beside its own point on the drawing - the diagram's tip, the displaced point - placed by
 * @edubeam/plot so the tags keep clear of each other and of the member.
 *
 * A component of its own, inside the plot drawing's group: following the pointer redraws these few
 * tags, never the drawing.
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import {
  diagramSide,
  formatReadout,
  memberFrame,
  nodeMap,
  placeReadoutTags,
  project,
  readoutAt,
  readoutMarks,
  textRuns,
  type PlotModel,
  type Readout,
  type ReadoutQuantity,
  type Tone,
  type Units,
} from '@edubeam/plot';
import {
  DWELL_MS,
  FAST,
  MOTION_MS,
  nodeNear,
  pointerMotion,
  readingOnTo,
  type Reading,
  type TrailPoint,
} from './plotNodeIntent';

const props = defineProps<{
  model: PlotModel;
  /** px per metre the drawing is built at; its group maps these px to the editor's metres */
  scale: number;
  /** The quantities on show */
  shown: readonly ReadoutQuantity[];
  /** px per SI unit of each quantity, as the drawing uses */
  k: Readonly<Record<ReadoutQuantity, number>>;
  /** Which side each diagram is drawn on */
  diagramStyle: {
    readonly momentOnTensionSide: boolean;
    readonly normalOnDashedSide: boolean;
    readonly shearOnDashedSide: boolean;
  };
  units: Units;
  numberFormat: Intl.NumberFormat;
  /** Writes a displacement, in display units: orders of magnitude smaller than the forces */
  displacementText: (value: number) => string;
  fontSize: number;
  /** Off while the editor is busy with something else: drawing, dragging, pasting */
  enabled: boolean;
  /** The member hovered, by its line or its diagram: the only one read, wherever the pointer is over it */
  member?: string | null;
  /** The diagrams pointed at, whose values alone are read; on the member's line, all on show */
  quantities?: readonly ReadoutQuantity[] | null;
}>();

const emit = defineEmits<{
  reading: [reading: boolean];
  /** The pointer is on its way somewhere, too fast to be reading: nothing is brought forward */
  travelling: [travelling: boolean];
}>();

/** What is read: the diagrams pointed at, or everything on show */
const readQuantities = computed(() =>
  props.quantities ? props.shown.filter((q) => props.quantities!.includes(q)) : props.shown
);

const root = ref<SVGGElement | null>(null);
const readout = shallowRef<Readout | null>(null);
/** The editor's visible area in the drawing's px, for keeping the tags inside it */
const viewport = shallowRef<{ minX: number; minY: number; maxX: number; maxY: number } | undefined>(undefined);
const t = computed(() => ({ s: props.scale, tx: 0, ty: 0 }));

/** The rulers along the canvas edges, px, with a little room */
const RULER_PX = 36;

/* ── What the user is after near a node (see plotNodeIntent) ────────────────────────────────── */
/** The member whose values show, and where the pointer was when they began to (screen px) */
let reading: Reading | null = null;
let dwell = 0;

const trail: TrailPoint[] = [];
let atNode: { id: string; intent: 'member' | 'node'; member: string | null } | null = null;

/** Whether, entering node `id`, the user is reading on along the member whose values show */
const readingOn = (id: string, ctm: DOMMatrix): string | null => {
  const r = readout.value;
  if (!r || reading?.member !== r.member || !last) return null;
  return readingOnTo(props.model, id, reading, { x: last.clientX, y: last.clientY }, pointerMotion(trail), ctm);
};

/* ── Following the pointer, once a frame ─────────────────────────────────────────────────── */
let frame = 0;
let last: PointerEvent | null = null;
const read = () => {
  frame = 0;
  const e = last;
  const g = root.value;
  const ctm = g?.getScreenCTM();
  if (!e || !g || !ctm || !props.enabled || travelling || e.buttons !== 0 || readQuantities.value.length === 0) {
    setReadout(null);
    return;
  }
  // The pointer in the drawing's own px, and the visible area with it
  const inverse = ctm.inverse();
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(inverse);
  const area = svg?.getBoundingClientRect();
  if (area) {
    const a = new DOMPoint(area.left, area.top).matrixTransform(inverse);
    const b = new DOMPoint(area.right, area.bottom).matrixTransform(inverse);
    // Inside the rulers along the canvas edges, which are drawn over it
    const inset = RULER_PX * Math.abs(inverse.a);
    viewport.value = {
      minX: Math.min(a.x, b.x) + inset,
      minY: Math.min(a.y, b.y) + inset,
      maxX: Math.max(a.x, b.x) - inset,
      maxY: Math.max(a.y, b.y) - inset,
    };
  }
  // Drawing px per screen px
  const pxPerScreen = Math.abs(inverse.a);
  const node = nodeNear(props.model, props.scale, p.x, p.y, pxPerScreen);
  if (!node) atNode = null;
  else if (atNode?.id !== node.id) {
    const member = readingOn(node.id, ctm);
    atNode = { id: node.id, intent: member ? 'member' : 'node', member };
  }
  // Resting on a node read along a member hands it to the node
  clearTimeout(dwell);
  if (atNode?.intent === 'member') {
    const at = atNode;
    dwell = window.setTimeout(() => {
      if (atNode !== at) return;
      at.intent = 'node';
      at.member = null;
      setReadout(null);
    }, DWELL_MS);
  }
  if (atNode?.intent === 'node') {
    // The node's own tooltip, from its hit target, shows instead
    setReadout(null);
    return;
  }
  // Only a member is read: the one hovered, by its line or its diagram, or the one read on to its
  // end at a node. Over a load, a node or nothing, the editor's hover says what it is.
  const only = atNode?.member ?? (atNode ? null : (props.member ?? null));
  if (only === null) {
    setReadout(null);
    return;
  }
  const model = { ...props.model, members: props.model.members.filter((m) => m.id === only) };
  setReadout(readoutAt(model, t.value, p.x, p.y, Infinity, readQuantities.value));
};

/** Shows a readout, keeping count of how long its member has been read without a break */
const setReadout = (r: Readout | null) => {
  if (!r) reading = null;
  else if (reading?.member !== r.member) reading = { member: r.member, x: last?.clientX ?? 0, y: last?.clientY ?? 0 };
  readout.value = r;
};
/*
 * Travelling: the pointer crossing the drawing on its way somewhere - to the toolbar, to another
 * member - is not reading what it passes over, and bringing each thing forward as it goes by only
 * flickers. Nothing is read until it slows down, or stops for a moment.
 */
let travelling = false;
let settle = 0;
const setTravelling = (on: boolean) => {
  if (on === travelling) return;
  travelling = on;
  emit('travelling', on);
};

const onMove = (e: PointerEvent) => {
  last = e;
  trail.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
  while (trail.length > 2 && e.timeStamp - trail[0].t > MOTION_MS) trail.shift();
  const v = pointerMotion(trail);
  clearTimeout(settle);
  if (Math.hypot(v.x, v.y) > FAST) {
    setTravelling(true);
    // Stopped moving altogether: then it is reading after all
    settle = window.setTimeout(() => {
      setTravelling(false);
      if (!frame) frame = requestAnimationFrame(read);
    }, MOTION_MS);
  } else setTravelling(false);
  if (!frame) frame = requestAnimationFrame(read);
};
const onLeave = () => {
  clearTimeout(settle);
  setTravelling(false);
  last = null;
  atNode = null;
  reading = null;
  clearTimeout(dwell);
  trail.length = 0;
  cancelAnimationFrame(frame);
  frame = 0;
  readout.value = null;
};
let svg: SVGSVGElement | null = null;
onMounted(() => {
  svg = root.value?.ownerSVGElement ?? null;
  svg?.addEventListener('pointermove', onMove, { passive: true });
  svg?.addEventListener('pointerleave', onLeave, { passive: true });
});
onBeforeUnmount(() => {
  svg?.removeEventListener('pointermove', onMove);
  svg?.removeEventListener('pointerleave', onLeave);
  cancelAnimationFrame(frame);
  clearTimeout(dwell);
  clearTimeout(settle);
});

/* ── What to draw ────────────────────────────────────────────────────────────────────────── */
const sides = computed(() => {
  const style = props.diagramStyle;
  return {
    N: diagramSide('N', style.momentOnTensionSide, style),
    V: diagramSide('V', style.momentOnTensionSide, style),
    M: diagramSide('M', style.momentOnTensionSide, style),
  };
});

const view = computed(() => {
  const r = readout.value;
  if (!r) return null;
  const m = props.model.members.find((member) => member.id === r.member);
  if (!m) return null;
  const f = memberFrame(props.model, m, nodeMap(props.model));
  const ends = [
    project(t.value, { x: f.x, z: f.z, dx: 0, dy: 0 }),
    project(t.value, { x: f.x + f.tx * f.length, z: f.z + f.tz * f.length, dx: 0, dy: 0 }),
  ] as const;
  const marks = readoutMarks(props.model, t.value, r, readQuantities.value, props.k, sides.value);
  // One tag a quantity, at its farther tip where a step has two
  const readings = readQuantities.value.flatMap((q) => {
    const own = marks.filter((mk) => mk.tone === TONE[q]);
    if (own.length === 0) return [];
    const mark = own.reduce((a, b) =>
      Math.hypot(b.to[0] - b.from[0], b.to[1] - b.from[1]) > Math.hypot(a.to[0] - a.from[0], a.to[1] - a.from[1])
        ? b
        : a
    );
    const write = q === 'w' ? props.displacementText : undefined;
    return [{ mark, text: formatReadout(r, q, props.units, props.numberFormat, write) }];
  });
  const station = `${r.member}, x = ${new Intl.NumberFormat(props.numberFormat.resolvedOptions().locale, {
    maximumFractionDigits: 2,
  }).format(r.x * props.units.length.scale)} ${props.units.length.symbol}`;
  const tags = placeReadoutTags(readings, station, ends, [r.px, r.py], props.fontSize - 1, viewport.value);
  // A tag stepped out past other tags gets a thin line back to its point
  const leaders = tags.flatMap((tag) => {
    const nx = Math.min(Math.max(tag.at[0], tag.x), tag.x + tag.w);
    const ny = Math.min(Math.max(tag.at[1], tag.y), tag.y + tag.h);
    return Math.hypot(nx - tag.at[0], ny - tag.at[1]) > 12
      ? [{ tone: tag.tone, from: tag.at, to: [nx, ny] as const }]
      : [];
  });
  return { r, marks, tags, leaders };
});

// An edit, undo or a tool taken up under a resting pointer: the values read were the old model's.
// They go; the next move of the pointer reads the new one.
watch(
  () => [props.model, props.k, props.enabled] as const,
  () => (readout.value = null)
);

// The editor's own tooltip for the member gives way while the values show
watch(
  () => view.value !== null,
  (reading) => emit('reading', reading)
);
onBeforeUnmount(() => emit('reading', false));

const TONE: Record<ReadoutQuantity, Tone> = { N: 'normal', V: 'shear', M: 'moment', w: 'deformed' };
const colour = (tone: Tone | 'paper') => `var(--ebp-${tone})`;
</script>

<template>
  <g ref="root" class="plot-readout" pointer-events="none">
    <template v-if="view">
      <!-- Each value's ordinate, from the member point to the tip it is read at -->
      <line
        v-for="(m, i) in view.marks"
        :key="`l${i}`"
        :x1="m.from[0]"
        :y1="m.from[1]"
        :x2="m.to[0]"
        :y2="m.to[1]"
        :stroke="colour(m.tone)"
        stroke-width="2"
      />
      <line
        v-for="(l, i) in view.leaders"
        :key="`k${i}`"
        :x1="l.from[0]"
        :y1="l.from[1]"
        :x2="l.to[0]"
        :y2="l.to[1]"
        :stroke="colour(l.tone)"
        stroke-width="1"
        stroke-opacity="0.6"
      />
      <circle :cx="view.r.px" :cy="view.r.py" r="3" :fill="colour('ink')" />
      <circle
        v-for="(m, i) in view.marks"
        :key="`d${i}`"
        :cx="m.to[0]"
        :cy="m.to[1]"
        r="4"
        :fill="colour(m.tone)"
        :stroke="colour('paper')"
        stroke-width="1.5"
      />
      <g v-for="(tag, i) in view.tags" :key="`t${i}`">
        <rect
          :x="tag.x"
          :y="tag.y"
          :width="tag.w"
          :height="tag.h"
          rx="5"
          :fill="colour('paper')"
          :stroke="colour(tag.tone)"
          stroke-opacity="0.6"
        />
        <text
          :x="tag.x + 6"
          :y="tag.y + tag.h / 2 + (fontSize - 1) * 0.35"
          :fill="colour(tag.tone)"
          :font-size="fontSize - 1"
          font-weight="600"
          class="ebp-nohalo"
        >
          <!-- A power of ten's exponent raised, as a superscript (see textRuns) -->
          <tspan v-for="(r, j) in textRuns(tag.text, fontSize - 1)" :key="j" :font-size="r.size" :dy="r.dy">{{
            r.text
          }}</tspan>
        </text>
      </g>
    </template>
  </g>
</template>
