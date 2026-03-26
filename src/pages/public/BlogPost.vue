<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useHead } from '@unhead/vue';
import { MdCatalog, MdPreview } from 'md-editor-v3';
import { blogApi } from '@/api/blog.api';
import { usePageSeo } from '@/composables/usePageSeo';
import BackendWaitingNotice from '@/components/portfolio/BackendWaitingNotice.vue';
import SkillBadgeList from '@/components/portfolio/SkillBadgeList.vue';
import 'md-editor-v3/lib/style.css';

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));
const previewId = 'blog-preview';
const scrollElement = typeof document !== 'undefined' ? document.documentElement : undefined;

const postQuery = useQuery({
	queryKey: ['public-blog-post', slug],
	queryFn: () => blogApi.getBySlug(slug.value).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const post = computed(() => postQuery.data.value?.data ?? postQuery.data.value);
const isWaitingBackend = computed(
	() => !postQuery.data.value && (postQuery.isFetching.value || postQuery.isError.value)
);

usePageSeo({
	title: () => post.value?.title || 'Blog Post',
	description: () => post.value?.excerpt || 'Blog article',
	path: () => `/blog/${slug.value}`,
	image: () => post.value?.coverImageUrl,
	type: 'article',
});

const articleUrl = computed(() => `${window.location.origin}/blog/${slug.value}`);

const shareLinkedIn = computed(
	() => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl.value)}`
);
const shareTwitter = computed(
	() => `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl.value)}&text=${encodeURIComponent(post.value?.title || 'Interesting article')}`
);

function formatDate(value?: string) {
	if (!value) return 'Draft date';
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

useHead({
	script: [
		{
			key: 'blog-post-schema',
			type: 'application/ld+json',
			textContent: () =>
				JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: post.value?.title,
					description: post.value?.excerpt,
					image: post.value?.coverImageUrl,
					url: articleUrl.value,
					datePublished: post.value?.publishedAt,
					dateModified: post.value?.updatedAt || post.value?.publishedAt,
					author: {
						'@type': 'Person',
						name: 'Jeremy Ansellino Gunawan',
					},
				}),
		},
	],
});
</script>

<template>
	<section class="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[1fr_280px]">
		<article class="min-w-0 space-y-5">
			<RouterLink to="/blog" class="text-sm font-medium text-primary">Back to blog</RouterLink>

			<BackendWaitingNotice
				v-if="isWaitingBackend"
				description="Konten artikel akan muncul otomatis saat koneksi berhasil."
			/>

			<div v-if="post" class="space-y-4">
				<img
					:src="post.coverImageUrl || 'https://placehold.co/920x460?text=Article'"
					:alt="post.title"
					loading="lazy"
					class="h-52 w-full rounded-xl border object-cover sm:h-64"
				/>
				<h1 class="text-2xl font-bold leading-tight sm:text-3xl">{{ post.title }}</h1>
				<div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
					<span>{{ formatDate(post.publishedAt) }}</span>
					<span>{{ post.readingTimeMin || 3 }} min read</span>
					<span class="rounded-full border px-2 py-1 text-xs">{{ post.category || 'General' }}</span>
				</div>

				<SkillBadgeList :skills="post.tags" prefix="#" />

				<div class="grid gap-2 sm:flex sm:flex-wrap">
					<a :href="shareLinkedIn" target="_blank" class="rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-accent">
						Share on LinkedIn
					</a>
					<a :href="shareTwitter" target="_blank" class="rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-accent">
						Share on Twitter
					</a>
				</div>

				<div class="article-content min-w-0 rounded-xl border p-4">
					<MdPreview :editor-id="previewId" :model-value="post.content || ''" />
				</div>
			</div>

			<p v-else class="text-muted-foreground">Loading article...</p>
		</article>

		<aside class="hidden space-y-3 rounded-xl border bg-card p-4 lg:sticky lg:top-20 lg:block lg:h-fit">
			<p class="text-sm font-semibold">Table of contents</p>
			<MdCatalog :editor-id="previewId" :scroll-element="scrollElement" />
		</aside>
	</section>
</template>

<style scoped>
.article-content :deep(.md-editor-preview),
.article-content :deep(.md-editor-preview-wrapper) {
	min-width: 0;
	max-width: 100%;
}

.article-content :deep(img),
.article-content :deep(video),
.article-content :deep(iframe) {
	max-width: 100%;
	height: auto;
}

.article-content :deep(iframe) {
	width: 100%;
}

.article-content :deep(a),
.article-content :deep(p),
.article-content :deep(li),
.article-content :deep(blockquote) {
	overflow-wrap: anywhere;
	word-break: break-word;
}

.article-content :deep(:not(pre) > code) {
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	word-break: break-word;
}

.article-content :deep(pre),
.article-content :deep(table) {
	overflow-x: auto;
	max-width: 100%;
	display: block;
}

.article-content :deep(pre code) {
	white-space: pre;
}
</style>
