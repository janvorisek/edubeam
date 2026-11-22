import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import { i18n } from '@/plugins/i18n';
import { useAppStore } from '@/store/app';
import LanguageOffer from '@/components/LanguageOffer.vue';

/**
 * The page is marked translate="no", so a reader whose browser speaks a language EduBeam has, while
 * EduBeam shows another, is offered it - in their language - instead of reaching for a translator.
 */
const browserLanguages = (languages: string[]) =>
  Object.defineProperty(navigator, 'languages', { value: languages, configurable: true });

const offer = () => {
  document.body.innerHTML = '';
  const host = document.createElement('div');
  document.body.appendChild(host);
  return mount(LanguageOffer, {
    attachTo: host,
    global: { plugins: [createVuetify({ components }), i18n] },
  });
};

const shownText = () => document.body.textContent ?? '';

describe("the offer of the browser's own language", () => {
  beforeEach(() => setActivePinia(createPinia()));
  afterEach(() => browserLanguages(['en-US']));

  it('offers Vietnamese, in Vietnamese, to a Vietnamese browser on English', async () => {
    browserLanguages(['vi-VN', 'en']);
    const app = useAppStore();
    app.locale = 'en';
    offer();
    await new Promise((r) => setTimeout(r, 0));
    expect(shownText()).toContain('Chuyển sang tiếng Việt');
  });

  it('switches when taken up, and is not offered again', async () => {
    browserLanguages(['vi-VN']);
    const app = useAppStore();
    app.locale = 'en';
    offer();
    await new Promise((r) => setTimeout(r, 0));
    const button = Array.from(document.body.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Chuyển sang tiếng Việt')
    );
    button?.click();
    expect(app.locale).toBe('vi');
    expect(app.languageChosen).toBe(true);
  });

  // Someone whose browser prefers English and who sees another language almost always chose it
  it('never offers English', async () => {
    browserLanguages(['en-GB', 'en-US', 'en', 'cs']);
    const app = useAppStore();
    app.locale = 'hi';
    offer();
    await new Promise((r) => setTimeout(r, 0));
    expect(shownText()).not.toContain('Switch to English');
  });

  it('is not offered once a language was chosen, nor in a viewer', async () => {
    const app = useAppStore();
    app.locale = 'en';
    browserLanguages(['vi-VN']);

    app.languageChosen = true;
    offer();
    await new Promise((r) => setTimeout(r, 0));
    expect(shownText()).not.toContain('tiếng Việt');

    app.languageChosen = false;
    app.inViewerMode = true;
    offer();
    await new Promise((r) => setTimeout(r, 0));
    expect(shownText()).not.toContain('tiếng Việt');
  });
});
