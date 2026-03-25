<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { skillSchema } from '@/validations/skill.schema';
import { skillsApi } from '@/api/skills.api';
import { allSkillCategoryValues, skillCategoryGroups } from '@/constants/skillCategories';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
const errors = ref<Record<string, string>>({});

const form = reactive({
  name: '',
  category: 'programming_language',
  iconUrl: '',
});

const createMutation = useMutation({
  mutationFn: (dto: any) => skillsApi.create(dto),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-skills'] });
    toast.success('Skill created');
    router.push('/admin/skills');
  },
  onError: (error: any) => {
    const apiMessage = error?.response?.data?.message;
    const detail = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;
    toast.error(detail ? `Failed to create skill: ${detail}` : 'Failed to create skill');
  },
});

function submit() {
  const normalized = {
    ...form,
    iconUrl: form.iconUrl?.trim() || undefined,
  };

  const parsed = skillSchema.safeParse(normalized);
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
        <option value="" disabled>Select skill category</option>
        <optgroup v-for="group in skillCategoryGroups" :key="group.group" :label="group.group">
          <option v-for="option in group.options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </optgroup>
        <option v-if="form.category && !allSkillCategoryValues.includes(form.category)" :value="form.category">
          Current: {{ form.category }}
        </option>
      </select>
      <input v-model="form.iconUrl" class="rounded-md border p-2 md:col-span-2" placeholder="Icon URL" />
    </div>
    <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    <div class="flex gap-2">
      <Button type="submit" :disabled="createMutation.isPending.value">Create</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/skills')">Cancel</Button>
    </div>
  </form>
</template>

