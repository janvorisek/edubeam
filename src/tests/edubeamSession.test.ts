import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createPinia, setActivePinia } from 'pinia';
import { DofID, type Beam2D, type Node } from 'ts-fem';
import type { Matrix } from 'mathjs';
import { useProjectStore } from '@/store/project';
import { importJSON, resetModel } from '@/utils';
import { parsePythonLiteral, PythonLiteralError } from '@/utils/pythonLiteral';
import {
  EduBeamSessionError,
  isEduBeamSession,
  parseEduBeamSession,
  type SessionProject,
} from '@/utils/edubeamSession';
import { validateSolverModel } from '@/utils/validateSolverModel';

const fixture = (name: string) => readFileSync(join(process.cwd(), 'src/tests/fixtures/edubeam-xml', name), 'utf-8');

/** A session with the given model, in the layout EduBeam 3.4 saved. */
const session = (body: string) => `<?xml version="1.0" ?>
<!--
EduBeam session
saved in version 3.4.3 on 2017-01-10 at 21h:02m:45s
-->
<session version="3.4.3">
  <domain cName="Domain">
    <materials><Material alpha="1.2e-05" d="1.0" e="30000000.0" g="10000000.0" label="mat"/></materials>
    <crossSects><CrossSection a="0.06" h="0.3" iy="0.00045" k="1000000000000.0" label="cs"/></crossSects>
    ${body}
  </domain>
</session>`;

const elementLoad = (where: string, value: string) =>
  `<ElementLoad label="L" loadCase="Default_loadcase" value="${value}" where="${where}"/>`;

const uniform = (dir: string, magnitude: number, perX = false) =>
  `{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': 0, 'dTc': 0, 'magnitude': ${magnitude}, 'perX': ${perX ? 'True' : 'False'}, 'type': 'Uniform', 'dir': u'${dir}'}`;

/** Imports a session the way opening it does, and solves it. */
const solve = (project: SessionProject) => {
  const store = useProjectStore();
  resetModel();
  importJSON(project);

  expect(validateSolverModel(store.solver).errors).toEqual([]);
  store.solver.solve();

  /** Reactions by DOF, read the way the results table reads them. */
  const reaction = (label: string) => {
    const node = store.solver.domain.nodes.get(label) as Node;
    const { dofs, values } = node.getReactions(store.solver.loadCases[0], true);
    const at = (i: number) => ('get' in values ? (values as unknown as Matrix).get([i]) : values[i]) as number;
    return Object.fromEntries(dofs.map((dof, i) => [dof, at(i)])) as Partial<Record<DofID, number>>;
  };
  const endForces = (label: string) =>
    (store.solver.domain.elements.get(label) as Beam2D)
      .computeEndForces(store.solver.loadCases[0])
      .toArray() as number[];

  return { store, reaction, endForces };
};

describe('reading Python literals', () => {
  it('reads what EduBeam wrote into its attributes', () => {
    expect(parsePythonLiteral("{'Y': True, 'x': False, 'z': True}")).toEqual({ Y: true, x: false, z: true });
    expect(parsePythonLiteral("['1', '2']")).toEqual(['1', '2']);
    expect(parsePythonLiteral('(0.0, -1.5e-3, 2)')).toEqual([0, -0.0015, 2]);
    expect(parsePythonLiteral("{'dir': u'Local Z', 'perX': False, 'x': None}")).toEqual({
      dir: 'Local Z',
      perX: false,
      x: null,
    });
    expect(parsePythonLiteral(String.raw`u'Matroš 1'`)).toBe('Matroš 1');
    expect(parsePythonLiteral(`"it's"`)).toBe("it's");
    expect(parsePythonLiteral('10L')).toBe(10);
  });

  it('refuses anything that is not a literal', () => {
    expect(() => parsePythonLiteral("__import__('os')")).toThrow(PythonLiteralError);
    expect(() => parsePythonLiteral("{'a': 1")).toThrow(PythonLiteralError);
    expect(() => parsePythonLiteral('[1, 2] 3')).toThrow(PythonLiteralError);
  });
});

