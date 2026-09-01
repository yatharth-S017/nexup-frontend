import api from './api.js';

export const campaignService = {
  // Creator campaign discovery endpoints. These deliberately share the existing
  // authenticated axios instance above instead of creating a second API client.
  async getPublishedCampaigns() {
    const response = await api.get('/campaigns');
    return response.data;
  },

  async getPublishedCampaignDetails(campaignId) {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data;
  },

  async applyToCampaign(campaignId, payload) {
    const response = await api.post(`/campaigns/${campaignId}/apply`, payload);
    return response.data;
  },

  async getCreatorApplications() {
    const response = await api.get('/creator/applications');
    return response.data;
  },

  async submitApplicationContent(applicationId, submissionUrl) {
    const response = await api.post(`/creator/applications/${applicationId}/submit`, { submissionUrl });
    return response.data;
  },

  async createCampaign(payload) {
    const response = await api.post('/brand/campaigns', payload);
    return response.data;
  },

  async getMyCampaigns() {
    const response = await api.get('/brand/campaigns');
    return response.data;
  },

  async getCampaignDetails(campaignId) {
    const response = await api.get(`/brand/campaigns/${campaignId}`);
    return response.data;
  },

  async updateCampaign(campaignId, payload) {
    const response = await api.patch(`/brand/campaigns/${campaignId}`, payload);
    return response.data;
  },

  async deleteCampaign(campaignId) {
    const response = await api.delete(`/brand/campaigns/${campaignId}`);
    return response.data;
  },

  async getCampaignApplications(campaignId) {
    const response = await api.get(`/brand/campaigns/${campaignId}/applications`);
    return response.data;
  },

  async getBrandApplicationDetails(applicationId) {
    const response = await api.get(`/brand/applications/${applicationId}`);
    return response.data;
  },

  async acceptApplication(applicationId) {
    const response = await api.patch(`/brand/applications/${applicationId}/accept`);
    return response.data;
  },

  async rejectApplication(applicationId) {
    const response = await api.patch(`/brand/applications/${applicationId}/reject`);
    return response.data;
  },

  async getCreatorAnalytics(creatorId) {
    const response = await api.get(`/creator/${creatorId}/analytics`);
    return response.data;
  },
};
