import { describe, it, expect } from 'vitest';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { buildElementResultRows, buildNodeResultRows, buildResultsCsv, type ResultUnits } from '@/utils/exportResults';

const SI: ResultUnits = {
  lengthLabel: 'm',
  angleLabel: 'rad',
  forceLabel: 'kN',
  momentLabel: 'kNm',
  length: (v) => v,
  force: (v) => v / 1000,
  moment: (v) => v / 1000,
};

/** Cantilever with a 1 kN downward tip load, so hand values are easy to check. */
const buildSolved = () => {
  const ls = new LinearStaticSolver();
  const d = ls.domain;
  d.createMaterial('m', { d: 7850, e: 210e9, g: 80e9, alpha: 12e-6 });
  d.createCrossSection('cs', { a: 0.01, iy: 8e-5, h: 0.2, k: 1e32 });
  d.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
  d.createNode('2', [3, 0, 0], []);
  d.createBeam2D('B1', ['1', '2'], 'm', 'cs');
  ls.loadCases[0].createNodalLoad('2', [0, 0, 1000, 0, 0, 0]);
  ls.solve();
  return ls;
};

describe('exportResults', () => {
  it('exports node coordinates, displacements and reactions in display units', () => {
    const ls = buildSolved();
    const rows = buildNodeResultRows(ls, SI);

    expect(rows[0]).toEqual([
      'Node',
      'x [m]',
      'z [m]',
      'Dx [m]',
      'Dz [m]',
      'Ry [rad]',
      'Rx [kN]',
      'Rz [kN]',
      'My [kNm]',
    ]);

    const [fixed, tip] = [rows[1], rows[2]];

    expect(fixed[0]).toBe('1');
    expect(tip[0]).toBe('2');
    expect(tip[1]).toBe(3);

    // Fixed end holds still and carries the whole load; 1 kN over a 3 m arm is 3 kNm.
    expect(fixed[4]).toBeCloseTo(0, 12);
    expect(fixed[7]).toBeCloseTo(-1, 9);
    expect(Math.abs(fixed[8] as number)).toBeCloseTo(3, 9);

    // Tip deflection of a cantilever is FL^3 / 3EI.
    expect(tip[4]).toBeCloseTo((1000 * 3 ** 3) / (3 * 210e9 * 8e-5), 9);
    // An unsupported node has no reactions rather than zeroes.
    expect(tip.slice(6)).toEqual([null, null, null]);
  });

  it('follows the units it is handed', () => {
    const rows = buildNodeResultRows(buildSolved(), {
      ...SI,
      lengthLabel: 'mm',
      forceLabel: 'N',
      length: (v) => v * 1000,
      force: (v) => v,
    });

    expect(rows[0][1]).toBe('x [mm]');
    expect(rows[0][6]).toBe('Rx [N]');
    expect(rows[2][1]).toBeCloseTo(3000, 6);
    expect(rows[1][7]).toBeCloseTo(-1000, 6);
  });

  it('exports both end force triplets per element', () => {
    const rows = buildElementResultRows(buildSolved(), SI);

    expect(rows[0]).toEqual([
      'Element',
      'Node 1',
      'Node 2',
      'N1 [kN]',
      'V1 [kN]',
      'M1 [kNm]',
      'N2 [kN]',
      'V2 [kN]',
      'M2 [kNm]',
    ]);
    expect(rows[1].slice(0, 3)).toEqual(['B1', '1', '2']);
    expect(rows[1]).toHaveLength(9);
    // Nothing pushes along the beam, so both axial ends are zero.
    expect(rows[1][3]).toBeCloseTo(0, 9);
    expect(rows[1][6]).toBeCloseTo(0, 9);
  });

  it('quotes separators and keeps the two tables apart', () => {
    const ls = new LinearStaticSolver();
    const d = ls.domain;
    d.createMaterial('m', { d: 7850, e: 210e9, g: 80e9, alpha: 12e-6 });
    d.createCrossSection('cs', { a: 0.01, iy: 8e-5, h: 0.2, k: 1e32 });
    d.createNode('fixed', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    d.createNode('a,b', [3, 0, 0], []);
    d.createBeam2D('B1', ['fixed', 'a,b'], 'm', 'cs');
    ls.solve();

    const csv = buildResultsCsv(ls, SI);

    expect(csv).toContain(String.fromCharCode(34) + 'a,b' + String.fromCharCode(34));
    expect(csv).toContain('\r\n\r\nElement,');
  });
});
