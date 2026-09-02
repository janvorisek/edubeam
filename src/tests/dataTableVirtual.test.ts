import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { createVuetify } from 'vuetify';
import { VDataTable, VDataTableVirtual } from 'vuetify/components';

/**
 * The bottom bar tables list the whole model, so they render the rows the viewport can show rather
 * than one per entity. This pins that down for the Vuetify build in use: a plain table renders a
 * row per item, a virtual one does not.
 */
const items = Array.from({ length: 400 }, (_, i) => ({ label: String(i + 1), x: i, z: -i }));

const headers = [
  { title: 'Label', key: 'label' },
  { title: 'X', key: 'x' },
  { title: 'Z', key: 'z' },
];

const rowsOf = (component: typeof VDataTable | typeof VDataTableVirtual, extra: Record<string, unknown>) => {
  const wrapper = mount(
    { render: () => h(component as never, { items, headers, height: 300, density: 'compact', ...extra }) },
    { global: { plugins: [createVuetify()] }, attachTo: document.body }
  );

  return wrapper.findAll('tbody tr').length;
};

describe('the bottom bar tables', () => {
  it('renders a row per item without virtualisation', () => {
    expect(rowsOf(VDataTable, { itemsPerPage: -1 })).toBe(items.length);
  });

  it('renders only a window of rows when virtualised', () => {
    const rows = rowsOf(VDataTableVirtual, {});

    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThan(items.length / 2);
  });
});
