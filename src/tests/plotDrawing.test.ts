import { describe, expect, it } from 'vitest';
import { Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem';
import { resolveUnits, type PlotModel } from '@edubeam/plot';
import {
  copiedPart,
  dimensionAnchors,
  editorFit,
  displacementWriter,
  drawablePart,
  editorFigure,
  editorFigureSvg,
  editorLayers,
  editorSheet,
  chainDimensions,
  extremeDimensions,
  guideMarkup,
  sheetGuides,
  readEditorModel,
  type EditorLook,
} from '@/utils/plotDrawing';
import { DEFAULT_DIAGRAM_STYLE } from '@/utils/diagramStyle';

const twoDecimals = new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const look: EditorLook = {
  units: resolveUnits(),
  numberFormat: twoDecimals,
  displacementText: displacementWriter(twoDecimals, 'scientific'),
  fontSize: 14,
  resultsScalePx: 48,
  diagramStyle: DEFAULT_DIAGRAM_STYLE,
  supportSize: 1,
  resultLabelMode: 'axis',
};

const COLORS = {
  normalForce: '#2222ff',
  shearForce: '#00af00',
  bendingMoment: '#ff2222',
  deformedShape: '#555555',
  loads: '#ff8700',
  reactions: '#a020f0',
};

/** A simply supported 4 m beam under 10 kN/m: M = 20 kNm at mid-span */
const beam = (solve = true): LinearStaticSolver => {
  const solver = new LinearStaticSolver();
  const domain = solver.domain;
  domain.createNode('a', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  domain.createNode('b', [4, 0, 0], [DofID.Dz]);
  domain.createMaterial(1, { e: 210000e6, g: 8.75e10, alpha: 12e-6, d: 4000 });
  domain.createCrossSection(1, { a: 1e-2, iy: 8.356e-5, iz: 1, dyz: 999991, h: 1, k: 1e32, j: 99999 });
  domain.createBeam2D(1, ['a', 'b'], 1, 1);
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 10e3], true);
  if (solve) solver.solve();
  return solver;
};

describe('the layers the editor shows', () => {
  it('follow its switches, the members always', () => {
    const off = {
      supports: false,
      loads: false,
      reactions: false,
      nodeLabels: false,
      memberLabels: false,
      normalForce: false,
      shearForce: false,
      bendingMoment: false,
      deformedShape: false,
    };
    expect([...editorLayers(off)]).toEqual(['members']);
    expect([...editorLayers({ ...off, supports: true, bendingMoment: true, nodeLabels: true })]).toEqual([
      'members',
      'supports',
      'nodeLabels',
      'M',
    ]);
  });
});

describe('a displacement', () => {
  const write = displacementWriter(twoDecimals, 'scientific');

  it('has two decimals where they say something', () => {
    expect(write(0)).toBe('0.00');
    expect(write(1.5)).toBe('1.50');
  });

  it('has a power of ten where two decimals would read 0.00', () => {
    const small = write(4.3e-4);
    expect(small).not.toBe('0.00');
    expect(small).toContain('10');
  });
});

describe('what of a model is drawn', () => {
  it('leaves out an element whose node is gone, with its loads and results', () => {
    // As an old link arrives: not solved, the solver refuses such a model
    const solver = beam(false);
    solver.domain.createBeam2D(2, ['b', 'gone'], 1, 1);
    solver.loadCases[0].createBeamElementUniformEdgeLoad('2', [0, 1000], true);

    const model = readEditorModel(solver);

    expect(model.members.map((m) => m.id)).toEqual(['1']);
    expect(model.loads.every((l) => !('member' in l) || l.member === '1')).toBe(true);
  });

  it('is the model itself when all of it can be drawn', () => {
    const model = readEditorModel(beam());
    expect(drawablePart(model)).toBe(model);
  });
});

