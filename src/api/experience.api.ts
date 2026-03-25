import api from './axios';

export const experiencesApi = {
	getAll: (params?: any) => api.get('/experiences', { params }),
	getAllAdmin: (params?: any) => api.get('/admin/experiences', { params }),
	getById: (id: string) => api.get(`/admin/experiences/${id}`),
	create: (dto: any) => api.post('/admin/experiences', dto),
	update: (id: string, dto: any) => api.patch(`/admin/experiences/${id}`, dto),
	togglePublish: (id: string, isPublished: boolean) => api.patch(`/admin/experiences/${id}`, { isPublished }),
	delete: (id: string) => api.delete(`/admin/experiences/${id}`),
};
