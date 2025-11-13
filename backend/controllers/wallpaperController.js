import Wallpaper from "../models/wallpaperModel.js";
import axios from "axios";

// GET all wallpapers
export const getWallpapers = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find();
    res.json(wallpapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH wallpapers
export const searchWallpapers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Get Spotify token
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );

    const token = tokenResponse.data.access_token;

    // Search Spotify for albums
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=album&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Format response
    const wallpapers = searchResponse.data.albums.items.map((album) => ({
      title: album.name,
      artist: album.artists[0]?.name,
      album: album.name,
      imageUrl: album.images[0]?.url,
      spotifyUrl: album.external_urls.spotify,
    }));

    res.json(wallpapers);
  } catch (error) {
    console.error("Search error:", error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

// POST a new wallpaper
export const addWallpaper = async (req, res) => {
  try {
    const wallpaper = new Wallpaper(req.body);
    await wallpaper.save();
    res.status(201).json(wallpaper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
