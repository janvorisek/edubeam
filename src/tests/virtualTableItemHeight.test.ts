import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Virtualisation is silently off without `item-height`.
 *
 * Vuetify reads the item height from that prop alone - `itemHeight = parseFloat(props.itemHeight || 0)`
 * - and gates the whole recalculation path on it:
 *
 *   hasInitialRender = !!(containerRef && markerRef && viewportHeight && itemHeight)
 *   _calculateVisibleItems() { if (!containerRef || !viewportHeight || !itemHeight) return; ... }
 *
 * With no prop the height is 0, so every recalculation returns early and the visible window stays
 * frozen at the value computed once during setup, `ceil(height / 16)`. Nothing throws and the table
 * looks right on load, so the damage only shows later: a row added does not appear, and a bar
 * dragged taller keeps showing the handful of rows the short one held.
 *
 * The nominal value need not be exact - Vuetify measures each rendered row and corrects itself -
 * but it has to be there and non-zero. This guards the prop rather than the number.
 */
const source = readFileSync(resolve(__dirname, '../components/BottomBar.vue'), 'utf8');

/** Each `<v-data-table-virtual ...>` opening tag, attributes included. */
const virtualTables = () => {
  const tags: string[] = [];

  for (const match of source.matchAll(/<v-data-table-virtual\b/g)) {
    const end = source.indexOf('>', match.index);
    tags.push(source.slice(match.index, end));
  }

  return tags;
};

describe('the bottom bar virtual tables', () => {
  it('has virtual tables to check', () => {
    expect(virtualTables().length).toBeGreaterThan(0);
  });

  it('gives every one a non-zero item height', () => {
    for (const tag of virtualTables()) {
      const height = tag.match(/item-height="(\d+(?:\.\d+)?)"/);

      expect(height, `a v-data-table-virtual without item-height:\n${tag}`).not.toBeNull();
      expect(Number(height![1])).toBeGreaterThan(0);
    }
  });
});
