import express from "express";

const router = express.Router();

// @route   GET /api/wallpapers/search
// @desc    Search for wallpapers
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    // Your existing search logic here (Spotify / MusicBrainz)
    // Just return dummy data for now or connect it later
    res.json([]);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// @route   GET /api/wallpapers/trending
// @desc    Get trending wallpapers (most favorited in last 7 days)
router.get("/trending", async (req, res) => {
  try {
    const db = req.app.locals.db; // ✅ from Mongoose connection
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trending = await db.collection("users").aggregate([
      { $unwind: "$favoriteWallpapers" },
      {
        $match: {
          "favoriteWallpapers.savedAt": { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: "$favoriteWallpapers.id",
          count: { $sum: 1 },
          wallpaper: { $first: "$favoriteWallpapers" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 12 },
      {
        $project: {
          _id: 0,
          id: "$wallpaper.id",
          title: "$wallpaper.title",
          artist: "$wallpaper.artist",
          imageUrl: "$wallpaper.imageUrl",
          resolution: "$wallpaper.resolution",
          favoriteCount: "$count",
        },
      },
    ]).toArray();

    res.json(trending);
  } catch (error) {
    console.error("Trending fetch error:", error);
    res.status(500).json({ message: "Failed to fetch trending wallpapers" });
  }
});

// @route   GET /api/wallpapers/recent
// @desc    Get recently added wallpapers
router.get("/recent", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const recent = await db.collection("users").aggregate([
      { $unwind: "$favoriteWallpapers" },
      { $sort: { "favoriteWallpapers.savedAt": -1 } },
      { $limit: 12 },
      {
        $group: {
          _id: "$favoriteWallpapers.id",
          wallpaper: { $first: "$favoriteWallpapers" },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$wallpaper.id",
          title: "$wallpaper.title",
          artist: "$wallpaper.artist",
          imageUrl: "$wallpaper.imageUrl",
          resolution: "$wallpaper.resolution",
          savedAt: "$wallpaper.savedAt",
        },
      },
    ]).toArray();

    res.json(recent);
  } catch (error) {
    console.error("Recent fetch error:", error);
    res.status(500).json({ message: "Failed to fetch recent wallpapers" });
  }
});

// @route   GET /api/stats
// @desc    Get site statistics
router.get("/stats", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const userCount = await db.collection("users").countDocuments();

    const wallpaperCount = await db.collection("users").aggregate([
      { $unwind: "$favoriteWallpapers" },
      { $group: { _id: "$favoriteWallpapers.id" } },
      { $count: "total" },
    ]).toArray();

    const favoriteCount = await db.collection("users").aggregate([
      { $unwind: "$favoriteWallpapers" },
      { $count: "total" },
    ]).toArray();

    res.json({
      users: userCount,
      wallpapers: wallpaperCount[0]?.total || 0,
      favorites: favoriteCount[0]?.total || 0,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;
