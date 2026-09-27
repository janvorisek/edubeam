<!-- A quiet pointer to Elementarium for readers who outgrow 2D. Hidden on the Czech site. -->
<script setup lang="ts">
import { useData } from 'vitepress';

const props = withDefaults(defineProps<{ placement?: string }>(), { placement: 'home' });

const { lang } = useData();

const href = `https://elementarium.app/?utm_source=edubeam&utm_medium=banner&utm_campaign=leaderboard&utm_content=${props.placement}`;
const alt = 'Elementarium: take your frames into 3D. Slabs, shells and steel checks in your browser.';
</script>

<template>
  <aside v-if="lang !== 'cs'" class="elementarium-promo">
    <a :href="href" target="_blank" rel="noopener">
      <picture>
        <source
          media="(max-width: 640px)"
          srcset="/elementarium/mobile.png 1x, /elementarium/mobile@2x.png 2x"
          width="320"
          height="100"
        />
        <img
          src="/elementarium/leaderboard.png"
          srcset="/elementarium/leaderboard.png 1x, /elementarium/leaderboard@2x.png 2x"
          width="728"
          height="90"
          :alt="alt"
          loading="lazy"
        />
      </picture>
    </a>
  </aside>
</template>

<style scoped>
.elementarium-promo {
  margin-top: 48px;
}

.elementarium-promo a {
  display: inline-block;
  line-height: 0;
}

.elementarium-promo img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
