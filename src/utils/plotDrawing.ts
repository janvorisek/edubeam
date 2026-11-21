/**
 * How the editor draws with @edubeam/plot: its symbols, labels and settings in plot's terms.
 *
 * Shared by the canvas (PlotPicture) and by every picture drawn once and kept: the Appearance
 * preview, the image export and the thumbnails. They all look alike because they are all built here.
 */
import { toRaw } from 'vue';
import {
  BeamConcentratedLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  DofID,
  type BeamElementLoad,
  type Node,
} from '@edubeam/fem';
import {
  alternativeResultGroups,
  buildStructureScene,
  fitScene,
  layoutStructure,
  innerBreaks,
  memberFrame,
  mergePaths,
  modelFromSolver,
  nodeMap,
  pieceExtrema,
  formatNumber,
  resolveScene,
  project,
  sceneSvg,
  RESULT_LAYERS,
  type Anchor,
  type Fit,
  type PlotLayer,
  type PlotLoad,
  type PlotModel,
  type PlotNode,
  type ResolveOptions,
  type ResolvedPath,
  type ResolvedScene,
  type SceneItem,
  type StructureSceneOptions,
  type SymbolSizes,
  type Tone,
  type Transform,
  type Units,
} from '@edubeam/plot';
import type { DiagramStyle } from '@/utils/diagramStyle';
import { formatResultAsText } from '@/utils/numberDisplay';

/**
 * What of a model can be drawn: an element naming a node that is gone (saved by a version that let
 * one through, or in an old link) is left out with its loads and results, as the editor's own
 * drawing leaves it out, rather than failing the whole picture. So is a load on nothing.
 */
export const drawablePart = (model: PlotModel): PlotModel => {
  const nodes = new Set(model.nodes.map((n) => n.id));
  const members = model.members.filter((m) => nodes.has(m.start) && nodes.has(m.end));
  const kept = new Set(members.map((m) => m.id));
  const loads = model.loads.filter((l) => ('member' in l ? kept.has(l.member) : nodes.has(l.node)));
  if (members.length === model.members.length && loads.length === model.loads.length) return model;
  return {
    nodes: model.nodes,
    members,
    loads,
    results: model.results && {
      ...model.results,
      members: Object.fromEntries(Object.entries(model.results.members).filter(([id]) => kept.has(id))),
    },
  };
};

type PlotSolver = Parameters<typeof modelFromSolver>[0];

/** The editor's model as plot draws it; throws on a model plot cannot read */
export const readEditorModel = (solver: object): PlotModel =>
  // The raw solver: plot reads it once, it need not be tracked. Plot types it from its own copy of
  // @edubeam/fem, the same package deduplicated by the build.
  drawablePart(modelFromSolver(toRaw(solver) as unknown as PlotSolver));

/** The node squares as the editor has always drawn them, px */
export const NODE_SIZE = 6;

/**
 * The editor's symbols, px: light member lines under the diagrams and hit strokes, one short arrow
 * for loads and reactions alike, and a moment, load or reaction, as the editor's nearly closed ring.
 */
export const EDITOR_SIZES = {
  member: 2,
  pointShaft: 1.75,
  pointHead: 9,
  pointHeadWidth: 9,
  pointArrow: 36,
  reaction: 36,
  reactionShaft: 1.75,
  reactionHead: 9,
  reactionHeadWidth: 9,
  arc: 17,
  arcSweep: 292,
  arcWidth: 1.25,
  // The same head as every other arrow
  arcHead: 9,
  arcHeadHalf: 4.5,
  reactionArc: 17,
  reactionArcSweep: 292,
  // Close in, as the editor has always drawn them: a reaction's arrow just past its support
  // symbol, a node's name just off the node (or off a moment's ring round it)
  reactionGap: 3,
  reactionArcGap: 4,
  nodeLabelGap: 7,
  arcLabelGap: 22,
  arcLabelFirst: 7,
} as const satisfies Partial<SymbolSizes>;

/** The editor's colours, by name */
export interface EditorColors {
  readonly normalForce: string;
  readonly shearForce: string;
  readonly bendingMoment: string;
  readonly deformedShape: string;
  readonly loads: string;
  readonly reactions: string;
}

