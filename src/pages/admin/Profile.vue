<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import api from '@/api/axios';
import { profileSchema } from '@/validations/profile.schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const toast = useToast();

type ProfilePayload = {
	fullName: string;
	headline?: string;
	bio?: string;
	location?: string;
	avatarUrl?: string;
	resumeUrl?: string;
	email?: string;
	phone?: string;
	website?: string;
	githubUrl?: string;
	linkedinUrl?: string;
};

const form = reactive<ProfilePayload>({
	fullName: '',
	headline: '',
	bio: '',
	location: '',
	avatarUrl: '',
	email: '',
	phone: '',
	website: '',
	githubUrl: '',
	linkedinUrl: '',
});

const errors = ref<Record<string, string>>({});

function assignForm(data: Partial<ProfilePayload>) {
	form.fullName = data.fullName || '';
	form.headline = data.headline || '';
	form.bio = data.bio || '';
	form.location = data.location || '';
	form.avatarUrl = data.avatarUrl || '';
	form.email = data.email || '';
	form.phone = data.phone || '';
	form.website = data.website || data.resumeUrl || '';
	form.githubUrl = data.githubUrl || '';
	form.linkedinUrl = data.linkedinUrl || '';
}

function cleanOptional(value?: string) {
	if (value == null) return undefined;
	const trimmed = value.trim();
	return trimmed.length ? trimmed : undefined;
}

function toApiPayload(payload: ProfilePayload) {
	return {
		fullName: payload.fullName.trim(),
		headline: cleanOptional(payload.headline),
		bio: cleanOptional(payload.bio),
		location: cleanOptional(payload.location),
		avatarUrl: cleanOptional(payload.avatarUrl),
		resumeUrl: cleanOptional(payload.website),
		email: cleanOptional(payload.email),
		phone: cleanOptional(payload.phone),
		githubUrl: cleanOptional(payload.githubUrl),
		linkedinUrl: cleanOptional(payload.linkedinUrl),
	};
}

const profileQuery = useQuery({
	queryKey: ['admin', 'profile'],
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

const isLoading = computed(() => profileQuery.isLoading.value);

watch(
	() => profileQuery.data.value,
	(data) => {
		if (data) {
			assignForm(data);
		}
	},
	{ immediate: true }
);

const saveMutation = useMutation({
	mutationFn: async (payload: ProfilePayload) => {
		const apiPayload = toApiPayload(payload);
		try {
			const { data } = await api.patch('/admin/profile', apiPayload);
			return data;
		} catch {
			const { data } = await api.patch('/profile', apiPayload);
			return data;
		}
	},
	onSuccess: () => {
		toast.success('Profile updated');
	},
	onError: () => {
		toast.error('Failed to update profile');
	},
});

function submit() {
	const parsed = profileSchema.safeParse(form);
	if (!parsed.success) {
		errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
		return;
	}

	errors.value = {};
	saveMutation.mutate(parsed.data);
}
</script>

<template>
	<section class="space-y-6">
		<div>
			<h1 class="text-2xl font-semibold">Profile</h1>
			<p class="text-sm text-muted-foreground">Manage public profile information displayed on portfolio pages.</p>
		</div>

		<form class="space-y-5 rounded-xl border bg-card p-6" @submit.prevent="submit">
			<div v-if="isLoading" class="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
				Loading profile data...
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<label class="text-sm font-medium">Full Name</label>
					<input v-model="form.fullName" class="w-full rounded-md border bg-background px-3 py-2" />
					<p v-if="errors.fullName" class="text-xs text-destructive">{{ errors.fullName }}</p>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium">Headline</label>
					<input v-model="form.headline" class="w-full rounded-md border bg-background px-3 py-2" />
				</div>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium">Bio</label>
				<textarea v-model="form.bio" class="min-h-28 w-full rounded-md border bg-background px-3 py-2" />
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<label class="text-sm font-medium">Location</label>
					<input v-model="form.location" class="w-full rounded-md border bg-background px-3 py-2" />
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium">Avatar URL</label>
					<input v-model="form.avatarUrl" class="w-full rounded-md border bg-background px-3 py-2" />
					<p v-if="errors.avatarUrl" class="text-xs text-destructive">{{ errors.avatarUrl }}</p>
				</div>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<label class="text-sm font-medium">Email</label>
					<input v-model="form.email" class="w-full rounded-md border bg-background px-3 py-2" />
					<p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium">Phone</label>
					<input v-model="form.phone" class="w-full rounded-md border bg-background px-3 py-2" />
				</div>
			</div>

			<div class="grid gap-4 md:grid-cols-3">
				<div class="space-y-2">
					<label class="text-sm font-medium">Website</label>
					<input v-model="form.website" class="w-full rounded-md border bg-background px-3 py-2" />
					<p v-if="errors.website" class="text-xs text-destructive">{{ errors.website }}</p>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium">GitHub URL</label>
					<input v-model="form.githubUrl" class="w-full rounded-md border bg-background px-3 py-2" />
					<p v-if="errors.githubUrl" class="text-xs text-destructive">{{ errors.githubUrl }}</p>
				</div>

				<div class="space-y-2">
					<label class="text-sm font-medium">LinkedIn URL</label>
					<input v-model="form.linkedinUrl" class="w-full rounded-md border bg-background px-3 py-2" />
					<p v-if="errors.linkedinUrl" class="text-xs text-destructive">{{ errors.linkedinUrl }}</p>
				</div>
			</div>

			<div class="flex justify-end">
				<Button type="submit" :disabled="saveMutation.isPending.value">
					{{ saveMutation.isPending.value ? 'Saving...' : 'Save Profile' }}
				</Button>
			</div>
		</form>
	</section>
</template>
