<script setup lang="ts">
defineProps<{
  skills?: Array<{ id?: string; name?: string }>;
}>();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="skill in skills || []"
      :key="skill.id || skill.name"
      class="rounded-full border px-2 py-1 text-xs"
    >
      {{ skill.name }}
    </span>
  </div>
</template>
