import { Link } from 'react-router-dom';
import './BrandHome.css';

const Icon = ({ children, size = 30 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
const Megaphone = () => <Icon><path d="M4 14V9h3l9-4v13l-9-4H4Z"/><path d="m8 14 1 5"/><path d="M19 9a4 4 0 0 1 0 6"/></Icon>;
const People = () => <Icon><circle cx="9" cy="8" r="3"/><path d="M3 19c0-3.2 2.5-5 6-5s6 1.8 6 5"/><path d="M17 6a3 3 0 0 1 0 5"/><path d="M19 14c1.5.7 2 2.1 2 4"/></Icon>;
const Growth = () => <Icon><path d="M4 19v-5m5 5V9m5 10v-7m5 7V4"/><path d="m14 7 5-4 2 5"/></Icon>;

const steps = [
  ['01', 'CREATE', 'Launch Campaign', 'Set your goals.', Megaphone],
  ['02', 'DISCOVER', 'Find Creators', 'Find the right fit.', People],
  ['03', 'CONNECT', 'Build Together', 'Collaborate with ease.', () => <Icon><path d="m8 12 3 3a2.5 2.5 0 0 0 3.5 0l2.5-2.5"/><path d="m4 11 3-3 4 4 2-2 2 2"/><path d="m5 13-2-2 3-3"/></Icon>],
  ['04', 'GROW', 'Create Impact', 'Drive results together.', Growth],
];

export default function BrandHome() {
  return <div className="brand-home">
    <section className="brand-hero">
      <div className="brand-hero-copy">
        <span className="brand-kicker">FOR BRANDS <b>✦</b></span>
        <h1>Great campaigns<br/>start with the<br/><em>right creator.</em></h1>
        <p>Launch campaigns, discover creators and<br className="desktop-only"/> build real connections.</p>
        <div className="brand-hero-actions"><Link className="brand-primary" to="/brand/campaigns/new">Create Campaign <b>→</b></Link><Link className="brand-secondary" to="/brand/discover-creators">Explore Creators</Link></div>
      </div>
      <div className="brand-orbit-visual" aria-hidden="true">
        <i className="orbit orbit-one"/><i className="orbit orbit-two"/><i className="orbit orbit-three"/>
        <div className="orbit-dot d1"/><div className="orbit-dot d2"/><div className="orbit-dot d3"/>
        <div className="brand-p">P</div>
        <div className="float-card campaign"><span className="float-symbol">▷</span><div><strong>Campaign</strong><small>● Active</small></div></div>
        <div className="float-card creators"><People/><span>Creators</span></div>
        <div className="float-card brand"><Megaphone/><span>Brand</span></div>
        <div className="float-card match"><span className="profile-glyph">◯</span><div><strong>TechNova</strong><small>● Top Match</small></div></div>
        <div className="float-card growth"><Growth/><div><strong>Growth</strong><small>+42% Reach</small></div></div>
      </div>
    </section>
    <section className="brand-workflow">
      <header><span className="brand-kicker">HOW NEXUP WORKS <b>✦</b></span><h2>From idea to <em>impact.</em></h2><p>One simple flow. The right creators. Better collaborations.</p></header>
      <div className="workflow-path"/>
      <div className="workflow-grid">{steps.map(([number, label, title, desc, StepIcon], index) => <article key={number} className={`workflow-card step-${index + 1}`}><span className="workflow-icon"><StepIcon /></span><div><div className="step-label"><b>{number}</b><span>{label}</span></div><h3>{title}</h3><p>{desc}</p><i/></div></article>)}</div>
    </section>
    <footer className="brand-footer"><Link to="/brand" className="brand-footer-logo">Nex<em>Up</em></Link><p>Built for creators and the brands that believe in them.</p><Link to="/terms">Terms</Link></footer>
  </div>;
}
