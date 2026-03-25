import api from './axios';

export const contactApi = {
  sendMessage: (dto: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => api.post('/contact', dto),
};