describe('the sessions EduBeam shipped', () => {
  it('reads labels with diacritics, and the first of several load cases', () => {
    const { project, skippedLoadCases, version } = parseEduBeamSession(fixture('ex01.xml'));
    const { domain } = project;

    expect(version).toBe('3.2.0');
    expect(domain.materials.map((m) => m.label)).toEqual(['DefaultMat šš']);
    expect(domain.elements[0]).toMatchObject({ mat: 'DefaultMat šš', cs: 'DefaultCS ěě', nodes: ['1', '2'] });
    expect(domain.nodes.map((n) => n.label)).toEqual(['1', '3', '2', '5', '4']);

    // "spojite" comes first in the file; the nodal loads of the other case are left out, and said so.
    expect(domain.loadCases[0].label).toBe('spojite');
    expect(domain.loadCases[0].elementLoads).toHaveLength(3);
    expect(domain.loadCases[0].nodalLoads).toHaveLength(0);
    expect(skippedLoadCases).toEqual(['Default_loadcase']);
  });

  it('reads the worked example of its manual in kN, kPa and m', () => {
    const { domain } = parseEduBeamSession(fixture('ex03.xml')).project;

    expect(domain.materials[0]).toMatchObject({ label: 'Matroš 1', e: 30e9, g: 30e9, alpha: 1.2e-5 });
    expect(domain.crossSections[0]).toMatchObject({ a: 0.162, iy: 0.0039366, h: 0.54, k: 1e12 });
    expect(domain.elements.find((e) => e.label === '5')?.hinges).toEqual([false, true]);
    expect(domain.nodes.find((n) => n.label === '6')).toMatchObject({
      coords: [2.4, 0, 3],
      bcs: [DofID.Dx, DofID.Dz, DofID.Ry],
    });

    // The manual: Fx = -18 kN, Fz = 24 kN at node 4; Tc = 30 °C, Td - Th = -20 °C.
    const loads = domain.loadCases[0];
    expect(loads.nodalLoads).toEqual([{ target: '4', values: { [DofID.Dx]: -18e3, [DofID.Dz]: 24e3, [DofID.Ry]: 0 } }]);
    expect(loads.elementLoads).toContainEqual({ type: 'udl', target: '1', lcs: true, values: [0, 10e3] });
    expect(loads.elementLoads).toContainEqual({ type: 'temperature', target: '2', lcs: true, values: [30, -20, 0] });
  });

  it('reads every kind of load a 3.4 session holds, and solves it', () => {
    const { project } = parseEduBeamSession(fixture('session-3.4.3.xml'));
    const loads = project.domain.loadCases[0].elementLoads;

    expect(loads.filter((l) => l.type === 'concentrated')).toHaveLength(2);
    expect(loads.filter((l) => l.type === 'temperature').length).toBeGreaterThan(0);
    // dir 'X' is the global direction, 'Local Z' the element's own
    expect(loads.some((l) => l.type === 'udl' && !l.lcs && l.values[0] !== 0)).toBe(true);
    expect(loads.some((l) => l.type === 'udl' && l.lcs)).toBe(true);

    setActivePinia(createPinia());
    const store = useProjectStore();
    resetModel();
    importJSON(project);
    expect(store.solver.domain.elements.size).toBe(project.domain.elements.length);
  });

  it('reads the 2.2.6 layout: loads on the domain, lists on the nodes', () => {
    const { project, skippedLoadCases } = parseEduBeamSession(fixture('session-2.2.6.xml'));
    const { domain } = project;

    expect(skippedLoadCases).toEqual([]);
    expect(domain.nodes[0]).toMatchObject({ coords: [0, 0, 0], bcs: [DofID.Dx, DofID.Dz] });
    expect(domain.elements[1]).toMatchObject({ nodes: ['2', '3'], hinges: [false, false] });

    const loads = domain.loadCases[0];
    expect(loads.nodalLoads).toEqual([{ target: '2', values: { [DofID.Dx]: 0, [DofID.Dz]: 10e3, [DofID.Ry]: 0 } }]);
    expect(loads.elementLoads).toEqual([
      { type: 'udl', target: '1', lcs: true, values: [0, 5e3] },
      { type: 'temperature', target: '2', lcs: true, values: [10, -5, 0] },
    ]);
    expect(loads.prescribedBC).toEqual([
      { target: '1', prescribedValues: { [DofID.Dx]: 0, [DofID.Dz]: 0.002, [DofID.Ry]: 0 } },
    ]);
  });
});

describe('telling a session from a project file', () => {
  it('knows a session by its root element', () => {
    for (const name of ['ex01.xml', 'ex03.xml', 'session-3.4.3.xml', 'session-2.2.6.xml']) {
      expect(isEduBeamSession(fixture(name)), name).toBe(true);
    }
    expect(isEduBeamSession('{"edubeam": true, "domain": {}}')).toBe(false);
    expect(isEduBeamSession('<html><body/></html>')).toBe(false);
  });

  it('says what is wrong with a broken one instead of loading half of it', () => {
    expect(() => parseEduBeamSession('<session><domain>')).toThrow(EduBeamSessionError);
    expect(() => parseEduBeamSession('<other/>')).toThrow(/not an EduBeam session/);
    expect(() =>
      parseEduBeamSession(session('<nodes><Node bcs="{}" coords="[0.0, 0.0, oops]" label="1"/></nodes>'))
    ).toThrow(/coords of node 1/);
    expect(() =>
      parseEduBeamSession(
        session(`<elements><Beam2d cs="cs" hinges="[False, False]" label="1" mat="mat" nodes="['1']"/></elements>`)
      )
    ).toThrow(/element 1 does not have two nodes/);
  });
});

