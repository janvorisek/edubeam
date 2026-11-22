<script setup lang="ts">
/**
 * Offers the browser's own language, once, when EduBeam has it and shows another: written in that
 * language, as someone who reads it would want. The page is marked translate="no" - a browser
 * translator rewrites the text Vue manages and breaks the page - so this is how a returning user
 * whose settings predate their language, or who landed on English, gets to it.
 *
 * Never English: someone whose browser prefers English and who sees EduBeam in another language
 * almost always chose it. Nor in an embedded viewer, nor once it is answered or a language has been
 * chosen, from the menu or by a ?lang= link: it asks only once.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';
import { suggestLanguage } from '@/utils';
import { languageTag } from '@/plugins/i18n';

const appStore = useAppStore();
const { t } = useI18n();

// The browser's preferences, read once: they do not change while the app is open
const suggested = suggestLanguage();

const shown = computed(
  () => !appStore.inViewerMode && !appStore.languageChosen && suggested !== 'en' && suggested !== appStore.locale
);

/** A string in the offered language, whatever the app shows now */
const inOffered = (key: string) => t(key, {}, { locale: suggested });

const answer = (switchTo: boolean) => {
  if (switchTo) appStore.locale = suggested;
  appStore.languageChosen = true;
};
</script>

<template>
  <!-- Above any dialog: a returning reader's first visit after a release opens What's new too, and
       the offer has to stay answerable over it, so the rest is read in their language -->
  <v-snackbar
    :model-value="shown"
    location="top"
    :timeout="-1"
    :z-index="3000"
    multi-line
    :lang="languageTag(suggested)"
  >
    {{ inOffered('languageOffer.message') }}
    <template #actions>
      <v-btn variant="text" @click="answer(false)">{{ inOffered('languageOffer.dismiss') }}</v-btn>
      <v-btn variant="flat" color="primary" @click="answer(true)">{{ inOffered('languageOffer.switch') }}</v-btn>
    </template>
  </v-snackbar>
</template>
