<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { MdPreview } from 'md-editor-v3';
import { projectsApi } from '@/api/projects.api';
import { usePageSeo } from '@/composables/usePageSeo';
import BackendWaitingNotice from '@/components/portfolio/BackendWaitingNotice.vue';
import SkillBadgeList from '@/components/portfolio/SkillBadgeList.vue';
import 'md-editor-v3/lib/style.css';

const route = useRoute();
const slug = computed(() => String(route.params.slug || ''));

const projectQuery = useQuery({
	queryKey: ['public-project', slug],
	queryFn: () => projectsApi.getBySlug(slug.value).then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const project = computed(() => projectQuery.data.value?.data ?? projectQuery.data.value);
const isWaitingBackend = computed(
	() => !projectQuery.data.value && (projectQuery.isFetching.value || projectQuery.isError.value)
);

usePageSeo({
  title: () => project.value?.title || 'Project',
  description: () => project.value?.description || 'Project detail page',
  path: () => `/projects/${slug.value}`,
  image: () => project.value?.thumbnailUrl,
});
</script>

<template>
	<section class="mx-auto max-w-4xl space-y-5 px-4 py-8 sm:space-y-6 sm:py-10">
		<RouterLink to="/projects" class="text-sm font-medium text-primary">Back to projects</RouterLink>

		<BackendWaitingNotice
			v-if="isWaitingBackend"
			description="Detail project akan muncul otomatis saat koneksi berhasil."
		/>

		<article v-if="project" class="space-y-5">
			<img
				:src="project.thumbnailUrl || 'https://placehold.co/800x420?text=Project'"
				:alt="project.title"
				loading="lazy"
				class="h-52 w-full rounded-xl border object-cover sm:h-64"
			/>
			<h1 class="text-2xl font-bold sm:text-3xl">{{ project.title }}</h1>
			<p class="text-muted-foreground">{{ project.description }}</p>

			<SkillBadgeList :skills="project.skills" />

			<div class="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
				<a v-if="project.liveUrl" :href="project.liveUrl" target="_blank" class="rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-accent">
					Live Demo
				</a>
				<a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" class="rounded-md border px-3 py-2 text-center text-sm font-medium hover:bg-accent">
					GitHub Repo
				</a>
			</div>

			<div class="project-content rounded-xl border p-4">
				<MdPreview editor-id="project-preview" :model-value="project.content || ''" />
			</div>
		</article>

		<p v-else class="text-muted-foreground">Loading project details...</p>
	</section>
</template>

<style scoped>
.project-content :deep(pre),
.project-content :deep(table) {
	overflow-x: auto;
	max-width: 100%;
	display: block;
}
</style>
