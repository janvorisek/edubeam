import { describe, it, expect } from 'vitest';
import { boundsFromPoints, type Bounds, type FitResult, type Padding, type ViewBox } from '@/utils/fitBounds';
import { checkFit, estimateExtents, fitRenderedContent, type FitContentOptions } from '@/utils/fitContent';

/** Something drawn at a model anchor with a fixed pixel offset (label, diagram peak, arrow tip). */
interface Item {
  x: number;
  y: number;
  px?: number;
  py?: number;
}

/** Rendered bounds in model units at a given zoom, exactly as the SVG components draw them. */
const render = (items: Item[], scale: number): Bounds | null =>
  boundsFromPoints(items.map((i) => [i.x + (i.px ?? 0) / scale, i.y + (i.py ?? 0) / scale] as const));

const expectOverhang = (actual: Padding, expected: Padding) => {
  for (const side of Object.keys(expected) as (keyof Padding)[]) expect(actual[side]).toBeCloseTo(expected[side]);
};

const modelBoundsOf = (items: Item[]) => boundsFromPoints(items.map((i) => [i.x, i.y] as const));

interface Simulation {
  result: Awaited<ReturnType<typeof fitRenderedContent>>;
  applied: FitResult[];
  rendered: Bounds | null;
}

const simulate = async (
  items: Item[],
  options: Omit<FitContentOptions, 'viewportWidth' | 'viewportHeight'> & {
    viewportWidth?: number;
    viewportHeight?: number;
  },
  initialViewBox: ViewBox | null = { x: -50, y: -50, w: 100, h: 50 }
): Promise<Simulation> => {
  const viewportWidth = options.viewportWidth ?? 800;
  const viewportHeight = options.viewportHeight ?? 400;

  let current: FitResult | null = initialViewBox
    ? { viewBox: initialViewBox, scale: viewportWidth / initialViewBox.w }
    : null;

  const applied: FitResult[] = [];

  const result = await fitRenderedContent(
    {
      apply: (fit) => {
        current = fit;
        applied.push(fit);
      },
      measure: () => (current ? render(items, current.scale) : null),
    },
    { ...options, viewportWidth, viewportHeight, viewBox: initialViewBox }
  );

  return { result, applied, rendered: current ? render(items, (current as FitResult).scale) : null };
};

const expectFitted = (sim: Simulation, viewportWidth = 800, viewportHeight = 400, padding = 0) => {
  expect(sim.result).not.toBeNull();
  expect(sim.result!.converged).toBe(true);

  const check = checkFit(sim.rendered!, sim.result!, viewportWidth, viewportHeight, padding, 0.5);
  expect(check.inside).toBe(true);
  expect(check.filled).toBe(true);
};

// A 6 m beam with a bending moment diagram peaking 64 px below mid-span, node labels,
// support symbols and a reaction arrow - the typical edubeam screen.
const BEAM: Item[] = [
  { x: 0, y: 0, px: -14, py: -14 }, // node 1 label
  { x: 0, y: 0, py: 24 }, // support
  { x: 6, y: 0, px: 14, py: -14 }, // node 2 label
  { x: 6, y: 0, py: 24 },
  { x: 3, y: 0, py: 64 + 16 }, // diagram peak plus its value label
  { x: 3, y: 0, py: -40 }, // distributed load arrows
];

