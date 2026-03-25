import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useHead } from '@unhead/vue';

type UsePageSeoOptions = {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  path: MaybeRefOrGetter<string>;
  image?: MaybeRefOrGetter<string | undefined>;
  type?: MaybeRefOrGetter<'website' | 'article'>;
};

const SITE_NAME = 'Jeremy Ansellino Gunawan';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

export function usePageSeo(options: UsePageSeoOptions) {
  const canonicalUrl = computed(() => `${SITE_URL}${toValue(options.path)}`);
  const fullTitle = computed(() => {
    const value = toValue(options.title);
    return value.includes(SITE_NAME) ? value : `${value} | ${SITE_NAME}`;
  });
  const description = computed(() => toValue(options.description));
  const image = computed(() => toValue(options.image) || DEFAULT_IMAGE);
  const type = computed(() => toValue(options.type) || 'website');

  useHead({
    title: () => fullTitle.value,
    link: [{ rel: 'canonical', href: () => canonicalUrl.value }],
    meta: [
      { name: 'description', content: () => description.value },
      { property: 'og:type', content: () => type.value },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: () => fullTitle.value },
      { property: 'og:description', content: () => description.value },
      { property: 'og:url', content: () => canonicalUrl.value },
      { property: 'og:image', content: () => image.value },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: () => fullTitle.value },
      { name: 'twitter:description', content: () => description.value },
      { name: 'twitter:image', content: () => image.value },
    ],
  });
}
