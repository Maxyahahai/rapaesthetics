import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import querystring from "querystring";

import wallpaperRoutes from "./routes/wallpaperRoutes.js";
import spotifyRoutes from "./routes/spotifyRoutes.js";
import authRoutes from "./routes/auth.js";
import favoritesRoutes from "./routes/favorites.js";
import wallpapersRouter from "./routes/wallpapers.js"; // ✅ new one
import featuredRoutes from './routes/featuredRoutes.js';

dotenv.config();

console.log("Client ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("Client Secret:", process.env.SPOTIFY_CLIENT_SECRET);

const app = express();

app.use(cors());
app.use(express.json());

// Global session memory
global.userSessions = {};

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    // ✅ Expose native db for aggregation-based routes
    app.locals.db = mongoose.connection.db;
  })
  .catch((err) => console.log("❌ MongoDB error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("RapAesthetics API is live 🎧");
});

// ✅ Spotify callback (no changes)
app.get("/callback", async (req, res) => {
  const clientId = "12a2e34f88974ae08aac40e6975b1748";
  const clientSecret = "1db5f41e0e68488ab7f71e94c456e044";

  const code = req.query.code || null;
  const state = req.query.state || null;

  console.log(`🔵 Callback received - Session: ${state}`);

  if (!state) {
    console.error("❌ No state parameter in callback");
    return res.redirect("http://localhost:5173/?error=state_mismatch");
  }

  console.log(`📋 Available sessions BEFORE auth:`, Object.keys(global.userSessions));

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code: code,
        redirect_uri: "http://127.0.0.1:5000/callback",
        grant_type: "authorization_code",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );

    const accessToken = response.data.access_token;

    console.log(`✅ Got access token for ${state}`);

    const [topArtists, topTracks] = await Promise.all([
      axios.get("https://api.spotify.com/v1/me/top/artists?limit=50", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      axios.get("https://api.spotify.com/v1/me/top/tracks?limit=50", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ]);

    const userData = {
      artists: topArtists.data.items.map((a) => ({
        name: a.name,
        genres: a.genres,
      })),
      tracks: topTracks.data.items.map((t) => t.name),
      status: "authenticated",
      created: Date.now(),
    };

    global.userSessions[state] = userData;

    console.log(`✅ User data stored for session: ${state}`);
    console.log(`🎵 Top artists:`, userData.artists.slice(0, 3).map((a) => a.name));
    console.log(`📊 Total sessions now:`, Object.keys(global.userSessions).length);
    console.log(`📋 All session IDs:`, Object.keys(global.userSessions));

    res.redirect(`http://localhost:5173/?session=${state}`);
  } catch (error) {
    console.error("❌ Spotify callback error full:", {
      data: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      message: error.message,
    });
    const msg = encodeURIComponent(
      error.response?.data?.error_description ||
        error.response?.data?.error ||
        error.message
    );
    res.redirect(`http://localhost:5173/?error=${msg}`);
  }
});

// 🧹 Clean up sessions
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  let cleaned = 0;

  Object.keys(global.userSessions).forEach((key) => {
    if (global.userSessions[key].created < oneHourAgo) {
      delete global.userSessions[key];
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`🧹 Cleaned ${cleaned} old sessions`);
  }
}, 10 * 60 * 1000);

// ✅ Register routes
app.use("/api/wallpapers", wallpaperRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use('/api/featured', featuredRoutes);

// ✅ new ones (aggregation & stats)
app.use("/api/wallpapers", wallpapersRouter);
app.use("/api/stats", wallpapersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// module.exports = app;