import express from "express";
import { getWallpapers, addWallpaper, searchWallpapers } from "../controllers/wallpaperController.js";

const router = express.Router();

router.get("/search", searchWallpapers);
router.get("/", getWallpapers);
router.post("/", addWallpaper);

export default router;
