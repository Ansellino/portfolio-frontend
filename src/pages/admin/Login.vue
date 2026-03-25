<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();
const dummyEmail = import.meta.env.VITE_ADMIN_DUMMY_EMAIL || 'admin@example.com';
const dummyPassword = import.meta.env.VITE_ADMIN_DUMMY_PASSWORD || 'admin12345';

const formSchema = z.object({
	email: z.string().email('Please enter a valid email'),
	password: z.string().min(1, 'Password is required'),
});

const form = reactive({
	email: '',
	password: '',
});

const errors = ref<Record<string, string>>({});
const submitting = ref(false);

watchEffect(() => {
	if (auth.isAuthenticated) {
		router.replace('/admin/dashboard');
	}
});

async function submit() {
	const parsed = formSchema.safeParse(form);
	if (!parsed.success) {
		errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
		return;
	}

	errors.value = {};
	submitting.value = true;

	try {
		await auth.login(parsed.data.email, parsed.data.password);
		toast.success('Welcome back');
		await router.replace('/admin/dashboard');
	} catch {
		toast.error('Invalid credentials');
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<section class="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-10">
		<form class="w-full space-y-5 rounded-xl border bg-card p-6 shadow-sm" @submit.prevent="submit">
			<div class="space-y-1">
				<h1 class="text-2xl font-semibold">Admin Login</h1>
				<p class="text-sm text-muted-foreground">Sign in to manage portfolio content.</p>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium" for="email">Email</label>
				<input
					id="email"
					v-model="form.email"
					type="email"
					autocomplete="email"
					class="w-full rounded-md border bg-background px-3 py-2"
					placeholder="you@example.com"
				/>
				<p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
			</div>

			<div class="space-y-2">
				<label class="text-sm font-medium" for="password">Password</label>
				<input
					id="password"
					v-model="form.password"
					type="password"
					autocomplete="current-password"
					class="w-full rounded-md border bg-background px-3 py-2"
					placeholder="••••••••"
				/>
				<p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
			</div>

			<Button type="submit" class="w-full" :disabled="submitting">
				{{ submitting ? 'Signing in...' : 'Sign In' }}
			</Button>
		</form>
	</section>
</template>
