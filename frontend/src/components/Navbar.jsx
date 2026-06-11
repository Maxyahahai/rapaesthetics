import { motion } from 'framer-motion';

const Navbar = () => {
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
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
        Rap<span style={{ color: 'var(--color-accent-purple)' }}>Aesthetics</span>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {['Explore', 'Charts', 'Artists', 'Wallpapers'].map((item) => (
          
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

      <button
        style={{
          background: 'var(--color-accent-purple)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          padding: '9px 22px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          fontFamily: 'var(--font-primary)',
        }}
      >
        Connect Spotify
      </button>
    </motion.nav>
  );
};

export default Navbar;