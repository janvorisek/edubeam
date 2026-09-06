import { describe, it, expect } from 'vitest';

/**
 * Clicking a load in the drawing opens the loads tab, and the row it opened for should be at the
 * top rather than somewhere down a list of every load in the model — which is what the nodes and
 * elements tables already do.
 *
 * A load carries no label, so it is identified by its position in the list it lives in, and there
 * is one list per kind. That makes the index alone ambiguous: element load 0 and nodal load 0 are
 * different loads, and only the pair (type, index) tells them apart. This pins that down.
 */
type Row = { type: string; index: number };

type Selection = {
  elementLoads: number[];
  nodalLoads: number[];
  prescribedBC: number[];
};

const isLoadSelected = (row: Row, selection: Selection) => {
  if (row.type === 'element') return selection.elementLoads.includes(row.index);
  if (row.type === 'prescribed') return selection.prescribedBC.includes(row.index);

  return selection.nodalLoads.includes(row.index);
};

const order = (rows: Row[], selection: Selection) => [
  ...rows.filter((row) => isLoadSelected(row, selection)),
  ...rows.filter((row) => !isLoadSelected(row, selection)),
];

const rows: Row[] = [
  { type: 'element', index: 0 },
  { type: 'element', index: 1 },
  { type: 'prescribed', index: 0 },
  { type: 'node', index: 0 },
  { type: 'node', index: 1 },
];

const none: Selection = { elementLoads: [], nodalLoads: [], prescribedBC: [] };

describe('the loads table ordering', () => {
  it('leaves the list alone when nothing is selected', () => {
    expect(order(rows, none)).toEqual(rows);
  });

  it('lifts the selected load to the top', () => {
    const first = order(rows, { ...none, nodalLoads: [1] })[0];

    expect(first).toEqual({ type: 'node', index: 1 });
  });

  it('does not lift a load of another kind sharing the index', () => {
    // nodal load 0 is selected; element load 0 and prescribed 0 must stay put
    const ordered = order(rows, { ...none, nodalLoads: [0] });

    expect(ordered[0]).toEqual({ type: 'node', index: 0 });
    expect(ordered.slice(1)).toEqual([
      { type: 'element', index: 0 },
      { type: 'element', index: 1 },
      { type: 'prescribed', index: 0 },
      { type: 'node', index: 1 },
    ]);
  });

  it('keeps every load exactly once', () => {
    const ordered = order(rows, { elementLoads: [1], nodalLoads: [0], prescribedBC: [0] });

    expect(ordered).toHaveLength(rows.length);
    expect(new Set(ordered)).toEqual(new Set(rows));
  });
});
