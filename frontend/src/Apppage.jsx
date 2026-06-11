import React, { useState, useRef, useEffect } from "react";
import { Search, Music, ArrowUp, Heart, Sparkles, Users, CheckCircle, Trash2, LogIn, LogOut, User as UserIcon } from "lucide-react";
import WallpaperGrid from "./components/WallpaperGrid";
import AuthModal from "./components/AuthModal";
import HomePage from "./components/HomePage";
import { useAuth } from "./context/AuthContext";

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");
  const { saveSearch } = useAuth();

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query);
      saveSearch(query);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="relative">
        <div className="flex items-center bg-gray-800 rounded-full shadow-2xl border border-gray-700 focus-within:border-purple-500 transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Search for your favorite album..."
            className="flex-1 bg-transparent text-white px-6 py-4 text-lg outline-none placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-full p-4 m-1 transition-all"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Search size={24} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Try searching: "Illmatic", "good kid m.A.A.d city", "Still Here"
        </p>
      </div>
    </div>
  );
};

const ResultsSection = ({ results, isLoading, hasSearched }) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4">Searching...</p>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">No results found. Try another album!</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6 px-2">Search Results</h2>
      <WallpaperGrid wallpapers={results} />
    </div>
  );
};

const MusicMatchSection = ({ onBackToWallpapers, user1Session, user2Session, setUser1Session, setUser2Session }) => {
  const [step, setStep] = useState("initial");
  const [matchResult, setMatchResult] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if (user1Session && user2Session && !isMatching && !matchResult) {
      compareUsers();
    }
  }, [user1Session, user2Session]);

  const handleSpotifyLogin = (userNumber) => {
    console.log(`Redirecting User ${userNumber} to Spotify login...`);
    window.location.href = `http://localhost:5000/api/spotify/login?user=${userNumber}&show_dialog=true`;
  };

  const compareUsers = async () => {
    setIsMatching(true);
    setStep("matching");

    try {
      const response = await fetch('http://localhost:5000/api/spotify/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session1: user1Session,
          session2: user2Session,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem('user1Session');
        localStorage.removeItem('user2Session');
        setUser1Session(null);
        setUser2Session(null);
        alert('Sessions expired or not found. Please connect both users again.');
        setStep("initial");
        return;
      }

      setMatchResult(data);
      setStep("results");
    } catch (error) {
      console.error('Comparison failed:', error);
      localStorage.removeItem('user1Session');
      localStorage.removeItem('user2Session');
      setUser1Session(null);
      setUser2Session(null);
      alert('Failed to compare music taste. Sessions may have expired. Please connect again.');
      setStep("initial");
    } finally {
      setIsMatching(false);
    }
  };

  const resetMatch = () => {
    setUser1Session(null);
    setUser2Session(null);
    setMatchResult(null);
    setStep("initial");
    localStorage.removeItem('user1Session');
    localStorage.removeItem('user2Session');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-black to-black text-white py-12 px-4">
      <button
        onClick={onBackToWallpapers}
        className="fixed top-6 left-6 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg z-50"
      >
        <ArrowUp size={20} />
        Back to Wallpapers
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Music className="text-green-500" size={48} />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Match Your Taste
            </h2>
          </div>
          <p className="text-gray-400 text-lg">
            Connect your Spotify and find out how compatible your music taste is!
          </p>
        </div>

        {step === "initial" && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`bg-gray-900 p-8 rounded-2xl border-2 transition-all ${
              user1Session ? 'border-green-500 bg-green-950' : 'border-gray-800 hover:border-green-500'
            }`}>
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  user1Session ? 'bg-green-500' : 'bg-gray-700'
                }`}>
                  {user1Session ? <CheckCircle size={40} className="text-white" /> : <Users size={40} className="text-white" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">User 1</h3>
                <p className="text-gray-400">
                  {user1Session ? '✓ Connected' : 'Connect your Spotify account'}
                </p>
              </div>
              {!user1Session ? (
                <button
                  onClick={() => handleSpotifyLogin(1)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-green-500/50"
                >
                  Connect Spotify
                </button>
              ) : (
                <div className="text-center text-green-400 font-semibold">
                  {user2Session ? 'Both Connected! Comparing...' : 'Waiting for User 2...'}
                </div>
              )}
            </div>

            <div className={`bg-gray-900 p-8 rounded-2xl border-2 transition-all ${
              user2Session ? 'border-purple-500 bg-purple-950' : 'border-gray-800 hover:border-purple-500'
            }`}>
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  user2Session ? 'bg-purple-500' : 'bg-gray-700'
                }`}>
                  {user2Session ? <CheckCircle size={40} className="text-white" /> : <Users size={40} className="text-white" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">User 2</h3>
                <p className="text-gray-400">
                  {user2Session ? '✓ Connected' : 'Connect your Spotify account'}
                </p>
              </div>
              {!user2Session ? (
                <button
                  onClick={() => handleSpotifyLogin(2)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-purple-500/50"
                >
                  Connect Spotify
                </button>
              ) : (
                <div className="text-center text-purple-400 font-semibold">
                  {user1Session ? 'Both Connected! Comparing...' : 'Waiting for User 1...'}
                </div>
              )}
            </div>
          </div>
        )}

        {step === "matching" && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 border-8 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-400" size={48} />
            </div>
            <h3 className="text-3xl font-bold mb-4">Analyzing your music taste...</h3>
            <p className="text-gray-400">Comparing your top artists and genres</p>
          </div>
        )}

        {step === "results" && matchResult && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-6">
                {matchResult.percentage >= 80 && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Heart className="text-red-500 fill-red-500" size={64} />
                  </div>
                )}
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50">
                  <div className="text-center">
                    <div className="text-6xl font-bold">{matchResult.percentage}%</div>
                    <div className="text-sm uppercase tracking-wider">Match</div>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">
                {matchResult.percentage >= 80 && "🔥 Music Soulmates! 🔥"}
                {matchResult.percentage >= 60 && matchResult.percentage < 80 && "Great Musical Chemistry! 🎵"}
                {matchResult.percentage < 60 && "Opposites Attract! 🎧"}
              </h3>
              <p className="text-gray-400">
                {matchResult.percentage >= 80 && "You two have incredible taste! Almost identical vibes."}
                {matchResult.percentage >= 60 && matchResult.percentage < 80 && "Solid match! You'd vibe to a lot of the same tracks."}
                {matchResult.percentage < 60 && "Different tastes make for great music discovery together!"}
              </p>
            </div>

            {matchResult.commonArtists && matchResult.commonArtists.length > 0 && (
              <div className="bg-gray-900 p-8 rounded-2xl border-2 border-gray-800 mb-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="text-yellow-400" size={24} />
                  Common Artists
                </h4>
                <div className="flex flex-wrap gap-3">
                  {matchResult.commonArtists.map((artist, idx) => (
                    <span key={idx} className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/50">
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {matchResult.commonGenres && matchResult.commonGenres.length > 0 && (
              <div className="bg-gray-900 p-8 rounded-2xl border-2 border-gray-800 mb-6">
                <h4 className="text-xl font-bold mb-4">Common Genres</h4>
                <div className="flex flex-wrap gap-3">
                  {matchResult.commonGenres.map((genre, idx) => (
                    <span key={idx} className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full border border-purple-500/50">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={resetMatch}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full transition-all"
              >
                Match Again
              </button>
              <button
                onClick={onBackToWallpapers}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-3 rounded-full transition-all"
              >
                Back to Wallpapers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function AppPage() {
  const [wallpapers, setWallpapers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showMusicMatch, setShowMusicMatch] = useState(false);
  const [user1Session, setUser1Session] = useState(null);
  const [user2Session, setUser2Session] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  
  const wallpaperSectionRef = useRef(null);
  const musicSectionRef = useRef(null);

  const clearAllSessions = () => {
    console.log('🧹 Clearing all sessions...');
    localStorage.removeItem('user1Session');
    localStorage.removeItem('user2Session');
    setUser1Session(null);
    setUser2Session(null);
    setShowMusicMatch(false);
    alert('All sessions cleared! You can start fresh now.');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session');
    const error = params.get('error');

    if (error) {
      alert(`Authentication failed: ${error}`);
      clearAllSessions();
      return;
    }

    if (session) {
      if (session.startsWith('user1_')) {
        setUser1Session(session);
        localStorage.setItem('user1Session', session);
      } else if (session.startsWith('user2_')) {
        setUser2Session(session);
        localStorage.setItem('user2Session', session);
      }

      setShowMusicMatch(true);
      window.history.replaceState({}, '', window.location.pathname);
      
      setTimeout(() => {
        musicSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const savedUser1 = localStorage.getItem('user1Session');
      const savedUser2 = localStorage.getItem('user2Session');
      
      if (savedUser1) setUser1Session(savedUser1);
      if (savedUser2) setUser2Session(savedUser2);
      
      if (savedUser1 || savedUser2) {
        setShowMusicMatch(true);
      }
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
      console.error("Search failed:", error);
      setWallpapers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToMusicMatch = () => {
    setShowMusicMatch(true);
    setTimeout(() => {
      musicSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const scrollToWallpapers = () => {
    wallpaperSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
      <div ref={wallpaperSectionRef}>
       <header style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div className="text-center">
            <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>
  Rap<span style={{ color: 'var(--color-accent-purple)' }}>Aesthetics</span>
</h1>
            <p className="mt-2 text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(192,38,211,0.5)]">
              Transform your favorite hip-hop albums into stunning wallpapers
            </p>
          </div>
          
          <button
            onClick={clearAllSessions}
            className="absolute top-6 left-6 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all shadow-lg"
            title="Clear all music match sessions"
          >
            <Trash2 size={16} />
            Clear Sessions
          </button>
          
          <div className="absolute top-6 right-6 flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full">
                  <UserIcon size={18} className="text-purple-400" />
                  <span className="text-sm font-semibold">{user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-full flex items-center gap-2 transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg"
              >
                <LogIn size={20} />
                Login / Sign Up
              </button>
            )}
            
            <button
              onClick={scrollToMusicMatch}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-green-500/50 hover:shadow-green-500/70 animate-pulse hover:animate-none"
            >
              <Music size={20} />
              Match Your Taste
            </button>
          </div>
        </header>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {/* 🔥 THIS IS THE KEY CHANGE - Show HomePage when no search, Results when searched */}
        {!hasSearched ? (
          <HomePage onSearch={handleSearch} />
        ) : (
          <ResultsSection 
            results={wallpapers} 
            isLoading={isLoading}
            hasSearched={hasSearched}
          />
        )}
      </div>

      {showMusicMatch && (
        <div ref={musicSectionRef}>
          <MusicMatchSection 
            onBackToWallpapers={scrollToWallpapers}
            user1Session={user1Session}
            user2Session={user2Session}
            setUser1Session={setUser1Session}
            setUser2Session={setUser2Session}
          />
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default AppPage;