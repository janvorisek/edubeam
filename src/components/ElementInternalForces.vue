<script setup lang="ts">
import { computed } from "vue";
import { useProjectStore } from "@/store/project";
import {
  Beam2D,
  BeamConcentratedLoad,
  BeamElementUniformEdgeLoad,
  BeamElementTrapezoidalEdgeLoad,
} from "ts-fem";

import katex from "katex";
import "katex/dist/katex.min.css";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  label: string | number;
}>();

const projectStore = useProjectStore();
const { t } = useI18n();

const element = computed<Beam2D | null>(() => {
  if (props.label === undefined || props.label === null || props.label === "") return null;

  for (const candidate of projectStore.solver.domain.elements.values()) {
    if (String(candidate.label) === String(props.label)) {
      return candidate as Beam2D;
    }
  }

  return null;
});

const loadCase = computed(() => projectStore.solver.loadCases[0]);

const EPS = 1e-9;
const ROOT_EPS = 1e-8;
const POINT_EPS = 1e-7;

// ========================
// i18n fallback helper
// ========================

const tt = (key: string, fallback: string) => {
  const value = t(key);
  return value === key ? fallback : value;
};

const panelMessage = computed(() => {
  if (props.label !== undefined && props.label !== null && props.label !== "" && !element.value) {
    return tt("elements.elementNoLongerExists", "Vybraný prvek už v modelu neexistuje");
  }

  return tt("elements.noElementSelected", "Není vybraný žádný prvek");
});

const toKN = (v: number) => v / 1000;
const toKNm = (v: number) => v / 1000;
const toKNperM = (v: number) => v / 1000;
const toKNperM2 = (v: number) => v / 1000;

const isZero = (v: number, eps = EPS) => Math.abs(v) < eps;

const formatNumber = (v: number, digits = 3) => {
  if (isZero(v)) return "0";
  return Number(v.toFixed(digits)).toString();
};

const latexNumber = (v: number, digits = 3) => {
  if (isZero(v)) return "0";
  return formatNumber(Math.abs(v), digits);
};

const latexSignedNumber = (v: number, digits = 3) => {
  if (isZero(v)) return "";
  const sign = v < 0 ? "-" : "+";
  return `${sign}${latexNumber(v, digits)}`;
};

const wrapLatex = (expr: string) => {
  try {
    return katex.renderToString(expr, {
      throwOnError: false,
      displayMode: false,
      output: "html",
    });
  } catch {
    return expr;
  }
};

