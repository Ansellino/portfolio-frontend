<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { certificationsApi } from '@/api/certification.api';
import { usePageSeo } from '@/composables/usePageSeo';
import { Button } from '@/components/ui/button';

usePageSeo({
	title: 'Certifications',
	description: 'Professional and technical certifications grouped by category.',
	path: '/certifications',
});

const fallbackCertifications = [
	{ id: 'c1', name: 'Google Cloud Fundamentals', issuer: 'Google Cloud', category: 'Cloud' },
	{ id: 'c2', name: 'Associate Cloud Engineer Prep', issuer: 'Google Cloud', category: 'Cloud' },
	{ id: 'c3', name: 'Backend API Fundamentals', issuer: 'Dicoding', category: 'Backend' },
	{ id: 'c4', name: 'Frontend Web Expert', issuer: 'Dicoding', category: 'Frontend' },
	{ id: 'c5', name: 'Data Analytics Bootcamp', issuer: 'RevoU', category: 'Data' },
	{ id: 'c6', name: 'Product Management Essentials', issuer: 'RevoU', category: 'Product' },
	{ id: 'c7', name: 'Cyber Security Foundations', issuer: 'Google', category: 'Security' },
	{ id: 'c8', name: 'DevOps CI/CD Practitioner', issuer: 'Coursera', category: 'DevOps' },
	{ id: 'c9', name: 'Machine Learning Foundations', issuer: 'Coursera', category: 'AI' },
];

function unwrapList(payload: any): any[] {
	const body = payload?.data ?? payload;
	if (Array.isArray(body)) return body;
	if (Array.isArray(body?.items)) return body.items;
	if (Array.isArray(body?.data)) return body.data;
	return [];
}

const query = useQuery({
	queryKey: ['public-certifications'],
	queryFn: () => certificationsApi.getAll({ isPublished: true }).then((r) => r.data),
});

const grouped = computed(() => {
	const entries = unwrapList(query.data.value);
	const list = entries.length ? entries : fallbackCertifications;
	const groups = new Map<string, any[]>();
	for (const cert of list) {
		const key = cert.category || 'Other';
		const prev = groups.get(key) ?? [];
		prev.push(cert);
		groups.set(key, prev);
	}
	return Array.from(groups.entries());
});
</script>

<template>
	<section class="mx-auto max-w-6xl space-y-8 px-4 py-10">
		<h1 class="text-3xl font-bold">Certifications</h1>

		<section v-for="[category, certs] in grouped" :key="category" class="space-y-3">
			<h2 class="text-xl font-semibold">{{ category }}</h2>
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				<article v-for="cert in certs" :key="cert.id" class="rounded-xl border bg-card p-4">
					<span class="inline-flex rounded-full border px-2 py-1 text-xs font-medium">{{ category }}</span>
					<h3 class="mt-3 text-base font-semibold">{{ cert.name }}</h3>
					<p class="mt-1 text-sm text-muted-foreground">{{ cert.issuer }}</p>
					<div class="mt-4" v-if="cert.credentialUrl">
						<Button as-child size="sm" variant="outline">
							<a :href="cert.credentialUrl" target="_blank" rel="noopener noreferrer">Lihat Sertifikat</a>
						</Button>
					</div>
					<p v-else class="mt-4 text-xs text-muted-foreground">Credential URL belum tersedia.</p>
				</article>
			</div>
		</section>
	</section>
</template>
