import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { nextTick } from 'vue';
import { DofID } from 'ts-fem';
import { i18n } from '@/plugins/i18n';
import SVGViewer from '@/components/SVGViewer.vue';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { fieldOwnsUndo, forKeyboard, hasShortcutModifier, isTextEntry, submitsForm } from '@/utils/keyboard';

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
