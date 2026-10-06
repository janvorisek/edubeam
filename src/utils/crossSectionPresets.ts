import type { PresetFamily } from './presetFamily';

/** A library cross-section in SI: A [m²], Iy [m⁴], depth h [m], shear coefficient k [-]. */
export type CrossSectionPreset = {
  readonly family: PresetFamily;
  readonly name: string;
  readonly a: number;
  readonly iy: number;
  readonly h: number;
  readonly k: number;
};

/** Rectangle b × h, bending about the axis parallel to b. */
const rect = (b: number, h: number) => ({ a: b * h, iy: (b * h ** 3) / 12, h });

/** Solid circle of diameter d. */
const circle = (d: number) => ({ a: (Math.PI * d ** 2) / 4, iy: (Math.PI * d ** 4) / 64, h: d });

/**
 * An I-shape from the EN 10365 tables: A [m²] and Iy [m⁴] with root radii included, depth h and
 * web tw [m]. Shear is carried by the web, so the shear area is h·tw, as for the AISC shapes below.
 */
const iShape = (a: number, iy: number, h: number, tw: number) => ({ a, iy, h, k: (h * tw) / a });

/**
 * Hollow rectangle h × b × t with sharp corners, bending about the strong axis. Both walls along
 * the depth carry the shear, 2·h·t.
 */
const rhs = (h: number, b: number, t: number) => {
  const a = h * b - (h - 2 * t) * (b - 2 * t);

  return { a, iy: (b * h ** 3 - (b - 2 * t) * (h - 2 * t) ** 3) / 12, h, k: (2 * h * t) / a };
};

/** Hollow circle of outer diameter d and wall t; a thin tube carries shear on half its area. */
const chs = (d: number, t: number) => ({
  a: (Math.PI * (d ** 2 - (d - 2 * t) ** 2)) / 4,
  iy: (Math.PI * (d ** 4 - (d - 2 * t) ** 4)) / 64,
  h: d,
  k: 0.5,
});

const metricSections: readonly CrossSectionPreset[] = [
  // Rectangular (b x h), k ~= 5/6
  { family: 'metric', name: 'Rect 100x10 mm', ...rect(0.1, 0.01), k: 0.833 },
  { family: 'metric', name: 'Rect 100x20 mm', ...rect(0.1, 0.02), k: 0.833 },
  { family: 'metric', name: 'Rect 200x20 mm', ...rect(0.2, 0.02), k: 0.833 },
  { family: 'metric', name: 'Rect 200x50 mm', ...rect(0.2, 0.05), k: 0.833 },
  // Square, k ~= 5/6
  { family: 'metric', name: 'Square 50x50 mm', ...rect(0.05, 0.05), k: 0.833 },
  { family: 'metric', name: 'Square 100x100 mm', ...rect(0.1, 0.1), k: 0.833 },
  // Circular (solid), k ~= 0.9
  { family: 'metric', name: 'Circular Ø20 mm', ...circle(0.02), k: 0.9 },
  { family: 'metric', name: 'Circular Ø50 mm', ...circle(0.05), k: 0.9 },
  { family: 'metric', name: 'Circular Ø100 mm', ...circle(0.1), k: 0.9 },
  // I-shaped, shear on the web
  { family: 'metric', name: 'IPE 100 (approx)', ...iShape(10.32e-4, 171.0e-8, 0.1, 4.1e-3) },
  { family: 'metric', name: 'IPE 200 (approx)', ...iShape(28.48e-4, 1943e-8, 0.2, 5.6e-3) },
  { family: 'metric', name: 'HEA 100 (approx)', ...iShape(21.24e-4, 349.2e-8, 0.096, 5.0e-3) },
  { family: 'metric', name: 'HEA 200 (approx)', ...iShape(53.83e-4, 3692e-8, 0.19, 6.5e-3) },
  // Hollow rectangular, corner radii neglected
  { family: 'metric', name: 'RHS 100x50x3 (approx)', ...rhs(0.1, 0.05, 0.003) },
  { family: 'metric', name: 'RHS 150x100x5 (approx)', ...rhs(0.15, 0.1, 0.005) },
  // Hollow circular
  { family: 'metric', name: 'CHS Ø60x3 (approx)', ...chs(0.06, 0.003) },
  { family: 'metric', name: 'CHS Ø114x5 (approx)', ...chs(0.114, 0.005) },
];

