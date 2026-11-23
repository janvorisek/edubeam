<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useAppStore } from '@/store/app';
import { availableLocales, languageTag } from '@/plugins/i18n';
import { languageFlags } from '@/utils/languageFlags';
import { languageChoices, languageMatches, type AppLanguage } from '@/utils/languageChoices';

/**
 * The app's language, picked from a compact menu. Each language is listed under its own name, so
 * someone who landed in a language they cannot read still finds theirs; the search finds it by its
 * English name or code too.
 */
const appStore = useAppStore();

const current = computed(() => availableLocales.find((l) => l.code === appStore.locale) ?? availableLocales[0]);

const open = ref(false);
const query = ref('');
// A mouse or keyboard user can type at once; on touch, focusing would throw up the keyboard over the list
const typeAtOnce = window.matchMedia('(pointer: fine)').matches;
const choices = computed(() => languageChoices(appStore.locale));

const matching = (languages: readonly AppLanguage[]) =>
  languages.filter((l) => languageMatches(l, query.value, appStore.locale));
const suggested = computed(() => matching(choices.value.suggested));
const others = computed(() => matching(choices.value.others));

const choose = (code: string) => {
  appStore.locale = code;
  appStore.languageChosen = true;
  open.value = false;
};

/** Enter takes the first language the search left. */
const chooseFirst = () => {
  const first = suggested.value[0] ?? others.value[0];
  if (first) choose(first.code);
};

watch(open, (isOpen) => {
  if (!isOpen) query.value = '';
});
</script>

<template>
  <v-menu v-model="open" location="bottom end" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="language-menu"
        variant="text"
        size="small"
        append-icon="mdi-menu-down"
        :aria-label="`${$t('settings.language')}: ${current.name}`"
      >
        <img :src="languageFlags[current.code]" class="language-menu__flag language-menu__flag--current" alt="" />
        <span :lang="languageTag(current.code)">{{ current.name }}</span>
      </v-btn>
    </template>

    <v-card class="language-menu__card">
      <v-text-field
        v-model="query"
        :autofocus="typeAtOnce"
        density="compact"
        variant="solo-filled"
        flat
        hide-details
        single-line
        prepend-inner-icon="mdi-magnify"
        :placeholder="$t('settings.language')"
        :aria-label="$t('settings.language')"
        class="language-menu__search"
        @keydown.enter.prevent="chooseFirst"
      />
      <v-list density="compact" class="language-menu__list" :selected="[appStore.locale]" mandatory color="primary">
        <template v-for="(group, index) in [suggested, others]" :key="index">
          <v-divider v-if="index === 1 && suggested.length && others.length" class="my-1" />
          <v-list-item
            v-for="language in group"
            :key="language.code"
            :value="language.code"
            :lang="languageTag(language.code)"
            :active="language.code === appStore.locale"
            @click="choose(language.code)"
          >
            <template #prepend>
              <img :src="languageFlags[language.code]" class="language-menu__flag" alt="" />
            </template>
            <v-list-item-title>{{ language.name }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style scoped>
/* A setting, not an action: plain text, in the case it is written in. */
.language-menu {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.language-menu__card {
  display: flex;
  flex-direction: column;
  max-height: min(460px, 70dvh);
  min-width: 220px;
}

.language-menu__search {
  flex: none;
}

.language-menu__list {
  overflow-y: auto;
}

.language-menu__flag {
  width: 22px;
  height: 22px;
  margin-right: 12px;
}

.language-menu__flag--current {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>
