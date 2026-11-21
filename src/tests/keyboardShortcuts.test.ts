import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { nextTick } from 'vue';
import { DofID } from '@edubeam/fem';
import { i18n } from '@/plugins/i18n';
import SVGViewer from '@/components/SVGViewer.vue';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { useAppStore } from '@/store/app';
import { MouseMode } from '@/mouse';
import {
  fieldOwnsUndo,
  forKeyboard,
  hasShortcutModifier,
  isTextEntry,
  submitsForm,
  zoomShortcut,
} from '@/utils/keyboard';

/**
 * Shortcuts checked `ctrlKey` only, so on a Mac, where Cmd does what Ctrl does elsewhere, none of
 * them worked. And the single-letter shortcuts ignored modifiers altogether: Ctrl+S saved the
 * project and toggled snap to grid with it.
 */
describe('hasShortcutModifier', () => {
  it('takes Ctrl, or Cmd on a Mac', () => {
    expect(hasShortcutModifier({ ctrlKey: true, metaKey: false })).toBe(true);
    expect(hasShortcutModifier({ ctrlKey: false, metaKey: true })).toBe(true);
    expect(hasShortcutModifier({ ctrlKey: false, metaKey: false })).toBe(false);
  });
});

/** Presses keys in order and lets them go in reverse, as fingers do. */
const press = async (...keys: string[]) => {
  const event = (type: string, key: string) =>
    new KeyboardEvent(type, {
      key,
      code: key.length === 1 ? `Key${key.toUpperCase()}` : key,
      ctrlKey: keys.includes('Control'),
      metaKey: keys.includes('Meta'),
      bubbles: true,
    });

  for (const key of keys) window.dispatchEvent(event('keydown', key));
  await nextTick();
  for (const key of [...keys].reverse()) window.dispatchEvent(event('keyup', key));
  await nextTick();
};

