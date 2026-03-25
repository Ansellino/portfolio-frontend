<script setup lang="ts">
import { computed, h } from 'vue';
import { useRouter } from 'vue-router';
import type { ColumnDef } from '@tanstack/vue-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import DataTable from '@/components/admin/DataTable.vue';
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { skillsApi } from '@/api/skills.api';
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
  queryKey: ['admin-skills'],
  queryFn: () => skillsApi.getAllAdmin().then((r) => r.data),
});

const deleteMutation = useMutation({
  mutationFn: (id: string) => skillsApi.delete(id),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['admin-skills'] });
    toast.success('Skill deleted');
  },
});

const rows = computed(() => unwrapList(listQuery.data.value));
const columns = computed<ColumnDef<any>[]>(() => [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'category', header: 'Category' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(Button, { variant: 'outline', size: 'sm', onClick: () => router.push(`/admin/skills/edit/${row.original.id}`) }, { default: () => 'Edit' }),
        h(ConfirmDialog, { title: 'Delete skill?', confirmText: 'Delete', onConfirm: () => deleteMutation.mutate(row.original.id) }, { trigger: () => h(Button, { variant: 'destructive', size: 'sm' }, { default: () => 'Delete' }) }),
      ]),
  },
]);
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Skills</h1>
      <Button @click="router.push('/admin/skills/create')">Create Skill</Button>
    </div>
    <DataTable :columns="columns" :data="rows" search-key="name" search-placeholder="Search skills..." />
  </section>
</template>
