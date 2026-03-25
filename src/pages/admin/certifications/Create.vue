<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { certificationSchema } from '@/validations/certification.schema';
import { certificationsApi } from '@/api/certification.api';
import ImageUploader from '@/components/admin/ImageUploader.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const qc = useQueryClient();
const toast = useToast();
const imageFile = ref<File | null>(null);
const errors = ref<Record<string, string>>({});

const form = reactive({
  name: '',
  issuer: '',
  category: '',
  issueDate: '',
  expirationDate: '',
  credentialId: '',
  credentialUrl: '',
  skillIds: [] as string[],
  isPublished: true,
});

const createMutation = useMutation({
  mutationFn: (payload: FormData) => certificationsApi.create(payload),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-certifications'] });
    toast.success('Certification created');
    router.push('/admin/certifications');
  },
  onError: () => toast.error('Failed to create certification'),
});

function submit() {
  const parsed = certificationSchema.safeParse(form);
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
  payload.append('isPublished', String(form.isPublished));
  if (imageFile.value) payload.append('image', imageFile.value);
  createMutation.mutate(payload);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Create Certification</h1>
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="form.name" class="rounded-md border p-2" placeholder="Name" />
      <input v-model="form.issuer" class="rounded-md border p-2" placeholder="Issuer" />
      <input v-model="form.category" class="rounded-md border p-2" placeholder="Category" />
      <input v-model="form.credentialId" class="rounded-md border p-2" placeholder="Credential ID" />
      <input v-model="form.credentialUrl" class="rounded-md border p-2 md:col-span-2" placeholder="Credential URL" />
      <input v-model="form.issueDate" type="date" class="rounded-md border p-2" />
      <input v-model="form.expirationDate" type="date" class="rounded-md border p-2" />
    </div>
    <ImageUploader v-model="imageFile" />
    <label class="flex items-center gap-2"><input v-model="form.isPublished" type="checkbox" /> Published</label>
    <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
    <div class="flex gap-2">
      <Button type="submit" :disabled="createMutation.isPending.value">Create</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/certifications')">Cancel</Button>
    </div>
  </form>
</template>