describe('estimateExtents', () => {
  it('recovers model bounds and pixel overhang exactly from two measurements', () => {
    const b1 = render(BEAM, 50)!;
    const b2 = render(BEAM, 200)!;

    const estimate = estimateExtents({ bounds: b2, scale: 200 }, { bounds: b1, scale: 50 });

    expect(estimate.bounds.minX).toBeCloseTo(0);
    expect(estimate.bounds.maxX).toBeCloseTo(6);
    expect(estimate.bounds.minY).toBeCloseTo(0);
    expect(estimate.bounds.maxY).toBeCloseTo(0);
    expectOverhang(estimate.overhang, { top: 40, right: 14, bottom: 80, left: 14 });
  });

  it('takes a single measurement as is', () => {
    const bounds = render(BEAM, 100)!;
    const estimate = estimateExtents({ bounds, scale: 100 }, null);

    expect(estimate.bounds).toEqual(bounds);
    expect(estimate.overhang).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  it('never reports a negative overhang when the dominating item changes', () => {
    // Zooming in makes the label lose against the node: the measured left edge moves
    // the "wrong" way and a naive secant would produce a negative pixel size.
    const items: Item[] = [
      { x: 0, y: 0 },
      { x: 0.5, y: 0, px: -100 },
    ];
    const estimate = estimateExtents(
      { bounds: render(items, 10)!, scale: 10 },
      { bounds: render(items, 1000)!, scale: 1000 }
    );

    expect(estimate.overhang.left).toBeGreaterThanOrEqual(0);
    expect(estimate.bounds.minX).toBeLessThanOrEqual(0);
  });
});

describe('fitRenderedContent', () => {
  it('fits a beam with result diagrams in two refinements (probe, then exact split)', async () => {
    for (const modelBounds of [modelBoundsOf(BEAM), null]) {
      const sim = await simulate(BEAM, { padding: 32, modelBounds });

      expectFitted(sim, 800, 400, 32);
      expect(sim.result!.iterations).toBe(2);
      // 800 - 2 * 32 padding - 2 * 14 label overhang for 6 m
      expect(sim.result!.scale).toBeCloseTo((800 - 64 - 28) / 6);
    }
  });

  it('is not fooled by model-unit content beyond the nodes when starting zoomed in', async () => {
    // Nodes span 3 x 3 m; a world-unit dimension line sits 1 m below the lowest node.
    // Seen from a view zoomed to 1271 px/m, treating that metre as pixels would reserve
    // 1271 px of padding and zoom out to almost nothing.
    const items: Item[] = [
      { x: 0, y: -3, px: -14, py: -14 },
      { x: 3, y: -3, px: 14, py: -14 },
      { x: 0, y: 0, py: 20 },
      { x: 3, y: 0, py: 20 },
      { x: 0, y: 1, py: 8 },
      { x: 3, y: 1, py: 8 },
      { x: 1.5, y: -1.5, px: -64 },
    ];
    const nodes = { minX: 0, minY: -3, maxX: 3, maxY: 0 };

    const sim = await simulate(
      items,
      { padding: 32, modelBounds: nodes },
      { x: 1, y: -1.5, w: 1280 / 1271, h: 489 / 1271 }
    );

    expectFitted(sim, 800, 400, 32);
    expect(sim.result!.iterations).toBeLessThanOrEqual(3);
    expect(sim.result!.scale).toBeGreaterThan(50);
  });

  it('centers the rendered box, not the geometry', async () => {
    const sim = await simulate(BEAM, { padding: 0, modelBounds: modelBoundsOf(BEAM) });

    expectFitted(sim);

    const fit = sim.result!;
    const top = (sim.rendered!.minY - fit.viewBox.y) * fit.scale;
    const bottom = (sim.rendered!.maxY - fit.viewBox.y) * fit.scale;

    // Diagram hangs 80 px below and 40 px above: the rendered box is vertically centered.
    expect(top).toBeCloseTo(400 - bottom, 0);
  });

  it('centers a tiny preview seeded from an unfitted view', async () => {
    // The widget header preview: a 3 m column in 56 x 40 px, decorated only by a 3 px
    // fibre line on one side and its 1 px stroke on the other. It starts from the
    // leftover zoom 1 view, where those few pixels measure as metres - taken as geometry
    // (there is nothing yet to separate them from it), their centre is what gets placed
    // in the middle of the box, a quarter of the width off. The height fills the frame at
    // either position, so only the horizontal placement tells the two apart.
    const column: Item[] = [
      { x: 0, y: 0 },
      { x: 0, y: -3 },
      { x: 0, y: -1.5, px: 3 },
      { x: 0, y: -1.5, px: -1 },
    ];

    const sim = await simulate(
      column,
      { padding: 1, reserve: 0, modelBounds: modelBoundsOf(column), viewportWidth: 56, viewportHeight: 40 },
      { x: 122, y: 55, w: 56, h: 40 }
    );

    expectFitted(sim, 56, 40, 1);

    const fit = sim.result!;
    const left = (sim.rendered!.minX - fit.viewBox.x) * fit.scale;
    const right = (sim.rendered!.maxX - fit.viewBox.x) * fit.scale;

    expect(left).toBeCloseTo(56 - right, 0);
  });

  it('is stable - fitting an already fitted view changes nothing', async () => {
    const first = await simulate(BEAM, { padding: 32, modelBounds: modelBoundsOf(BEAM) });
    const second = await simulate(BEAM, { padding: 32, modelBounds: modelBoundsOf(BEAM) }, first.result!.viewBox);

    expect(second.result!.iterations).toBe(0);
    expect(second.result!.viewBox).toEqual(first.result!.viewBox);
  });

  it('converges when the outermost item switches between zoom levels', async () => {
    const items: Item[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 9.5, y: 0, px: 120 }, // a label inside the span that sticks out at low zoom
      { x: 0.2, y: 0, px: -150 },
      { x: 5, y: 0, py: 200 },
      { x: 5, y: 0, py: -30 },
    ];

    for (const initial of [
      { x: -5, y: -5, w: 20, h: 10 },
      { x: 4.9, y: -0.1, w: 0.2, h: 0.1 },
      { x: -5000, y: -5000, w: 10000, h: 5000 },
    ]) {
      const sim = await simulate(items, { padding: 16, modelBounds: modelBoundsOf(items) }, initial);

      expectFitted(sim, 800, 400, 16);
      expect(sim.result!.iterations).toBeLessThanOrEqual(3);
    }
  });

  it('handles dimension lines placed in model units beyond the nodes', async () => {
    const items: Item[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 0.6, px: 0, py: 14 }, // dimension line 0.6 m below with its text
      { x: 4, y: 0.6, py: 14 },
    ];

    // Model bounds only know the nodes.
    const sim = await simulate(items, { padding: 24, modelBounds: { minX: 0, minY: 0, maxX: 4, maxY: 0 } });

    expectFitted(sim, 800, 400, 24);
    expect(sim.result!.iterations).toBeLessThanOrEqual(3);
  });

  it('fits a tall frame against the height', async () => {
    const items: Item[] = [
      { x: 0, y: 0, py: -14 },
      { x: 0, y: 10, py: 20 },
      { x: 1, y: 10, py: 20 },
      { x: 0.5, y: 5, px: 64 },
    ];

    const sim = await simulate(items, { padding: 10, modelBounds: modelBoundsOf(items) });

    expectFitted(sim, 800, 400, 10);
    expect(sim.result!.scale).toBeCloseTo((400 - 20 - 34) / 10);
  });

  it('starts from the model bounds when no view exists yet', async () => {
    const sim = await simulate(BEAM, { padding: 32, modelBounds: modelBoundsOf(BEAM) }, null);

    expectFitted(sim, 800, 400, 32);
  });

  it('starts from a degenerate view without model bounds', async () => {
    const applied: FitResult[] = [];
    let current: FitResult | null = null;

    const result = await fitRenderedContent(
      {
        apply: (fit) => {
          current = fit;
          applied.push(fit);
        },
        measure: () => (current ? render(BEAM, current.scale) : null),
      },
      { viewportWidth: 800, viewportHeight: 400, padding: 32, viewBox: { x: 0, y: 0, w: 0, h: 0 } }
    );

    expect(result).toBeNull();
    expect(applied).toHaveLength(0);
  });

  it('fits a single node with the fallback span', async () => {
    const items: Item[] = [{ x: 2, y: 3, px: 12, py: -12 }];
    const sim = await simulate(items, { padding: 10, modelBounds: modelBoundsOf(items), fallbackSpan: 4 });

    expect(sim.result).not.toBeNull();
    const check = checkFit(sim.rendered!, sim.result!, 800, 400, 10);
    expect(check.inside).toBe(true);
  });

  it('stops when cancelled and leaves no half-applied view', async () => {
    let calls = 0;

    const result = await fitRenderedContent(
      {
        apply: () => {
          calls++;
        },
        measure: () => render(BEAM, 100),
        isCancelled: () => calls > 0,
      },
      { viewportWidth: 800, viewportHeight: 400, padding: 32, viewBox: { x: -1, y: -1, w: 8, h: 4 } }
    );

    expect(result).toBeNull();
    expect(calls).toBe(1);
  });

  it('returns null for an empty viewport or nothing rendered', async () => {
    expect(
      await fitRenderedContent({ apply: () => {}, measure: () => null }, { viewportWidth: 0, viewportHeight: 0 })
    ).toBeNull();

    expect(
      await fitRenderedContent(
        { apply: () => {}, measure: () => null },
        { viewportWidth: 800, viewportHeight: 400, viewBox: { x: 0, y: 0, w: 10, h: 5 } }
      )
    ).toBeNull();
  });

  it('reserves room around the geometry that envelopes the measured overhang', async () => {
    // A bare 4 m beam: node labels 14 px up, supports 24 px down. A 60 px reserve on
    // every side keeps the geometry 60 px from the frame - not 60 + 24.
    const items: Item[] = [
      { x: 0, y: 0, py: -14 },
      { x: 4, y: 0, py: -14 },
      { x: 0, y: 0, py: 24 },
      { x: 4, y: 0, py: 24 },
    ];

    const sim = await simulate(items, { padding: 10, reserve: 60, viewportHeight: 200 });

    expect(sim.result!.converged).toBe(true);
    const fit = sim.result!;
    expect((0 - fit.viewBox.x) * fit.scale).toBeCloseTo(70, 0);
    expect((4 - fit.viewBox.x) * fit.scale).toBeCloseTo(730, 0);
    expect((0 - fit.viewBox.y) * fit.scale).toBeCloseTo(100, 0);
  });

  it('lets decorations larger than the reserve drive the fit instead', async () => {
    const items: Item[] = [
      { x: 0, y: 0, px: -120 },
      { x: 4, y: 0, px: 120 },
    ];

    const sim = await simulate(items, { padding: 10, reserve: 60 });

    expect(sim.result!.converged).toBe(true);
    expect(checkFit(sim.rendered!, sim.result!, 800, 400, 10).filled).toBe(true);
    expect(sim.result!.scale).toBeCloseTo((800 - 20 - 240) / 4);
  });

  it('gives up early when the diagrams alone are taller than the padded frame', async () => {
    // 120 px of diagram cannot fit into 400 - 2 * 150 px, so the padding cannot be honoured.
    const sim = await simulate(BEAM, { padding: 150, modelBounds: modelBoundsOf(BEAM) });

    expect(sim.result).not.toBeNull();
    expect(sim.result!.converged).toBe(false);
    expect(sim.result!.iterations).toBeLessThanOrEqual(3);
    // ... but everything is still on screen.
    expect(checkFit(sim.rendered!, sim.result!, 800, 400, 0).inside).toBe(true);
  });
});
