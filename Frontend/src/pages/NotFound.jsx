import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '2rem 1.25rem'
    }}>
      <div style={{
        maxWidth: 500,
        textAlign: 'center',
        background: 'var(--surface)',
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
        border: '1px solid var(--border)'
      }}>
        {/* Large 404 Graphic */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: '6rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'var(--green-100)',
            margin: 0,
            fontFamily: 'Plus Jakarta Sans',
            letterSpacing: '-0.05em'
          }}>
            404
          </h1>
          <Sprout 
            size={48} 
            color="var(--green-600)" 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 4px 6px rgba(22, 163, 74, 0.2))' 
            }} 
          />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-800)', marginBottom: '1rem' }}>
          Oops! Page Not Found
        </h2>
        
        <p style={{ color: 'var(--slate-500)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Look like you've wandered off the trail. The field you're looking for doesn't exist, has been harvested, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/marketplace" className="btn btn-primary">
            <Search size={16} /> Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
