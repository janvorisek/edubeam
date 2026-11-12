/**
 * How the internal force diagrams are drawn. Display only: the results are the same either way.
 *
 * Conventions differ between schools. A moment diagram is drawn on the tension side in most of
 * Europe and on the compression side in many other places; normal and shear forces have no side of
 * their own, so some courses put the positive values on the side of the dashed line (the bottom
 * fibres, where a positive moment is tension) and others on the opposite one.
 */
export type DiagramFill = 'solid' | 'hatch' | 'none';

export interface DiagramStyle {
  /** Positive N(x) on the side of the dashed line; off, on the side away from it. */
  normalOnDashedSide: boolean;
  /** Positive V(x) on the side of the dashed line; off, on the side away from it. */
  shearOnDashedSide: boolean;
  /** M(x) on the tension side; off, on the compression side. */
  momentOnTensionSide: boolean;
  /** Solid tint, lines across the member as drawn by hand, or the outline alone. */
  fill: DiagramFill;
  /** Write the polynomial degree on each segment of a diagram: 0°, 1°, 2°, 3°. */
  showDegrees: boolean;
}

/** The drawing as it was before these were settings. */
export const DEFAULT_DIAGRAM_STYLE: Readonly<DiagramStyle> = {
  normalOnDashedSide: false,
  shearOnDashedSide: false,
  momentOnTensionSide: true,
  fill: 'solid',
  showDegrees: false,
};

/** Hatch lines are this far apart on screen, whatever the zoom. */
export const HATCH_SPACING_PX = 7;

/** A diagram as drawn: positions along the member (sorted) with the value there. */
export type DiagramSamples = readonly (readonly [position: number, value: number])[];

/**
 * The value of the drawn diagram at `position`, interpolated between the samples the outline is
 * drawn through, so a hatch line ends exactly on the outline.
 */
export const valueAlong = (samples: DiagramSamples, position: number): number => {
  if (samples.length === 0) return 0;
  if (position <= samples[0][0]) return samples[0][1];

  for (let i = 1; i < samples.length; i++) {
    const [s1, v1] = samples[i];
    if (position <= s1) {
      const [s0, v0] = samples[i - 1];
      // A point load is drawn as a jump between two samples a hair apart; a line that lands in
      // between takes the side it comes from rather than stopping halfway up the jump.
      return s1 - s0 < 1e-6 ? v0 : v0 + ((v1 - v0) * (position - s0)) / (s1 - s0);
    }
  }

  return samples[samples.length - 1][1];
};

/**
 * Where the hatch lines of a member of length `length` go, `spacing` apart and centred on it, with
 * the diagram's value there. Lines that would be too short to see are left out.
 */
export const hatchPositions = (samples: DiagramSamples, length: number, spacing: number, minimum: number) => {
  if (!(spacing > 0) || !(length > 0)) return [];

  const count = Math.floor(length / spacing);
  const start = (length - count * spacing) / 2;
  const lines: [position: number, value: number][] = [];

  for (let i = 0; i <= count; i++) {
    const position = start + i * spacing;
    const value = valueAlong(samples, position);
    if (Math.abs(value) >= minimum) lines.push([position, value]);
  }

  return lines;
};

/**
 * The degree of the polynomial through equally spaced `values`, 0 to 3 - or null when they are all
 * zero. Taken from finite differences rather than from the loads, so a moment that a zero shear
 * keeps constant reads 0°, not the 1° its unloaded segment would suggest.
 */
export const polynomialDegree = (values: readonly number[]): number | null => {
  const scale = Math.max(...values.map(Math.abs));
  if (!(scale > 0)) return null;

  // Round-off in the solved values is far below this; any real term is far above it.
  const tolerance = 1e-8 * scale;

  let differences = [...values];
  let degree = 0;

  for (let order = 1; order <= 3 && differences.length > 1; order++) {
    differences = differences.slice(1).map((v, i) => v - differences[i]);
    if (differences.some((d) => Math.abs(d) > tolerance)) degree = order;
  }

  return degree;
};
