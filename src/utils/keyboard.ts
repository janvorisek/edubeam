/**
 * The modifier of the app's shortcuts: Ctrl, or Cmd on a Mac. Checking `ctrlKey` alone left every
 * shortcut but print dead on macOS, where Ctrl+click is a right click and Cmd does the shortcuts.
 */
export const hasShortcutModifier = (e: Readonly<Pick<KeyboardEvent | MouseEvent, 'ctrlKey' | 'metaKey'>>): boolean =>
  e.ctrlKey || e.metaKey;

/** Macs, iPads and iPhones, whose keyboards do the shortcuts with ⌘. */
export const isApplePlatform = (): boolean =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

/**
 * Names the shortcut modifier the way the keyboard in front of the user labels it. The texts say Ctrl
 * (Strg in German), and on a Mac that sent people to Ctrl+click, which macOS turns into a right click.
 */
export const forKeyboard = (text: string, apple: boolean): string =>
  apple
    ? text
        .replace(/(?:Ctrl|Strg)\+(?:Shift|Umschalt|Mayús|Maj)\+/g, '⇧⌘')
        .replace(/(?:Ctrl|Strg) ?\+ ?/g, '⌘')
        .replace(/\b(?:Ctrl|Strg)\b/g, '⌘')
    : text;

const NON_TEXT_INPUTS = new Set(['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file', 'image']);

/**
 * Whether keys pressed in `target` type text. There, Ctrl+Z belongs to the field and takes back what
 * was typed; elsewhere - a checkbox just ticked included - it undoes the last change to the model.
 */
export const isTextEntry = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(target.type);
};

/**
 * Whether Ctrl/Cmd+Z in `target` belongs to the field rather than to the model's undo.
 *
 * The tables' fields commit when left or on Enter, and Ctrl+Z there has always undone the model -
 * edit a coordinate, press Enter or Tab, then Ctrl+Z takes the edit back. Only while text is typed
 * and not yet committed does it take back the typing instead. Every other text field - a dialog's -
 * keeps its own text undo: the model behind an open dialog is not what it is about.
 */
export const fieldOwnsUndo = (target: EventTarget | null): boolean => {
  if (!isTextEntry(target)) return false;
  if (!(target instanceof HTMLInputElement) || !target.classList.contains('inline-edit')) return true;

  // What Vue last rendered into the field; anything else in it is typing not committed yet.
  const rendered = (target as HTMLInputElement & { _value?: unknown })._value;
  return rendered !== undefined && target.value !== String(rendered);
};

/**
 * Whether a keypress in a dialog submits it: Enter (or Ctrl/Cmd+Enter) in a field that types text, as
 * in any form. Not in a dropdown, where Enter picks the highlighted item, and not mid-composition in
 * an IME, where it confirms the characters.
 */
export const submitsForm = (e: KeyboardEvent): boolean =>
  e.key === 'Enter' &&
  !e.shiftKey &&
  !e.altKey &&
  !e.isComposing &&
  isTextEntry(e.target) &&
  !(e.target as HTMLElement).closest('.v-select, .v-autocomplete, .v-combobox');
