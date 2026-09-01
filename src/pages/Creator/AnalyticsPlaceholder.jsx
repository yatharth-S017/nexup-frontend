export default function AnalyticsPlaceholder() {
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>Analytics</h2>
      <p style={{ fontSize: '14.5px', color: 'var(--muted)', margin: '0 auto 16px', maxWidth: '320px', lineHeight: 1.5 }}>
        Detailed insights on your channel growth, reach, engagement rates, and campaigns are coming soon.
      </p>
      <span className="cta-badge" style={{ background: 'var(--lime-tint)', color: 'var(--lime-dark)', borderColor: 'var(--lime)' }}>Coming Soon</span>
    </div>
  );
}