const joinLatexTerms = (terms: string[]) => {
  const filtered = terms.filter((term) => term && term.trim().length > 0);
  if (!filtered.length) return "0";

  return filtered
    .map((term, index) => {
      const trimmed = term.trim();
      if (index === 0) {
        return trimmed.startsWith("+") ? trimmed.slice(1) : trimmed;
      }
      return trimmed;
    })
    .join(" ");
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const sortUniqueNumbers = (values: number[], eps = POINT_EPS) => {
  const sorted = [...values].sort((a, b) => a - b);
  const result: number[] = [];

  for (const v of sorted) {
    if (!result.length || Math.abs(v - result[result.length - 1]) > eps) {
      result.push(v);
    }
  }

  return result;
};

// ========================
// Polynoms
// ========================

type PolynomialCoefficients = {
  c0: number; // konstanta
  c1: number; // x
  c2: number; // x^2 / 2
  c3: number; // x^3 / 6
};

const emptyPoly = (): PolynomialCoefficients => ({
  c0: 0,
  c1: 0,
  c2: 0,
  c3: 0,
});

const copyPoly = (poly: PolynomialCoefficients): PolynomialCoefficients => ({
  c0: poly.c0,
  c1: poly.c1,
  c2: poly.c2,
  c3: poly.c3,
});

const addPoly = (
  target: PolynomialCoefficients,
  source: Partial<PolynomialCoefficients>
) => {
  target.c0 += source.c0 ?? 0;
  target.c1 += source.c1 ?? 0;
  target.c2 += source.c2 ?? 0;
  target.c3 += source.c3 ?? 0;
};

const polyEquals = (a: PolynomialCoefficients, b: PolynomialCoefficients, eps = 1e-9) => {
  return (
    Math.abs(a.c0 - b.c0) < eps &&
    Math.abs(a.c1 - b.c1) < eps &&
    Math.abs(a.c2 - b.c2) < eps &&
    Math.abs(a.c3 - b.c3) < eps
  );
};

// ========================
// Latex builder
// ========================

const constantTerm = (value: number) => {
  if (isZero(value)) return "";
  return latexSignedNumber(value);
};

const xTerm = (coeff: number) => {
  if (isZero(coeff)) return "";
  const num = latexNumber(coeff);
  const sign = coeff < 0 ? "-" : "+";

  if (num === "1") return `${sign}x`;
  return `${sign}${num}x`;
};

const x2Over2Term = (coeff: number) => {
  if (isZero(coeff)) return "";
  const num = latexNumber(coeff);
  const sign = coeff < 0 ? "-" : "+";

  if (num === "1") return `${sign}\\frac{x^2}{2}`;
  return `${sign}\\frac{${num}x^2}{2}`;
};

const x3Over6Term = (coeff: number) => {
  if (isZero(coeff)) return "";
  const num = latexNumber(coeff);
  const sign = coeff < 0 ? "-" : "+";

  if (num === "1") return `${sign}\\frac{x^3}{6}`;
  return `${sign}\\frac{${num}x^3}{6}`;
};

const polynomialToLatex = (poly: PolynomialCoefficients) => {
  const terms: string[] = [];
  terms.push(constantTerm(poly.c0));
  terms.push(xTerm(poly.c1));
  terms.push(x2Over2Term(poly.c2));
  terms.push(x3Over6Term(poly.c3));
  return joinLatexTerms(terms);
};

// ========================
// Interval expressions
// ========================

type ForceIntervalExpression = {
  from: number;
  to: number;
  NPoly: PolynomialCoefficients;
  VPoly: PolynomialCoefficients;
  MPoly: PolynomialCoefficients;
};

type MergedFormulaInterval = {
  from: number;
  to: number;
  expr: string;
};

const formatIntervalLatex = (from: number, to: number, isLast: boolean) => {
  const fromStr = formatNumber(from);
  const toStr = formatNumber(to);

  if (isZero(from) && !isLast) {
    return `0 \\le x < ${toStr}`;
  }

  if (isLast) {
    return `${fromStr} \\le x \\le ${toStr}`;
  }

  return `${fromStr} \\le x < ${toStr}`;
};

const getExpressionBreakpoints = (el: Beam2D) => {
  const lc = loadCase.value;
  const L = el.computeGeo().l;
  const loads = lc.getElementLoadsOnElement(el.label);

  const points = [0, L];

  for (const load of loads) {
    if (load instanceof BeamConcentratedLoad) {
      points.push(clamp(load.values[3], 0, L));
    }
  }

  return sortUniqueNumbers(points);
};

const buildIntervalExpressions = (el: Beam2D): ForceIntervalExpression[] => {
  const lc = loadCase.value;
  const breakpoints = getExpressionBreakpoints(el);
  const loads = lc.getElementLoadsOnElement(el.label);
  const endForces = el.computeEndForces(lc);

  const N0 = -endForces.get([0]); // N
  const V0 = -endForces.get([1]); // N
  const M0 = -endForces.get([2]); // Nm

  const intervals: ForceIntervalExpression[] = [];

  for (let i = 0; i < breakpoints.length - 1; i++) {
    const from = breakpoints[i];
    const to = breakpoints[i + 1];

    const polyN = emptyPoly();
    const polyV = emptyPoly();
    const polyM = emptyPoly();

    addPoly(polyN, { c0: toKN(N0) });
    addPoly(polyV, { c0: toKN(V0) });
    addPoly(polyM, { c0: toKNm(M0), c1: toKN(V0) });

    for (const load of loads) {
      if (load instanceof BeamConcentratedLoad) {
        const intensities = load.getLocalIntensities();
        const fx = toKN(intensities.fx);
        const fy = toKN(intensities.fz);
        const mz = toKNm(load.values[2]);
        const a = load.values[3];

        if (from >= a - POINT_EPS) {
          addPoly(polyN, { c0: fx });
          addPoly(polyV, { c0: -fy });
          addPoly(polyM, {
            c0: fy * a + mz,
            c1: -fy,
          });
        }
      } else if (load instanceof BeamElementUniformEdgeLoad) {
        const intensities = load.getLocalIntensities();
        const fx = toKNperM(intensities.fx);
        const w = toKNperM(intensities.fz);

        addPoly(polyN, { c1: fx });
        addPoly(polyV, { c1: -w });
        addPoly(polyM, { c2: -w });
      } else if (load instanceof BeamElementTrapezoidalEdgeLoad) {
        const size = el.computeGeo().l;
        const intensities = load.getLocalIntensities();

        const fx0 = toKNperM(intensities.start.fx);
        const fx1 = toKNperM(intensities.end.fx);
        const w0 = toKNperM(intensities.start.fz);
        const w1 = toKNperM(intensities.end.fz);

        const fxSlope = (fx1 - fx0) / size;
        const wSlope = (w1 - w0) / size;

        addPoly(polyN, {
          c1: fx0,
          c2: fxSlope,
        });

        addPoly(polyV, {
          c1: -w0,
          c2: -wSlope,
        });

        addPoly(polyM, {
          c2: -w0,
          c3: -wSlope,
        });
      }
    }

    intervals.push({
      from,
      to,
      NPoly: copyPoly(polyN),
      VPoly: copyPoly(polyV),
      MPoly: copyPoly(polyM),
    });
  }

  return intervals;
};

const mergeFormulaIntervals = (
  intervals: ForceIntervalExpression[],
  key: "NPoly" | "VPoly" | "MPoly"
): MergedFormulaInterval[] => {
  if (!intervals.length) return [];

  const merged: MergedFormulaInterval[] = [];

  let currentFrom = intervals[0].from;
  let currentTo = intervals[0].to;
  let currentPoly = intervals[0][key];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];

    if (polyEquals(currentPoly, next[key])) {
      currentTo = next.to;
    } else {
      merged.push({
        from: currentFrom,
        to: currentTo,
        expr: polynomialToLatex(currentPoly),
      });

      currentFrom = next.from;
      currentTo = next.to;
      currentPoly = next[key];
    }
  }

  merged.push({
    from: currentFrom,
    to: currentTo,
    expr: polynomialToLatex(currentPoly),
  });

  return merged;
};

