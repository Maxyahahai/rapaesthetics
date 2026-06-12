import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ onEnter, isAuthenticated, user, onLogin, onLogout, onExplore, onCharts, onArtists, onWallpapers }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore', action: onExplore },
    { label: 'Charts', action: onCharts },
    { label: 'Artists', action: onArtists },
    { label: 'Wallpapers', action: onWallpapers },
  ];

  const handleNavClick = (action) => {
    action();
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* logo */}
        <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Rap<span style={{ color: 'var(--color-accent-purple)' }}>Aesthetics</span>
        </div>

        {/* desktop nav links */}
        <div className="desktop-nav" style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map((item) => (
            <a
            
              key={item.label}
              onClick={item.action}
              style={{
                fontSize: '14px',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text-secondary)'}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* desktop auth */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

        {/* hamburger — mobile only */}
        <button
          className="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#fff', padding: '4px',
            display: 'none',
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: '57px', left: 0, right: 0,
              background: 'rgba(10,10,10,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              zIndex: 99, padding: '16px 24px 24px',
            }}
          >
            {navLinks.map((item) => (
              <div
                key={item.label}
                onClick={() => handleNavClick(item.action)}
                style={{
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '16px', color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </div>
            ))}

            <div style={{ marginTop: '20px' }}>
              {isAuthenticated ? (
                <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{
                  width: '100%', background: 'transparent', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-pill)',
                  padding: '12px', fontSize: '14px', cursor: 'pointer',
                  fontFamily: 'var(--font-primary)',
                }}>Logout</button>
              ) : (
                <button onClick={() => { onLogin(); setMenuOpen(false); }} style={{
                  width: '100%', background: 'var(--color-accent-purple)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-pill)',
                  padding: '12px', fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'var(--font-primary)',
                }}>Login</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;