<script setup lang="ts">
import { useId } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    title?: string;
  }>(),
  {
    title: 'Content',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const editorId = useId();
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">{{ title }}</label>
    <MdEditor
      :editor-id="editorId"
      :model-value="props.modelValue"
      @update:model-value="(value) => emit('update:modelValue', value)"
      language="en-US"
      preview-theme="github"
      class="rounded-md border"
    />
  </div>
</template>