// ========================
// Extremes
// ========================

const solveQuadraticRootsInInterval = (
  a: number,
  b: number,
  c: number,
  min: number,
  max: number,
  eps = ROOT_EPS
) => {
  const roots: number[] = [];

  if (Math.abs(a) < eps) {
    if (Math.abs(b) < eps) return roots;
    const x = -c / b;
    if (x > min + eps && x < max - eps) roots.push(x);
    return roots;
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant < -eps) return roots;

  if (Math.abs(discriminant) <= eps) {
    const x = -b / (2 * a);
    if (x > min + eps && x < max - eps) roots.push(x);
    return roots;
  }

  const sqrtDiscriminant = Math.sqrt(discriminant);
  const x1 = (-b - sqrtDiscriminant) / (2 * a);
  const x2 = (-b + sqrtDiscriminant) / (2 * a);

  if (x1 > min + eps && x1 < max - eps) roots.push(x1);
  if (x2 > min + eps && x2 < max - eps) roots.push(x2);

  return sortUniqueNumbers(roots, eps);
};

const findShearRootsInInterval = (
  el: Beam2D,
  lc: typeof loadCase.value,
  x1: number,
  x2: number
) => {
  const dx = x2 - x1;
  if (dx < 1e-6) return [];

  const mid = x1 + dx / 2;
  const V1 = el.computeShearForceAt(lc, x1);
  const Vm = el.computeShearForceAt(lc, mid);
  const V2 = el.computeShearForceAt(lc, x2);

  const A1 = V2 - V1;
  const A2 = Vm - V1;

  const aLocal = (2 * (A1 - 2 * A2)) / (dx * dx);
  const bLocal = (A1 - aLocal * dx * dx) / dx;
  const cLocal = V1;

  return solveQuadraticRootsInInterval(aLocal, bLocal, cLocal, 0, dx).map(
    (tLocal) => x1 + tLocal
  );
};