describe('a paste', () => {
  const model: PlotModel = {
    nodes: [
      { id: '1', x: 0, z: 0, fixity: { dx: true, dz: true, ry: true }, angle: 0 },
      { id: '2', x: 3, z: 0, fixity: { dx: false, dz: true, ry: false }, angle: 0 },
      { id: '3', x: 6, z: 0, fixity: { dx: false, dz: true, ry: false }, angle: 0 },
    ],
    members: [
      { id: 'a', start: '1', end: '2', hinges: [false, false] },
      { id: 'b', start: '2', end: '3', hinges: [false, false] },
    ],
    loads: [{ kind: 'nodalForce', node: '2', fx: 0, fz: 1000 }],
  };

  it('carries the copied members and nodes, without loads', () => {
    const part = copiedPart(model, new Set(['1', '2']), new Set(['a']));
    expect(part.members.map((m) => m.id)).toEqual(['a']);
    expect(part.nodes.map((n) => n.id)).toEqual(['1', '2']);
    expect(part.loads).toEqual([]);
  });

  it('brings a support only with a copied node, not with a member’s end', () => {
    const part = copiedPart(model, new Set(['2']), new Set(['b']));
    const fixity = Object.fromEntries(part.nodes.map((n) => [n.id, n.fixity]));
    expect(fixity['2']).toEqual(model.nodes[1].fixity);
    expect(fixity['3']).toEqual({ dx: false, dz: false, ry: false });
  });
});

describe('a figure', () => {
  const shown = editorLayers({
    supports: true,
    loads: true,
    reactions: false,
    nodeLabels: true,
    memberLabels: false,
    normalForce: false,
    shearForce: false,
    bendingMoment: true,
    deformedShape: false,
  });
  const box = { width: 400, height: 260, padding: 8 };

  it('fits its box, labels and all, with a square on each node', () => {
    const figure = editorFigure(readEditorModel(beam()), look, shown, box);

    expect(figure.fit.width).toBe(box.width);
    for (const t of figure.scene.texts) {
      expect(t.x).toBeGreaterThanOrEqual(0);
      expect(t.x).toBeLessThanOrEqual(box.width);
      expect(t.y).toBeGreaterThanOrEqual(0);
      expect(t.y).toBeLessThanOrEqual(box.height);
    }
    expect(figure.scene.paths.filter((p) => p.group === 'nodes')).toHaveLength(2);
    // The mid-span moment and the load's values at both ends
    const texts = figure.scene.texts.map((t) => t.text);
    expect(texts).toContain('20.00');
    expect(texts.filter((t) => t === '10.00')).toHaveLength(2);
  });

  it('keeps its scale whichever diagram shows, when it makes room for all of them', () => {
    const model = readEditorModel(beam());
    const reserve = ['N', 'V', 'M', 'w', 'reactions'] as const;
    const withM = editorFigure(model, look, shown, box, reserve);
    const withV = editorFigure(model, look, new Set([...shown].filter((l) => l !== 'M').concat('V')), box, reserve);
    expect(withV.fit).toEqual(withM.fit);
  });

  it('paints a hinge over its node’s square, as the editor does', () => {
    const solver = beam();
    const element = solver.domain.elements.get('1');
    if (!(element instanceof Beam2D)) throw new Error('expected a beam');
    element.hinges = [true, false];
    const svg = editorFigureSvg(editorFigure(readEditorModel(solver), look, shown, box), look, COLORS);
    const square = svg.indexOf('h6v6h-6Z');
    const hinge = svg.indexOf('<circle');

    expect(square).toBeGreaterThan(-1);
    expect(hinge).toBeGreaterThan(square);
  });

  it('is written in the page’s own typeface, its names escaped', () => {
    const solver = beam();
    solver.domain.createNode('<x>', [2, 0, 1], []);
    const figure = editorFigure(readEditorModel(solver), look, shown, box);
    const svg = editorFigureSvg(figure, look, COLORS, { title: 'Beam' });

    expect(svg).toContain('font-family="inherit"');
    expect(svg).toContain('<title>Beam</title>');
    expect(svg).toContain('&lt;x&gt;');
    expect(svg).not.toContain('<x>');
    expect(svg).toContain(COLORS.bendingMoment);
  });
});

describe('a fit', () => {
  const everything = editorLayers({
    supports: true,
    loads: true,
    reactions: true,
    nodeLabels: true,
    memberLabels: true,
    normalForce: true,
    shearForce: true,
    bendingMoment: true,
    deformedShape: true,
  });
  const membersOnly = new Set(['members'] as const);

  it('keeps the structure at least half the size it would have alone, in a box too small for the rest', () => {
    const model = readEditorModel(beam());
    // A preview tile: the arrows, diagrams and labels alone nearly fill its height
    const box = { width: 300, height: 140, padding: 6 };
    const alone = editorFit(model, look, membersOnly, box);
    const crowded = editorFit(model, look, everything, box);
    expect(crowded.s).toBeCloseTo(alone.s / 2, 6);
    // Centred, what runs over running over evenly: the beam's middle near the box's
    expect(Math.abs(2 * crowded.s + crowded.tx - 150)).toBeLessThan(5);
  });

  it('makes room for what is drawn beside the model', () => {
    const model = readEditorModel(beam());
    const box = { width: 800, height: 600, padding: 10 };
    const plain = editorFit(model, look, membersOnly, box);
    // A point 20 m below the beam: the beam must now share the height with it, however small
    const below = editorFit(model, look, membersOnly, box, { extra: [{ x: 2, z: 20, dx: 0, dy: 0 }] });
    expect(below.s).toBeLessThan(plain.s);
    expect(20 * below.s + below.ty).toBeLessThanOrEqual(box.height - box.padding + 1e-6);
  });
});

