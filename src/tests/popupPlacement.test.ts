import { describe, it, expect } from 'vitest';
import { placePopupNearAnchor } from '../utils/popupPlacement';

const viewport = { width: 1000, height: 800 };
const rect = (left: number, top: number, width: number, height: number): DOMRect =>
  ({ left, top, right: left + width, bottom: top + height, width, height }) as DOMRect;

describe('popup placement', () => {
  it('centres the popup under the item it belongs to', () => {
    const { left, top } = placePopupNearAnchor({
      anchor: rect(500, 300, 24, 24),
      width: 210,
      height: 120,
      viewport,
      margin: 8,
    });

    expect(left).toBe(512 - 105);
    expect(top).toBe(332);
  });

  it('flips above the item when the bottom of the window is closer', () => {
    const { top } = placePopupNearAnchor({
      anchor: rect(500, 700, 24, 24),
      width: 210,
      height: 120,
      viewport,
      margin: 8,
    });

    // 700 - 120 - 8: clear of the item, not off the bottom edge
    expect(top).toBe(572);
  });

  it('keeps a popup taller than the item allows inside the window', () => {
    const { top } = placePopupNearAnchor({
      anchor: rect(500, 380, 24, 24),
      width: 210,
      height: 780,
      viewport,
      margin: 8,
    });

    // Neither below nor above the item leaves room, so it sits as low as it can: 800 - 780 - 8
    expect(top).toBe(12);
  });

  it('keeps a popup that is taller than the window at the top edge', () => {
    const { top } = placePopupNearAnchor({
      anchor: rect(500, 380, 24, 24),
      width: 210,
      height: 900,
      viewport,
      margin: 8,
    });

    expect(top).toBe(8);
  });

  it('clamps to the window edges', () => {
    const margin = 8;

    expect(placePopupNearAnchor({ anchor: rect(0, 10, 4, 4), width: 210, height: 120, viewport, margin }).left).toBe(8);
    expect(placePopupNearAnchor({ anchor: rect(996, 10, 4, 4), width: 210, height: 120, viewport, margin }).left).toBe(
      782
    );
  });

  it('falls back to the middle of the window without an anchor', () => {
    const { left, top } = placePopupNearAnchor({
      anchor: null,
      width: 210,
      height: 120,
      viewport,
      margin: 8,
    });

    expect(left).toBe(395);
    expect(top).toBe(340);
  });
});
