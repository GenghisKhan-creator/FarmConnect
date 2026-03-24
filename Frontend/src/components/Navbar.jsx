import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Sprout, Search, Bell, Menu, X, ChevronDown,
  User, LogOut, Settings, LayoutDashboard, ShoppingBag,
  MessageCircle, Star,
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, markNotificationsAsRead } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
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

  const userNotifications = notifications?.filter(n => n.userId === user?.id) || [];
  const unreadCount = userNotifications.filter(n => !n.read).length;

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
          <img src={logoImg} alt="FarmConnect Logo" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8 }} />
          <span className="hide-mobile" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.125rem', color: 'var(--green-800)' }}>
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
              {/* Notifications dropdown */}
              <div className="dropdown hide-mobile" ref={notifRef}>
                <button
                  className="btn btn-ghost btn-icon"
                  style={{ position: 'relative' }}
                  title="Notifications"
                  onClick={() => {
                    setNotifOpen(p => !p);
                    setDropdownOpen(false);
                    if (!notifOpen && unreadCount > 0) markNotificationsAsRead(user.id);
                  }}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notif-dot" style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />}
                </button>
                {notifOpen && (
                  <div className="dropdown-menu" style={{ right: 0, width: 320, padding: 0 }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: 700, margin: 0 }}>Notifications</h4>
                      {unreadCount > 0 && <span style={{ fontSize: '0.75rem', background: 'var(--green-100)', color: 'var(--green-700)', padding: '2px 8px', borderRadius: 999 }}>{unreadCount} new</span>}
                    </div>
                    <div style={{ maxHeight: 350, overflowY: 'auto' }}>
                      {userNotifications.length === 0 ? (
                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                          <Bell size={24} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                          All caught up! No notifications.
                        </div>
                      ) : (
                        userNotifications.map(n => (
                          <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'var(--blue-50)', display: 'flex', gap: '0.75rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='var(--slate-50)'} onMouseLeave={e => e.currentTarget.style.background=n.read?'transparent':'var(--blue-50)'} onClick={() => { if(n.type === 'message') navigate('/messages'); setNotifOpen(false); }}>
                            <div style={{ flexShrink: 0, width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : 'var(--blue-500)', marginTop: 6 }} />
                            <div>
                              <p style={{ fontSize: '0.875rem', color: 'var(--slate-800)', marginBottom: 4, lineHeight: 1.4 }}>{n.text}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                                {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar dropdown */}
              <div className="dropdown" ref={dropdownRef}>
                <button
                  onClick={() => { setDropdownOpen(p => !p); setNotifOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.375rem 0.625rem', borderRadius: 999, border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', transition: 'var(--transition)' }}
                >
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', overflow: 'hidden' }}>
                    {user.avatar ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
                  </div>
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
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
