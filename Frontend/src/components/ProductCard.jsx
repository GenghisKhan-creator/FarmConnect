import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Star } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { categories } = useData();
  const categoryObj = categories?.find(c => c.name === product.category);
  const fallbackImg = categoryObj ? categoryObj.image : null;
  const imageSrc = (product.images && product.images.length > 0) ? product.images[0] : fallbackImg;

  const getCategoryEmoji = (cat) => {
    const map = {
      'Maize': '🌽', 'Millet': '🌾', 'Rice': '🍚', 'Groundnuts': '🥜',
      'Soybeans': '🫘', 'Shea Nuts': '🌰', 'Vegetables': '🥬',
      'Livestock': '🐄', 'Fruits': '🍋', 'Yams': '🍠',
    };
    return map[cat] || '🌿';
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{
        background: 'linear-gradient(160deg, #1a2e1a 0%, #111a11 100%)',
        borderRadius: 24,
        padding: '1.5rem 1.25rem 1.25rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 280,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
    >
      {/* Subtle glow behind image */}
      <div style={{
        position: 'absolute',
        top: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: 120, height: 80,
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Premium badge */}
      {product.premium && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(245,158,11,0.18)',
          border: '1px solid rgba(245,158,11,0.35)',
          borderRadius: 999,
          padding: '3px 9px',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: '#fbbf24',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          ★ Premium
        </div>
      )}

      {/* Product image / emoji */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
        marginBottom: '1.25rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={product.category} 
            className="product-card-img"
            style={{
              width: 100, height: 100,
              objectFit: 'cover',
              borderRadius: '50%',
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            }} 
          />
        ) : (
          <div style={{
            fontSize: '5.5rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
            userSelect: 'none',
          }}
            className="product-card-emoji"
          >
            {getCategoryEmoji(product.category)}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.375rem',
          lineHeight: 1.3,
          fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
        }}>
          {product.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.8125rem',
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.55,
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {product.description}
        </p>

        {/* Bottom row: price + add-to-cart */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Price */}
          <div>
            <span style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
            }}>
              {product.price.toLocaleString()}
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              marginLeft: '0.25rem',
            }}>
              GHS
            </span>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.3)',
              marginTop: 1,
            }}>
              per {product.unit}
            </div>
          </div>

          {/* Cart button */}
          <button
            onClick={e => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
              color: 'rgba(255,255,255,0.7)',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(34,197,94,0.25)';
              e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)';
              e.currentTarget.style.color = '#4ade80';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
            title="View & Make Offer"
          >
            <ShoppingBag size={17} />
          </button>
        </div>

        {/* Farmer + rating row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.875rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Mini avatar */}
            <div style={{
              width: 22, height: 22,
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.25)',
              border: '1px solid rgba(34,197,94,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, color: '#4ade80',
            }}>
              {product.farmerName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 500,
              maxWidth: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {product.farmerName}
            </span>
            {product.farmerVerified && (
              <ShieldCheck size={11} color="rgba(74,222,128,0.7)" />
            )}
          </div>

          {/* Star rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={11} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              {product.farmerRating}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .product-card-emoji, .product-card-img {
          transition: transform 0.3s ease;
        }
        div:hover > div > .product-card-emoji, div:hover > div > .product-card-img  {
          transform: scale(1.08) translateY(-3px);
        }
      `}</style>
    </div>
  );
}
