import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, ChevronDown, Grid3x3, List } from 'lucide-react';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

const LOCATIONS = ['All Locations', 'Wa', 'Tumu', 'Lawra', 'Jirapa', 'Nandom', 'Wa East', 'Sissala East'];

export default function Marketplace() {
  const { products, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState('All Locations');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [delivery, setDelivery] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setQuery(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = products
    .filter(p => {
      if (query) {
        const q = query.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      }
      if (category !== 'All' && p.category !== category) return false;
      if (location !== 'All Locations' && p.location !== location && p.district !== location) return false;
      if (priceMin && p.price < Number(priceMin)) return false;
      if (priceMax && p.price > Number(priceMax)) return false;
      if (delivery && !p.deliveryAvailable) return false;
      if (verified && !p.farmerVerified) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.farmerRating - a.farmerRating;
      return 0;
    });

  const clearFilters = () => {
    setQuery(''); setCategory('All'); setLocation('All Locations');
    setPriceMin(''); setPriceMax(''); setDelivery(false); setVerified(false);
    setSearchParams({});
  };

  const hasFilters = query || category !== 'All' || location !== 'All Locations' || priceMin || priceMax || delivery || verified;

  return (
    <div style={{ minHeight: '100vh', background: '#0d1f10' }}>
      {/* Header bar */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products, farmers, locations..."
                className="form-input"
                style={{ paddingLeft: '2.25rem', height: '44px' }}
              />
            </div>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-input form-select"
              style={{ width: 'auto', height: '44px', paddingRight: '2.5rem' }}
            >
              <option value="recent">Most Recent</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
            {/* Filter toggle */}
            <button
              className={`btn ${filterOpen ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterOpen(p => !p)}
              style={{ height: '44px', gap: '0.5rem' }}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasFilters && <span style={{ width: 8, height: 8, borderRadius: '50%', background: filterOpen ? 'rgba(255,255,255,0.7)' : 'var(--green-500)', flexShrink: 0 }} />}
            </button>
            {/* View mode */}
            <div style={{ display: 'flex', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{ padding: '0.625rem 0.875rem', background: viewMode === 'grid' ? 'var(--green-50)' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === 'grid' ? 'var(--green-700)' : 'var(--slate-400)' }}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{ padding: '0.625rem 0.875rem', background: viewMode === 'list' ? 'var(--green-50)' : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === 'list' ? 'var(--green-700)' : 'var(--slate-400)' }}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Filter panel */}
          {filterOpen && (
            <div style={{
              marginTop: '1rem',
              padding: '1.25rem',
              background: 'var(--bg)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              animation: 'fadeIn 0.2s ease',
            }}>
              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="form-input form-select">
                  <option value="All">All Categories</option>
                  {categories.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                <select value={location} onChange={e => setLocation(e.target.value)} className="form-input form-select">
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              {/* Price range */}
              <div className="form-group">
                <label className="form-label">Min Price (GHS)</label>
                <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="form-input" placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Max Price (GHS)</label>
                <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="form-input" placeholder="Any" min="0" />
              </div>
              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  <input type="checkbox" checked={delivery} onChange={e => setDelivery(e.target.checked)} />
                  Delivery Available
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  <input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />
                  Verified Farmers Only
                </label>
              </div>
              {hasFilters && (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
                    <X size={14} /> Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: '1.5rem 1.25rem' }}>
        {/* Active filters pills */}
        {hasFilters && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {query && <FilterPill label={`"${query}"`} onRemove={() => setQuery('')} />}
            {category !== 'All' && <FilterPill label={category} onRemove={() => setCategory('All')} />}
            {location !== 'All Locations' && <FilterPill label={location} onRemove={() => setLocation('All Locations')} />}
            {priceMin && <FilterPill label={`Min GHS ${priceMin}`} onRemove={() => setPriceMin('')} />}
            {priceMax && <FilterPill label={`Max GHS ${priceMax}`} onRemove={() => setPriceMax('')} />}
            {delivery && <FilterPill label="Delivery" onRemove={() => setDelivery(false)} />}
            {verified && <FilterPill label="Verified" onRemove={() => setVerified(false)} />}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
            <strong style={{ color: '#fff' }}>{filtered.length}</strong> products found
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(34,197,94,0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}><Search size={28} /></div>
            <h3 style={{ color: '#fff' }}>No products found</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn btn-primary btn-sm">Clear All Filters</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid-products">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {filtered.map(p => <ProductListCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      background: 'var(--green-50)', border: '1px solid var(--green-200)',
      borderRadius: 999, fontSize: '0.8125rem', fontWeight: 500, color: 'var(--green-700)',
    }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-500)', display: 'flex', padding: 0 }}>
        <X size={12} />
      </button>
    </div>
  );
}

function ProductListCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className="card" style={{ display: 'flex', gap: '1rem', cursor: 'pointer' }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div style={{ width: 100, height: 100, flexShrink: 0, background: 'var(--earth-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', borderRadius: 'var(--radius-md)', margin: '0.75rem 0 0.75rem 0.75rem' }}>
        {['🌽', '🌾', '🍚', '🥜', '🫘', '🌰', '🥬', '🐄', '🍋', '🍠'][['Maize','Millet','Rice','Groundnuts','Soybeans','Shea Nuts','Vegetables','Livestock','Fruits','Yams'].indexOf(product.category)] || '🌿'}
      </div>
      <div className="card-body" style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{product.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <MapPin size={12} color="var(--slate-400)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{product.location}, {product.district}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="price">GHS {product.price.toLocaleString()}</div>
            <div className="price-unit">per {product.unit}</div>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.5rem', lineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.description}
        </p>
      </div>
    </div>
  );
}
