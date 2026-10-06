import { describe, it, expect } from 'vitest';
import { positionAlongBeam } from '@/utils';

/**
 * A concentrated load or deformation sits at a distance along its beam, and the solver splits the
 * beam there to work out what it does. A distance past either end leaves a segment of negative
 * length, which comes back as nonsense rather than as an error - so it is not allowed to get that
 * far. The dialogs refuse such a value and say why; the boxes in the bottom bar have nowhere to put
 * a reason, so they put the load at the end instead and say where it went.
 */
describe('where a load may sit on its beam', () => {
  it('leaves a distance within the beam alone', () => {
    expect(positionAlongBeam(1.2, 4, 0)).toBe(1.2);
    expect(positionAlongBeam(0, 4, 1)).toBe(0);
    expect(positionAlongBeam(4, 4, 1)).toBe(4);
  });

  it('puts one past the end at the end', () => {
    expect(positionAlongBeam(9, 4, 1)).toBe(4);
    expect(positionAlongBeam(-3, 4, 1)).toBe(0);
  });

  it('leaves the load where it was when the value cannot be read', () => {
    expect(positionAlongBeam(NaN, 4, 1.5)).toBe(1.5);
    expect(positionAlongBeam(Infinity, 4, 1.5)).toBe(4);
  });

  /** An element whose nodes have been moved onto each other has nowhere to put a load. */
  it('copes with a beam of no length', () => {
    expect(positionAlongBeam(2, 0, 0)).toBe(0);
    expect(positionAlongBeam(2, -1, 0)).toBe(0);
  });
});
