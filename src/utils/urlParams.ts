/** Values that read as "off" in a query flag. Compared trimmed and lower-cased. */
const OFF_VALUES: ReadonlySet<string> = new Set(['', '0', 'false', 'no', 'off']);

/**
 * Whether `?viewer=` asks for viewer mode. The documented form is `viewer=1`, but any other value
 * has turned it on since the flag was added, so only the explicit "off" spellings turn it off: old
 * embeds keep working, and `viewer=0` no longer means the opposite of what it says.
 */
export const isViewerModeParam = (value: string | null): boolean =>
  value !== null && !OFF_VALUES.has(value.trim().toLowerCase());
