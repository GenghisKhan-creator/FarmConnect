import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  User, Edit3, Camera, Shield, ShieldCheck, Star, MapPin,
  Phone, Mail, Package, CheckCircle, LogOut, Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { products, reviews, addToast } = useData();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <h3>Please sign in to view your profile</h3>
        <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
      </div>
    );
  }

  const myProducts = products.filter(p => p.farmerId === user.id);
  const myReviews = reviews.filter(r => r.farmerId === user.id);
  const avgRating = myReviews.length
    ? (myReviews.reduce((a, r) => a + r.rating, 0) / myReviews.length).toFixed(1)
    : user.rating || '–';

  const onSave = (data) => {
    updateProfile(data);
    setEditing(false);
    addToast("Profile details updated! 💾");
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateProfile({ avatar: imageUrl });
      addToast("Profile picture updated! 📷");
    }
  };

  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Profile banner */}
      <div style={{ height: 180, background: 'linear-gradient(135deg, var(--green-900), var(--green-600))', position: 'relative' }} />

      <div className="container" style={{ position: 'relative' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-52px', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <div className="avatar" style={{ width: 100, height: 100, fontSize: '2rem', border: '4px solid #fff', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>
              <button 
                onClick={() => document.getElementById('avatar-upload').click()}
                style={{ position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: '50%', background: 'var(--green-600)', border: '2px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
              >
                <Camera size={13} />
              </button>
              <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.name}</h1>
                {user.verified && <ShieldCheck size={20} color="var(--green-600)" />}
              </div>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                {user.role === 'farmer' ? user.farmName || 'Farmer' : user.businessName || 'Buyer'} · {user.location}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <button onClick={() => setEditing(p => !p)} className={`btn ${editing ? 'btn-ghost' : 'btn-secondary'} btn-sm`}>
              <Edit3 size={14} /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left: Info + Edit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Plan badge */}
            <div className={`card card-body`} style={{ background: user.plan === 'premium' ? 'linear-gradient(135deg, #92400e18, #f59e0b18)' : 'var(--surface)', border: `1.5px solid ${user.plan === 'premium' ? 'var(--amber-200)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</span>
                  <div style={{ fontWeight: 700, fontSize: '1.0625rem', textTransform: 'capitalize', color: user.plan === 'premium' ? 'var(--amber-600)' : 'var(--slate-700)' }}>
                    {user.plan === 'premium' ? '⭐ Premium' : '🌱 Free'}
                  </div>
                </div>
                {user.plan !== 'premium' && (
                  <Link to="/subscription" className="btn btn-sm btn-primary">Upgrade</Link>
                )}
              </div>
            </div>

            {/* Contact info (view mode) */}
            {!editing && (
              <div className="card card-body">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.9375rem' }}>Contact Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <InfoRow icon={<Phone size={14} />} label="Phone" value={user.phone} />
                  <InfoRow icon={<Mail size={14} />} label="Email" value={user.email || '—'} />
                  <InfoRow icon={<MapPin size={14} />} label="Location" value={`${user.location || '—'}${user.district ? ', ' + user.district : ''}${user.region ? ', ' + user.region : ''}`} />
                  {user.role === 'farmer' && (
                    <>
                      <InfoRow icon={<Package size={14} />} label="Farm Size" value={user.farmSize || '—'} />
                      {user.crops?.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginBottom: 6, display: 'block' }}>Crops Produced</span>
                          <div className="tag-list">
                            {user.crops.map(c => <span key={c} className="badge badge-green">{c}</span>)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Edit form */}
            {editing && (
              <div className="card card-body animate-fade-in">
                <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Edit Profile</h3>
                <form onSubmit={handleSubmit(onSave)} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" defaultValue={user.name} {...register('name', { required: true })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" defaultValue={user.phone} {...register('phone')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue={user.email} {...register('email')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / Town</label>
                    <input className="form-input" defaultValue={user.location} {...register('location')} />
                  </div>
                  {user.role === 'farmer' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Farm Name</label>
                        <input className="form-input" defaultValue={user.farmName} {...register('farmName')} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Farm Size</label>
                        <input className="form-input" defaultValue={user.farmSize} placeholder="e.g. 10 acres" {...register('farmSize')} />
                      </div>
                    </>
                  )}
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} /> Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Stats */}
            {user.role === 'farmer' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Listings', value: myProducts.length },
                  { label: 'Rating', value: `${avgRating}★` },
                  { label: 'Reviews', value: myReviews.length },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.375rem', color: 'var(--green-700)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Listings + Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {user.role === 'farmer' && myProducts.length > 0 && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>My Listings ({myProducts.length})</h3>
                <div className="grid-products">
                  {myProducts.map(p => <ProductCard key={p.id} product={p} compact />)}
                </div>
              </div>
            )}
            {myReviews.length > 0 && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Reviews ({myReviews.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {myReviews.map(r => (
                    <div key={r.id} style={{ padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: 2, marginBottom: '0.375rem' }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={13} fill={i < r.rating ? '#fbbf24' : 'none'} color={i < r.rating ? '#fbbf24' : '#cbd5e1'} />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontStyle: 'italic' }}>"{r.comment}"</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.375rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 600 }}>{r.buyerName}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <span style={{ color: 'var(--slate-400)', flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{label}</div>
        <div style={{ fontWeight: 500, fontSize: '0.9rem', marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}
