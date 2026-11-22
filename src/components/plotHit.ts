/**
 * PROTOTYPE: what the plot drawing draws, for hit-testing it where it is drawn, in the drawing's px.
 * The editor's own drawing is not mounted in that mode: these are the only hit targets.
 */
export interface PlotHit {
  /** What it draws, as plot names it: `elementLoad:3`, `nodalLoad:0`, `prescribed:1`, `member:2` */
  readonly entity: string;
  /** What kind of thing it is, as plot groups it: `loads`, `N`, `V`, `M` */
  readonly group?: string;
  readonly d: string;
  /** The hit stroke's width, px: wider than the drawn line, to be easy to point at */
  readonly width: number;
  /** An area hit anywhere inside (a distributed load's band), not only along its outline */
  readonly area?: boolean;
}

/** A label, hit where it is written: a value is part of what it labels */
export interface PlotLabelHit {
  readonly entity: string;
  /** Which layer the label is in: a diagram's (`M`), the member names', a load's */
  readonly group: string;
  readonly x: number;
  readonly y: number;
  readonly anchor: 'start' | 'middle' | 'end';
  readonly transform?: string;
  readonly text: string;
  /** px */
  readonly size: number;
}

export interface PlotHits {
  /** px per metre the drawing is built at */
  readonly scale: number;
  /** Bands first, then the smaller loads, so a point load drawn through a band can be reached */
  readonly loads: readonly PlotHit[];
  /** Each member's diagrams (`member:3`), hit anywhere inside: over a diagram is over its member */
  readonly results: readonly PlotHit[];
  /** The labels of loads and members: their values and names */
  readonly labels: readonly PlotLabelHit[];
  /** Each member's line, px */
  readonly members: readonly {
    readonly id: string;
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
  }[];
  /** Each node, px */
  readonly nodes: readonly { readonly id: string; readonly x: number; readonly y: number }[];
}
