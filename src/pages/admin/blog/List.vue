<script setup lang="ts">
import { computed, h } from 'vue';
import { useRouter } from 'vue-router';
import type { ColumnDef } from '@tanstack/vue-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import DataTable from '@/components/admin/DataTable.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { blogApi } from '@/api/blog.api';
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

const listQuery = useQuery({
  queryKey: ['admin-blog'],
  queryFn: () => blogApi.getAllAdmin().then((r) => r.data),
});

const toggleMutation = useMutation({
  mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => blogApi.togglePublish(id, isPublished),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-blog'] });
    toast.success('Post status updated');
  },
});

const deleteMutation = useMutation({
  mutationFn: (id: string) => blogApi.delete(id),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-blog'] });
    toast.success('Post deleted');
  },
});

const rows = computed(() => unwrapList(listQuery.data.value));
const columns = computed<ColumnDef<any>[]>(() => [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'category', header: 'Category' },
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
        h(Button, { variant: 'outline', size: 'sm', onClick: () => router.push(`/admin/blog/edit/${row.original.id}`) }, { default: () => 'Edit' }),
        h(Button, { variant: 'outline', size: 'sm', onClick: () => toggleMutation.mutate({ id: row.original.id, isPublished: !row.original.isPublished }) }, { default: () => (row.original.isPublished ? 'Unpublish' : 'Publish') }),
        h(ConfirmDialog, { title: 'Delete post?', confirmText: 'Delete', onConfirm: () => deleteMutation.mutate(row.original.id) }, { trigger: () => h(Button, { variant: 'destructive', size: 'sm' }, { default: () => 'Delete' }) }),
      ]),
  },
]);
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Blog</h1>
      <Button @click="router.push('/admin/blog/create')">Write Post</Button>
    </div>
    <DataTable :columns="columns" :data="rows" search-key="title" search-placeholder="Search blog posts..." />
  </section>
</template>
