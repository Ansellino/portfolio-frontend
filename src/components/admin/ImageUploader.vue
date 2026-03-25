<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Upload, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = withDefaults(
  defineProps<{
    modelValue?: File | null;
    previewUrl?: string;
    accept?: string;
  }>(),
  {
    modelValue: null,
    previewUrl: '',
    accept: 'image/*',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void;
}>();

const dragActive = ref(false);
const localPreview = ref('');

const preview = computed(() => localPreview.value || props.previewUrl || '');

watch(
  () => props.modelValue,
  (file) => {
    if (!file) {
      localPreview.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    localPreview.value = objectUrl;
  },
  { immediate: true }
);

function setFile(file?: File) {
  if (!file) return;
  emit('update:modelValue', file);
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  dragActive.value = false;
  const file = event.dataTransfer?.files?.[0];
  setFile(file);
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  setFile(file);
}

function clearFile() {
  localPreview.value = '';
  emit('update:modelValue', null);
}
</script>

<template>
  <div class="space-y-3">
    <label
      class="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition"
      :class="dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/60'"
      @dragover.prevent="dragActive = true"
      @dragleave.prevent="dragActive = false"
      @drop="handleDrop"
    >
      <input class="hidden" type="file" :accept="accept" @change="handleInput" />
      <Upload class="mb-2 h-6 w-6 text-muted-foreground" />
      <p class="text-sm font-medium">Drag and drop an image, or click to browse</p>
      <p class="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP up to your server limit</p>
    </label>

    <div v-if="preview" class="relative overflow-hidden rounded-md border">
      <img :src="preview" alt="Upload preview" class="h-52 w-full object-cover" />
      <Button variant="secondary" size="sm" class="absolute right-2 top-2" @click="clearFile">
        <X class="mr-1 h-3 w-3" />
        Remove
      </Button>
    </div>
  </div>
</template>
