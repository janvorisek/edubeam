import { describe, it, expect } from 'vitest';
import {
  computeSectionProperties,
  createPresetShape,
  deserializeShape,
  isContourSelfIntersecting,
  isShapeValid,
  serializeShape,
  type SectionShape,
} from '@/utils/sectionProperties';

const near = (value: number, expected: number, rel = 1e-9) =>
  expect(Math.abs(value - expected)).toBeLessThanOrEqual(Math.abs(expected) * rel + 1e-15);

describe('computeSectionProperties', () => {
  it('matches closed-form values for a rectangle', () => {
    const b = 0.1;
    const h = 0.3;
    const p = computeSectionProperties(createPresetShape('rectangle', { b, h }));

    near(p.a, b * h);
    near(p.cy, 0);
    near(p.cz, 0);
    near(p.iy, (b * h ** 3) / 12);
    near(p.iz, (h * b ** 3) / 12);
    near(p.iyz, 0);
    near(p.i1, (b * h ** 3) / 12);
    near(p.i2, (h * b ** 3) / 12);
    near(p.h, h);
    near(p.b, b);
    near(p.ry, h / Math.sqrt(12));
  });

  it('is independent of contour orientation and position', () => {
    const cw: SectionShape = {
      contours: [
        {
          points: [
            [1, 1],
            [1, 1.3],
            [1.1, 1.3],
            [1.1, 1],
          ],
        },
      ],
    };
    const p = computeSectionProperties(cw);

    near(p.a, 0.03);
    near(p.cy, 1.05);
    near(p.cz, 1.15);
    near(p.iy, (0.1 * 0.3 ** 3) / 12);
    near(p.iz, (0.3 * 0.1 ** 3) / 12);
  });

  it('subtracts holes', () => {
    const b = 0.2;
    const h = 0.3;
    const t = 0.02;
    const p = computeSectionProperties(createPresetShape('box', { b, h, t }));
    const bi = b - 2 * t;
    const hi = h - 2 * t;

    near(p.a, b * h - bi * hi);
    near(p.iy, (b * h ** 3 - bi * hi ** 3) / 12);
    near(p.iz, (h * b ** 3 - hi * bi ** 3) / 12);
  });

  it('computes an I-section like the sum of three rectangles', () => {
    const b = 0.1;
    const h = 0.2;
    const tw = 0.006;
    const tf = 0.01;
    const p = computeSectionProperties(createPresetShape('iSection', { b, h, tw, tf }));
    const hw = h - 2 * tf;

    near(p.a, 2 * b * tf + hw * tw);
    near(p.iy, (b * h ** 3 - (b - tw) * hw ** 3) / 12);
    near(p.iz, (2 * tf * b ** 3 + hw * tw ** 3) / 12);
  });

  it('finds principal axes of an L-section', () => {
    const p = computeSectionProperties(createPresetShape('lSection', { b: 0.1, h: 0.1, t: 0.01 }));

    // Equal-leg angle: principal axes at 45°, product moment non-zero.
    expect(p.iyz).not.toBe(0);
    near(Math.abs(p.alpha), Math.PI / 4, 1e-9);
    near(p.i1 + p.i2, p.iy + p.iz);
    expect(p.i1).toBeGreaterThan(p.i2);

    // Rotating the section into the principal frame must reproduce i1 and i2.
    const c = Math.cos(p.alpha);
    const s = Math.sin(p.alpha);
    const rotated = computeSectionProperties({
      contours: [
        {
          points: createPresetShape('lSection', { b: 0.1, h: 0.1, t: 0.01 }).contours[0].points.map(([y, z]) => [
            c * y + s * z,
            -s * y + c * z,
          ]),
        },
      ],
    });
    near(rotated.iy, p.i1, 1e-9);
    near(rotated.iz, p.i2, 1e-9);
    near(rotated.iyz, 0, 1);
    expect(Math.abs(rotated.iyz)).toBeLessThan(1e-12);
  });

  it('approximates a circle with many segments', () => {
    const d = 0.1;
    const p = computeSectionProperties(createPresetShape('circle', { d, n: 720 }));
    near(p.a, (Math.PI * d ** 2) / 4, 1e-4);
    near(p.iy, (Math.PI * d ** 4) / 64, 1e-4);
  });
});

describe('shape validation and serialization', () => {
  it('round-trips through the compact format', () => {
    const shape = createPresetShape('box');
    const data = serializeShape(shape);
    expect(JSON.parse(JSON.stringify(data))).toEqual(data);
    expect(deserializeShape(data)).toEqual(shape);
  });

  it('rejects malformed data', () => {
    expect(deserializeShape(null)).toBeNull();
    expect(deserializeShape([])).toBeNull();
    expect(deserializeShape([[[[0, 0]], 0]])).toBeNull();
    expect(
      deserializeShape([
        [
          [
            [0, 0],
            [1, 0],
            [1, 'x'],
          ],
          0,
        ],
      ])
    ).toBeNull();
    expect(
      deserializeShape([
        [
          [
            [0, 0],
            [1, 0],
            [1, 1],
          ],
          2,
        ],
      ])
    ).toBeNull();
  });

  it('flags degenerate shapes', () => {
    expect(isShapeValid(null)).toBe(false);
    expect(isShapeValid({ contours: [] })).toBe(false);
    expect(
      isShapeValid({
        contours: [
          {
            points: [
              [0, 0],
              [1, 0],
              [2, 0],
            ],
          },
        ],
      })
    ).toBe(false);
    expect(isShapeValid(createPresetShape('tSection'))).toBe(true);
  });

  it('rejects self-intersecting contours', () => {
    const bowTie: [number, number][] = [
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 1],
    ];
    expect(isContourSelfIntersecting(bowTie)).toBe(true);
    expect(isShapeValid({ contours: [{ points: bowTie }] })).toBe(false);

    const square: [number, number][] = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    expect(isContourSelfIntersecting(square)).toBe(false);
    expect(isContourSelfIntersecting(createPresetShape('iSection').contours[0].points)).toBe(false);
    expect(isContourSelfIntersecting(createPresetShape('circle', { n: 64 }).contours[0].points)).toBe(false);
  });
});
