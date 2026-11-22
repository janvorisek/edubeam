<script setup lang="ts">
/**
 * A node cut free, as in a hand calculation. Each member is a stub cut off a little way out, with its
 * bottom fibres, and on its cut face the internal forces in their positive directions: N out of the
 * section, V toward the bottom fibres on the face of a member's start (away from them on its end's),
 * M as the sign convention turns it. Reactions are drawn along their positive axes too; loads, being
 * known, the way they act. Arrows are named by symbols (N₁, V₁, M₁, R_x…), a load by its value. Below,
 * the three sums are written as on paper: in symbols, then with the signed values put in (as in the
 * diagrams), then the result, which is zero.
 *
 * Drawn in pixels, x right and z down as the model; the axis convention changes only the letters and
 * the signs of vertical components in the sums.
 */
import { computed, ref } from 'vue';
import { equilibriumMode as mode } from '@/utils/nodeEquilibrium';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { useViewerStore } from '@/store/viewer';
import { themedColors, useThemeName } from '@/utils/theme';
import { shownNodeEquilibrium, type Vec } from '@/utils/nodeEquilibrium';
import { EDITOR_SIZES } from '@/utils/plotDrawing';

const props = defineProps<{ node: string }>();

const projectStore = useProjectStore();
const appStore = useAppStore();
const viewerStore = useViewerStore();
const themeName = useThemeName();
const colors = computed(() => themedColors(viewerStore.colors, themeName.value));

const equilibrium = computed(() =>
  projectStore.solver.loadCases[0]?.solved ? shownNodeEquilibrium(projectStore.solver, props.node) : null
);

/** Lengths in px */
const STUB = 64;
/** A load's or a reaction's arrow, and every head and ring, as the drawing's (EDITOR_SIZES) */
const ARROW = EDITOR_SIZES.pointArrow + 8;
const GAP = 5;
const JOINT_R = 3;
const HINGE_R = 4.5;
const RING = EDITOR_SIZES.arc;
/** An inclined member's angle, drawn round the node outside a support's moment ring */
/** Close round the node, just past the joint: further out where a moment's ring is round it */
const ANGLE_R = 22;
const LOAD_RING = EDITOR_SIZES.arc;
const REACTION_RING = EDITOR_SIZES.reactionArc;
const HEAD = EDITOR_SIZES.pointHead;
const HEAD_HALF = EDITOR_SIZES.pointHeadWidth / 2;
const SHAFT = EDITOR_SIZES.pointShaft;
const ARC_WIDTH = EDITOR_SIZES.arcWidth + 0.5;
const FONT = 14;
const SUB_FONT = 10;
/** As the drawing: the member's half stroke and a gap, then a thin dashed line on its local +z side */
const FIBRE_OFFSET = 1.25 + 2.5;

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const times = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k];
const angleOf = (a: Vec) => Math.atan2(a[1], a[0]);
const round = (value: number) => Math.round(value * 10) / 10;
const DEG = 180 / Math.PI;

/** Two decimals, as on the drawing; a value that rounds to nothing is a plain 0, never -0 */
const shown = (value: number) => appStore.numberFormatter.format(Math.round(value * 100) / 100 || 0);

/** An angle as written, to two decimals at most: 38.29°, 45° */
const degrees = (radians: number) => `${appStore.loadFormatter.format(Math.round(radians * DEG * 100) / 100)}°`;

type Unit = 'force' | 'moment';
const inUnits = (value: number, unit: Unit) =>
  unit === 'force' ? appStore.convertForce(value) : appStore.convertMoment(value);
const unitLabel = (unit: Unit) => (unit === 'force' ? appStore.units.Force : appStore.units.Moment);

/**
 * One force or moment acting on the node, as drawn. An unknown - a member's N, V or M, a reaction - is
 * drawn in its positive direction (`dir`, or `turn` for a moment, +1 counter-clockwise) and `value` is
 * signed, the diagrams' value: a negative one acts the other way. A load is known: drawn the way it
 * acts, `value` its size, and written by its value rather than a symbol. `slope` is the acute angle
 * from the horizontal of the line it is measured against - its member, or a turned support - so its
 * components read as N₁·cos α.
 */
interface Action {
  readonly key: string;
  readonly letter: string;
  readonly sub: string;
  readonly color: string;
  readonly unit: Unit;
  readonly value: number;
  readonly dir?: Vec;
  readonly turn?: number;
  readonly slope: number;
  readonly known?: boolean;
  /** An inclined member's angle has a name, α₁, drawn at the node and used in the sums */
  readonly angleSub?: string;
}

/** Neither horizontal nor vertical: its components need a cos and a sin */
const inclined = (slope: number) => slope > 1e-9 && slope < Math.PI / 2 - 1e-9;

const slopeOf = (v: Vec) => Math.atan2(Math.abs(v[1]), Math.abs(v[0]));

