<script setup lang="ts">
import { computed, h } from 'vue';
import { useRouter } from 'vue-router';
import type { ColumnDef } from '@tanstack/vue-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import DataTable from '@/components/admin/DataTable.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { projectsApi } from '@/api/projects.api';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const qc = useQueryClient();
const toast = useToast();

function unwrapList(payload: any): any[] {
	const body = payload?.data ?? payload;
	if (Array.isArray(body)) return body;
	if (Array.isArray(body?.items)) return body.items;
	if (Array.isArray(body?.data)) return body.data;
	return [];
}

const projectsQuery = useQuery({
	queryKey: ['admin-projects'],
	queryFn: () => projectsApi.getAllAdmin().then((r) => r.data),
});

const toggleMutation = useMutation({
	mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => projectsApi.togglePublish(id, isPublished),
	onSuccess: () => {
		qc.invalidateQueries({ queryKey: ['admin-projects'] });
		toast.success('Project status updated');
	},
});

const deleteMutation = useMutation({
	mutationFn: (id: string) => projectsApi.delete(id),
	onSuccess: () => {
		qc.invalidateQueries({ queryKey: ['admin-projects'] });
		toast.success('Project deleted');
	},
});

const rows = computed(() => unwrapList(projectsQuery.data.value));

const columns = computed<ColumnDef<any>[]>(() => [
	{ accessorKey: 'title', header: 'Title' },
	{ accessorKey: 'slug', header: 'Slug' },
	{
		accessorKey: 'isPublished',
		header: 'Published',
		cell: ({ row }) => (row.original.isPublished ? 'Yes' : 'No'),
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) =>
			h('div', { class: 'flex items-center gap-2' }, [
				h(
					Button,
					{
						variant: 'outline',
						size: 'sm',
						onClick: () => router.push(`/admin/projects/edit/${row.original.id}`),
					},
					{ default: () => 'Edit' }
				),
				h(
					Button,
					{
						variant: 'outline',
						size: 'sm',
						onClick: () => toggleMutation.mutate({ id: row.original.id, isPublished: !row.original.isPublished }),
					},
					{ default: () => (row.original.isPublished ? 'Unpublish' : 'Publish') }
				),
				h(
					ConfirmDialog,
					{
						title: 'Delete project?',
						description: 'This action cannot be undone.',
						confirmText: 'Delete',
						onConfirm: () => deleteMutation.mutate(row.original.id),
					},
					{
						trigger: () =>
							h(
								Button,
								{
									variant: 'destructive',
									size: 'sm',
								},
								{ default: () => 'Delete' }
							),
					}
				),
			]),
	},
]);
</script>

<template>
	<section class="space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold">Projects</h1>
			<Button @click="router.push('/admin/projects/create')">Create Project</Button>
		</div>
		<DataTable :columns="columns" :data="rows" search-key="title" search-placeholder="Search projects..." />
	</section>
</template>
