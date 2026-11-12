import { describe, it, expect, beforeEach } from 'vitest';
import { createApp, h, nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { changeItem, changeSetArrayItem } from '../utils';

/** Renders an input bound with `:value`, exactly like the inline fields in the bottom bar. */
const renderBoundInput = (displayValue: string) => {
  const host = document.createElement('div');
  createApp({
    render: () => h('input', { value: displayValue }),
  }).mount(host);

  return host.querySelector('input') as HTMLInputElement;
};

describe('inline edit fields', () => {
  it('restores the displayed value when an array entry is invalid', () => {
    // 1500 N stored, shown as 1.5 kN
    const item = { values: [1500] };
    const el = renderBoundInput('1.5');

    el.value = 'not a number';
    changeSetArrayItem(item, 'values', 0, el, (v) => v * 1000);

    expect(el.value).toBe('1.5');
    expect(item.values[0]).toBe(1500);
  });

  it('restores the displayed value when a property is invalid', () => {
    // 2.1e11 Pa stored, shown as 210000 MPa
    const item = { e: 2.1e11 };
    const el = renderBoundInput('210000');

    el.value = '-';
    changeItem(item, 'e', el, (v) => v * 1e6);

    expect(el.value).toBe('210000');
    expect(item.e).toBe(2.1e11);
  });

  describe('committing', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('puts the value back when the field is left empty, rather than saving zero', () => {
      // A coordinate cleared to retype it and left: saved as 0, it moved the node onto another one.
      const item = { coords: [6, 0, 0] };
      const el = renderBoundInput('6');

      el.value = '';
      changeSetArrayItem(item, 'coords', 0, el);

      expect(el.value).toBe('6');
      expect(item.coords[0]).toBe(6);
    });

    it('works out a sum and shows its result, not what was typed', async () => {
      const item = { coords: [6, 0, 0] };
      const el = renderBoundInput('6');

      el.value = '1/2';
      changeSetArrayItem(item, 'coords', 0, el);
      expect(item.coords[0]).toBe(0.5);

      // The rendered value did not change here (the stub renders a constant), so what the field
      // shows afterwards is what was last rendered - never the typed sum.
      await nextTick();
      expect(el.value).not.toBe('1/2');
    });

    it('takes the whole entry or none of it: 2+2 is 4, not 22', () => {
      const item = { e: 1 };
      const el = renderBoundInput('1');

      el.value = '2+2';
      changeItem(item, 'e', el);

      expect(item.e).toBe(4);
    });
  });
});
