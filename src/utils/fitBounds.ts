export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FitResult {
  viewBox: ViewBox;
  /** Pixels per model unit. */
  scale: number;
}

export interface FitOptions {
  viewportWidth: number;
  viewportHeight: number;
  /** Space reserved around the content, in screen pixels. */
  padding?: number | Partial<Padding>;
  /** Model span used when the content has no extent at all (a single node). */
  fallbackSpan?: number;
  minZoom?: number;
  maxZoom?: number;
}

/**
 * Everything drawn on top of the model geometry - labels, supports, load arrows,
 * result diagrams - has a size in screen pixels, not in model units. Fitting to the
 * rendered bounding box therefore feeds the zoom back into the bounding box and the
 * view oscillates. Fitting node coordinates (or any other purely model-space bounds)
 * and reserving the decorations as pixel padding makes the result a single stable
 * computation instead.
 */

const DEFAULT_FALLBACK_SPAN = 10;
const DEFAULT_MIN_ZOOM = 1e-6;
const DEFAULT_MAX_ZOOM = 1e6;
/**
 * Last resort guard: the content keeps at least this many pixels so the zoom stays
 * finite. Padding is otherwise never scaled down - it carries the pixel size of the
 * result diagrams, and shrinking it draws them off screen.
 */
const MIN_CONTENT_PX = 8;

export const resolvePadding = (padding: number | Partial<Padding> | undefined): Padding => {
  if (typeof padding === 'number') {
    const value = Number.isFinite(padding) ? padding : 0;
    return { top: value, right: value, bottom: value, left: value };
  }

  return {
    top: padding?.top ?? 0,
    right: padding?.right ?? 0,
    bottom: padding?.bottom ?? 0,
    left: padding?.left ?? 0,
  };
};

export const addPadding = (a: number | Partial<Padding> | undefined, b: number | Partial<Padding> | undefined) => {
  const pa = resolvePadding(a);
  const pb = resolvePadding(b);

  return {
    top: pa.top + pb.top,
    right: pa.right + pb.right,
    bottom: pa.bottom + pb.bottom,
    left: pa.left + pb.left,
  };
};

export const isValidBounds = (bounds: Bounds | null | undefined): bounds is Bounds => {
  if (!bounds) return false;

  return (
    Number.isFinite(bounds.minX) &&
    Number.isFinite(bounds.minY) &&
    Number.isFinite(bounds.maxX) &&
    Number.isFinite(bounds.maxY) &&
    bounds.maxX >= bounds.minX &&
    bounds.maxY >= bounds.minY
  );
};

export const boundsFromPoints = (points: Iterable<readonly [number, number]>): Bounds | null => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const bounds = { minX, minY, maxX, maxY };

  return isValidBounds(bounds) ? bounds : null;
};

export const mergeBounds = (a: Bounds | null, b: Bounds | null): Bounds | null => {
  if (!isValidBounds(a)) return isValidBounds(b) ? b : null;
  if (!isValidBounds(b)) return a;

  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
};

/** Only kicks in when the padding alone is larger than the viewport. */
const clampPaddingPair = (near: number, far: number, size: number): [number, number] => {
  const a = Math.max(near, 0);
  const b = Math.max(far, 0);
  const total = a + b;
  const limit = Math.max(size - MIN_CONTENT_PX, 0);

  if (total <= limit || total === 0) return [a, b];

  const factor = limit / total;

  return [a * factor, b * factor];
};

/**
 * Compute the viewBox that shows `bounds` centered in the viewport, with `padding`
 * screen pixels kept free on every side.
 */
export const fitBounds = (bounds: Bounds | null | undefined, options: FitOptions): FitResult | null => {
  const { viewportWidth, viewportHeight } = options;

  if (!isValidBounds(bounds)) return null;
  if (!Number.isFinite(viewportWidth) || !Number.isFinite(viewportHeight)) return null;
  if (viewportWidth <= 0 || viewportHeight <= 0) return null;

  const padding = resolvePadding(options.padding);
  const [left, right] = clampPaddingPair(padding.left, padding.right, viewportWidth);
  const [top, bottom] = clampPaddingPair(padding.top, padding.bottom, viewportHeight);

  const availableWidth = Math.max(viewportWidth - left - right, MIN_CONTENT_PX);
  const availableHeight = Math.max(viewportHeight - top - bottom, MIN_CONTENT_PX);

  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  const fallbackSpan = options.fallbackSpan ?? DEFAULT_FALLBACK_SPAN;

  // A degenerate axis (all nodes on one line) must not constrain the zoom.
  const zoomX = width > 1e-9 ? availableWidth / width : Infinity;
  const zoomY = height > 1e-9 ? availableHeight / height : Infinity;

  let zoom = Math.min(zoomX, zoomY);

  if (!Number.isFinite(zoom)) zoom = availableWidth / Math.max(fallbackSpan, 1e-9);

  zoom = Math.min(Math.max(zoom, options.minZoom ?? DEFAULT_MIN_ZOOM), options.maxZoom ?? DEFAULT_MAX_ZOOM);

  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  // Pixel position inside the viewport where the content center has to land.
  const anchorX = left + availableWidth / 2;
  const anchorY = top + availableHeight / 2;

  return {
    viewBox: {
      x: centerX - anchorX / zoom,
      y: centerY - anchorY / zoom,
      w: viewportWidth / zoom,
      h: viewportHeight / zoom,
    },
    scale: zoom,
  };
};

/** Reposition an existing viewBox so that `bounds` sits in the middle of it. */
export const centerBounds = (bounds: Bounds | null | undefined, viewBox: ViewBox): ViewBox | null => {
  if (!isValidBounds(bounds)) return null;
  if (!(viewBox.w > 0) || !(viewBox.h > 0)) return null;

  return {
    ...viewBox,
    x: (bounds.minX + bounds.maxX) / 2 - viewBox.w / 2,
    y: (bounds.minY + bounds.maxY) / 2 - viewBox.h / 2,
  };
};
