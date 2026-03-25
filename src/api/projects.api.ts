import api from './axios';

export const projectsApi = {
	getAll: (params?: any) => api.get('/projects', { params }),
	getBySlug: (slug: string) => api.get(`/projects/slug/${slug}`),
	getAllAdmin: (params?: any) => api.get('/admin/projects', { params }),
	getById: (id: string) => api.get(`/admin/projects/${id}`),
	create: (dto: any) => api.post('/admin/projects', dto),
	update: (id: string, dto: any) => api.patch(`/admin/projects/${id}`, dto),
	togglePublish: (id: string, isPublished: boolean) => api.patch(`/admin/projects/${id}`, { isPublished }),
	delete: (id: string) => api.delete(`/admin/projects/${id}`),
};
