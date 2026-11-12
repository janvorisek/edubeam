import { describe, it, expect } from 'vitest';
import { decodeLayers, encodeLayers } from '@/utils/viewLayers';

describe('layers in a shared link', () => {
  it('writes one letter per layer that is on, and reads them back', () => {
    const layers = decodeLayers('MRL');

    expect(layers).toEqual({
      showNormalForce: false,
      showShearForce: false,
      showBendingMoment: true,
      showDeformedShape: false,
      showReactions: true,
      showLoads: true,
      showSupports: false,
      showNodeLabels: false,
      showElementLabels: false,
    });
    expect(encodeLayers(layers)).toBe('MRL');
  });

  it('tells the labels from the forces by case: n is node labels, N the normal force', () => {
    expect(decodeLayers('n').showNodeLabels).toBe(true);
    expect(decodeLayers('n').showNormalForce).toBe(false);
    expect(decodeLayers('N').showNormalForce).toBe(true);
  });

  it('takes an empty switch as nothing on, and ignores letters it does not know', () => {
    expect(Object.values(decodeLayers('')).some(Boolean)).toBe(false);
    expect(encodeLayers(decodeLayers('MXZ?'))).toBe('M');
  });

  it('writes the letters in one order whatever order they were read in', () => {
    expect(encodeLayers(decodeLayers('LRMUeSnVN'))).toBe('NVMURLSne');
  });
});
