import api from './axios';

export const profileApi = {
  getPublic: () => api.get('/profile'),
};
