import { describe, it, expect } from 'vitest';
import { createApp, h } from 'vue';
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
});