const actions = computed((): Action[] => {
  const eq = equilibrium.value;
  if (!eq) return [];
  const c = colors.value;
  const list: Action[] = [];

  // Every member's N (out of the section) and V (positive direction on its cut face), and M but at a hinge
  for (const m of eq.members) {
    const slope = slopeOf(m.along);
    const member = { sub: m.label, slope, angleSub: inclined(slope) ? m.label : undefined };
    list.push({
      ...member,
      key: `n${m.label}`,
      letter: 'N',
      color: c.normalForce,
      unit: 'force',
      value: m.n,
      dir: m.along,
    });
    list.push({
      ...member,
      key: `v${m.label}`,
      letter: 'V',
      color: c.shearForce,
      unit: 'force',
      value: m.v,
      dir: m.shearDirection,
    });
    if (!m.hinged) {
      list.push({
        ...member,
        key: `m${m.label}`,
        letter: 'M',
        color: c.bendingMoment,
        unit: 'moment',
        value: m.m,
        turn: m.momentTurn,
      });
    }
  }

  // The vertical axis points down in the model; in the y-up convention a positive reaction points up
  const up = appStore.vertical(1);

  if (eq.load) {
    eq.load.components.forEach((comp, i) => {
      list.push({
        key: `load${i}`,
        letter: 'F',
        sub: '',
        color: c.loads,
        unit: 'force',
        value: Math.abs(comp.value),
        dir: times(comp.direction, Math.sign(comp.value)),
        slope: slopeOf(comp.direction),
        known: true,
      });
    });
    if (eq.load.m !== 0) {
      list.push({
        key: 'loadm',
        letter: 'M',
        sub: '',
        color: c.loads,
        unit: 'moment',
        value: Math.abs(eq.load.m),
        turn: Math.sign(eq.load.m),
        slope: 0,
        known: true,
      });
    }
  }

  if (eq.reaction) {
    eq.reaction.components.forEach((comp, i) => {
      const turned = Math.abs(comp.direction[1]) > 1e-9 && Math.abs(comp.direction[0]) > 1e-9;
      // A turned support's own axes are x' and z'; the one nearer vertical is its z' (or y')
      const vertical = Math.abs(comp.direction[1]) > Math.abs(comp.direction[0]);
      const flip = vertical ? up : 1;
      list.push({
        key: `reaction${i}`,
        letter: 'R',
        sub: (vertical ? appStore.axes.v : 'x') + (turned ? '′' : ''),
        color: c.reactions,
        unit: 'force',
        value: comp.value * flip,
        dir: times(comp.direction, flip),
        slope: slopeOf(comp.direction),
      });
    });
    if (eq.reaction.hasMoment) {
      list.push({
        key: 'reactionm',
        letter: 'M',
        sub: 'R',
        color: c.reactions,
        unit: 'moment',
        value: eq.reaction.m,
        turn: 1,
        slope: 0,
      });
    }
  }

  // A lone moment - one rigid member at an internal hinge, a pinned member end - has nothing to
  // balance it, so it is zero by itself: no ring for it and no moment sum
  const turning = list.filter((a) => a.turn);
  return turning.length < 2 ? list.filter((a) => !a.turn) : list;
});

/* ---------------------------------------------------------------- the figure */

/**
 * The force whose components are shown: while a mouse is over its arrow or its term in a sum; a touch,
 * which has no hover, taps it on and off.
 */
const hovered = ref<string | null>(null);
const toggleHovered = (key: string | undefined) => (hovered.value = hovered.value === key ? null : (key ?? null));

/**
 * The actions as drawn. With values on, an unknown that came out negative is turned round - its arrow
 * the way the force really acts, its value then positive - and every arrow carries its value.
 */
const drawnFor = (which: 'symbols' | 'values'): Action[] =>
  which === 'symbols'
    ? actions.value
    : actions.value.map((a) => {
        const back = !a.known && a.value < 0;
        return {
          ...a,
          known: true,
          value: Math.abs(a.value),
          dir: a.dir && back ? times(a.dir, -1) : a.dir,
          turn: a.turn && back ? -a.turn : a.turn,
        };
      });
const drawn = computed(() => drawnFor(mode.value));

interface Arrow {
  readonly line: readonly [number, number, number, number];
  readonly head: string;
  readonly color: string;
  /** A component of a skewed arrow: light and dashed */
  readonly part?: boolean;
  /** The action it draws, so hovering it can show that one's components */
  readonly key?: string;
}
interface Ring {
  readonly center: Vec;
  readonly radius: number;
  readonly path: string;
  readonly head: string;
  readonly color: string;
}
interface Label {
  readonly at: Vec;
  readonly anchor: 'start' | 'middle' | 'end';
  readonly color: string;
  /** A symbol and its subscript, or plain text */
  readonly letter?: string;
  readonly sub?: string;
  readonly text?: string;
  /** Degrees about `at`, a member's name along its member */
  readonly rotate?: number;
  /** The node's name, semi-bold as in the drawing */
  readonly bold?: boolean;
  /** The way it was placed out from what it names, the way it moves when something is in its place */
  readonly out?: Vec;
  /** After the symbol, a component's cos or sin: of its angle by name (α₁) or in degrees */
  readonly factor?: { readonly fn: 'cos' | 'sin'; readonly sub?: string; readonly degrees: string };
  /** A component's: lighter, as its dashed arrow, and only while its force is hovered */
  readonly part?: boolean;
  readonly key?: string;
  /** Other places for it, tried before it is moved: where it goes and how it is anchored there */
  readonly instead?: readonly { readonly at: Vec; readonly anchor: Label['anchor'] }[];
}

const pointsOf = (points: readonly Vec[]) => points.map((p) => `${round(p[0])},${round(p[1])}`).join(' ');

const headAt = (tip: Vec, toward: Vec) => {
  const back = add(tip, times(toward, -HEAD));
  const side: Vec = [-toward[1] * HEAD_HALF, toward[0] * HEAD_HALF];
  return pointsOf([tip, add(back, side), add(back, times(side, -1))]);
};

const arrow = (from: Vec, to: Vec, color: string): Arrow => {
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const unit: Vec = [(to[0] - from[0]) / length, (to[1] - from[1]) / length];
  // The shaft stops under the head, so a wide stroke does not show past its point
  const end = add(to, times(unit, -HEAD + 1));
  return { line: [round(from[0]), round(from[1]), round(end[0]), round(end[1])], head: headAt(to, unit), color };
};

/**
 * A force, and for one at a slant its horizontal and vertical components too, from its tail: the two
 * sides of the rectangle it is the diagonal of, which its cos and sin give. From the tail rather than
 * at the cut, where they would pile onto the other arrows. Each component is named as in the sums
 * (N₁·cos α₁), or with values on carries its size.
 */
