import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { brandService } from '../../services/brandService.js';
import { NotificationContext } from '../../context/NotificationContext.jsx';

const INDUSTRIES = [
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'GAMING', label: 'Gaming' },
  { value: 'LIFESTYLE', label: 'Lifestyle' },
  { value: 'FASHION', label: 'Fashion' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'FOOD', label: 'Food' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'OTHER', label: 'Other' },
];

const COMPANY_SIZES = [
  { value: 'STARTUP', label: 'Startup (1-10)' },
  { value: 'SMALL', label: 'Small (11-50)' },
  { value: 'MEDIUM', label: 'Medium (51-200)' },
  { value: 'LARGE', label: 'Large (201-1000)' },
  { value: 'ENTERPRISE', label: 'Enterprise (1000+)' },
];

export default function BrandOnboarding() {
  const { updateBrandProfile } = useAuth();
  const { notify } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!website.trim()) {
      newErrors.website = 'Website URL is required';
    } else if (!/^https?:\/\/\S+\.\S+/.test(website.trim())) {
      newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
    }
    if (!industry) newErrors.industry = 'Industry selection is required';
    if (!companySize) newErrors.companySize = 'Company size selection is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        companyName: companyName.trim(),
        website: website.trim(),
        industry,
        companySize,
        city: city.trim(),
        state: state.trim(),
        description: description.trim(),
      };
      const saved = await brandService.createBrandProfile(payload);
      updateBrandProfile(saved);
      notify({ message: 'Brand profile completed successfully!', type: 'success' });
      navigate('/brand');
    } catch (err) {
      console.error(err);
      notify({ message: err.response?.data?.message || 'Failed to submit profile details.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stage" style={{ minHeight: 'calc(100vh - 64px)', justifyContent: 'flex-start', padding: '40px 16px' }}>
      {/* Background Blobs */}
      <div className="bg-wrap">
        <div className="bg-blob bb1"></div>
        <div className="bg-blob bb2"></div>
        <div className="bg-blob bb3"></div>
      </div>

      <div className="card-wrap" style={{ width: '100%', maxWidth: '600px', zIndex: 2 }}>
        <div className="form-card" style={{ animation: 'cIn .45s var(--spring) both' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="cta-badge" style={{ marginBottom: '8px' }}>onboarding</span>
            <h2 style={{ fontSize: '26px', fontWeight: 500, color: 'var(--ink)' }}>Complete Brand Profile</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--muted)' }}>Tell us about your brand to start matching with creators</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                type="text"
                className={`f-input ${errors.companyName ? 'err' : ''}`}
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
              />
              {errors.companyName && <span className="err-msg">{errors.companyName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="website">Website URL</label>
              <input
                id="website"
                type="text"
                className={`f-input ${errors.website ? 'err' : ''}`}
                placeholder="https://acme.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={loading}
              />
              {errors.website && <span className="err-msg">{errors.website}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="industry">Industry</label>
                <select
                  id="industry"
                  className="f-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
                {errors.industry && <span className="err-msg">{errors.industry}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="companySize">Company Size</label>
                <select
                  id="companySize"
                  className="f-select"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZES.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
                {errors.companySize && <span className="err-msg">{errors.companySize}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  className={`f-input ${errors.city ? 'err' : ''}`}
                  placeholder="Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={loading}
                />
                {errors.city && <span className="err-msg">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="state">State</label>
                <input
                  id="state"
                  type="text"
                  className={`f-input ${errors.state ? 'err' : ''}`}
                  placeholder="Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={loading}
                />
                {errors.state && <span className="err-msg">{errors.state}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">About Your Brand</label>
              <textarea
                id="description"
                className={`f-textarea ${errors.description ? 'err' : ''}`}
                placeholder="What is your brand's mission and what creators are you looking for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                style={{ minHeight: '100px' }}
              />
              {errors.description && <span className="err-msg">{errors.description}</span>}
            </div>

            <button type="submit" className="btn-send" disabled={loading} style={{ marginTop: '16px' }}>
              {loading ? <div className="spin"></div> : <span>Complete Registration</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
