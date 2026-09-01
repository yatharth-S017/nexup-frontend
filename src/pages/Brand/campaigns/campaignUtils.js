export const CAMPAIGN_PLATFORMS = ['Instagram', 'YouTube', 'LinkedIn', 'X', 'Facebook', 'Blog'];

export function normalizeCampaign(campaign = {}) {
  return {
    ...campaign,
    platforms: Array.isArray(campaign.platforms) ? campaign.platforms : [],
    attachmentUrls: Array.isArray(campaign.attachmentUrls) ? campaign.attachmentUrls : [],
  };
}

export function campaignStatusLabel(status) {
  if (!status) return 'Draft';
  return String(status).replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function campaignStatusClass(status) {
  return `campaign-status status-${String(status || 'draft').toLowerCase()}`;
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function toDateInputValue(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

export function getCampaignStats(campaigns) {
  return campaigns.reduce(
    (stats, campaign) => {
      const status = String(campaign.status || '').toUpperCase();
      stats.total += 1;
      if (status === 'PUBLISHED' || status === 'ACTIVE') stats.published += 1;
      if (status === 'COMPLETED') stats.completed += 1;
      if (status === 'CLOSED') stats.closed += 1;
      return stats;
    },
    { total: 0, published: 0, completed: 0, closed: 0 },
  );
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}
