import { describe, it, expect } from 'vitest';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { applyNodeLcsAngle, nodeLcsAngle } from '@/utils/nodalLcs';

const makeNode = () => {
  const solver = new LinearStaticSolver();
  solver.domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);

  return solver.domain.getNode(1);
};

describe('nodal LCS angle', () => {
  it('reads back what it wrote', () => {
    const node = makeNode();

    for (const degrees of [15, 30, 45, 90, 135, 179, -30, -90, -179]) {
      applyNodeLcsAngle(node, degrees);
      expect(nodeLcsAngle(node)).toBeCloseTo(degrees, 6);
    }
  });

  it('reports an unrotated node as zero', () => {
    expect(nodeLcsAngle(makeNode())).toBe(0);
    expect(nodeLcsAngle(undefined)).toBe(0);
  });

  it('removes the local system for zero, and for an unreadable angle', () => {
    const node = makeNode();

    applyNodeLcsAngle(node, 30);
    expect(node.hasLcs()).toBe(true);

    applyNodeLcsAngle(node, 0);
    expect(node.hasLcs()).toBe(false);

    applyNodeLcsAngle(node, 30);
    applyNodeLcsAngle(node, NaN);
    expect(node.hasLcs()).toBe(false);
  });

  it('reports an angle past a half turn the short way round', () => {
    const node = makeNode();

    // 190 and -170 are the same support; the field should show the one it accepts back.
    applyNodeLcsAngle(node, 190);
    expect(nodeLcsAngle(node)).toBeCloseTo(-170, 6);
  });
});