describe('shortcuts in the drawing', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    const domain = useProjectStore().solver.domain;
    domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Dz]);
    domain.createNode(2, [4, 0, 0], [DofID.Dz]);
    // The grid redraws on a snap toggle with SVG matrix maths happy-dom does not have.
    useViewerStore().showGrid = false;
    wrapper = mount(SVGViewer, { props: { id: 'viewer' }, global: { plugins: [createVuetify(), i18n] } });
  });

  afterEach(() => wrapper.unmount());

  it('takes up a tool with its key, and puts it down with the same key or V', async () => {
    const app = useAppStore();

    await press('n');
    expect(app.mouseMode).toBe(MouseMode.ADD_NODE);
    await press('n');
    expect(app.mouseMode).toBe(MouseMode.NONE);
    await press('d');
    expect(app.mouseMode).toBe(MouseMode.ADD_DIMLINE);
    await press('v');
    expect(app.mouseMode).toBe(MouseMode.NONE);
    await press('u');
    expect(app.mouseMode).toBe(MouseMode.ADD_SUPPORT);
    await press('l');
    expect(app.mouseMode).toBe(MouseMode.ADD_LOAD);
    await press('l');
    expect(app.mouseMode).toBe(MouseMode.NONE);
  });

  it('leaves the tools alone with Ctrl or Cmd', async () => {
    await press('Control', 'n');
    await press('Meta', 'd');

    expect(useAppStore().mouseMode).toBe(MouseMode.NONE);
  });

  it('asks for a material and a cross section before the element tool', async () => {
    const alert = vi.fn();
    vi.stubGlobal('alert', alert);

    await press('e');
    expect(alert).toHaveBeenCalledOnce();
    expect(useAppStore().mouseMode).toBe(MouseMode.NONE);

    const domain = useProjectStore().solver.domain;
    domain.createMaterial(1, { e: 210000e6, g: 8.75e10, alpha: 12e-6, d: 4000 });
    domain.createCrossSection(1, { a: 1, iy: 8.356e-5, iz: 1, dyz: 999991, h: 1, k: 1e32, j: 99999 });
    await press('e');
    expect(useAppStore().mouseMode).toBe(MouseMode.ADD_ELEMENT);
    vi.unstubAllGlobals();
  });

  it('shows the tool in use on the rail, and takes one up from there', async () => {
    const node = wrapper.find('#toolRail [data-tool="node"]');
    await node.trigger('click');

    expect(useAppStore().mouseMode).toBe(MouseMode.ADD_NODE);
    expect(node.attributes('aria-pressed')).toBe('true');
    expect(wrapper.find('#toolRail [data-tool="select"]').attributes('aria-pressed')).toBe('false');
  });

  it('keeps undo and redo where the tour points', () => {
    expect(wrapper.findAll('#undoRedo v-btn')).toHaveLength(2);
  });

  it('asks the load tool for the load in the mode banner', async () => {
    await wrapper.find('#toolRail [data-tool="load"]').trigger('click');

    expect(useAppStore().mouseMode).toBe(MouseMode.ADD_LOAD);
    expect(wrapper.findAll('#addModeBanner .tool-value')).toHaveLength(2);
  });

  it('opens the kinds of a support or a load from their buttons without taking the tool up', async () => {
    const load = wrapper.find('#toolRail [data-tool="load"]');
    await load.trigger('contextmenu');

    expect(load.attributes('aria-haspopup')).toBe('menu');
    expect(wrapper.find('#toolRail [data-tool="support"]').attributes('aria-haspopup')).toBe('menu');
    expect(wrapper.find('#toolRail [data-tool="node"]').attributes('aria-haspopup')).toBeUndefined();
    expect(useAppStore().mouseMode).toBe(MouseMode.NONE);
  });

  it('opens the kinds of a tool on a tap, and takes it up with the last kind on a click', async () => {
    const load = wrapper.find('#toolRail [data-tool="load"]');

    await load.trigger('pointerdown', { pointerType: 'touch', button: 0 });
    await load.trigger('click', { detail: 1 });
    expect(useAppStore().mouseMode).toBe(MouseMode.NONE);

    // Away from the triangle in the corner (the button has no size here)
    await load.trigger('pointerdown', { pointerType: 'mouse', button: 0 });
    await load.trigger('click', { detail: 1, clientX: -50, clientY: -50 });
    expect(useAppStore().mouseMode).toBe(MouseMode.ADD_LOAD);
  });

  it('toggles snap with S alone', async () => {
    const viewer = useViewerStore();
    const before = viewer.snapToGrid;

    await press('s');

    expect(viewer.snapToGrid).toBe(!before);
  });

  it('leaves snap alone on Ctrl+S and Cmd+S, which save the project', async () => {
    const viewer = useViewerStore();
    const before = viewer.snapToGrid;

    await press('Control', 's');
    expect(viewer.snapToGrid).toBe(before);

    await press('Meta', 's');
    expect(viewer.snapToGrid).toBe(before);
  });

  it('leaves the grid alone on Cmd+G', async () => {
    const viewer = useViewerStore();

    await press('Meta', 'g');

    expect(viewer.showGrid).toBe(false);
  });

  it('selects everything with Cmd+A as with Ctrl+A', async () => {
    const project = useProjectStore();

    await press('Meta', 'a');
    expect(project.selection2.nodes).toHaveLength(2);

    project.clearSelection2();
    await press('Control', 'a');
    expect(project.selection2.nodes).toHaveLength(2);
  });
});

describe('zoomShortcut', () => {
  const key = (key: string, code: string, modifier: 'ctrl' | 'meta' | null = 'ctrl') => ({
    key,
    code,
    ctrlKey: modifier === 'ctrl',
    metaKey: modifier === 'meta',
  });

  it('zooms with the keys of a US keyboard, as it always did', () => {
    expect(zoomShortcut(key('=', 'Equal'))).toBe('in');
    expect(zoomShortcut(key('+', 'Equal'))).toBe('in');
    expect(zoomShortcut(key('-', 'Minus'))).toBe('out');
    expect(zoomShortcut(key('=', 'Equal', 'meta'))).toBe('in');
  });

  it('zooms with + and - where a layout puts them on other keys', () => {
    // German: + has a key of its own, right of Ü, and - is where the US slash is
    expect(zoomShortcut(key('+', 'BracketRight'))).toBe('in');
    expect(zoomShortcut(key('-', 'Slash'))).toBe('out');
    expect(zoomShortcut(key('+', 'BracketRight', 'meta'))).toBe('in');
    // and the physical keys keep working there too
    expect(zoomShortcut(key('´', 'Equal'))).toBe('in');
    expect(zoomShortcut(key('ß', 'Minus'))).toBe('out');
  });

  it('goes by the character where a layout swaps the US keys', () => {
    // Turkish Q: the key in the US = position types -, the one in the US - position types *
    expect(zoomShortcut(key('-', 'Equal'))).toBe('out');
    expect(zoomShortcut(key('*', 'Minus'))).toBe('out');
  });

  it('zooms with the keypad', () => {
    expect(zoomShortcut(key('+', 'NumpadAdd'))).toBe('in');
    expect(zoomShortcut(key('-', 'NumpadSubtract'))).toBe('out');
  });

  it('needs Ctrl or Cmd', () => {
    expect(zoomShortcut(key('+', 'BracketRight', null))).toBeNull();
    expect(zoomShortcut(key('-', 'Minus', null))).toBeNull();
    expect(zoomShortcut(key('z', 'KeyZ'))).toBeNull();
  });
});

