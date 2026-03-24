import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sprout, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    // Mocking an API call for sending recovery link
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Reset Password</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We'll send you a link to reset your password</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--green-50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <CheckCircle size={32} color="var(--green-600)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Check your email</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              We've sent a password reset link to your email address. Please check your inbox and spam folder.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', height: 48, justifyContent: 'center' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email address <span className="form-required">*</span></label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' } })}
              />
              {errors.email && <span className="form-error"><AlertCircle size={12} />{errors.email.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: 48, fontSize: '1rem', marginTop: '0.5rem' }}>
              {loading ? <><span className="spinner" style={{ width: 20, height: 20 }} /> Sending Link...</> : 'Send Recovery Link'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--slate-700)'} onMouseLeave={e => e.currentTarget.style.color='var(--slate-500)'}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