const withParts = (from: Vec, to: Vec, a: Action): { arrows: Arrow[]; labels: Label[] } => {
  const main = { ...arrow(from, to, a.color), key: a.key };
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const length = Math.hypot(dx, dz);
  const skewed = Math.abs(dx) > 1e-6 * length && Math.abs(dz) > 1e-6 * length;
  if (!skewed) return { arrows: [main], labels: [] };
  const arrows: Arrow[] = [];
  const labels: Label[] = [];
  for (const part of [
    [dx, 0],
    [0, dz],
  ] as Vec[]) {
    const size = Math.hypot(part[0], part[1]);
    if (size <= HEAD + 3) continue;
    const end = add(from, part);
    arrows.push({ ...arrow(from, end, a.color), part: true, key: a.key });
    const share = size / length;
    const fn = Math.abs(share - Math.cos(a.slope)) <= Math.abs(share - Math.sin(a.slope)) ? 'cos' : 'sin';
    const out: Vec = [part[0] / size, part[1] / size];
    const at = add(end, times(out, 7));
    const base = {
      at: [round(at[0]), round(at[1] + FONT * 0.35)] as Vec,
      anchor: anchorFor(out),
      color: a.color,
      out,
      key: a.key,
    };
    labels.push(
      a.known
        ? { ...base, part: true, text: shown(inUnits(Math.abs(a.value) * share, a.unit)) }
        : {
            ...base,
            part: true,
            letter: a.letter,
            sub: a.sub,
            factor: { fn, sub: a.angleSub, degrees: degrees(a.slope) },
          }
    );
  }
  return { arrows: [...arrows, main], labels };
};

/**
 * A moment as the drawing's ring (@edubeam/plot's momentArc): a 292° arc around `center` open toward
 * `opening`, its head astride the arc's end so it follows the turn. Positive turns counter-clockwise
 * on screen, which in the drawing's y-down coordinates runs from the larger angle to the smaller.
 */
const ring = (center: Vec, radius: number, opening: number, turn: number, color: string): Ring => {
  const middle = opening + Math.PI;
  const half = ((EDITOR_SIZES.arcSweep / 2) * Math.PI) / 180;
  const ccw = turn > 0;
  const a0 = ccw ? middle + half : middle - half;
  const a1 = ccw ? middle - half : middle + half;
  const point = (angle: number): Vec => add(center, [radius * Math.cos(angle), radius * Math.sin(angle)]);
  const p0 = point(a0);
  const p1 = point(a1);
  const tangent: Vec = ccw ? [Math.sin(a1), -Math.cos(a1)] : [-Math.sin(a1), Math.cos(a1)];
  const head = EDITOR_SIZES.arcHead;
  const base = add(p1, times(tangent, -head * 0.6));
  const tip = add(base, times(tangent, head));
  const side: Vec = [-tangent[1] * EDITOR_SIZES.arcHeadHalf, tangent[0] * EDITOR_SIZES.arcHeadHalf];
  return {
    center,
    radius,
    path: `M ${round(p0[0])} ${round(p0[1])} A ${radius} ${radius} 0 1 ${ccw ? 0 : 1} ${round(p1[0])} ${round(p1[1])}`,
    head: pointsOf([tip, add(base, side), add(base, times(side, -1))]),
    color,
  };
};

/** An angle in degrees turned to read left to right: within (-90, 90] */
const upright = (degrees: number) => {
  const a = ((degrees % 360) + 360) % 360;
  return a > 90 && a <= 270 ? a - 180 : a > 270 ? a - 360 : a;
};

const anchorFor = (outward: Vec): Label['anchor'] =>
  outward[0] > 0.35 ? 'start' : outward[0] < -0.35 ? 'end' : 'middle';

/** A label out from a point along `outward`, anchored so it grows away from what it names */
const labelFor = (a: Action, at: Vec, outward: Vec, shaft?: readonly [Vec, Vec]): Label => {
  // Beside its arrow, halfway along, on either side: as plainly its own, when its tip is crowded
  const instead = shaft
    ? [1, -1].map((sideSign) => {
        const [p, q] = shaft;
        const length = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
        const normal: Vec = [(-(q[1] - p[1]) / length) * sideSign, ((q[0] - p[0]) / length) * sideSign];
        const mid = times(add(p, q), 0.5);
        const spot = add(mid, times(normal, 8));
        return { at: [round(spot[0]), round(spot[1] + FONT * 0.35)] as Vec, anchor: anchorFor(normal) };
      })
    : undefined;
  const base = {
    at: [round(at[0]), round(at[1] + FONT * 0.35)] as Vec,
    anchor: anchorFor(outward),
    color: a.color,
    out: outward,
    instead,
  };
  return a.known ? { ...base, text: shown(inUnits(a.value, a.unit)) } : { ...base, letter: a.letter, sub: a.sub };
};

const labelWidth = (l: Label) =>
  l.text
    ? l.text.length * FONT * 0.55
    : (l.letter?.length ?? 0) * FONT * 0.65 +
      (l.sub?.length ?? 0) * SUB_FONT * 0.6 +
      (l.factor ? FONT * 2.6 + (l.factor.sub ? FONT * 0.65 + l.factor.sub.length * SUB_FONT * 0.6 : FONT * 3.2) : 0);

/** How far, in angle, `angle` is from the nearest of `taken` */
const clearance = (angle: number, taken: readonly number[]) =>
  Math.min(
    Math.PI,
    ...taken.map((t) => {
      const d = Math.abs(angle - t) % (2 * Math.PI);
      return d > Math.PI ? 2 * Math.PI - d : d;
    })
  );

interface Box {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

/** A label's box, its text's width by an estimate; a member's name, turned along it, as a square */
const boxOf = (l: Label): Box => {
  const width = labelWidth(l);
  if (l.rotate !== undefined) {
    const r = Math.max(width, FONT) / 2;
    return { left: l.at[0] - r, top: l.at[1] - r, right: l.at[0] + r, bottom: l.at[1] + r };
  }
  const left = l.anchor === 'start' ? l.at[0] : l.anchor === 'end' ? l.at[0] - width : l.at[0] - width / 2;
  return { left, top: l.at[1] - FONT * 0.85, right: left + width, bottom: l.at[1] + FONT * 0.25 };
};

const PAD = 2;
const overlaps = (a: Box, b: Box) =>
  a.left < b.right + PAD && b.left < a.right + PAD && a.top < b.bottom + PAD && b.top < a.bottom + PAD;
const inBox = (p: Vec, b: Box) =>
  p[0] > b.left - PAD && p[0] < b.right + PAD && p[1] > b.top - PAD && p[1] < b.bottom + PAD;

/** Whether a segment runs through a box: sampled every couple of px, plenty for these short ones */
const crosses = (from: Vec, to: Vec, b: Box) => {
  const steps = Math.max(1, Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) / 2));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    if (inBox([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t], b)) return true;
  }
  return false;
};