type MomentPointKind = "boundary" | "load-point" | "shear-root";

type MomentPoint = {
  x: number;
  M: number;
  isInterior: boolean;
  kind: MomentPointKind;
};

type MomentExtremaResult = {
  all: MomentPoint[];
  absolute: MomentPoint | null;
  max: MomentPoint | null;
  min: MomentPoint | null;
  isConstant: boolean;
};

const pointKindLabel = (kind: MomentPointKind) => {
  if (kind === "boundary") return tt("elements.pointBoundary", "kraj");
  if (kind === "load-point") return tt("elements.pointLoad", "místo síly/momentu");
  return tt("elements.pointShearRoot", "V(x)=0");
};

const getMomentCandidateBasePoints = (el: Beam2D) => {
  const lc = loadCase.value;
  const L = el.computeGeo().l;
  const loads = lc.getElementLoadsOnElement(el.label);

  const candidatePoints: { x: number; kind: MomentPointKind }[] = [
    { x: 0, kind: "boundary" },
    { x: L, kind: "boundary" },
  ];

  const shearIntervals: number[] = [0, L];

  const hasTrapezoidal = loads.some(
    (load) => load instanceof BeamElementTrapezoidalEdgeLoad
  );

  if (hasTrapezoidal) {
    for (let i = 0; i <= 12; i++) {
      shearIntervals.push((L * i) / 12);
    }
  } else {
    for (let i = 0; i <= 4; i++) {
      shearIntervals.push((L * i) / 4);
    }
  }

  for (const load of loads) {
    if (load instanceof BeamConcentratedLoad) {
      const a = clamp(load.values[3], 0, L);
      candidatePoints.push({ x: a, kind: "load-point" });
      shearIntervals.push(a);

      if (a > EPS) shearIntervals.push(a - POINT_EPS);
      if (a < L - EPS) shearIntervals.push(a + POINT_EPS);
    }
  }

  return {
    lc,
    L,
    candidatePoints,
    shearIntervals: sortUniqueNumbers(shearIntervals),
  };
};

const pushCandidatePoint = (
  target: { x: number; kind: MomentPointKind }[],
  point: { x: number; kind: MomentPointKind },
  eps = POINT_EPS
) => {
  const existing = target.find((p) => Math.abs(p.x - point.x) <= eps);

  if (!existing) {
    target.push(point);
    return;
  }

  const priority: Record<MomentPointKind, number> = {
    boundary: 1,
    "load-point": 2,
    "shear-root": 3,
  };

  if (priority[point.kind] > priority[existing.kind]) {
    existing.kind = point.kind;
  }
};

const isConstantMomentFunction = (el: Beam2D, samplePoints: number[]) => {
  const lc = loadCase.value;
  if (!samplePoints.length) return true;

  const values = samplePoints.map((x) => el.computeBendingMomentAt(lc, x));
  const first = values[0];

  return values.every((v) => Math.abs(v - first) < 1e-6);
};

