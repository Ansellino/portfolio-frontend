import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/axios';

const DUMMY_EMAIL = import.meta.env.VITE_ADMIN_DUMMY_EMAIL || 'admin@example.com';
const DUMMY_PASSWORD = import.meta.env.VITE_ADMIN_DUMMY_PASSWORD || 'admin12345';
const DUMMY_TOKEN_PREFIX = 'dummy-dev-token';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const refreshTokenValue = ref<string | null>(null);
  const admin = ref<any>(null);
  const isAuthenticated = computed(() => !!accessToken.value);
  const isDummySession = computed(() => !!accessToken.value?.startsWith(DUMMY_TOKEN_PREFIX));

  function unwrapPayload<T = any>(raw: any): T {
    return (raw?.data ?? raw) as T;
  }

  async function login(email: string, password: string) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const payload = unwrapPayload<{ accessToken?: string; refreshToken?: string; admin?: any }>(data);
      accessToken.value = payload.accessToken ?? null;
      refreshTokenValue.value = payload.refreshToken ?? null;

      try {
        const me = await api.get('/auth/me');
        const mePayload = unwrapPayload(me.data);
        admin.value = mePayload;
      } catch {
        admin.value = payload.admin ?? (payload.accessToken ? { email } : null);
      }
      return;
    } catch (error) {
      const canUseDummy = import.meta.env.DEV && email === DUMMY_EMAIL && password === DUMMY_PASSWORD;
      if (!canUseDummy) {
        throw error;
      }

      accessToken.value = `${DUMMY_TOKEN_PREFIX}-${Date.now()}`;
      refreshTokenValue.value = null;
      admin.value = {
        email: DUMMY_EMAIL,
        name: 'Admin Dummy',
        role: 'admin',
      };
    }
  }

  async function refreshToken() {
    const headers = refreshTokenValue.value
      ? { 'x-refresh-token': refreshTokenValue.value }
      : undefined;
    const { data } = await api.post('/auth/refresh', undefined, { headers });
    const payload = unwrapPayload<{ accessToken?: string; refreshToken?: string }>(data);
    accessToken.value = payload.accessToken ?? null;
    if (payload.refreshToken) {
      refreshTokenValue.value = payload.refreshToken;
    }
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {}
    accessToken.value = null;
    refreshTokenValue.value = null;
    admin.value = null;
  }

  return {
    accessToken,
    refreshTokenValue,
    admin,
    isAuthenticated,
    isDummySession,
    login,
    refreshToken,
    logout,
  };
});