/**
 * Labels moved clear of each other and of what is drawn: each in turn, where it was put if that is
 * free, else a few px further out along its own direction, then to either side of that.
 */
const placeClear = (
  labels: readonly Label[],
  segments: readonly (readonly [Vec, Vec])[],
  circles: readonly { center: Vec; r: number }[],
  fixed: readonly Box[] = []
): Label[] => {
  const placed: Box[] = [...fixed];
  // How much is in the way of a box: another label most of all - two numbers on top of each other
  // cannot be read - then arrows, rings and stubs
  const conflicts = (b: Box) =>
    placed.filter((p) => overlaps(p, b)).length * 5 +
    segments.filter(([from, to]) => crosses(from, to, b)).length +
    circles.filter(({ center, r }) =>
      overlaps(b, { left: center[0] - r, top: center[1] - r, right: center[0] + r, bottom: center[1] + r })
    ).length;
  return labels.map((l) => {
    const out = l.out ?? [0, -1];
    const side: Vec = [-out[1], out[0]];
    // A label far from its arrow is unclear: short moves, and every px counts against them, so one
    // goes further only to get off another label
    const moves: Vec[] = [[0, 0]];
    for (const along of [0, 4, 8, 12, 18, 24]) {
      for (const across of [0, 5, -5, 10, -10, 16, -16, 22, -22, 30, -30]) {
        if (along || across) moves.push(add(times(out, along), times(side, across)));
      }
    }
    const candidates = [
      ...moves.map((by) => ({ label: shifted(l, by), distance: Math.hypot(by[0], by[1]) })),
      ...(l.instead ?? []).map((other) => ({ label: { ...l, ...other }, distance: 12 })),
    ];
    let best = candidates[0];
    let lowest = Infinity;
    for (const c of candidates) {
      // Another label in the way matters most, a line through it less, the distance moved least
      const cost = conflicts(boxOf(c.label)) * 10 + c.distance;
      if (cost < lowest) {
        best = c;
        lowest = cost;
      }
    }
    placed.push(boxOf(best.label));
    return best.label;
  });
};

const shifted = (l: Label, by: Vec): Label => ({ ...l, at: [round(l.at[0] + by[0]), round(l.at[1] + by[1])] });

