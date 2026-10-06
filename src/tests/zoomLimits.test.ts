import { describe, expect, it } from 'vitest';
import { limitZoomFactor, modelSpan, ZOOM_RANGE } from '@/utils/zoomLimits';

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
