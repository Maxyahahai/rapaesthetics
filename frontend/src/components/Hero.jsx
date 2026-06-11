import { motion } from 'framer-motion';

const Hero = ({ onExplore }) => {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 40px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* glow blobs */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(180,0,255,0.12) 0%, transparent 70%)',
        top: '-100px', left: '-100px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,200,255,0.08) 0%, transparent 70%)',
        bottom: '-80px', right: '0px', pointerEvents: 'none',
      }} />

      {/* tag */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: 'inline-block',
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: 'var(--color-accent-purple)',
          background: 'var(--color-accent-purple-dim)',
          border: '1px solid rgba(180,0,255,0.25)',
          borderRadius: 'var(--radius-pill)',
          padding: '5px 16px', marginBottom: '24px',
        }}
      >
        Powered by Spotify
      </motion.div>

      {/* title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: '700',
          lineHeight: '1.1',
          letterSpacing: '-2px',
          marginBottom: '20px',
        }}
      >
        The sound is{' '}
        <span style={{
          background: 'linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          dark.
        </span>
        <br />
        The vibe is raw.
      </motion.h1>

      {/* subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          maxWidth: '480px',
          lineHeight: '1.7',
          marginBottom: '36px',
        }}
      >
        Discover rap culture — albums, artists, and the aesthetics behind the music.
      </motion.p>

      {/* cta buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <button
          onClick={onExplore}
          style={{
            background: 'var(--color-accent-purple)',
            color: '#fff', border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 28px', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'var(--font-primary)',
            transition: 'transform var(--transition-fast), background var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Explore Now
        </button>

        <button
          onClick={onExplore}
          style={{
            background: 'transparent',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 28px', fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', fontFamily: 'var(--font-primary)',
            transition: 'border-color var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent-purple)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          Browse Artists
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;