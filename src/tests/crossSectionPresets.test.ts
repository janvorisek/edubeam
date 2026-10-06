import { describe, it, expect } from 'vitest';
import { crossSectionPresets } from '../utils/crossSectionPresets';

const preset = (name: string) => crossSectionPresets.find((p) => p.name === name)!;

describe('the cross-section library', () => {
  /**
   * The radius of gyration r = √(Iy/A) is bounded by where the area sits: a solid circle has
   * r = h/4, the least of these shapes, and no section puts more than all of its area at the
   * extreme fibres, r = h/2. The I-shapes once carried an Iy twenty times too small, r ≈ 0.08 h.
   */
  it('gives every section a radius of gyration between h/4 and h/2', () => {
    for (const { name, a, iy, h } of crossSectionPresets) {
      const r = Math.sqrt(iy / a);
      expect(r, name).toBeGreaterThanOrEqual(h / 4 - 1e-12);
      expect(r, name).toBeLessThanOrEqual(h / 2);
    }
  });

  it('matches the EN tables for the I-shapes', () => {
    // IPE 200: A = 28.48 cm², Iy = 1943 cm⁴
    expect(preset('IPE 200 (approx)').a).toBeCloseTo(28.48e-4, 8);
    expect(preset('IPE 200 (approx)').iy).toBeCloseTo(1943e-8, 10);
  });

  it('works out the hollow sections from their walls', () => {
    // RHS 100x50x3: A = 100·50 − 94·44 = 864 mm², Iy = (50·100³ − 44·94³)/12 = 1 121 192 mm⁴
    expect(preset('RHS 100x50x3 (approx)').a).toBeCloseTo(864e-6, 10);
    expect(preset('RHS 100x50x3 (approx)').iy).toBeCloseTo(1121192e-12, 14);
    // CHS Ø60x3: Iy = π(60⁴ − 54⁴)/64 = 218 780 mm⁴
    expect(preset('CHS Ø60x3 (approx)').iy).toBeCloseTo(218780e-12, 12);
  });

  /**
   * Shear in an I-shape or a tube runs in the walls parallel to the load, so the shear area is
   * that wall area, not most of the section: IPE 200 has h·tw = 200 · 5.6 = 1120 mm² of 2848 mm².
   */
  it('takes the shear area of thin-walled sections from the walls that carry it', () => {
    expect(preset('IPE 200 (approx)').k).toBeCloseTo(1120 / 2848, 6);
    // RHS 100x50x3: 2 · 100 · 3 = 600 mm² of 864 mm²
    expect(preset('RHS 100x50x3 (approx)').k).toBeCloseTo(600 / 864, 6);
    expect(preset('CHS Ø60x3 (approx)').k).toBe(0.5);

    for (const { name, k } of crossSectionPresets) {
      expect(k, name).toBeGreaterThan(0);
      expect(k, name).toBeLessThanOrEqual(0.9);
    }
  });
});
