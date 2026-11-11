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