describe('forKeyboard', () => {
  it('names ⌘ on a Mac, in every way the texts write the modifier', () => {
    expect(forKeyboard('Hold Ctrl to add using mouse', true)).toBe('Hold ⌘ to add using mouse');
    expect(forKeyboard('Ctrl+Z and Ctrl+Shift+Z do the same.', true)).toBe('⌘Z and ⇧⌘Z do the same.');
    expect(forKeyboard('Strg+Z und Strg+Umschalt+Z', true)).toBe('⌘Z und ⇧⌘Z');
    expect(forKeyboard('Ctrl+Mayús+Z, Ctrl+Maj+Z', true)).toBe('⇧⌘Z, ⇧⌘Z');
    expect(forKeyboard('Ctrl + C', true)).toBe('⌘C');
    expect(forKeyboard('按住 Ctrl 并用鼠标添加', true)).toBe('按住 ⌘ 并用鼠标添加');
  });

  it('leaves the texts alone everywhere else', () => {
    expect(forKeyboard('Ctrl+Z and Ctrl+Shift+Z do the same.', false)).toBe('Ctrl+Z and Ctrl+Shift+Z do the same.');
    expect(forKeyboard('Control panel', true)).toBe('Control panel');
  });
});

describe('isTextEntry', () => {
  it('takes fields that type text, and nothing a click toggles', () => {
    const input = (type: string) => Object.assign(document.createElement('input'), { type });

    expect(isTextEntry(input('text'))).toBe(true);
    expect(isTextEntry(input('number'))).toBe(true);
    expect(isTextEntry(document.createElement('textarea'))).toBe(true);
    expect(isTextEntry(input('checkbox'))).toBe(false);
    expect(isTextEntry(document.createElement('button'))).toBe(false);
    expect(isTextEntry(document.body)).toBe(false);
    expect(isTextEntry(null)).toBe(false);
  });
});

describe('submitsForm', () => {
  const press = (target: HTMLElement, init: KeyboardEventInit = {}) => {
    let event!: KeyboardEvent;
    target.addEventListener('keydown', (e) => (event = e), { once: true });
    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, ...init }));
    return event;
  };

  it('submits on Enter in a text field, and with Ctrl or Cmd', () => {
    const field = document.body.appendChild(document.createElement('input'));
    expect(submitsForm(press(field))).toBe(true);
    expect(submitsForm(press(field, { ctrlKey: true }))).toBe(true);
    expect(submitsForm(press(field, { shiftKey: true }))).toBe(false);
    expect(submitsForm(press(field, { key: 'a' }))).toBe(false);
  });

  it('leaves Enter to a dropdown and to buttons', () => {
    const select = document.body.appendChild(document.createElement('div'));
    select.className = 'v-select';
    const inner = select.appendChild(document.createElement('input'));
    expect(submitsForm(press(inner))).toBe(false);
    expect(submitsForm(press(document.body.appendChild(document.createElement('button'))))).toBe(false);
  });
});

describe('fieldOwnsUndo', () => {
  /** A table field as Vue renders it: `_value` is what it last wrote in. */
  const tableField = (rendered: string, shown: string) => {
    const input = Object.assign(document.createElement('input'), { className: 'inline-edit', value: shown });
    return Object.assign(input, { _value: rendered });
  };

  it('leaves Ctrl+Z to the model in a table field showing its committed value', () => {
    // edit, Enter or Tab, Ctrl+Z: the edit is undone, as it always was
    expect(fieldOwnsUndo(tableField('6', '6'))).toBe(false);
  });

  it('gives it to the field while typing there is not committed yet', () => {
    expect(fieldOwnsUndo(tableField('6', '699'))).toBe(true);
  });

  it('gives it to dialog fields, and never to what does not type text', () => {
    expect(fieldOwnsUndo(Object.assign(document.createElement('input'), { value: '3' }))).toBe(true);
    expect(fieldOwnsUndo(Object.assign(document.createElement('input'), { type: 'checkbox' }))).toBe(false);
    expect(fieldOwnsUndo(document.body)).toBe(false);
  });
});
