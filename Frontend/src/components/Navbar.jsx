import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sprout, Search, Bell, Menu, X, ChevronDown,
  User, LogOut, Settings, LayoutDashboard, ShoppingBag,
  MessageCircle, Star,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--green-600), var(--green-400))',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sprout size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.125rem', color: 'var(--green-800)' }}>
            Farm<span style={{ color: 'var(--green-500)' }}>Connect</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 400, display: 'flex' }} className="hide-mobile">
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search maize, millet, groundnuts..."
              className="form-input"
              style={{ paddingLeft: '2.25rem', paddingRight: '1rem', height: '40px', fontSize: '0.875rem', borderRadius: 999 }}
            />
          </div>
        </form>

        {/* Desktop Nav links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/subscription">Pricing</NavLink>
          {user && <NavLink to="/messages">Messages</NavLink>}
        </div>

        {/* Right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user ? (
            <>
              <button
                className="btn btn-ghost btn-icon hide-mobile"
                style={{ position: 'relative' }}
                title="Notifications"
              >
                <Bell size={20} />
                <span className="notif-dot" />
              </button>
              {/* Avatar dropdown */}
              <div className="dropdown" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(p => !p)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.375rem 0.625rem', borderRadius: 999, border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', transition: 'var(--transition)' }}
                >
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{initials}</div>
                  <span className="hide-mobile" style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ color: 'var(--slate-400)' }} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      <span className="badge badge-green" style={{ marginTop: 4, textTransform: 'capitalize' }}>{user.role}</span>
                    </div>
                    <button className="dropdown-item" onClick={() => { navigate(getDashboardLink()); setDropdownOpen(false); }}>
                      <LayoutDashboard size={16} /> Dashboard
                    </button>
                    <button className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                      <User size={16} /> My Profile
                    </button>
                    {user.role === 'farmer' && (
                      <button className="dropdown-item" onClick={() => { navigate('/dashboard?tab=listings'); setDropdownOpen(false); }}>
                        <ShoppingBag size={16} /> My Listings
                      </button>
                    )}
                    <button className="dropdown-item" onClick={() => { navigate('/messages'); setDropdownOpen(false); }}>
                      <MessageCircle size={16} /> Messages
                    </button>
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }} />
                    <button className="dropdown-item danger" onClick={() => { logout(); navigate('/'); setDropdownOpen(false); }}>
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm hide-mobile">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="btn btn-ghost btn-icon show-mobile"
            onClick={() => setMobileOpen(p => !p)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <form onSubmit={handleSearch} style={{ marginBottom: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="form-input"
                style={{ paddingLeft: '2.25rem', height: '44px', borderRadius: 999 }}
              />
            </div>
          </form>
          <MobileNavLink to="/marketplace">Marketplace</MobileNavLink>
          <MobileNavLink to="/subscription">Pricing</MobileNavLink>
          {user && (
            <>
              <MobileNavLink to="/messages">Messages</MobileNavLink>
              <MobileNavLink to={getDashboardLink()}>Dashboard</MobileNavLink>
              <MobileNavLink to="/profile">My Profile</MobileNavLink>
              <button
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start', color: '#ef4444', marginTop: '0.5rem' }}
                onClick={() => { logout(); navigate('/'); }}
              >
                <LogOut size={16} /> Sign out
              </button>
            </>
          )}
          {!user && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ flex: 1 }}>Sign in</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </nav>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + '/');
  return (
    <Link to={to} style={{
      padding: '0.5rem 0.875rem',
      borderRadius: 8,
      fontWeight: 600,
      fontSize: '0.9rem',
      color: active ? 'var(--green-700)' : 'var(--slate-600)',
      background: active ? 'var(--green-50)' : 'transparent',
      transition: 'var(--transition)',
    }}
      onMouseEnter={e => { if (!active) e.target.style.background = 'var(--slate-50)'; }}
      onMouseLeave={e => { if (!active) e.target.style.background = 'transparent'; }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} style={{
      padding: '0.75rem 1rem',
      borderRadius: 10,
      fontWeight: 600,
      fontSize: '0.95rem',
      color: active ? 'var(--green-700)' : 'var(--slate-700)',
      background: active ? 'var(--green-50)' : 'transparent',
    }}>
      {children}
    </Link>
  );
}
