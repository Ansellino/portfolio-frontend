<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { projectSchema } from '@/validations/project.schema';
import { projectsApi } from '@/api/projects.api';
import { skillsApi } from '@/api/skills.api';
import ImageUploader from '@/components/admin/ImageUploader.vue';
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const qc = useQueryClient();
const toast = useToast();

const thumbnailFile = ref<File | null>(null);
const form = reactive({
	title: '',
	description: '',
	content: '',
	thumbnailUrl: '',
	liveUrl: '',
	githubUrl: '',
	startDate: '',
	endDate: '',
	isFeatured: false,
	isPublished: true,
	skillIds: [] as string[],
});

const errors = ref<Record<string, string>>({});

const skillsQuery = useQuery({
	queryKey: ['skills-select'],
	queryFn: () => skillsApi.getAllAdmin().then((r) => r.data),
});

const skills = computed(() => {
	const body = skillsQuery.data.value?.data ?? skillsQuery.data.value;
	if (Array.isArray(body)) return body;
	if (Array.isArray(body?.items)) return body.items;
	if (Array.isArray(body?.data)) return body.data;
	return [];
});

const createMutation = useMutation({
	mutationFn: (payload: any) => projectsApi.create(payload),
	onSuccess: async () => {
		await qc.invalidateQueries({ queryKey: ['admin-projects'] });
		toast.success('Project created');
		router.push('/admin/projects');
	},
	onError: (error: any) => {
		const apiMessage = error?.response?.data?.message;
		const detail = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;
		toast.error(detail ? `Failed to create project: ${detail}` : 'Failed to create project');
	},
});

function submit() {
	const toSlug = (value: string) =>
		value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-');

	const parsed = projectSchema.safeParse(form);
	if (!parsed.success) {
		errors.value = Object.fromEntries(
			parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message])
		);
		return;
	}

	errors.value = {};
	const cleanOptional = (value?: string) => {
		if (typeof value !== 'string') return undefined;
		const trimmed = value.trim();
		return trimmed.length ? trimmed : undefined;
	};

	const payload = {
		...parsed.data,
		slug: toSlug(parsed.data.title),
		content: cleanOptional(parsed.data.content),
		thumbnailUrl: cleanOptional(parsed.data.thumbnailUrl),
		liveUrl: cleanOptional(parsed.data.liveUrl),
		githubUrl: cleanOptional(parsed.data.githubUrl),
		endDate: cleanOptional(parsed.data.endDate),
	};
	createMutation.mutate(payload);
}
</script>

<template>
	<form class="space-y-4" @submit.prevent="submit">
		<h1 class="text-2xl font-semibold">Create Project</h1>
		<input v-model="form.title" class="w-full rounded-md border p-2" placeholder="Title" />
		<p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
		<textarea v-model="form.description" class="min-h-24 w-full rounded-md border p-2" placeholder="Description" />
		<MarkdownEditor v-model="form.content" title="Content" />
		<ImageUploader v-model="thumbnailFile" />
		<div class="grid gap-3 md:grid-cols-2">
			<input v-model="form.thumbnailUrl" class="w-full rounded-md border p-2" placeholder="Thumbnail URL" />
			<input v-model="form.liveUrl" class="w-full rounded-md border p-2" placeholder="Live URL" />
			<input v-model="form.githubUrl" class="w-full rounded-md border p-2" placeholder="GitHub URL" />
			<input v-model="form.startDate" type="date" class="w-full rounded-md border p-2" />
			<input v-model="form.endDate" type="date" class="w-full rounded-md border p-2" />
		</div>
		<label class="block text-sm font-medium">Skills</label>
		<div class="rounded-md border p-3">
			<p class="mb-2 text-xs text-muted-foreground">Pilih satu atau lebih skill untuk project ini.</p>
			<div class="grid max-h-56 gap-2 overflow-auto pr-1 sm:grid-cols-2">
				<label
					v-for="skill in skills"
					:key="skill.id"
					class="flex items-center gap-2 rounded border px-2 py-1.5 text-sm"
				>
					<input v-model="form.skillIds" type="checkbox" :value="skill.id" />
					<span>{{ skill.name }}</span>
				</label>
			</div>
		</div>
		<div class="flex gap-6">
			<label class="flex items-center gap-2"><input v-model="form.isFeatured" type="checkbox" /> Featured</label>
			<label class="flex items-center gap-2"><input v-model="form.isPublished" type="checkbox" /> Published</label>
		</div>
		<div class="flex gap-2">
			<Button type="submit" :disabled="createMutation.isPending.value">Create</Button>
			<Button type="button" variant="outline" @click="router.push('/admin/projects')">Cancel</Button>
		</div>
	</form>
</template>

