<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { contactSchema } from '@/validations/contact.schema';
import { contactApi } from '@/api/contact.api';
import { profileApi } from '@/api/profile.api';
import { usePageSeo } from '@/composables/usePageSeo';
import BackendWaitingNotice from '@/components/portfolio/BackendWaitingNotice.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

usePageSeo({
	title: 'Contact',
	description: 'Send a message for collaboration or project opportunities.',
	path: '/contact',
});

const toast = useToast();

const form = reactive({
	name: '',
	email: '',
	subject: '',
	message: '',
});

type ContactForm = {
	name: string;
	email: string;
	subject?: string;
	message: string;
};

const errors = ref<Record<string, string>>({});
const cooldown = ref(false);
const cooldownSeconds = ref(0);
const showSuccess = ref(false);
const isSubmitting = ref(false);
let cooldownTimeout: number | null = null;
let cooldownInterval: number | null = null;

const backendReadyQuery = useQuery({
	queryKey: ['public-contact-backend-ready'],
	queryFn: () => profileApi.getPublic().then((r) => r.data),
	retry: true,
	retryDelay: 3000,
	refetchInterval: (state) => (state.state.data ? false : 5000),
});

const isWaitingBackend = computed(
	() => !backendReadyQuery.data.value && (backendReadyQuery.isFetching.value || backendReadyQuery.isError.value)
);

const canSubmit = computed(() => !cooldown.value && !isSubmitting.value && !isWaitingBackend.value);

async function handleSubmit(values: ContactForm) {
	isSubmitting.value = true;
	showSuccess.value = false;
	try {
		await contactApi.sendMessage(values);
		toast.success('Message sent successfully');

		cooldown.value = true;
		cooldownSeconds.value = 60;
		showSuccess.value = true;

		form.name = '';
		form.email = '';
		form.subject = '';
		form.message = '';

		if (cooldownTimeout) window.clearTimeout(cooldownTimeout);
		if (cooldownInterval) window.clearInterval(cooldownInterval);
		cooldownInterval = window.setInterval(() => {
			cooldownSeconds.value = Math.max(0, cooldownSeconds.value - 1);
			if (cooldownSeconds.value === 0 && cooldownInterval) {
				window.clearInterval(cooldownInterval);
				cooldownInterval = null;
			}
		}, 1000);

		cooldownTimeout = window.setTimeout(() => {
			cooldown.value = false;
			cooldownSeconds.value = 0;
			if (cooldownInterval) {
				window.clearInterval(cooldownInterval);
				cooldownInterval = null;
			}
		}, 60000);
	} catch {
		toast.error('Failed to send message');
	} finally {
		isSubmitting.value = false;
	}
}

function submit() {
	const parsed = contactSchema.safeParse(form);
	if (!parsed.success) {
		errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
		return;
	}

	errors.value = {};
	handleSubmit(parsed.data);
}

onBeforeUnmount(() => {
	if (cooldownTimeout) window.clearTimeout(cooldownTimeout);
	if (cooldownInterval) window.clearInterval(cooldownInterval);
});
</script>

<template>
	<section class="mx-auto max-w-2xl space-y-5 px-4 py-8 sm:space-y-6 sm:py-10">
		<h1 class="text-2xl font-bold sm:text-3xl">Contact</h1>
		<p class="text-muted-foreground">Have a project, collaboration idea, or opportunity? Send a message.</p>

		<BackendWaitingNotice
			v-if="isWaitingBackend"
			description="Form contact akan aktif otomatis saat koneksi backend berhasil."
		/>

		<form class="space-y-4 rounded-xl border bg-card p-6" @submit.prevent="submit">
			<p v-if="showSuccess" class="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
				Message sent successfully. Please wait {{ cooldownSeconds || 60 }} seconds before sending another message.
			</p>
			<div class="grid gap-3 md:grid-cols-2">
				<div>
					<input v-model="form.name" class="w-full rounded-md border bg-background px-3 py-2" placeholder="Name" />
					<p v-if="errors.name" class="mt-1 text-xs text-destructive">{{ errors.name }}</p>
				</div>
				<div>
					<input v-model="form.email" class="w-full rounded-md border bg-background px-3 py-2" placeholder="Email" />
					<p v-if="errors.email" class="mt-1 text-xs text-destructive">{{ errors.email }}</p>
				</div>
			</div>
			<div>
				<input v-model="form.subject" class="w-full rounded-md border bg-background px-3 py-2" placeholder="Subject" />
			</div>
			<div>
				<textarea v-model="form.message" class="min-h-36 w-full rounded-md border bg-background px-3 py-2" placeholder="Message" />
				<p v-if="errors.message" class="mt-1 text-xs text-destructive">{{ errors.message }}</p>
			</div>
			<div class="flex flex-wrap items-center gap-3">
				<Button type="submit" :disabled="!canSubmit">{{ cooldown ? `Wait ${cooldownSeconds}s` : (isSubmitting ? 'Sending...' : 'Send Message') }}</Button>
				<p v-if="cooldown" class="text-xs text-muted-foreground">Cooldown active. You can submit again in {{ cooldownSeconds }}s.</p>
			</div>
		</form>
	</section>
</template>
