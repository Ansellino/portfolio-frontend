<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  skills?: Array<any>;
  maxVisible?: number;
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

const visibleSkills = computed(() => {
  if (!props.maxVisible || props.maxVisible <= 0) return normalizedSkills.value;
  return normalizedSkills.value.slice(0, props.maxVisible);
});

const hiddenSkills = computed(() => {
  if (!props.maxVisible || props.maxVisible <= 0) return [];
  return normalizedSkills.value.slice(props.maxVisible);
});

const hiddenSkillsLabel = computed(() => hiddenSkills.value.map((item) => item.name).join(', '));
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="skill in visibleSkills"
      :key="skill.id"
      class="rounded-full border px-2 py-1 text-xs"
    >
      {{ skill.name }}
    </span>
    <span
      v-if="hiddenSkills.length"
      class="rounded-full border border-dashed px-2 py-1 text-xs text-muted-foreground"
      :title="hiddenSkillsLabel"
    >
      +{{ hiddenSkills.length }}
    </span>
  </div>
</template>
