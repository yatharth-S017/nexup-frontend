import api from './api.js';

export const brandService = {
  getBrandProfile: async () => {
    const response = await api.get('/brand/profile');
    return response.data;
  },

  createBrandProfile: async (profileData) => {
    const response = await api.post('/brand/profile', profileData);
    return response.data;
  },

  updateBrandProfile: async (profileData) => {
    const response = await api.put('/brand/profile', profileData);
    return response.data;
  },

  getBrandById: async (brandId) => {
    const response = await api.get(`/brand/${brandId}`);
    return response.data;
  },
};
