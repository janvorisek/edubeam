<!-- A quiet pointer to Elementarium for readers who outgrow 2D. -->
<script setup lang="ts">
import { computed } from 'vue';
import { useDocsText } from './docsText';

const props = withDefaults(defineProps<{ placement?: string }>(), { placement: 'home' });

const { docs } = useDocsText();

const href = `https://elementarium.app/?utm_source=edubeam&utm_medium=banner&utm_campaign=leaderboard&utm_content=${props.placement}`;

// The banner used to be a picture with English text baked in. It is drawn here instead, so the text
// follows the page's language; only the 3D model and the logo are images.
const label = computed(() => `Elementarium: ${docs('promoTitle')} ${docs('promoAccent')} ${docs('promoSubtitle')}`);
</script>

<template>
  <aside class="elementarium-promo">
    <a class="ep" :href="href" target="_blank" rel="noopener" :aria-label="label">
      <img class="ep-logo" src="/elementarium/logo.png" width="31" height="37" alt="" />
      <span class="ep-copy">
        <span class="ep-title">
          {{ docs('promoTitle') }} <span class="ep-accent">{{ docs('promoAccent') }}</span>
        </span>
        <span class="ep-subtitle"><strong>Elementarium</strong> · {{ docs('promoSubtitle') }}</span>
      </span>
      <img class="ep-art" src="/elementarium/structure.png" width="175" height="86" alt="" loading="lazy" />
      <span class="ep-cta">{{ docs('promoCta') }} →</span>
    </a>
  </aside>
</template>

<style scoped>
.elementarium-promo {
  margin-top: 48px;
}

/* Colours taken from the original banner artwork, so it looks the same in light and dark themes. */
.ep {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 16px;
  max-width: 728px;
  padding: 10px 18px 12px;
  overflow: hidden;
  border-radius: 8px;
  color: #e8eaf2;
  text-decoration: none;
  background-color: #0a0c17;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 24px 24px;
}

.ep::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, #3d6bff, #d9dbe3 55%, #c8202a);
}

.ep-logo {
  width: 31px;
  height: auto;
}

.ep-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ep-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.ep-accent {
  color: #7f9cff;
  white-space: nowrap;
}

.ep-subtitle {
  font-size: 13px;
  line-height: 1.35;
  color: #a7abbd;
}

.ep-subtitle strong {
  color: #e8eaf2;
  font-weight: 600;
}

.ep-art {
  width: 175px;
  height: auto;
  /* The picture keeps a little of the old banner's background; fading its edges hides the seam. */
  mask-image:
    linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent),
    linear-gradient(transparent, #000 6%, #000 94%, transparent);
  mask-composite: intersect;
}

.ep-cta {
  padding: 9px 14px;
  border-radius: 8px;
  border: 1px solid #4a7bff;
  background: #1d5cff;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 0 18px rgba(29, 92, 255, 0.45);
  transition: background 0.2s;
}

.ep:hover .ep-cta {
  background: #3b72ff;
}

/* Phone: title and button on the left, the model on the right, no subtitle. */
@media (max-width: 640px) {
  .ep {
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      'logo copy art'
      'cta cta art';
    gap: 8px 12px;
  }

  .ep-logo {
    grid-area: logo;
    align-self: start;
    width: 22px;
  }

  .ep-copy {
    grid-area: copy;
  }

  .ep-title {
    font-size: 18px;
  }

  .ep-subtitle {
    display: none;
  }

  .ep-art {
    grid-area: art;
    width: 120px;
  }

  .ep-cta {
    grid-area: cta;
    justify-self: start;
    font-size: 14px;
  }
}
</style>
