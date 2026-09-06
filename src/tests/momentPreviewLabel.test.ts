import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import Vector2DHelper from '@/components/Vector2DHelper.vue';

/**
 * The moment and the prescribed rotation are drawn as an arc around the node, open at the bottom,
 * with the arrowhead on the end that says which way it turns. The value belongs there, at the head
 * - fixed above the arc it read as a caption for the whole picture, and on a node carrying a force
 * as well it competed with that arrow's own label.
 *
 * The arc is drawn `M start A r r 0 1 sweep end`, so the last pair in the path data is the point
 * the arrowhead sits on. This checks the label against that point rather than against a number
 * copied out of the component.
 */
const mountHelper = (props: {
  fx: number;
  fz: number;
  my: number;
  type?: 'force' | 'displacement';
  label?: string | number;
}) => mount(Vector2DHelper, { props, global: { plugins: [createVuetify()] } });

/** The end point of the arc, which is where its `marker-end` arrowhead is drawn. */
const arcEnd = (d: string) => {
  const numbers = d
    .trim()
    .split(/[\s,]+/)
    .filter((t) => /^-?[\d.]+$/.test(t));

  return { x: Number(numbers.at(-2)), y: Number(numbers.at(-1)) };
};

const labelOf = (wrapper: ReturnType<typeof mountHelper>) => {
  const text = wrapper.find('g.moment text');

  return { x: Number(text.attributes('x')), y: Number(text.attributes('y')) };
};

describe('the moment value in the nodal load preview', () => {
  beforeEach(() => setActivePinia(createPinia()));

  for (const [name, my] of [
    ['a counter-clockwise moment', 5],
    ['a clockwise moment', -5],
  ] as const) {
    it(`sits at the arrowhead of ${name}`, () => {
      const wrapper = mountHelper({ fx: 0, fz: 0, my });
      const head = arcEnd(wrapper.find('path').attributes('d')!);
      const label = labelOf(wrapper);

      // same direction from the node, just further out
      expect(Math.sign(label.x)).toBe(Math.sign(head.x));
      expect(Math.sign(label.y)).toBe(Math.sign(head.y));

      const headR = Math.hypot(head.x, head.y);
      const labelR = Math.hypot(label.x, label.y);

      expect(labelR).toBeGreaterThan(headR);
      expect(labelR - headR).toBeLessThan(20);
    });
  }

  it('follows the arrowhead to the other side when the moment changes sign', () => {
    const ccw = labelOf(mountHelper({ fx: 0, fz: 0, my: 5 }));
    const cw = labelOf(mountHelper({ fx: 0, fz: 0, my: -5 }));

    expect(Math.sign(ccw.x)).not.toBe(Math.sign(cw.x));
  });

  it('stays with the arrowhead on a prescribed rotation too', () => {
    const wrapper = mountHelper({ fx: 0, fz: 0, my: 0.01, type: 'displacement' });
    const head = arcEnd(wrapper.find('path').attributes('d')!);
    const label = labelOf(wrapper);

    expect(Math.sign(label.x)).toBe(Math.sign(head.x));
    expect(Math.sign(label.y)).toBe(Math.sign(head.y));
  });

  it('turns the arc about the head of the force arrow, not its tail', () => {
    const wrapper = mountHelper({ fx: 1000, fz: -2000, my: 5 });

    // the arrow runs from the origin to its head, which is where the node is
    const arrow = wrapper.find('line');
    const head = { x: Number(arrow.attributes('x2')), y: Number(arrow.attributes('y2')) };

    // the arc group is moved to the node rather than drawn about the origin
    const moved = wrapper
      .find('g.moment')
      .attributes('transform')!
      .match(/translate\(([-\d.]+) ([-\d.]+)\)/)!;

    expect(Number(moved[1])).toBeCloseTo(head.x, 6);
    expect(Number(moved[2])).toBeCloseTo(head.y, 6);
  });

  it('turns the arc about the node itself when there is no force', () => {
    const moved = mountHelper({ fx: 0, fz: 0, my: 5 })
      .find('g.moment')
      .attributes('transform')!
      .match(/translate\(([-\d.]+) ([-\d.]+)\)/)!;

    expect(Number(moved[1])).toBeCloseTo(0, 6);
    expect(Number(moved[2])).toBeCloseTo(0, 6);
  });

  it('marks and names the node it acts on', () => {
    const wrapper = mountHelper({ fx: 1000, fz: -2000, my: 0, label: '12' });
    const arrow = wrapper.find('line');
    const head = { x: Number(arrow.attributes('x2')), y: Number(arrow.attributes('y2')) };
    const marker = wrapper.find('g.node polyline');
    const moved = wrapper
      .find('g.node')
      .attributes('transform')!
      .match(/translate\(([-\d.]+) ([-\d.]+)\)/)!;

    // a square, as on the canvas: a degenerate segment with a square cap, not a dot
    expect(marker.exists()).toBe(true);
    expect(marker.attributes('stroke-linecap')).toBe('square');
    expect(Number(moved[1])).toBeCloseTo(head.x, 6);
    expect(Number(moved[2])).toBeCloseTo(head.y, 6);
    expect(wrapper.find('g.node text').text()).toBe('12');
  });

  it('sets the node name in a bubble, as the canvas does', () => {
    const wrapper = mountHelper({ fx: 0, fz: 0, my: 0, label: '7' });
    const bubble = wrapper.find('g.node circle');

    expect(bubble.exists()).toBe(true);
    expect(bubble.attributes('stroke')).toBe('black');
    expect(Number(bubble.attributes('r'))).toBeGreaterThan(0);
  });

  it('widens the bubble for a longer name', () => {
    const r = (label: string) =>
      Number(mountHelper({ fx: 0, fz: 0, my: 0, label }).find('g.node circle').attributes('r'));

    expect(r('123')).toBeGreaterThan(r('1'));
  });

  it('draws no node when it has not been given one', () => {
    expect(mountHelper({ fx: 1000, fz: -2000, my: 0 }).find('g.node').exists()).toBe(false);
  });

  it('keeps the label inside the frame it draws', () => {
    const wrapper = mountHelper({ fx: 1000, fz: -2000, my: 5 });
    const [x, y, w, h] = wrapper.find('svg').attributes('viewBox')!.split(' ').map(Number);
    const arrow = wrapper.find('line');
    const label = labelOf(wrapper);

    // the label is drawn inside the moved group, so the node offset counts
    const at = {
      x: label.x + Number(arrow.attributes('x2')),
      y: label.y + Number(arrow.attributes('y2')),
    };

    expect(at.x).toBeGreaterThan(x);
    expect(at.x).toBeLessThan(x + w);
    expect(at.y).toBeGreaterThan(y);
    expect(at.y).toBeLessThan(y + h);
  });
});
