<script setup lang="ts">
import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { RouterLink } from 'vue-router';
import { Bell, BookOpenText, BriefcaseBusiness, FolderKanban, GraduationCap, PlusCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import api from '@/api/axios';

type StatItem = {
	label: string;
	value: number;
	icon: unknown;
};

async function fetchCount(url: string, fallbackField = 'total') {
	const { data } = await api.get(url, { params: { page: 1, limit: 1 } });
	const payload = data?.data ?? data;

	if (typeof data?.count === 'number') return data.count;
	if (typeof payload?.count === 'number') return payload.count;
	if (typeof payload?.[fallbackField] === 'number') return payload[fallbackField];
	if (Array.isArray(payload?.items)) return payload.items.length;
	if (Array.isArray(payload)) return payload.length;

	return 0;
}

const statsQuery = useQuery({
	queryKey: ['admin', 'dashboard', 'stats'],
	retry: 0,
	queryFn: async () => {
		const [projects, experiences, certifications, blogPosts, unreadMessages] = await Promise.all([
			fetchCount('/admin/projects'),
			fetchCount('/admin/experiences'),
			fetchCount('/admin/certifications'),
			fetchCount('/admin/blog-posts'),
			fetchCount('/admin/messages', 'unreadCount'),
		]);

		return { projects, experiences, certifications, blogPosts, unreadMessages };
	},
});

const stats = computed<StatItem[]>(() => {
	const data = statsQuery.data.value;
	return [
		{ label: 'Total Projects', value: data?.projects ?? 0, icon: FolderKanban },
		{ label: 'Experiences', value: data?.experiences ?? 0, icon: BriefcaseBusiness },
		{ label: 'Certifications', value: data?.certifications ?? 0, icon: GraduationCap },
		{ label: 'Blog Posts', value: data?.blogPosts ?? 0, icon: BookOpenText },
		{ label: 'Unread Messages', value: data?.unreadMessages ?? 0, icon: Bell },
	];
});

const recentActivity = computed(() => {
	const now = new Date();
	const messages = statsQuery.data.value?.unreadMessages ?? 0;
	return [
		{ text: `${messages} unread message(s) waiting for response`, at: now.toLocaleString() },
		{ text: 'Review pending project updates', at: now.toLocaleDateString() },
		{ text: 'Publish latest weekly engineering notes', at: now.toLocaleDateString() },
	];
});

const quickActions = [
	{ label: 'Create Project', to: '/admin/projects/create' },
	{ label: 'Write Post', to: '/admin/blog/create' },
	{ label: 'View Messages', to: '/admin/messages' },
];
</script>

<template>
	<section class="space-y-6">
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
			<article v-for="item in stats" :key="item.label" class="rounded-lg border bg-card p-4 shadow-sm">
				<div class="mb-3 flex items-center justify-between">
					<p class="text-sm text-muted-foreground">{{ item.label }}</p>
					<component :is="item.icon" class="h-4 w-4 text-muted-foreground" />
				</div>
				<p class="text-3xl font-semibold leading-none">{{ item.value }}</p>
			</article>
		</div>

		<div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
			<article class="rounded-lg border bg-card p-5 shadow-sm">
				<h3 class="text-lg font-semibold">Recent Activity</h3>
				<ul class="mt-4 space-y-3">
					<li
						v-for="(entry, index) in recentActivity"
						:key="`${entry.text}-${index}`"
						class="rounded-md border bg-background p-3"
					>
						<p class="text-sm">{{ entry.text }}</p>
						<p class="mt-1 text-xs text-muted-foreground">{{ entry.at }}</p>
					</li>
				</ul>
			</article>

			<article class="rounded-lg border bg-card p-5 shadow-sm">
				<h3 class="text-lg font-semibold">Quick Actions</h3>
				<div class="mt-4 space-y-2">
					<Button
						v-for="action in quickActions"
						:key="action.to"
						as-child
						class="w-full justify-start"
						variant="outline"
					>
						<RouterLink :to="action.to">
							<PlusCircle class="mr-2 h-4 w-4" />
							{{ action.label }}
						</RouterLink>
					</Button>
				</div>
			</article>
		</div>
	</section>
</template>
