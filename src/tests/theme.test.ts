import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { DRAWING_PALETTES, drawingVars, resolveTheme, themedColors } from '@/utils/theme';
import { editorTones } from '@/utils/plotDrawing';
import { useAppStore } from '@/store/app';

const DEFAULTS = {
  normalForce: '#2222ff',
  shearForce: '#00af00',
  bendingMoment: '#ff2222',
  deformedShape: '#555555',
  loads: '#ff8700',
  nodes: '#000000',
  elements: '#000000',
  reactions: '#a020f0',
};

describe('the theme on show', () => {
  it('follows the system where the user left it to the system', () => {
    expect(resolveTheme('system', true, false)).toBe('dark');
    expect(resolveTheme('system', false, false)).toBe('light');
  });

  it('is the one chosen, whatever the system', () => {
    expect(resolveTheme('dark', false, false)).toBe('dark');
    expect(resolveTheme('light', true, false)).toBe('light');
  });

  // Embedded in lecture notes, a viewer link has to look as it always has
  it('is light in a ?viewer=1 link, whatever was chosen', () => {
    expect(resolveTheme('dark', true, true)).toBe('light');
    expect(resolveTheme('system', true, true)).toBe('light');
  });
});

describe("the drawing's colours on the dark canvas", () => {
  it('leave the light theme as it is', () => {
    expect(themedColors(DEFAULTS, 'light')).toBe(DEFAULTS);
  });

  it('lighten the defaults that would sink into the night canvas, as the website does', () => {
    const dark = themedColors(DEFAULTS, 'dark');
    expect(dark.normalForce).toBe('#7d7dff');
    expect(dark.elements).toBe(DRAWING_PALETTES.dark.ink);
    expect(dark.deformedShape).not.toBe('#555555');
    expect(dark.reactions).toBe('#bd6bff');
    // The colours that read on it are kept
    expect(dark.bendingMoment).toBe('#ff2222');
    expect(dark.loads).toBe('#ff8700');
  });

  it('keep a colour the user picked', () => {
    expect(themedColors({ ...DEFAULTS, normalForce: '#123456' }, 'dark').normalForce).toBe('#123456');
  });

  it('draw the new renderer in the figure ink on the canvas, and light where nothing asks', () => {
    expect(editorTones(DEFAULTS, 'dark')).toMatchObject({
      ink: DRAWING_PALETTES.dark.ink,
      paper: DRAWING_PALETTES.dark.paper,
    });
    // The Report's paper and an exported file
    expect(editorTones(DEFAULTS)).toMatchObject({ ink: '#000000', paper: '#ffffff' });
  });

  it('give the classic drawing its custom properties, light in the light theme', () => {
    expect(drawingVars('light')).toMatchObject({ '--eb-ink': '#000000', '--eb-paper': '#ffffff' });
    expect(drawingVars('dark')['--eb-paper']).toBe(DRAWING_PALETTES.dark.paper);
  });
});

describe('the theme someone starts with', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  const storedApp = () => {
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    createApp({}).use(pinia);
    setActivePinia(pinia);
    return useAppStore();
  };

  it('is the system for someone new', () => {
    expect(storedApp().theme).toBe('system');
  });

  // Their settings predate the theme: dark would come as a surprise
  it('stays light for someone who used EduBeam before', () => {
    localStorage.setItem('app', JSON.stringify({ locale: 'en' }));
    expect(storedApp().theme).toBe('light');
  });

  it('is what was chosen and saved', () => {
    localStorage.setItem('app', JSON.stringify({ theme: 'dark' }));
    expect(storedApp().theme).toBe('dark');
  });

  it('goes back to light from a stored value that is none of them', () => {
    localStorage.setItem('app', JSON.stringify({ theme: 'sepia' }));
    expect(storedApp().theme).toBe('light');
  });
});