/** The editor's colours as plot's tones */
export const editorTones = (c: EditorColors): Partial<Record<Tone | 'paper', string>> => ({
  ink: '#000000',
  paper: '#ffffff',
  muted: '#666666',
  normal: c.normalForce,
  shear: c.shearForce,
  moment: c.bendingMoment,
  deformed: c.deformedShape,
  load: c.loads,
  reaction: c.reactions,
  tension: c.bendingMoment,
  compression: c.normalForce,
});

/** The Appearance and unit settings a drawing follows */
export interface EditorLook {
  readonly units: Units;
  readonly numberFormat: Intl.NumberFormat;
  /** The loads' values: given, so without the zeros results keep; `numberFormat` when left out */
  readonly loadNumberFormat?: Intl.NumberFormat;
  /** Written as the editor writes a displacement, see `displacementWriter` */
  readonly displacementText: (value: number) => string;
  readonly fontSize: number;
  /** The largest value of a diagram, px */
  readonly resultsScalePx: number;
  readonly diagramStyle: Readonly<DiagramStyle>;
  readonly supportSize: number;
  readonly resultLabelMode: 'axis' | 'horizontal';
}

/** The layers the editor's switches show */
export interface EditorLayerSwitches {
  readonly supports: boolean;
  readonly loads: boolean;
  readonly reactions: boolean;
  readonly nodeLabels: boolean;
  readonly memberLabels: boolean;
  readonly normalForce: boolean;
  readonly shearForce: boolean;
  readonly bendingMoment: boolean;
  readonly deformedShape: boolean;
}

export const editorLayers = (on: EditorLayerSwitches): ReadonlySet<PlotLayer> => {
  const layers: PlotLayer[] = ['members'];
  if (on.supports) layers.push('supports');
  if (on.loads) layers.push('loads');
  if (on.reactions) layers.push('reactions');
  if (on.nodeLabels) layers.push('nodeLabels');
  if (on.memberLabels) layers.push('memberLabels');
  if (on.normalForce) layers.push('N');
  if (on.shearForce) layers.push('V');
  if (on.bendingMoment) layers.push('M');
  if (on.deformedShape) layers.push('w');
  return new Set(layers);
};

/**
 * A displacement as the editor writes one: the labels' two decimals between 0.01 and 1000, and a
 * power of ten outside, in the user's style (engineering keeps it a multiple of three), where two
 * decimals would write a deflection of a few millimetres in metres as 0.00.
 */
export const displacementWriter =
  (format: Intl.NumberFormat, numberStyle: string) =>
  (value: number): string => {
    const magnitude = Math.abs(value);
    return value === 0 || (magnitude >= 0.01 && magnitude <= 1000)
      ? format.format(value)
      : formatResultAsText(value, numberStyle === 'engineering' ? 'engineering' : 'scientific', format);
  };

/** Each diagram's px per SI unit; left out, each diagram's largest value is drawn at the results scale */
export type DiagramScales = StructureSceneOptions['diagramScale'];

/** The scene options of an editor drawing at a scale, px per metre */
export const editorSceneOptions = (
  look: EditorLook,
  layers: ReadonlySet<PlotLayer>,
  scale: number,
  diagramScale?: DiagramScales
): StructureSceneOptions => ({
  layers,
  compact: false,
  sizes: EDITOR_SIZES,
  // Loads as the editor annotates them: bare numbers (the units are in the corner), a distributed
  // load at both ends
  loadLabels: 'ends',
  // and a constant diagram at both ends too, as students annotate every segment
  constantDiagrams: 'ends',
  // and a corner's moment at each member's end
  cornerValues: 'each',
  // A busy editor view: labels keep off the supports, and values may stand further aside
  labelsAvoidSupports: true,
  // A load's two components as the two loads they were entered as
  splitLoads: true,
  // Nodes are placed before they are connected, and must be seen to be connected
  freeNodes: true,
  // Where it moves most, marked as a student marks w_max
  displacementMarker: true,
  // and each maximum inside a member with its ordinate
  extremeOrdinates: true,
  // Two values on one ordinate line side by side, not one pushed out
  sideBySide: true,
  units: look.units,
  numberFormat: look.numberFormat,
  loadNumberFormat: look.loadNumberFormat,
  displacementText: look.displacementText,
  scale,
  diagramSize: look.resultsScalePx,
  deformedSize: look.resultsScalePx,
  diagramScale,
  momentOnTensionSide: look.diagramStyle.momentOnTensionSide,
  normalOnDashedSide: look.diagramStyle.normalOnDashedSide,
  shearOnDashedSide: look.diagramStyle.shearOnDashedSide,
  diagramFill: look.diagramStyle.fill,
  showDegrees: look.diagramStyle.showDegrees,
  supportScale: look.supportSize,
  fontSize: look.fontSize,
  resultLabelMode: look.resultLabelMode,
});

