<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Menu, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/common/ThemeToggle.vue';

const route = useRoute();
const mobileOpen = ref(false);

type NavbarStyle = 'minimal' | 'glassy';
const navbarStyle: NavbarStyle = 'minimal';

const headerClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'border-b border-border bg-background shadow-sm',
  glassy: 'border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70',
};

const desktopNavClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'hidden items-center gap-1 rounded-full border border-border bg-card p-1 md:flex',
  glassy: 'hidden items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 md:flex',
};

const desktopLinkClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'inline-flex items-center rounded-full px-3 py-1.5 text-sm transition-colors',
  glassy: 'inline-flex items-center rounded-full px-3 py-1.5 text-sm transition-colors',
};

const desktopActiveClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'bg-primary text-primary-foreground font-semibold shadow-sm',
  glassy: 'bg-primary text-primary-foreground font-semibold shadow-sm',
};

const desktopInactiveClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'text-foreground/80 hover:bg-accent hover:text-foreground',
  glassy: 'text-muted-foreground hover:bg-accent hover:text-foreground',
};

const mobilePanelClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'fixed inset-x-0 top-14 z-30 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-border bg-background shadow-xl md:hidden',
  glassy: 'fixed inset-x-0 top-14 z-30 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-border/70 bg-background/95 shadow-xl backdrop-blur md:hidden',
};

const mobileLinkBaseClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'block rounded-lg border px-3 py-2.5 text-sm transition-colors',
  glassy: 'block rounded-lg border px-3 py-2.5 text-sm transition-colors',
};

const mobileActiveClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'border-primary bg-primary text-primary-foreground font-semibold shadow-sm',
  glassy: 'border-primary bg-primary text-primary-foreground font-semibold shadow-sm',
};

const mobileInactiveClassByStyle: Record<NavbarStyle, string> = {
  minimal: 'border-transparent bg-card text-foreground/80 hover:bg-accent hover:text-foreground',
  glassy: 'border-transparent bg-card/40 text-muted-foreground hover:bg-accent hover:text-accent-foreground',
};

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
  <header class="sticky top-0 z-30" :class="headerClassByStyle[navbarStyle]">
    <nav class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
      <RouterLink to="/" class="flex items-center transition-opacity hover:opacity-90" aria-label="Home">
        <img src="/logo.png" alt="Logo" class="h-7 w-auto sm:h-8" />
      </RouterLink>

      <ul :class="desktopNavClassByStyle[navbarStyle]">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            :to="item.to"
            :class="[
              desktopLinkClassByStyle[navbarStyle],
              isActive(item.to)
                ? desktopActiveClassByStyle[navbarStyle]
                : desktopInactiveClassByStyle[navbarStyle],
            ]"
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
          class="h-9 w-9 border-border/70 bg-card/60 md:hidden"
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
        class="fixed inset-0 z-20 bg-black/35 backdrop-blur-[1px] md:hidden"
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
      <div v-if="mobileOpen" :class="mobilePanelClassByStyle[navbarStyle]">
        <ul class="mx-auto max-w-6xl space-y-2 px-4 py-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <li v-for="item in navItems" :key="item.to">
            <RouterLink
              :to="item.to"
              :class="[
                mobileLinkBaseClassByStyle[navbarStyle],
                isActive(item.to)
                  ? mobileActiveClassByStyle[navbarStyle]
                  : mobileInactiveClassByStyle[navbarStyle],
              ]"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>
