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
const blogCategories = ['Tutorial', 'Guide', 'Opinion', 'Case Study'] as const;

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  category: 'Guide',
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
  mutationFn: (payload: any) => blogApi.create(payload),
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
  const payload = {
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    category: parsed.data.category,
    coverImageUrl: parsed.data.coverImageUrl || undefined,
    isPublished: parsed.data.isPublished,
    skillIds: parsed.data.tagIds,
  };
  createMutation.mutate(payload);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Write Post</h1>
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="form.title" class="rounded-md border p-2" placeholder="Title" />
      <p v-if="errors.title" class="text-sm text-destructive md:col-span-2">{{ errors.title }}</p>
      <select v-model="form.category" class="rounded-md border p-2">
        <option v-for="category in blogCategories" :key="category" :value="category">{{ category }}</option>
      </select>
      <input v-model.number="form.readingTimeMin" type="number" min="1" class="rounded-md border p-2" placeholder="Reading time" />
      <input v-model="form.coverImageUrl" class="rounded-md border p-2 md:col-span-2" placeholder="Cover Image URL" />
      <p v-if="errors.coverImageUrl" class="text-sm text-destructive md:col-span-2">{{ errors.coverImageUrl }}</p>
    </div>
    <textarea v-model="form.excerpt" class="min-h-24 w-full rounded-md border p-2" placeholder="Excerpt" />
    <p v-if="errors.excerpt" class="text-sm text-destructive">{{ errors.excerpt }}</p>
    <MarkdownEditor v-model="form.content" title="Content" />
    <p v-if="errors.content" class="text-sm text-destructive">{{ errors.content }}</p>
    <ImageUploader v-model="coverImageFile" />
    <label class="block text-sm font-medium">Tags (Skills)</label>
    <div class="rounded-md border p-3">
      <p class="mb-2 text-xs text-muted-foreground">Pilih satu atau lebih skill untuk dijadikan tag artikel.</p>
      <div class="grid max-h-56 gap-2 overflow-auto pr-1 sm:grid-cols-2">
        <label
          v-for="skill in skillOptions"
          :key="skill.id"
          class="flex items-center gap-2 rounded border px-2 py-1.5 text-sm"
        >
          <input v-model="form.tagIds" type="checkbox" :value="skill.id" />
          <span>{{ skill.name }}</span>
        </label>
      </div>
    </div>
    <div class="flex gap-6">
      <label class="flex items-center gap-2"><input v-model="form.isPublished" type="checkbox" /> Published</label>
      <label class="flex items-center gap-2">Published At <input v-model="form.publishedAt" type="date" class="rounded-md border p-2" /></label>
    </div>
    <div class="flex gap-2">
      <Button type="submit" :disabled="createMutation.isPending.value">Create</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/blog')">Cancel</Button>
    </div>
  </form>
</template>