const getElementMomentExtrema = (el: Beam2D): MomentExtremaResult => {
  const { candidatePoints, shearIntervals, L, lc } = getMomentCandidateBasePoints(el);

  const constantCheckPoints = sortUniqueNumbers([
    0,
    L,
    L / 4,
    L / 2,
    (3 * L) / 4,
    ...shearIntervals,
    ...candidatePoints.map((p) => p.x),
  ]);

  if (isConstantMomentFunction(el, constantCheckPoints)) {
    return {
      all: [],
      absolute: null,
      max: null,
      min: null,
      isConstant: true,
    };
  }

  for (let i = 0; i < shearIntervals.length - 1; i++) {
    const x1 = shearIntervals[i];
    const x2 = shearIntervals[i + 1];
    const dx = x2 - x1;

    if (dx < 1e-6) continue;

    const V1 = el.computeShearForceAt(lc, x1);
    const V2 = el.computeShearForceAt(lc, x2);

    if (Math.abs(V1) < ROOT_EPS) {
      pushCandidatePoint(candidatePoints, { x: x1, kind: "shear-root" });
    }

    if (Math.abs(V2) < ROOT_EPS) {
      pushCandidatePoint(candidatePoints, { x: x2, kind: "shear-root" });
    }

    for (const x0 of findShearRootsInInterval(el, lc, x1, x2)) {
      pushCandidatePoint(candidatePoints, { x: x0, kind: "shear-root" });
    }
  }

  const uniqueX = sortUniqueNumbers(candidatePoints.map((p) => p.x));

  const pointMap = new Map<number, MomentPointKind>();
  for (const p of candidatePoints) {
    const key = uniqueX.find((x) => Math.abs(x - p.x) <= POINT_EPS);
    if (key === undefined) continue;

    const existing = pointMap.get(key);
    if (!existing) {
      pointMap.set(key, p.kind);
      continue;
    }

    const priority: Record<MomentPointKind, number> = {
      boundary: 1,
      "load-point": 2,
      "shear-root": 3,
    };

    if (priority[p.kind] > priority[existing]) {
      pointMap.set(key, p.kind);
    }
  }

  const evaluatedPoints: MomentPoint[] = uniqueX.map((x) => ({
    x,
    M: el.computeBendingMomentAt(lc, x),
    isInterior: x > POINT_EPS && x < L - POINT_EPS,
    kind: pointMap.get(x) ?? "boundary",
  }));

  const extrema: MomentPoint[] = [];

  for (let i = 0; i < evaluatedPoints.length; i++) {
    const p = evaluatedPoints[i];
    const prev = evaluatedPoints[i - 1];
    const next = evaluatedPoints[i + 1];

    if (!prev || !next) {
      extrema.push(p);
      continue;
    }

    if (p.kind === "shear-root") {
      extrema.push(p);
      continue;
    }

    const Mp = prev.M;
    const Mc = p.M;
    const Mn = next.M;

    const isLocalMax =
      Mc >= Mp - EPS && Mc >= Mn - EPS && (Mc > Mp + EPS || Mc > Mn + EPS);

    const isLocalMin =
      Mc <= Mp + EPS && Mc <= Mn + EPS && (Mc < Mp - EPS || Mc < Mn - EPS);

    if (isLocalMax || isLocalMin) {
      extrema.push(p);
      continue;
    }

    if (p.kind === "load-point") {
      const leftSlope = Mc - Mp;
      const rightSlope = Mn - Mc;
      const slopeSignChange =
        (leftSlope > EPS && rightSlope < -EPS) || (leftSlope < -EPS && rightSlope > EPS);

      if (slopeSignChange) {
        extrema.push(p);
      }
    }
  }

  const finalExtrema = sortUniqueNumbers(extrema.map((p) => p.x)).map((x) => {
    const found = extrema.find((p) => Math.abs(p.x - x) <= POINT_EPS)!;
    return found;
  });

  let absolute: MomentPoint | null = null;
  let max: MomentPoint | null = null;
  let min: MomentPoint | null = null;

  for (const p of finalExtrema) {
    if (!absolute || Math.abs(p.M) > Math.abs(absolute.M)) {
      absolute = p;
    }
    if (!max || p.M > max.M) {
      max = p;
    }
    if (!min || p.M < min.M) {
      min = p;
    }
  }

  return {
    all: finalExtrema,
    absolute,
    max,
    min,
    isConstant: false,
  };
};

