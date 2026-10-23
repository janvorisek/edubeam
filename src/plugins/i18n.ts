import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';
import * as vloc from 'vuetify/locale';

export const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'cs', name: 'Čeština' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'pl', name: 'Polski' },
  { code: 'cn', name: '汉语' },
  { code: 'th', name: 'ไทย' },
  { code: 'uk', name: 'Українська' },
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Türkçe' },
];

// Create Vue I18n instance.
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: messages,
});

/** The BCP 47 tag of an app locale. `cn` is not one, but `?lang=cn` links are out there, so it stays. */
export const languageTag = (locale: string) => (locale === 'cn' ? 'zh-Hans' : locale);

// Set new locale.
export async function setLocale(locale: string) {
  // Add Vuetify translations.
  const vuetifyMessages = locale === 'cn' ? vloc.zhHans : vloc[locale];
  i18n.global.setLocaleMessage(locale, { ...i18n.global.getLocaleMessage(locale), $vuetify: { ...vuetifyMessages } });

  // Set locale.
  i18n.global.locale.value = locale;

  // Browsers pick the font by the page language: without it, Chinese and Japanese text shared the
  // same Han glyphs, and screen readers read every language with an English voice.
  document.documentElement.lang = languageTag(locale);
}
