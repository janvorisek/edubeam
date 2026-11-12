import { describe, it, expect } from 'vitest';
import { hatchPositions, polynomialDegree, valueAlong } from '@/utils/diagramStyle';

const sample = (f: (x: number) => number) => [0.1, 0.3, 0.5, 0.7, 0.9].map(f);

describe('the degree of a diagram segment', () => {
  it('reads the degree of the polynomial through the values', () => {
    expect(polynomialDegree(sample(() => 12))).toBe(0);
    expect(polynomialDegree(sample((x) => 3 - 2 * x))).toBe(1);
    // a moment under a uniform load: qx(L - x)/2
    expect(polynomialDegree(sample((x) => (10 * x * (4 - x)) / 2))).toBe(2);
    // under a linearly varying load
    expect(polynomialDegree(sample((x) => x ** 3 - 2 * x))).toBe(3);
  });

  it('does not take round-off for a higher degree', () => {
    expect(polynomialDegree(sample((x) => 5 * x + 1e-15 * Math.sin(40 * x)))).toBe(1);
  });

  it('has no degree for a diagram that is zero there', () => {
    expect(polynomialDegree(sample(() => 0))).toBeNull();
  });
});

describe('hatch lines across a diagram', () => {
  // a triangle: 0 at the start, 10 at the end of a 4 m member
  const triangle = [
    [0, 0],
    [4, 10],
  ] as const;

  it('ends each line on the outline as drawn', () => {
    expect(valueAlong(triangle, 2)).toBe(5);
    expect(valueAlong(triangle, -1)).toBe(0);
    expect(valueAlong(triangle, 9)).toBe(10);
  });

  it('spaces them evenly and centres them on the member', () => {
    const lines = hatchPositions(triangle, 4, 1.5, 0);
    expect(lines.map(([x]) => x)).toEqual([0.5, 2, 3.5]);
    expect(lines.map(([, v]) => v)).toEqual([1.25, 5, 8.75]);
  });

  it('leaves out lines too short to see, and keeps a jump between its two sides', () => {
    // a point load at 2 m: the shear jumps from 3 to -1
    const jump = [
      [0, 3],
      [2 - 1e-7, 3],
      [2 + 1e-7, -1],
      [4, -1],
    ] as const;

    expect(hatchPositions(jump, 4, 1, 0).map(([, v]) => v)).toEqual([3, 3, 3, -1, -1]);
    expect(hatchPositions(triangle, 4, 1, 3)).toHaveLength(3);
  });
});
