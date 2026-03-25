import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api/axios';

const DUMMY_EMAIL = import.meta.env.VITE_ADMIN_DUMMY_EMAIL || 'admin@example.com';
const DUMMY_PASSWORD = import.meta.env.VITE_ADMIN_DUMMY_PASSWORD || 'admin12345';
const DUMMY_TOKEN_PREFIX = 'dummy-dev-token';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const admin = ref<any>(null);
  const isAuthenticated = computed(() => !!accessToken.value);
  const isDummySession = computed(() => !!accessToken.value?.startsWith(DUMMY_TOKEN_PREFIX));

  async function login(email: string, password: string) {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      accessToken.value = data.data.accessToken;
      admin.value = data.data.admin;
      return;
    } catch (error) {
      const canUseDummy = import.meta.env.DEV && email === DUMMY_EMAIL && password === DUMMY_PASSWORD;
      if (!canUseDummy) {
        throw error;
      }

      accessToken.value = `${DUMMY_TOKEN_PREFIX}-${Date.now()}`;
      admin.value = {
        email: DUMMY_EMAIL,
        name: 'Admin Dummy',
        role: 'admin',
      };
    }
  }

  async function refreshToken() {
    const { data } = await api.post('/auth/refresh');
    accessToken.value = data.data.accessToken;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {}
    accessToken.value = null;
    admin.value = null;
  }

  return {
    accessToken,
    admin,
    isAuthenticated,
    isDummySession,
    login,
    refreshToken,
    logout,
  };
});
