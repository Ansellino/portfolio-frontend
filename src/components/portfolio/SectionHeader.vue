<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="space-y-2">
    <h2 class="text-2xl font-semibold">{{ title }}</h2>
    <p v-if="description" class="text-muted-foreground">{{ description }}</p>
  </div>
</template>
