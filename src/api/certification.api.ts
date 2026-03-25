import api from './axios';

export const certificationsApi = {
  getAll: (params?: any) => api.get('/certifications', { params }),
  getAllAdmin: (params?: any) => api.get('/admin/certifications', { params }),
  getById: (id: string) => api.get(`/admin/certifications/${id}`),
  create: (dto: any) => api.post('/admin/certifications', dto),
  update: (id: string, dto: any) => api.patch(`/admin/certifications/${id}`, dto),
  togglePublish: (id: string, isPublished: boolean) => api.patch(`/admin/certifications/${id}`, { isPublished }),
  delete: (id: string) => api.delete(`/admin/certifications/${id}`),
};
