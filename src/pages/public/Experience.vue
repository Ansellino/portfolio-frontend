<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { experiencesApi } from '@/api/experience.api';
import { usePageSeo } from '@/composables/usePageSeo';

usePageSeo({
	title: 'Experience',
	description: 'Professional timeline including Tokocrypto, Google Cloud Facilitator, and UMNGrove roles.',
	path: '/experience',
});

const fallbackExperiences = [
	{
		id: 'gcf-2025',
		company: 'Google Cloud Facilitator',
		position: 'Program Facilitator',
		startDate: '2025-06-01',
		endDate: '2025-10-31',
		location: 'Indonesia',
		employmentType: 'Program',
		description: 'Facilitated cloud learning journey and project-based upskilling cohorts.',
		responsibilities: [
			'Mentored participants through hands-on cloud labs and weekly checkpoints.',
			'Guided capstone project planning and delivery for learning cohorts.',
		],
	},
	{
		id: 'tokocrypto-2025',
		company: 'Tokocrypto',
		position: 'Analyst',
		startDate: '2025-04-01',
		endDate: '2025-06-30',
		location: 'Jakarta',
		employmentType: 'Contract',
		description: 'Performed market and product analysis to support business decisions.',
		responsibilities: [
			'Prepared market trend reports and competitor analysis for product stakeholders.',
			'Supported decision-making with structured data insights and recommendations.',
		],
	},
	{
		id: 'umngrove-2024',
		company: 'UMNGrove',
		position: 'Developer',
		startDate: '2024-10-01',
		endDate: '2025-03-31',
		location: 'Tangerang',
		employmentType: 'Part-time',
		description: 'Built and maintained product features for startup incubation initiatives.',
		responsibilities: [
			'Developed and maintained product features in collaboration with cross-functional teams.',
			'Improved reliability through bug fixes, testing, and code quality reviews.',
		],
	},
];

function unwrapList(payload: any): any[] {
	const body = payload?.data ?? payload;
	if (Array.isArray(body)) return body;
	if (Array.isArray(body?.items)) return body.items;
	if (Array.isArray(body?.data)) return body.data;
	return [];
}

const query = useQuery({
	queryKey: ['public-experience'],
	queryFn: () => experiencesApi.getAll({ isPublished: true }).then((r) => r.data),
});

const timeline = computed(() => {
	const items = unwrapList(query.data.value);
	const data = items.length ? items : fallbackExperiences;
	return [...data].sort((a, b) => {
		const aDate = new Date(a.startDate).getTime();
		const bDate = new Date(b.startDate).getTime();
		return bDate - aDate;
	});
});

function fmt(value?: string) {
	if (!value) return 'Present';
	const d = new Date(value);
	return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function getResponsibilities(item: any): string[] {
	if (Array.isArray(item?.responsibilities)) {
		return item.responsibilities.filter((value: unknown) => typeof value === 'string' && value.trim().length > 0);
	}

	if (typeof item?.responsible === 'string' && item.responsible.trim().length > 0) {
		return item.responsible
			.split(/\r?\n|;/)
			.map((value: string) => value.trim())
			.filter((value: string) => value.length > 0);
	}

	return [];
}
</script>

<template>
	<section class="mx-auto max-w-4xl space-y-6 px-4 py-10">
		<h1 class="text-3xl font-bold">Experience</h1>
		<div class="space-y-5 border-l pl-6">
			<article v-for="item in timeline" :key="item.id" class="relative rounded-xl border bg-card p-4">
				<span class="absolute -left-[31px] top-6 h-3 w-3 rounded-full bg-primary" />
				<p class="text-xs uppercase tracking-wide text-muted-foreground">{{ fmt(item.startDate) }} - {{ fmt(item.endDate) }}</p>
				<h2 class="mt-1 text-lg font-semibold">{{ item.position }} · {{ item.company }}</h2>
				<p class="mt-1 text-sm text-muted-foreground">{{ item.location }} · {{ item.employmentType }}</p>
				<p class="mt-3 text-sm">{{ item.description }}</p>
				<div v-if="getResponsibilities(item).length" class="mt-3">
					<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Responsibilities</p>
					<ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
						<li v-for="(responsibility, index) in getResponsibilities(item)" :key="`${item.id}-responsibility-${index}`">
							{{ responsibility }}
						</li>
					</ul>
				</div>
			</article>
		</div>
	</section>
</template>
