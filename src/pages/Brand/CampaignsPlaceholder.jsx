export default function CampaignsPlaceholder() {
  return (
    <div className="form-card" style={{ textAlign: 'center', padding: '48px 32px', animation: 'cIn .35s var(--spring) both' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'var(--lime-tint)',
        border: '2.5px solid var(--lime)',
        color: 'var(--lime-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px'
      }}>
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>Campaigns</h2>
      <p style={{ fontSize: '14.5px', color: 'var(--muted)', margin: '0 auto 16px', maxWidth: '320px', lineHeight: 1.5 }}>
        Creating new campaigns, managing collaborations, and tracking creator applications will be available soon.
      </p>
      <span className="cta-badge" style={{ background: 'var(--lime-tint)', color: 'var(--lime-dark)', borderColor: 'var(--lime)' }}>Coming Soon</span>
    </div>
  );
}
