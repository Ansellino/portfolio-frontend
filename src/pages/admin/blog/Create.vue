<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { blogSchema } from '@/validations/blog.schema';
import { blogApi } from '@/api/blog.api';
import { skillsApi } from '@/api/skills.api';
import ImageUploader from '@/components/admin/ImageUploader.vue';
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
const coverImageFile = ref<File | null>(null);
const errors = ref<Record<string, string>>({});

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  category: '',
  readingTimeMin: 3,
  isPublished: true,
  publishedAt: '',
  tagIds: [] as string[],
});

const skillsQuery = useQuery({
  queryKey: ['blog-tags-skills'],
  queryFn: () => skillsApi.getAllAdmin().then((r) => r.data),
});

const skillOptions = computed(() => {
  const body = skillsQuery.data.value?.data ?? skillsQuery.data.value;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.data)) return body.data;
  return [];
});

const createMutation = useMutation({
  mutationFn: (payload: FormData) => blogApi.create(payload),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-blog'] });
    toast.success('Blog post created');
    router.push('/admin/blog');
  },
  onError: () => toast.error('Failed to create blog post'),
});

function submit() {
  const parsed = blogSchema.safeParse(form);
  if (!parsed.success) {
    errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
    return;
  }

  errors.value = {};
  const payload = new FormData();
  Object.entries(parsed.data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => payload.append(key, String(v)));
      return;
    }
    payload.append(key, String(value ?? ''));
  });
  if (coverImageFile.value) payload.append('coverImage', coverImageFile.value);
  createMutation.mutate(payload);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Write Post</h1>
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="form.title" class="rounded-md border p-2" placeholder="Title" />
      <input v-model="form.slug" class="rounded-md border p-2" placeholder="Slug" />
      <input v-model="form.category" class="rounded-md border p-2" placeholder="Category" />
      <input v-model.number="form.readingTimeMin" type="number" min="1" class="rounded-md border p-2" placeholder="Reading time" />
      <input v-model="form.coverImageUrl" class="rounded-md border p-2 md:col-span-2" placeholder="Cover Image URL" />
    </div>
    <textarea v-model="form.excerpt" class="min-h-24 w-full rounded-md border p-2" placeholder="Excerpt" />
    <MarkdownEditor v-model="form.content" title="Content" />
    <ImageUploader v-model="coverImageFile" />
    <label class="block text-sm font-medium">Tags (Skills)</label>
    <select
      multiple
      class="min-h-28 w-full rounded-md border p-2"
      :value="form.tagIds"
      @change="form.tagIds = Array.from(($event.target as HTMLSelectElement).selectedOptions).map((o) => o.value)"
    >
      <option v-for="skill in skillOptions" :key="skill.id" :value="skill.id">{{ skill.name }}</option>
    </select>
    <div class="flex gap-6">
      <label class="flex items-center gap-2"><input v-model="form.isPublished" type="checkbox" /> Published</label>
      <label class="flex items-center gap-2">Published At <input v-model="form.publishedAt" type="date" class="rounded-md border p-2" /></label>
    </div>
    <p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
    <div class="flex gap-2">
      <Button type="submit" :disabled="createMutation.isPending">Create</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/blog')">Cancel</Button>
    </div>
  </form>
</template>

