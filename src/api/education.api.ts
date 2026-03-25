import api from './axios';

export const educationApi = {
  getAll: (params?: any) => api.get('/education', { params }),
  getAllAdmin: (params?: any) => api.get('/admin/education', { params }),
  getById: (id: string) => api.get(`/admin/education/${id}`),
  create: (dto: any) => api.post('/admin/education', dto),
  update: (id: string, dto: any) => api.patch(`/admin/education/${id}`, dto),
  togglePublish: (id: string, isPublished: boolean) => api.patch(`/admin/education/${id}`, { isPublished }),
  delete: (id: string) => api.delete(`/admin/education/${id}`),
};
