import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sprout, ArrowRight, Search, Shield, Zap, TrendingUp,
  Users, Package, CheckCircle, Star, MapPin, ChevronRight,
  Wheat, Truck, PhoneCall, Award,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { products, categories } = useData();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Hero animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 0.6, delay: 0.1 });
      gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.7, delay: 0.25 });
      gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.6, delay: 0.45 });
      gsap.from('.hero-btns', { opacity: 0, y: 20, duration: 0.6, delay: 0.6 });
      gsap.from('.hero-search', { opacity: 0, y: 20, duration: 0.6, delay: 0.75 });
      gsap.from('.hero-stat', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, delay: 0.9 });

      // Floating leaves
      gsap.to('.leaf-1', { y: -12, rotation: 8, duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut' });
      gsap.to('.leaf-2', { y: 10, rotation: -6, duration: 4, repeat: -1, yoyo: true, ease: 'power1.inOut' });

      // Stats counter scroll
      gsap.from('.stat-value-anim', {
        textContent: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
        snap: { textContent: 1 },
        stagger: 0.15,
      });

      // Feature cards
      gsap.from('.feature-card', {
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.12,
        scrollTrigger: { trigger: '.features-section', start: 'top 75%' },
      });

      // Product cards
      gsap.from('.product-anim', {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.08,
        scrollTrigger: { trigger: '.products-section', start: 'top 80%' },
      });

    }, heroRef);
    return () => ctx.revert();
  }, []);

  const featuredProducts = products.filter(p => p.premium && p.status === 'available').slice(0, 4);
  const recentProducts = products.filter(p => p.status === 'available').slice(0, 4);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/marketplace?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div ref={heroRef}>
      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0a1f0e 0%, #14532d 50%, #166534 100%)',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 0',
      }}>
        {/* Decorative elements */}
        <div className="leaf-1" style={{ position: 'absolute', top: '15%', right: '8%', fontSize: '5rem', opacity: 0.12, userSelect: 'none' }}>🌿</div>
        <div className="leaf-2" style={{ position: 'absolute', bottom: '20%', left: '5%', fontSize: '6rem', opacity: 0.08, userSelect: 'none' }}>🌾</div>
        <div style={{ position: 'absolute', top: '30%', right: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div className="hero-badge" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 999,
              padding: '0.375rem 1rem',
              marginBottom: '1.5rem',
              color: '#86efac',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}>
              <Sprout size={16} /> Ghana's #1 Farm Marketplace · Upper West Region
            </div>

            <h1 className="hero-title" style={{
              fontSize: 'clamp(2.25rem, 7vw, 4rem)',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}>
              Farm Fresh,<br />
              <span style={{ color: '#4ade80' }}>Direct to You</span>
            </h1>

            <p className="hero-sub" style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              maxWidth: '55ch',
              margin: '0 auto 2rem',
            }}>
              Connect directly with smallholder farmers across the Upper West Region.
              No middlemen. Better prices. Fresher produce.
            </p>

            <div className="hero-btns" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/marketplace" className="btn btn-primary btn-lg">
                Browse Products <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=farmer" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.2)',
              }}>
                <Wheat size={18} /> Sell Your Harvest
              </Link>
            </div>

            {/* Search bar */}
            <form className="hero-search" onSubmit={handleSearch} style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              borderRadius: 16,
              overflow: 'hidden',
              maxWidth: 560,
              margin: '0 auto',
            }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  type="search"
                  placeholder="Search maize, shea nuts, livestock..."
                  style={{
                    width: '100%', height: 56, background: 'transparent',
                    border: 'none', outline: 'none',
                    paddingLeft: '3rem', paddingRight: '1rem',
                    color: '#fff', fontSize: '0.95rem',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ margin: 6, borderRadius: 10 }}>
                Search
              </button>
            </form>

            {/* Mini stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { num: '500+', label: 'Farmers' },
                { num: '1,200+', label: 'Listings' },
                { num: '8', label: 'Districts' },
                { num: '4.8★', label: 'Avg Rating' },
              ].map(s => (
                <div key={s.label} className="hero-stat" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#4ade80' }}>{s.num}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '3rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', overflowX: 'auto', gap: '0.75rem', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/marketplace?category=${cat.name}`)}
                style={{
                  flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem',
                  padding: '0.875rem 1.25rem',
                  background: 'var(--bg)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 14,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  minWidth: 80,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-50)'; e.currentTarget.style.borderColor = 'var(--green-300)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <span style={{ fontSize: '1.75rem' }}>{cat.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', whiteSpace: 'nowrap' }}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="products-section" style={{ padding: '4rem 0', background: 'linear-gradient(180deg, #0d1f10 0%, #111a11 100%)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                <Award size={18} color="#fbbf24" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Premium Listings</span>
              </div>
              <h2 className="section-title" style={{ color: '#fff' }}>Featured Products</h2>
            </div>
            <Link to="/marketplace" className="btn btn-ghost btn-sm" style={{ color: '#4ade80' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid-products">
            {featuredProducts.map(p => (
              <div key={p.id} className="product-anim">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section ref={statsRef} style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, var(--green-800), var(--green-600))',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { val: '500', suffix: '+', label: 'Registered Farmers', icon: <Users size={28} /> },
              { val: '1200', suffix: '+', label: 'Active Listings', icon: <Package size={28} /> },
              { val: '350', suffix: '+', label: 'Deals Completed', icon: <CheckCircle size={28} /> },
              { val: '8', suffix: '', label: 'Districts Covered', icon: <MapPin size={28} /> },
            ].map(s => (
              <div key={s.label} style={{ color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', opacity: 0.7 }}>{s.icon}</div>
                <div className="stat-value-anim" style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Plus Jakarta Sans' }}>
                  {s.val}{s.suffix}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="features-section" style={{ padding: '5rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>How FarmConnect Works</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Simple, fast, and built for Ghana's farmers and buyers
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Users size={28} />, title: 'Create Account', desc: 'Register as a farmer or buyer in under 2 minutes. Phone number supported.', step: '01' },
              { icon: <Package size={28} />, title: 'List or Discover', desc: 'Farmers post their crops with photos, prices, and location. Buyers browse and filter.', step: '02' },
              { icon: <PhoneCall size={28} />, title: 'Connect & Negotiate', desc: 'Use our secure messaging to negotiate prices and agree on delivery.', step: '03' },
              { icon: <Truck size={28} />, title: 'Close the Deal', desc: 'Confirm orders and arrange delivery or pick-up directly with the farmer.', step: '04' },
            ].map(f => (
              <div key={f.step} className="feature-card" style={{
                background: 'var(--bg)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem 1.5rem',
                border: '1.5px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-300)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--green-50)', position: 'absolute', top: '0.5rem', right: '1rem', lineHeight: 1, fontFamily: 'Plus Jakarta Sans' }}>
                  {f.step}
                </div>
                <div style={{ width: 52, height: 52, background: 'var(--green-100)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-700)', marginBottom: '1.25rem' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.075rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT PRODUCTS ── */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(180deg, #111a11 0%, #0d1f10 100%)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title" style={{ color: '#fff' }}>Recent Listings</h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>Fresh produce listed by farmers across the region</p>
            </div>
            <Link to="/marketplace" className="btn btn-ghost btn-sm" style={{ color: '#4ade80' }}>
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid-products">
            {recentProducts.map(p => (
              <div key={p.id} className="product-anim">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ padding: '4rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: <Shield size={22} />, title: 'Verified Farmers', desc: 'We verify farmer identities to ensure trust and quality on the platform.', color: 'var(--green-600)' },
              { icon: <Zap size={22} />, title: 'Instant Connection', desc: 'Chat directly with farmers. No phone tag, no brokers, no delays.', color: 'var(--amber-500)' },
              { icon: <TrendingUp size={22} />, title: 'Fair Prices', desc: 'See real market prices and make informed buying decisions every time.', color: '#8b5cf6' },
              { icon: <Star size={22} />, title: 'Rating System', desc: 'Rate your transactions. Buyers get quality and farmers get recognition.', color: '#ef4444' },
            ].map(f => (
              <div key={f.title} style={{
                display: 'flex',
                gap: '1rem',
                padding: '1.25rem',
                background: 'var(--bg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{f.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #0a1f0e 0%, #166534 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', fontSize: '8rem', opacity: 0.05 }}>🌾</div>
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', fontSize: '6rem', opacity: 0.05 }}>🌽</div>
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
            Ready to Transform Agriculture<br />in the Upper West?
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', maxWidth: '50ch', margin: '0 auto 2.5rem' }}>
            Join 500+ farmers already selling on FarmConnect GH. Free to register. Start listing today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=farmer" className="btn btn-primary btn-lg">
              <Sprout size={18} /> I'm a Farmer
            </Link>
            <Link to="/register?role=buyer" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff' }}>
              <Package size={18} /> I'm a Buyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
