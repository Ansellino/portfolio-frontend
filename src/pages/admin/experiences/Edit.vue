<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { experienceSchema } from '@/validations/experience.schema';
import { experiencesApi } from '@/api/experience.api';
import ImageUploader from '@/components/admin/ImageUploader.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const qc = useQueryClient();
const toast = useToast();

const id = computed(() => String(route.params.id));
const logoFile = ref<File | null>(null);
const existingLogo = ref('');
const errors = ref<Record<string, string>>({});

const form = reactive({
  company: '',
  position: '',
  description: '',
  responsibilities: [''],
  companyLogoUrl: '',
  startDate: '',
  endDate: '',
  location: '',
  employmentType: 'FULL_TIME',
  isPublished: true,
});

const detailQuery = useQuery({
  queryKey: ['admin-experience', id],
  queryFn: () => experiencesApi.getById(id.value).then((r) => r.data),
});

watch(
  () => detailQuery.data.value,
  (payload) => {
    const data = payload?.data ?? payload;
    if (!data) return;
    form.company = data.company ?? '';
    form.position = data.position ?? '';
    form.description = data.description ?? '';
    form.responsibilities = Array.isArray(data.responsibilities) && data.responsibilities.length ? data.responsibilities : [''];
    form.companyLogoUrl = data.companyLogoUrl ?? '';
    form.startDate = data.startDate?.slice?.(0, 10) ?? '';
    form.endDate = data.endDate?.slice?.(0, 10) ?? '';
    form.location = data.location ?? '';
    form.employmentType = data.employmentType ?? 'FULL_TIME';
    form.isPublished = data.isPublished !== false;
    existingLogo.value = data.companyLogoUrl ?? '';
  },
  { immediate: true }
);

const updateMutation = useMutation({
  mutationFn: (payload: any) => experiencesApi.update(id.value, payload),
  onSuccess: async () => {
    await qc.invalidateQueries({ queryKey: ['admin-experiences'] });
    toast.success('Experience updated');
    router.push('/admin/experiences');
  },
  onError: () => toast.error('Failed to update experience'),
});

function addResponsibility() {
  form.responsibilities.push('');
}

function removeResponsibility(index: number) {
  form.responsibilities.splice(index, 1);
}

function submit() {
  const normalized = {
    ...form,
    responsibilities: form.responsibilities.filter((item) => item.trim().length > 0),
  };
  const parsed = experienceSchema.safeParse(normalized);
  if (!parsed.success) {
    errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]));
    return;
  }

  errors.value = {};
  const payload = {
    ...parsed.data,
    isPublished: form.isPublished,
  };
  updateMutation.mutate(payload);
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <h1 class="text-2xl font-semibold">Edit Experience</h1>
    <div class="grid gap-3 md:grid-cols-2">
      <input v-model="form.company" class="rounded-md border p-2" placeholder="Company" />
      <input v-model="form.position" class="rounded-md border p-2" placeholder="Position" />
      <select v-model="form.employmentType" class="rounded-md border p-2">
        <option value="FULL_TIME">Full-time</option>
        <option value="PART_TIME">Part-time</option>
        <option value="CONTRACT">Contract</option>
        <option value="INTERNSHIP">Internship</option>
        <option value="FREELANCE">Freelance</option>
      </select>
      <input v-model="form.location" class="rounded-md border p-2" placeholder="Location" />
      <input v-model="form.startDate" type="date" class="rounded-md border p-2" />
      <input v-model="form.endDate" type="date" class="rounded-md border p-2" />
      <input v-model="form.companyLogoUrl" class="rounded-md border p-2 md:col-span-2" placeholder="Logo URL" />
    </div>
    <textarea v-model="form.description" class="min-h-24 w-full rounded-md border p-2" placeholder="Description" />
    <ImageUploader v-model="logoFile" :preview-url="existingLogo" />
    <div class="space-y-2">
      <p class="text-sm font-medium">Responsibilities</p>
      <div v-for="(_, index) in form.responsibilities" :key="index" class="flex gap-2">
        <input v-model="form.responsibilities[index]" class="flex-1 rounded-md border p-2" :placeholder="`Responsibility ${index + 1}`" />
        <Button v-if="form.responsibilities.length > 1" type="button" variant="outline" @click="removeResponsibility(index)">Remove</Button>
      </div>
      <Button type="button" variant="outline" @click="addResponsibility">Add responsibility</Button>
    </div>
    <label class="flex items-center gap-2"><input v-model="form.isPublished" type="checkbox" /> Published</label>
    <div class="flex gap-2">
      <Button type="submit" :disabled="updateMutation.isPending.value">Save</Button>
      <Button type="button" variant="outline" @click="router.push('/admin/experiences')">Cancel</Button>
    </div>
  </form>
</template>

