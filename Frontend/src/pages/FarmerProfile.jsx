import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, ShieldCheck, Star, Package, MessageCircle, Flag
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function FarmerProfile() {
  const { id } = useParams();
  const { products, reviews, strikes, banned, addReport } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const farmerProducts = products.filter(p => String(p.farmerId) === id);
  const farmerReviews = reviews.filter(r => String(r.farmerId) === id);

  // Derive farmer info from their first product (mockup workaround since we don't have a users table)
  const farmerInfo = farmerProducts.length > 0 ? {
    name: farmerProducts[0].farmerName,
    farmName: farmerProducts[0].farmName,
    verified: farmerProducts[0].farmerVerified,
    rating: farmerProducts[0].farmerRating,
    location: farmerProducts[0].location,
    region: farmerProducts[0].region,
  } : null;

  if (!farmerInfo) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <h3>Farmer not found or has no listings</h3>
        <Link to="/marketplace" className="btn btn-primary btn-sm">Back to Marketplace</Link>
      </div>
    );
  }

  const handleMessage = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/messages', { state: { newConvUserId: id, newConvUserName: farmerInfo.name, newConvFarmName: farmerInfo.farmName } });
  };

  const isBanned = banned.includes(id);
  const hasStrikes = strikes[id] > 0;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Cover/Header area */}
      <div style={{ background: 'linear-gradient(to right, var(--green-800), var(--green-900))', color: '#fff', paddingTop: '3rem', paddingBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ color: '#fff', marginBottom: '1.5rem', opacity: 0.8 }}>
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
            {/* Big Avatar */}
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#fff', color: 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, border: '4px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              {farmerInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 250, marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{farmerInfo.name}</h1>
                {farmerInfo.verified && <ShieldCheck size={24} color="#4ade80" />}
              </div>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '0.75rem', fontWeight: 500 }}>{farmerInfo.farmName}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', opacity: 0.8, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} /> {farmerInfo.location}, {farmerInfo.region}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Package size={16} /> {farmerProducts.length} Active Listings
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Star size={16} fill="#fbbf24" color="#fbbf24" /> {farmerInfo.rating} Average Rating
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: 200 }}>
              <button onClick={handleMessage} className="btn" style={{ background: '#fff', color: 'var(--green-800)', border: 'none' }}>
                <MessageCircle size={16} /> Message Farmer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 2 }}>

        {/* Alerts */}
        {isBanned && (
          <div className="alert alert-error" style={{ marginBottom: '2rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <strong>Account Suspended</strong>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>This user has been banned for fraudulent activity. You cannot make purchases from them.</p>
          </div>
        )}
        {hasStrikes && !isBanned && (
          <div className="alert alert-warning" style={{ marginBottom: '2rem', background: '#fef2f2', borderColor: '#fecaca', color: '#dc2626', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <strong>High Risk of Fraud</strong>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>This account has been reported multiple times for suspicious activity. Proceed with extreme caution.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

          {/* Active Listings Grid */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={24} color="var(--green-600)" /> Current Listings
            </h2>
            <div className="grid-products">
              {farmerProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Farmer Reviews */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={24} color="#fbbf24" fill="#fbbf24" /> Customer Reviews ({farmerReviews.length})
            </h2>

            {farmerReviews.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {farmerReviews.slice().reverse().map(r => (
                  <div key={r.id} className="card card-body" style={{ background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={15} fill={i < r.rating ? '#fbbf24' : 'none'} color={i < r.rating ? '#fbbf24' : '#cbd5e1'} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--slate-700)', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.6 }}>"{r.comment}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-500)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontWeight: 600 }}>{r.buyerName}</span>
                      <span>{new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <Star size={32} color="var(--slate-300)" />
                <h3 style={{ marginTop: '1rem' }}>No reviews yet</h3>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>This farmer hasn't received any reviews yet.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
