import {
  addPadding,
  fitBounds,
  isValidBounds,
  resolvePadding,
  type Bounds,
  type FitOptions,
  type FitResult,
  type Padding,
  type ViewBox,
} from './fitBounds';

/**
 * Fit rendered SVG content whose size depends on the zoom level.
 *
 * Every point drawn by the viewer is `model + pixels / zoom`: the geometry lives in
 * model units, while result diagrams, labels, load arrows and supports have a fixed
 * size in screen pixels. The rendered bounding box therefore shrinks (in model units)
 * when zooming in and grows when zooming out, so "measure, then fit the measurement"
 * never lands on the right zoom in one go, and naive repetition converges slowly.
 *
 * Per side the rendered bound is `b(z) = m ± p / z` where `m` is the outermost model
 * coordinate and `p` the pixel overhang beyond it. Both unknowns are recovered from two
 * measurements at different zoom levels (a secant step); the fit is then computed
 * directly for the model bounds with the pixel overhang reserved as padding. The
 * dominating item can change between zoom levels (a label on the left node vs. a
 * diagram peak further inside), so the estimate is verified against a fresh
 * measurement and refined until the rendered box sits inside the padded viewport and
 * touches it on at least one axis. In practice this takes one or two refinements.
 *
 * The solver is DOM-free: the caller applies a view and measures the rendered bounds
 * (in model units) after the view has taken effect.
 */

export interface FitContentOptions extends Omit<FitOptions, 'padding'> {
  padding?: number | Partial<Padding>;
  /**
   * Screen pixels guaranteed free around the *geometry* on every side, for
   * decorations that are not measured (result diagrams hidden via `ignore`). It
   * envelopes the measured overhang rather than stacking on it: labels and supports
   * live in the same band as the diagrams, so a side gets `max(overhang, reserve)`.
   */
  reserve?: number | Partial<Padding>;
  /**
   * Pure model-space bounds (typically node coordinates). Only used to seed the view
   * when nothing is on screen yet; the fit itself relies on measurements alone.
   */
  modelBounds?: Bounds | null;
  /** The view currently shown; its first measurement seeds the estimate. */
  viewBox?: ViewBox | null;
  /** Refinement steps before the best view seen so far is accepted. */
  maxIterations?: number;
  /** Rendered content may miss the padded frame by this many pixels. */
  tolerancePx?: number;
}

export interface FitContentHost {
  /** Show the view. Resolve once the content has been re-rendered for the new zoom. */
  apply: (fit: FitResult) => void | Promise<void>;
  /** Bounding box of the rendered content in model units for the current view. */
  measure: () => Bounds | null;
  /** Return `true` to abandon the fit (a newer fit was started, the viewer unmounted). */
  isCancelled?: () => boolean;
}

export interface FitContentResult extends FitResult {
  /** The rendered content sits inside the padded viewport and fills it on one axis. */
  converged: boolean;
  iterations: number;
}

interface Measurement {
  bounds: Bounds;
  scale: number;
}

interface Estimate {
  bounds: Bounds;
  overhang: Padding;
}

const DEFAULT_MAX_ITERATIONS = 8;
const DEFAULT_TOLERANCE_PX = 0.5;

const ZERO_PADDING: Padding = { top: 0, right: 0, bottom: 0, left: 0 };

const clampOverhang = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

/**
 * A straight beam has zero height, and subtracting the overhang from both sides can
 * leave `max` a few ulps below `min`. Anything narrower than a millionth of a pixel
 * is collapsed to a line rather than rejected as inverted.
 */
const collapseRoundoff = (bounds: Bounds, scale: number): Bounds => {
  const epsilon = 1e-6 / scale;
  const result = { ...bounds };

  if (result.maxX < result.minX && result.minX - result.maxX < epsilon) {
    result.minX = result.maxX = (result.minX + result.maxX) / 2;
  }

  if (result.maxY < result.minY && result.minY - result.maxY < epsilon) {
    result.minY = result.maxY = (result.minY + result.maxY) / 2;
  }

  return result;
};

const maxPadding = (a: Padding, b: Padding): Padding => ({
  top: Math.max(a.top, b.top),
  right: Math.max(a.right, b.right),
  bottom: Math.max(a.bottom, b.bottom),
  left: Math.max(a.left, b.left),
});

