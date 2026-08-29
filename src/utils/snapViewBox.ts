export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SnappedViewBox {
  viewBox: ViewBox;
  scale: number;
  zoom: number;
}

/**
 * Below this many device pixels per model unit the rounding would visibly change
 * the zoom level, so the exact viewBox is used instead.
 */
const MIN_SNAPPED_ZOOM = 8;

/**
 * Round a viewBox so that model geometry lands on whole device pixels.
 *
 * Pan/zoom produces arbitrary floats, so a node at x = 0 ends up at e.g. 579.79px.
 * A 2px non-scaling stroke centered there gets spread over three device columns
 * (0.22/0.98/0.70 coverage) and reads as a grey 1px hairline instead of a solid
 * 2px line. Rounding the zoom to a whole number of device pixels per model unit and
 * the origin to a device pixel puts integer model coordinates back on pixel
 * boundaries.
 *
 * `previousZoom` is the zoom returned by the previous call. When a zoom step is too
 * small to change the rounded zoom the exact one is kept, so that a wheel or pinch
 * gesture never stalls on a single rounded value.
 */
export const snapViewBox = (
  viewBox: ViewBox,
  viewportWidth: number,
  viewportHeight: number,
  previousZoom = 0
): SnappedViewBox => {
  const dpr = window.devicePixelRatio || 1;

  // Nothing to snap against yet - `scale: 0` tells the caller to keep its own value.
  if (!viewportWidth || !viewportHeight || !viewBox.w || !viewBox.h) {
    return { viewBox: { ...viewBox }, scale: 0, zoom: previousZoom };
  }

  // Device pixels per model unit
  let zoom = (viewportWidth / viewBox.w) * dpr;
  const snapped = { ...viewBox };
  const rounded = Math.round(zoom);

  if (rounded >= MIN_SNAPPED_ZOOM && rounded !== previousZoom) {
    zoom = rounded;
    snapped.w = (viewportWidth * dpr) / zoom;
    snapped.h = (viewportHeight * dpr) / zoom;
  }

  snapped.x = Math.round(viewBox.x * zoom) / zoom;
  snapped.y = Math.round(viewBox.y * zoom) / zoom;

  return { viewBox: snapped, scale: viewportWidth / snapped.w, zoom };
};
