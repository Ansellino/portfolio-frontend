<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { blogSchema } from '@/validations/blog.schema';
import { blogApi } from '@/api/blog.api';
import { skillsApi } from '@/api/skills.api';
import ImageUploader from '@/components/admin/ImageUploader.vue';
import MarkdownEditor from '@/components/admin/MarkdownEditor.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
const id = computed(() => String(route.params.id));
const coverImageFile = ref<File | null>(null);
const existingCover = ref('');
const errors = ref<Record<string, string>>({});

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

const detailQuery = useQuery({
  queryKey: ['admin-blog-item', id],
  queryFn: () => blogApi.getById(id.value).then((r) => r.data),
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

watch(
  () => detailQuery.data.value,
  (payload) => {
    const data = payload?.data ?? payload;
    if (!data) return;
    form.title = data.title ?? '';
    form.excerpt = data.excerpt ?? '';
    form.content = data.content ?? '';
    form.coverImageUrl = data.coverImageUrl ?? '';
    form.category = data.category ?? '';
    form.readingTimeMin = data.readingTimeMin ?? 3;
    form.isPublished = data.isPublished !== false;
    form.publishedAt = data.publishedAt?.slice?.(0, 10) ?? '';
    form.tagIds = Array.isArray(data.tags)
      ? data.tags
          .map((tag: any) => tag.skillId ?? tag.skill?.id ?? tag.id)
          .filter((id: any) => typeof id === 'string' && id.length > 0)
      : data.tagIds ?? [];
    existingCover.value = data.coverImageUrl ?? '';
  },
  { immediate: true }
);

const updateMutation = useMutation({
  mutationFn: (payload: any) => blogApi.update(id.value, payload),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-blog'] });
    toast.success('Blog post updated');
    router.push('/admin/blog');
  },
  onError: () => toast.error('Failed to update blog post'),
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
  updateMutation.mutate(payload);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Edit Post</h1>
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="form.title" class="rounded-md border p-2" placeholder="Title" />
      <input v-model="form.category" class="rounded-md border p-2" placeholder="Category" />
      <input v-model.number="form.readingTimeMin" type="number" min="1" class="rounded-md border p-2" placeholder="Reading time" />
      <input v-model="form.coverImageUrl" class="rounded-md border p-2 md:col-span-2" placeholder="Cover Image URL" />
    </div>
    <textarea v-model="form.excerpt" class="min-h-24 w-full rounded-md border p-2" placeholder="Excerpt" />
    <MarkdownEditor v-model="form.content" title="Content" />
    <ImageUploader v-model="coverImageFile" :preview-url="existingCover" />
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
    <p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
    <div class="flex gap-2">
      <Button type="submit" :disabled="updateMutation.isPending.value">Save</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/blog')">Cancel</Button>
    </div>
  </form>
</template>

