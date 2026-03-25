<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';

type AdminMessage = {
	id: string;
	name?: string;
	email?: string;
	subject?: string;
	message?: string;
	isRead?: boolean;
	createdAt?: string;
};

function unwrapList(payload: any): AdminMessage[] {
	const body = payload?.data ?? payload;
	if (Array.isArray(body)) return body;
	if (Array.isArray(body?.items)) return body.items;
	if (Array.isArray(body?.data)) return body.data;
	return [];
}

const activeTab = ref<'all' | 'unread'>('all');
const selectedId = ref<string | null>(null);

const messagesQuery = useQuery({
	queryKey: ['admin', 'messages', activeTab],
	queryFn: async () => {
		const params = activeTab.value === 'unread' ? { isRead: false } : undefined;
		const { data } = await api.get('/admin/messages', { params });
		return data;
	},
	retry: 0,
});

const messages = computed(() => unwrapList(messagesQuery.data.value));

const selectedMessage = computed(() => {
	const list = messages.value;
	if (!list.length) return null;
	if (!selectedId.value) return list[0];
	return list.find((item) => item.id === selectedId.value) ?? list[0];
});

const unreadCount = computed(() => messages.value.filter((item) => !item.isRead).length);

function fmt(value?: string) {
	if (!value) return '-';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString();
}
</script>

<template>
	<section class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h1 class="text-2xl font-semibold">Messages</h1>
				<p class="text-sm text-muted-foreground">Inbox from your public contact form.</p>
			</div>

			<div class="flex items-center gap-2">
				<Button :variant="activeTab === 'all' ? 'default' : 'outline'" size="sm" @click="activeTab = 'all'">
					All
				</Button>
				<Button :variant="activeTab === 'unread' ? 'default' : 'outline'" size="sm" @click="activeTab = 'unread'">
					Unread ({{ unreadCount }})
				</Button>
			</div>
		</div>

		<div class="grid gap-4 lg:grid-cols-[320px_1fr]">
			<aside class="rounded-lg border bg-card">
				<ul v-if="messages.length" class="divide-y">
					<li v-for="item in messages" :key="item.id">
						<button
							type="button"
							class="w-full px-4 py-3 text-left transition-colors hover:bg-accent"
							:class="selectedMessage?.id === item.id ? 'bg-accent' : ''"
							@click="selectedId = item.id"
						>
							<div class="flex items-center justify-between gap-3">
								<p class="line-clamp-1 text-sm font-medium">{{ item.subject || '(No subject)' }}</p>
								<span v-if="!item.isRead" class="h-2 w-2 rounded-full bg-primary" />
							</div>
							<p class="mt-1 line-clamp-1 text-xs text-muted-foreground">{{ item.name || item.email || 'Anonymous' }}</p>
							<p class="mt-1 text-xs text-muted-foreground">{{ fmt(item.createdAt) }}</p>
						</button>
					</li>
				</ul>

				<div v-else class="p-4 text-sm text-muted-foreground">
					{{ messagesQuery.isLoading.value ? 'Loading messages...' : 'No messages found.' }}
				</div>
			</aside>

			<article class="rounded-lg border bg-card p-5">
				<template v-if="selectedMessage">
					<div class="mb-4 space-y-1">
						<h2 class="text-xl font-semibold">{{ selectedMessage.subject || '(No subject)' }}</h2>
						<p class="text-sm text-muted-foreground">
							From {{ selectedMessage.name || 'Anonymous' }}
							<span v-if="selectedMessage.email">({{ selectedMessage.email }})</span>
						</p>
						<p class="text-xs text-muted-foreground">{{ fmt(selectedMessage.createdAt) }}</p>
					</div>

					<div class="rounded-md border bg-background p-4">
						<p class="whitespace-pre-wrap text-sm leading-relaxed">{{ selectedMessage.message || '-' }}</p>
					</div>
				</template>

				<p v-else class="text-sm text-muted-foreground">Select a message to see details.</p>
			</article>
		</div>
	</section>
</template>
