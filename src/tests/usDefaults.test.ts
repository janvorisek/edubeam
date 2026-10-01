import { describe, it, expect } from 'vitest';
import { LinearStaticSolver } from 'ts-fem';
import { buildStarterModel } from '@/utils/starterModel';
import { crossSectionPresets } from '@/utils/crossSectionPresets';
import { materialPresets } from '@/utils/materialPresets';
import { familyFirst } from '@/utils/presetFamily';
import { newMaterialDefaults, newPointLoadPosition, newSectionPresetDefaults } from '@/utils/newEntityDefaults';
import { fromSI, unitSize } from '@/utils/unitConversions';

const ft = (m: number) => fromSI(m, unitSize.length('ft'));
const inches = (m: number) => fromSI(m, unitSize.length('in'));

describe('the US starter frame', () => {
  it('is a 10 ft frame of W12x26 under 0.5 to 1.5 kip/ft', () => {
    const solver = new LinearStaticSolver();
    buildStarterModel(solver, [], 'us');
    const { nodes, crossSections, materials } = solver.domain;

    expect(ft(nodes.get('3')!.coords[0])).toBe(10);
    expect(ft(-nodes.get('3')!.coords[2])).toBe(10);
    expect(fromSI(crossSections.get('1')!.iy, unitSize.secondMoment('in4'))).toBe(204);
    expect(fromSI(materials.get('1')!.e, unitSize.pressure('ksi'))).toBe(29000);

    const load = solver.loadCases[0].elementLoadList[0] as unknown as { startValues: number[]; endValues: number[] };
    const kipPerFt = unitSize.force('kip') / unitSize.length('ft');
    expect(fromSI(load.startValues[1], kipPerFt)).toBe(0.5);
    expect(fromSI(load.endValues[1], kipPerFt)).toBe(1.5);
  });
});

describe('the US libraries', () => {
  const section = (name: string) => crossSectionPresets.find((p) => p.name === name)!;

  it('carries the AISC tables: W12x26 is 7.65 in², 204 in⁴, 12.2 in deep', () => {
    const w = section('W12x26');
    expect(fromSI(w.a, unitSize.area('in2'))).toBe(7.65);
    expect(fromSI(w.iy, unitSize.secondMoment('in4'))).toBe(204);
    expect(inches(w.h)).toBe(12.2);
    // Shear on the web alone: 12.2 · 0.230 / 7.65
    expect(w.k).toBeCloseTo(0.3668, 4);
  });

  it('gives every US shape a shear coefficient between 0 and 1', () => {
    for (const p of crossSectionPresets.filter((p) => p.family === 'us')) {
      expect(p.k, p.name).toBeGreaterThan(0);
      expect(p.k, p.name).toBeLessThan(1);
    }
  });

  it('gives the ASTM steels the AISC moduli and the 490 lb/ft³ unit weight', () => {
    const a992 = materialPresets.find((p) => p.name === 'Steel (ASTM A992)')!;
    expect(fromSI(a992.e, unitSize.pressure('ksi'))).toBe(29000);
    expect(fromSI(a992.g, unitSize.pressure('ksi'))).toBe(11200);
    expect(fromSI(a992.d, unitSize.mass('lb') / unitSize.length('ft') ** 3)).toBe(490);
  });

  it("puts concrete's Ec at 57 000 √f'c psi", () => {
    const concrete = materialPresets.find((p) => p.name === "Concrete (f'c = 4 ksi)")!;
    expect(fromSI(concrete.e, unitSize.pressure('psi'))).toBeCloseTo(57000 * Math.sqrt(4000), -3);
  });

  it('lists the family in use first', () => {
    const ordered = familyFirst(crossSectionPresets, 'us');
    expect(ordered[0].name).toBe('W8x31');
    expect(familyFirst(crossSectionPresets, 'metric')[0].family).toBe('metric');
    expect(ordered).toHaveLength(crossSectionPresets.length);
  });
});

describe('what new things start as in US units', () => {
  it('starts a material as A992', () => {
    expect(fromSI(newMaterialDefaults('us').e, unitSize.pressure('ksi'))).toBe(29000);
    // and the metric one as it always was
    expect(newMaterialDefaults('metric')).toEqual({ e: 210e9, g: 87.5e9, alpha: 12e-6, d: 1000 });
  });

  it('draws a new section in whole and fractional inches', () => {
    const d = newSectionPresetDefaults('us');
    expect([inches(d.b), inches(d.h), inches(d.tw), inches(d.tf)]).toEqual([4, 8, 0.25, 0.375]);
  });

  it('puts a point load on a whole foot near midspan', () => {
    // 25 ft element: 12 ft from the start
    expect(ft(newPointLoadPosition(25 * 0.3048, 'us'))).toBe(12);
    // 50 ft: capped at 15 ft
    expect(ft(newPointLoadPosition(50 * 0.3048, 'us'))).toBe(15);
    // metric as before: 6 m element, 3 m
    expect(newPointLoadPosition(6, 'metric')).toBe(3);
  });
});