/** Two views that differ by less than a thousandth of a pixel anywhere on screen. */
const sameView = (a: FitResult, b: FitResult) => {
  const scale = Math.max(a.scale, b.scale);
  const epsilon = 1e-3;

  return (
    Math.abs(a.scale - b.scale) * Math.max(Math.abs(a.viewBox.w), Math.abs(b.viewBox.w)) < epsilon &&
    Math.abs(a.viewBox.x - b.viewBox.x) * scale < epsilon &&
    Math.abs(a.viewBox.y - b.viewBox.y) * scale < epsilon
  );
};

export const viewBoxToFit = (viewBox: ViewBox | null | undefined, viewportWidth: number): FitResult | null => {
  if (!viewBox) return null;
  if (!(viewBox.w > 0) || !(viewBox.h > 0) || !(viewportWidth > 0)) return null;
  if (!Number.isFinite(viewBox.x) || !Number.isFinite(viewBox.y)) return null;

  return { viewBox: { ...viewBox }, scale: viewportWidth / viewBox.w };
};

/** Rendered bounds converted to pixel positions inside the viewport. */
export const boundsToPixels = (bounds: Bounds, fit: FitResult) => ({
  left: (bounds.minX - fit.viewBox.x) * fit.scale,
  right: (bounds.maxX - fit.viewBox.x) * fit.scale,
  top: (bounds.minY - fit.viewBox.y) * fit.scale,
  bottom: (bounds.maxY - fit.viewBox.y) * fit.scale,
});

export interface FitCheck {
  /** Nothing pokes out of the padded frame. */
  inside: boolean;
  /** The content spans the padded frame on the horizontal or vertical axis. */
  filled: boolean;
}

/**
 * `rendered` must sit inside the padded frame and `geometry` inside the frame shrunk
 * by the reserve; the view is filled when one of them touches its frame on an axis.
 */
export const checkFit = (
  rendered: Bounds,
  fit: FitResult,
  viewportWidth: number,
  viewportHeight: number,
  padding: number | Partial<Padding> | undefined,
  tolerancePx = DEFAULT_TOLERANCE_PX,
  geometry: Bounds = rendered,
  reserve: number | Partial<Padding> | undefined = 0
): FitCheck => {
  const pad = resolvePadding(padding);
  const px = boundsToPixels(rendered, fit);

  const frameLeft = pad.left;
  const frameRight = viewportWidth - pad.right;
  const frameTop = pad.top;
  const frameBottom = viewportHeight - pad.bottom;

  const inside =
    px.left >= frameLeft - tolerancePx &&
    px.right <= frameRight + tolerancePx &&
    px.top >= frameTop - tolerancePx &&
    px.bottom <= frameBottom + tolerancePx;

  const res = resolvePadding(reserve);
  const geo = boundsToPixels(geometry, fit);

  const geometryInside =
    geo.left >= frameLeft + res.left - tolerancePx &&
    geo.right <= frameRight - res.right + tolerancePx &&
    geo.top >= frameTop + res.top - tolerancePx &&
    geo.bottom <= frameBottom - res.bottom + tolerancePx;

  const touches = (box: ReturnType<typeof boundsToPixels>, extra: Padding) =>
    (Math.abs(box.left - frameLeft - extra.left) <= tolerancePx &&
      Math.abs(box.right - frameRight + extra.right) <= tolerancePx) ||
    (Math.abs(box.top - frameTop - extra.top) <= tolerancePx &&
      Math.abs(box.bottom - frameBottom + extra.bottom) <= tolerancePx);

  return {
    inside: inside && geometryInside,
    filled: touches(px, ZERO_PADDING) || touches(geo, res),
  };
};

/**
 * Split a measurement into model bounds and pixel overhang.
 *
 * With a previous measurement at a different zoom the split is exact for every side
 * whose outermost item did not change. A single measurement is taken as is: fitting it
 * as pure geometry is the probe that makes the next split exact. (Node coordinates are
 * deliberately not used here - dimension lines and similar sit in model units beyond
 * the nodes, and at high zoom that distance would be mistaken for thousands of pixels.)
 */
