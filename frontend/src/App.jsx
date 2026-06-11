import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FloatingCards from './components/FloatingCards';
import StatsBar from './components/StatsBar';
import WallpaperGrid from './components/WallpaperGrid';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { Search, Music, ArrowUp, Sparkles, Users, CheckCircle, Heart, Trash2, LogIn, LogOut, User as UserIcon } from 'lucide-react';

const SearchSection = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const { saveSearch } = useAuth();

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query);
      saveSearch(query);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px 60px' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'border-color 0.2s',
      }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Search albums, artists..."
          disabled={isLoading}
          style={{
            flex: 1, background: 'transparent', color: '#fff',
            padding: '14px 24px', fontSize: '15px',
            outline: 'none', border: 'none',
            fontFamily: 'var(--font-primary)',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !query.trim()}
          style={{
            background: 'var(--color-accent-purple)', border: 'none',
            borderRadius: 'var(--radius-pill)', padding: '10px 24px',
            margin: '4px', cursor: 'pointer', color: '#fff',
            fontFamily: 'var(--font-primary)', fontWeight: '600', fontSize: '14px',
          }}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '12px' }}>
        Try: "DAMN.", "Astroworld", "Illmatic"
      </p>
    </div>
  );
};

const ResultsSection = ({ results, isLoading, hasSearched }) => {
  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{
        width: '48px', height: '48px', border: '4px solid var(--color-accent-purple)',
        borderTopColor: 'transparent', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto',
      }} />
      <p style={{ color: 'var(--color-text-secondary)', marginTop: '16px' }}>Searching...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (hasSearched && results.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>No results found. Try another album!</p>
    </div>
  );

  if (results.length === 0) return null;

  return (
    <div style={{ padding: '0 40px 60px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#fff' }}>Search Results</h2>
      <WallpaperGrid wallpapers={results} />
    </div>
  );
};

