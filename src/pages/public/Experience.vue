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

function toTimestamp(value?: string) {
	if (!value) return 0;
	const ts = new Date(value).getTime();
	return Number.isFinite(ts) ? ts : 0;
}

const timeline = computed(() => {
	const items = unwrapList(query.data.value);
	const data = items.length ? items : fallbackExperiences;
	return [...data].sort((a, b) => {
		const aPrimary = toTimestamp(a?.endDate || a?.startDate);
		const bPrimary = toTimestamp(b?.endDate || b?.startDate);
		if (bPrimary !== aPrimary) return bPrimary - aPrimary;

		const aStart = toTimestamp(a?.startDate);
		const bStart = toTimestamp(b?.startDate);
		return bStart - aStart;
	});
});

function fmt(value?: string) {
	if (!value) return 'Present';
	const d = new Date(value);
	return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function formatEmploymentType(value?: string) {
	if (!value) return 'Role';
	return String(value)
		.replace(/[_-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());
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
	<section class="mx-auto max-w-5xl space-y-7 px-4 py-8 sm:space-y-8 sm:py-10">
		<header class="space-y-2">
			<h1 class="text-2xl font-bold sm:text-3xl">Work Experience</h1>
		</header>

		<div class="relative pl-8 sm:pl-10">
			<div class="absolute bottom-0 left-[11px] top-0 w-px bg-border sm:left-[15px]" />
			<div class="space-y-4 sm:space-y-5">
				<article
					v-for="(item, index) in timeline"
					:key="item.id"
					class="exp-card relative rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 sm:p-5"
					:style="{ animationDelay: `${Math.min(index, 10) * 70}ms` }"
				>
					<span class="absolute -left-[23px] top-7 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary sm:-left-[29px]" />

					<div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span class="rounded-full border bg-background px-2 py-1 font-medium uppercase tracking-wide">
							{{ formatEmploymentType(item.employmentType) }}
						</span>
						<span>{{ fmt(item.startDate) }} - {{ fmt(item.endDate) }}</span>
					</div>

					<div class="mt-2 flex flex-wrap items-start justify-between gap-2">
						<h2 class="text-lg font-semibold leading-snug">{{ item.position }} · {{ item.company }}</h2>
						<span class="text-sm text-muted-foreground">{{ item.location || 'Remote' }}</span>
					</div>

					<p v-if="item.description" class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ item.description }}</p>

					<div v-if="getResponsibilities(item).length" class="mt-4">
						<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key Contributions</p>
						<ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
							<li
								v-for="(responsibility, index) in getResponsibilities(item)"
								:key="`${item.id}-responsibility-${index}`"
								class="text-foreground/90"
							>
								{{ responsibility }}
							</li>
						</ul>
					</div>
				</article>
			</div>
		</div>
	</section>
</template>

<style scoped>
.exp-card {
	opacity: 0;
	transform: translateY(10px);
	animation: exp-card-enter 0.45s ease forwards;
}

@keyframes exp-card-enter {
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@media (prefers-reduced-motion: reduce) {
	.exp-card {
		opacity: 1;
		transform: none;
		animation: none;
	}
}
</style>
