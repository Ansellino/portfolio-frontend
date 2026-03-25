<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/theme.store';

const theme = useThemeStore();
</script>

<template>
  <Button variant="outline" size="icon" aria-label="Toggle theme" @click="theme.toggle()">
    <Sun v-if="theme.isDark" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </Button>
</template>