const IN = 0.0254; // m

/**
 * A wide-flange shape from the AISC Shapes Database v16.0: A [in²], d [in], Ix [in⁴], tw [in].
 * Its shear area is the web, d·tw, as AISC 360 G2 takes it.
 */
const w = (name: string, a: number, d: number, ix: number, tw: number): CrossSectionPreset => ({
  family: 'us',
  name,
  a: a * IN ** 2,
  iy: ix * IN ** 4,
  h: d * IN,
  k: (d * tw) / a,
});

/** A rectangular HSS bent about its depth Ht [in]: shear is carried by both walls, 2·Ht·tdes. */
const hssRect = (name: string, a: number, ht: number, ix: number, tdes: number): CrossSectionPreset => ({
  family: 'us',
  name,
  a: a * IN ** 2,
  iy: ix * IN ** 4,
  h: ht * IN,
  k: (2 * ht * tdes) / a,
});

/** A round HSS of outer diameter OD [in]; a thin tube carries shear on half its area. */
const hssRound = (name: string, a: number, od: number, ix: number): CrossSectionPreset => ({
  family: 'us',
  name,
  a: a * IN ** 2,
  iy: ix * IN ** 4,
  h: od * IN,
  k: 0.5,
});

/** Shapes common in US textbooks and design examples, with their tabulated properties. */
const usSections: readonly CrossSectionPreset[] = [
  w('W8x31', 9.13, 8, 110, 0.285),
  w('W10x33', 9.71, 9.73, 171, 0.29),
  w('W10x49', 14.4, 10, 272, 0.34),
  w('W12x26', 7.65, 12.2, 204, 0.23),
  w('W12x50', 14.6, 12.2, 391, 0.37),
  w('W14x22', 6.49, 13.7, 199, 0.23),
  w('W14x48', 14.1, 13.8, 484, 0.34),
  w('W14x90', 26.5, 14, 999, 0.44),
  w('W16x31', 9.13, 15.9, 375, 0.275),
  w('W16x40', 11.8, 16, 518, 0.305),
  w('W18x35', 10.3, 17.7, 510, 0.3),
  w('W18x50', 14.7, 18, 800, 0.355),
  w('W21x44', 13, 20.7, 843, 0.35),
  w('W21x62', 18.3, 21, 1330, 0.4),
  w('W24x55', 16.2, 23.6, 1350, 0.395),
  w('W24x76', 22.4, 23.9, 2100, 0.44),
  w('W27x84', 24.7, 26.7, 2850, 0.46),
  w('W30x99', 29, 29.7, 3990, 0.52),
  w('W33x130', 38.3, 33.1, 6710, 0.58),
  w('W36x150', 44.3, 35.9, 9040, 0.625),
  hssRect('HSS6x6x1/4', 5.24, 6, 28.6, 0.233),
  hssRect('HSS8x8x3/8', 10.4, 8, 100, 0.349),
  hssRect('HSS8x4x1/4', 5.24, 8, 42.5, 0.233),
  hssRect('HSS10x6x3/8', 10.4, 10, 137, 0.349),
  hssRect('HSS12x8x1/2', 17.2, 12, 333, 0.465),
  hssRound('HSS4.500x0.237', 2.96, 4.5, 6.79),
  hssRound('HSS6.625x0.280', 5.2, 6.625, 26.4),
  hssRound('HSS8.625x0.322', 7.85, 8.625, 68.1),
];

export const crossSectionPresets: readonly CrossSectionPreset[] = [...metricSections, ...usSections];
