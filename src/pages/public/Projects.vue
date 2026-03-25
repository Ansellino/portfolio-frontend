<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { projectsApi } from '@/api/projects.api';
import { usePageSeo } from '@/composables/usePageSeo';
import ProjectCard from '@/components/portfolio/ProjectCard.vue';
import { unwrapList } from '@/utils/unwrapList';

usePageSeo({
	title: 'Projects',
	description: 'Browse software projects with technology stack filters and search.',
	path: '/projects',
});

const query = useQuery({
	queryKey: ['public-projects'],
	queryFn: () => projectsApi.getAll({ isPublished: true }).then((r) => r.data),
});

const search = ref('');
const activeSkill = ref('all');

const projects = computed(() => unwrapList(query.data.value));

function getSkillName(skill: any): string {
	return String(skill?.name ?? skill?.skill?.name ?? '').trim();
}

const availableSkills = computed(() => {
	const map = new Set<string>();
	for (const project of projects.value) {
		const skills = Array.isArray(project.skills) ? project.skills : [];
		for (const skill of skills) {
			const name = getSkillName(skill);
			if (name) map.add(name);
		}
	}
	return ['all', ...Array.from(map).sort((a, b) => a.localeCompare(b))];
});

const filtered = computed(() => {
	const searchValue = search.value.trim().toLowerCase();
	return projects.value.filter((project) => {
		const inSearch =
			!searchValue ||
			String(project.title || '').toLowerCase().includes(searchValue) ||
			String(project.description || '').toLowerCase().includes(searchValue);

		const hasSkill =
			activeSkill.value === 'all' ||
			(Array.isArray(project.skills) &&
				project.skills.some((skill: any) => getSkillName(skill) === activeSkill.value));

		return inSearch && hasSkill;
	});
});
</script>

<template>
	<section class="mx-auto max-w-6xl space-y-6 px-4 py-10">
		<div class="space-y-2">
			<h1 class="text-3xl font-bold">Projects</h1>
			<p class="text-muted-foreground">Search and filter by skill to explore the project catalog.</p>
		</div>

		<div class="grid gap-3 md:grid-cols-[2fr_1fr]">
			<input
				v-model="search"
				class="w-full rounded-md border bg-background px-3 py-2"
				placeholder="Search projects..."
			/>
			<select v-model="activeSkill" class="w-full rounded-md border bg-background px-3 py-2">
				<option v-for="skill in availableSkills" :key="skill" :value="skill">
					{{ skill === 'all' ? 'All skills' : skill }}
				</option>
			</select>
		</div>

			<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
				<ProjectCard v-for="project in filtered" :key="project.id" :project="project" />
			</div>
	</section>
</template>
