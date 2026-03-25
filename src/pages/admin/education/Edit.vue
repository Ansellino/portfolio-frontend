<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { educationSchema } from '@/validations/education.schema';
import { educationApi } from '@/api/education.api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
const id = computed(() => String(route.params.id));
const errors = ref<Record<string, string>>({});

const form = reactive({
  institution: '',
  degree: '',
  fieldOfStudy: '',
  grade: '',
  description: '',
  startDate: '',
  endDate: '',
  isPublished: true,
});

const detailQuery = useQuery({
  queryKey: ['admin-education-item', id],
  queryFn: () => educationApi.getById(id.value).then((r) => r.data),
});

watch(
  () => detailQuery.data.value,
  (payload) => {
    const data = payload?.data ?? payload;
    if (!data) return;
    form.institution = data.institution ?? '';
    form.degree = data.degree ?? '';
    form.fieldOfStudy = data.fieldOfStudy ?? '';
    form.grade = data.grade ?? '';
    form.description = data.description ?? '';
    form.startDate = data.startDate?.slice?.(0, 10) ?? '';
    form.endDate = data.endDate?.slice?.(0, 10) ?? '';
    form.isPublished = data.isPublished !== false;
  },
  { immediate: true }
);

const updateMutation = useMutation({
  mutationFn: (dto: any) => educationApi.update(id.value, dto),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-education'] });
    toast.success('Education updated');
    router.push('/admin/education');
  },
  onError: () => toast.error('Failed to update education'),
});

function submit() {
  const parsed = educationSchema.safeParse(form);
  if (!parsed.success) {
    errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
    return;
  }

  errors.value = {};
  updateMutation.mutate(parsed.data);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Edit Education</h1>
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="form.institution" class="rounded-md border p-2" placeholder="Institution" />
      <input v-model="form.degree" class="rounded-md border p-2" placeholder="Degree" />
      <input v-model="form.fieldOfStudy" class="rounded-md border p-2" placeholder="Field" />
      <input v-model="form.grade" class="rounded-md border p-2" placeholder="GPA" />
      <input v-model="form.startDate" type="date" class="rounded-md border p-2" />
      <input v-model="form.endDate" type="date" class="rounded-md border p-2" />
      <textarea v-model="form.description" class="min-h-24 rounded-md border p-2 md:col-span-2" placeholder="Description" />
    </div>
    <label class="flex items-center gap-2"><input v-model="form.isPublished" type="checkbox" /> Published</label>
    <p v-if="errors.institution" class="text-sm text-destructive">{{ errors.institution }}</p>
    <div class="flex gap-2">
      <Button type="submit" :disabled="updateMutation.isPending">Save</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/education')">Cancel</Button>
    </div>
  </form>
</template>

