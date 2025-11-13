import React, { useState, useRef, useEffect } from "react";
import { Download, X, Smartphone, Monitor, Tablet, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ImageEditorModal = ({ image, onClose }) => {
  const canvasRef = useRef(null);
  const [selectedPreset, setSelectedPreset] = useState("custom");
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(new Image());

  const presets = {
    "hd": { width: 1366, height: 768, label: "HD (1366x768)", icon: Monitor },
    "fhd": { width: 1920, height: 1080, label: "Full HD (1080p)", icon: Monitor },
    "2k": { width: 2560, height: 1440, label: "2K (1440p)", icon: Monitor },
    "4k": { width: 3840, height: 2160, label: "4K (2160p)", icon: Monitor },
    "ultrawide": { width: 3440, height: 1440, label: "Ultrawide", icon: Monitor },
    "macbook": { width: 2880, height: 1800, label: "MacBook Pro", icon: Monitor },
  };

  useEffect(() => {
    imgRef.current.crossOrigin = "anonymous";
    imgRef.current.src = image.imageUrl;
    imgRef.current.onload = () => {
      calculateInitialFit();
      drawCanvas();
    };
  }, [image, dimensions]);

  useEffect(() => {
    drawCanvas();
  }, [scale, position, dimensions]);

  const calculateInitialFit = () => {
    const img = imgRef.current;
    if (!img.complete) return;

    const targetRatio = dimensions.width / dimensions.height;
    const imgRatio = img.width / img.height;

    let newScale;
    if (imgRatio > targetRatio) {
      newScale = dimensions.height / img.height;
    } else {
      newScale = dimensions.width / img.width;
    }

    const scaledWidth = img.width * newScale;
    const scaledHeight = img.height * newScale;

    setScale(newScale);
    setPosition({
      x: (dimensions.width - scaledWidth) / 2,
      y: (dimensions.height - scaledHeight) / 2,
    });
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = imgRef.current;

    canvas.width = Math.min(dimensions.width, 800);
    canvas.height = Math.min(dimensions.height, 800);

    const displayScale = canvas.width / dimensions.width;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (img.complete) {
      const scaledWidth = img.width * scale * displayScale;
      const scaledHeight = img.height * scale * displayScale;
      
      ctx.drawImage(
        img,
        position.x * displayScale,
        position.y * displayScale,
        scaledWidth,
        scaledHeight
      );
    }
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    const newDims = presets[preset];
    setDimensions(newDims);
    
    setTimeout(() => {
      calculateInitialFit();
    }, 50);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const downloadCanvas = document.createElement("canvas");
    const ctx = downloadCanvas.getContext("2d");
    
    downloadCanvas.width = dimensions.width;
    downloadCanvas.height = dimensions.height;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

    const img = imgRef.current;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    ctx.drawImage(img, position.x, position.y, scaledWidth, scaledHeight);

    downloadCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${image.title}-${dimensions.width}x${dimensions.height}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{image.title}</h2>
            <p className="text-gray-400 text-sm">{image.artist}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Device Presets</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {Object.entries(presets).map(([key, preset]) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handlePresetChange(key)}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedPreset === key
                        ? "border-purple-500 bg-purple-900 bg-opacity-30"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <Icon className="mx-auto mb-2" size={24} />
                    <p className="text-sm font-semibold text-white">{preset.label}</p>
                    <p className="text-xs text-gray-400">
                      {preset.width} × {preset.height}
                    </p>
                  </button>
                );
              })}
            </div>

            {selectedPreset === "custom" && (
              <div className="mb-6 space-y-3">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Width</label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, width: parseInt(e.target.value) || 1920 })
                    }
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Height</label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, height: parseInt(e.target.value) || 1080 })
                    }
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="text-sm text-gray-400 block mb-2">
                Zoom: {scale.toFixed(2)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Download size={20} />
              Download Wallpaper
            </button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full cursor-move rounded"
                style={{ maxHeight: "500px", objectFit: "contain" }}
              />
              <p className="text-xs text-gray-400 mt-3 text-center">
                Drag to reposition • Scroll to zoom
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WallpaperGrid = ({ wallpapers }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { user, isAuthenticated, addToFavorites, removeFromFavorites } = useAuth();

  const getWallpaperId = (wallpaper) => {
    return wallpaper._id || wallpaper.id || `${wallpaper.title}-${wallpaper.artist}`.replace(/\s+/g, '-');
  };

  const isFavorited = (wallpaperId) => {
    if (!user?.favoriteWallpapers) return false;
    return user.favoriteWallpapers.some(fav => fav.id === wallpaperId);
  };

  const handleFavoriteClick = async (e, wallpaper) => {
    console.log('🔵 Heart button clicked!', wallpaper.title);
    e.preventDefault();
    e.stopPropagation();

    console.log('🔵 Is authenticated?', isAuthenticated);
    if (!isAuthenticated) {
      alert('Please login to save favorites!');
      return;
    }

    const wallpaperId = getWallpaperId(wallpaper);
    console.log('🔵 Wallpaper ID:', wallpaperId);
    console.log('🔵 Is already favorited?', isFavorited(wallpaperId));
    
    if (isFavorited(wallpaperId)) {
      console.log('🔴 Removing from favorites...');
      const result = await removeFromFavorites(wallpaperId);
      console.log('🔴 Remove result:', result);
      if (!result.success) {
        alert(result.message || 'Failed to remove from favorites');
      }
    } else {
      console.log('🟢 Adding to favorites...');
      const result = await addToFavorites({
        id: wallpaperId,
        title: wallpaper.title,
        artist: wallpaper.artist || 'Unknown',
        imageUrl: wallpaper.imageUrl,
        resolution: wallpaper.resolution || '1920x1080'
      });
      console.log('🟢 Add result:', result);
      
      if (!result.success) {
        alert(result.message || 'Failed to add to favorites');
      }
    }
  };

  return (
    <>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {wallpapers.map((wall, idx) => {
          const wallpaperId = getWallpaperId(wall);
          const isFav = isFavorited(wallpaperId);
          
          return (
            <div
              key={wallpaperId}
              className="group relative shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition hover:scale-105"
              onClick={() => setSelectedImage(wall)}
            >
              <img
                src={wall.imageUrl}
                alt={wall.title}
                className="w-full h-48 object-cover"
              />
              
              {/* Favorite Button - Top Right */}
              <button
                onClick={(e) => handleFavoriteClick(e, wall)}
                onMouseDown={(e) => e.stopPropagation()}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
                  isFav 
                    ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                    : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  size={20} 
                  className={isFav ? 'fill-white' : ''} 
                />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
                <div className="p-3 w-full">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2">
                    <Download size={18} />
                    Customize
                  </button>
                </div>
              </div>
              <div className="p-2 bg-gray-800">
                <h2 className="font-bold text-sm">{wall.title}</h2>
                {wall.artist && <p className="text-xs text-gray-400">{wall.artist}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <ImageEditorModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

export default WallpaperGrid;