<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { blogApi } from '@/api/blog.api';
import { usePageSeo } from '@/composables/usePageSeo';
import BackendWaitingNotice from '@/components/portfolio/BackendWaitingNotice.vue';
import SkillBadgeList from '@/components/portfolio/SkillBadgeList.vue';
import { Button } from '@/components/ui/button';
import { unwrapList } from '@/utils/unwrapList';

type Category = 'all' | 'Tutorial' | 'Guide' | 'Opinion' | 'Case Study';

usePageSeo({
	title: 'Blog',
	description: 'Articles, guides, opinions, and case studies on software engineering and product development.',
	path: '/blog',
});

const categories: Category[] = ['all', 'Tutorial', 'Guide', 'Opinion', 'Case Study'];
const activeCategory = ref<Category>('all');
const search = ref('');
const page = ref(1);
const perPage = 6;

const postsQuery = useQuery({
	queryKey: ['public-blog-list'],
	queryFn: () => blogApi.getAll({ isPublished: true }).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const isWaitingBackend = computed(
	() => !postsQuery.data.value && (postsQuery.isFetching.value || postsQuery.isError.value)
);

const posts = computed(() => unwrapList<any>(postsQuery.data.value));

const filteredPosts = computed(() => {
	const q = search.value.trim().toLowerCase();
	return posts.value.filter((post) => {
		const categoryOk = activeCategory.value === 'all' || post.category === activeCategory.value;
		const text = `${post.title || ''} ${post.excerpt || ''}`.toLowerCase();
		const searchOk = !q || text.includes(q);
		return categoryOk && searchOk;
	});
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / perPage)));

const paginatedPosts = computed(() => {
	const start = (page.value - 1) * perPage;
	return filteredPosts.value.slice(start, start + perPage);
});

const pages = computed(() => Array.from({ length: totalPages.value }, (_, idx) => idx + 1));

function setCategory(category: Category) {
	activeCategory.value = category;
	page.value = 1;
}

function formatDate(value?: string) {
	if (!value) return 'Draft date';
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<template>
	<section class="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:space-y-6 sm:py-10">
		<BackendWaitingNotice
			v-if="isWaitingBackend"
			description="Data artikel akan muncul otomatis saat koneksi berhasil."
		/>

		<div class="space-y-2">
			<h1 class="text-2xl font-bold sm:text-3xl">Blog</h1>
			<p class="text-muted-foreground">Tutorials, guides, opinions, and case studies.</p>
		</div>

		<div class="grid gap-3 md:grid-cols-[2fr_1fr]">
			<input
				v-model="search"
				class="w-full rounded-md border bg-background px-3 py-2.5"
				placeholder="Search articles..."
			/>
			<select
				:value="activeCategory"
				class="w-full rounded-md border bg-background px-3 py-2.5"
				@change="setCategory(($event.target as HTMLSelectElement).value as Category)"
			>
				<option v-for="category in categories" :key="category" :value="category">
					{{ category === 'all' ? 'All categories' : category }}
				</option>
			</select>
		</div>

		<div class="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
			<article v-for="post in paginatedPosts" :key="post.id" class="flex h-full flex-col rounded-xl border bg-card p-4 shadow-sm">
				<img
					:src="post.coverImageUrl || 'https://placehold.co/640x360?text=Blog'"
					:alt="post.title"
					loading="lazy"
					class="h-40 w-full rounded-md object-cover sm:h-44"
				/>
				<div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
					<span class="rounded-full border px-2.5 py-1.5 leading-none">{{ post.category || 'General' }}</span>
					<span>{{ post.readingTimeMin || 3 }} min read</span>
					<span>{{ formatDate(post.publishedAt) }}</span>
				</div>
				<h2 class="mt-3 line-clamp-2 min-h-[3.5rem] text-lg font-semibold">{{ post.title }}</h2>
				<p class="mt-1 line-clamp-3 min-h-[3.75rem] text-sm text-muted-foreground">{{ post.excerpt }}</p>
				<div class="mt-3 min-h-8">
					<SkillBadgeList :skills="post.tags" :max-visible="4" prefix="#" />
				</div>
				<RouterLink :to="`/blog/${post.slug}`" class="mt-4 inline-flex text-sm font-medium text-primary md:mt-auto">
					Read article
				</RouterLink>
			</article>
		</div>

		<div class="flex items-center justify-center gap-2">
			<Button variant="outline" size="sm" :disabled="page <= 1" @click="page -= 1">Previous</Button>
			<Button
				v-for="p in pages"
				:key="p"
				size="sm"
				:variant="p === page ? 'default' : 'outline'"
				class="hidden sm:inline-flex"
				@click="page = p"
			>
				{{ p }}
			</Button>
			<span class="text-xs text-muted-foreground sm:hidden">Page {{ page }} / {{ totalPages }}</span>
			<Button variant="outline" size="sm" :disabled="page >= totalPages" @click="page += 1">Next</Button>
		</div>
	</section>
</template>
