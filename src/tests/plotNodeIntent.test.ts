import { describe, expect, it } from 'vitest';
import type { PlotModel } from '@edubeam/plot';
import { FAST, NODE_PX, READING_PX, nodeNear, pointerMotion, readingOnTo } from '@/components/plotNodeIntent';

/**
 * A T: member 1 runs from A to B, member 2 on from B to C, member 3 hangs from B down to D.
 * Drawn at 100 px per metre with the screen's axes as the model's (x right, z down).
 */
const T: PlotModel = {
  nodes: [
    { id: 'A', x: 0, z: 0, fixity: { dx: true, dz: true, ry: false }, angle: 0 },
    { id: 'B', x: 4, z: 0, fixity: { dx: false, dz: false, ry: false }, angle: 0 },
    { id: 'C', x: 8, z: 0, fixity: { dx: false, dz: true, ry: false }, angle: 0 },
    { id: 'D', x: 4, z: 3, fixity: { dx: true, dz: true, ry: true }, angle: 0 },
  ],
  members: [
    { id: '1', start: 'A', end: 'B', hinges: [false, false] },
    { id: '2', start: 'B', end: 'C', hinges: [false, false] },
    { id: '3', start: 'B', end: 'D', hinges: [false, false] },
  ],
  loads: [],
};
const SCREEN = { a: 1, d: 1 };
const B = { x: 400, y: 0 };
const slowRight = { x: 0.3, y: 0 };

describe('near a node, the values at the pointer', () => {
  it('stay on the member read slowly along to its end', () => {
    expect(readingOnTo(T, 'B', { member: '1', x: 100, y: 0 }, B, slowRight, SCREEN)).toBe('1');
  });

  it('stay on it when the pointer comes to rest at the end', () => {
    expect(readingOnTo(T, 'B', { member: '1', x: 100, y: 0 }, B, { x: 0, y: 0 }, SCREEN)).toBe('1');
  });

  it('give way to the node when the member was only brushed on the way', () => {
    const brushed = { member: '1', x: B.x - (READING_PX - 10), y: 0 };
    expect(readingOnTo(T, 'B', brushed, B, slowRight, SCREEN)).toBeNull();
  });

  it('give way to the node when the pointer moves fast', () => {
    expect(readingOnTo(T, 'B', { member: '1', x: 100, y: 0 }, B, { x: FAST + 0.5, y: 0 }, SCREEN)).toBeNull();
  });

  it('give way to the node when the pointer comes across the member', () => {
    // Read along member 1 a while ago, now arriving at B from below
    expect(readingOnTo(T, 'B', { member: '1', x: 100, y: 0 }, B, { x: 0.05, y: -0.3 }, SCREEN)).toBeNull();
  });

  it('give way to the node at the far end of a member not being read', () => {
    expect(readingOnTo(T, 'C', { member: '1', x: 100, y: 0 }, { x: 800, y: 0 }, slowRight, SCREEN)).toBeNull();
  });

  it('give way to the node when nothing was being read', () => {
    expect(readingOnTo(T, 'B', null, B, slowRight, SCREEN)).toBeNull();
  });

  it('follow a member read upward on a screen that flips z', () => {
    // Member 3 drawn upward from D to B: z down in the model is up on this screen
    const flipped = { a: 1, d: -1 };
    expect(readingOnTo(T, 'B', { member: '3', x: 400, y: -300 }, B, { x: 0, y: 0.3 }, flipped)).toBe('3');
  });
});

describe('the pointer', () => {
  it('moves at the pace of its trail, px per ms', () => {
    expect(pointerMotion([])).toEqual({ x: 0, y: 0 });
    expect(
      pointerMotion([
        { t: 0, x: 0, y: 0 },
        { t: 50, x: 10, y: 0 },
        { t: 100, x: 40, y: -20 },
      ])
    ).toEqual({ x: 0.4, y: -0.2 });
  });

  it('reaches the nearest node within its hit target, at any zoom', () => {
    expect(nodeNear(T, 100, 405, 3, 1)?.id).toBe('B');
    expect(nodeNear(T, 100, 400 + NODE_PX + 1, 0, 1)).toBeNull();
    // Zoomed out to half: a screen px spans two of the drawing's px
    expect(nodeNear(T, 100, 400 + NODE_PX + 1, 0, 2)?.id).toBe('B');
  });
});
