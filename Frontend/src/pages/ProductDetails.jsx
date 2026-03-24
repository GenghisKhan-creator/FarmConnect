import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, Calendar, Package, Truck, ShieldCheck,
  Star, MessageCircle, ShoppingCart, Share2, Award, Eye, Heart, Flag, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, reviews, addReview, addOrder, categories, addReport, strikes, banned, savedItems, toggleSavedItem, addToast } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [offerQty, setOfferQty] = useState(1);
  const [offerPrice, setOfferPrice] = useState('');
  const [note, setNote] = useState('');
  const [offerSent, setOfferSent] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const product = products.find(p => p.id === Number(id));
  const isSaved = savedItems.includes(product?.id);
  const categoryObj = categories?.find(c => c.name === product?.category);
  const fallbackImg = categoryObj ? categoryObj.image : null;
  
  const allImages = (product?.images && product.images.length > 0) 
    ? product.images 
    : (fallbackImg ? [fallbackImg] : []);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = allImages[activeImageIndex] || null;

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
    addToast("Offer sent to farmer successfully! 🌱");
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
              <div style={{ height: 320, position: 'relative' }}>
                {currentImage ? (
                  <img src={currentImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="img-placeholder" style={{ fontSize: '7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--earth-50)' }}>
                    {getCategoryIcon(product.category)}
                  </div>
                )}
                
                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex(p => (p - 1 + allImages.length) % allImages.length)}
                      style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', color: 'var(--slate-700)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                    ><ChevronLeft size={20} /></button>
                    <button 
                      onClick={() => setActiveImageIndex(p => (p + 1) % allImages.length)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', color: 'var(--slate-700)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                    ><ChevronRight size={20} /></button>
                  </>
                )}

                {product.premium && (
                  <div className="premium-ribbon">
                    <Award size={12} /> Premium
                  </div>
                )}
                <button
                  onClick={() => {
                    toggleSavedItem(product.id);
                    if (isSaved) addToast("Removed from Saved Items");
                    else addToast("Added to Saved Items 💚");
                  }}
                  style={{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Heart size={18} fill={isSaved ? '#ef4444' : 'none'} color={isSaved ? '#ef4444' : 'var(--slate-400)'} />
                </button>
                <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.6)', borderRadius: 999, padding: '4px 10px', zIndex: 10 }}>
                  <Eye size={12} color="#fff" />
                  <span style={{ color: '#fff', fontSize: '0.75rem' }}>{product.views} views</span>
                </div>
              </div>
              
              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', overflowX: 'auto', background: 'var(--surface)' }}>
                  {allImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{ 
                        flexShrink: 0, width: 60, height: 60, borderRadius: 8, overflow: 'hidden', 
                        border: activeImageIndex === idx ? '2px solid var(--green-600)' : '2px solid transparent',
                        padding: 0, cursor: 'pointer', transition: 'border 0.2s ease'
                      }}
                    >
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`thumbnail ${idx}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Farmer card */}
            <div className="card card-body">
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About the Farmer</h4>

              {banned.includes(product.farmerId) && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                  <strong>Account Suspended</strong>
                  <p style={{ fontSize: '0.8rem', marginTop: 2 }}>This user has been banned for fraudulent activity.</p>
                </div>
              )}
              {strikes[product.farmerId] > 0 && !banned.includes(product.farmerId) && (
                <div className="alert alert-warning" style={{ marginBottom: '1rem', background: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}>
                  <strong>High Risk of Fraud</strong>
                  <p style={{ fontSize: '0.8rem', marginTop: 2 }}>This account has been reported multiple times for suspicious activity. Proceed with extreme caution.</p>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                <div className="avatar" style={{ width: 48, height: 48, fontSize: '1.125rem' }}>
                  {product.farmerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Link to={`/farmer/${product.farmerId}`} style={{ fontWeight: 700, color: 'var(--slate-800)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.textDecoration='underline'} onMouseLeave={e => e.target.style.textDecoration='none'}>
                      {product.farmerName}
                    </Link>
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
              <button onClick={() => setReportModalOpen(true)} className="btn btn-ghost" style={{ width: '100%', color: 'var(--red-500)', marginTop: '0.5rem' }}>
                <Flag size={16} /> Report Fraud
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800 }}>
                  {product.title}
                </h1>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.title, text: `Check out ${product.title} on FarmConnect!`, url: window.location.href }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="btn btn-ghost btn-icon" 
                  style={{ color: 'var(--slate-500)', flexShrink: 0, width: 40, height: 40 }}
                  title="Share"
                >
                  <Share2 size={20} />
                </button>
              </div>

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
            {product.status === 'available' && !banned.includes(product.farmerId) && (
              <div className="card card-body">
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>
                  {product.farmerId === user?.id ? 'Your Listing' : 'Make an Offer'}
                </h4>
                
                {/* General Disclaimer */}
                {product.farmerId !== user?.id && (
                  <div style={{ background: 'var(--amber-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--amber-200)', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--amber-600)' }}>
                    <strong>Safety Disclaimer:</strong> Please only make payments AFTER meeting the farmer and physically verifying the products.
                  </div>
                )}
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

        {/* Reviews section */}
        <div className="card card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>Farmer Reviews ({farmerReviews.length})</h3>
            {user && user.id !== product.farmerId && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="btn btn-secondary btn-sm">Write a Review</button>
            )}
          </div>

          {showReviewForm && (
            <div style={{ background: 'var(--slate-50)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border)', animation: 'fadeIn 0.2s ease' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Write a Review</h4>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <Star 
                      key={v} 
                      size={24} 
                      fill={v <= reviewRating ? '#fbbf24' : 'none'} 
                      color={v <= reviewRating ? '#fbbf24' : '#cbd5e1'} 
                      style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onClick={() => setReviewRating(v)}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Comment</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  placeholder="Share your experience dealing with this farmer..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="btn btn-primary" 
                  disabled={!reviewComment.trim()}
                  onClick={() => {
                    addReview({ buyerId: user.id, buyerName: user.name, farmerId: product.farmerId, rating: reviewRating, comment: reviewComment });
                    setShowReviewForm(false);
                    setReviewComment('');
                    setReviewRating(5);
                    addToast("Review submitted successfully! ⭐");
                  }}
                >Submit Review</button>
                <button className="btn btn-ghost" onClick={() => setShowReviewForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {farmerReviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {farmerReviews.slice().reverse().map(r => (
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
          ) : (
             <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
               No reviews yet. Be the first to leave a review!
             </div>
          )}
        </div>
      </div>

      {/* Report Fraud Modal */}
      {reportModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="card card-body" style={{ width: '90%', maxWidth: 450, position: 'relative' }}>
            {reportSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <ShieldCheck size={48} color="var(--green-600)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Report Submitted</h3>
                <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Thank you for keeping FarmConnect safe. Our team will review this listing shortly.</p>
                <button className="btn btn-primary" onClick={() => { setReportModalOpen(false); setReportSubmitted(false); }} style={{ width: '100%' }}>Close</button>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '1rem', color: 'var(--red-500)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Flag size={20} /> Report Fraudulent Listing</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                  If you suspect this listing or farmer is fraudulent, please let us know. Your report will be kept confidential.
                </p>
                <div className="form-group">
                  <label className="form-label">Reason for reporting</label>
                  <select 
                    className="form-input" 
                    value={reportReason} 
                    onChange={e => setReportReason(e.target.value)}
                  >
                    <option value="">Select a reason...</option>
                    <option value="fake_listing">Fake Listing / Scammer</option>
                    <option value="inaccurate_details">Inaccurate Details / Price</option>
                    <option value="inappropriate_content">Inappropriate Content</option>
                    <option value="other">Other suspicious activity</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.875rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => setReportModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                  <button 
                    className="btn btn-primary" 
                    disabled={!reportReason}
                    onClick={() => {
                      if (!user) { navigate('/login'); return; }
                      addReport({ 
                        reportedUserId: product.farmerId, 
                        reportedUserName: product.farmerName, 
                        reporterId: user.id, 
                        reason: reportReason, 
                        productId: product.id 
                      });
                      setReportSubmitted(true);
                      setReportReason('');
                    }} 
                    style={{ flex: 1, background: 'var(--red-500)', borderColor: 'var(--red-500)', color: '#fff' }}
                  >Submit Report</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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
