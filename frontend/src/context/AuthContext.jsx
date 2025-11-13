import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const addToFavorites = async (wallpaper) => {
    if (!token) return { success: false, message: 'Please login first' };

    try {
      console.log('📤 Sending add favorite request:', wallpaper);
      
      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(wallpaper)
      });

      const data = await response.json();
      console.log('📥 Add favorite response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to favorites');
      }

      // Update the user state with new favorites
      setUser(prev => ({ 
        ...prev, 
        favoriteWallpapers: data.favorites 
      }));
      
      console.log('✅ Added to favorites! Total:', data.favorites.length);
      return { success: true, message: 'Added to favorites!' };
    } catch (error) {
      console.error('❌ Add to favorites error:', error);
      return { success: false, message: error.message };
    }
  };

  const removeFromFavorites = async (wallpaperId) => {
    if (!token) return { success: false, message: 'Please login first' };

    try {
      console.log('📤 Sending remove favorite request for ID:', wallpaperId);
      
      const response = await fetch(`http://localhost:5000/api/favorites/${wallpaperId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      console.log('📥 Remove favorite response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove from favorites');
      }

      // Update the user state with new favorites
      setUser(prev => ({ 
        ...prev, 
        favoriteWallpapers: data.favorites 
      }));
      
      console.log('✅ Removed from favorites! Remaining:', data.favorites.length);
      return { success: true, message: 'Removed from favorites!' };
    } catch (error) {
      console.error('❌ Remove from favorites error:', error);
      return { success: false, message: error.message };
    }
  };

  // Check if wallpaper is favorited
  const isFavorite = (wallpaperId) => {
    if (!user || !user.favoriteWallpapers) return false;
    return user.favoriteWallpapers.some(fav => fav.id === wallpaperId);
  };

  const saveSearch = async (query) => {
    if (!token) return;

    try {
      await fetch('http://localhost:5000/api/favorites/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    saveSearch
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};