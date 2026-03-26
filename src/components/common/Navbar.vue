<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Menu, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/common/ThemeToggle.vue';

const route = useRoute();
const mobileOpen = ref(false);

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    mobileOpen.value = false;
  }
};

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Certifications', to: '/certifications' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function isActive(path: string) {
  if (path === '/') return route.path === '/';
  return route.path === path || route.path.startsWith(`${path}/`);
}

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  }
);

watch(mobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<template>
  <header class="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:py-3">
      <RouterLink to="/" class="flex items-center" aria-label="Home">
        <img src="/logo.png" alt="Logo" class="h-7 w-auto sm:h-8" />
      </RouterLink>

      <ul class="hidden items-center gap-5 md:flex">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            :to="item.to"
            class="text-sm transition-colors"
            :class="isActive(item.to)
              ? 'text-foreground font-semibold'
              : 'text-muted-foreground hover:text-foreground'"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <Button
          type="button"
          variant="outline"
          size="icon"
          class="h-9 w-9 md:hidden"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <Menu v-if="!mobileOpen" class="h-4 w-4" />
          <X v-else class="h-4 w-4" />
        </Button>
      </div>
    </nav>

    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-20 bg-black/30 md:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div v-if="mobileOpen" class="relative z-30 border-t bg-background/95 shadow-md md:hidden backdrop-blur">
        <ul class="mx-auto max-w-6xl space-y-1.5 px-4 py-3">
          <li v-for="item in navItems" :key="item.to">
            <RouterLink
              :to="item.to"
              class="block rounded-md px-3 py-2.5 text-sm transition-colors"
              :class="isActive(item.to)
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>
