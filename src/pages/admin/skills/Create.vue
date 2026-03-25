<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { skillSchema } from '@/validations/skill.schema';
import { skillsApi } from '@/api/skills.api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
const errors = ref<Record<string, string>>({});

const form = reactive({
  name: '',
  category: 'frontend',
  iconUrl: '',
  isPublished: true,
});

const createMutation = useMutation({
  mutationFn: (dto: any) => skillsApi.create(dto),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-skills'] });
    toast.success('Skill created');
    router.push('/admin/skills');
  },
  onError: () => toast.error('Failed to create skill'),
});

function submit() {
  const parsed = skillSchema.safeParse(form);
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
    <h1 class="text-2xl font-semibold">Create Skill</h1>
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="form.name" class="rounded-md border p-2" placeholder="Skill name" />
      <select v-model="form.category" class="rounded-md border p-2">
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="devops">DevOps</option>
        <option value="design">Design</option>
        <option value="other">Other</option>
      </select>
      <input v-model="form.iconUrl" class="rounded-md border p-2 md:col-span-2" placeholder="Icon URL" />
    </div>
    <label class="flex items-center gap-2"><input v-model="form.isPublished" type="checkbox" /> Published</label>
    <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    <div class="flex gap-2">
      <Button type="submit" :disabled="createMutation.isPending.value">Create</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/skills')">Cancel</Button>
    </div>
  </form>
</template>

