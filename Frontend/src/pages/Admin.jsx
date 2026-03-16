import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Package, ShoppingCart, TrendingUp, Shield, Trash2,
  CheckCircle, AlertTriangle, BarChart3, Eye, Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const MOCK_ALL_USERS = [
  { id: 1, name: 'Issah Abubakari', email: 'issah@farmconnect.gh', role: 'farmer', plan: 'premium', verified: true, createdAt: '2026-01-01', location: 'Tumu' },
  { id: 2, name: 'Amina Seidu', email: 'amina@buyer.gh', role: 'buyer', plan: 'free', verified: false, createdAt: '2026-01-15', location: 'Wa' },
  { id: 4, name: 'Abass Mohammed', email: 'abass@agro.gh', role: 'farmer', plan: 'free', verified: true, createdAt: '2025-12-20', location: 'Lawra' },
  { id: 5, name: 'Faustina Dery', email: 'faustina@farm.gh', role: 'farmer', plan: 'free', verified: false, createdAt: '2026-01-10', location: 'Wa' },
  { id: 6, name: 'Dramani Yakubu', email: 'dramani@coop.gh', role: 'farmer', plan: 'premium', verified: true, createdAt: '2025-11-30', location: 'Nandom' },
];

export default function Admin() {
  const { user } = useAuth();
  const { products, deleteProduct } = useData();
  const [tab, setTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [prodSearch, setProdSearch] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state-icon"><Shield size={28} /></div>
        <h3>Admin Access Required</h3>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>You need admin privileges to view this page.</p>
        <Link to="/" className="btn btn-primary btn-sm">Go Home</Link>
      </div>
    );
  }

  const totalFarmers = MOCK_ALL_USERS.filter(u => u.role === 'farmer').length;
  const totalBuyers = MOCK_ALL_USERS.filter(u => u.role === 'buyer').length;
  const totalPremium = MOCK_ALL_USERS.filter(u => u.plan === 'premium').length;
  const unverified = MOCK_ALL_USERS.filter(u => u.role === 'farmer' && !u.verified).length;

  const filteredUsers = MOCK_ALL_USERS.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.farmerName.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const TABS = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { key: 'users', label: `Users (${MOCK_ALL_USERS.length})`, icon: <Users size={16} /> },
    { key: 'listings', label: `Listings (${products.length})`, icon: <Package size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--slate-900), var(--slate-800))', padding: '2rem 0', marginBottom: '0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(34,197,94,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-400)' }}>
              <Shield size={22} />
            </div>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem' }}>Admin Dashboard</h1>
              <p style={{ color: 'var(--slate-400)', fontSize: '0.875rem' }}>FarmConnect GH Platform Management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.25rem' }}>
        <div className="tabs" style={{ marginBottom: '2rem' }}>
          {TABS.map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Total Farmers', value: totalFarmers, icon: <TrendingUp size={22} />, color: 'var(--green-600)' },
                { label: 'Total Buyers', value: totalBuyers, icon: <Users size={22} />, color: '#8b5cf6' },
                { label: 'Total Listings', value: products.length, icon: <Package size={22} />, color: 'var(--amber-500)' },
                { label: 'Premium Users', value: totalPremium, icon: <ShoppingCart size={22} />, color: '#3b82f6' },
                { label: 'Pending Verify', value: unverified, icon: <AlertTriangle size={22} />, color: '#ef4444' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                    <div style={{ padding: '0.625rem', borderRadius: 12, background: `${s.color}15`, color: s.color }}>
                      {s.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts */}
            {unverified > 0 && (
              <div className="alert alert-warning">
                <AlertTriangle size={18} />
                <div>
                  <strong>{unverified} farmer{unverified !== 1 ? 's' : ''}</strong> awaiting verification. Review in the Users tab.
                </div>
              </div>
            )}

            {/* Recent listings */}
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Listings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {products.slice(0, 5).map(p => (
                  <div key={p.id} className="card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{p.farmerName} · {p.location} · GHS {p.price.toLocaleString()}/{p.unit}</div>
                    </div>
                    <div style={{ display: 'flex', align: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${p.premium ? 'badge-amber' : 'badge-slate'}`}>{p.premium ? 'Premium' : 'Free'}</span>
                      <Link to={`/products/${p.id}`} className="btn btn-ghost btn-icon btn-sm"><Eye size={14} /></Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: 400 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} className="form-input" placeholder="Search users..." style={{ paddingLeft: '2rem', height: 40, fontSize: '0.875rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredUsers.map(u => (
                <div key={u.id} className="card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div className="avatar" style={{ width: 40, height: 40, fontSize: '0.875rem' }}>
                      {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {u.name}
                        {u.verified && <CheckCircle size={14} color="var(--green-600)" />}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{u.email} · {u.location}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${u.role === 'farmer' ? 'badge-green' : 'badge-earth'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span>
                    <span className={`badge ${u.plan === 'premium' ? 'badge-amber' : 'badge-slate'}`}>{u.plan}</span>
                    {!u.verified && u.role === 'farmer' && (
                      <button className="btn btn-sm" style={{ background: 'var(--green-50)', color: 'var(--green-700)', border: '1px solid var(--green-200)', padding: '0.25rem 0.75rem' }}>
                        <CheckCircle size={12} /> Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings */}
        {tab === 'listings' && (
          <div>
            <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: 400 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input value={prodSearch} onChange={e => setProdSearch(e.target.value)} className="form-input" placeholder="Search listings..." style={{ paddingLeft: '2rem', height: 40, fontSize: '0.875rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredProducts.map(p => (
                <div key={p.id} className="card card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      {p.farmerName} · {p.location} · GHS {p.price.toLocaleString()} · {p.quantity} {p.unit}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${p.status === 'available' ? 'badge-green' : 'badge-slate'}`}>{p.status}</span>
                    <span className={`badge ${p.premium ? 'badge-amber' : 'badge-slate'}`}>{p.premium ? 'Premium' : 'Free'}</span>
                    <Link to={`/products/${p.id}`} className="btn btn-ghost btn-icon btn-sm"><Eye size={14} /></Link>
                    <button onClick={() => { if (window.confirm('Remove this listing?')) deleteProduct(p.id); }} className="btn btn-danger btn-icon btn-sm"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
