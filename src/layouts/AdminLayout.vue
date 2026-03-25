<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { LogOut, Menu, X } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import api from '@/api/axios';
import { isUsingMockData } from '@/mocks/mockBackend';
import { useAuthStore } from '@/stores/auth.store';

type NavItem = {
  label: string;
  to: string;
};

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const mobileOpen = ref(false);

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    mobileOpen.value = false;
  }
};

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Experiences', to: '/admin/experiences' },
  { label: 'Certifications', to: '/admin/certifications' },
  { label: 'Education', to: '/admin/education' },
  { label: 'Skills', to: '/admin/skills' },
  { label: 'Blog', to: '/admin/blog' },
  { label: 'Messages', to: '/admin/messages' },
  { label: 'Profile', to: '/admin/profile' },
  { label: 'Resume Preview', to: '/admin/resume/preview' },
];

const breadcrumbLabelByPath = new Map(navItems.map((item) => [item.to, item.label]));

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

const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean);
  const crumbs: Array<{ label: string; to?: string }> = [{ label: 'Admin', to: '/admin/dashboard' }];

  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    if (!currentPath.startsWith('/admin')) continue;

    if (currentPath === '/admin') {
      continue;
    }

    const label =
      (route.matched.find((m) => m.path === currentPath)?.meta?.breadcrumb as string | undefined) ||
      breadcrumbLabelByPath.get(currentPath) ||
      part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const isCurrent = currentPath === route.path;
    crumbs.push({ label, to: isCurrent ? undefined : currentPath });
  }

  return crumbs;
});

const pageTitle = computed(() => breadcrumbs.value[breadcrumbs.value.length - 1]?.label ?? 'Dashboard');

const adminName = computed(() => {
  const current = auth.admin;
  return current?.name || current?.fullName || current?.email || 'Admin User';
});

const unreadMessages = useQuery({
  queryKey: ['admin', 'messages', 'unread-count'],
  enabled: computed(() => auth.isAuthenticated),
  staleTime: 60_000,
  retry: 0,
  queryFn: async () => {
    const { data } = await api.get('/admin/messages', { params: { isRead: false, page: 1, limit: 1 } });
    const payload = data?.data ?? data;

    if (typeof data?.unreadCount === 'number') return data.unreadCount;
    if (typeof payload?.unreadCount === 'number') return payload.unreadCount;
    if (typeof payload?.totalUnread === 'number') return payload.totalUnread;
    if (typeof payload?.total === 'number') return payload.total;
    if (Array.isArray(payload?.items)) return payload.items.filter((item: { isRead?: boolean }) => !item.isRead).length;
    if (Array.isArray(payload)) return payload.filter((item: { isRead?: boolean }) => !item.isRead).length;

    return 0;
  },
});

const unreadCount = computed(() => unreadMessages.data.value ?? 0);

async function handleLogout() {
  await auth.logout();
  await router.push('/admin/login');
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      @click="mobileOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card transition-transform duration-200 lg:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="border-b px-6 py-6">
        <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin Panel</p>
        <h1 class="mt-2 text-lg font-semibold">Portfolio CMS</h1>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto p-4">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="route.path.startsWith(item.to)
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'"
        >
          <span>{{ item.label }}</span>
          <span
            v-if="item.label === 'Messages' && unreadCount > 0"
            class="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white"
          >
            {{ unreadCount }}
          </span>
        </RouterLink>
      </nav>

      <footer class="border-t p-4">
        <p class="truncate text-sm font-medium">{{ adminName }}</p>
        <Button class="mt-3 w-full justify-start" variant="outline" @click="handleLogout">
          <LogOut class="mr-2 h-4 w-4" />
          Logout
        </Button>
      </footer>
    </aside>

    <div class="lg:pl-72">
      <header class="sticky top-0 z-20 border-b bg-background/90 px-6 py-4 backdrop-blur">
        <div class="mb-3 flex items-center justify-between lg:mb-0">
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background lg:hidden"
            @click="mobileOpen = !mobileOpen"
            aria-label="Toggle sidebar"
          >
            <Menu v-if="!mobileOpen" class="h-5 w-5" />
            <X v-else class="h-5 w-5" />
          </button>
        </div>
        <nav class="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <template v-for="(crumb, idx) in breadcrumbs" :key="`${crumb.label}-${idx}`">
            <RouterLink v-if="crumb.to" :to="crumb.to" class="hover:text-foreground">
              {{ crumb.label }}
            </RouterLink>
            <span v-else class="text-foreground">{{ crumb.label }}</span>
            <span v-if="idx < breadcrumbs.length - 1">/</span>
          </template>
        </nav>
        <h2 class="text-2xl font-semibold tracking-tight">{{ pageTitle }}</h2>
        <p
          v-if="isUsingMockData"
          class="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
        >
          Using Dummy Data
        </p>
      </header>

      <main class="p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
