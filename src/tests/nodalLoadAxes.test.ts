import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { useProjectStore } from '@/store/project';
import { exportJSON, importJSON, resetModel } from '@/utils';
import {
  applyNodeLcsAngle,
  axisMark,
  globalToNode,
  isTurned,
  nodeToGlobal,
  actingInGlobalAxes,
} from '@/utils/nodalLcs';
import { serializeModel, deserializeModel, parseSerializedModel } from '@/utils/serializeModel';

/** A beam ending on a roller turned 30 degrees, with one load in its axes and one in the global ones. */
const buildSolver = (solver = new LinearStaticSolver()) => {
  const d = solver.domain;
  d.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  const b = d.createNode('B', [4, 0, 0], [DofID.Dz]);
  applyNodeLcsAngle(b, 30);
  d.createMaterial('m', { d: 7850, e: 210e9, g: 81e9, alpha: 1.2e-5 });
  d.createCrossSection('cs', { a: 2.85e-3, iy: 1.943e-5, h: 0.2, k: 1e32 });
  d.createBeam2D('e', ['A', 'B'], 'm', 'cs');
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 3e3, [DofID.Dz]: 10e3, [DofID.Ry]: 0 }, true);
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 5e3, [DofID.Dz]: 0, [DofID.Ry]: 0 });
  return solver;
};

describe('a nodal load in a turned node’s own axes', () => {
  it('turns between the axes and back', () => {
    const node = buildSolver().domain.getNode('B');
    const [gx, gz] = nodeToGlobal(node, 3, 10);
    const [x, z] = globalToNode(node, gx, gz);

    expect(x).toBeCloseTo(3, 12);
    expect(z).toBeCloseTo(10, 12);
    // 10 along the node's z, which is turned 30 degrees from the vertical
    const [ax, az] = nodeToGlobal(node, 0, 10);
    expect(ax).toBeCloseTo(-10 * Math.sin(Math.PI / 6), 12);
    expect(az).toBeCloseTo(10 * Math.cos(Math.PI / 6), 12);
  });

  it('is drawn where it acts, and marked x′ and z′', () => {
    const solver = buildSolver();
    const node = solver.domain.getNode('B');
    const [local, global] = solver.loadCases[0].nodalLoadList;

    const drawn = actingInGlobalAxes(node, local.values, local.lcs);
    const [gx, gz] = nodeToGlobal(node, 3e3, 10e3);
    expect(drawn.x).toBeCloseTo(gx, 6);
    expect(drawn.z).toBeCloseTo(gz, 6);
    expect(actingInGlobalAxes(node, global.values, global.lcs)).toEqual({ x: 5e3, z: 0 });

    expect(axisMark(node, local.lcs)).toBe('′');
    expect(axisMark(node, global.lcs)).toBe('');
    expect(axisMark(solver.domain.getNode('A'), true)).toBe('');
  });

  it('shows nothing on a node whose own axes are not turned', () => {
    const node = buildSolver().domain.getNode('A');
    expect(isTurned(node)).toBe(false);
    // Axes of its own, at 0 degrees, as a file can carry them
    node.updateLcs({ locx: [1, 0, 0], locy: [0, 1, 0] });
    expect(node.hasLcs()).toBe(true);
    expect(isTurned(node)).toBe(false);
    expect(axisMark(node, true)).toBe('');
  });

  it('keeps its axes through a share link, while a global load writes the same row as before', () => {
    const encoded = serializeModel(buildSolver(), []) as string;
    const rows = (parseSerializedModel(encoded) as { nl: unknown[][] }).nl;
    expect(rows[0]).toHaveLength(3);
    expect(rows[0][2]).toBe(true);
    // A load in the global axes keeps the two-entry row every earlier version wrote and reads
    expect(rows[1]).toHaveLength(2);

    const opened = new LinearStaticSolver();
    expect(deserializeModel(encoded, opened, [])).toBe(true);
    expect(opened.loadCases[0].nodalLoadList.map((l) => l.lcs)).toEqual([true, false]);
  });

  it('opens an old link, without the entry, in the global axes', () => {
    const solver = buildSolver();
    for (const load of solver.loadCases[0].nodalLoadList) load.lcs = false;
    const old = serializeModel(solver, []) as string;
    expect((parseSerializedModel(old) as { nl: unknown[][] }).nl.every((r) => r.length === 2)).toBe(true);

    const opened = new LinearStaticSolver();
    deserializeModel(old, opened, []);
    expect(opened.loadCases[0].nodalLoadList.every((l) => l.lcs === false)).toBe(true);
  });

  it('rejects a link whose entry is not a yes or no', () => {
    const plain = parseSerializedModel(serializeModel(buildSolver(), []) as string) as { nl: unknown[][] };
    plain.nl[0][2] = 'yes';
    const forged = btoa(JSON.stringify(plain));
    const solver = new LinearStaticSolver();
    expect(deserializeModel(forged, solver, [])).toBe(false);
  });

  describe('in a project file', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      // Put in by the build; the file records them
      vi.stubGlobal('APP_VERSION', 'test');
      vi.stubGlobal('APP_COMMIT', 'test');
    });

    it('keeps its axes, and a file without the field opens in the global axes', () => {
      buildSolver(useProjectStore().solver);
      const file = JSON.parse(JSON.stringify(exportJSON()));
      const loads = file.domain.loadCases[0].nodalLoads;
      expect(loads[0].lcs).toBe(true);
      expect('lcs' in loads[1]).toBe(false);

      resetModel();
      importJSON(file);
      expect(useProjectStore().solver.loadCases[0].nodalLoadList.map((l) => l.lcs)).toEqual([true, false]);

      // As every file before the field existed
      delete loads[0].lcs;
      resetModel();
      importJSON(file);
      expect(useProjectStore().solver.loadCases[0].nodalLoadList.every((l) => l.lcs === false)).toBe(true);
    });
  });
});