const YIELDING_GROUPS: ReadonlySet<string> = new Set(['loads']);

/** Labels placed after the given data, and left out when crowded */
const LATE_GROUPS: ReadonlySet<string> = new Set([...RESULT_LAYERS, 'memberLabels']);

/** How the editor's labels are placed */
export const editorResolveOptions = (look: EditorLook, shown: ReadonlySet<PlotLayer>): ResolveOptions => ({
  fontSize: look.fontSize,
  alternativeGroups: alternativeResultGroups(shown),
  shields: new Set<string>(RESULT_LAYERS.filter((q) => shown.has(q))),
  // Loads, reactions and names first; the results and the members' names take what is left
  lateGroups: LATE_GROUPS,
  // The internal forces' values come before the loads': a load's band does not push them away, and
  // its values stand outside it
  yieldingGroups: YIELDING_GROUPS,
  // and are never left out
  keptGroups: YIELDING_GROUPS,
});

/** A node square as a path, so a file writes it with the rest */
const nodeSquare = (x: number, y: number): ResolvedPath => ({
  group: 'nodes',
  d: `M${x - NODE_SIZE / 2} ${y - NODE_SIZE / 2}h${NODE_SIZE}v${NODE_SIZE}h${-NODE_SIZE}Z`,
  layer: 0,
  tone: 'ink',
  width: 0,
  fill: 'tone',
});

export interface FigureBox {
  /** px */
  readonly width: number;
  /** px */
  readonly height: number;
  /** Kept clear along every edge, px */
  readonly padding: number;
}

export interface EditorFigure {
  readonly fit: Fit;
  /** What is painted, alike paths merged, the node squares among them */
  readonly scene: Pick<ResolvedScene, 'paths' | 'circles' | 'texts'>;
}

/**
 * The model drawn as large as it fits a box, centred. The fit makes room for `reserve` too, so a
 * picture that switches between diagrams keeps its scale.
 */
export const editorFigure = (
  model: PlotModel,
  look: EditorLook,
  shown: ReadonlySet<PlotLayer>,
  box: FigureBox,
  reserve: readonly PlotLayer[] = [],
  diagramScale?: DiagramScales
): EditorFigure => {
  const fit = editorFit(model, look, new Set([...shown, ...reserve]), box, { diagramScale });
  return { fit, scene: editorScene(model, look, shown, fit, diagramScale, fit) };
};

/**
 * The share of its own room the structure keeps however much is drawn around it: below it, what
 * reaches past the box is let run over its edges, evenly, rather than shrink the structure to a dot.
 * An image export says so (see its overflow).
 */
const MIN_STRUCTURE_SHARE = 0.5;

export interface FitOptions {
  /** Points of whatever the caller draws beside the model, which must be in view too */
  readonly extra?: readonly Anchor[];
  readonly diagramScale?: DiagramScales;
  /**
   * The drawing is fitted as if it were at least this much as tall as wide, and as wide as tall: a
   * straight beam has no height, and fitted exactly it would run from edge to edge.
   */
  readonly minAspect?: number;
}

/**
 * The largest scale at which the model drawn with `layers`, and the `extra` points, fit a box,
 * centred in it - but never less than `MIN_STRUCTURE_SHARE` of the scale at which the members and
 * the extra points alone would fill it.
 */
