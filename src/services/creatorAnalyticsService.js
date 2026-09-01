import api from './api.js';

export const creatorAnalyticsService = {
  getCreatorAnalytics: async () => {
    const response = await api.get('/creator/analytics');
    return response.data;
  },

  refreshCreatorAnalytics: async () => {
    const response = await api.post('/creator/analytics/refresh');
    return response.data;
  },
};
