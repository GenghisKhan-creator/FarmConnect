import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Sprout, Eye, EyeOff, AlertCircle, Tractor, ShoppingBag } from 'lucide-react';

export default function Register() {
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState(searchParams.get('role') || 'farmer');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser({ ...data, role, name: `${data.firstName} ${data.lastName}` });
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-fade-in" style={{ maxWidth: 500 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, var(--green-600), var(--green-400))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Sprout size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Create Account</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Join FarmConnect GH today – free!</p>
        </div>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { key: 'farmer', label: 'I am a Farmer', icon: <Tractor size={18} />, desc: 'List and sell produce' },
            { key: 'buyer', label: 'I am a Buyer', icon: <ShoppingBag size={18} />, desc: 'Discover & buy products' },
          ].map(r => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRole(r.key)}
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${role === r.key ? 'var(--green-500)' : 'var(--border)'}`,
                background: role === r.key ? 'var(--green-50)' : 'var(--surface)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                textAlign: 'left',
              }}
            >
              <div style={{ color: role === r.key ? 'var(--green-600)' : 'var(--slate-500)', marginBottom: '0.375rem' }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: role === r.key ? 'var(--green-800)' : 'var(--slate-700)' }}>{r.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{r.desc}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">First Name <span className="form-required">*</span></label>
              <input
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Issah"
                {...register('firstName', { required: 'Required' })}
              />
              {errors.firstName && <span className="form-error"><AlertCircle size={12} />{errors.firstName.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name <span className="form-required">*</span></label>
              <input
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Abubakari"
                {...register('lastName', { required: 'Required' })}
              />
              {errors.lastName && <span className="form-error"><AlertCircle size={12} />{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number <span className="form-required">*</span></label>
            <input
              type="tel"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="0244 123 456"
              {...register('phone', { required: 'Phone is required', pattern: { value: /^0[0-9]{9}$/, message: 'Enter a valid Ghana number (e.g. 0244123456)' } })}
            />
            {errors.phone && <span className="form-error"><AlertCircle size={12} />{errors.phone.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com (optional)"
              {...register('email', { pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
            />
            {errors.email && <span className="form-error"><AlertCircle size={12} />{errors.email.message}</span>}
          </div>

          {role === 'farmer' && (
            <div className="form-group">
              <label className="form-label">Farm Name <span className="form-required">*</span></label>
              <input
                className={`form-input ${errors.farmName ? 'error' : ''}`}
                placeholder="e.g. Issah Farms"
                {...register('farmName', { required: role === 'farmer' ? 'Farm name is required' : false })}
              />
              {errors.farmName && <span className="form-error"><AlertCircle size={12} />{errors.farmName.message}</span>}
            </div>
          )}

          {role === 'buyer' && (
            <div className="form-group">
              <label className="form-label">Business Name</label>
              <input className="form-input" placeholder="e.g. Amina Traders (optional)" {...register('businessName')} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Location / Town <span className="form-required">*</span></label>
            <input
              className={`form-input ${errors.location ? 'error' : ''}`}
              placeholder="e.g. Tumu, Wa, Lawra"
              {...register('location', { required: 'Location is required' })}
            />
            {errors.location && <span className="form-error"><AlertCircle size={12} />{errors.location.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="form-required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a strong password"
                style={{ paddingRight: '3rem' }}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error"><AlertCircle size={12} />{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password <span className="form-required">*</span></label>
            <input
              type="password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Repeat your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: v => v === password || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <span className="form-error"><AlertCircle size={12} />{errors.confirmPassword.message}</span>}
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              <span style={{ fontSize: '0.875rem' }}>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: 48, fontSize: '1rem', marginTop: '0.25rem' }}>
            {loading ? <><span className="spinner" style={{ width: 20, height: 20 }} /> Creating account...</> : 'Create Account – Free!'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            By registering, you agree to our Terms of Use and Privacy Policy.
          </p>
        </form>

        <div className="divider" style={{ margin: '1.25rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--green-700)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