export const editorFit = (
  model: PlotModel,
  look: EditorLook,
  layers: ReadonlySet<PlotLayer>,
  box: FigureBox,
  { extra = [], diagramScale, minAspect = 0 }: FitOptions = {}
): Fit => {
  const marks = extra.map((at): SceneItem => ({
    kind: 'circle',
    group: 'extra',
    layer: 0,
    at,
    r: 0,
    tone: 'ink',
    width: 0,
    fill: 'tone',
  }));
  const items = [...buildStructureScene(model, editorSceneOptions(look, layers, 1, diagramScale)), ...marks];
  // The room the drawing may take: no wider than its height allows at the least aspect, nor taller
  const innerW = Math.max(1, box.width - 2 * box.padding);
  const innerH = Math.max(1, box.height - 2 * box.padding);
  const room = {
    width: (minAspect > 0 ? Math.min(innerW, innerH / minAspect) : innerW) + 2 * box.padding,
    height: (minAspect > 0 ? Math.min(innerH, innerW / minAspect) : innerH) + 2 * box.padding,
    padding: box.padding,
    fontSize: look.fontSize,
  };
  // A model with no extent (one node, or none): nothing measures a scale, which a fit would grow
  // without end; a nominal span instead, as the classic drawing's fit takes
  const points = [...model.nodes.map((n) => ({ x: n.x, z: n.z })), ...extra];
  const extent = Math.max(
    0,
    Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x)),
    Math.max(...points.map((p) => p.z)) - Math.min(...points.map((p) => p.z))
  );
  if (!(extent > 1e-9)) {
    return editorCentred(model, look, layers, Math.min(innerW, innerH) / NOMINAL_SPAN_M, box, { extra, diagramScale });
  }
  const fit = fitScene(items, room);
  // What the caller draws beside the model is never let run over: it is as much the figure
  const members = buildStructureScene(model, editorSceneOptions(look, new Set<PlotLayer>(['members']), 1));
  const floor = MIN_STRUCTURE_SHARE * fitScene([...members, ...marks], room).s;
  return editorCentred(model, look, layers, Math.max(fit.s, floor), box, { extra, diagramScale });
};

/** The span a model with no extent is shown at, m: as the classic drawing's fit (fitBounds) */
const NOMINAL_SPAN_M = 10;

/**
 * The model drawn at a scale, centred in a box on what is painted, labels where they are placed (a
 * fit places them at their first places, and some end up at others or are left out), and on the
 * `extra` points.
 */
export const editorCentred = (
  model: PlotModel,
  look: EditorLook,
  layers: ReadonlySet<PlotLayer>,
  scale: number,
  box: { readonly width: number; readonly height: number },
  { extra = [], diagramScale }: Pick<FitOptions, 'extra' | 'diagramScale'> = {}
): Fit => {
  const t = { s: scale, tx: 0, ty: 0 };
  const placed = resolveScene(
    buildStructureScene(model, editorSceneOptions(look, layers, scale, diagramScale)),
    t,
    editorResolveOptions(look, layers)
  ).bounds;
  // Nothing painted (a lone node with its labels off) leaves the bounds infinite: on its nodes then
  const nodes = model.nodes.map((n) => project(t, { x: n.x, z: n.z, dx: 0, dy: 0 }));
  const finite = (v: number) => Number.isFinite(v);
  const xs = [placed.minX, placed.maxX, ...extra.map((a) => project(t, a)[0])].filter(finite);
  const ys = [placed.minY, placed.maxY, ...extra.map((a) => project(t, a)[1])].filter(finite);
  if (xs.length === 0) xs.push(...nodes.map(([x]) => x));
  if (ys.length === 0) ys.push(...nodes.map(([, y]) => y));
  const middle = (vs: readonly number[]) => (vs.length === 0 ? 0 : (Math.min(...vs) + Math.max(...vs)) / 2);
  return {
    s: scale,
    tx: box.width / 2 - middle(xs),
    ty: box.height / 2 - middle(ys),
    width: box.width,
    height: box.height,
  };
};

/** How far a dimension line's value stands off its line, px (see Dimensioning) */
const DIMENSION_LABEL_PX = 10;

/**
 * What a fit must keep in view of the editor's dimension lines: their two ends, offset by their
 * distance (metres), and their value a little further out.
 */
