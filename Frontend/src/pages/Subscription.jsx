import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Award, BarChart3, Star, Infinity, Eye } from 'lucide-react';

import mtnImg from '../assets/mtn.jpg';
import telecashImg from '../assets/telecash.jpg';
import airteltigoImg from '../assets/airteltigo.jpg';
import paystackImg from '../assets/paystack.jpg';
import flutterwaveImg from '../assets/flutterwave.jpg';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: '',
    badge: null,
    color: 'var(--slate-600)',
    bgColor: 'var(--bg)',
    features: [
      { text: 'Up to 3 product listings', included: true },
      { text: 'Basic farmer profile', included: true },
      { text: 'Messaging with buyers', included: true },
      { text: 'Basic search visibility', included: true },
      { text: 'Priority listing placement', included: false },
      { text: 'Unlimited listings', included: false },
      { text: 'Verified badge', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Featured homepage listing', included: false },
    ],
    cta: 'Get Started Free',
    ctaStyle: 'btn-secondary',
    to: '/register',
  },
  {
    name: 'Premium',
    price: 35,
    period: '/month',
    badge: 'Most Popular',
    color: 'var(--green-600)',
    bgColor: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
    features: [
      { text: 'Unlimited product listings', included: true },
      { text: 'Full farmer profile', included: true },
      { text: 'Messaging with buyers', included: true },
      { text: 'Priority search placement', included: true },
      { text: 'Priority listing placement', included: true },
      { text: 'Verified badge ✓', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Featured homepage listing', included: true },
      { text: 'Dedicated support', included: true },
    ],
    cta: 'Start Premium',
    ctaStyle: 'btn-primary',
    to: '/register',
  },
  {
    name: 'Cooperative',
    price: 120,
    period: '/month',
    badge: 'For Groups',
    color: '#8b5cf6',
    bgColor: 'var(--bg)',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Up to 20 farmer accounts', included: true },
      { text: 'Cooperative profile page', included: true },
      { text: 'Bulk listing tools', included: true },
      { text: 'Priority search placement', included: true },
      { text: 'Verified badge for all members', included: true },
      { text: 'Shared analytics', included: true },
      { text: 'Featured homepage banner', included: true },
      { text: 'WhatsApp group support', included: true },
    ],
    cta: 'Contact Us',
    ctaStyle: 'btn-outline',
    to: '#',
  },
];

const PAYMENT_METHODS = [
  { name: 'MTN MoMo', color: '#ffcc00', image: mtnImg },
  { name: 'TeleCash', color: '#e60000', image: telecashImg },
  { name: 'AirtelTigo', color: '#ff6600', image: airteltigoImg },
  { name: 'Paystack', color: '#00C3F7', image: paystackImg },
  { name: 'Flutterwave', color: '#F5A623', image: flutterwaveImg },
];

export default function Subscription() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '4rem 0 3rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--green-900), var(--green-700))' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999, padding: '0.375rem 1rem', marginBottom: '1.5rem', color: '#86efac', fontSize: '0.875rem', fontWeight: 600 }}>
            <Award size={16} /> Simple, Fair Pricing
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '0.875rem' }}>
            Plans for Every Farmer
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: '50ch', margin: '0 auto' }}>
            Start free and upgrade when you're ready. All plans support MoMo payments.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
            {PLANS.map(plan => (
              <div
                key={plan.name}
                style={{
                  borderRadius: 'var(--radius-xl)',
                  background: plan.bgColor,
                  border: `2px solid ${plan.name === 'Premium' ? 'var(--green-400)' : 'var(--border)'}`,
                  padding: '2rem',
                  position: 'relative',
                  boxShadow: plan.name === 'Premium' ? '0 8px 32px rgba(34,197,94,.2)' : 'var(--shadow-sm)',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = plan.name === 'Premium' ? '0 8px 32px rgba(34,197,94,.2)' : 'var(--shadow-sm)'; }}
              >
                {plan.badge && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: 999 }}>
                    {plan.badge}
                  </div>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: plan.color, marginBottom: '0.375rem' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  {plan.price === 0 ? (
                    <span style={{ fontSize: '2.25rem', fontWeight: 900 }}>Free</span>
                  ) : (
                    <>
                      <span style={{ fontSize: '1rem', color: 'var(--slate-500)', marginTop: 8 }}>GHS</span>
                      <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{plan.price}</span>
                      <span style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>{plan.period}</span>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
                  {plan.features.map(f => (
                    <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', opacity: f.included ? 1 : 0.4 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: f.included ? `${plan.color}18` : 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {f.included
                          ? <Check size={12} color={plan.color} strokeWidth={3} />
                          : <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>✕</span>
                        }
                      </div>
                      <span style={{ fontSize: '0.875rem', color: f.included ? 'var(--slate-700)' : 'var(--slate-400)' }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                <Link to={plan.to} className={`btn ${plan.ctaStyle}`} style={{ width: '100%', justifyContent: 'center' }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment methods */}
      <section style={{ padding: '3rem 0', background: 'var(--surface)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.75rem' }}>Accepted Payment Methods</h2>
          <p style={{ color: 'var(--slate-500)', marginBottom: '2rem', fontSize: '0.9rem' }}>Pay with Mobile Money or card – fully supported in Ghana</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {PAYMENT_METHODS.map(pm => (
              <div key={pm.name} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.5rem',
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 700, fontSize: '1rem',
              }}>
                <img src={pm.image} alt={pm.name} style={{ width: 64, height: 40, objectFit: 'contain', borderRadius: 4 }} />
                {pm.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '3rem 0', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.75rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
          {[
            { q: 'Can I cancel my subscription anytime?', a: 'Yes! You can cancel at any time. Your plan will remain active until the end of the current billing period.' },
            { q: 'How do I pay with Mobile Money?', a: 'After selecting your plan, you\'ll be redirected to our payment page where you can choose MTN MoMo, Vodafone Cash, or AirtelTigo.' },
            { q: 'What happens to my listings if I downgrade?', a: 'Your listings remain visible. If you have more than 3 listings on Free plan, older listings will be hidden until you upgrade again.' },
            { q: 'Is the Free plan really free?', a: 'Yes! Create up to 3 product listings for free, forever. No credit card required to sign up.' },
          ].map(faq => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginBottom: '0.875rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{ width: '100%', padding: '1.125rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}
      >
        {q}
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', fontSize: '1.25rem', color: 'var(--slate-400)' }}>⌄</span>
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1.125rem', background: 'var(--surface)', fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.7, animation: 'fadeIn 0.2s ease' }}>
          {a}
        </div>
      )}
    </div>
  );
}

