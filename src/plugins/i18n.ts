import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import * as vloc from "vuetify/locale";

export const availableLocales = [
  { code: "en", name: "English" },
  { code: "cs", name: "Čeština" },
];

// Create Vue I18n instance.
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: "en",
  fallbackLocale: "en",
  messages: messages,
});

// Set new locale.
export async function setLocale(locale: string) {
  // Add Vuetify translations.
  i18n.global.setLocaleMessage(locale, { ...i18n.global.getLocaleMessage(locale), $vuetify: { ...vloc[locale] } });

  console.log(i18n.global.messages);

  // Set locale.
  i18n.global.locale.value = locale;
}
