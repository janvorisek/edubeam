import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { supportsTouch } from '@/utils/pointer';

/**
 * Whether a screen can be touched is a different question from whether a pointer can hover, and the
 * two are not opposites. A laptop with a touch screen answers yes to both, and asking for the
 * absence of hover hid the box select button from exactly that device - the one that needs it,
 * since a drag of the mouse there already selects a window and a drag of the finger cannot.
 */
const media =
  (...understood: string[]) =>
  (query: string) =>
    understood.includes(query);

describe('whether the screen can be touched', () => {
  it('says yes for a laptop with a touch screen, which also hovers', () => {
    expect(supportsTouch(media('(hover: hover)', '(any-pointer: coarse)'), 10)).toBe(true);
  });

  it('says yes for a phone, which does not hover', () => {
    expect(supportsTouch(media('(any-pointer: coarse)'), 5)).toBe(true);
  });

  it('says no for a desktop with a mouse and nothing else', () => {
    expect(supportsTouch(media('(hover: hover)', '(any-pointer: fine)'), 0)).toBe(false);
  });

  it('falls back to the touch point count where the query is not understood', () => {
    // an older browser answers false to every query it does not know
    expect(supportsTouch(media(), 2)).toBe(true);
    expect(supportsTouch(media(), 0)).toBe(false);
  });

  it('treats a missing count as none', () => {
    expect(supportsTouch(media(), undefined)).toBe(false);
  });
});

describe('the box select button', () => {
  const VIEWER = readFileSync(join(process.cwd(), 'src/components/SVGViewer.vue'), 'utf-8');

  it('is shown by what the device can do, not by what it cannot', () => {
    const button = VIEWER.slice(VIEWER.indexOf('mdi:mdi-select-drag') - 400, VIEWER.indexOf('mdi:mdi-select-drag'));

    expect(button).toContain('v-if="deviceCanTouch"');
    expect(button).not.toContain('v-if="!deviceHasHover"');
  });
});
