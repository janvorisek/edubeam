<template>
  <v-dialog v-model="open" max-width="860">
    <v-card class="changelog-card">
      <header class="changelog-header">
        <div>
          <div class="text-h5 font-weight-medium mb-1">{{ $t('dialogs.changelog.title') }}</div>
          <p class="text-body-2 text-medium-emphasis mb-1">
            {{ $t('dialogs.changelog.description') }}
          </p>
          <!-- <div v-if="resolvedLocale" class="text-caption text-medium-emphasis">
            Showing {{ resolvedLocale.toUpperCase() }} changelog
          </div> -->
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" class="ml-2" @click="closeAndTrack" />
      </header>

      <v-divider class="my-4" />

      <div class="changelog-scroll">
        <div v-if="loading" class="changelog-state">
          <v-progress-circular indeterminate color="primary" size="28" class="mr-2" />
          <span>Loading changelog…</span>
        </div>

        <v-alert v-else-if="error" type="warning" variant="tonal" border="start" class="mb-4">
          {{ error }}
        </v-alert>

        <template v-else>
          <section v-for="release in releases" :key="release.version" class="changelog-entry">
            <div class="entry-top">
              <div>
                <div class="entry-title">{{ release.title }}</div>
                <div class="entry-subtitle">
                  <v-chip size="x-small" color="primary" label variant="tonal" class="mr-2">{{
                    release.version
                  }}</v-chip>
                  <span>{{ release.date }}</span>
                </div>
              </div>
              <v-chip v-if="release.tag" size="small" color="primary" variant="flat">{{ release.tag }}</v-chip>
            </div>

            <div class="entry-body">
              <ul class="changelog-items">
                <li v-for="(item, index) in release.highlights" :key="`${release.version}-${index}`">{{ item }}</li>
              </ul>

              <div v-if="release.media?.length" class="changelog-media-grid">
                <figure v-for="media in release.media" :key="media.src" class="changelog-media-item">
                  <video
                    v-if="isVideoMedia(media)"
                    :src="media.src"
                    :aria-label="media.alt || release.title"
                    class="changelog-media-video"
                    controls
                    loop
                    muted
                    playsinline
                  ></video>
                  <v-img v-else :src="media.src" :alt="media.alt || release.title" class="changelog-media-img"></v-img>
                  <figcaption v-if="media.caption" class="text-caption text-medium-emphasis text-center mt-1">
                    {{ media.caption }}
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <div v-if="!releases.length" class="changelog-state text-medium-emphasis">
            Nothing to show yet. Please add entries to <code>public/changelog/{{ resolvedLocale }}.json</code>.
          </div>

          <section v-if="upcoming.length" class="changelog-upcoming">
            <div class="text-overline text-medium-emphasis">Coming soon</div>
            <div v-for="feature in upcoming" :key="feature.title" class="upcoming-card">
              <div class="font-weight-medium">{{ feature.title }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ feature.detail }}</div>
            </div>
          </section>
        </template>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';

const open = ref(true);
type MediaEntry = {
  src: string;
  alt?: string;
  caption?: string;
  type?: 'image' | 'video';
};

type ReleaseEntry = {
  version: string;
  title: string;
  date: string;
  highlights: string[];
  tag?: string;
  media?: MediaEntry[];
};

type UpcomingEntry = {
  title: string;
  detail: string;
};

type ChangelogData = {
  releases?: ReleaseEntry[];
  upcoming?: UpcomingEntry[];
};

const releases = ref<ReleaseEntry[]>([]);
const upcoming = ref<UpcomingEntry[]>([]);
const loading = ref(false);
const error = ref('');
const resolvedLocale = ref('');

const { locale } = useI18n();
const appStore = useAppStore();
const currentAppVersion = APP_VERSION;

let latestRequest: symbol | null = null;
const baseLocale = 'en';

const isVideoMedia = (entry: MediaEntry) => {
  if (entry.type) return entry.type === 'video';
  return /\.mp4($|\?)/i.test(entry.src);
};

const cloneMedia = (entry: MediaEntry): MediaEntry => ({
  src: entry.src,
  alt: entry.alt,
  caption: entry.caption,
  type: entry.type,
});

const cloneRelease = (entry: ReleaseEntry): ReleaseEntry => ({
  version: entry.version,
  title: entry.title,
  date: entry.date,
  highlights: [...entry.highlights],
  tag: entry.tag,
  media: entry.media ? entry.media.map(cloneMedia) : undefined,
});

const cloneUpcoming = (entry: UpcomingEntry): UpcomingEntry => ({
  title: entry.title,
  detail: entry.detail,
});

