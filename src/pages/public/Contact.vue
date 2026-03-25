<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { contactSchema } from '@/validations/contact.schema';
import { contactApi } from '@/api/contact.api';
import { usePageSeo } from '@/composables/usePageSeo';
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
const showSuccess = ref(false);
const isSubmitting = ref(false);
let cooldownTimeout: number | null = null;

const canSubmit = computed(() => !cooldown.value && !isSubmitting.value);

async function handleSubmit(values: ContactForm) {
	isSubmitting.value = true;
	showSuccess.value = false;
	try {
		await contactApi.sendMessage(values);
		cooldown.value = true;
		showSuccess.value = true;
		toast.success('Message sent successfully');

		form.name = '';
		form.email = '';
		form.subject = '';
		form.message = '';

		if (cooldownTimeout) window.clearTimeout(cooldownTimeout);
		cooldownTimeout = window.setTimeout(() => {
			cooldown.value = false;
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
});
</script>

<template>
	<section class="mx-auto max-w-2xl space-y-6 px-4 py-10">
		<h1 class="text-3xl font-bold">Contact</h1>
		<p class="text-muted-foreground">Have a project, collaboration idea, or opportunity? Send a message.</p>

		<form class="space-y-4 rounded-xl border bg-card p-6" @submit.prevent="submit">
			<p v-if="showSuccess" class="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
				Message sent successfully. Please wait 60 seconds before sending another message.
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
			<div class="flex items-center gap-3">
				<Button type="submit" :disabled="!canSubmit">{{ cooldown ? 'Wait 60s' : (isSubmitting ? 'Sending...' : 'Send Message') }}</Button>
				<p v-if="cooldown" class="text-xs text-muted-foreground">Cooldown active after submission.</p>
			</div>
		</form>
	</section>
</template>
