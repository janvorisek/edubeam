import { describe, it, expect, vi } from 'vitest';
import { LinearStaticSolver, DofID, Beam2D, BeamElementUniformEdgeLoad } from 'ts-fem';
import { deflateSync } from 'fflate';
import {
  serializeModel,
  deserializeModel,
  parseSerializedModel,
  toShareParam,
  fromShareParam,
} from '@/utils/serializeModel';
import { createPresetShape } from '@/utils/sectionProperties';
import { createDimensionPoint, type DimensionLine } from '@/types/dimension';

const buildSolver = () => {
  const ls = new LinearStaticSolver();
  const d = ls.domain;
  d.createNode('Ústí', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  d.createNode('2', [3, 0, 0], []);
  d.createMaterial('ocel', { d: 7850, e: 210e9, g: 80e9, alpha: 12e-6 });
  d.createCrossSection('IPE', { a: 0.01, iy: 8e-5, h: 0.2, k: 1e32 });
  d.createBeam2D('B1', ['Ústí', '2'], 'ocel', 'IPE', [false, true]);
  ls.loadCases[0].createNodalLoad('2', [0, 0, -1000, 0, 0, 0]);
  ls.loadCases[0].createBeamElementUniformEdgeLoad('B1', [0, -2], true);
  return ls;
};

describe('serializeModel', () => {
  it('round-trips a model with non-Latin1 labels', () => {
    const src = buildSolver();
    const encoded = serializeModel(src, []);
    expect(encoded).not.toBeNull();

    const dst = new LinearStaticSolver();
    const dims = [];
    expect(deserializeModel(encoded as string, dst, dims)).toBe(true);

    expect([...dst.domain.nodes.keys()]).toEqual(['Ústí', '2']);
    expect(dst.domain.getNode('Ústí').bcs.size).toBe(3);
    expect(dst.domain.elements.get('B1').nodes).toEqual(['Ústí', '2']);
    expect((dst.domain.elements.get('B1') as Beam2D).hinges).toEqual([false, true]);
    expect(dst.domain.materials.get('ocel').e).toBe(210e9);
    expect(dst.loadCases[0].nodalLoadList[0].values[2]).toBe(-1000);
    expect((dst.loadCases[0].elementLoadList[0] as BeamElementUniformEdgeLoad).values).toEqual([0, -2]);

    // serialize(deserialize(x)) === x
    expect(serializeModel(dst, dims)).toBe(encoded);
  });

  it('still reads models written with plain Latin-1 btoa', () => {
    const legacy = btoa(JSON.stringify({ n: [['1', [0, 0, 0], []]] }));
    const dst = new LinearStaticSolver();
    expect(deserializeModel(legacy, dst, [])).toBe(true);
    expect(dst.domain.nodes.size).toBe(1);
  });

  it('rejects malformed payloads without touching the solver', () => {
    const dst = buildSolver();
    const before = serializeModel(dst, []);

    const bad = [
      'not base64 at all!!',
      btoa('[]'),
      btoa(JSON.stringify({ n: [['1', [0, null, 0], []]] })),
      btoa(JSON.stringify({ n: [['1', [0, 0, 0]]], e: [['b', ['1'], 'm', 'c']] })),
      btoa(JSON.stringify({ nl: [['1', ['x']]] })),
    ];

    for (const payload of bad) {
      expect(parseSerializedModel(payload)).toBeNull();
      expect(deserializeModel(payload, dst, [])).toBe(false);
      expect(serializeModel(dst, [])).toBe(before);
    }
  });

  it('round-trips DofID-keyed nodal loads and prescribed displacements (as created by the dialogs)', () => {
    const src = buildSolver();
    src.loadCases[0].createNodalLoad('2', { [DofID.Dx]: 5, [DofID.Dz]: -10, [DofID.Ry]: 2 });
    src.loadCases[0].createPrescribedDisplacement('Ústí', { [DofID.Dx]: 0.001, [DofID.Dz]: 0, [DofID.Ry]: 0 });

    const encoded = serializeModel(src, []) as string;
    expect(parseSerializedModel(encoded)).not.toBeNull();

    const dst = new LinearStaticSolver();
    expect(deserializeModel(encoded, dst, [])).toBe(true);
    expect(dst.loadCases[0].nodalLoadList[1].values).toEqual({ 0: 5, 2: -10, 4: 2 });
    expect(dst.loadCases[0].prescribedBC[0].prescribedValues).toEqual({ 0: 0.001, 2: 0, 4: 0 });

    expect(parseSerializedModel(btoa(JSON.stringify({ nl: [['1', { 0: 'x' }]] })))).toBeNull();
    expect(parseSerializedModel(btoa(JSON.stringify({ pd: [['1', { foo: 1 }]] })))).toBeNull();
  });

  it('round-trips a polygonal section shape', () => {
    const src = buildSolver();
    const shape = createPresetShape('box', { b: 0.1, h: 0.2, t: 0.005 });
    src.domain.createCrossSection('poly', { a: 0.1, iy: 1e-5, h: 0.2, k: 0.833 }).shape = shape;

    const encoded = serializeModel(src, []) as string;
    const dst = new LinearStaticSolver();
    expect(deserializeModel(encoded, dst, [])).toBe(true);
    expect(dst.domain.crossSections.get('poly').shape).toEqual(shape);
    expect(dst.domain.crossSections.get('IPE').shape).toBeUndefined();
    expect(serializeModel(dst, [])).toBe(encoded);
  });
});

/**
 * Frozen `?model=` values. Links like these sit in lecture notes and must keep opening the
 * same model forever: never regenerate them, add new ones instead.
 */
// Plain base64 of UTF-8 JSON, as every release before compressed links shared it: all entity
// and load kinds, a polygonal section, a dimension, Czech and Chinese labels.
const PLAIN_LINK =
  'eyJuIjpbWyLDmnN0w60iLFswLDAsMF0sWzAsMiw0XSxudWxsXSxbIuiKgueCuSIsWzQsMCwwXSxbMl0sbnVsbF0sWyIzIixbNCwwLC0zXSxbXSxudWxsXV0sImUiOltbIkIxIixbIsOac3TDrSIsIuiKgueCuSJdLCJvY2VsIiwiSVBFIixbZmFsc2UsdHJ1ZV1dLFsiQjIiLFsi6IqC54K5IiwiMyJdLCJvY2VsIiwiSVBFIixbZmFsc2UsZmFsc2VdXV0sIm0iOltbIm9jZWwiLDc4NTAsMjEwMDAwMDAwMDAwLDgwNzY5MjMwNzY5LjIzMDc3LDAuMDAwMDEyXV0sImNzIjpbWyJJUEUiLDAuMDAyODUsMC4wMDAwMTk0MywwLjIsMWUrMzIsW1tbWy0wLjA1LC0wLjFdLFswLjA1LC0wLjFdLFswLjA1LDAuMV0sWy0wLjA1LDAuMV1dLDBdLFtbWy0wLjA0NTAwMDAwMDAwMDAwMDAwNSwtMC4wOTVdLFswLjA0NTAwMDAwMDAwMDAwMDAwNSwtMC4wOTVdLFswLjA0NTAwMDAwMDAwMDAwMDAwNSwwLjA5NV0sWy0wLjA0NTAwMDAwMDAwMDAwMDAwNSwwLjA5NV1dLDFdXV1dLCJlbCI6W1siQjEiLFswLC0yMDAwXSx0cnVlXV0sImVjbCI6W1siQjEiLFswLC0xNTAwLDAuNV0sZmFsc2VdXSwiZXRsIjpbWyJCMiIsWzEwLC01XV1dLCJldHIiOltbIkIyIixbMCwxMDAwXSxbMCwzMDAwXSx0cnVlXV0sIm5sIjpbWyIzIix7IjAiOjUwMDAsIjIiOi0xMDAwMH1dXSwicGQiOltbIsOac3TDrSIseyIyIjowLjAwMX1dXSwiZCI6W1sxLFtbMCwwXSxbNCwwXV0sImRpbS0xIiwid29ybGQiLFsiw5pzdMOtIiwi6IqC54K5Il1dXX0=';
// Plain base64 of Latin-1 JSON, as shared before labels were UTF-8 encoded.
const LATIN1_LINK =
  'eyJuIjpbWyLac3TtIixbMCwwLDBdLFswLDIsNF1dLFsiMiIsWzMsMCwwXSxbXV1dLCJlIjpbWyJCMSIsWyLac3TtIiwiMiJdLCIxIiwiMSJdXSwibSI6W1siMSIsNzg1MCwyMTAwMDAwMDAwMDAsODAwMDAwMDAwMDAsMC4wMDAwMTJdXSwiY3MiOltbIjEiLDAuMDEsMC4wMDAwOCwwLjIsMWUrMzJdXSwibmwiOltbIjIiLFswLDAsLTEwMDAsMCwwLDBdXV19';
// The same model as PLAIN_LINK, in the first compressed format.
const COMPRESSED_LINK =
  '1.lVK9boMwEH4Xrz0i20ADjJU6dOuOPFSESpUcUgFRB5QlYx-h79AH6JyHaR-j350hiIqlRjL2fT8-3d2gGlWUpbp8dP3lU1GpCZ_jv6XEUXP0Hjf1837-Pn8BT0bczlg8hqMYtzHsSNVifGeAXu0nH8CHqvYIPDzeg_D85Lua-vZYQwmRZdH0Jh5Y58vu-K29vBUo2yxF8kZfF2V6e5vbmPcN_7akNwwYy9qqE7EYc9xm6YTnSYyjJVPfxJZKrAhIStgN1-jvORwDh89OShVUSTpnxEuUOk-D9r_oBK47B9QRMpBO-LkVaJMFx03FVnW1RA3cYADzsbyg9COF22LAgbeE2zmsiSsugxMv_JugxZAMSquCcyVlVRFJh05Med0tZnBgmDtgBBXQoIxh8DBpEn3ZR8hYvR1av1sdMedOvw';

const buildFullSolver = () => {
  const ls = new LinearStaticSolver();
  const d = ls.domain;
  d.createNode('Ústí', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  d.createNode('节点', [4, 0, 0], [DofID.Dz]);
  d.createNode('3', [4, 0, -3], []);
  d.createMaterial('ocel', { d: 7850, e: 210e9, g: 80769230769.23077, alpha: 12e-6 });
  d.createCrossSection('IPE', { a: 0.00285, iy: 1.943e-5, h: 0.2, k: 1e32 }).shape = createPresetShape('box', {
    b: 0.1,
    h: 0.2,
    t: 0.005,
  });
  d.createBeam2D('B1', ['Ústí', '节点'], 'ocel', 'IPE', [false, true]);
  d.createBeam2D('B2', ['节点', '3'], 'ocel', 'IPE', [false, false]);
  const lc = ls.loadCases[0];
  lc.createNodalLoad('3', { [DofID.Dx]: 5000, [DofID.Dz]: -10000 });
  lc.createBeamElementUniformEdgeLoad('B1', [0, -2000], true);
  lc.createBeamConcentratedLoad('B1', [0, -1500, 0.5], false);
  lc.createBeamTemperatureLoad('B2', [10, -5]);
  lc.createBeamElementTrapezoidalEdgeLoad('B2', [0, 1000], [0, 3000], true);
  lc.createPrescribedDisplacement('Ústí', { [DofID.Dz]: 0.001 });
  return ls;
};

const fullDimensions = (): DimensionLine[] => [
  {
    id: 'dim-1',
    distance: 1,
    distanceUnit: 'world',
    points: [createDimensionPoint(0, 0, 'Ústí'), createDimensionPoint(4, 0, '节点')],
  },
];

/** Opens a `?model=` value the way App.vue does and returns the loaded model, re-serialized. */
const openLink = (param: string) => {
  const model = fromShareParam(param);
  if (model === null) return null;
  const ls = new LinearStaticSolver();
  const dims: DimensionLine[] = [];
  expect(deserializeModel(model, ls, dims)).toBe(true);
  return { ls, dims, model: serializeModel(ls, dims) };
};

/** A `?model=` value after a trip through a real URL, as a copied link takes. */
const throughUrl = (param: string) => {
  const url = new URL('https://run.edubeam.app/');
  url.searchParams.set('model', param);
  return { href: url.toString(), param: new URL(url.toString()).searchParams.get('model') as string };
};

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const compressedLinkOf = (text: string | Uint8Array) =>
  '1.' + toBase64Url(deflateSync(typeof text === 'string' ? new TextEncoder().encode(text) : text));

describe('share links', () => {
  it('still opens a plain base64 link exactly as before', () => {
    expect(fromShareParam(PLAIN_LINK)).toBe(PLAIN_LINK);

    const opened = openLink(PLAIN_LINK);
    expect(opened?.model).toBe(PLAIN_LINK);
    expect(opened?.model).toBe(serializeModel(buildFullSolver(), fullDimensions()));

    const { ls, dims } = opened;
    expect([...ls.domain.nodes.keys()]).toEqual(['Ústí', '节点', '3']);
    expect(ls.domain.materials.get('ocel').g).toBe(80769230769.23077);
    expect(ls.domain.crossSections.get('IPE').k).toBe(1e32);
    expect(ls.loadCases[0].elementLoadList).toHaveLength(4);
    expect(ls.loadCases[0].prescribedBC[0].prescribedValues).toEqual({ 2: 0.001 });
    expect(dims[0].points.map((p) => p.sourceNodeLabel)).toEqual(['Ústí', '节点']);
  });

  it('still opens a Latin-1 link exactly as before', () => {
    expect(fromShareParam(LATIN1_LINK)).toBe(LATIN1_LINK);

    const before = new LinearStaticSolver();
    expect(deserializeModel(LATIN1_LINK, before, [])).toBe(true);
    const opened = openLink(LATIN1_LINK);
    expect(opened?.model).toBe(serializeModel(before, []));
    expect([...opened.ls.domain.nodes.keys()]).toEqual(['Ústí', '2']);
    expect(opened.ls.loadCases[0].nodalLoadList[0].values[2]).toBe(-1000);
  });

  it('opens a plain link that went through a URL, with its + / = percent-encoded', () => {
    const { href, param } = throughUrl(PLAIN_LINK);
    expect(href).toMatch(/%2B|%2F|%3D/);
    expect(openLink(param)?.model).toBe(PLAIN_LINK);
  });

  it('opens the frozen compressed link as the same model as the plain one', () => {
    expect(fromShareParam(COMPRESSED_LINK)).toBe(PLAIN_LINK);
    expect(openLink(COMPRESSED_LINK)?.model).toBe(PLAIN_LINK);
  });

  it('round-trips every entity and load kind through a compressed link', () => {
    const model = serializeModel(buildFullSolver(), fullDimensions()) as string;
    const param = toShareParam(model) as string;

    expect(param.startsWith('1.')).toBe(true);
    expect(openLink(param)?.model).toBe(model);
  });

  it('decodes links from any deflate encoder settings', () => {
    const json = new TextDecoder().decode(Uint8Array.from(atob(PLAIN_LINK), (c) => c.charCodeAt(0)));
    const bytes = new TextEncoder().encode(json);
    for (const level of [0, 1, 6, 9] as const) {
      expect(fromShareParam('1.' + toBase64Url(deflateSync(bytes, { level })))).toBe(PLAIN_LINK);
    }
  });

  it('makes links URL-safe and much shorter than plain ones', () => {
    const plain = serializeModel(buildFullSolver(), fullDimensions()) as string;
    const compressed = toShareParam(plain) as string;

    expect(compressed).toMatch(/^1\.[A-Za-z0-9_-]+$/);
    const { href, param } = throughUrl(compressed);
    expect(href).toBe('https://run.edubeam.app/?model=' + compressed);
    expect(param).toBe(compressed);
    expect(compressed.length).toBeLessThan(throughUrl(plain).href.length * 0.6);
  });

  it('round-trips a large model and shrinks it several times over', () => {
    const ls = new LinearStaticSolver();
    const d = ls.domain;
    d.createMaterial('1', { d: 7850, e: 210e9, g: 81e9, alpha: 12e-6 });
    d.createCrossSection('1', { a: 0.00285, iy: 1.943e-5, h: 0.2, k: 1e32 });
    for (let i = 0; i <= 500; i++) d.createNode(String(i + 1), [i * 0.25, 0, -Math.sin(i / 20)], i === 0 ? [0, 2] : []);
    for (let i = 1; i <= 500; i++) {
      d.createBeam2D(String(i), [String(i), String(i + 1)], '1', '1', [false, false]);
      ls.loadCases[0].createBeamElementUniformEdgeLoad(String(i), [0, -1000 - i], true);
    }
    const model = serializeModel(ls, []) as string;
    const param = toShareParam(model) as string;

    expect(openLink(param)?.model).toBe(model);
    expect(param.length * 3).toBeLessThan(model.length);
  });

  it('never mistakes a plain link for a compressed one', () => {
    // `.` is outside the base64 alphabet, so no plain link can carry the compressed prefix.
    const plainLinks = [PLAIN_LINK, LATIN1_LINK, serializeModel(new LinearStaticSolver(), []) as string];
    for (const payload of [{}, { n: [] }, { d: [] }, { e: [['é', ['1', '2'], 1, 1]] }]) {
      plainLinks.push(btoa(JSON.stringify(payload)));
    }
    for (const plain of plainLinks) {
      expect(plain).toMatch(/^[A-Za-z0-9+/]+=*$/);
      expect(fromShareParam(plain)).toBe(plain);
    }
  });

  it('keeps unicode labels intact through a compressed link', () => {
    const ls = new LinearStaticSolver();
    for (const label of ['Ústí', '节点', 'Δ1', '🏗️', 'a.b', '1.']) ls.domain.createNode(label, [0, 0, 0], []);
    const model = serializeModel(ls, []) as string;
    const opened = openLink(toShareParam(model) as string);
    expect([...opened.ls.domain.nodes.keys()]).toEqual(['Ústí', '节点', 'Δ1', '🏗️', 'a.b', '1.']);
    expect(opened.model).toBe(model);
  });

  it('rejects malformed compressed links', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const truncated = COMPRESSED_LINK.slice(0, -20);

    const bad = [
      '1.',
      '1.!!!!',
      '1.abc def',
      '1.ey+J/u==',
      '1.' + toBase64Url(new TextEncoder().encode('not deflate at all')),
      truncated,
      COMPRESSED_LINK.slice(0, 40),
      compressedLinkOf('{"n":[['),
      compressedLinkOf('[]'),
      compressedLinkOf('null'),
      compressedLinkOf(JSON.stringify({ n: [['1', [0, null, 0], []]] })),
      compressedLinkOf(JSON.stringify({ nl: [['1', ['x']]] })),
      // Invalid UTF-8 inside a label, which a lenient decoder would load as U+FFFD.
      compressedLinkOf(
        new Uint8Array([...new TextEncoder().encode('{"n":[["'), 0xff, ...new TextEncoder().encode('",[0,0,0],[]]]}')])
      ),
      // A plain link wrongly given the prefix.
      '1.' + PLAIN_LINK,
    ];
    for (const param of bad) expect(fromShareParam(param), param).toBeNull();

    warn.mockRestore();
  });

  it('rejects a link that would inflate past the size limit', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // ~20 MB of whitespace is still a valid model, yet compresses to a few kB.
    const padding = ' '.repeat(20 * 1024 * 1024);
    const bomb = compressedLinkOf(`{"n":[["1",[0,0,0],[]]]${padding}}`);
    expect(bomb.length).toBeLessThan(100_000);
    expect(fromShareParam(bomb)).toBeNull();

    // The same padding below the limit opens.
    expect(fromShareParam(compressedLinkOf(`{"n":[["1",[0,0,0],[]]]${padding.slice(0, 1024 * 1024)}}`))).not.toBeNull();
    warn.mockRestore();
  });

  it('still rejects malformed plain links', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    for (const param of ['', 'not base64 at all!!', btoa('[]'), PLAIN_LINK.slice(0, 50)]) {
      expect(fromShareParam(param), param).toBeNull();
    }
    warn.mockRestore();
  });

  it('only compresses valid models', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(toShareParam('not base64 at all!!')).toBeNull();
    expect(toShareParam(btoa(JSON.stringify({ n: [['1', [0, null, 0], []]] })))).toBeNull();
    warn.mockRestore();
  });
});
