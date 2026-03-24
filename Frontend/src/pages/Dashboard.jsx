import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Bell,
  Plus, Edit3, Trash2, CheckCircle, X, Clock, MessageCircle,
  Star, TrendingUp, Eye, MapPin, AlertCircle, Heart, Truck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrder, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <h3>Please sign in to access your dashboard</h3>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  const setTab = (t) => setSearchParams({ tab: t });

  const myProducts = products.filter(p => p.farmerId === user.id);
  const myOrders = orders.filter(o => user.role === 'farmer' ? o.farmerId === user.id : o.buyerId === user.id);
  const pendingOrders = myOrders.filter(o => o.status === 'pending');

  const TABS = user.role === 'farmer'
    ? [
      { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
      { key: 'listings', label: 'My Listings', icon: <Package size={16} /> },
      { key: 'orders', label: 'Orders', icon: <ShoppingCart size={16} /> },
    ]
    : [
      { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
      { key: 'orders', label: 'My Orders', icon: <ShoppingCart size={16} /> },
      { key: 'saved', label: 'Saved Items', icon: <Heart size={16} /> },
    ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container" style={{ padding: '2rem 1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Welcome, {user.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--slate-500)', marginTop: '0.25rem' }}>
            {user.role === 'farmer' ? `${user.farmName || 'Your Farm'} · ${user.location}` : `${user.businessName || 'Buyer Account'} · ${user.location}`}
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs" style={{ marginBottom: '1.75rem' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              className={`tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
              {t.key === 'orders' && pendingOrders.length > 0 && (
                <span style={{ marginLeft: 4, background: 'var(--green-600)', color: '#fff', borderRadius: 999, fontSize: '0.7rem', padding: '1px 6px' }}>
                  {pendingOrders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && <Overview user={user} myProducts={myProducts} myOrders={myOrders} />}
        {tab === 'listings' && user.role === 'farmer' && (
          <Listings
            user={user}
            products={myProducts}
            categories={categories}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        )}
        {tab === 'orders' && <Orders user={user} orders={myOrders} updateOrder={updateOrder} />}
        {tab === 'saved' && user.role === 'buyer' && <SavedItems />}
      </div>
    </div>
  );
}

function Overview({ user, myProducts, myOrders }) {
  const { reviews } = useData();
  const navigate = useNavigate();
  const activeListings = myProducts.filter(p => p.status === 'available').length;
  const completedOrders = myOrders.filter(o => o.status === 'accepted').length;
  const totalViews = myProducts.reduce((a, p) => a + (p.views || 0), 0);

  const myReviews = reviews.filter(r => r.farmerId === user?.id);
  const averageRating = myReviews.length > 0
    ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
    : 'New';

  const stats = user.role === 'farmer'
    ? [
      { label: 'Active Listings', value: activeListings, icon: <Package size={22} />, color: 'var(--green-600)' },
      { label: 'Total Orders', value: myOrders.length, icon: <ShoppingCart size={22} />, color: '#8b5cf6' },
      { label: 'Listing Views', value: totalViews, icon: <Eye size={22} />, color: 'var(--amber-500)' },
      { label: 'Rating', value: `${averageRating}★`, icon: <Star size={22} />, color: '#ef4444' },
    ]
    : [
      { label: 'Offers Sent', value: myOrders.length, icon: <ShoppingCart size={22} />, color: 'var(--green-600)' },
      { label: 'Accepted Deals', value: completedOrders, icon: <CheckCircle size={22} />, color: '#8b5cf6' },
    ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {stats.map(s => (
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

      {/* Quick actions */}
      {user.role === 'farmer' && (
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard?tab=listings')} className="btn btn-primary">
              <Plus size={16} /> Add New Listing
            </button>
            <button onClick={() => navigate('/messages')} className="btn btn-secondary">
              <MessageCircle size={16} /> Check Messages
            </button>
            <Link to="/subscription" className="btn btn-outline">
              <TrendingUp size={16} /> Upgrade Plan
            </Link>
          </div>
        </div>
      )}
      {user.role === 'buyer' && (
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/marketplace" className="btn btn-primary"><Package size={16} /> Browse Marketplace</Link>
            <Link to="/messages" className="btn btn-secondary"><MessageCircle size={16} /> Messages</Link>
          </div>
        </div>
      )}

      {/* Plan banner */}
      <div style={{
        background: user.plan === 'premium'
          ? 'linear-gradient(135deg, #92400e, var(--amber-600))'
          : 'linear-gradient(135deg, var(--green-800), var(--green-600))',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>
            {user.plan === 'premium' ? '⭐ Premium Plan – Active' : '🌱 Free Plan'}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.25rem' }}>
            {user.plan === 'premium'
              ? 'Enjoying unlimited listings, priority visibility, and analytics.'
              : 'Upgrade to Premium for unlimited listings and priority placement.'}
          </div>
        </div>
        {user.plan !== 'premium' && (
          <Link to="/subscription" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>
            Upgrade – GHS 20/mo
          </Link>
        )}
      </div>
    </div>
  );
}

function Listings({ user, products, categories, addProduct, updateProduct, deleteProduct }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const urls = filesArr.map(f => URL.createObjectURL(f));
      setPreviewImages(prev => [...prev, ...urls]);
    }
  };

  const onSubmit = async (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...data, price: Number(data.price), quantity: Number(data.quantity), images: previewImages });
    } else {
      await addProduct({
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
        farmerId: user.id,
        farmerName: user.name,
        farmName: user.farmName || user.name,
        farmerVerified: user.verified || false,
        farmerRating: user.rating || 0,
        status: 'available',
        premium: user.plan === 'premium',
        images: previewImages,
      });
    }
    reset();
    setShowForm(false);
    setEditingProduct(null);
    setPreviewImages([]);
  };

  const canAddMore = user.plan === 'premium' || products.length < 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontWeight: 800 }}>My Listings</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
            {products.length} listing{products.length !== 1 ? 's' : ''}
            {user.plan === 'free' && ` · Free plan: ${products.length}/3 used`}
          </p>
        </div>
        <button
          onClick={() => { if (!canAddMore) { alert('Upgrade to Premium for unlimited listings!'); return; } setShowForm(true); setEditingProduct(null); setPreviewImages([]); reset(); }}
          className="btn btn-primary"
          disabled={showForm}
        >
          <Plus size={16} /> New Listing
        </button>
      </div>

      {/* Add/edit form */}
      {showForm && (
        <div className="card card-body animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 700 }}>{editingProduct ? 'Edit Listing' : 'Add New Listing'}</h3>
            <button onClick={() => { setShowForm(false); setEditingProduct(null); setPreviewImages([]); reset(); }} className="btn btn-ghost btn-icon"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Product Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="form-input" style={{ paddingTop: '0.45rem' }} />
              {previewImages.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  {previewImages.map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                      <button type="button" onClick={() => setPreviewImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Product Name <span className="form-required">*</span></label>
              <input className={`form-input ${errors.title ? 'error' : ''}`} defaultValue={editingProduct?.title} placeholder="e.g. Premium Maize (Yellow Corn)" {...register('title', { required: 'Product name is required' })} />
              {errors.title && <span className="form-error"><AlertCircle size={12} />{errors.title.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Category <span className="form-required">*</span></label>
              <select className="form-input form-select" defaultValue={editingProduct?.category} {...register('category', { required: true })}>
                {categories.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (GHS) <span className="form-required">*</span></label>
              <input type="number" min="1" className={`form-input ${errors.price ? 'error' : ''}`} defaultValue={editingProduct?.price} placeholder="e.g. 350" {...register('price', { required: 'Price is required', min: { value: 1, message: 'Must be > 0' } })} />
              {errors.price && <span className="form-error"><AlertCircle size={12} />{errors.price.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <input className="form-input" defaultValue={editingProduct?.unit || 'bags (100kg)'} placeholder="bags (100kg), crates, heads..." {...register('unit')} />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity <span className="form-required">*</span></label>
              <input type="number" min="1" className={`form-input ${errors.quantity ? 'error' : ''}`} defaultValue={editingProduct?.quantity} {...register('quantity', { required: 'Quantity is required', min: 1 })} />
              {errors.quantity && <span className="form-error"><AlertCircle size={12} />{errors.quantity.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" defaultValue={editingProduct?.location || user.location} {...register('location')} />
            </div>
            <div className="form-group">
              <label className="form-label">District</label>
              <input className="form-input" defaultValue={editingProduct?.district || user.district} {...register('district')} />
            </div>
            <div className="form-group">
              <label className="form-label">Harvest Date</label>
              <input type="date" className="form-input" defaultValue={editingProduct?.harvestDate} {...register('harvestDate')} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description <span className="form-required">*</span></label>
              <textarea className={`form-input ${errors.description ? 'error' : ''}`} defaultValue={editingProduct?.description} rows={3} placeholder="Describe your product—quality, drying method, packaging..." {...register('description', { required: 'Description is required' })} />
              {errors.description && <span className="form-error"><AlertCircle size={12} />{errors.description.message}</span>}
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                <input type="checkbox" defaultChecked={editingProduct?.deliveryAvailable} {...register('deliveryAvailable')} />
                Delivery Available
              </label>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Listing' : 'Publish Listing'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingProduct(null); setPreviewImages([]); reset(); }} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={28} /></div>
          <h3>No listings yet</h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>Create your first product listing to start selling</p>
        </div>
      ) : (
        <div className="grid-products">
          {products.map(p => (
            <div key={p.id} style={{ position: 'relative' }}>
              <ProductCard product={p} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => { setEditingProduct(p); setShowForm(true); setPreviewImages(p.images || []); reset(); }}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  onClick={() => updateProduct(p.id, { status: p.status === 'available' ? 'sold' : 'available' })}
                  className="btn btn-ghost btn-sm"
                  style={{ flex: 1, color: p.status === 'available' ? 'var(--amber-600)' : 'var(--green-600)' }}
                >
                  {p.status === 'available' ? 'Mark Sold' : 'Reactivate'}
                </button>
                <button onClick={() => { if (window.confirm('Delete this listing?')) deleteProduct(p.id); }} className="btn btn-danger btn-icon btn-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Orders({ user, orders, updateOrder }) {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);
  const statusColors = { pending: 'var(--amber-500)', accepted: 'var(--blue-500)', shipped: 'var(--indigo-500)', completed: 'var(--green-600)', rejected: '#ef4444' };

  return (
    <div>
      <div className="tabs" style={{ marginBottom: '1.25rem', overflowX: 'auto', whiteSpace: 'nowrap', pb: 2 }}>
        {['all', 'pending', 'accepted', 'shipped', 'completed', 'rejected'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingCart size={28} /></div>
          <h3>No {filter === 'all' ? '' : filter} orders</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(order => (
            <div key={order.id} className="card card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h4 style={{ fontWeight: 700 }}>{order.productTitle}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: 2 }}>
                    {user.role === 'farmer' ? `From: ${order.buyerName}` : `To: ${order.farmerName}`}
                    {' · '}{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {order.note && <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: 4, fontStyle: 'italic' }}>"{order.note}"</p>}
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, background: `${statusColors[order.status]}18`, color: statusColors[order.status], textTransform: 'capitalize' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[order.status] }} />
                  {order.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
                <div><span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>Quantity</span><div style={{ fontWeight: 600 }}>{order.quantity} units</div></div>
                <div><span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>Offer Price</span><div style={{ fontWeight: 600 }}>GHS {order.offerPrice}/unit</div></div>
                <div><span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>Total</span><div style={{ fontWeight: 700, color: 'var(--green-700)' }}>GHS {(order.offerPrice * order.quantity).toLocaleString()}</div></div>
              </div>

              {/* Action buttons lifecycle */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {user.role === 'farmer' && order.status === 'pending' && (
                  <>
                    <button onClick={() => updateOrder(order.id, { status: 'accepted' })} className="btn btn-primary btn-sm">
                      <CheckCircle size={14} /> Accept Offer
                    </button>
                    <button onClick={() => updateOrder(order.id, { status: 'rejected' })} className="btn btn-danger btn-sm">
                      <X size={14} /> Reject
                    </button>
                  </>
                )}
                {user.role === 'farmer' && order.status === 'accepted' && (
                  <button onClick={() => updateOrder(order.id, { status: 'shipped' })} className="btn btn-secondary btn-sm" style={{ background: 'var(--blue-600)', color: '#fff', borderColor: 'var(--blue-600)' }}>
                    <Truck size={14} /> Mark as Shipped
                  </button>
                )}
                {user.role === 'buyer' && order.status === 'shipped' && (
                  <button onClick={() => updateOrder(order.id, { status: 'completed' })} className="btn btn-primary btn-sm">
                    <CheckCircle size={14} /> Confirm Receipt
                  </button>
                )}
                
                {['accepted', 'shipped', 'completed'].includes(order.status) && (
                  <button 
                    onClick={() => navigate('/messages', { state: { newConvUserId: user.role === 'farmer' ? order.buyerId : order.farmerId, newConvUserName: user.role === 'farmer' ? order.buyerName : order.farmerName, newConvFarmName: null } })} 
                    className="btn btn-outline btn-sm"
                  >
                    <MessageCircle size={14} /> Message {user.role === 'farmer' ? 'Buyer' : 'Farmer'}
                  </button>
                )}
              </div>

              {order.status === 'completed' && (
                <div style={{ marginTop: '1rem', padding: '0.625rem 0.875rem', background: 'var(--green-50)', color: 'var(--green-700)', border: '1px solid var(--green-200)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={16} /> Order Successfully Completed
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SavedItems() {
  const { products, savedItems } = useData();
  const savedProducts = products.filter(p => savedItems.includes(p.id));

  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Saved Items</h2>
      {savedProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Heart size={28} /></div>
          <h3>Your wishlist is empty</h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '1rem' }}>You haven't saved any listings yet.</p>
          <Link to="/marketplace" className="btn btn-primary btn-sm">Browse Marketplace</Link>
        </div>
      ) : (
        <div className="grid-products">
          {savedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
