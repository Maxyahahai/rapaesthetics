import { motion } from 'framer-motion';

const Navbar = ({ onEnter, isAuthenticated, user, onLogin, onLogout }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* logo */}
      <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
        Rap<span style={{ color: 'var(--color-accent-purple)' }}>Aesthetics</span>
      </div>

      {/* nav links */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {['Explore', 'Charts', 'Artists', 'Wallpapers'].map((item) => (
            <a
          
            key={item}
            href="#"
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
          >
            {item}
          </a>
        ))}
      </div>

      {/* auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isAuthenticated ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-pill)',
              padding: '8px 16px', fontSize: '13px',
            }}>
              <span style={{ color: 'var(--color-accent-purple)' }}>◉</span>
              <span>{user?.username}</span>
            </div>
            <button onClick={onLogout} style={{
              background: 'transparent', color: 'var(--color-text-secondary)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-pill)',
              padding: '8px 18px', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'var(--font-primary)',
            }}>Logout</button>
          </>
        ) : (
          <button onClick={onLogin} style={{
            background: 'var(--color-accent-purple)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-pill)', padding: '9px 22px',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            fontFamily: 'var(--font-primary)',
          }}>Login</button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;