import type { Node } from 'ts-fem';

export type DimensionPoint = {
  x: number;
  y: number;
  sourceNodeLabel?: string | number | null;
};

export type DimensionRenderableNode = {
  coords: [number, number, number];
  label?: string | number | null;
};

export type DimensionLine = {
  id?: string;
  distance: number;
  distanceUnit?: 'world' | 'pixel';
  points: [DimensionPoint, DimensionPoint];
};

export const createDimensionPoint = (
  x: number,
  y: number,
  sourceNodeLabel?: string | number | null
): DimensionPoint => {
  return {
    x,
    y,
    sourceNodeLabel: sourceNodeLabel ?? null,
  };
};

export const createDimensionPointFromNode = (node: Pick<Node, 'label' | 'coords'>): DimensionPoint => {
  return createDimensionPoint(node.coords[0], node.coords[2], node.label);
};

export const resolveDimensionPoint = (
  point: DimensionPoint,
  nodeLookup: Pick<Map<string, Node>, 'get'>
): DimensionPoint => {
  if (point.sourceNodeLabel !== null && point.sourceNodeLabel !== undefined) {
    const sourceNode = nodeLookup.get(String(point.sourceNodeLabel));
    if (sourceNode) {
      return createDimensionPoint(sourceNode.coords[0], sourceNode.coords[2], sourceNode.label);
    }
  }

  return createDimensionPoint(point.x, point.y, point.sourceNodeLabel ?? null);
};

export const createDimensionRenderableNode = (
  point: Pick<DimensionPoint, 'x' | 'y'>,
  label?: string | number | null
): DimensionRenderableNode => {
  return {
    coords: [point.x, 0, point.y],
    label: label ?? null,
  };
};