export const dimensionAnchors = (
  lines: readonly {
    readonly points: readonly { readonly coords: readonly [number, number, number] }[];
    readonly distance: number;
  }[],
  fontSize: number
): Anchor[] =>
  lines.flatMap(({ points, distance }) => {
    const [a, b] = points;
    if (!a || !b) return [];
    const dx = b.coords[0] - a.coords[0];
    const dz = b.coords[2] - a.coords[2];
    const length = Math.hypot(dx, dz);
    if (!(length > 0)) return [];
    // As Dimensioning draws it: the line `distance` against its normal, the value a little along it
    const nx = dz / length;
    const nz = -dx / length;
    const ox = -nx * distance;
    const oz = -nz * distance;
    const out = DIMENSION_LABEL_PX + fontSize;
    return [
      { x: a.coords[0] + ox, z: a.coords[2] + oz, dx: 0, dy: 0 },
      { x: b.coords[0] + ox, z: b.coords[2] + oz, dx: 0, dy: 0 },
      { x: (a.coords[0] + b.coords[0]) / 2 + ox, z: (a.coords[2] + b.coords[2]) / 2 + oz, dx: nx * out, dy: nz * out },
    ];
  });

/**
 * What is painted of the model drawn with a transform, px: alike paths merged, a square on every
 * node, no hit areas. Labels that would leave the `viewport` are left out.
 */
export const editorScene = (
  model: PlotModel,
  look: EditorLook,
  shown: ReadonlySet<PlotLayer>,
  transform: Transform,
  diagramScale?: DiagramScales,
  viewport?: { readonly width: number; readonly height: number }
): EditorFigure['scene'] => {
  const items = buildStructureScene(model, editorSceneOptions(look, shown, transform.s, diagramScale));
  const resolved = resolveScene(items, transform, { ...editorResolveOptions(look, shown), viewport });
  const { s, tx, ty } = transform;
  return {
    paths: [
      ...mergePaths(resolved.paths).filter((p) => !p.hitArea),
      ...model.nodes.map((n) => nodeSquare(n.x * s + tx, n.z * s + ty)),
    ],
    // A hinge's circle over its node's square, as the editor paints them (squares, then circles): a
    // file is written layer by layer, and the squares' layer comes after the members' hinges
    circles: resolved.circles.map((c) => (c.group === 'members' ? { ...c, group: 'nodes' } : c)),
    texts: resolved.texts,
  };
};

/**
 * An editor figure as SVG text, to be shown in the page: in the page's own typeface, whichever that
 * is, as every other label in the app. `under` is markup drawn beneath the figure, in its px.
 */
export const editorFigureSvg = (
  figure: EditorFigure,
  look: EditorLook,
  colors: EditorColors,
  options: {
    readonly background?: boolean;
    readonly title?: string;
    readonly under?: string;
    readonly over?: string;
    /**
     * px the drawing and `over` stand lower than the figure's top, which is that much taller: a
     * band above it kept for the figure's title. `under` is not moved, so it can run the full height.
     */
    readonly shift?: number;
  } = {}
): string => {
  const shift = options.shift ?? 0;
  const svg = sceneSvg(
    figure.scene,
    { ...figure.fit, height: figure.fit.height + shift },
    {
      colors: editorTones(colors),
      fontSize: look.fontSize,
      fontFamily: 'inherit',
      background: options.background,
      title: options.title,
    }
  );
  // `under` right after the root element, so all of the figure is above it; `over` last
  const at = svg.indexOf('>') + 1;
  const end = svg.lastIndexOf('</svg>');
  const body = svg.slice(at, end) + (options.over ?? '');
  const moved = shift ? `<g transform="translate(0 ${shift})">${body}</g>` : body;
  return svg.slice(0, at) + (options.under ?? '') + moved + svg.slice(end);
};

/** A guide line across a figure: vertical at `at` px from the left, or horizontal from the top */
export interface GuideLine {
  readonly axis: 'x' | 'y';
  /** px, in the figure */
  readonly at: number;
  /** The largest moment, where the shear is zero: drawn a little stronger */
  readonly extreme: boolean;
}

/**
 * The guide lines a student rules across a sheet to read the figures against each other: through
 * every member end, every step in the shear (a point load, a load's start or end) and every
 * extreme of the moment (where the shear is zero). A horizontal member's run vertically across the
 * figure, a vertical one's horizontally; an inclined member's would only cross the picture.
 */
