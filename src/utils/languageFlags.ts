/**
 * The flag shown next to each app language, keyed by its locale code: circle-flags' language flags
 * (MIT, HatScripts), the set the website uses, so a language looks the same in the app and the guide.
 * Chinese is `cn` in the app and its flag file says so; Portuguese is the Brazilian flag, as the app's
 * Portuguese is Brazilian.
 */
const files = import.meta.glob<string>('@/assets/flags/*.svg', { eager: true, import: 'default', query: '?url' });

export const languageFlags: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), url])
);
