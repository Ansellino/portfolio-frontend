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
  <article class="flex h-full flex-col rounded-xl border bg-card p-4 shadow-sm">
    <img
      :src="project.thumbnailUrl || 'https://placehold.co/600x360?text=Project'"
      :alt="project.title"
      loading="lazy"
      class="h-40 w-full rounded-md object-cover sm:h-44"
    />
    <h3 class="mt-3 line-clamp-2 min-h-[3.5rem] text-lg font-semibold">{{ project.title }}</h3>
    <p class="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">{{ project.description }}</p>
    <div class="mt-3 min-h-8">
      <SkillBadgeList :skills="project.skills" :max-visible="4" />
    </div>
    <RouterLink :to="`/projects/${project.slug}`" class="mt-4 inline-flex text-sm font-medium text-primary md:mt-auto">
      {{ detailLabel || 'Open project' }}
    </RouterLink>
  </article>
</template>
