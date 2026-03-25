import api from './axios';

export const skillsApi = {
  getAll: (params?: any) => api.get('/skills', { params }),
  getAllAdmin: (params?: any) => api.get('/admin/skills', { params }),
  getById: (id: string) => api.get(`/admin/skills/${id}`),
  create: (dto: any) => api.post('/admin/skills', dto),
  update: (id: string, dto: any) => api.patch(`/admin/skills/${id}`, dto),
  togglePublish: (id: string, isPublished: boolean) => api.patch(`/admin/skills/${id}`, { isPublished }),
  delete: (id: string) => api.delete(`/admin/skills/${id}`),
};
