import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../../../services/campaignService.js';
import { CAMPAIGN_PLATFORMS, getErrorMessage, normalizeCampaign, toDateInputValue } from './campaignUtils.js';

const emptyForm = {
  title: '',
  description: '',
  requirements: '',
  platforms: [],
  totalBudget: '',
  payoutPerCreator: '',
  requiredCreators: '',
  applicationDeadline: '',
  submissionDeadline: '',
  attachmentUrls: [''],
};

function buildInitialValues(campaign) {
  if (!campaign) return emptyForm;
  const normalized = normalizeCampaign(campaign);
  return {
    title: normalized.title || '',
    description: normalized.description || '',
    requirements: normalized.requirements || '',
    platforms: normalized.platforms,
    totalBudget: normalized.totalBudget ?? '',
    payoutPerCreator: normalized.payoutPerCreator ?? '',
    requiredCreators: normalized.requiredCreators ?? '',
    applicationDeadline: toDateInputValue(normalized.applicationDeadline),
    submissionDeadline: toDateInputValue(normalized.submissionDeadline),
    attachmentUrls: normalized.attachmentUrls.length ? normalized.attachmentUrls : [''],
  };
}

export default function CampaignForm({ campaign, mode = 'create', onSaved, notify }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => buildInitialValues(campaign));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEdit = mode === 'edit';

  const selectedPlatforms = useMemo(() => new Set(form.platforms), [form.platforms]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const togglePlatform = (platform) => {
    setForm((current) => {
      const exists = current.platforms.includes(platform);
      return {
        ...current,
        platforms: exists ? current.platforms.filter((item) => item !== platform) : [...current.platforms, platform],
      };
    });
    setErrors((current) => ({ ...current, platforms: '' }));
  };

  const updateAttachment = (index, value) => {
    setForm((current) => ({
      ...current,
      attachmentUrls: current.attachmentUrls.map((url, itemIndex) => (itemIndex === index ? value : url)),
    }));
  };

  const addAttachment = () => {
    setForm((current) => ({ ...current, attachmentUrls: [...current.attachmentUrls, ''] }));
  };

  const removeAttachment = (index) => {
    setForm((current) => ({
      ...current,
      attachmentUrls: current.attachmentUrls.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Campaign title is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    if (!form.requirements.trim()) nextErrors.requirements = 'Requirements are required.';
    if (!form.platforms.length) nextErrors.platforms = 'Select at least one platform.';
    if (!Number(form.totalBudget) || Number(form.totalBudget) <= 0) nextErrors.totalBudget = 'Enter a valid total budget.';
    if (!Number(form.payoutPerCreator) || Number(form.payoutPerCreator) <= 0) nextErrors.payoutPerCreator = 'Enter a valid payout.';
    if (!Number.isInteger(Number(form.requiredCreators)) || Number(form.requiredCreators) <= 0) nextErrors.requiredCreators = 'Enter required creators.';
    if (!form.applicationDeadline) nextErrors.applicationDeadline = 'Application deadline is required.';
    if (!form.submissionDeadline) nextErrors.submissionDeadline = 'Submission deadline is required.';
    if (form.applicationDeadline && form.submissionDeadline && form.submissionDeadline < form.applicationDeadline) {
      nextErrors.submissionDeadline = 'Submission deadline must be after application deadline.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    requirements: form.requirements.trim(),
    platforms: form.platforms,
    totalBudget: Number(form.totalBudget),
    payoutPerCreator: Number(form.payoutPerCreator),
    requiredCreators: Number(form.requiredCreators),
    applicationDeadline: form.applicationDeadline,
    submissionDeadline: form.submissionDeadline,
    attachmentUrls: form.attachmentUrls.map((url) => url.trim()).filter(Boolean),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const saved = isEdit
        ? await campaignService.updateCampaign(campaign.id, buildPayload())
        : await campaignService.createCampaign(buildPayload());
      notify?.({ message: isEdit ? 'Campaign updated.' : 'Campaign created.', type: 'success' });
      onSaved?.(saved);
    } catch (error) {
      notify?.({ message: getErrorMessage(error, isEdit ? 'Unable to update campaign.' : 'Unable to create campaign.'), type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="campaign-form" onSubmit={handleSubmit}>
      <section className="campaign-section-card">
        <h2>Basic Information</h2>
        <label className="brand-edit-field">
          <span>Title</span>
          <input className={`f-input ${errors.title ? 'err' : ''}`} value={form.title} onChange={(event) => updateField('title', event.target.value)} />
          {errors.title ? <small className="err-msg">{errors.title}</small> : null}
        </label>
        <label className="brand-edit-field">
          <span>Description</span>
          <textarea className={`f-textarea ${errors.description ? 'err' : ''}`} value={form.description} onChange={(event) => updateField('description', event.target.value)} />
          {errors.description ? <small className="err-msg">{errors.description}</small> : null}
        </label>
        <label className="brand-edit-field">
          <span>Requirements</span>
          <textarea className={`f-textarea ${errors.requirements ? 'err' : ''}`} value={form.requirements} onChange={(event) => updateField('requirements', event.target.value)} />
          {errors.requirements ? <small className="err-msg">{errors.requirements}</small> : null}
        </label>
      </section>

      <section className="campaign-section-card">
        <h2>Platforms</h2>
        <div className="campaign-platform-grid">
          {CAMPAIGN_PLATFORMS.map((platform) => (
            <button
              className={`campaign-platform ${selectedPlatforms.has(platform) ? 'selected' : ''}`}
              key={platform}
              type="button"
              onClick={() => togglePlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
        {errors.platforms ? <small className="err-msg">{errors.platforms}</small> : null}
      </section>

      <section className="campaign-section-card">
        <h2>Budget Information</h2>
        <div className="campaign-form-grid">
          <label className="brand-edit-field">
            <span>Total Budget</span>
            <input className={`f-input ${errors.totalBudget ? 'err' : ''}`} type="number" min="1" value={form.totalBudget} onChange={(event) => updateField('totalBudget', event.target.value)} />
            {errors.totalBudget ? <small className="err-msg">{errors.totalBudget}</small> : null}
          </label>
          <label className="brand-edit-field">
            <span>Payout Per Creator</span>
            <input className={`f-input ${errors.payoutPerCreator ? 'err' : ''}`} type="number" min="1" value={form.payoutPerCreator} onChange={(event) => updateField('payoutPerCreator', event.target.value)} />
            {errors.payoutPerCreator ? <small className="err-msg">{errors.payoutPerCreator}</small> : null}
          </label>
          <label className="brand-edit-field">
            <span>Required Creators</span>
            <input className={`f-input ${errors.requiredCreators ? 'err' : ''}`} type="number" min="1" value={form.requiredCreators} onChange={(event) => updateField('requiredCreators', event.target.value)} />
            {errors.requiredCreators ? <small className="err-msg">{errors.requiredCreators}</small> : null}
          </label>
        </div>
      </section>

      <section className="campaign-section-card">
        <h2>Timeline</h2>
        <div className="campaign-form-grid">
          <label className="brand-edit-field">
            <span>Application Deadline</span>
            <input className={`f-input ${errors.applicationDeadline ? 'err' : ''}`} type="date" value={form.applicationDeadline} onChange={(event) => updateField('applicationDeadline', event.target.value)} />
            {errors.applicationDeadline ? <small className="err-msg">{errors.applicationDeadline}</small> : null}
          </label>
          <label className="brand-edit-field">
            <span>Submission Deadline</span>
            <input className={`f-input ${errors.submissionDeadline ? 'err' : ''}`} type="date" value={form.submissionDeadline} onChange={(event) => updateField('submissionDeadline', event.target.value)} />
            {errors.submissionDeadline ? <small className="err-msg">{errors.submissionDeadline}</small> : null}
          </label>
        </div>
      </section>

      <section className="campaign-section-card">
        <div className="campaign-section-heading">
          <h2>Attachment URLs</h2>
          <button className="btn-back" type="button" onClick={addAttachment}>Add URL</button>
        </div>
        <div className="campaign-attachments-editor">
          {form.attachmentUrls.map((url, index) => (
            <div className="campaign-attachment-row" key={`attachment-${index}`}>
              <input className="f-input" value={url} onChange={(event) => updateAttachment(index, event.target.value)} placeholder="https://..." />
              {form.attachmentUrls.length > 1 ? <button className="btn-back" type="button" onClick={() => removeAttachment(index)}>Remove</button> : null}
            </div>
          ))}
        </div>
      </section>

      <div className="sticky-action-bar">
        <button className="btn-back" type="button" onClick={() => navigate('/brand/campaigns')}>Cancel</button>
        <button className="btn-send campaign-submit" type="submit" disabled={submitting}>
          {submitting ? <><span className="spin" /> {isEdit ? 'Saving...' : 'Creating...'}</> : isEdit ? 'Save Changes' : 'Create Campaign'}
        </button>
      </div>
    </form>
  );
}
