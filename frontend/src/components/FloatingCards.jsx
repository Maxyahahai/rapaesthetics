import { motion } from 'framer-motion';

const cards = [
  { id: 1, name: 'DAMN.', artist: 'Kendrick Lamar', type: 'Album', bg: '#1a0a2e', emoji: '🟣' },
  { id: 2, name: 'Certified Lover Boy', artist: 'Drake', type: 'Album', bg: '#2a0808', emoji: '🔴' },
  { id: 3, name: 'KOD', artist: 'J. Cole', type: 'Album', bg: '#1a1400', emoji: '🟡' },
  { id: 4, name: 'Astroworld', artist: 'Travis Scott', type: 'Album', bg: '#000f1a', emoji: '🌊' },
  { id: 5, name: 'Live.Love.A$AP', artist: 'ASAP Rocky', type: 'Artist', bg: '#1a0a0a', emoji: '🌹' },
  { id: 6, name: 'Igor', artist: 'Tyler, The Creator', type: 'Album', bg: '#0a1a0a', emoji: '🌀' },
  { id: 7, name: 'Blonde', artist: 'Frank Ocean', type: 'Album', bg: '#0a0a1a', emoji: '🌙' },
  { id: 8, name: 'Mr. Morale', artist: 'Kendrick Lamar', type: 'Album', bg: '#1a1a0a', emoji: '⚡' },
  { id: 9, name: 'Scorpion', artist: 'Drake', type: 'Album', bg: '#1a0800', emoji: '🔥' },
  { id: 10, name: 'Testing', artist: 'ASAP Rocky', type: 'Album', bg: '#0d0a1a', emoji: '💎' },
];

const floatVariants = [
  { y: [0, -10, 0], duration: 3.2 },
  { y: [0, -14, 0], duration: 2.8 },
  { y: [0, -8, 0], duration: 3.5 },
  { y: [0, -12, 0], duration: 3.0 },
  { y: [0, -10, 0], duration: 2.6 },
];

const Card = ({ card, index }) => {
  const variant = floatVariants[index % floatVariants.length];

  return (
    <motion.div
      animate={{ y: variant.y }}
      transition={{
        duration: variant.duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: index * 0.15,
      }}
      whileHover={{ scale: 1.06, y: -16 }}
      style={{
        width: '140px',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '14px 12px 12px',
        cursor: 'pointer',
        transition: 'border-color 0.25s',
      }}
      onHoverStart={e => {
        e.target.style.borderColor = 'rgba(180,0,255,0.4)';
      }}
      onHoverEnd={e => {
        e.target.style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      <div style={{
        width: '100%', aspectRatio: '1',
        borderRadius: '10px',
        background: card.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px', marginBottom: '10px',
      }}>
        {card.emoji}
      </div>

      <div style={{
        fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase',
        color: 'var(--color-accent-purple)',
        background: 'rgba(180,0,255,0.12)',
        borderRadius: '6px', padding: '2px 7px',
        display: 'inline-block', marginBottom: '6px',
      }}>
        {card.type}
      </div>

      <div style={{
        fontSize: '12px', fontWeight: '600', color: '#fff',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        marginBottom: '3px',
      }}>
        {card.name}
      </div>

      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>
        {card.artist}
      </div>
    </motion.div>
  );
};

const FloatingCards = () => {
  const doubled = [...cards, ...cards];

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '32px 0' }}>
      
      {/* fade edges */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '80px',
        background: 'linear-gradient(to right, var(--color-bg-primary), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, width: '80px',
        background: 'linear-gradient(to left, var(--color-bg-primary), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* scrolling track */}
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: '16px', width: 'max-content' }}
      >
        {doubled.map((card, index) => (
          <Card key={`${card.id}-${index}`} card={card} index={index} />
        ))}
      </motion.div>
    </div>
  );
};

export default FloatingCards;