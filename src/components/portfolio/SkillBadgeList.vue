<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  skills?: Array<any>;
}>();

const normalizedSkills = computed(() => {
  const list = Array.isArray(props.skills) ? props.skills : [];

  return list
    .map((item: any) => {
      const nested = item?.skill;
      const id = item?.id ?? nested?.id ?? item?.skillId;
      const name = item?.name ?? nested?.name;
      if (!name) return null;
      return { id: String(id ?? name), name: String(name) };
    })
    .filter((item): item is { id: string; name: string } => !!item);
});
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="skill in normalizedSkills"
      :key="skill.id"
      class="rounded-full border px-2 py-1 text-xs"
    >
      {{ skill.name }}
    </span>
  </div>
</template>
