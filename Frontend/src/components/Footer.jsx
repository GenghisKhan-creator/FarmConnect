import { Link } from 'react-router-dom';
import { Sprout, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--slate-900)',
      color: 'var(--slate-300)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ padding: '3rem 1.25rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <img src={logoImg} alt="FarmConnect Logo" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8 }} />
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.125rem', color: '#fff' }}>
                Farm<span style={{ color: 'var(--green-400)' }}>Connect</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--slate-400)', maxWidth: '28ch' }}>
              Connecting farmers in Ghana's Upper West Region directly to buyers. No middlemen. Better prices.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <SocialIcon icon={<Facebook size={16} />} />
              <SocialIcon icon={<Twitter size={16} />} />
              <SocialIcon icon={<Instagram size={16} />} />
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <FooterLink to="/marketplace">Marketplace</FooterLink>
              <FooterLink to="/subscription">Pricing</FooterLink>
              <FooterLink to="/register?role=farmer">List Products</FooterLink>
              <FooterLink to="/register?role=buyer">Buy Products</FooterLink>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <FooterLink to="/support?tab=how">How it works</FooterLink>
              <FooterLink to="/support?tab=faq">FAQs</FooterLink>
              <FooterLink to="/support?tab=farmer">Farmer Guide</FooterLink>
              <FooterLink to="/support?tab=buyer">Buyer Guide</FooterLink>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <ContactItem icon={<MapPin size={14} />}>Tumu, Upper West Region, Ghana</ContactItem>
              <ContactItem icon={<Phone size={14} />}>+233 244 123 456</ContactItem>
              <ContactItem icon={<Mail size={14} />}>hello@farmconnect.gh</ContactItem>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--slate-700)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <p style={{ fontSize: '0.8375rem', color: 'var(--slate-500)' }}>
            © 2026 FarmConnect GH. Made with ❤️ for Ghana's farmers.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Use</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} style={{ fontSize: '0.875rem', color: 'var(--slate-400)', transition: 'color 0.15s' }}
      onMouseEnter={e => e.target.style.color = 'var(--green-400)'}
      onMouseLeave={e => e.target.style.color = 'var(--slate-400)'}
    >
      {children}
    </Link>
  );
}

function ContactItem({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--slate-400)' }}>
      <span style={{ marginTop: 2, color: 'var(--green-500)', flexShrink: 0 }}>{icon}</span>
      {children}
    </div>
  );
}

function SocialIcon({ icon }) {
  return (
    <button style={{
      width: 34, height: 34, borderRadius: 8,
      background: 'var(--slate-800)',
      border: '1px solid var(--slate-700)',
      color: 'var(--slate-400)',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'var(--transition)',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-900)'; e.currentTarget.style.color = 'var(--green-400)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--slate-800)'; e.currentTarget.style.color = 'var(--slate-400)'; }}
    >
      {icon}
    </button>
  );
}
