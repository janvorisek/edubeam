<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import { onMounted, watch } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;

import { VPImage } from 'vitepress/theme';

const { frontmatter } = useData();

// AdSense Auto Ads scans the page only once, when its script loads, and never again after
// client-side navigation. Home pages are excluded in AdSense, so loading the script there
// would lock the whole session to "no ads". Load it on the first non-home page instead.
let adsLoaded = false;
function loadAds() {
  if (adsLoaded || frontmatter.value.layout === 'home') return;
  adsLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3761845630657739';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

onMounted(() => {
  loadAds();
  watch(frontmatter, loadAds);
});
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <a href="https://run.edubeam.app" target="_blank">
        <WelcomeStructure class="image-src bordered-image figure" />
        <!-- <VPImage v-if="$frontmatter.hero.image" class="image-src bordered-image" :image="$frontmatter.hero.image" /> -->
      </a>
    </template>
  </Layout>
</template>