const getLocaleFallbacks = (value: string) => {
  const trimmed = value.toLowerCase();
  const [base] = trimmed.split('-');
  const unique = new Set<string>([trimmed, base, baseLocale]);
  return Array.from(unique).filter(Boolean);
};

const fetchDataset = async (code: string): Promise<ChangelogData | null> => {
  try {
    const response = await fetch(`/changelog/${code}.json`, { cache: 'no-cache' });
    if (!response.ok) return null;
    return (await response.json()) as ChangelogData;
  } catch (err) {
    console.warn('Failed to load changelog for locale', code, err);
    return null;
  }
};

const mergeChangelog = (base: ChangelogData, localized: ChangelogData | null): ChangelogData => {
  if (!localized) {
    return {
      releases: (base.releases ?? []).map(cloneRelease),
      upcoming: (base.upcoming ?? []).map(cloneUpcoming),
    };
  }

  const localizedMap = new Map((localized.releases ?? []).map((entry) => [entry.version, entry as ReleaseEntry]));

  const mergedReleases = (base.releases ?? []).map((baseEntry) => {
    const override = localizedMap.get(baseEntry.version);
    if (!override) return cloneRelease(baseEntry);
    return {
      version: baseEntry.version,
      title: override.title ?? baseEntry.title,
      date: override.date ?? baseEntry.date,
      highlights:
        override.highlights && override.highlights.length ? [...override.highlights] : [...baseEntry.highlights],
      tag: override.tag ?? baseEntry.tag,
      media:
        override.media && override.media.length ? override.media.map(cloneMedia) : baseEntry.media?.map(cloneMedia),
    };
  });

  const mergedUpcoming =
    localized.upcoming && localized.upcoming.length
      ? localized.upcoming.map(cloneUpcoming)
      : (base.upcoming ?? []).map(cloneUpcoming);

  return {
    releases: mergedReleases,
    upcoming: mergedUpcoming,
  };
};

const loadChangelog = async () => {
  const token = Symbol('changelog');
  latestRequest = token;
  loading.value = true;
  error.value = '';
  resolvedLocale.value = '';

  const baseData = await fetchDataset(baseLocale);
  if (latestRequest !== token) return;

  if (!baseData) {
    releases.value = [];
    upcoming.value = [];
    error.value = 'Missing base changelog at public/changelog/en.json.';
    loading.value = false;
    return;
  }

  let mergedData: ChangelogData = mergeChangelog(baseData, null);
  let displayLocale = baseLocale;

  const candidates = getLocaleFallbacks(locale.value).filter((code) => code !== baseLocale);

  for (const candidate of candidates) {
    const localizedData = await fetchDataset(candidate);
    if (!localizedData) continue;
    mergedData = mergeChangelog(baseData, localizedData);
    displayLocale = candidate;
    break;
  }

  if (latestRequest !== token) return;

  releases.value = mergedData.releases ?? [];
  upcoming.value = mergedData.upcoming ?? [];
  resolvedLocale.value = displayLocale;
  loading.value = false;
};

watch(
  () => locale.value,
  () => {
    loadChangelog();
  },
  { immediate: true }
);

const markSeen = () => {
  if (!currentAppVersion) return;
  if (appStore.lastSeenChangelogVersion === currentAppVersion) return;
  appStore.lastSeenChangelogVersion = currentAppVersion;
};

const closeAndTrack = () => {
  markSeen();
  closeModal();
};

onBeforeUnmount(() => {
  markSeen();
});
</script>

<style scoped>
.changelog-card {
  padding: 24px;
}

.changelog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.changelog-scroll {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.changelog-state {
  display: flex;
  align-items: center;
  padding: 24px 0;
}

.changelog-entry + .changelog-entry {
  border-top: 1px solid rgba(var(--v-theme-outline), 0.2);
  margin-top: 16px;
  padding-top: 16px;
}

.entry-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.entry-title {
  font-size: 1.15rem;
  font-weight: 600;
}

.entry-subtitle {
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.65);
}

.entry-body {
  margin-top: 12px;
}

.changelog-media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.changelog-media-item {
  margin: 0;
}

.changelog-media-img {
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  max-height: 150px;
  width: auto;
  object-fit: contain;
}

.changelog-media-video {
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  max-height: 150px;
  width: 100%;
  background-color: #000;
}

.changelog-items {
  margin: 12px 0 0;
  padding-left: 20px;
}

.changelog-items li {
  margin-bottom: 6px;
}

.changelog-upcoming {
  border-top: 1px solid rgba(var(--v-theme-outline), 0.2);
  margin-top: 24px;
  padding-top: 16px;
}

.upcoming-card {
  border: 1px dashed rgba(var(--v-theme-primary), 0.4);
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 12px;
  background-color: rgba(var(--v-theme-primary), 0.03);
}
</style>