const layout = (which: 'symbols' | 'values') => {
  const eq = equilibrium.value;
  if (!eq) return null;
  const shownActions = drawnFor(which);

  const byKey = new Map(shownActions.map((a) => [a.key, a]));
  const allHinged = eq.members.every((m) => m.hinged) && !(eq.reaction && eq.reaction.m !== 0);
  const stubs: { to: Vec; fibres: readonly [number, number, number, number]; name: Label; cut: Vec[] }[] = [];
  const hinges: Vec[] = [];
  const angles: {
    ray: readonly [number, number, number, number];
    arc: string;
    stops: (readonly [number, number, number, number])[];
  }[] = [];
  const arrows: Arrow[] = [];
  const rings: Ring[] = [];
  const labels: Label[] = [];
  const taken: number[] = [];
  const anglesBySide = new Map<string, number>();
  const nodeRingAt = shownActions.some((a) => a.key === 'loadm' || a.key === 'reactionm');

  for (const member of eq.members) {
    const { along, across } = member;
    const cut = times(along, STUB);
    taken.push(angleOf(along));
    const fibre = times(across, FIBRE_OFFSET);
    const fibreFrom = add(times(along, allHinged || member.hinged ? HINGE_R * 2 + 2 : JOINT_R + 3), fibre);
    const fibreTo = add(cut, fibre);
    // An inclined member's angle runs from the horizontal on one side of it: is that its name's side?
    const angled = (byKey.get(`n${member.label}`) ?? byKey.get(`v${member.label}`))?.angleSub !== undefined;
    const level: Vec = along[0] >= 0 ? [1, 0] : [-1, 0];
    const angleOnNameSide = angled && level[0] * -across[0] + level[1] * -across[1] > 0;
    stubs.push({
      to: cut,
      fibres: [round(fibreFrom[0]), round(fibreFrom[1]), round(fibreTo[0]), round(fibreTo[1])],
      // The member's number on the side away from its fibres, as the drawing puts it
      // Along the member, on the side away from its fibres, as the drawing names it - unless the
      // member's angle is drawn on that side, when it crosses past the fibres
      name: {
        at: add(
          times(along, STUB * 0.5),
          angleOnNameSide ? times(across, FONT * 0.5 + 5 + FIBRE_OFFSET) : times(across, -(FONT * 0.5 + 4))
        ),
        anchor: 'middle',
        color: 'currentColor',
        text: member.label,
        rotate: upright(angleOf(along) * DEG),
      },
      cut: [add(cut, times(across, -9)), add(cut, times(across, 9))],
    });
    if (member.hinged && !allHinged) hinges.push(times(along, HINGE_R + 1));

    // An inclined member's angle from the horizontal, which its components' cos and sin are of
    const named = byKey.get(`n${member.label}`) ?? byKey.get(`v${member.label}`);
    if (named?.angleSub) {
      // A second inclined member on the same side gets its arc further out, sharing the level line
      const sideKey = level[0] > 0 ? 'right' : 'left';
      const radius = (nodeRingAt ? EDITOR_SIZES.reactionArc + 8 : ANGLE_R) + 12 * (anglesBySide.get(sideKey) ?? 0);
      anglesBySide.set(sideKey, (anglesBySide.get(sideKey) ?? 0) + 1);
      const from = angleOf(level);
      const to = angleOf(along);
      // The short way round; screen angles grow clockwise, which is SVG's sweep 1
      const turn = Math.atan2(Math.sin(to - from), Math.cos(to - from));
      const p0 = times(level, radius);
      const p1 = times(along, radius);
      const ray = times(level, radius + 10);
      // At each end of the arc the stops of the drawing's dimension lines: a short line across, a slash
      const stops = [from, to].flatMap((angle) => {
        const radial: Vec = [Math.cos(angle), Math.sin(angle)];
        const tangent: Vec = [-radial[1], radial[0]];
        const at = times(radial, radius);
        const across = [add(at, times(radial, -4)), add(at, times(radial, 4))];
        const slant: Vec = [(radial[0] + tangent[0]) * 3, (radial[1] + tangent[1]) * 3];
        const slash = [add(at, times(slant, -1)), add(at, slant)];
        return [across, slash].map(([a, b]) => [round(a[0]), round(a[1]), round(b[0]), round(b[1])] as const);
      });
      angles.push({
        stops,
        ray: [0, 0, round(ray[0]), round(ray[1])],
        arc: `M ${round(p0[0])} ${round(p0[1])} A ${radius} ${radius} 0 0 ${turn > 0 ? 1 : 0} ${round(p1[0])} ${round(p1[1])}`,
      });
      taken.push(from);
      const middle = from + turn / 2;
      const out: Vec = [Math.cos(middle), Math.sin(middle)];
      // Just outside its arc, halfway round
      const at = times(out, radius + 7);
      labels.push({
        at: [round(at[0]), round(at[1] + FONT * 0.35)],
        anchor: anchorFor(out),
        color: 'currentColor',
        out,
        letter: 'α',
        sub: member.label,
      });
    }

    // With M's ring round the cut, N and V start outside it rather than through it
    const ringed = byKey.has(`m${member.label}`);
    const start = ringed ? RING + EDITOR_SIZES.reactionArcGap : GAP;
    const n = byKey.get(`n${member.label}`);
    if (n?.dir) {
      const near = add(cut, times(along, start));
      const far = add(cut, times(along, start + ARROW));
      // Out of the section, as positive N (tension) acts; into it where it is turned round
      const out = n.dir[0] * along[0] + n.dir[1] * along[1] > 0;
      const drawnN = out ? withParts(near, far, n) : withParts(far, near, n);
      arrows.push(...drawnN.arrows);
      labels.push(...drawnN.labels);
      labels.push(labelFor(n, add(far, times(along, 8)), along, [near, far]));
    }

    // Positive V on this cut face: toward the bottom fibres at the member's start, away at its end
    // V lies on the bottom fibres' side of the cut, whichever way it points: pulling out toward the
    // fibres on a member's start, pushing in from them on its end
    const v = byKey.get(`v${member.label}`);
    if (v?.dir) {
      const near = add(cut, times(across, ringed ? start : 2));
      const far = add(cut, times(across, (ringed ? start : 2) + ARROW));
      const towardFibres = v.dir[0] * across[0] + v.dir[1] * across[1] > 0;
      const drawnV = towardFibres ? withParts(near, far, v) : withParts(far, near, v);
      arrows.push(...drawnV.arrows);
      labels.push(...drawnV.labels);
      labels.push(labelFor(v, add(far, times(across, 8)), across, [near, far]));
    }

    const m = byKey.get(`m${member.label}`);
    if (m?.turn) {
      rings.push(ring(cut, RING, angleOf(times(along, -1)), m.turn, m.color));
      // Its name on the top fibres' side, away from V
      const out: Vec = [(along[0] - across[0]) / Math.SQRT2, (along[1] - across[1]) / Math.SQRT2];
      labels.push(labelFor(m, add(cut, times(out, RING + 9)), out));
    }
  }

  // A moment's ring round the node keeps the loads' and the reaction's arrows outside it, as the drawing
  const nodeRing = shownActions.some((a) => a.key === 'loadm' || a.key === 'reactionm');
  const reach = nodeRing
    ? EDITOR_SIZES.reactionArc + EDITOR_SIZES.reactionArcGap
    : allHinged
      ? HINGE_R + 3
      : JOINT_R + 4;

  /**
   * A load (the way it acts) or a reaction (its positive direction) at the node: drawn pushing into it
   * from the far side, or pulling out of it, whichever leaves its arrow furthest from the members and
   * from what is drawn already.
   */
  for (const a of shownActions) {
    if (!a.dir || !(a.key.startsWith('load') || a.key.startsWith('reaction'))) continue;
    const pushIn = angleOf(times(a.dir, -1));
    const pullOut = angleOf(a.dir);
    const inward = clearance(pushIn, taken) >= clearance(pullOut, taken);
    const outward = inward ? times(a.dir, -1) : a.dir;
    const near = times(outward, reach);
    const far = times(outward, reach + ARROW);
    const drawnA = inward ? withParts(far, near, a) : withParts(near, far, a);
    arrows.push(...drawnA.arrows);
    labels.push(...drawnA.labels);
    labels.push(labelFor(a, add(far, times(outward, 8)), outward, [near, far]));
    taken.push(angleOf(outward));
  }

  /** The free side of the node for a moment's ring and its label */
  const freest = () => {
    let best = 0;
    for (let k = 0; k < 16; k++) {
      const angle = (k * Math.PI) / 8;
      if (clearance(angle, taken) > clearance(best, taken)) best = angle;
    }
    return best;
  };
  for (const a of shownActions) {
    if (!a.turn || !(a.key === 'loadm' || a.key === 'reactionm')) continue;
    const radius = a.key === 'loadm' ? LOAD_RING : REACTION_RING;
    const open = freest();
    rings.push(ring([0, 0], radius, open + Math.PI, a.turn, a.color));
    const out: Vec = [Math.cos(open), Math.sin(open)];
    labels.push(labelFor(a, times(out, radius + 9), out));
    taken.push(open);
  }

  // The node's own name, in the freest corner, up and to the left when that is as free; round a ring
  const prefer = (-3 * Math.PI) / 4;
  let corner = prefer;
  for (let k = 0; k < 16; k++) {
    const angle = (k * Math.PI) / 8 - Math.PI;
    const better = clearance(angle, taken) - clearance(corner, taken);
    if (better > 1e-6 || (Math.abs(better) <= 1e-6 && clearance(angle, [prefer]) < clearance(corner, [prefer])))
      corner = angle;
  }
  const ringed = rings.some((r) => r.center[0] === 0 && r.center[1] === 0);
  const out: Vec = [Math.cos(corner), Math.sin(corner)];
  const nodeName: Label = {
    at: times(out, ringed ? EDITOR_SIZES.arcLabelGap + 4 : EDITOR_SIZES.nodeLabelGap + 2),
    anchor: anchorFor(out),
    color: 'currentColor',
    text: props.node,
    bold: true,
  };
  labels.push({ ...nodeName, at: [round(nodeName.at[0]), round(nodeName.at[1] + FONT * 0.35)] });

  // Clear of each other, of the arrows, the rings and the stubs; the members' names are placed first.
  // A force's components show only while it is hovered: theirs are placed after, against all of that
  const mainArrows = arrows.filter((a) => !a.part);
  const toSegment = (a: Arrow): [Vec, Vec] => [
    [a.line[0], a.line[1]],
    [a.line[2], a.line[3]],
  ];
  const segments: [Vec, Vec][] = [...mainArrows.map(toSegment), ...stubs.map((st): [Vec, Vec] => [[0, 0], st.to])];
  const circles = rings.map((r) => ({ center: r.center, r: r.radius }));
  const names = placeClear(
    stubs.map((st) => st.name),
    [],
    []
  );
  const mainLabels = labels.filter((l) => !l.part);
  const placedMain = placeClear([...names, ...mainLabels], segments, circles).slice(names.length);
  const fixed = [...names, ...placedMain].map(boxOf);
  const partLabels = [...new Set(labels.filter((l) => l.part).map((l) => l.key))].flatMap((key) =>
    placeClear(
      labels.filter((l) => l.part && l.key === key),
      [...segments, ...arrows.filter((a) => a.part && a.key === key).map(toSegment)],
      circles,
      fixed
    )
  );
  labels.splice(0, labels.length, ...placedMain, ...partLabels);

  // The box around everything, a label's text by an estimate of its width
  const xs: number[] = [];
  const ys: number[] = [];
  const take = (x: number, y: number) => (xs.push(x), ys.push(y));
  take(0, 0);
  stubs.forEach((s) => take(s.to[0], s.to[1]));
  arrows.forEach((a) => (take(a.line[0], a.line[1]), take(a.line[2], a.line[3])));
  for (const l of [...labels, ...stubs.map((s) => s.name)]) {
    const width = labelWidth(l);
    const left = l.anchor === 'start' ? l.at[0] : l.anchor === 'end' ? l.at[0] - width : l.at[0] - width / 2;
    take(left, l.at[1] - FONT);
    take(left + width, l.at[1] + 5);
  }
  // A ring reaches its radius every way from its centre: pad by one
  const pad = 4 + REACTION_RING;
  const box = {
    x: Math.min(...xs) - pad,
    y: Math.min(...ys) - pad,
    width: Math.max(...xs) - Math.min(...xs) + 2 * pad,
    height: Math.max(...ys) - Math.min(...ys) + 2 * pad,
  };

  return { stubs, hinges, angles, allHinged, arrows, rings, labels, box };
};

