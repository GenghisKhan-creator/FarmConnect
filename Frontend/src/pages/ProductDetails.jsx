import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, Calendar, Package, Truck, ShieldCheck,
  Star, MessageCircle, ShoppingCart, Share2, Award, Eye, Heart,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, reviews, addOrder, categories } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [offerQty, setOfferQty] = useState(1);
  const [offerPrice, setOfferPrice] = useState('');
  const [note, setNote] = useState('');
  const [offerSent, setOfferSent] = useState(false);
  const [liked, setLiked] = useState(false);

  const product = products.find(p => p.id === Number(id));
  const categoryObj = categories?.find(c => c.name === product?.category);
  const imageSrc = categoryObj ? categoryObj.image : null;

  if (!product) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state-icon"><Package size={28} /></div>
        <h3>Product not found</h3>
        <Link to="/marketplace" className="btn btn-primary btn-sm">Back to Marketplace</Link>
      </div>
    );
  }

  const farmerReviews = reviews.filter(r => r.farmerId === product.farmerId);

  const getCategoryIcon = (cat) => {
    const map = {
      'Maize': '🌽', 'Millet': '🌾', 'Rice': '🍚', 'Groundnuts': '🥜',
      'Soybeans': '🫘', 'Shea Nuts': '🌰', 'Vegetables': '🥬',
      'Livestock': '🐄', 'Fruits': '🍋', 'Yams': '🍠',
    };
    return map[cat] || '🌿';
  };

  const handleSendOffer = () => {
    if (!user) { navigate('/login'); return; }
    addOrder({
      buyerId: user.id,
      buyerName: user.name,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      productId: product.id,
      productTitle: product.title,
      quantity: offerQty,
      offerPrice: offerPrice || product.price,
      note,
    });
    setOfferSent(true);
  };

  const handleMessage = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/messages');
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ padding: '1.25rem 1.25rem 0' }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left: Image + Farmer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Product image */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 300, position: 'relative' }}>
                {imageSrc ? (
                  <img src={imageSrc} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="img-placeholder" style={{ fontSize: '7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--earth-50)' }}>
                    {getCategoryIcon(product.category)}
                  </div>
                )}
                {product.premium && (
                  <div className="premium-ribbon">
                    <Award size={12} /> Premium
                  </div>
                )}
                <button
                  onClick={() => setLiked(p => !p)}
                  style={{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Heart size={18} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : 'var(--slate-400)'} />
                </button>
                <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.6)', borderRadius: 999, padding: '4px 10px' }}>
                  <Eye size={12} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '0.75rem' }}>{product.views} views</span>
                </div>
              </div>
            </div>

            {/* Farmer card */}
            <div className="card card-body">
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About the Farmer</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                <div className="avatar" style={{ width: 48, height: 48, fontSize: '1.125rem' }}>
                  {product.farmerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700 }}>{product.farmerName}</span>
                    {product.farmerVerified && <ShieldCheck size={14} color="var(--green-600)" />}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)' }}>{product.farmName}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.farmerRating) ? '#fbbf24' : 'none'} color={i < Math.round(product.farmerRating) ? '#fbbf24' : '#cbd5e1'} />
                ))}
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{product.farmerRating}</span>
              </div>
              <button onClick={handleMessage} className="btn btn-secondary" style={{ width: '100%' }}>
                <MessageCircle size={16} /> Message Farmer
              </button>
            </div>
          </div>

          {/* Right: Details + Order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Product info */}
            <div className="card card-body">
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                <span className="badge badge-green">{product.category}</span>
                <span className={`badge ${product.status === 'available' ? 'badge-green' : 'badge-red'}`}>
                  {product.status === 'available' ? '● Available' : 'Sold Out'}
                </span>
                {product.deliveryAvailable && (
                  <span className="badge badge-earth"><Truck size={10} /> Delivery</span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
                {product.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem' }}>
                <MapPin size={14} color="var(--slate-400)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>{product.location}, {product.district}, {product.region}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green-700)' }}>GHS {product.price.toLocaleString()}</span>
                <span style={{ color: 'var(--slate-500)' }}>per {product.unit}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <InfoItem icon={<Package size={14} />} label="Quantity Available" value={`${product.quantity} ${product.unit}`} />
                {product.harvestDate && (
                  <InfoItem icon={<Calendar size={14} />} label="Harvest Date" value={new Date(product.harvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                )}
              </div>

              <div className="divider" />
              <h4 style={{ fontWeight: 700, marginBottom: '0.625rem' }}>Description</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.7 }}>{product.description}</p>
            </div>

            {/* Order / offer form */}
            {product.status === 'available' && (
              <div className="card card-body">
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                  {product.farmerId === user?.id ? 'Your Listing' : 'Make an Offer'}
                </h4>
                {product.farmerId === user?.id ? (
                  <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>This is your listing. Manage it from your dashboard.</p>
                    <Link to="/dashboard?tab=listings" className="btn btn-secondary" style={{ marginTop: '0.75rem', width: '100%' }}>Manage Listing</Link>
                  </div>
                ) : offerSent ? (
                  <div className="alert alert-success">
                    <ShoppingCart size={18} />
                    <div>
                      <strong>Offer Sent!</strong>
                      <p style={{ fontSize: '0.85rem', marginTop: 2 }}>The farmer will respond to your offer soon. Check Messages for updates.</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div className="form-group">
                      <label className="form-label">Quantity ({product.unit})</label>
                      <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={offerQty}
                        onChange={e => setOfferQty(Number(e.target.value))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Offer Price (GHS per {product.unit.split(' ')[0]})</label>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={e => setOfferPrice(e.target.value)}
                        className="form-input"
                        placeholder={`Market: GHS ${product.price}`}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message (optional)</label>
                      <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="form-input"
                        rows={2}
                        placeholder="Tell the farmer about your needs..."
                        style={{ minHeight: 'unset' }}
                      />
                    </div>
                    {offerQty > 0 && (
                      <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--slate-600)' }}>Total Estimate</span>
                        <strong style={{ color: 'var(--green-700)' }}>
                          GHS {((offerPrice || product.price) * offerQty).toLocaleString()}
                        </strong>
                      </div>
                    )}
                    <button onClick={handleSendOffer} className="btn btn-primary" style={{ width: '100%' }}>
                      <ShoppingCart size={16} /> Send Offer
                    </button>
                    {!user && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--green-600)', fontWeight: 600 }}>Sign in</Link> to send an offer
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        {farmerReviews.length > 0 && (
          <div className="card card-body">
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Farmer Reviews ({farmerReviews.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {farmerReviews.map(r => (
                <div key={r.id} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={13} fill={i < r.rating ? '#fbbf24' : 'none'} color={i < r.rating ? '#fbbf24' : '#cbd5e1'} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontStyle: 'italic', marginBottom: '0.625rem' }}>"{r.comment}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                    <span style={{ fontWeight: 600 }}>{r.buyerName}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
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

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '0.75rem', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--slate-400)', marginBottom: '0.25rem', fontSize: '0.8rem' }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
    </div>
  );
}