export const estimateExtents = (current: Measurement, previous: Measurement | null): Estimate => {
  const { bounds, scale } = current;

  if (previous && previous.scale > 0 && scale > 0) {
    const du = 1 / scale - 1 / previous.scale;

    // Only trust the secant when the two zoom levels are distinguishable.
    if (Math.abs(du) > 1e-9 * (1 / scale)) {
      // min sides: b = m - p / z  =>  p = -(db / du);  max sides: b = m + p / z  =>  p = db / du
      const left = clampOverhang(-(bounds.minX - previous.bounds.minX) / du);
      const right = clampOverhang((bounds.maxX - previous.bounds.maxX) / du);
      const top = clampOverhang(-(bounds.minY - previous.bounds.minY) / du);
      const bottom = clampOverhang((bounds.maxY - previous.bounds.maxY) / du);

      const estimate = collapseRoundoff(
        {
          minX: bounds.minX + left / scale,
          maxX: bounds.maxX - right / scale,
          minY: bounds.minY + top / scale,
          maxY: bounds.maxY - bottom / scale,
        },
        scale
      );

      if (isValidBounds(estimate)) return { bounds: estimate, overhang: { top, right, bottom, left } };
    }
  }

  return { bounds, overhang: ZERO_PADDING };
};

/**
 * Drive `host` until its rendered content fits the padded viewport.
 *
 * Resolves with the final view (already applied), or `null` when there is nothing to
 * fit, the viewport is empty, or the fit was cancelled.
 */
export const fitRenderedContent = async (
  host: FitContentHost,
  options: FitContentOptions
): Promise<FitContentResult | null> => {
  const { viewportWidth, viewportHeight } = options;

  if (!(viewportWidth > 0) || !(viewportHeight > 0)) return null;

  const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS;
  const tolerancePx = options.tolerancePx ?? DEFAULT_TOLERANCE_PX;
  const modelBounds = isValidBounds(options.modelBounds) ? options.modelBounds : null;
  const fitOptions: FitOptions = {
    viewportWidth,
    viewportHeight,
    fallbackSpan: options.fallbackSpan,
    minZoom: options.minZoom,
    maxZoom: options.maxZoom,
  };

  const reserve = resolvePadding(options.reserve);
  const cancelled = () => host.isCancelled?.() === true;

  const show = async (fit: FitResult) => {
    await host.apply(fit);
    return !cancelled();
  };

  let view = viewBoxToFit(options.viewBox, viewportWidth);

  // Nothing sensible on screen yet: start from the model geometry.
  if (!view) {
    view = fitBounds(modelBounds, { ...fitOptions, padding: options.padding });
    if (!view) return null;
    if (!(await show(view))) return null;
  }

  let previous: Measurement | null = null;
  let best: { fit: FitResult; iterations: number } | null = null;
  let iterations = 0;

  for (;;) {
    const rendered = host.measure();

    if (!isValidBounds(rendered)) {
      // Nothing rendered (empty model): show the model bounds if we have any.
      if (!modelBounds || iterations > 0) return null;

      const fallback = fitBounds(modelBounds, { ...fitOptions, padding: options.padding });
      if (!fallback || !(await show(fallback))) return null;

      return { ...fallback, converged: false, iterations: 1 };
    }

    const current: Measurement = { bounds: rendered, scale: view.scale };
    const estimate = estimateExtents(current, previous);

    const check = checkFit(
      rendered,
      view,
      viewportWidth,
      viewportHeight,
      options.padding,
      tolerancePx,
      estimate.bounds,
      reserve
    );

    if (check.inside && (check.filled || iterations >= maxIterations)) {
      return { ...view, converged: check.filled, iterations };
    }

    // Remember the tightest view that keeps everything visible in case we never converge.
    if (check.inside && (!best || view.scale > best.fit.scale)) best = { fit: view, iterations };

    if (iterations >= maxIterations) break;

    previous = current;

    const next = fitBounds(estimate.bounds, {
      ...fitOptions,
      padding: addPadding(options.padding, maxPadding(estimate.overhang, reserve)),
    });

    if (!next) break;

    // The exact split reproduces the current view, yet the check failed: the padding
    // cannot be honoured (the diagrams alone are larger than the padded frame, or the
    // zoom is clamped). `fitBounds` has already made the best compromise.
    if (sameView(next, view)) return { ...view, converged: false, iterations };

    iterations++;
    view = next;

    if (!(await show(view))) return null;
  }

  // Not converged: fall back to the best view seen, or shrink the last measurement
  // into the frame so that at least nothing is cut off.
  if (best && best.fit !== view) {
    if (!(await show(best.fit))) return null;
    return { ...best.fit, converged: false, iterations };
  }

  if (!best) {
    const rendered = host.measure();
    const safe = isValidBounds(rendered) ? fitBounds(rendered, { ...fitOptions, padding: options.padding }) : null;

    if (safe) {
      if (!(await show(safe))) return null;
      view = safe;
    }
  }

  return { ...view, converged: false, iterations };
};