/** The drawing in the mode on show, framed to fit both modes, so switching changes the labels alone */
const figure = computed(() => {
  const shown = layout(mode.value);
  const other = layout(mode.value === 'symbols' ? 'values' : 'symbols');
  if (!shown || !other) return shown;
  const a = shown.box;
  const b = other.box;
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const box = {
    x,
    y,
    width: Math.max(a.x + a.width, b.x + b.width) - x,
    height: Math.max(a.y + a.height, b.y + b.height) - y,
  };
  return { ...shown, box };
});

/* ---------------------------------------------------------------- the sums */

interface Term {
  readonly key: string;
  readonly sign: 1 | -1;
  readonly action: Action;
  /** cos or sin of the action's slope, when its component is not the whole of it */
  readonly factor: { readonly fn: 'cos' | 'sin'; readonly degrees: string } | null;
}

/** The part of an action along `axis`, as a sign and the cos or sin of its slope that gives it */
const termAlong = (a: Action, axis: Vec): Term | null => {
  if (!a.dir) return null;
  const part = a.dir[0] * axis[0] + a.dir[1] * axis[1];
  if (Math.abs(part) < 1e-9) return null;
  const whole = Math.abs(Math.abs(part) - 1) < 1e-9;
  const nearerCos = Math.abs(Math.abs(part) - Math.cos(a.slope)) <= Math.abs(Math.abs(part) - Math.sin(a.slope));
  const factor = whole ? null : { fn: nearerCos ? ('cos' as const) : ('sin' as const), degrees: degrees(a.slope) };
  return { key: a.key, sign: part > 0 ? 1 : -1, action: a, factor };
};

const sums = computed(() => {
  const eq = equilibrium.value;
  if (!eq) return [];
  const up = appStore.vertical(1);

  const forces = (axis: Vec) => actions.value.map((a) => termAlong(a, axis)).filter((t): t is Term => t !== null);
  const moments = actions.value
    .filter((a) => a.turn)
    .map((a): Term => ({ key: a.key, sign: a.turn > 0 ? 1 : -1, action: a, factor: null }));

  return [
    {
      symbol: 'F',
      axis: 'x',
      pointing: 0,
      unit: 'force' as Unit,
      terms: forces([1, 0]),
      total: inUnits(eq.sum.x, 'force'),
    },
    {
      symbol: 'F',
      axis: appStore.axes.v,
      // Down for z, up for y, on screen
      pointing: up > 0 ? 90 : -90,
      unit: 'force' as Unit,
      // The vertical axis points down in the model and, in the y-up convention, up on paper
      terms: forces([0, up]),
      total: appStore.vertical(inUnits(eq.sum.z, 'force')),
    },
    {
      symbol: 'M',
      axis: appStore.axes.r,
      pointing: 0,
      unit: 'moment' as Unit,
      terms: moments,
      total: inUnits(eq.sum.m, 'moment'),
    },
    // No moment sum where no moment acts: a hinge, or a pinned member end
  ].filter((sum) => sum.symbol !== 'M' || sum.terms.length > 0);
});

