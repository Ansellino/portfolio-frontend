import api from './axios';

export const blogApi = {
	getAll: (params?: any) => api.get('/blog', { params }),
	getBySlug: (slug: string) => api.get(`/blog/${slug}`),
	getAllAdmin: (params?: any) => api.get('/admin/blog', { params }),
	getById: (id: string) => api.get(`/admin/blog/${id}`),
	create: (dto: any) => api.post('/admin/blog', dto),
	update: (id: string, dto: any) => api.patch(`/admin/blog/${id}`, dto),
	togglePublish: (id: string, isPublished: boolean) => api.patch(`/admin/blog/${id}`, { isPublished }),
	delete: (id: string) => api.delete(`/admin/blog/${id}`),
};
