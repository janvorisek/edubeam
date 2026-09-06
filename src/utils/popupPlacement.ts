/** The window rectangle of the item a popup belongs to. A DOMRect satisfies it. */
export interface AnchorRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface PopupPlacement {
  anchor: AnchorRect | null;
  width: number;
  height: number;
  viewport: { width: number; height: number };
  /** Kept clear of the window edges, and of the anchor. */
  margin: number;
}

/**
 * Places a popup centred under the item it belongs to, or above it where the bottom of the window
 * is closer, so that a finger never covers what it has just opened. Without an anchor the popup
 * goes to the middle of the window. The result is always inside the window, even where the popup
 * is larger than it. Coordinates are those of the window.
 */
export const placePopupNearAnchor = ({ anchor, width, height, viewport, margin }: PopupPlacement) => {
  const anchorCenterX = anchor ? (anchor.left + anchor.right) / 2 : viewport.width / 2;
  const rightmost = Math.max(margin, viewport.width - width - margin);
  const left = Math.min(Math.max(anchorCenterX - width / 2, margin), rightmost);

  const lowest = Math.max(margin, viewport.height - height - margin);
  let top = anchor ? anchor.bottom + margin : (viewport.height - height) / 2;

  if (top > lowest) {
    const above = (anchor ? anchor.top : viewport.height) - height - margin;
    top = above >= margin ? above : lowest;
  }

  return { left, top };
};
