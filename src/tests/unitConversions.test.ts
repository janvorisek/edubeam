import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { unitSize, momentLabel, unitText } from '../utils/unitConversions';
import { useAppStore } from '@/store/app';
import { useViewerStore } from '@/store/viewer';

describe('the size of a unit in SI', () => {
  it('takes the US customary units from their exact definitions', () => {
    // 1 ft = 0.3048 m and 1 lb = 0.45359237 kg exactly; 1 lbf = 1 lb · 9.80665 m/s²
    expect(unitSize.length('ft')).toBe(0.3048);
    expect(unitSize.length('in')).toBe(0.0254);
    expect(unitSize.force('lbf')).toBeCloseTo(4.4482216152605, 13);
    expect(unitSize.force('kip')).toBeCloseTo(4448.2216152605, 10);
    expect(unitSize.pressure('psi')).toBeCloseTo(6894.757293168361, 9);
    expect(unitSize.pressure('ksi')).toBeCloseTo(6894757.293168361, 6);
    expect(unitSize.pressure('psf')).toBeCloseTo(47.88025898033584, 11);
    expect(unitSize.pressure('ksf')).toBeCloseTo(47880.25898033584, 8);
    expect(unitSize.secondMoment('in4')).toBeCloseTo(4.162314256e-7, 16);
    expect(unitSize.area('ft2')).toBeCloseTo(0.09290304, 15);
  });

  it('keeps the metric gravitational units', () => {
    expect(unitSize.force('kgf')).toBe(9.80665);
    expect(unitSize.force('Tonf')).toBeCloseTo(9806.65, 9);
    // 1 ksc = 1 kgf/cm²
    expect(unitSize.pressure('ksc')).toBeCloseTo(98066.5, 6);
  });

  it('treats a temperature as a difference: a degree Fahrenheit is 5/9 K, with no offset', () => {
    expect(unitSize.temperature('C')).toBe(1);
    expect(unitSize.temperature('F')).toBeCloseTo(5 / 9, 15);
    expect(unitSize.thermalExpansion('1/F')).toBeCloseTo(1.8, 15);
  });
});

describe('unit labels', () => {
  it('writes a moment as each practice does', () => {
    expect(momentLabel('kN', 'm')).toBe('kNm');
    expect(momentLabel('N', 'mm')).toBe('Nmm');
    expect(momentLabel('kip', 'ft')).toBe('kip·ft');
    expect(momentLabel('lbf', 'in')).toBe('lbf·in');
    expect(momentLabel('Tonf', 'm')).toBe('Tonf·m');
  });

  it('puts the degree sign on a temperature', () => {
    expect(unitText('F')).toBe('°F');
    expect(unitText('1/F')).toBe('1/°F');
    expect(unitText('kip')).toBe('kip');
  });
});

describe('the app in US customary units', () => {
  beforeEach(() => setActivePinia(createPinia()));

  const inUsUnits = () => {
    const appStore = useAppStore();
    appStore.unitSystem = 'us';
    return appStore;
  };

  it('shows a 6 m beam as 19.685 ft, and reads it back as 6 m', () => {
    const appStore = inUsUnits();

    expect(appStore.convertLength(6)).toBeCloseTo(19.68504, 5);
    expect(appStore.convertInverseLength(appStore.convertLength(6))).toBeCloseTo(6, 12);
  });

  it('matches the AISC values for steel: E = 29 000 ksi is 199.95 GPa', () => {
    const appStore = inUsUnits();

    expect(appStore.convertInversePressure(29000)).toBeCloseTo(199.948e9, -6);
    expect(appStore.convertPressure(200e9)).toBeCloseTo(29007.5, 1);
  });

  it('converts both parts of a compound unit', () => {
    const appStore = inUsUnits();

    // 10 kN/m = 10 000 N/m · 0.3048 m/ft / 4448.22 N/kip = 0.68522 kip/ft
    expect(appStore.units.ForceDistance).toBe('kip/ft');
    expect(appStore.convertForceDistance(10e3)).toBeCloseTo(0.68522, 5);
    // 1 kNm = 1000 N·m / (4448.22 N · 0.3048 m) = 0.73756 kip·ft
    expect(appStore.units.Moment).toBe('kip·ft');
    expect(appStore.convertMoment(1e3)).toBeCloseTo(0.737562, 6);
    // 7850 kg/m³ · 0.3048³ / 0.45359237 = 490.06 lb/ft³
    expect(appStore.units.Density).toBe('lb/ft3');
    expect(appStore.convertDensity(7850)).toBeCloseTo(490.06, 2);
  });

  it('gives a temperature load and the expansion it acts through in °F', () => {
    const appStore = inUsUnits();

    // A rise of 10 K is a rise of 18 °F, not 50 °F
    expect(appStore.convertTemperature(10)).toBeCloseTo(18, 12);
    // Steel, 12e-6/K = 6.67e-6/°F; their product, the strain, is the same in both
    expect(appStore.convertThermalExpansion(12e-6)).toBeCloseTo(6.6667e-6, 9);
    expect(appStore.convertTemperature(10) * appStore.convertThermalExpansion(12e-6)).toBeCloseTo(10 * 12e-6, 15);
  });

  it('draws the frame in feet, and the sections and deflections in inches', () => {
    const appStore = inUsUnits();

    expect(appStore.convertLength(0.3048)).toBeCloseTo(1, 12);
    // A W12 is about 12 in deep, and a deflection of 2.54 mm is 0.1 in
    expect(appStore.convertSectionLength(0.3048)).toBeCloseTo(12, 12);
    expect(appStore.convertDisplacement(2.54e-3)).toBeCloseTo(0.1, 12);
    expect(appStore.convertInverseDisplacement(0.1)).toBeCloseTo(2.54e-3, 15);
  });

  it('moves the default grid to half feet, and back to 0.1 m', () => {
    const appStore = useAppStore();
    const viewerStore = useViewerStore();
    appStore.unitSystem = 'si';
    viewerStore.gridStep = 0.1;

    appStore.unitSystem = 'us';
    expect(appStore.convertLength(viewerStore.gridStep)).toBe(0.5);

    appStore.unitSystem = 'si';
    expect(viewerStore.gridStep).toBe(0.1);
  });

  it('keeps a grid step the person chose', () => {
    const appStore = useAppStore();
    const viewerStore = useViewerStore();
    appStore.unitSystem = 'si';
    viewerStore.gridStep = 0.25;

    appStore.unitSystem = 'us';
    expect(viewerStore.gridStep).toBe(0.25);
  });

  it('knows which system the units are, and calls a mix custom', () => {
    const appStore = inUsUnits();
    expect(appStore.unitSystem).toBe('us');

    appStore.units.Length = 'in';
    expect(appStore.unitSystem).toBeNull();

    appStore.unitSystem = 'si';
    expect(appStore.units.Length).toBe('m');
    expect(appStore.units.Moment).toBe('kNm');
    expect(appStore.unitSystem).toBe('si');
  });
});
