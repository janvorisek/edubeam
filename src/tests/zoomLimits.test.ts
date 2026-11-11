import { describe, expect, it } from 'vitest';
import { gestureZoomStep, limitZoomFactor, modelSpan, WHEEL_STEP, wheelZoomStep, ZOOM_RANGE } from '@/utils/zoomLimits';

const frame = { minX: 0, minY: 0, maxX: 10, maxY: 4 };

/** Visible span after `steps` wheel ticks of 5 %, the way SVGPanZoom applies them. */
const scroll = (span: number, steps: number, deltaY: number, bounds = frame): number => {
  for (let i = 0; i < steps; i++) span *= limitZoomFactor(span, 1 + deltaY, bounds);
  return span;
};

describe('zoom limits', () => {
  it('uses the larger model side, with a fallback for a model without extent', () => {
    expect(modelSpan(frame)).toBe(10);
    expect(modelSpan({ minX: 0, minY: 0, maxX: 0, maxY: 6 })).toBe(6);
    expect(modelSpan({ minX: 2, minY: 2, maxX: 2, maxY: 2 })).toBe(10);
    expect(modelSpan(null)).toBe(10);
  });

  it('leaves ordinary zooming untouched', () => {
    expect(limitZoomFactor(12, 1.05, frame)).toBeCloseTo(1.05);
    expect(limitZoomFactor(12, 0.95, frame)).toBeCloseTo(0.95);
  });

  it('stops endless scrolling at the limit in both directions', () => {
    expect(scroll(12, 10_000, 0.05)).toBeCloseTo(10 * ZOOM_RANGE);
    expect(scroll(12, 10_000, -0.05)).toBeCloseTo(10 / ZOOM_RANGE);
  });

  it('can always zoom back from the limit', () => {
    const out = scroll(12, 10_000, 0.05);
    expect(limitZoomFactor(out, 0.95, frame)).toBeCloseTo(0.95);
    const inside = scroll(12, 10_000, -0.05);
    expect(limitZoomFactor(inside, 1.05, frame)).toBeCloseTo(1.05);
  });

  it('does not snap a view the model changed under, but only lets it move towards the range', () => {
    const tiny = { minX: 0, minY: 0, maxX: 0.001, maxY: 0.001 };
    // 12 m visible is far past 1000x a 1 mm model.
    expect(limitZoomFactor(12, 1.05, tiny)).toBe(1);
    expect(limitZoomFactor(12, 0.95, tiny)).toBeCloseTo(0.95);
  });
});

describe('wheel and gesture zoom steps', () => {
  const wheel = (deltaY: number, ctrlKey = false, deltaMode = 0) => wheelZoomStep({ deltaY, ctrlKey, deltaMode });

  it('steps a mouse wheel a notch at a time, whatever its delta', () => {
    expect(wheel(100)).toBe(WHEEL_STEP);
    expect(wheel(-3, false, 1)).toBe(-WHEEL_STEP);
    expect(wheel(0)).toBe(0);
  });

  it('zooms a trackpad pinch by its size, so one pinch does not cross the whole range', () => {
    expect(wheel(2, true)).toBeCloseTo(0.02);
    expect(wheel(-0.5, true)).toBeCloseTo(-0.005);

    // a pinch of 30 reports of 3 px zooms about 2.4 times, not the 4.3 of 30 fixed steps
    let span = 10;
    for (let i = 0; i < 30; i++) span *= 1 + wheel(-3, true);
    expect(10 / span).toBeGreaterThan(2);
    expect(10 / span).toBeLessThan(3);
  });

  it('keeps Ctrl with a mouse wheel at a notch', () => {
    expect(wheel(100, true)).toBe(WHEEL_STEP);
    expect(wheel(-3, true, 1)).toBe(-WHEEL_STEP);
  });

  it("follows Safari's pinch scale from one report to the next", () => {
    // fingers apart: the view shrinks by the ratio, so the drawing grows with the fingers
    expect(1 + gestureZoomStep(1, 2)).toBeCloseTo(0.5);
    expect(1 + gestureZoomStep(2, 1)).toBeCloseTo(2);
    expect(gestureZoomStep(1.5, 1.5)).toBe(0);
    expect(gestureZoomStep(1, 0)).toBe(0);
  });
});
