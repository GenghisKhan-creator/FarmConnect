import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Sprout, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      if (result.user.role === 'admin') navigate('/admin');
      else navigate(redirect);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--green-600), var(--green-400))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Sprout size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Welcome back</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sign in to your FarmConnect GH account</p>
        </div>

        {/* Demo hint */}
        <div className="alert alert-warning" style={{ marginBottom: '1.25rem', fontSize: '0.825rem' }}>
          <AlertCircle size={16} />
          <div>
            <strong>Demo credentials:</strong><br />
            Farmer: <code>issah@farmconnect.gh</code> / any password<br />
            Buyer: <code>amina@buyer.gh</code> / any password<br />
            Admin: <code>admin@farmconnect.gh</code> / any password
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div className="form-group">
            <label className="form-label">Email address <span className="form-required">*</span></label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
            />
            {errors.email && <span className="form-error"><AlertCircle size={12} />{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="form-required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Your password"
                style={{ paddingRight: '3rem' }}
                {...register('password', { required: 'Password is required', minLength: { value: 4, message: 'Min 4 characters' } })}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error"><AlertCircle size={12} />{errors.password.message}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--green-700)', fontWeight: 600, textDecoration: 'none' }} onMouseEnter={e => e.target.style.textDecoration='underline'} onMouseLeave={e => e.target.style.textDecoration='none'}>
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: 48, fontSize: '1rem' }}>
            {loading ? <><span className="spinner" style={{ width: 20, height: 20 }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="divider" style={{ margin: '1.5rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--green-700)', fontWeight: 700 }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
