import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// get client credentials token (no user login needed)
const getToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    }
  );
  return response.data.access_token;
};

// featured albums endpoint
router.get('/albums', async (req, res) => {
  try {
    const token = await getToken();

   const albumIds = [
  '4eLPsYPBmXABThSJ821sqY', // DAMN. - Kendrick
  '41GuZcammIkupMPKH2OJ6I', // Astroworld - Travis
  '5zi7WsKlIiUXv09tbGLKsE', // Igor - Tyler
  '1ATL5GLyefJaxhQzSPVrLX', // Scorpion - Drake
  '4RVnAU35WRWra6OZ3CbbMA', // Graduation - Kanye
  '4SZko61aMnmgvNhfhgTuD3', // SOS - SZA
  '3RQQmkQEvNCY4prGKE6oc5', // Mr. Morale - Kendrick
  '6MnnkXHBXsSShgPiQNHOH1', // Nayaab - Seedhe Maut
  '5U4ZWKgrnmAdWNyLBG7DAU', // Yours Truly - KR$NA
  '0XDtCjokUgSrL527Ftk0xE', // Kohinoor - Divine
].join(',');
    const response = await axios.get(
      `https://api.spotify.com/v1/albums?ids=${albumIds}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

   const albums = response.data.albums
  .filter(album => album !== null)
  .map(album => ({
    id: album.id,
    name: album.name,
    artist: album.artists[0].name,
    img: album.images[0].url,
    type: 'Album',
  }));

    res.json(albums);
  } catch (error) {
    console.error('Featured albums error:', error.message);
    res.status(500).json({ error: 'Failed to fetch featured albums' });
  }
});

export default router;