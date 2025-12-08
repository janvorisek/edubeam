import type { Node } from 'ts-fem';

export type DimensionLine = {
  id?: string;
  distance: number;
  distanceUnit?: 'world' | 'pixel';
  nodes: Node[];
};
