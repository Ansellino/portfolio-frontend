<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useHead } from '@unhead/vue';
import { projectsApi } from '@/api/projects.api';
import { blogApi } from '@/api/blog.api';
import { experiencesApi } from '@/api/experience.api';
import { profileApi } from '@/api/profile.api';
import { usePageSeo } from '@/composables/usePageSeo';
import BackendWaitingNotice from '@/components/portfolio/BackendWaitingNotice.vue';
import SectionHeader from '@/components/portfolio/SectionHeader.vue';
import ProjectCard from '@/components/portfolio/ProjectCard.vue';
import { Button } from '@/components/ui/button';
import { unwrapList } from '@/utils/unwrapList';

const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '');

usePageSeo({
	title: 'Portfolio',
	description: 'Software engineer portfolio featuring projects, experience, certifications, and blog posts.',
	path: '/',
});

useHead({
	script: [
		{
			key: 'person-schema-home',
			type: 'application/ld+json',
			textContent: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: 'Jeremy Ansellino Gunawan',
				jobTitle: 'Software Engineer',
				url: siteUrl,
				sameAs: [],
			}),
		},
	],
});

const featuredQuery = useQuery({
	queryKey: ['home-featured-projects'],
	queryFn: () => projectsApi.getAll({ isFeatured: true, isPublished: true, limit: 10 }).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const postsQuery = useQuery({
	queryKey: ['home-latest-posts'],
	queryFn: () => blogApi.getAll({ isPublished: true, limit: 3 }).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const postsCountQuery = useQuery({
	queryKey: ['home-published-posts-count'],
	queryFn: () => blogApi.getAll({ isPublished: true }).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const experiencesQuery = useQuery({
	queryKey: ['home-experience-years'],
	queryFn: () => experiencesApi.getAll({ isPublished: true }).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const profileQuery = useQuery({
	queryKey: ['home-public-profile'],
	queryFn: () => profileApi.getPublic().then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const isWaitingBackend = computed(() => {
	const hasData =
		!!featuredQuery.data.value ||
		!!postsQuery.data.value ||
		!!postsCountQuery.data.value ||
		!!experiencesQuery.data.value ||
		!!profileQuery.data.value;

	if (hasData) return false;

	return (
		featuredQuery.isFetching.value ||
		postsQuery.isFetching.value ||
		postsCountQuery.isFetching.value ||
		experiencesQuery.isFetching.value ||
		profileQuery.isFetching.value ||
		featuredQuery.isError.value ||
		postsQuery.isError.value ||
		postsCountQuery.isError.value ||
		experiencesQuery.isError.value ||
		profileQuery.isError.value
	);
});

const featuredProjects = computed(() => unwrapList(featuredQuery.data.value));
const latestPosts = computed(() => unwrapList(postsQuery.data.value).slice(0, 3));
const publishedPostsCount = computed(() => unwrapList(postsCountQuery.data.value).length);
const experiencesCount = computed(() => unwrapList(experiencesQuery.data.value).length);
const metricCards = computed(() => [
	{
		label: 'Featured Projects',
		value: featuredProjects.value.length,
		to: '/projects',
	},
	{
		label: 'Published Articles',
		value: publishedPostsCount.value,
		to: '/blog',
	},
	{
		label: 'Experience Entries',
		value: experiencesCount.value,
		to: '/experience',
	},
]);
const profile = computed(() => {
	const data = profileQuery.data.value?.data ?? profileQuery.data.value;
	if (data) return data;
	return {
		fullName: 'Jeremy Ansellino Gunawan',
		headline: 'Software Engineer',
		bio: 'Focused on modern web products, resilient systems, and practical AI-enabled workflows.',
		avatarUrl: '',
	};
});

const profileInitials = computed(() => {
	const name = String(profile.value?.fullName || '').trim();
	if (!name) return 'JG';
	const parts = name.split(/\s+/).filter(Boolean);
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
});

const carouselRef = ref<HTMLElement | null>(null);

function scrollCarousel(direction: 1 | -1) {
	if (!carouselRef.value) return;
	carouselRef.value.scrollBy({ left: direction * 320, behavior: 'smooth' });
}
</script>

<template>
	<section class="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:py-10">
		<BackendWaitingNotice
			v-if="isWaitingBackend"
			description="Konten homepage akan muncul otomatis saat koneksi berhasil."
		/>

		<div class="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
			<div class="grid items-start gap-6 md:grid-cols-[120px_1fr]">
				<div class="mx-auto md:mx-0">
					<img
						v-if="profile.avatarUrl"
						:src="profile.avatarUrl"
						:alt="`${profile.fullName} avatar`"
						class="h-24 w-24 rounded-full border object-cover"
						loading="lazy"
					/>
					<div
						v-else
						class="flex h-24 w-24 items-center justify-center rounded-full border bg-muted text-xl font-semibold text-muted-foreground"
					>
						{{ profileInitials }}
					</div>
				</div>
				<div class="max-w-3xl text-left">
				<p class="text-xs uppercase tracking-[0.25em] text-muted-foreground">Portfolio</p>
				<h1 class="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{{ profile.fullName }}</h1>
				<p class="mt-3 text-lg text-muted-foreground">{{ profile.headline }}</p>
				<p class="mt-3 text-justify leading-relaxed text-muted-foreground">{{ profile.bio || 'Focused on modern web products, resilient systems, and practical AI-enabled workflows.' }}</p>
			</div>
			</div>
			<div class="mt-6 grid gap-3 sm:flex sm:flex-wrap">
				<Button as-child><RouterLink to="/projects">View Projects</RouterLink></Button>
				<Button as-child variant="outline"><RouterLink to="/contact">Contact Me</RouterLink></Button>
				<Button as-child variant="secondary"><a href="/resume.pdf" download>Download Resume</a></Button>
			</div>
		</div>

		<div class="grid gap-4 sm:grid-cols-3">
			<RouterLink
				v-for="metric in metricCards"
				:key="metric.label"
				:to="metric.to"
				class="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/30"
			>
				<p class="text-sm text-muted-foreground">{{ metric.label }}</p>
				<p class="mt-2 text-3xl font-semibold">{{ metric.value }}</p>
				<p class="mt-2 text-xs text-muted-foreground group-hover:text-primary">View details</p>
			</RouterLink>
		</div>

			<section class="space-y-4">
			<div class="flex flex-wrap items-center justify-between gap-2">
					<SectionHeader title="Featured Projects" />
				<div class="flex gap-2">
					<Button variant="outline" size="sm" @click="scrollCarousel(-1)">Prev</Button>
					<Button variant="outline" size="sm" @click="scrollCarousel(1)">Next</Button>
				</div>
			</div>
			<div ref="carouselRef" class="flex snap-x gap-4 overflow-x-auto pb-2">
					<div v-for="project in featuredProjects" :key="project.id" class="min-w-[260px] snap-start sm:min-w-[300px]">
						<ProjectCard :project="project" detail-label="View details" />
					</div>
			</div>
		</section>

		<section class="space-y-4">
				<SectionHeader title="Latest Blog Posts" />
			<div class="grid gap-4 md:grid-cols-3">
				<article v-for="post in latestPosts" :key="post.id" class="rounded-xl border bg-card p-5">
					<p class="text-xs uppercase tracking-wide text-muted-foreground">{{ post.category }}</p>
					<h3 class="mt-2 text-lg font-semibold">{{ post.title }}</h3>
					<p class="mt-2 line-clamp-3 text-sm text-muted-foreground">{{ post.excerpt }}</p>
					<RouterLink :to="`/blog/${post.slug}`" class="mt-3 inline-block text-sm font-medium text-primary">
						Read post
					</RouterLink>
				</article>
			</div>
		</section>
	</section>
</template>