// ========================
// UI data
// ========================

const forceTable = computed(() => {
  if (!element.value) return null;

  try {
    const el = element.value;
    const intervalExpressions = buildIntervalExpressions(el);
    const mergedN = mergeFormulaIntervals(intervalExpressions, "NPoly");
    const mergedV = mergeFormulaIntervals(intervalExpressions, "VPoly");
    const mergedM = mergeFormulaIntervals(intervalExpressions, "MPoly");
    const momentExtrema = getElementMomentExtrema(el);

    const usePiecewise = mergedN.length > 1 || mergedV.length > 1 || mergedM.length > 1;

    return {
      usePiecewise,
      mergedIntervals: {
        N: mergedN.map((item, index, arr) => ({
          from: item.from,
          to: item.to,
          condition: wrapLatex(
            formatIntervalLatex(item.from, item.to, index === arr.length - 1)
          ),
          expr: wrapLatex(`N(x) = ${item.expr}`),
        })),
        V: mergedV.map((item, index, arr) => ({
          from: item.from,
          to: item.to,
          condition: wrapLatex(
            formatIntervalLatex(item.from, item.to, index === arr.length - 1)
          ),
          expr: wrapLatex(`V(x) = ${item.expr}`),
        })),
        M: mergedM.map((item, index, arr) => ({
          from: item.from,
          to: item.to,
          condition: wrapLatex(
            formatIntervalLatex(item.from, item.to, index === arr.length - 1)
          ),
          expr: wrapLatex(`M(x) = ${item.expr}`),
        })),
      },
      extrema: {
        isConstant: momentExtrema.isConstant,
        all: momentExtrema.all.map((p) => ({
          x: p.x,
          M: toKNm(p.M),
          isInterior: p.isInterior,
          kind: p.kind,
          label: pointKindLabel(p.kind),
        })),
        absolute: momentExtrema.absolute
          ? {
              x: momentExtrema.absolute.x,
              M: toKNm(momentExtrema.absolute.M),
              isInterior: momentExtrema.absolute.isInterior,
              kind: momentExtrema.absolute.kind,
              label: pointKindLabel(momentExtrema.absolute.kind),
            }
          : null,
        max: momentExtrema.max
          ? {
              x: momentExtrema.max.x,
              M: toKNm(momentExtrema.max.M),
              isInterior: momentExtrema.max.isInterior,
              kind: momentExtrema.max.kind,
              label: pointKindLabel(momentExtrema.max.kind),
            }
          : null,
        min: momentExtrema.min
          ? {
              x: momentExtrema.min.x,
              M: toKNm(momentExtrema.min.M),
              isInterior: momentExtrema.min.isInterior,
              kind: momentExtrema.min.kind,
              label: pointKindLabel(momentExtrema.min.kind),
            }
          : null,
      },
    };
  } catch (error) {
    console.warn("ElementInternalForces: unable to build analytical expressions", {
      label: props.label,
      error,
    });
    return null;
  }
});
</script>

