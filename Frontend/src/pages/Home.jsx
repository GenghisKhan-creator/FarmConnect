import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sprout, ArrowRight, Search, Shield, Zap, TrendingUp,
  Users, Package, CheckCircle, Star, MapPin, ChevronRight,
  Wheat, Truck, PhoneCall, Award,
  ChevronLeft, Facebook, Instagram, Youtube, Play
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import heroBg from '../assets/hero_bg.png';
import farmerThumb from '../assets/farmer_thumb.png';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { products, categories } = useData();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const categoriesRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const slideCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 400 : 250;
      categoriesRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Hero animation
    const ctx = gsap.context(() => {
      // Hero Elements
      gsap.from('.hero-giant-word', { opacity: 0, scale: 0.8, y: 50, duration: 1, ease: 'power3.out' });
      gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.2 });
      gsap.from('.hero-btns', { opacity: 0, y: 20, duration: 0.8, delay: 0.4 });
      gsap.from('.hero-search', { opacity: 0, scale: 0.9, duration: 0.8, delay: 0.6 });
      gsap.from('.hero-badge', { opacity: 0, rotation: 45, duration: 0.6, delay: 0.8, stagger: 0.2 });

      // Stats counter scroll
      if (statsRef.current) {
        gsap.from('.stat-value-anim', {
          textContent: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
          snap: { textContent: 1 },
          stagger: 0.15,
        });
      }

      // Feature cards
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          scrollTrigger: { trigger: '.features-section', start: 'top 85%' },
        }
      );

      // Product cards
      gsap.fromTo('.product-anim',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: { trigger: '.grid-products', start: 'top 85%' },
        }
      );

    }, heroRef);

    // Refresh ScrollTrigger slightly after render to account for lazy loading images
    const timer = setTimeout(() => { ScrollTrigger.refresh(); }, 500);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
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
        background: `url(${heroBg}) center/cover no-repeat`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' }}></div>

        {/* Giant Cut-Out Text Approximation */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)', zIndex: 0, pointerEvents: 'none' }}>
          {/* <h1 className="hero-giant-word" style={{
            fontSize: 'clamp(8rem, 25vw, 25rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1,
            margin: 0,
            letterSpacing: '-0.02em',
            textShadow: '0 20px 50px rgba(0,0,0,0.6)',
            fontFamily: 'Montserrat, "Plus Jakarta Sans", sans-serif',
            opacity: 0.95
          }}>
            FARM
          </h1> */}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '10vh' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p className="hero-sub" style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '45ch',
              fontWeight: 500,
              textShadow: '0 2px 6px rgba(0,0,0,0.6)',
            }}>
              As an agricultural platform, we're on a mission to make it simple for everyone to access fresh produce directly from farmers!
            </p>

            <Link to="/marketplace" className="hero-btns" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#84cc16',
              color: '#000',
              fontWeight: 700,
              padding: '1.1rem 2.5rem',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 10px 25px rgba(132, 204, 22, 0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(132, 204, 22, 0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(132, 204, 22, 0.3)'; }}
            >
              BROWSE MARKETPLACE
            </Link>
          </div>
        </div>

        {/* Side Nav Arrows */}
        <button className="hero-badge" style={{ position: 'absolute', left: '4vw', top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', zIndex: 10, transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#84cc16'; e.currentTarget.style.color = '#84cc16'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; }}>
          <ChevronLeft size={20} />
        </button>
        <button className="hero-badge" style={{ position: 'absolute', right: '4vw', top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', border: '1px solid #84cc16', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16', cursor: 'pointer', zIndex: 10, transition: 'all 0.3s', borderColor: '#84cc16' }}>
          <ChevronRight size={20} />
        </button>

        {/* Bottom Socials */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1.5rem', zIndex: 10, alignItems: 'center' }}>
          <Facebook size={18} color="#fff" style={{ cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7} />
          <Instagram size={18} color="#fff" style={{ cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7} />
          <Youtube size={18} color="#fff" style={{ cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7} />
        </div>

        {/* Bottom Right Video Card */}
        <div className="hero-search" style={{ position: 'absolute', bottom: '2.5rem', right: '4vw', width: 220, height: 120, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', zIndex: 10, cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <img src={farmerThumb} alt="Video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(132,204,22,0.6)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#84cc16' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#84cc16', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <Play size={14} style={{ marginLeft: 3 }} fill="#000" color="#000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '3rem 0', background: 'var(--surface)' }}>
        <div className="category-wrapper" style={{ position: 'relative', width: '95%', margin: '0 auto' }}>
          {/* Scroll Left Button */}
          <button
            className="cat-nav-btn left"
            onClick={() => slideCategories('left')}
            style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-600)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--green-600)'; e.currentTarget.style.borderColor = 'var(--green-300)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--slate-600)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="category-inner" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 2rem' }}>
            <div ref={categoriesRef} className="hide-scrollbar" style={{ maxWidth: '100%', display: 'flex', overflowX: 'auto', gap: '1.25rem', paddingTop: '2.5rem', paddingBottom: '1.5rem', WebkitOverflowScrolling: 'touch', paddingLeft: 'clamp(1.25rem, 5vw, 2.5rem)', paddingRight: 'clamp(1.25rem, 5vw, 2.5rem)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/marketplace?category=${cat.name}`)}
                  style={{
                    flexShrink: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '0 1.5rem 1rem',
                    background: 'var(--bg)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 20,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: 120,
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--green-50)';
                    e.currentTarget.style.borderColor = 'var(--green-300)';
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(34, 197, 94, 0.25)';
                    const img = e.currentTarget.querySelector('.cat-img');
                    if (img) img.style.transform = 'scale(1.1) rotate(3deg)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    const img = e.currentTarget.querySelector('.cat-img');
                    if (img) img.style.transform = 'scale(1) rotate(0deg)';
                  }}
                >
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="cat-img" style={{
                      width: 84, height: 84,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      marginTop: '-2.5rem',
                      marginBottom: '0.75rem',
                      border: '5px solid var(--bg)',
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      backgroundColor: 'var(--earth-50)'
                    }} />
                  ) : (
                    <div className="cat-img" style={{
                      width: 84, height: 84,
                      borderRadius: '50%',
                      background: 'var(--earth-50)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      marginTop: '-2.5rem',
                      marginBottom: '0.75rem',
                      border: '5px solid var(--bg)',
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                      <span style={{ fontSize: '2.5rem' }}>{cat.icon}</span>
                    </div>
                  )}
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-800)', whiteSpace: 'nowrap' }}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scroll Right Button */}
          <button
            className="cat-nav-btn right"
            onClick={() => slideCategories('right')}
            style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: 44, height: 44, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-600)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--green-600)'; e.currentTarget.style.borderColor = 'var(--green-300)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--slate-600)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <ChevronRight size={20} />
          </button>
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 2, fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Plus Jakarta Sans' }}>
                  <span className="stat-value-anim">{s.val}</span>
                  <span>{s.suffix}</span>
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

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 768px) {
          .cat-nav-btn {
            display: none !important;
          }
          .category-wrapper {
            width: 100% !important;
            margin: 0 !important;
          }
          .category-inner {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
