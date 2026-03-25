import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';
import { getMockResponseData, markRealBackendConnected, shouldUseMockFallback } from '@/mocks/mockBackend';

type RetryableConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
});

// Attach access token
api.interceptors.request.use((config) => {
	const auth = useAuthStore();
	if (auth.accessToken) {
		config.headers.Authorization = `Bearer ${auth.accessToken}`;
	}
	return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
	(res) => {
		markRealBackendConnected();
		return res;
	},
	async (error) => {
		const auth = useAuthStore();
		const config = error.config as RetryableConfig | undefined;

		if (error.response?.status === 401 && config && !config._retry) {
			if (auth.isDummySession) {
				return Promise.reject(error);
			}

			config._retry = true;
			try {
				await auth.refreshToken();
				config.headers = config.headers ?? {};
				config.headers.Authorization = `Bearer ${auth.accessToken}`;
				return api(config);
			} catch {
				auth.logout();
				window.location.href = '/admin/login';
			}
		}

		if (config && shouldUseMockFallback(error)) {
			const mockData = getMockResponseData(config);
			if (mockData !== undefined) {
				return Promise.resolve({
					data: mockData,
					status: 200,
					statusText: 'OK',
					headers: {},
					config,
				});
			}
		}

		return Promise.reject(error);
	}
);

export default api;