/** Counter-clockwise, positive in both axis conventions: the moment sum's sign */
const SUM_RING = (() => {
  const r = ring([0, 0], EDITOR_SIZES.arc, Math.PI / 2, 1, 'currentColor');
  return { path: r.path, head: r.head };
})();

/** The units of the values in the drawing, once in its corner rather than after every number */
const drawingUnits = computed(() => {
  const valued = drawn.value.filter((a) => a.known);
  if (!valued.length) return null;
  const units = [...new Set(valued.map((a) => unitLabel(a.unit)))];
  return `[${units.join(', ')}]`;
});

/** Each inclined member's angle by name, under the drawing: α₁ = 38.29° */
const angleValues = computed(() =>
  actions.value
    .filter((a) => a.angleSub && a.letter === 'N')
    .map((a) => ({ sub: a.angleSub ?? '', degrees: degrees(a.slope) }))
);

/** A term's value as put into the sum: a load by its size, an unknown signed, a negative one in brackets */
const substituted = (t: Term) => {
  const value = Math.round(inUnits(t.action.value, t.action.unit) * 100) / 100 || 0;
  if (t.action.known || value >= 0) return shown(Math.abs(value));
  return `(−${shown(-value)})`;
};

/** Whether the line in symbols would read the same as the one in numbers: only loads in it */
const allKnown = (terms: readonly Term[]) => terms.every((t) => t.action.known);
</script>

