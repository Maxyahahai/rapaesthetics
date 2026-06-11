import { useState } from 'react';
import { X, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = isLogin
        ? await login(formData.email, formData.password)
        : await signup(formData.username, formData.email, formData.password);
      if (result.success) {
        onClose();
        setFormData({ username: '', email: '', password: '' });
      } else {
        setError(result.message);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ username: '', email: '', password: '' });
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    color: '#fff', padding: '12px 16px 12px 44px',
    fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)', outline: 'none',
    fontFamily: 'var(--font-primary)', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: '13px',
    color: 'var(--color-text-secondary)', marginBottom: '8px',
  };

  const iconStyle = {
    position: 'absolute', left: '14px', top: '50%',
    transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)',
    pointerEvents: 'none',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px', width: '100%', maxWidth: '420px',
          position: 'relative',
        }}
      >
        {/* close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)', padding: '4px',
        }}>
          <X size={20} />
        </button>

        {/* glow */}
        <div style={{
          position: 'absolute', width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(180,0,255,0.1) 0%, transparent 70%)',
          top: '-40px', right: '-40px', pointerEvents: 'none',
        }} />

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
            Rap<span style={{ color: 'var(--color-accent-purple)' }}>Aesthetics</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            {isLogin ? 'Login to save your favorites' : 'Join and start building your collection'}
          </p>
        </div>

        {/* error */}
        {error && (
          <div style={{
            background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)',
            color: '#ff6b6b', borderRadius: 'var(--radius-md)',
            padding: '12px 16px', fontSize: '13px', marginBottom: '20px',
          }}>
            {error}
          </div>
        )}

        {/* form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={iconStyle} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a username"
                  required={!isLogin}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-accent-purple)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={iconStyle} />
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-accent-purple)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={iconStyle} />
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-accent-purple)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            {!isLogin && (
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                Must be at least 6 characters
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', background: 'var(--color-accent-purple)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)',
              padding: '13px', fontSize: '14px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-primary)',
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '4px',
            }}
          >
            {loading ? (
              <div style={{
                width: '18px', height: '18px',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            ) : (
              <>
                {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                {isLogin ? 'Login' : 'Sign Up'}
              </>
            )}
          </button>
        </div>

        {/* toggle */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={toggleMode} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-accent-purple)', fontWeight: '600',
            fontFamily: 'var(--font-primary)', fontSize: '13px',
          }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.div>
    </div>
  );
};

export default AuthModal;