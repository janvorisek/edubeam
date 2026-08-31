import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { LinearStaticSolver } from 'ts-fem';
import SVGElement from '../components/svg/Element.vue';

const beam = (length: number, hinges: [boolean, boolean]) => {
  const solver = new LinearStaticSolver();
  const domain = solver.domain;

  domain.createNode(1, [0, 0, 0], []);
  domain.createNode(2, [length, 0, 0], []);
  domain.createMaterial(1, { e: 1, g: 1, alpha: 0, d: 0 });
  domain.createCrossSection(1, { a: 1, iy: 1, h: 1, k: 1 });
  domain.createBeam2D(1, [1, 2], 1, 1, hinges);

  return { solver, element: domain.getElement(1) };
};

const hingeX = (length: number, hinges: [boolean, boolean], scale: number) => {
  const { solver, element } = beam(length, hinges);
  const wrapper = mount(SVGElement, {
    props: { element, scale, showGeometry: true, showResults: false, loadCase: solver.loadCases[0] },
  });

  return wrapper.findAll('circle').map((c) => Number(/translate\(([-\d.]+)/.exec(c.attributes('transform') ?? '')![1]));
};

describe('hinge markers', () => {
  it('sits 9px inside the element it belongs to', () => {
    expect(hingeX(4, [true, false], 10)).toEqual([0.9]);
    expect(hingeX(4, [false, true], 10)).toEqual([4 - 0.9]);
  });

  it('stays inside the element when it is drawn only a few pixels long', () => {
    // 9px at this scale would be 4.5 units - past the far node, drawing the hinge at the wrong end
    const [start, end] = hingeX(4, [true, true], 2);

    expect(start).toBeGreaterThan(0);
    expect(start).toBeLessThan(end);
    expect(end).toBeLessThan(4);
  });
});
