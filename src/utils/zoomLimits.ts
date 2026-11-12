import type { Bounds } from '@/utils/fitBounds';

/**
 * How far past the model's own size the view may zoom, either way. A 10 m frame can be zoomed in
 * to 1 cm across the screen or out to 10 km, which no one needs to exceed; without a limit the
 * wheel keeps multiplying the viewBox until floats lose the drawing and the view cannot recover.
 */
export const ZOOM_RANGE = 1000;

/** Span assumed for a model with no extent (empty, a single node), in metres. */
const FALLBACK_SPAN = 10;

/** Larger side of the model, in model units (m). */
export const modelSpan = (bounds: Bounds | null): number => {
  if (!bounds) return FALLBACK_SPAN;
  const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  return Number.isFinite(span) && span > 1e-9 ? span : FALLBACK_SPAN;
};

/**
 * Scale factor for the viewBox size that keeps the visible span (larger viewBox side, model units)
 * within `ZOOM_RANGE` of the model span. A zoom that would cross the limit stops exactly at it.
 * A view already outside the range (the model changed under it) is never snapped back; it can only
 * move towards the range.
 */
export const limitZoomFactor = (visibleSpan: number, factor: number, bounds: Bounds | null): number => {
  if (!(visibleSpan > 0) || !(factor > 0)) return 1;

  const span = modelSpan(bounds);
  const minSpan = Math.min(span / ZOOM_RANGE, visibleSpan);
  const maxSpan = Math.max(span * ZOOM_RANGE, visibleSpan);
  const next = Math.min(Math.max(visibleSpan * factor, minSpan), maxSpan);

  return next / visibleSpan;
};

/** The most one wheel event zooms: a notch of a mouse wheel, 5 %. */
export const WHEEL_STEP = 0.05;

/**
 * How far one wheel event zooms, as the `deltaY` that `zoom` takes (positive zooms out).
 *
 * A mouse wheel moves in notches, and each one is a fixed step. A trackpad pinch arrives in Chrome and
 * Firefox as a stream of Ctrl+wheel events of a few pixels each, sixty a second; a fixed step for every
 * one of them flew through the whole zoom range in one pinch. Those zoom by their size instead, capped
 * at a notch, so Ctrl with a mouse wheel still steps the way it did.
 */
export const wheelZoomStep = (e: Readonly<Pick<WheelEvent, 'deltaY' | 'deltaMode' | 'ctrlKey'>>): number => {
  if (!e.ctrlKey) return Math.sign(e.deltaY) * WHEEL_STEP;

  // Lines and pages, which only a real wheel reports, are taken as the notches they are.
  const pixels = e.deltaMode === 0 ? e.deltaY : Math.sign(e.deltaY) * 100;

  return Math.max(-WHEEL_STEP, Math.min(WHEEL_STEP, pixels * 0.01));
};

/**
 * The `deltaY` for one report of Safari's pinch gesture. Its `scale` is the pinch so far, relative to
 * where it started, so each report zooms by how much it changed since the previous one.
 */
export const gestureZoomStep = (previousScale: number, scale: number): number =>
  scale > 0 && previousScale > 0 ? previousScale / scale - 1 : 0;
