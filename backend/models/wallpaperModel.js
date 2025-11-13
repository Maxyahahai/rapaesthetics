import mongoose from "mongoose";

const wallpaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String },
  album: { type: String },
  year: { type: Number },
  imageUrl: { type: String, required: true },
  tags: [String],
  source: { type: String, default: "api" },
});

const Wallpaper = mongoose.model("Wallpaper", wallpaperSchema);

export default Wallpaper;
