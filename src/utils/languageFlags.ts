import English from 'language-icons/icons/en.svg';
import Czech from 'language-icons/icons/cs.svg';
import German from 'language-icons/icons/de.svg';
import Spanish from 'language-icons/icons/es.svg';
import French from 'language-icons/icons/fr.svg';
import Portuguese from 'language-icons/icons/pt.svg';
import Chinese from 'language-icons/icons/zh.svg';
import Polish from 'language-icons/icons/pl.svg';
import Ukrainian from 'language-icons/icons/uk.svg';
import Russian from 'language-icons/icons/ru.svg';
import Turkish from 'language-icons/icons/tr.svg';
import Hindi from 'language-icons/icons/hi.svg';
import Vietnamese from 'language-icons/icons/vi.svg';
import Italian from 'language-icons/icons/it.svg';
import Indonesian from 'language-icons/icons/id.svg';
import Japanese from 'language-icons/icons/ja.svg';
import Korean from 'language-icons/icons/ko.svg';
import ThaiFlag from '@/assets/th-flag.svg';

/** The icon shown next to each app language, keyed by its locale code. */
export const languageFlags: Readonly<Record<string, string>> = {
  en: English,
  cs: Czech,
  de: German,
  es: Spanish,
  fr: French,
  pt: Portuguese,
  cn: Chinese,
  th: ThaiFlag,
  pl: Polish,
  uk: Ukrainian,
  ru: Russian,
  tr: Turkish,
  hi: Hindi,
  vi: Vietnamese,
  it: Italian,
  id: Indonesian,
  ja: Japanese,
  ko: Korean,
};
