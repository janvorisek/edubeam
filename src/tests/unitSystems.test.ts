import { describe, it, expect, beforeEach } from 'vitest';
import { createApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { suggestUnitSystem, sanitizeUnitChoice, unitSystems, matchUnitSystem } from '../utils/unitSystems';
import { useAppStore } from '@/store/app';

describe('the unit system of a first visit', () => {
  it('is US customary only for a US locale in a US time zone', () => {
    expect(suggestUnitSystem(['en-US'], 'America/Chicago')).toBe('us');
    expect(suggestUnitSystem(['es-US', 'es'], 'America/Los_Angeles')).toBe('us');
    expect(suggestUnitSystem(['en-US'], 'America/Indiana/Indianapolis')).toBe('us');
    expect(suggestUnitSystem(['en-US'], 'Pacific/Honolulu')).toBe('us');
    // English with no region is American English
    expect(suggestUnitSystem(['en'], 'America/New_York')).toBe('us');
  });

  it('is SI for the en-US browser of a student anywhere else', () => {
    expect(suggestUnitSystem(['en-US'], 'Europe/Prague')).toBe('si');
    expect(suggestUnitSystem(['en-US'], 'Asia/Bangkok')).toBe('si');
    expect(suggestUnitSystem(['en-US'], 'America/Toronto')).toBe('si');
    expect(suggestUnitSystem(['cs-CZ', 'en-US'], 'America/New_York')).toBe('si');
    expect(suggestUnitSystem([], 'America/New_York')).toBe('si');
  });
});

describe('units read back from local storage', () => {
  it('keeps every unit this version knows', () => {
    const stored = {
      ...unitSystems.si,
      Length: 'mm',
      Force: 'Tonf',
      Pressure: 'ksc',
      moment: { force: 'lbf', length: 'in' },
    };

    expect(sanitizeUnitChoice(stored, unitSystems.si)).toEqual(stored);
  });

  it('replaces a unit it does not know, and only that one', () => {
    const restored = sanitizeUnitChoice(
      { ...unitSystems.us, Length: 'furlong', AreaM2: 'm3', moment: { force: 'kip', length: 42 } },
      unitSystems.si
    );

    expect(restored.Length).toBe('m');
    expect(restored.AreaM2).toBe('m4');
    expect(restored.moment).toEqual({ force: 'kip', length: 'm' });
    expect(restored.Force).toBe('kip');
  });

  it('fills in what an older version never stored', () => {
    expect(sanitizeUnitChoice({ Force: 'N' }, unitSystems.si)).toEqual({ ...unitSystems.si, Force: 'N' });
  });

  it('shows sections and displacements in the length unit they were shown in before they had their own', () => {
    expect(sanitizeUnitChoice({ Length: 'cm' }, unitSystems.si)).toMatchObject({
      Length: 'cm',
      SectionLength: 'cm',
      Displacement: 'cm',
    });
    // Once chosen, they are their own
    expect(sanitizeUnitChoice({ Length: 'ft', SectionLength: 'in', Displacement: 'mm' }, unitSystems.si)).toMatchObject(
      { Length: 'ft', SectionLength: 'in', Displacement: 'mm' }
    );
  });
});

describe('the app store after a reload', () => {
  beforeEach(() => {
    localStorage.clear();
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    // Pinia applies plugins only once it is installed in an app
    createApp({}).use(pinia);
    setActivePinia(pinia);
  });

  it('restores the units saved by the release before unit systems', () => {
    // As 1.x wrote it: the moment pair apart from the rest, no Temperature choice ever made
    localStorage.setItem(
      'app',
      JSON.stringify({
        locale: 'th',
        units: { Length: 'cm', Area: 'cm2', AreaM2: 'cm4', Mass: 'kg', Force: 'Tonf', Pressure: 'ksc' },
        momentUnits: { force: 'Tonf', length: 'm' },
      })
    );

    const appStore = useAppStore();

    expect(appStore.units.Force).toBe('Tonf');
    expect(appStore.units.Pressure).toBe('ksc');
    expect(appStore.units.Moment).toBe('Tonf·m');
    expect(appStore.units.Temperature).toBe('C');
    // Sections and displacements stay in centimetres, as that release showed them
    expect(appStore.units.SectionLength).toBe('cm');
    expect(appStore.units.Displacement).toBe('cm');
    expect(appStore.convertDisplacement(0.01)).toBeCloseTo(1, 12);
    expect(appStore.convertForce(9806.65)).toBeCloseTo(1, 12);
    expect(appStore.unitSystem).toBeNull();
  });

  it('starts a returning visitor without saved units in SI, whatever their browser', () => {
    localStorage.setItem('app', JSON.stringify({ onboardingFinished: true }));

    expect(matchUnitSystem({ ...useAppStore().units, moment: useAppStore().momentUnits })).toBe('si');
  });
});
