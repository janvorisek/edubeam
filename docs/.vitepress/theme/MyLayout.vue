<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import { computed, onMounted, watch } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;

const { frontmatter, localeIndex } = useData();

// The app shown in the reader's language; Hindi has no app translation, so it shows English.
const heroSrc = computed(() =>
  localeIndex.value === 'root' || localeIndex.value === 'hi'
    ? '/screenshots/hero.webp'
    : `/screenshots/${localeIndex.value}/hero.webp`
);

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
      <a class="hero-shot" href="https://run.edubeam.app" target="_blank">
        <span class="hero-shot-bar" aria-hidden="true"><i></i><i></i><i></i></span>
        <img
          :src="heroSrc"
          width="1280"
          height="760"
          alt="EduBeam with a three-hinged frame: loads, reactions, bending moment and deformed shape"
        />
      </a>
    </template>
  </Layout>
</template>
