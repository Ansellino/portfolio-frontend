<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { skillSchema } from '@/validations/skill.schema';
import { skillsApi } from '@/api/skills.api';
import { allSkillCategoryValues, skillCategoryGroups } from '@/constants/skillCategories';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
const id = computed(() => String(route.params.id));
const errors = ref<Record<string, string>>({});

const form = reactive({
  name: '',
  category: 'programming_language',
  iconUrl: '',
});

const detailQuery = useQuery({
  queryKey: ['admin-skill', id],
  queryFn: () => skillsApi.getById(id.value).then((r) => r.data),
});

watch(
  () => detailQuery.data.value,
  (payload) => {
    const data = payload?.data ?? payload;
    if (!data) return;
    form.name = data.name ?? '';
    form.category = data.category ?? 'programming_language';
    form.iconUrl = data.iconUrl ?? '';
  },
  { immediate: true }
);

const updateMutation = useMutation({
  mutationFn: (dto: any) => skillsApi.update(id.value, dto),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-skills'] });
    toast.success('Skill updated');
    router.push('/admin/skills');
  },
  onError: (error: any) => {
    const apiMessage = error?.response?.data?.message;
    const detail = Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage;
    toast.error(detail ? `Failed to update skill: ${detail}` : 'Failed to update skill');
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
  updateMutation.mutate(parsed.data);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Edit Skill</h1>
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
      <Button type="submit" :disabled="updateMutation.isPending.value">Save</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/skills')">Cancel</Button>
    </div>
  </form>
</template>