const MusicMatchSection = ({ user1Session, user2Session, setUser1Session, setUser2Session }) => {
  const [step, setStep] = useState('initial');
  const [matchResult, setMatchResult] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if (user1Session && user2Session && !isMatching && !matchResult) compareUsers();
  }, [user1Session, user2Session]);

  const handleSpotifyLogin = (userNumber) => {
    window.location.href = `http://localhost:5000/api/spotify/login?user=${userNumber}&show_dialog=true`;
  };

  const compareUsers = async () => {
    setIsMatching(true);
    setStep('matching');
    try {
      const response = await fetch('http://localhost:5000/api/spotify/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session1: user1Session, session2: user2Session }),
      });
      const data = await response.json();
      if (!response.ok) {
        localStorage.removeItem('user1Session');
        localStorage.removeItem('user2Session');
        setUser1Session(null); setUser2Session(null);
        alert('Sessions expired. Please connect again.');
        setStep('initial'); return;
      }
      setMatchResult(data); setStep('results');
    } catch (error) {
      localStorage.removeItem('user1Session');
      localStorage.removeItem('user2Session');
      setUser1Session(null); setUser2Session(null);
      alert('Failed to compare. Please try again.');
      setStep('initial');
    } finally { setIsMatching(false); }
  };

  const resetMatch = () => {
    setUser1Session(null); setUser2Session(null);
    setMatchResult(null); setStep('initial');
    localStorage.removeItem('user1Session');
    localStorage.removeItem('user2Session');
  };

  const cardStyle = (active, color) => ({
    background: active ? `rgba(${color}, 0.1)` : 'rgba(255,255,255,0.03)',
    border: `1px solid ${active ? `rgba(${color}, 0.4)` : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center',
    transition: 'all 0.3s',
  });

  return (
    <div style={{ padding: '80px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-block', fontSize: '11px', letterSpacing: '2px',
          textTransform: 'uppercase', color: 'var(--color-accent-purple)',
          background: 'var(--color-accent-purple-dim)',
          border: '1px solid rgba(180,0,255,0.25)',
          borderRadius: 'var(--radius-pill)', padding: '5px 16px', marginBottom: '16px',
        }}>
          Music Match
        </div>
        <h2 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-1px', marginBottom: '12px' }}>
          Match Your Taste
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
          Connect Spotify and find out how compatible your music taste is
        </p>
      </div>

      {step === 'initial' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={cardStyle(!!user1Session, '180,0,255')}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: user1Session ? 'var(--color-accent-purple)' : 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {user1Session ? <CheckCircle size={36} color="#fff" /> : <Users size={36} color="#fff" />}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>User 1</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              {user1Session ? '✓ Connected' : 'Connect your Spotify'}
            </p>
            {!user1Session ? (
              <button onClick={() => handleSpotifyLogin(1)} style={{
                width: '100%', background: 'var(--color-accent-purple)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-pill)', padding: '12px',
                fontFamily: 'var(--font-primary)', fontWeight: '600', cursor: 'pointer',
              }}>Connect Spotify</button>
            ) : (
              <p style={{ color: 'var(--color-accent-purple)', fontWeight: '600' }}>
                {user2Session ? 'Both connected!' : 'Waiting for User 2...'}
              </p>
            )}
          </div>

          <div style={cardStyle(!!user2Session, '0,200,255')}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: user2Session ? 'var(--color-accent-cyan)' : 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {user2Session ? <CheckCircle size={36} color="#fff" /> : <Users size={36} color="#fff" />}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>User 2</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              {user2Session ? '✓ Connected' : 'Connect your Spotify'}
            </p>
            {!user2Session ? (
              <button onClick={() => handleSpotifyLogin(2)} style={{
                width: '100%', background: 'var(--color-accent-cyan)', color: '#000',
                border: 'none', borderRadius: 'var(--radius-pill)', padding: '12px',
                fontFamily: 'var(--font-primary)', fontWeight: '600', cursor: 'pointer',
              }}>Connect Spotify</button>
            ) : (
              <p style={{ color: 'var(--color-accent-cyan)', fontWeight: '600' }}>
                {user1Session ? 'Both connected!' : 'Waiting for User 1...'}
              </p>
            )}
          </div>
        </div>
      )}

      {step === 'matching' && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{
            width: '80px', height: '80px', border: '6px solid var(--color-accent-purple)',
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 24px',
          }} />
          <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Analyzing your taste...</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Comparing top artists and genres</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {step === 'results' && matchResult && (
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <div>
              <div style={{ fontSize: '48px', fontWeight: '700', lineHeight: 1 }}>{matchResult.percentage}%</div>
              <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>Match</div>
            </div>
          </div>

          <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            {matchResult.percentage >= 80 && '🔥 Music Soulmates!'}
            {matchResult.percentage >= 60 && matchResult.percentage < 80 && '🎵 Great Chemistry!'}
            {matchResult.percentage < 60 && '🎧 Opposites Attract!'}
          </h3>

          {matchResult.commonArtists?.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-lg)', padding: '24px', margin: '24px 0', textAlign: 'left',
            }}>
              <h4 style={{ marginBottom: '16px', fontWeight: '600' }}>Common Artists</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {matchResult.commonArtists.map((artist, idx) => (
                  <span key={idx} style={{
                    background: 'var(--color-accent-purple-dim)', color: 'var(--color-accent-purple)',
                    border: '1px solid rgba(180,0,255,0.25)', borderRadius: 'var(--radius-pill)',
                    padding: '6px 16px', fontSize: '13px',
                  }}>{artist}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={resetMatch} style={{
              background: 'var(--color-accent-purple)', color: '#fff', border: 'none',
              borderRadius: 'var(--radius-pill)', padding: '12px 28px',
              fontFamily: 'var(--font-primary)', fontWeight: '600', cursor: 'pointer',
            }}>Match Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [wallpapers, setWallpapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [user1Session, setUser1Session] = useState(null);
  const [user2Session, setUser2Session] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const searchRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');
    const error = params.get('error');
    if (error) { alert(`Auth failed: ${error}`); return; }
    if (session) {
      if (session.startsWith('user1_')) { setUser1Session(session); localStorage.setItem('user1Session', session); }
      else if (session.startsWith('user2_')) { setUser2Session(session); localStorage.setItem('user2Session', session); }
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      const s1 = localStorage.getItem('user1Session');
      const s2 = localStorage.getItem('user2Session');
      if (s1) setUser1Session(s1);
      if (s2) setUser2Session(s2);
    }
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:5000/api/wallpapers/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setWallpapers(data);
    } catch (error) {
      console.error('Search failed:', error);
      setWallpapers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', color: '#fff', fontFamily: 'var(--font-primary)' }}>
      <Navbar
        onEnter={scrollToSearch}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={logout}
      />
      <Hero onExplore={scrollToSearch} />
      <FloatingCards />
      <StatsBar />

      {/* search */}
      <div ref={searchRef} style={{ paddingTop: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', marginBottom: '8px' }}>
            Find Your Album
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Search and turn any album into a wallpaper</p>
        </div>
        <SearchSection onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <ResultsSection results={wallpapers} isLoading={isLoading} hasSearched={hasSearched} />

      <MusicMatchSection
        user1Session={user1Session}
        user2Session={user2Session}
        setUser1Session={setUser1Session}
        setUser2Session={setUser2Session}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default App;