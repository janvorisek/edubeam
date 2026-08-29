import { describe, it, expect } from 'vitest';
import { LinearStaticSolver, DofID, Beam2D, BeamElementUniformEdgeLoad } from 'ts-fem';
import { serializeModel, deserializeModel, parseSerializedModel } from '@/utils/serializeModel';

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
});
