<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useHead } from '@unhead/vue';
import { profileApi } from '@/api/profile.api';
import { educationApi } from '@/api/education.api';
import { skillsApi } from '@/api/skills.api';
import { usePageSeo } from '@/composables/usePageSeo';
import { Button } from '@/components/ui/button';

const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '');

usePageSeo({
	title: 'About',
	description: 'Extended bio, education history, and technical skills overview.',
	path: '/about',
});

function unwrapList(payload: any): any[] {
	const body = payload?.data ?? payload;
	if (Array.isArray(body)) return body;
	if (Array.isArray(body?.items)) return body.items;
	if (Array.isArray(body?.data)) return body.data;
	return [];
}

const profileQuery = useQuery({
	queryKey: ['public-profile'],
	queryFn: () => profileApi.getPublic().then((r) => r.data),
});

const educationQuery = useQuery({
	queryKey: ['public-education'],
	queryFn: () => educationApi.getAll({ isPublished: true }).then((r) => r.data),
});

const skillsQuery = useQuery({
	queryKey: ['public-skills'],
	queryFn: () => skillsApi.getAll({ isPublished: true }).then((r) => r.data),
});

const profile = computed(() => {
	const data = profileQuery.data.value?.data ?? profileQuery.data.value;
	if (data) return data;
	return {
		fullName: 'Jeremy Ansellino Gunawan',
		headline: 'Software Engineer',
		bio: 'Builder of scalable web experiences with strong product sense and engineering fundamentals.',
		location: 'Indonesia',
	};
});

const education = computed(() => unwrapList(educationQuery.data.value));
const skills = computed(() => unwrapList(skillsQuery.data.value));

const skillBuckets = computed(() => {
	const buckets = new Map<string, number>();
	for (const skill of skills.value) {
		const category = skill.category || 'other';
		buckets.set(category, (buckets.get(category) ?? 0) + 1);
	}
	return Array.from(buckets.entries()).sort((a, b) => b[1] - a[1]);
});

useHead({
	script: [
		{
			key: 'person-schema-about',
			type: 'application/ld+json',
			textContent: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: 'Jeremy Ansellino Gunawan',
				jobTitle: profile.value?.headline || 'Software Engineer',
				description: profile.value?.bio,
				url: siteUrl,
			}),
		},
	],
});
</script>

<template>
	<section class="mx-auto max-w-5xl space-y-8 px-4 py-10">
		<article class="rounded-xl border bg-card p-6">
			<h1 class="text-3xl font-bold">About</h1>
			<p class="mt-3 text-lg font-medium">{{ profile.fullName }}</p>
			<p class="text-muted-foreground">{{ profile.headline }}</p>
			<p class="mt-4 leading-relaxed">{{ profile.bio }}</p>
			<Button as-child class="mt-5" variant="secondary"><a href="/resume.pdf" download>Download Resume</a></Button>
		</article>

		<article class="rounded-xl border bg-card p-6">
			<h2 class="text-xl font-semibold">Education</h2>
			<ul class="mt-4 space-y-3">
				<li v-for="item in education" :key="item.id" class="rounded-lg border p-4">
					<p class="font-semibold">{{ item.institution }}</p>
					<p class="text-sm text-muted-foreground">{{ item.degree }} {{ item.fieldOfStudy ? `· ${item.fieldOfStudy}` : '' }}</p>
					<p class="text-xs text-muted-foreground">{{ item.startDate }} - {{ item.endDate || 'Present' }}</p>
				</li>
			</ul>
			<p v-if="!education.length" class="mt-4 text-sm text-muted-foreground">BINUS M.S. and RevoU learning tracks available in the full profile dataset.</p>
		</article>

		<article class="rounded-xl border bg-card p-6">
			<h2 class="text-xl font-semibold">Skills Visualization</h2>
			<div class="mt-4 space-y-3">
				<div v-for="[category, count] in skillBuckets" :key="category" class="space-y-1">
					<div class="flex items-center justify-between text-sm">
						<span class="capitalize">{{ category }}</span>
						<span class="text-muted-foreground">{{ count }}</span>
					</div>
					<div class="h-2 rounded-full bg-muted">
						<div class="h-2 rounded-full bg-primary" :style="{ width: `${Math.min(100, count * 12)}%` }" />
					</div>
				</div>
			</div>
		</article>
	</section>
</template>
