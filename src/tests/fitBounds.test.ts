import { describe, it, expect } from 'vitest';
import { addPadding, boundsFromPoints, centerBounds, fitBounds, isValidBounds } from '@/utils/fitBounds';

const VIEWPORT = { viewportWidth: 800, viewportHeight: 400 };

/** Model coordinate -> pixel position inside the viewport. */
const toPx = (model: number, origin: number, scale: number) => (model - origin) * scale;

describe('boundsFromPoints', () => {
  it('returns null for an empty or non-finite input', () => {
    expect(boundsFromPoints([])).toBeNull();
    expect(boundsFromPoints([[NaN, 0]])).toBeNull();
  });

  it('collapses a single point into a zero sized bounds', () => {
    expect(boundsFromPoints([[2, 3]])).toEqual({ minX: 2, minY: 3, maxX: 2, maxY: 3 });
  });

  it('ignores non-finite points but keeps the finite ones', () => {
    expect(
      boundsFromPoints([
        [0, 0],
        [Infinity, 5],
        [4, 2],
      ])
    ).toEqual({ minX: 0, minY: 0, maxX: 4, maxY: 2 });
  });
});

describe('fitBounds', () => {
  it('fits a wide model against the horizontal padding', () => {
    const bounds = { minX: 0, minY: 0, maxX: 10, maxY: 1 };
    const fit = fitBounds(bounds, { ...VIEWPORT, padding: 50 })!;

    // 800 - 2 * 50 available for 10 model units
    expect(fit.scale).toBeCloseTo(70);
    expect(toPx(bounds.minX, fit.viewBox.x, fit.scale)).toBeCloseTo(50);
    expect(toPx(bounds.maxX, fit.viewBox.x, fit.scale)).toBeCloseTo(750);
  });

  it('fits a tall model against the vertical padding', () => {
    const bounds = { minX: 0, minY: 0, maxX: 1, maxY: 10 };
    const fit = fitBounds(bounds, { ...VIEWPORT, padding: 20 })!;

    // 400 - 2 * 20 available for 10 model units
    expect(fit.scale).toBeCloseTo(36);
    expect(toPx(bounds.minY, fit.viewBox.y, fit.scale)).toBeCloseTo(20);
    expect(toPx(bounds.maxY, fit.viewBox.y, fit.scale)).toBeCloseTo(380);
  });

  it('centers the content inside the padded area', () => {
    const bounds = { minX: -5, minY: -2, maxX: 5, maxY: 2 };
    const fit = fitBounds(bounds, { ...VIEWPORT, padding: 40 })!;

    const centerX = toPx((bounds.minX + bounds.maxX) / 2, fit.viewBox.x, fit.scale);
    const centerY = toPx((bounds.minY + bounds.maxY) / 2, fit.viewBox.y, fit.scale);

    expect(centerX).toBeCloseTo(400);
    expect(centerY).toBeCloseTo(200);
  });

  it('honours asymmetric padding by shifting the content', () => {
    const bounds = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const fit = fitBounds(bounds, { ...VIEWPORT, padding: { top: 100, right: 0, bottom: 0, left: 0 } })!;

    expect(toPx(bounds.minY, fit.viewBox.y, fit.scale)).toBeCloseTo(100);
    expect(toPx(bounds.maxY, fit.viewBox.y, fit.scale)).toBeCloseTo(400);
  });

  it('does not let a degenerate axis constrain the zoom', () => {
    // A single horizontal beam has zero height - only the width may drive the zoom.
    const fit = fitBounds({ minX: 0, minY: 0, maxX: 4, maxY: 0 }, { ...VIEWPORT, padding: 0 })!;

    expect(fit.scale).toBeCloseTo(200);
  });

  it('falls back to a fixed span for a single node', () => {
    const fit = fitBounds({ minX: 3, minY: 3, maxX: 3, maxY: 3 }, { ...VIEWPORT, padding: 0, fallbackSpan: 8 })!;

    expect(fit.scale).toBeCloseTo(100);
    expect(toPx(3, fit.viewBox.x, fit.scale)).toBeCloseTo(400);
  });

  it('never shrinks the padding that reserves the result diagrams', () => {
    // Results scale at the slider maximum: 120 px of diagram on each side plus a label.
    const resultsPadding = 120 + 14;
    const padding = 16 + resultsPadding;
    const viewport = { viewportWidth: 900, viewportHeight: 450 };
    const bounds = { minX: 0, minY: 0, maxX: 3, maxY: 3 };

    const fit = fitBounds(bounds, { ...viewport, padding })!;

    const topPx = toPx(bounds.minY, fit.viewBox.y, fit.scale);
    const bottomPx = toPx(bounds.maxY, fit.viewBox.y, fit.scale);

    // The diagram grows `resultsPadding` px beyond the geometry and has to stay inside.
    expect(topPx - resultsPadding).toBeGreaterThanOrEqual(0);
    expect(bottomPx + resultsPadding).toBeLessThanOrEqual(viewport.viewportHeight);
  });

  it('only clamps padding that is larger than the viewport itself', () => {
    const fit = fitBounds({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, { ...VIEWPORT, padding: 5000 })!;

    expect(fit.scale).toBeGreaterThan(0);
    expect(Number.isFinite(fit.viewBox.w)).toBe(true);
    expect(toPx(5, fit.viewBox.x, fit.scale)).toBeCloseTo(400);
  });

  it('respects maxZoom', () => {
    const fit = fitBounds({ minX: 0, minY: 0, maxX: 0.001, maxY: 0.001 }, { ...VIEWPORT, padding: 0, maxZoom: 1000 })!;

    expect(fit.scale).toBe(1000);
  });

  it('is idempotent - fitting the same bounds twice gives the same viewBox', () => {
    const bounds = { minX: -1, minY: -3, maxX: 7, maxY: 2 };
    const options = { ...VIEWPORT, padding: 64 };

    expect(fitBounds(bounds, options)).toEqual(fitBounds(bounds, options));
  });

  it('returns null for an invalid input', () => {
    expect(fitBounds(null, { ...VIEWPORT, padding: 0 })).toBeNull();
    expect(fitBounds({ minX: 0, minY: 0, maxX: 1, maxY: 1 }, { viewportWidth: 0, viewportHeight: 0 })).toBeNull();
  });
});

describe('addPadding', () => {
  it('sums numbers and partial objects', () => {
    expect(addPadding(10, { top: 5 })).toEqual({ top: 15, right: 10, bottom: 10, left: 10 });
  });
});

describe('centerBounds', () => {
  it('keeps the viewBox size and recenters it', () => {
    const centered = centerBounds({ minX: 0, minY: 0, maxX: 10, maxY: 4 }, { x: 99, y: 99, w: 20, h: 8 })!;

    expect(centered).toEqual({ x: -5, y: -2, w: 20, h: 8 });
  });
});

describe('isValidBounds', () => {
  it('rejects inverted or non-finite bounds', () => {
    expect(isValidBounds({ minX: 1, minY: 0, maxX: 0, maxY: 1 })).toBe(false);
    expect(isValidBounds({ minX: Infinity, minY: 0, maxX: -Infinity, maxY: 1 })).toBe(false);
    expect(isValidBounds({ minX: 0, minY: 0, maxX: 0, maxY: 0 })).toBe(true);
  });
});