<template>
  <div class="node-equilibrium">
    <div v-if="!projectStore.solver.domain.nodes.has(props.node)" class="pa-3">
      {{ $t('warnings.nodeMissing', { label: props.node }) }}
    </div>
    <div v-else-if="!figure" class="pa-3 text-medium-emphasis">{{ $t('report.no_results') }}</div>
    <template v-else>
      <v-btn-toggle v-model="mode" class="mode" mandatory density="compact" variant="outlined" divided color="primary">
        <v-btn value="symbols" size="small" class="text-none">{{ $t('nodes.equilibriumSymbols') }}</v-btn>
        <v-btn value="values" size="small" class="text-none">{{ $t('nodes.equilibriumValues') }}</v-btn>
      </v-btn-toggle>
      <div v-if="drawingUnits" class="drawing-units px-4">{{ drawingUnits }}</div>
      <svg
        class="figure"
        :viewBox="`${figure.box.x} ${figure.box.y} ${figure.box.width} ${figure.box.height}`"
        :style="{ maxWidth: `${figure.box.width}px`, maxHeight: '320px' }"
        role="img"
      >
        <g v-for="(stub, i) in figure.stubs" :key="`s${i}`">
          <line x1="0" y1="0" :x2="stub.to[0]" :y2="stub.to[1]" class="stub" />
          <line :x1="stub.fibres[0]" :y1="stub.fibres[1]" :x2="stub.fibres[2]" :y2="stub.fibres[3]" class="fibres" />
          <polyline :points="pointsOf(stub.cut)" class="cut" />
        </g>
        <g v-for="(a, i) in figure.angles" :key="`g${i}`" class="angle">
          <line :x1="a.ray[0]" :y1="a.ray[1]" :x2="a.ray[2]" :y2="a.ray[3]" class="level" />
          <path :d="a.arc" fill="none" />
          <line v-for="(st, j) in a.stops" :key="j" :x1="st[0]" :y1="st[1]" :x2="st[2]" :y2="st[3]" />
        </g>
        <circle v-if="figure.allHinged" cx="0" cy="0" :r="HINGE_R" class="hinge" />
        <circle v-else cx="0" cy="0" :r="JOINT_R" class="joint" />
        <circle v-for="(h, i) in figure.hinges" :key="`h${i}`" :cx="h[0]" :cy="h[1]" :r="HINGE_R" class="hinge" />
        <g v-for="(r, i) in figure.rings" :key="`r${i}`">
          <path :d="r.path" fill="none" :stroke="r.color" :stroke-width="ARC_WIDTH" />
          <polygon :points="r.head" :fill="r.color" />
        </g>
        <template v-for="(a, i) in figure.arrows" :key="`a${i}`">
          <g v-if="!a.part || a.key === hovered" :class="{ part: a.part }">
            <line
              :x1="a.line[0]"
              :y1="a.line[1]"
              :x2="a.line[2]"
              :y2="a.line[3]"
              :stroke="a.color"
              :stroke-width="SHAFT"
            />
            <polygon :points="a.head" :fill="a.color" />
            <!-- A wide, invisible stroke to point at or tap, for the components -->
            <line
              v-if="!a.part && a.key"
              :x1="a.line[0]"
              :y1="a.line[1]"
              :x2="a.line[2]"
              :y2="a.line[3]"
              class="hit"
              @pointerenter="(e: PointerEvent) => e.pointerType === 'mouse' && (hovered = a.key ?? null)"
              @pointerleave="(e: PointerEvent) => e.pointerType === 'mouse' && (hovered = null)"
              @pointerup="(e: PointerEvent) => e.pointerType !== 'mouse' && toggleHovered(a.key)"
            />
          </g>
        </template>
        <text
          v-for="(l, i) in [...figure.stubs.map((s) => s.name), ...figure.labels].filter(
            (l) => !l.part || l.key === hovered
          )"
          :key="`l${i}`"
          :x="l.at[0]"
          :y="l.at[1]"
          :text-anchor="l.anchor"
          :fill="l.color"
          :font-size="FONT"
          :font-weight="l.bold ? 600 : undefined"
          :opacity="l.part ? 0.75 : undefined"
          :dominant-baseline="l.rotate === undefined ? undefined : 'central'"
          :transform="l.rotate === undefined ? undefined : `rotate(${round(l.rotate)} ${l.at[0]} ${l.at[1]})`"
        >
          <template v-if="l.letter">
            <tspan class="symbol">{{ l.letter }}</tspan>
            <tspan :font-size="SUB_FONT" dy="3">{{ l.sub }}</tspan>
            <template v-if="l.factor">
              <tspan dy="-3">·{{ l.factor.fn }}</tspan>
              <template v-if="l.factor.sub">
                <tspan class="symbol">α</tspan>
                <tspan :font-size="SUB_FONT" dy="3">{{ l.factor.sub }}</tspan>
              </template>
              <tspan v-else>{{ l.factor.degrees }}</tspan>
            </template>
          </template>
          <template v-else>{{ l.text }}</template>
        </text>
      </svg>

      <div v-if="angleValues.length" class="angle-values px-4 pb-2">
        <span v-for="a in angleValues" :key="a.sub"
          ><span class="symbol">α</span><sub>{{ a.sub }}</sub> = {{ a.degrees }}</span
        >
      </div>
      <div class="sums px-4 pb-4">
        <template v-for="sum in sums" :key="sum.symbol + sum.axis">
          <div class="lhs">
            <!-- The way the sum counts positive: two ways are possible, so it is drawn -->
            <svg class="direction" :viewBox="sum.symbol === 'M' ? '-23 -23 46 46' : '-9 -9 18 18'" aria-hidden="true">
              <template v-if="sum.symbol === 'M'">
                <path :d="SUM_RING.path" fill="none" stroke="currentColor" stroke-width="3" />
                <polygon :points="SUM_RING.head" fill="currentColor" />
              </template>
              <g v-else :transform="`rotate(${sum.pointing})`">
                <line x1="-8" y1="0" x2="3" y2="0" stroke="currentColor" stroke-width="1.5" />
                <polygon points="8,0 2,-3.5 2,3.5" fill="currentColor" />
              </g>
            </svg>
            <span
              ><span class="symbol">Σ{{ sum.symbol }}</span
              ><sub>{{ sum.axis }}</sub></span
            >
          </div>
          <div class="rhs">
            <template v-if="sum.terms.length">
              <!-- In symbols -->
              <div v-if="!allKnown(sum.terms)" class="line">
                <span class="eq">=</span>
                <span
                  v-for="(t, i) in sum.terms"
                  :key="t.key"
                  class="term"
                  :style="{ color: t.action.color }"
                  @pointerenter="(e: PointerEvent) => e.pointerType === 'mouse' && (hovered = t.key)"
                  @pointerleave="(e: PointerEvent) => e.pointerType === 'mouse' && (hovered = null)"
                  @pointerup="(e: PointerEvent) => e.pointerType !== 'mouse' && toggleHovered(t.key)"
                >
                  <span v-if="i > 0 || t.sign < 0" class="op">{{ t.sign < 0 ? '−' : '+' }}</span>
                  <template v-if="t.action.known">{{ shown(inUnits(t.action.value, t.action.unit)) }}</template>
                  <template v-else
                    ><span class="symbol">{{ t.action.letter }}</span
                    ><sub>{{ t.action.sub }}</sub></template
                  ><span v-if="t.factor" class="factor"
                    >·{{ t.factor.fn }}
                    <template v-if="t.action.angleSub"
                      ><span class="symbol">α</span><sub>{{ t.action.angleSub }}</sub></template
                    ><template v-else>{{ t.factor.degrees }}</template></span
                  >
                </span>
              </div>
              <!-- In numbers -->
              <div class="line">
                <span class="eq">=</span>
                <span v-for="(t, i) in sum.terms" :key="t.key" class="term">
                  <span v-if="i > 0 || t.sign < 0" class="op">{{ t.sign < 0 ? '−' : '+' }}</span>
                  {{ substituted(t)
                  }}<span v-if="t.factor" class="factor">·{{ t.factor.fn }} {{ t.factor.degrees }}</span>
                </span>
              </div>
            </template>
            <div class="line">
              <span class="eq">=</span>
              <span class="font-weight-medium">{{ shown(sum.total) }}</span>
              <span class="unit">{{ unitLabel(sum.unit) }}</span>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.node-equilibrium {
  position: relative;
}
/* Small, in the drawing's top corner, so it takes no row of its own */
.mode {
  position: absolute;
  top: 0;
  right: 12px;
  z-index: 1;
  height: 28px !important;
}
/* Compact, but its words at the size of the rest of the widget */
.mode :deep(.v-btn) {
  font-size: 0.8125rem;
  letter-spacing: normal;
  padding: 0 10px;
}
.drawing-units {
  position: absolute;
  top: 4px;
  left: 0;
  font-size: 0.8125rem;
  opacity: 0.6;
}
.figure {
  display: block;
  width: 100%;
  margin: 0 auto 12px;
  overflow: visible;
}
.stub {
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
}
.fibres {
  stroke: currentColor;
  stroke-width: 1;
  stroke-dasharray: 5 4;
  opacity: 0.55;
}
.cut {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  stroke-dasharray: 2 2;
  opacity: 0.5;
}
.joint {
  fill: currentColor;
}
.part {
  opacity: 0.55;
}
.hit {
  stroke: transparent;
  stroke-width: 14;
  cursor: help;
  pointer-events: stroke;
}
.part line {
  stroke-dasharray: 4 3;
}
.angle {
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.7;
}
.level {
  stroke-dasharray: 3 3;
}
.hinge {
  fill: rgb(var(--v-theme-surface));
  stroke: currentColor;
  stroke-width: 1.75;
}
.symbol {
  font-style: italic;
}
.angle-values {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.25em;
  font-size: 0.875rem;
}
.sums {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.5em;
  row-gap: 0.6em;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  line-height: 1.6;
}
.lhs {
  display: flex;
  align-self: start;
  align-items: center;
  gap: 0.3em;
  white-space: nowrap;
}
.direction {
  width: 1.5em;
  height: 1.5em;
  overflow: visible;
}
.line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 0.35em;
}
.eq {
  margin-right: 0.15em;
}
.term {
  white-space: nowrap;
}
.op {
  margin-right: 0.25em;
}
.factor {
  margin-left: 0.1em;
  opacity: 0.8;
}
.unit {
  opacity: 0.6;
}
sub {
  font-size: 0.7em;
}
</style>
