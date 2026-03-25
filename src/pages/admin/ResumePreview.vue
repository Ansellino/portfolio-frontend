<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { Button } from '@/components/ui/button';
import api from '@/api/axios';
import { experiencesApi } from '@/api/experience.api';
import { educationApi } from '@/api/education.api';
import { skillsApi } from '@/api/skills.api';
import { certificationsApi } from '@/api/certification.api';
import { projectsApi } from '@/api/projects.api';
import { unwrapList } from '@/utils/unwrapList';

type ProfileData = {
	fullName?: string;
	headline?: string;
	bio?: string;
	location?: string;
	email?: string;
	phone?: string;
	website?: string;
	resumeUrl?: string;
	githubUrl?: string;
	linkedinUrl?: string;
};

const profileQuery = useQuery({
	queryKey: ['admin', 'resume-preview', 'profile'],
	retry: 0,
	queryFn: async () => {
		try {
			const { data } = await api.get('/admin/profile');
			return data?.data ?? data;
		} catch {
			const { data } = await api.get('/profile');
			return data?.data ?? data;
		}
	},
});

const experienceQuery = useQuery({
	queryKey: ['admin', 'resume-preview', 'experiences'],
	queryFn: () => experiencesApi.getAllAdmin({ isPublished: true, limit: 100 }).then((r) => r.data),
});

const educationQuery = useQuery({
	queryKey: ['admin', 'resume-preview', 'education'],
	queryFn: () => educationApi.getAllAdmin({ isPublished: true, limit: 100 }).then((r) => r.data),
});

const skillsQuery = useQuery({
	queryKey: ['admin', 'resume-preview', 'skills'],
	queryFn: () => skillsApi.getAllAdmin({ isPublished: true, limit: 200 }).then((r) => r.data),
});

const certificationsQuery = useQuery({
	queryKey: ['admin', 'resume-preview', 'certifications'],
	queryFn: () => certificationsApi.getAllAdmin({ isPublished: true, limit: 100 }).then((r) => r.data),
});

const featuredProjectsQuery = useQuery({
	queryKey: ['admin', 'resume-preview', 'featured-projects'],
	queryFn: () =>
		projectsApi
			.getAllAdmin({ isPublished: true, isFeatured: true, limit: 6 })
			.then((r) => r.data),
});

const profile = computed<ProfileData>(() => profileQuery.data.value ?? {});

function toTimestamp(value?: string) {
	if (!value) return 0;
	const ts = new Date(value).getTime();
	return Number.isFinite(ts) ? ts : 0;
}

function getLatestDateTimestamp(item: any) {
	return toTimestamp(item?.endDate || item?.startDate);
}

const experiences = computed(() =>
	unwrapList<any>(experienceQuery.data.value).sort((a, b) => {
		const aPrimary = getLatestDateTimestamp(a);
		const bPrimary = getLatestDateTimestamp(b);
		if (bPrimary !== aPrimary) return bPrimary - aPrimary;

		const aStart = toTimestamp(a?.startDate);
		const bStart = toTimestamp(b?.startDate);
		return bStart - aStart;
	})
);

const education = computed(() =>
	unwrapList<any>(educationQuery.data.value).sort((a, b) => {
		const aPrimary = getLatestDateTimestamp(a);
		const bPrimary = getLatestDateTimestamp(b);
		if (bPrimary !== aPrimary) return bPrimary - aPrimary;

		const aStart = toTimestamp(a?.startDate);
		const bStart = toTimestamp(b?.startDate);
		return bStart - aStart;
	})
);

const certifications = computed(() => unwrapList<any>(certificationsQuery.data.value).slice(0, 8));
const featuredProjects = computed(() => unwrapList<any>(featuredProjectsQuery.data.value).slice(0, 4));

const skillsByCategory = computed(() => {
	const map = new Map<string, string[]>();
	for (const item of unwrapList<any>(skillsQuery.data.value)) {
		const category = item.category || 'General';
		const existing = map.get(category) ?? [];
		existing.push(item.name);
		map.set(category, existing);
	}

	return Array.from(map.entries()).map(([category, items]) => ({
		category,
		items: items.slice(0, 12),
	}));
});

