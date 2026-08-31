import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { useAppStore } from '@/store/app';

/**
 * Distributed load intensities are stored in N/m and shown in the selected force and length
 * units, so both parts of the unit have to be converted.
 */
describe('force per length conversion', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('converts both parts of the unit', async () => {
    const appStore = useAppStore();

    // defaults: kN/m
    expect(appStore.convertForceDistance(1000)).toBeCloseTo(1, 9);

    appStore.units.Length = 'mm';
    await nextTick();

    // 1 kN/m is 0.001 kN/mm
    expect(appStore.units.ForceDistance).toBe('kN/mm');
    expect(appStore.convertForceDistance(1000)).toBeCloseTo(0.001, 12);
  });

  it('converts the force part on its own', async () => {
    const appStore = useAppStore();

    appStore.units.Force = 'N';
    await nextTick();

    expect(appStore.units.ForceDistance).toBe('N/m');
    expect(appStore.convertForceDistance(1000)).toBeCloseTo(1000, 9);
  });

  it('round trips through the displayed value', async () => {
    const appStore = useAppStore();

    for (const [force, length] of [
      ['kN', 'm'],
      ['kN', 'mm'],
      ['N', 'cm'],
      ['kgf', 'mm'],
    ]) {
      appStore.units.Force = force;
      appStore.units.Length = length;
      await nextTick();

      const stored = 12345.678;
      const shown = appStore.convertForceDistance(stored);

      expect(appStore.convertInverseForceDistance(shown)).toBeCloseTo(stored, 6);
    }
  });
});
