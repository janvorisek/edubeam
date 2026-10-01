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
