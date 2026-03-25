<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { projectSchema } from '@/validations/project.schema';
import { projectsApi } from '@/api/projects.api';
import { skillsApi } from '@/api/skills.api';
import ImageUploader from '@/components/admin/ImageUploader.vue';
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const qc = useQueryClient();
const toast = useToast();

const id = computed(() => String(route.params.id));
const thumbnailFile = ref<File | null>(null);
const existingThumbnail = ref('');
const errors = ref<Record<string, string>>({});

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

const projectQuery = useQuery({
	queryKey: ['admin-project', id],
	queryFn: () => projectsApi.getById(id.value).then((r) => r.data),
});

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

watch(
	() => projectQuery.data.value,
	(payload) => {
		const data = payload?.data ?? payload;
		if (!data) return;
		form.title = data.title ?? '';
		form.description = data.description ?? '';
		form.content = data.content ?? '';
		form.thumbnailUrl = data.thumbnailUrl ?? '';
		form.liveUrl = data.liveUrl ?? '';
		form.githubUrl = data.githubUrl ?? '';
		form.startDate = data.startDate?.slice?.(0, 10) ?? '';
		form.endDate = data.endDate?.slice?.(0, 10) ?? '';
		form.isFeatured = !!data.isFeatured;
		form.isPublished = data.isPublished !== false;
		form.skillIds = Array.isArray(data.skills)
			? data.skills
					.map((s: any) => s.skillId ?? s.skill?.id ?? s.id)
					.filter((id: any) => typeof id === 'string' && id.length > 0)
			: data.skillIds ?? [];
		existingThumbnail.value = data.thumbnailUrl ?? '';
	},
	{ immediate: true }
);

const updateMutation = useMutation({
	mutationFn: (payload: any) => projectsApi.update(id.value, payload),
	onSuccess: async () => {
		await qc.invalidateQueries({ queryKey: ['admin-projects'] });
		await qc.invalidateQueries({ queryKey: ['admin-project', id] });
		toast.success('Project updated');
		router.push('/admin/projects');
	},
	onError: (error: any) => {
		const apiMessage = error?.response?.data?.message;
		const detail = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;
		toast.error(detail ? `Failed to update project: ${detail}` : 'Failed to update project');
	},
});

function submit() {
	const parsed = projectSchema.safeParse(form);
	if (!parsed.success) {
		errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
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
		content: cleanOptional(parsed.data.content),
		thumbnailUrl: cleanOptional(parsed.data.thumbnailUrl),
		liveUrl: cleanOptional(parsed.data.liveUrl),
		githubUrl: cleanOptional(parsed.data.githubUrl),
		endDate: cleanOptional(parsed.data.endDate),
	};
	updateMutation.mutate(payload);
}
</script>

<template>
	<form class="space-y-4" @submit.prevent="submit">
		<h1 class="text-2xl font-semibold">Edit Project</h1>
		<input v-model="form.title" class="w-full rounded-md border p-2" placeholder="Title" />
		<p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
		<textarea v-model="form.description" class="min-h-24 w-full rounded-md border p-2" placeholder="Description" />
		<MarkdownEditor v-model="form.content" title="Content" />
		<ImageUploader v-model="thumbnailFile" :preview-url="existingThumbnail" />
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
			<Button type="submit" :disabled="updateMutation.isPending.value">Save</Button>
			<Button type="button" variant="outline" @click="router.push('/admin/projects')">Cancel</Button>
		</div>
	</form>
</template>

