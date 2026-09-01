import api from './api.js';

export const creatorService = {
  getCreatorProfile: async () => {
    const response = await api.get('/creator/profile');
    return response.data;
  },

  getCreators: async () => {
    const response = await api.get('/creators');
    return response.data;
  },

  onboardCreator: async (onboardingData) => {
    const response = await api.post('/creator/onboarding', onboardingData);
    return response.data;
  },

  updateCreatorProfile: async (profileData) => {
    const response = await api.put('/creator/profile', profileData);
    return response.data;
  },
};