describe('a dimension line in a fit', () => {
  it('is its two ends, off the points by its distance, and its value a little further out', () => {
    // Along x, 1 m off it: below, as Dimensioning draws a positive distance for a line drawn to the right
    const [a, b, value] = dimensionAnchors(
      [
        {
          points: [{ coords: [0, 0, 0] }, { coords: [4, 0, 0] }],
          distance: 1,
        },
      ],
      14
    );
    expect(a).toEqual({ x: 0, z: 1, dx: 0, dy: 0 });
    expect(b).toEqual({ x: 4, z: 1, dx: 0, dy: 0 });
    // and its value 10 px back toward the line's points, a line of text tall
    expect(value).toEqual({ x: 2, z: 1, dx: 0, dy: -24 });
  });

  it('is nothing for a line of no length', () => {
    expect(dimensionAnchors([{ points: [{ coords: [1, 0, 1] }, { coords: [1, 0, 1] }], distance: 1 }], 14)).toEqual([]);
  });
});

describe('a sheet', () => {
  it('draws every figure at one scale and frame, each with its own layers', () => {
    const model = readEditorModel(beam());
    const figures = [new Set(['members', 'loads'] as const), new Set(['members', 'M'] as const)];
    const [loads, moment] = editorSheet(model, look, figures, { width: 600, maxHeight: 400, padding: 12 });
    expect(moment.fit).toEqual(loads.fit);
    expect(loads.scene.paths.some((p) => p.group === 'loads')).toBe(true);
    expect(loads.scene.paths.some((p) => p.group === 'M')).toBe(false);
    expect(moment.scene.paths.some((p) => p.group === 'M')).toBe(true);
    expect(moment.scene.texts.map((t) => t.text)).toContain('20.00');
  });
});

describe('guide lines across a sheet', () => {
  it("run through a beam's ends and, stronger, its largest moment", () => {
    // The 4 m beam under 10 kN/m: the moment is largest at mid-span, where the shear is zero
    const model = readEditorModel(beam());
    const fit = { s: 100, tx: 50, ty: 100, width: 500, height: 300 };
    const lines = sheetGuides(model, fit).sort((a, b) => a.at - b.at);
    expect(lines.map((l) => [l.axis, Math.round(l.at * 1e6) / 1e6, l.extreme])).toEqual([
      ['x', 50, false],
      ['x', 250, true],
      ['x', 450, false],
    ]);
    const markup = guideMarkup(lines, fit);
    expect(markup.match(/<line /g)).toHaveLength(3);
    // Across the whole figure, the extreme's dashed and the others dotted
    expect(markup).toContain('x1="250" y1="0" x2="250" y2="300"');
    expect(markup).toContain('stroke-dasharray="5 4"');
    expect(markup).toContain('stroke-dasharray="1.5 3"');
  });
});

describe('the sizes under a sheet', () => {
  const fit = { s: 100, tx: 50, ty: 100, width: 500, height: 300 };

  it('chain through the nodes, with the overall length under them, below the figure', () => {
    const { markup, height } = chainDimensions(readEditorModel(beam()), fit, look);
    // Two nodes: one link, so no overall line
    expect(markup.match(/<text /g)).toHaveLength(1);
    expect(markup).toContain('>4.00 m</text>');
    expect(height).toBeGreaterThan(0);
    // On the strip below the figure
    expect(Number(/y1="([\d.]+)"/.exec(markup)![1])).toBeGreaterThan(fit.height);
  });

  it('measure the largest moment from the left end, where the shear is zero', () => {
    const { markup } = extremeDimensions(readEditorModel(beam()), fit, look);
    expect(markup).toContain('>2.00 m</text>');
  });
});