<template>
  <div class="fill-height analytic-forces-panel" style="overflow: auto">
    <div v-if="forceTable" class="pa-3 analytical-layout">
      <div class="formula-panel">
        <div class="formula-card">
          <div class="formula-card__label">
            {{ tt("elements.normalForce", "Normálová síla") }}
          </div>

          <div
            v-for="(item, index) in forceTable.mergedIntervals.N"
            :key="`N-${index}`"
            class="interval-block"
          >
            <div
              v-if="forceTable.mergedIntervals.N.length > 1"
              class="interval-condition"
              v-html="item.condition"
            ></div>
            <div class="formula-row">
              <div class="formula" v-html="item.expr"></div>
              <div class="unit">[kN]</div>
            </div>
          </div>
        </div>

        <div class="formula-card">
          <div class="formula-card__label">
            {{ tt("elements.shearForce", "Posouvající síla") }}
          </div>

          <div
            v-for="(item, index) in forceTable.mergedIntervals.V"
            :key="`V-${index}`"
            class="interval-block"
          >
            <div
              v-if="forceTable.mergedIntervals.V.length > 1"
              class="interval-condition"
              v-html="item.condition"
            ></div>
            <div class="formula-row">
              <div class="formula" v-html="item.expr"></div>
              <div class="unit">[kN]</div>
            </div>
          </div>
        </div>

        <div class="formula-card formula-card--accent">
          <div class="formula-card__label">
            {{ tt("elements.bendingMoment", "Ohybový moment") }}
          </div>

          <div
            v-for="(item, index) in forceTable.mergedIntervals.M"
            :key="`M-${index}`"
            class="interval-block"
          >
            <div
              v-if="forceTable.mergedIntervals.M.length > 1"
              class="interval-condition"
              v-html="item.condition"
            ></div>
            <div class="formula-row">
              <div class="formula" v-html="item.expr"></div>
              <div class="unit">[kNm]</div>
            </div>
          </div>
        </div>
      </div>

      <template v-if="!forceTable.extrema.isConstant">
        <div class="extrema-grid">
          <div
            v-if="forceTable.extrema.absolute"
            class="extrema-summary extrema-summary--accent"
          >
            <div class="extrema-label">
              {{ tt("elements.absoluteExtremum", "Absolutní extrém") }}
            </div>
            <div class="extrema-value">
              {{ forceTable.extrema.absolute.M.toFixed(3) }} kNm
            </div>
            <div class="extrema-position">
              x = {{ forceTable.extrema.absolute.x.toFixed(3) }} m
            </div>
          </div>

          <div v-if="forceTable.extrema.max" class="extrema-summary">
            <div class="extrema-label">
              {{ tt("elements.globalMaximum", "Globální maximum") }}
            </div>
            <div class="extrema-value">{{ forceTable.extrema.max.M.toFixed(3) }} kNm</div>
            <div class="extrema-position">
              x = {{ forceTable.extrema.max.x.toFixed(3) }} m
            </div>
          </div>

          <div v-if="forceTable.extrema.min" class="extrema-summary">
            <div class="extrema-label">
              {{ tt("elements.globalMinimum", "Globální minimum") }}
            </div>
            <div class="extrema-value">{{ forceTable.extrema.min.M.toFixed(3) }} kNm</div>
            <div class="extrema-position">
              x = {{ forceTable.extrema.min.x.toFixed(3) }} m
            </div>
          </div>
        </div>

        <div v-if="forceTable.extrema.all.length" class="extrema-list">
          <div class="extrema-title">
            <strong>{{ tt("elements.momentExtremaMap", "Mapa extrémů momentu") }}</strong>
            <span class="extrema-title__note">
              {{
                tt(
                  "elements.momentExtremaNote",
                  "Včetně krajních bodů a vnitřních kořenů V(x)"
                )
              }}
            </span>
          </div>

          <div
            v-for="(extreme, index) in forceTable.extrema.all"
            :key="`${extreme.x}-${index}`"
            class="extrema-item"
          >
            <div>
              <div class="extrema-item__index">{{ index + 1 }}.</div>
              <div class="extrema-item__content">
                <div class="extrema-item__main">
                  <strong>M = {{ extreme.M.toFixed(3) }} kNm</strong>
                  <span>x = {{ extreme.x.toFixed(3) }} m</span>
                </div>
                <span class="extrema-meta">
                  {{ extreme.label }},
                  {{
                    extreme.isInterior
                      ? tt("elements.interiorPoint", "vnitřní")
                      : tt("elements.boundaryPoint", "okrajový")
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="constant-state">
        <div class="constant-state__title">
          {{ tt("elements.constantMomentTitle", "Konstantní průběh momentu") }}
        </div>
        <div class="constant-state__text">
          {{
            tt(
              "elements.constantMomentText",
              "Na tomto prvku je moment konstantní, proto se extrémy nevypisují."
            )
          }}
        </div>
      </div>
    </div>

    <div v-else class="text-caption constant-state">
      {{ panelMessage }}
    </div>
  </div>
</template>

<style scoped>
.analytic-forces-panel {
  width: 100%;
  background: radial-gradient(
      circle at top right,
      rgba(18, 100, 171, 0.08),
      transparent 28rem
    ),
    linear-gradient(180deg, rgba(247, 250, 252, 0.96), rgba(255, 255, 255, 0.98));
}

.analytical-layout {
  display: grid;
  gap: 16px;
}

.formula-panel {
  display: grid;
  gap: 12px;
}

.formula-card {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(19, 39, 65, 0.08);
  box-shadow: 0 12px 30px rgba(19, 39, 65, 0.06);
}

.formula-card--accent {
  border-color: rgba(0, 94, 255, 0.18);
  box-shadow: 0 14px 36px rgba(0, 94, 255, 0.1);
}

.formula-card__label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(19, 39, 65, 0.58);
  margin-bottom: 8px;
}

.formula-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.formula {
  font-size: 1.25rem;
  line-height: 1.6;
}

.unit {
  font-size: 0.8rem;
  opacity: 0.75;
  white-space: nowrap;
  padding-bottom: 0.15rem;
}

.interval-block + .interval-block {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(19, 39, 65, 0.12);
}

.interval-condition {
  font-weight: 600;
  color: rgba(19, 39, 65, 0.8);
  margin-bottom: 8px;
}

.extrema-summary {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(19, 39, 65, 0.08);
  box-shadow: 0 12px 30px rgba(19, 39, 65, 0.06);
}

.extrema-summary--accent {
  background: linear-gradient(
    135deg,
    rgba(231, 242, 255, 0.98),
    rgba(255, 255, 255, 0.94)
  );
  border-color: rgba(0, 94, 255, 0.18);
}

.extrema-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.extrema-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(19, 39, 65, 0.58);
  margin-bottom: 4px;
}

