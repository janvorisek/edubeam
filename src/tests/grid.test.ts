import { describe, it, expect } from 'vitest';
import { fromSI } from '../utils/unitConversions';
import {
  defaultGridStep,
  formatFeetInches,
  gridStepAfterUnitChange,
  rulerStep,
  rulerStepFeet,
  snapToGrid,
  stepDecimals,
} from '../utils/grid';

const feet = { toDisplay: (m: number) => fromSI(m, 0.3048), toMetres: (ft: number) => ft * 0.3048 };
const metres = { toDisplay: (m: number) => m, toMetres: (m: number) => m };

describe('the grid', () => {
  it('starts at 0.1 m in metric units and 6 in in US units', () => {
    expect(defaultGridStep('m')).toBe(0.1);
    expect(defaultGridStep('mm')).toBe(0.1);
    expect(feet.toDisplay(defaultGridStep('ft'))).toBeCloseTo(0.5, 12);
  });

  it('moves a default step to the new unit family, and leaves a chosen one', () => {
    expect(gridStepAfterUnitChange(0.1, 'm', 'ft')).toBe(0.1524);
    expect(gridStepAfterUnitChange(0.1524, 'in', 'cm')).toBe(0.1);
    // within a family the default already fits
    expect(gridStepAfterUnitChange(0.1, 'm', 'mm')).toBe(0.1);
    expect(gridStepAfterUnitChange(0.25, 'm', 'ft')).toBe(0.25);
  });

  it('picks ruler steps that are round in the unit on screen', () => {
    expect(rulerStep(0.37)).toBeCloseTo(0.4, 12);
    expect(rulerStep(1)).toBe(1);
    expect(rulerStep(2.2)).toBe(3);
    expect(rulerStep(1.3e-3)).toBeCloseTo(2e-3, 15);
  });

  it('writes as many decimals as the step needs', () => {
    expect(stepDecimals(1)).toBe(2);
    expect(stepDecimals(0.5)).toBe(2);
    expect(stepDecimals(0.005)).toBe(3);
    expect(stepDecimals(0.1 + 0.2)).toBe(2);
  });

  it('snaps to whole steps of the display unit', () => {
    const halfFoot = 0.1524;
    // 10.4 ft lands on 10.5 ft, and reads back as exactly that
    const snapped = snapToGrid(10.4 * 0.3048, halfFoot, feet);
    expect(feet.toDisplay(snapped)).toBe(10.5);

    // metric snapping is what it was
    expect(snapToGrid(0.26, 0.1, metres)).toBeCloseTo(0.3, 15);
    expect(snapToGrid(-0.04, 0.1, metres)).toBeCloseTo(0, 15);
  });

  it('reads every half foot of a long frame back exactly', () => {
    for (let k = 0; k <= 400; k++) {
      const ft = k / 2;
      expect(feet.toDisplay(snapToGrid(ft * 0.3048 + 0.01, 0.1524, feet))).toBe(ft);
    }
  });

  it('writes feet and inches as US drawings do', () => {
    expect(formatFeetInches(5.5)).toBe('5′-6″');
    expect(formatFeetInches(12)).toBe('12′');
    expect(formatFeetInches(0)).toBe('0′');
    expect(formatFeetInches(-2.25)).toBe('-2′-3″');
    expect(formatFeetInches(0.25 / 12)).toBe('0′-1/4″');
    expect(formatFeetInches(1 + 3.25 / 12)).toBe('1′-3 1/4″');
    // a value just off a whole foot from the conversion still reads as that foot
    expect(formatFeetInches(9.999999999)).toBe('10′');
    expect(formatFeetInches(-1e-12)).toBe('0′');
  });

  it('steps a feet-and-inches ruler by inches that divide the foot', () => {
    expect(rulerStepFeet(0.05) * 12).toBeCloseTo(1, 12);
    expect(rulerStepFeet(0.2) * 12).toBeCloseTo(3, 12);
    expect(rulerStepFeet(0.4) * 12).toBeCloseTo(6, 12);
    expect(rulerStepFeet(0.7)).toBe(1);
    expect(rulerStepFeet(1.6)).toBe(2);
    // zoomed in, by halves of an inch down to a sixteenth
    expect(rulerStepFeet(0.03) * 12).toBeCloseTo(0.5, 12);
    expect(rulerStepFeet(0.004) * 12).toBeCloseTo(1 / 16, 12);
  });
});
