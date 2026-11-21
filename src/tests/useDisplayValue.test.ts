import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { useAppStore } from '@/store/app';
import { axisConvention } from '@/utils/axisConvention';
import { useDisplayValue } from '@/utils/useDisplayValue';

/**
 * The load tool keeps its values while open. Typed under one set of units and axes, a value must
 * still mean the same load after the settings change: 10 kN down must not turn into 10 kip, or up.
 */
describe('a value typed into a tool', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    axisConvention.value = 'z-down';
  });

  it('starts at a round number in the units on show, down written with the display sign', async () => {
    const down = useDisplayValue('Force', true, 10);
    expect(down.value).toBe('10');
    axisConvention.value = 'y-up';
    await nextTick();
    // The same downward force, now written with y pointing up
    expect(down.value).toBe('-10');
  });

  it('keeps the load it means when the units change', async () => {
    const app = useAppStore();
    const force = useDisplayValue('Force', false, 10);
    force.value = '20';
    await nextTick();
    app.units.Force = 'N';
    await nextTick();
    expect(Number(force.value)).toBeCloseTo(20000);
  });
});