export const sheetGuides = (model: PlotModel, fit: Fit): GuideLine[] => {
  const lines = new Map<string, GuideLine>();
  const add = (axis: 'x' | 'y', at: number, extreme: boolean) => {
    const key = `${axis}${Math.round(at * 2) / 2}`;
    const had = lines.get(key);
    if (!had || (extreme && !had.extreme)) lines.set(key, { axis, at, extreme });
  };
  const nodes = nodeMap(model);
  for (const m of model.members) {
    const f = memberFrame(model, m, nodes);
    const axis = Math.abs(f.tz) < 0.02 ? 'x' : Math.abs(f.tx) < 0.02 ? 'y' : null;
    if (!axis) continue;
    const r = model.results?.members[m.id];
    const stations = [0, f.length, ...(r ? [...innerBreaks(r.V), ...innerBreaks(r.M)] : [])];
    const extremes = r ? r.M.flatMap(pieceExtrema) : [];
    const px = (x: number) => (axis === 'x' ? (f.x + f.tx * x) * fit.s + fit.tx : (f.z + f.tz * x) * fit.s + fit.ty);
    for (const x of stations) add(axis, px(x), false);
    for (const x of extremes) add(axis, px(x), true);
  }
  return [...lines.values()];
};

/** How far below a figure each row of extreme dimensions sits, px */
const EXTREME_ROW_PX = 18;

/**
 * Where each extreme of the moment lies on a horizontal member: from the member's left end, as a
 * student measures x₀, the point where the shear is zero. Rows of them under the figure, which is
 * grown by `height` px to take them.
 */
export const extremeDimensions = (
  model: PlotModel,
  fit: Fit,
  look: EditorLook
): { readonly markup: string; readonly height: number } => {
  const nodes = nodeMap(model);
  const rows: [number, number][][] = [];
  const parts: string[] = [];
  for (const m of model.members) {
    const f = memberFrame(model, m, nodes);
    const r = model.results?.members[m.id];
    if (!r || Math.abs(f.tz) >= 0.02) continue;
    const px = (x: number) => (f.x + f.tx * x) * fit.s + fit.tx;
    // From the left end, whichever end the member starts at
    const left = f.tx > 0 ? 0 : f.length;
    for (const x of r.M.flatMap(pieceExtrema)) {
      const [a, b] = [px(left), px(x)].sort((p, q) => p - q);
      // The first row it fits in without running into another
      let row = rows.findIndex((taken) => taken.every(([c, d]) => b < c - 4 || a > d + 4));
      if (row === -1) row = rows.push([]) - 1;
      rows[row].push([a, b]);
      parts.push(dimensionMarkup(a, b, fit.height + EXTREME_ROW_PX * (row + 1) - 6, Math.abs(x - left), look));
    }
  }
  return { markup: parts.join(''), height: rows.length * EXTREME_ROW_PX };
};

/**
 * The given structure's sizes along x, as on an exercise sheet: a chain through every node and every
 * point load, and the overall length under it. Under the figure, which is grown by `height` px.
 */
export const chainDimensions = (
  model: PlotModel,
  fit: Fit,
  look: EditorLook
): { readonly markup: string; readonly height: number } => {
  const nodes = nodeMap(model);
  const xs = model.nodes.map((n) => n.x);
  for (const load of model.loads) {
    if (load.kind !== 'pointForce' && load.kind !== 'pointMoment') continue;
    const member = model.members.find((m) => m.id === load.member);
    if (member) {
      const f = memberFrame(model, member, nodes);
      xs.push(f.x + f.tx * load.at);
    }
  }
  const stops = xs.sort((a, b) => a - b).filter((x, i, all) => i === 0 || x - all[i - 1] > 1e-6);
  if (stops.length < 2) return { markup: '', height: 0 };
  const px = (x: number) => x * fit.s + fit.tx;
  const rows = [stops.map((x, i) => [stops[i - 1], x]).slice(1)];
  // The overall length too, where the chain has more than one link
  if (stops.length > 2) rows.push([[stops[0], stops[stops.length - 1]]]);
  const parts = rows.flatMap((links, row) =>
    links.map(([a, b]) => dimensionMarkup(px(a), px(b), fit.height + EXTREME_ROW_PX * (row + 1) - 6, b - a, look))
  );
  return { markup: parts.join(''), height: rows.length * EXTREME_ROW_PX };
};

