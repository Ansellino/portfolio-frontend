<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { educationSchema } from '@/validations/education.schema';
import { educationApi } from '@/api/education.api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
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

const createMutation = useMutation({
  mutationFn: (dto: any) => educationApi.create(dto),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-education'] });
    toast.success('Education created');
    router.push('/admin/education');
  },
  onError: () => toast.error('Failed to create education'),
});

function submit() {
  const parsed = educationSchema.safeParse(form);
  if (!parsed.success) {
    errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
    return;
  }

  errors.value = {};
  createMutation.mutate(parsed.data);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Create Education</h1>
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
      <Button type="submit" :disabled="createMutation.isPending.value">Create</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/education')">Cancel</Button>
    </div>
  </form>
</template>