/**
 * Checked against closed forms, in the session's kN and m: an imported model has to carry the same
 * loads the desktop program applied, or it would not give its results.
 */
describe('an imported session against hand calculation', () => {
  beforeEach(() => setActivePinia(createPinia()));

  const simplySupported = (x2: number, z2: number, loads: string) =>
    session(`
    <nodes>
      <Node bcs="{'Y': False, 'x': True, 'z': True}" coords="[0.0, 0.0, 0.0]" label="1"/>
      <Node bcs="{'Y': False, 'x': False, 'z': True}" coords="[${x2}, 0.0, ${z2}]" label="2"/>
    </nodes>
    <elements><Beam2d cs="cs" hinges="[False, False]" label="1" mat="mat" nodes="['1', '2']"/></elements>
    <loadCases><LoadCase label="Default_loadcase">${loads}</LoadCase></loadCases>`);

  it('carries a uniform load of 5 kN/m on 4 m with 10 kN at each support and qL²/8 at midspan', () => {
    const { reaction, store } = solve(
      parseEduBeamSession(simplySupported(4, 0, elementLoad('1', uniform('Z', 5)))).project
    );

    expect(reaction('1')[DofID.Dz]).toBeCloseTo(-10e3, 6);
    expect(reaction('2')[DofID.Dz]).toBeCloseTo(-10e3, 6);

    const beam = store.solver.domain.elements.get('1') as Beam2D;
    const moments = beam.computeBendingMoment(store.solver.loadCases[0], 2).M as number[];
    expect(Math.abs(moments[1])).toBeCloseTo((5e3 * 4 ** 2) / 8, 6);
  });

  it('takes perX as per horizontal metre: 10 kN/m over a 3 m projection is 30 kN, not 50', () => {
    // a 5 m beam rising 4 m over 3 m
    const projected = solve(
      parseEduBeamSession(simplySupported(3, -4, elementLoad('1', uniform('Z', 10, true)))).project
    );
    expect(projected.reaction('1')[DofID.Dz]! + projected.reaction('2')[DofID.Dz]!).toBeCloseTo(-30e3, 6);

    setActivePinia(createPinia());
    const along = solve(parseEduBeamSession(simplySupported(3, -4, elementLoad('1', uniform('Z', 10)))).project);
    expect(along.reaction('1')[DofID.Dz]! + along.reaction('2')[DofID.Dz]!).toBeCloseTo(-50e3, 6);
  });

  it('places a 12 kN point force 1 m along a 4 m span: 9 kN and 3 kN at the supports', () => {
    const force = `{'DistF': 1.0, 'Fx': 0.0, 'Fz': 12.0, 'dTg': 0, 'dTc': 0, 'magnitude': 0, 'perX': False, 'type': 'Force', 'dir': u'Z'}`;
    const { reaction } = solve(parseEduBeamSession(simplySupported(4, 0, elementLoad('1', force))).project);

    expect(reaction('1')[DofID.Dz]).toBeCloseTo(-9e3, 6);
    expect(reaction('2')[DofID.Dz]).toBeCloseTo(-3e3, 6);
  });

  it('restrains a heated fixed beam with N = EAαΔTc and M = EIαΔT/h', () => {
    const heated = `{'DistF': 0, 'Fx': 0, 'Fz': 0, 'dTg': -20.0, 'dTc': 10.0, 'magnitude': 0, 'perX': False, 'type': 'Temperature', 'dir': u'Z'}`;
    const { endForces } = solve(
      parseEduBeamSession(
        session(`
        <nodes>
          <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[0.0, 0.0, 0.0]" label="1"/>
          <Node bcs="{'Y': True, 'x': True, 'z': True}" coords="[4.0, 0.0, 0.0]" label="2"/>
        </nodes>
        <elements><Beam2d cs="cs" hinges="[False, False]" label="1" mat="mat" nodes="['1', '2']"/></elements>
        <loadCases><LoadCase label="Default_loadcase">${elementLoad('1', heated)}</LoadCase></loadCases>`)
      ).project
    );

    const [n, , m] = endForces('1');
    const E = 30e9;
    expect(Math.abs(n)).toBeCloseTo(E * 0.06 * 1.2e-5 * 10, 3);
    expect(Math.abs(m)).toBeCloseTo((E * 0.00045 * 1.2e-5 * 20) / 0.3, 3);
  });
});
