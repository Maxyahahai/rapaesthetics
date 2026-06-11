import { motion } from 'framer-motion';

const stats = [
  { number: '2.4M+', label: 'Tracks Indexed' },
  { number: '840+', label: 'Artists' },
  { number: '50K+', label: 'Wallpapers Generated' },
  { number: 'Live', label: 'Spotify Sync' },
];

const StatsBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '60px',
        padding: '40px 40px 80px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap',
      }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-1px',
            lineHeight: 1,
            marginBottom: '6px',
          }}>
            {stat.number}
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.5px',
          }}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsBar;