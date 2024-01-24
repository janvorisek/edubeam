<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;

import { VPImage } from "vitepress/theme";
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <a href="https://run.edubeam.app" target="_blank">
        <VPImage v-if="$frontmatter.hero.image" class="image-src bordered-image" :image="$frontmatter.hero.image" />
      </a>
    </template>
  </Layout>
</template>
