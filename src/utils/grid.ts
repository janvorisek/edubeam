import type { LengthUnit } from './unitConversions';

/** A display length unit and its way to and from metres, the model's length. */
export type LengthDisplay = {
  toDisplay: (metres: number) => number;
  toMetres: (display: number) => number;
};

const isImperial = (unit: LengthUnit) => unit === 'ft' || unit === 'in';

/**
 * The snap step a fresh grid starts with, in metres: 0.1 m in metric units, 6 in in US units, a
 * round number of either. A frame of a few metres or a few tens of feet then gets a few dozen
 * snap points along each member.
 */
export const defaultGridStep = (unit: LengthUnit) => (isImperial(unit) ? 0.1524 : 0.1);

/**
 * The grid step to keep when the length unit changes. A step still at the default of the old
 * family becomes the default of the new one: 0.1 m is 0.328 ft, not a step anyone would choose.
 * A step the person set themselves stays.
 */
export const gridStepAfterUnitChange = (step: number, from: LengthUnit, to: LengthUnit) =>
  isImperial(from) !== isImperial(to) && step === defaultGridStep(from) ? defaultGridStep(to) : step;

/**
 * The smallest ruler step of the form d·10ⁿ (d = 1…9) that is at least `min`, in whatever unit
 * `min` is in. Picked in the display unit, the ruler reads 1, 2, 3 ft rather than 0.98, 1.97 ft.
 */
export const rulerStep = (min: number) => {
  const pow10 = 10 ** Math.ceil(Math.log10(min) - 1);

  return Math.ceil(min / pow10) * pow10;
};

/** As many decimals as a step has, so its multiples read exactly; at least two, at most six. */
export const stepDecimals = (step: number) => {
  if (!Number.isFinite(step) || step <= 0) return 3;

  const fraction = String(Number(step.toPrecision(12))).split('.')[1] ?? '';

  return Math.min(Math.max(fraction.length, 2), 6);
};

/**
 * The nearest grid point to a coordinate in metres. Rounded in the display unit, so a point on a
 * half-foot grid is a whole number of half feet: 10.5 ft, not 10.500000000000002 ft.
 */
export const snapToGrid = (metres: number, stepMetres: number, display: LengthDisplay) => {
  const step = Number(display.toDisplay(stepMetres).toPrecision(12));
  const snapped = Number((Math.round(display.toDisplay(metres) / step) * step).toPrecision(12));

  return display.toMetres(snapped);
};

/**
 * A ruler step for a ruler read in feet and inches: 1, 2, 3 or 6 in below a foot, so ticks fall on
 * whole inches and divide the foot, halves down to sixteenths of an inch zoomed in further, and the
 * usual 1, 2, 5… ft above. `min` is in feet.
 */
export const rulerStepFeet = (min: number) => {
  if (min > 0.5) return Math.max(1, rulerStep(min));

  const inches = [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 3, 6].find((step) => step / 12 >= min);

  // Closer than a sixteenth a tick: decimal steps, which the labels still round to a sixteenth
  return inches === undefined ? rulerStep(min * 12) / 12 : inches / 12;
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/**
 * A length in feet as US drawings write it: 5′-6″, 12′, -0′-3 1/4″. Inches are rounded to the
 * nearest sixteenth and written as a reduced fraction.
 */
export const formatFeetInches = (feet: number) => {
  const sixteenths = Math.round(Math.abs(feet) * 12 * 16);
  if (sixteenths === 0) return '0′';

  const sign = feet < 0 ? '-' : '';
  const wholeFeet = Math.floor(sixteenths / (12 * 16));
  const rest = sixteenths - wholeFeet * 12 * 16;

  if (rest === 0) return `${sign}${wholeFeet}′`;

  const wholeInches = Math.floor(rest / 16);
  const fraction = rest % 16;
  const divisor = gcd(fraction, 16);
  const fractionText = fraction === 0 ? '' : `${fraction / divisor}/${16 / divisor}`;
  const inchesText = [wholeInches === 0 && fraction !== 0 ? '' : `${wholeInches}`, fractionText]
    .filter(Boolean)
    .join(' ');

  return `${sign}${wholeFeet}′-${inchesText}″`;
};
