import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const fallbackCards = [
  { id: 1, name: 'DAMN.', artist: 'Kendrick Lamar', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699' },
  { id: 2, name: 'Astroworld', artist: 'Travis Scott', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b27372d30546c8750c6a452bb850' },
  { id: 3, name: 'GKMC', artist: 'Kendrick Lamar', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797' },
  { id: 4, name: 'Igor', artist: 'Tyler, The Creator', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b2735b34c9b2e4ba720e7c525a78' },
  { id: 5, name: 'Illmatic', artist: 'Nas', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b2734ca68d59a4a29c856a4a39c2' },
  { id: 6, name: 'Ready To Die', artist: 'Biggie', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b273d4c0f0e21559010860d91a46' },
  { id: 7, name: 'Graduation', artist: 'Kanye West', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b273c5cd4e7e42d0bd3db88a5d89' },
  { id: 8, name: 'KOD', artist: 'J. Cole', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b2737b78b304e239f62e4f80253c' },
  { id: 9, name: 'Flower Boy', artist: 'Tyler, The Creator', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b273b106406e9c0f27643f00d4aa' },
  { id: 10, name: 'Scorpion', artist: 'Drake', type: 'Album', img: 'https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5' },
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
      transition={{ duration: variant.duration, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 }}
      whileHover={{ scale: 1.06, y: -16 }}
      style={{
        width: '140px', flexShrink: 0,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', padding: '14px 12px 12px',
        cursor: 'pointer',
      }}
    >
      <img
        src={card.img}
        alt={card.name}
        onError={e => {
          e.target.style.display = 'none';
          e.target.parentNode.style.background = '#1a0a2e';
        }}
        style={{
          width: '100%', aspectRatio: '1', borderRadius: '10px',
          objectFit: 'cover', marginBottom: '10px', display: 'block',
        }}
      />
      <div style={{
        fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase',
        color: 'var(--color-accent-purple)', background: 'rgba(180,0,255,0.12)',
        borderRadius: '6px', padding: '2px 7px',
        display: 'inline-block', marginBottom: '6px',
      }}>
        {card.type}
      </div>
      <div style={{
        fontSize: '12px', fontWeight: '600', color: '#fff',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '3px',
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
  const [cards, setCards] = useState(fallbackCards);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/featured/albums');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setCards(data);
      } catch (err) {
        console.log('Using fallback cards');
      }
    };
    fetchAlbums();
  }, []);

  const doubled = [...cards, ...cards];

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '32px 0' }}>
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