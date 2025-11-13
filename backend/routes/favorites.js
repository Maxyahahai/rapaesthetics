import express from 'express';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes are protected - must be logged in
router.use(authMiddleware);

// @route   GET /api/favorites
// @desc    Get user's favorite wallpapers
router.get('/', async (req, res) => {
  try {
    res.json({ favorites: req.user.favoriteWallpapers });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

// @route   POST /api/favorites
// @desc    Add wallpaper to favorites
router.post('/', async (req, res) => {
  try {
    const { id, title, artist, imageUrl, resolution } = req.body;

    // Check if already favorited
    const alreadyFavorited = req.user.favoriteWallpapers.some(
      fav => fav.id === id
    );

    if (alreadyFavorited) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    // Add to favorites
    req.user.favoriteWallpapers.push({
      id,
      title,
      artist,
      imageUrl,
      resolution,
      savedAt: new Date()
    });

    await req.user.save();

    res.json({ 
      message: 'Added to favorites',
      favorites: req.user.favoriteWallpapers 
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Failed to add to favorites' });
  }
});

// @route   DELETE /api/favorites/:id
// @desc    Remove wallpaper from favorites
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    req.user.favoriteWallpapers = req.user.favoriteWallpapers.filter(
      fav => fav.id !== id
    );

    await req.user.save();

    res.json({ 
      message: 'Removed from favorites',
      favorites: req.user.favoriteWallpapers 
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Failed to remove from favorites' });
  }
});

// @route   POST /api/favorites/search
// @desc    Save search to recent searches
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;

    // Remove duplicates and keep last 10
    req.user.recentSearches = req.user.recentSearches.filter(
      search => search.query !== query
    );

    req.user.recentSearches.unshift({
      query,
      searchedAt: new Date()
    });

    // Keep only last 10 searches
    if (req.user.recentSearches.length > 10) {
      req.user.recentSearches = req.user.recentSearches.slice(0, 10);
    }

    await req.user.save();

    res.json({ 
      message: 'Search saved',
      recentSearches: req.user.recentSearches 
    });
  } catch (error) {
    console.error('Save search error:', error);
    res.status(500).json({ message: 'Failed to save search' });
  }
});

export default router;