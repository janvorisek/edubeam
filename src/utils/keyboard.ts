/**
 * The modifier of the app's shortcuts: Ctrl, or Cmd on a Mac. Checking `ctrlKey` alone left every
 * shortcut but print dead on macOS, where Ctrl+click is a right click and Cmd does the shortcuts.
 */
export const hasShortcutModifier = (e: Readonly<Pick<KeyboardEvent | MouseEvent, 'ctrlKey' | 'metaKey'>>): boolean =>
  e.ctrlKey || e.metaKey;