function fmt(value?: string) {
	if (!value) return 'Present';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function getResponsibilities(item: any): string[] {
	if (Array.isArray(item?.responsibilities)) {
		return item.responsibilities
			.map((value: unknown) => (typeof value === 'string' ? value.trim() : ''))
			.filter((value: string) => value.length > 0);
	}

	if (typeof item?.responsible === 'string' && item.responsible.trim().length > 0) {
		return item.responsible
			.split(/\r?\n|;/)
			.map((value: string) => value.trim())
			.filter((value: string) => value.length > 0);
	}

	return [];
}

function printResume() {
	window.print();
}
</script>

<template>
	<section class="space-y-5">
		<div class="flex flex-wrap items-center justify-between gap-3 print:hidden">
			<div>
				<h1 class="text-2xl font-semibold">Resume Preview</h1>
				<p class="text-sm text-muted-foreground">Preview compiled profile data before exporting your resume.</p>
			</div>

			<div class="flex items-center gap-2">
				<Button variant="outline" @click="printResume">Print / Save PDF</Button>
				<Button as-child variant="secondary">
					<a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Open Public Resume</a>
				</Button>
			</div>
		</div>

		<article class="mx-auto max-w-4xl rounded-xl border bg-card p-8 shadow-sm print:max-w-none print:border-0 print:bg-white print:p-0 print:shadow-none">
			<header class="border-b pb-5">
				<h2 class="text-3xl font-bold">{{ profile.fullName || 'Your Name' }}</h2>
				<p class="mt-1 text-base text-muted-foreground">{{ profile.headline || 'Professional Headline' }}</p>

				<div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
					<span v-if="profile.location">{{ profile.location }}</span>
					<span v-if="profile.email">{{ profile.email }}</span>
					<span v-if="profile.phone">{{ profile.phone }}</span>
					<a v-if="profile.website || profile.resumeUrl" :href="profile.website || profile.resumeUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Website</a>
					<a v-if="profile.githubUrl" :href="profile.githubUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">GitHub</a>
					<a v-if="profile.linkedinUrl" :href="profile.linkedinUrl" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">LinkedIn</a>
				</div>

				<p v-if="profile.bio" class="mt-4 text-justify text-sm leading-relaxed">{{ profile.bio }}</p>
			</header>

			<section class="mt-6 space-y-6">
				<div>
					<h3 class="text-lg font-semibold">Work Experience</h3>
					<div class="mt-3 space-y-4">
						<article v-for="item in experiences" :key="item.id" class="rounded-md border bg-background p-4 print:border-0 print:p-0">
							<div class="flex flex-wrap items-start justify-between gap-2">
								<div>
									<p class="font-medium">{{ item.position }} · {{ item.company }}</p>
									<p class="text-sm text-muted-foreground">{{ item.location }} {{ item.employmentType ? `· ${item.employmentType}` : '' }}</p>
								</div>
								<p class="text-sm text-muted-foreground">{{ fmt(item.startDate) }} - {{ fmt(item.endDate) }}</p>
							</div>
							<p v-if="item.description" class="mt-2 text-sm leading-relaxed">{{ item.description }}</p>
							<ul v-if="getResponsibilities(item).length" class="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
								<li v-for="(responsibility, index) in getResponsibilities(item)" :key="`${item.id}-responsibility-${index}`" class="text-justify">
									{{ responsibility }}
								</li>
							</ul>
						</article>
					</div>
				</div>

				<div>
					<h3 class="text-lg font-semibold">Education</h3>
					<div class="mt-3 space-y-3">
						<article v-for="item in education" :key="item.id" class="rounded-md border bg-background p-4 print:border-0 print:p-0">
							<div class="flex flex-wrap items-start justify-between gap-2">
								<div>
									<p class="font-medium">{{ item.degree }} {{ item.fieldOfStudy ? `· ${item.fieldOfStudy}` : '' }}</p>
									<p class="text-sm text-muted-foreground">{{ item.institution }}</p>
								</div>
								<p class="text-sm text-muted-foreground">{{ fmt(item.startDate) }} - {{ fmt(item.endDate) }}</p>
							</div>
							<p v-if="item.description" class="mt-2 text-sm leading-relaxed">{{ item.description }}</p>
						</article>
					</div>
				</div>

				<div>
					<h3 class="text-lg font-semibold">Skills</h3>
					<div class="mt-3 grid gap-3 md:grid-cols-2">
						<article v-for="bucket in skillsByCategory" :key="bucket.category" class="rounded-md border bg-background p-4 print:border-0 print:p-0">
							<p class="text-sm font-medium">{{ bucket.category }}</p>
							<p class="mt-2 text-sm text-muted-foreground">{{ bucket.items.join(', ') }}</p>
						</article>
					</div>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<h3 class="text-lg font-semibold">Certifications</h3>
						<ul class="mt-3 space-y-2 text-sm">
							<li v-for="item in certifications" :key="item.id" class="rounded-md border bg-background px-3 py-2 print:border-0 print:px-0 print:py-1">
								<span class="font-medium">{{ item.name }}</span>
								<span class="text-muted-foreground"> · {{ item.issuer }}</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 class="text-lg font-semibold">Featured Projects</h3>
						<ul class="mt-3 space-y-2 text-sm">
							<li v-for="item in featuredProjects" :key="item.id" class="rounded-md border bg-background px-3 py-2 print:border-0 print:px-0 print:py-1">
								<span class="font-medium">{{ item.title }}</span>
								<span v-if="item.description" class="text-muted-foreground"> - {{ item.description }}</span>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</article>
	</section>
</template>
