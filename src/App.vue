<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import { useThemeStore } from '@/stores/theme.store';

useThemeStore();
</script>

<template>
  <RouterView />
  <Toaster rich-colors position="top-right" />
</template>