/** A horizontal dimension, px, as plot draws its own: a thin line, oblique stops, the length over it */
const dimensionMarkup = (a: number, b: number, y: number, metres: number, look: EditorLook): string => {
  const n = (v: number) => Math.round(v * 100) / 100;
  const length = look.units.length;
  const text = `${formatNumber(metres * length.scale, look.numberFormat)} ${length.symbol}`;
  return (
    `<g stroke="#757575" stroke-width="0.75">` +
    `<line x1="${n(a)}" y1="${y}" x2="${n(b)}" y2="${y}"/>` +
    `<line x1="${n(a - 3)}" y1="${y + 3}" x2="${n(a + 3)}" y2="${y - 3}"/>` +
    `<line x1="${n(b - 3)}" y1="${y + 3}" x2="${n(b + 3)}" y2="${y - 3}"/>` +
    `</g>` +
    `<text x="${n((a + b) / 2)}" y="${y - 3}" text-anchor="middle" font-size="${look.fontSize - 2}" fill="#616161">${escapeXml(text)}</text>`
  );
};

/** Text as SVG text content */
const escapeXml = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Guide lines as SVG markup across a figure of the given size: subtle, under everything */
export const guideMarkup = (lines: readonly GuideLine[], size: { readonly width: number; readonly height: number }) =>
  lines
    .map((g) => {
      const at = Math.round(g.at * 100) / 100;
      const [x1, y1, x2, y2] = g.axis === 'x' ? [at, 0, at, size.height] : [0, at, size.width, at];
      const style = g.extreme
        ? 'stroke="#8a8a8a" stroke-width="0.9" stroke-dasharray="5 4"'
        : 'stroke="#b4b4b4" stroke-width="0.75" stroke-dasharray="1.5 3"';
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${style}/>`;
    })
    .join('');

const FREE = { dx: false, dz: false, ry: false } as const;

/**
 * The copied nodes and members alone, as a paste carries them: no loads and no results. A copied
 * member's end nodes come along for its geometry, but only a copied node brings its support.
 */
export const copiedPart = (
  model: PlotModel,
  nodeIds: ReadonlySet<string>,
  memberIds: ReadonlySet<string>
): PlotModel => {
  const members = model.members.filter((m) => memberIds.has(m.id));
  const ends = new Set(members.flatMap((m) => [m.start, m.end]));
  return {
    nodes: model.nodes
      .filter((n) => nodeIds.has(n.id) || ends.has(n.id))
      .map((n) => (nodeIds.has(n.id) ? n : { ...n, fixity: FREE })),
    members,
    loads: [],
  };
};

/**
 * A sheet of figures of one model, as a student draws a homework: the same structure again and
 * again, each figure with its own layers (the loads, then each diagram). Every figure has the same
 * scale and frame, fitted to make room for all of them, so a node is at the same place in each.
 * `box.width` is each figure's; its height follows the structure, up to `box.maxHeight`.
 */
export const editorSheet = (
  model: PlotModel,
  look: EditorLook,
  figures: readonly ReadonlySet<PlotLayer>[],
  box: { readonly width: number; readonly maxHeight: number; readonly padding: number },
  diagramScale?: DiagramScales
): EditorFigure[] => {
  const all = new Set<PlotLayer>(figures.flatMap((layers) => [...layers]));
  const laid = layoutStructure(model, editorSceneOptions(look, all, 1, diagramScale), {
    width: box.width,
    maxHeight: box.maxHeight,
    padding: box.padding,
    fontSize: look.fontSize,
  }).fit;
  // A model with no extent lays out at no size (or at no finite one): fitted as the editor fits it
  const fit =
    Number.isFinite(laid.s) && Number.isFinite(laid.height) && laid.height > 0
      ? laid
      : editorFit(
          model,
          look,
          all,
          { width: box.width, height: box.maxHeight, padding: box.padding },
          { diagramScale }
        );
  return figures.map((layers) => ({ fit, scene: editorScene(model, look, layers, fit, diagramScale, fit) }));
};

/* ── Previews of one node or member, as the dialogs show what they edit ─────────────────────── */

/** A node of the solver as the plot model has it, its support and its axes' turn included */
export const plotNodeOf = (node: Node, id = String(node.label)): PlotNode => ({
  id,
  x: node.coords[0],
  z: node.coords[2],
  fixity: { dx: node.bcs.has(DofID.Dx), dz: node.bcs.has(DofID.Dz), ry: node.bcs.has(DofID.Ry) },
  // As modelFromSolver reads a rotated node
  angle: node.hasLcs() ? Math.atan2(node.lcs[0][2], node.lcs[0][0]) : 0,
});

/** An element load of the solver as the plot model's loads on `member`: a point force and moment are two */
export const plotLoadsOf = (load: BeamElementLoad, member: string): PlotLoad[] => {
  if (load instanceof BeamElementUniformEdgeLoad) {
    const q = { fx: load.values[0] ?? 0, fz: load.values[1] ?? 0 };
    return [{ kind: 'distributed', member, start: q, end: q, local: load.lcs }];
  }
  if (load instanceof BeamElementTrapezoidalEdgeLoad) {
    const [sx, sz] = load.startValues;
    const [ex, ez] = load.endValues;
    return [{ kind: 'distributed', member, start: { fx: sx, fz: sz }, end: { fx: ex, fz: ez }, local: load.lcs }];
  }
  if (load instanceof BeamConcentratedLoad) {
    const [fx = 0, fz = 0, my = 0, at = 0] = load.values;
    return [
      ...(fx !== 0 || fz !== 0 ? [{ kind: 'pointForce', member, at, fx, fz, local: load.lcs } as const] : []),
      ...(my !== 0 ? [{ kind: 'pointMoment', member, at, my } as const] : []),
    ];
  }
  if (load instanceof BeamTemperatureLoad) {
    const [uniform = 0, bottom = 0, top = 0] = load.values;
    return [{ kind: 'temperature', member, uniform, gradient: bottom - top }];
  }
  return [];
};

/**
 * A dimension along a line in a figure: from `a` to `b` (model points), `offset` px to one side,
 * its value turned to read along it. Markup in the figure's px, to lay over it.
 */
export const alignedDimensionMarkup = (
  fit: Transform,
  a: { readonly x: number; readonly z: number },
  b: { readonly x: number; readonly z: number },
  offset: number,
  look: EditorLook
): string => {
  const [ax, ay] = [fit.s * a.x + fit.tx, fit.s * a.z + fit.ty];
  const [bx, by] = [fit.s * b.x + fit.tx, fit.s * b.z + fit.ty];
  const length = Math.hypot(bx - ax, by - ay);
  if (!(length > 1)) return '';
  const [ux, uy] = [(bx - ax) / length, (by - ay) / length];
  const [nx, ny] = [-uy * offset, ux * offset];
  const n = (v: number) => Math.round(v * 100) / 100;
  const tick = (x: number, y: number) =>
    `<line x1="${n(x - 3 * (ux + uy))}" y1="${n(y - 3 * (uy - ux))}" x2="${n(x + 3 * (ux + uy))}" y2="${n(y + 3 * (uy - ux))}"/>`;
  // Read as upright as it goes
  let angle = (Math.atan2(uy, ux) * 180) / Math.PI;
  if (angle > 90) angle -= 180;
  else if (angle <= -90) angle += 180;
  const [mx, my] = [(ax + bx) / 2 + nx, (ay + by) / 2 + ny];
  // The value on the side away from the line it measures
  const away = offset >= 0 ? 1 : -1;
  const r = (angle * Math.PI) / 180;
  const [tx, ty] = [mx + Math.sin(r) * 3 * away, my - Math.cos(r) * 3 * away];
  const metres = Math.hypot(b.x - a.x, b.z - a.z);
  const unit = look.units.length;
  const text = `${formatNumber(metres * unit.scale, look.numberFormat)} ${unit.symbol}`;
  return (
    `<g stroke="#757575" stroke-width="0.75">` +
    `<line x1="${n(ax + nx)}" y1="${n(ay + ny)}" x2="${n(bx + nx)}" y2="${n(by + ny)}"/>` +
    tick(ax + nx, ay + ny) +
    tick(bx + nx, by + ny) +
    `</g>` +
    `<text x="${n(tx)}" y="${n(ty)}" text-anchor="middle" dominant-baseline="${away > 0 ? 'auto' : 'hanging'}" ` +
    `transform="rotate(${n(angle)} ${n(tx)} ${n(ty)})" font-size="${look.fontSize - 2}" fill="#616161">${escapeXml(text)}</text>`
  );
};
