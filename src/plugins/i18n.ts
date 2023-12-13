import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

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
  // Load locale if not available yet.
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await loadLocale(locale);

    // fetch() error occurred.
    if (messages === undefined) {
      return;
    }

    // Add locale.
    i18n.global.setLocaleMessage(locale, messages);
  }

  // Set locale.
  i18n.global.locale.value = locale;
}

// Fetch locale.
function loadLocale(locale: string) {
  return fetch(`./locales/${locale}.json`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Language could not be loaded!");
    })
    .catch((error) => {
      console.error(error);
    });
}
