<script lang="ts" setup>
import { computed } from 'vue';
import { useAppStore } from '@/store/app';
import { availableLocales, languageTag } from '@/plugins/i18n';
import { languageFlags } from '@/utils/languageFlags';

/**
 * The app's language, picked from a compact menu. Each language is listed under its own name, so
 * someone who landed in a language they cannot read still finds theirs.
 */
const appStore = useAppStore();

const current = computed(() => availableLocales.find((l) => l.code === appStore.locale) ?? availableLocales[0]);
</script>

<template>
  <v-menu location="bottom end">
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

    <v-list density="compact" class="language-menu__list" :selected="[appStore.locale]" mandatory color="primary">
      <v-list-item
        v-for="language in availableLocales"
        :key="language.code"
        :value="language.code"
        :lang="languageTag(language.code)"
        :active="language.code === appStore.locale"
        @click="appStore.locale = language.code"
      >
        <template #prepend>
          <img :src="languageFlags[language.code]" class="language-menu__flag" alt="" />
        </template>
        <v-list-item-title>{{ language.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
/* A setting, not an action: plain text, in the case it is written in. */
.language-menu {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.language-menu__list {
  max-height: min(420px, 70dvh);
}

.language-menu__flag {
  width: 22px;
  height: 22px;
  margin-right: 12px;
}

/* The badges are language codes in flag colours, so the one in use names the language at a glance. */
.language-menu__flag--current {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
</style>
