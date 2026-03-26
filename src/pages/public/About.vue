<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useHead } from '@unhead/vue';
import { profileApi } from '@/api/profile.api';
import { educationApi } from '@/api/education.api';
import { skillsApi } from '@/api/skills.api';
import { usePageSeo } from '@/composables/usePageSeo';
import BackendWaitingNotice from '@/components/portfolio/BackendWaitingNotice.vue';
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
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const educationQuery = useQuery({
	queryKey: ['public-education'],
	queryFn: () => educationApi.getAll({ isPublished: true }).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const skillsQuery = useQuery({
	queryKey: ['public-skills'],
	queryFn: () => skillsApi.getAll({ isPublished: true }).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const isWaitingBackend = computed(() => {
	const hasData =
		!!profileQuery.data.value ||
		!!educationQuery.data.value ||
		!!skillsQuery.data.value;

	if (hasData) return false;

	return (
		profileQuery.isFetching.value ||
		educationQuery.isFetching.value ||
		skillsQuery.isFetching.value ||
		profileQuery.isError.value ||
		educationQuery.isError.value ||
		skillsQuery.isError.value
	);
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

function toTimestamp(value?: string) {
	if (!value) return 0;
	const ts = new Date(value).getTime();
	return Number.isFinite(ts) ? ts : 0;
}

const education = computed(() =>
	unwrapList(educationQuery.data.value).sort((a, b) => {
		const aPrimary = toTimestamp(a?.endDate || a?.startDate);
		const bPrimary = toTimestamp(b?.endDate || b?.startDate);
		if (bPrimary !== aPrimary) return bPrimary - aPrimary;

		const aStart = toTimestamp(a?.startDate);
		const bStart = toTimestamp(b?.startDate);
		return bStart - aStart;
	})
);
const skills = computed(() => unwrapList(skillsQuery.data.value));

function formatCategoryLabel(value: string) {
	return value
		.replace(/[_-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatEducationDate(value?: string) {
	if (!value) return '';
	const [dateOnly] = value.split('T');
	return dateOnly || value;
}

const skillBuckets = computed(() => {
	const buckets = new Map<string, string[]>();
	for (const skill of skills.value) {
		const category = skill.category || 'other';
		const existing = buckets.get(category) ?? [];
		existing.push(skill.name || 'Unknown');
		buckets.set(category, existing);
	}

	return Array.from(buckets.entries())
		.map(([category, names]) => ({
			category,
			names: names.sort((a, b) => a.localeCompare(b)),
			count: names.length,
		}))
		.sort((a, b) => b.count - a.count);
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
		<BackendWaitingNotice
			v-if="isWaitingBackend"
			description="Data profile, education, dan skills akan muncul otomatis saat koneksi berhasil."
		/>

		<article class="rounded-xl border bg-card p-6">
			<div class="max-w-3xl text-left">
				<h1 class="text-3xl font-bold">About</h1>
				<p class="mt-3 text-lg font-medium">{{ profile.fullName }}</p>
				<p class="text-muted-foreground">{{ profile.headline }}</p>
				<p class="mt-4 text-justify leading-relaxed">{{ profile.bio }}</p>
			</div>
			<Button as-child class="mt-5" variant="secondary"><a href="/resume.pdf" download>Download Resume</a></Button>
		</article>

		<article class="rounded-xl border bg-card p-6">
			<h2 class="text-xl font-semibold">Education</h2>
			<ul class="mt-4 space-y-3">
				<li v-for="item in education" :key="item.id" class="rounded-lg border p-4">
					<p class="font-semibold">{{ item.institution }}</p>
					<p class="text-sm text-muted-foreground">{{ item.degree }} {{ item.fieldOfStudy ? `· ${item.fieldOfStudy}` : '' }}</p>
					<p v-if="item.gpa !== undefined && item.gpa !== null" class="text-xs text-muted-foreground">GPA: {{ item.gpa }}</p>
					<p class="text-xs text-muted-foreground">{{ formatEducationDate(item.startDate) }} - {{ item.endDate ? formatEducationDate(item.endDate) : 'Present' }}</p>
				</li>
			</ul>
			<p v-if="!education.length" class="mt-4 text-sm text-muted-foreground">BINUS M.S. and RevoU learning tracks available in the full profile dataset.</p>
		</article>

		<article class="rounded-xl border bg-card p-6">
			<h2 class="text-xl font-semibold">Skills Visualization</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				Tap each category to see detailed skills.
			</p>
			<div class="mt-4 grid gap-3 sm:grid-cols-2">
				<details
					v-for="bucket in skillBuckets"
					:key="bucket.category"
					class="group rounded-lg border bg-background p-3"
				>
					<summary class="cursor-pointer list-none space-y-2">
						<div class="flex items-center justify-between text-sm">
							<span class="font-medium">{{ formatCategoryLabel(bucket.category) }}</span>
							<span class="text-muted-foreground">{{ bucket.count }}</span>
						</div>
						<div class="h-2 rounded-full bg-muted">
							<div class="h-2 rounded-full bg-primary" :style="{ width: `${Math.min(100, bucket.count * 12)}%` }" />
						</div>
						<p class="text-xs text-muted-foreground group-open:hidden">Show skills</p>
					</summary>
					<div class="mt-3 flex flex-wrap gap-2">
						<span
							v-for="name in bucket.names"
							:key="`${bucket.category}-${name}`"
							class="rounded-full border bg-card px-2 py-1 text-xs"
						>
							{{ name }}
						</span>
					</div>
				</details>
			</div>
		</article>
	</section>
</template>
