<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useHead } from '@unhead/vue';
import { projectsApi } from '@/api/projects.api';
import { blogApi } from '@/api/blog.api';
import { certificationsApi } from '@/api/certification.api';
import { experiencesApi } from '@/api/experience.api';
import { profileApi } from '@/api/profile.api';
import { usePageSeo } from '@/composables/usePageSeo';
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
});

const postsQuery = useQuery({
	queryKey: ['home-latest-posts'],
	queryFn: () => blogApi.getAll({ isPublished: true, limit: 3 }).then((r) => r.data),
});

const certificationsQuery = useQuery({
	queryKey: ['home-certifications-count'],
	queryFn: () => certificationsApi.getAll({ isPublished: true }).then((r) => r.data),
});

const experiencesQuery = useQuery({
	queryKey: ['home-experience-years'],
	queryFn: () => experiencesApi.getAll({ isPublished: true }).then((r) => r.data),
});

const profileQuery = useQuery({
	queryKey: ['home-public-profile'],
	queryFn: () => profileApi.getPublic().then((r) => r.data),
});

const featuredProjects = computed(() => unwrapList(featuredQuery.data.value));
const latestPosts = computed(() => unwrapList(postsQuery.data.value).slice(0, 3));
const certsCount = computed(() => unwrapList(certificationsQuery.data.value).length);
const profile = computed(() => {
	const data = profileQuery.data.value?.data ?? profileQuery.data.value;
	if (data) return data;
	return {
		fullName: 'Jeremy Ansellino Gunawan',
		headline: 'Software Engineer focused on modern web products, resilient systems, and practical AI-enabled workflows.',
	};
});

const experienceYears = computed(() => {
	const experiences = unwrapList(experiencesQuery.data.value);
	if (!experiences.length) return 2;
	const earliest = experiences
		.map((item) => new Date(item.startDate).getTime())
		.filter((ts) => Number.isFinite(ts))
		.sort((a, b) => a - b)[0];
	if (!earliest) return 2;
	const years = Math.max(1, Math.floor((Date.now() - earliest) / (1000 * 60 * 60 * 24 * 365)));
	return years;
});

const carouselRef = ref<HTMLElement | null>(null);

function scrollCarousel(direction: 1 | -1) {
	if (!carouselRef.value) return;
	carouselRef.value.scrollBy({ left: direction * 320, behavior: 'smooth' });
}
</script>

<template>
	<section class="mx-auto max-w-6xl space-y-10 px-4 py-10">
		<div class="rounded-2xl border bg-card p-8 shadow-sm">
			<p class="text-xs uppercase tracking-[0.25em] text-muted-foreground">Portfolio</p>
			<h1 class="mt-3 text-4xl font-bold leading-tight md:text-5xl">{{ profile.fullName }}</h1>
			<p class="mt-3 max-w-2xl text-lg text-muted-foreground">{{ profile.headline }}</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<Button as-child><RouterLink to="/projects">View Projects</RouterLink></Button>
				<Button as-child variant="outline"><RouterLink to="/contact">Contact Me</RouterLink></Button>
				<Button as-child variant="secondary"><a href="/resume.pdf" download>Download Resume</a></Button>
			</div>
		</div>

		<div class="grid gap-4 sm:grid-cols-3">
			<article class="rounded-xl border bg-card p-5">
				<p class="text-sm text-muted-foreground">Projects</p>
				<p class="mt-2 text-3xl font-semibold">{{ featuredProjects.length }}</p>
			</article>
			<article class="rounded-xl border bg-card p-5">
				<p class="text-sm text-muted-foreground">Certifications</p>
				<p class="mt-2 text-3xl font-semibold">{{ certsCount }}</p>
			</article>
			<article class="rounded-xl border bg-card p-5">
				<p class="text-sm text-muted-foreground">Experience (Years)</p>
				<p class="mt-2 text-3xl font-semibold">{{ experienceYears }}+</p>
			</article>
		</div>

			<section class="space-y-4">
			<div class="flex items-center justify-between">
					<SectionHeader title="Featured Projects" />
				<div class="flex gap-2">
					<Button variant="outline" size="sm" @click="scrollCarousel(-1)">Prev</Button>
					<Button variant="outline" size="sm" @click="scrollCarousel(1)">Next</Button>
				</div>
			</div>
			<div ref="carouselRef" class="flex snap-x gap-4 overflow-x-auto pb-2">
					<div v-for="project in featuredProjects" :key="project.id" class="min-w-[300px] snap-start">
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