.extrema-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.extrema-position {
  font-size: 0.9rem;
  color: rgba(19, 39, 65, 0.72);
}

.extrema-list {
  margin-top: 1rem;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(19, 39, 65, 0.08);
  box-shadow: 0 12px 30px rgba(19, 39, 65, 0.06);
}

.extrema-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 0.75rem;
}

.extrema-title__note {
  font-size: 0.82rem;
  color: rgba(19, 39, 65, 0.55);
}

.extrema-item {
  margin-bottom: 0.45rem;
}

.extrema-item > div {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(246, 248, 251, 0.96),
    rgba(255, 255, 255, 0.98)
  );
  border: 1px solid rgba(19, 39, 65, 0.06);
}

.extrema-item__index {
  min-width: 28px;
  font-weight: 700;
  color: rgba(19, 39, 65, 0.72);
}

.extrema-item__content {
  display: grid;
  gap: 8px;
  width: 100%;
}

.extrema-item__main {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.extrema-meta {
  opacity: 0.7;
  font-size: 0.9em;
}

.constant-state {
  padding: 18px 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px dashed rgba(19, 39, 65, 0.18);
  color: rgba(19, 39, 65, 0.74);
}

.constant-state__title {
  font-weight: 700;
  margin-bottom: 4px;
}

:deep(.katex) {
  font-size: 1.08em;
}

:deep(.katex-display) {
  margin: 0;
}

@media (max-width: 700px) {
  .extrema-title {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
