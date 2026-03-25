<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SkillBadgeList from '@/components/portfolio/SkillBadgeList.vue';

defineProps<{
  project: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnailUrl?: string;
    skills?: Array<{ id?: string; name?: string }>;
  };
  detailLabel?: string;
}>();
</script>

<template>
  <article class="rounded-xl border bg-card p-4 shadow-sm">
    <img
      :src="project.thumbnailUrl || 'https://placehold.co/600x360?text=Project'"
      :alt="project.title"
      loading="lazy"
      class="h-44 w-full rounded-md object-cover"
    />
    <h3 class="mt-3 text-lg font-semibold">{{ project.title }}</h3>
    <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{{ project.description }}</p>
    <SkillBadgeList class="mt-3" :skills="project.skills" />
    <RouterLink :to="`/projects/${project.slug}`" class="mt-4 inline-block text-sm font-medium text-primary">
      {{ detailLabel || 'Open project' }}
    </RouterLink>
  </article>
</template>
