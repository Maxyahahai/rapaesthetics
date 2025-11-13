import express from "express";
import axios from "axios";
import querystring from "querystring";

const router = express.Router();

const redirectUri = "http://127.0.0.1:5000/callback";

// Step 1: Redirect user to Spotify login
router.get("/login", (req, res) => {
  const clientId = "12a2e34f88974ae08aac40e6975b1748";
  
  console.log("🔵 Login Route - Client ID:", clientId);
  
  const userNumber = req.query.user || "1";
  const scope = "user-top-read user-read-private";
  
  const state = `user${userNumber}_${Date.now()}`;
  
  // Pre-create the session entry (optional but helpful for debugging)
  global.userSessions[state] = {
    status: "pending",
    created: Date.now(),
    userNumber
  };

  console.log(`🔵 Created pending session: ${state}`);
  console.log(`📊 Total sessions:`, Object.keys(global.userSessions).length);
  
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        show_dialog: req.query.show_dialog || "false"
      })
  );
});

// Step 2: Get user data by session ID
router.get("/user-data/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  
  const userData = global.userSessions[sessionId];

  if (!userData) {
    console.log("❌ Session not found:", sessionId);
    console.log("📋 Available sessions:", Object.keys(global.userSessions));
    return res.status(404).json({ 
      error: "Session not found",
      available: Object.keys(global.userSessions)
    });
  }

  res.json(userData);
});

// Step 3: Compare two users
router.post("/compare", (req, res) => {
  const { session1, session2 } = req.body;

  console.log("\n=== 🔍 COMPARE REQUEST ===");
  console.log("Requested:", { session1, session2 });
  console.log("Available sessions:", Object.keys(global.userSessions));

  const user1 = global.userSessions[session1];
  const user2 = global.userSessions[session2];

  if (!user1) {
    console.error(`❌ Session1 not found: ${session1}`);
    return res.status(404).json({ 
      error: "Session 1 not found",
      requested: session1,
      available: Object.keys(global.userSessions)
    });
  }

  if (!user2) {
    console.error(`❌ Session2 not found: ${session2}`);
    return res.status(404).json({ 
      error: "Session 2 not found",
      requested: session2,
      available: Object.keys(global.userSessions)
    });
  }

  console.log(`✅ Both sessions found!`);
  console.log(`User1 has ${user1.artists?.length || 0} artists`);
  console.log(`User2 has ${user2.artists?.length || 0} artists`);

  // Calculate match percentage
  const user1Artists = user1.artists.map((a) => a.name);
  const user2Artists = user2.artists.map((a) => a.name);

  const commonArtists = user1Artists.filter((artist) =>
    user2Artists.includes(artist)
  );

  // Get all genres
  const user1Genres = [...new Set(user1.artists.flatMap((a) => a.genres))];
  const user2Genres = [...new Set(user2.artists.flatMap((a) => a.genres))];

  const commonGenres = user1Genres.filter((genre) =>
    user2Genres.includes(genre)
  );

  // Calculate percentage (weighted: 60% artists, 40% genres)
  const artistMatch = (commonArtists.length / Math.max(user1Artists.length, user2Artists.length)) * 100;
  const genreMatch = (commonGenres.length / Math.max(user1Genres.length, user2Genres.length)) * 100;

  const totalMatch = Math.round(artistMatch * 0.6 + genreMatch * 0.4);

  console.log(`✅ Match calculated: ${totalMatch}%`);
  console.log(`🎵 Common artists: ${commonArtists.length}`);
  console.log(`🎸 Common genres: ${commonGenres.length}`);

  res.json({
    percentage: totalMatch,
    commonArtists: commonArtists.slice(0, 10),
    commonGenres: commonGenres.slice(0, 8),
    user1TopArtists: user1Artists.slice(0, 5),
    user2TopArtists: user2Artists.slice(0, 5),
  });
});

// Debug endpoint - check what sessions exist
router.get("/debug/sessions", (req, res) => {
  const sessions = global.userSessions || {};
  const sessionInfo = Object.keys(sessions).map(key => ({
    sessionId: key,
    status: sessions[key].status,
    hasArtists: !!sessions[key].artists,
    artistCount: sessions[key].artists?.length || 0,
    created: new Date(sessions[key].created).toLocaleString()
  }));

  res.json({
    totalSessions: sessionInfo.length,
    sessions: sessionInfo,
    rawKeys: Object.keys(sessions)
  });
});

// Token route for wallpapers (existing functionality)
router.get("/token", async (req, res) => {
  const clientId = "12a2e34f88974ae08aac40e6975b1748";
  const clientSecret = "1db5f41e0e68488ab7f71e94c456e044";
  
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Spotify token error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get Spotify token" });
  }
});

export default router;