import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Clock, Sparkles, ChevronRight } from 'lucide-react';
// import WallpaperGrid from './components/WallpaperGrid';

const FeaturedSection = ({ title, icon: Icon, wallpapers, onViewAll }) => {
  if (!wallpapers || wallpapers.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <Icon className="text-purple-500" size={28} />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
          >
            View All
            <ChevronRight size={20} />
          </button>
        )}
      </div>
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {wallpapers.slice(0, 6).map((wall, idx) => (
            <div
              key={idx}
              className="group relative rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105 shadow-lg"
            >
              <img
                src={wall.imageUrl}
                alt={wall.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm truncate">{wall.title}</h3>
                  <p className="text-gray-300 text-xs truncate">{wall.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CollectionCard = ({ title, albums, gradient }) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden cursor-pointer transform transition hover:scale-105 shadow-xl`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
      <div className="relative p-6 h-48 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white text-sm opacity-90">{albums.length} Albums</p>
        </div>
        <div className="flex -space-x-3">
          {albums.slice(0, 4).map((album, idx) => (
            <img
              key={idx}
              src={album.imageUrl}
              alt={album.title}
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsBar = () => {
  const [stats, setStats] = useState({
    wallpapers: 0,
    users: 0,
    favorites: 0
  });

  useEffect(() => {
    // Fetch real stats from backend
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        // Fallback to demo numbers
        setStats({
          wallpapers: 1240,
          users: 350,
          favorites: 5600
        });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 mb-12 mx-4">
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.wallpapers.toLocaleString()}+
          </div>
          <div className="text-sm text-gray-400">Wallpapers Created</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.users.toLocaleString()}+
          </div>
          <div className="text-sm text-gray-400">Happy Users</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.favorites.toLocaleString()}+
          </div>
          <div className="text-sm text-gray-400">Favorites Saved</div>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ onSearch }) => {
  const [trending, setTrending] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [loading, setLoading] = useState(true);

  const featuredCollections = [
    {
      title: "90s Classics",
      gradient: "from-orange-600 to-red-600",
      albums: [
        { title: "Illmatic", artist: "Nas", imageUrl: "https://i.scdn.co/image/ab67616d0000b2734ca68d59a4a29c856a4a39c2" },
        { title: "Ready to Die", artist: "The Notorious B.I.G.", imageUrl: "https://i.scdn.co/image/ab67616d0000b273d4c0f0e21559010860d91a46" },
        { title: "The Chronic", artist: "Dr. Dre", imageUrl: "https://i.scdn.co/image/ab67616d0000b2737dbc0e4496d1a53687e6087b" },
        { title: "Doggystyle", artist: "Snoop Dogg", imageUrl: "https://i.scdn.co/image/ab67616d0000b2733c8c6f1e6a7f4dfb2e9e4f9c" }
      ]
    },
    {
      title: "Modern Legends",
      gradient: "from-purple-600 to-pink-600",
      albums: [
        { title: "GKMC", artist: "Kendrick Lamar", imageUrl: "https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797" },
        { title: "Astroworld", artist: "Travis Scott", imageUrl: "https://i.scdn.co/image/ab67616d0000b27372d30546c8750c6a452bb850" },
        { title: "DAMN.", artist: "Kendrick Lamar", imageUrl: "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699" },
        { title: "Graduation", artist: "Kanye West", imageUrl: "https://i.scdn.co/image/ab67616d0000b273c5cd4e7e42d0bd3db88a5d89" }
      ]
    },
    {
      title: "Underground Heat",
      gradient: "from-green-600 to-teal-600",
      albums: [
        { title: "Pray for Paris", artist: "Westside Gunn", imageUrl: "https://i.scdn.co/image/ab67616d0000b273d0e3d2d90e7b4e3e5e6e5e6e" },
        { title: "The Forever Story", artist: "JID", imageUrl: "https://i.scdn.co/image/ab67616d0000b273a52af6676e6c6b9c5d2f4e5e" },
        { title: "Some Rap Songs", artist: "Earl Sweatshirt", imageUrl: "https://i.scdn.co/image/ab67616d0000b273d8e8e5e6e7e8e9e0e1e2e3e4" },
        { title: "Manger on McNichols", artist: "Boldy James", imageUrl: "https://i.scdn.co/image/ab67616d0000b273e8e9e0e1e2e3e4e5e6e7e8e9" }
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending wallpapers
        const trendingRes = await fetch('http://localhost:5000/api/wallpapers/trending');
        const trendingData = await trendingRes.json();
        setTrending(trendingData);

        // Fetch recently added
        const recentRes = await fetch('http://localhost:5000/api/wallpapers/recent');
        const recentData = await recentRes.json();
        setRecentlyAdded(recentData);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        // Use mock data for demo
        const mockWallpapers = [
          { title: "Illmatic", artist: "Nas", imageUrl: "https://i.scdn.co/image/ab67616d0000b2734ca68d59a4a29c856a4a39c2" },
          { title: "GKMC", artist: "Kendrick Lamar", imageUrl: "https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479743797" },
          { title: "Ready to Die", artist: "Biggie", imageUrl: "https://i.scdn.co/image/ab67616d0000b273d4c0f0e21559010860d91a46" },
          { title: "DAMN.", artist: "Kendrick Lamar", imageUrl: "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699" },
          { title: "Astroworld", artist: "Travis Scott", imageUrl: "https://i.scdn.co/image/ab67616d0000b27372d30546c8750c6a452bb850" },
          { title: "The Chronic", artist: "Dr. Dre", imageUrl: "https://i.scdn.co/image/ab67616d0000b2737dbc0e4496d1a53687e6087b" }
        ];
        setTrending(mockWallpapers);
        setRecentlyAdded(mockWallpapers);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 mt-4">Loading amazing content...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <StatsBar />
      
      <FeaturedSection
        title="🔥 Trending This Week"
        icon={TrendingUp}
        wallpapers={trending}
      />

      <div className="mb-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-purple-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Featured Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCollections.map((collection, idx) => (
            <CollectionCard key={idx} {...collection} />
          ))}
        </div>
      </div>

      <FeaturedSection
        title="⏰ Recently Added"
        icon={Clock}
        wallpapers={recentlyAdded}
      />
    </div>
  );
};

export default HomePage;