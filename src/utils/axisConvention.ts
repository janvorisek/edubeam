/**
 * Which way the vertical axis points in everything the user reads or types.
 *
 * The solver always works with x to the right and z down, which is also how the SVG is drawn.
 * `y-up` is the textbook system with x to the right, y up and z toward the viewer. Both keep
 * counter-clockwise rotations and sagging moments positive, so switching between them only
 *
 * - negates vertical components: coordinates, forces, displacements and reactions,
 * - negates angles, which the model measures from x toward z (clockwise on screen),
 * - swaps the letters: the vertical axis z becomes y, and rotations about y become about z.
 *
 * Only the numbers at the UI boundary change; the model, saved files and drawing never do.
 *
 * The setting lives here rather than only in the app store so plain utilities (diagnostics,
 * CSV export) can read it without pulling in the store. The store exposes this very ref,
 * which is what persists it.
 */
import { ref } from 'vue';

export type AxisConvention = 'z-down' | 'y-up';

export const axisConvention = ref<AxisConvention>('z-down');

/** Multiplier taking a vertical component or an angle between the model and the given convention. */
export const verticalSign = (convention: AxisConvention = axisConvention.value) => (convention === 'y-up' ? -1 : 1);

/**
 * A vertical component as the user reads it, or back as the model stores it; negating is its
 * own inverse, so one function serves both directions.
 */
export const vertical = (value: number, convention: AxisConvention = axisConvention.value) => {
  const flipped = value * verticalSign(convention);

  // A zero must not turn into -0, which would print as "-0"; NaN stays NaN for validation to catch.
  return flipped === 0 ? 0 : flipped;
};

/** Angles are measured toward the vertical axis, so they flip with it. */
export const angle = vertical;

// A type rather than an interface, so it passes as translation parameters: {v} and {r}.
export type AxisLetters = {
  /** The vertical axis: z (down) or y (up). Subscript of Dz, Fz, fz, Vz… */
  v: 'z' | 'y';
  /** The out-of-plane axis moments act about: y or z. Subscript of Ry, My… */
  r: 'y' | 'z';
};

export const axisLetters = (convention: AxisConvention = axisConvention.value): AxisLetters =>
  convention === 'y-up' ? { v: 'y', r: 'z' } : { v: 'z', r: 'y' };
