import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { frameQueue } from '@/utils/frameQueue';

let frames: (() => void)[] = [];

beforeEach(() => {
  frames = [];
  vi.stubGlobal('requestAnimationFrame', (cb: () => void) => frames.push(cb));
  vi.stubGlobal('cancelAnimationFrame', (id: number) => (frames[id - 1] = () => {}));
});

afterEach(() => vi.unstubAllGlobals());

const paint = () => {
  const pending = frames;
  frames = [];
  pending.forEach((cb) => cb());
};

describe('frame queue', () => {
  it('applies the newest value once a frame, not every value', () => {
    const applied: number[] = [];
    const queue = frameQueue<number>((v) => applied.push(v));

    // a finger reporting several times between two paints
    queue.schedule(1);
    queue.schedule(2);
    queue.schedule(3);

    expect(applied).toEqual([]);
    paint();
    expect(applied).toEqual([3]);
  });

  it('takes a new frame for the value after a paint', () => {
    const applied: number[] = [];
    const queue = frameQueue<number>((v) => applied.push(v));

    queue.schedule(1);
    paint();
    queue.schedule(2);
    paint();

    expect(applied).toEqual([1, 2]);
  });

  it('applies nothing after it is cancelled', () => {
    const applied: number[] = [];
    const queue = frameQueue<number>((v) => applied.push(v));

    queue.schedule(1);
    queue.cancel();
    paint();

    expect(applied).toEqual([]);
  });
});
