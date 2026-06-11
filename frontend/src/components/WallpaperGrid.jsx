import { useState, useRef, useEffect } from "react";
import { Download, X, Monitor, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ImageEditorModal = ({ image, onClose }) => {
  const canvasRef = useRef(null);
  const [selectedPreset, setSelectedPreset] = useState("fhd");
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(new Image());

  const presets = {
    hd: { width: 1366, height: 768, label: "HD 1366×768" },
    fhd: { width: 1920, height: 1080, label: "Full HD 1080p" },
    "2k": { width: 2560, height: 1440, label: "2K 1440p" },
    "4k": { width: 3840, height: 2160, label: "4K 2160p" },
    ultrawide: { width: 3440, height: 1440, label: "Ultrawide" },
    macbook: { width: 2880, height: 1800, label: "MacBook Pro" },
  };

  useEffect(() => {
    imgRef.current.crossOrigin = "anonymous";
    imgRef.current.src = image.imageUrl;
    imgRef.current.onload = () => { calculateInitialFit(); drawCanvas(); };
  }, [image, dimensions]);

  useEffect(() => { drawCanvas(); }, [scale, position, dimensions]);

  const calculateInitialFit = () => {
    const img = imgRef.current;
    if (!img.complete) return;
    const targetRatio = dimensions.width / dimensions.height;
    const imgRatio = img.width / img.height;
    const newScale = imgRatio > targetRatio ? dimensions.height / img.height : dimensions.width / img.width;
    setScale(newScale);
    setPosition({
      x: (dimensions.width - img.width * newScale) / 2,
      y: (dimensions.height - img.height * newScale) / 2,
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
      ctx.drawImage(img, position.x * displayScale, position.y * displayScale,
        img.width * scale * displayScale, img.height * scale * displayScale);
    }
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setDimensions(presets[preset]);
    setTimeout(() => calculateInitialFit(), 50);
  };

  const handleMouseDown = (e) => { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); };
  const handleMouseMove = (e) => { if (!isDragging) return; setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);

  const handleDownload = () => {
    const downloadCanvas = document.createElement("canvas");
    const ctx = downloadCanvas.getContext("2d");
    downloadCanvas.width = dimensions.width;
    downloadCanvas.height = dimensions.height;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
    ctx.drawImage(imgRef.current, position.x, position.y, imgRef.current.width * scale, imgRef.current.height * scale);
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
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        background: '#111', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '900px',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* header */}
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>{image.title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{image.artist}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)', padding: '4px',
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          {/* controls */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Presets</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePresetChange(key)}
                  style={{
                    padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${selectedPreset === key ? 'var(--color-accent-purple)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedPreset === key ? 'var(--color-accent-purple-dim)' : 'rgba(255,255,255,0.03)',
                    color: selectedPreset === key ? 'var(--color-accent-purple)' : 'var(--color-text-secondary)',
                    fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                    fontFamily: 'var(--font-primary)', textAlign: 'left',
                  }}
                >
                  <Monitor size={14} style={{ marginBottom: '4px', display: 'block' }} />
                  {preset.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
                Zoom: {scale.toFixed(2)}x
              </label>
              <input type="range" min="0.5" max="3" step="0.1" value={scale}
                onChange={e => setScale(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent-purple)' }}
              />
            </div>

            <button onClick={handleDownload} style={{
              width: '100%', background: 'var(--color-accent-purple)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-pill)', padding: '13px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              fontFamily: 'var(--font-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Download size={16} />
              Download Wallpaper
            </button>
          </div>

          {/* preview */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Preview</h3>
            <div style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.06)', padding: '12px',
            }}>
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ width: '100%', cursor: 'move', borderRadius: '8px', maxHeight: '400px', objectFit: 'contain' }}
              />
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '8px' }}>
                Drag to reposition
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

  const getWallpaperId = (wallpaper) =>
    wallpaper._id || wallpaper.id || `${wallpaper.title}-${wallpaper.artist}`.replace(/\s+/g, '-');

  const isFavorited = (wallpaperId) =>
    user?.favoriteWallpapers?.some(fav => fav.id === wallpaperId) ?? false;

  const handleFavoriteClick = async (e, wallpaper) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { alert('Please login to save favorites!'); return; }
    const wallpaperId = getWallpaperId(wallpaper);
    if (isFavorited(wallpaperId)) {
      const result = await removeFromFavorites(wallpaperId);
      if (!result.success) alert(result.message || 'Failed to remove');
    } else {
      const result = await addToFavorites({
        id: wallpaperId, title: wallpaper.title,
        artist: wallpaper.artist || 'Unknown',
        imageUrl: wallpaper.imageUrl, resolution: wallpaper.resolution || '1920x1080',
      });
      if (!result.success) alert(result.message || 'Failed to add');
    }
  };

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px', padding: '0 0 40px',
      }}>
        {wallpapers.map((wall) => {
          const wallpaperId = getWallpaperId(wall);
          const isFav = isFavorited(wallpaperId);

          return (
            <div
              key={wallpaperId}
              onClick={() => setSelectedImage(wall)}
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.borderColor = 'rgba(180,0,255,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <img src={wall.imageUrl} alt={wall.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />

                {/* favorite btn */}
                <button
                  onClick={e => handleFavoriteClick(e, wall)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: isFav ? '#e53e3e' : 'rgba(0,0,0,0.6)',
                    border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                >
                  <Heart size={16} color="#fff" fill={isFav ? '#fff' : 'none'} />
                </button>

                {/* hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  display: 'flex', alignItems: 'flex-end',
                  opacity: 0, transition: 'opacity 0.2s',
                  padding: '12px',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <button style={{
                    width: '100%', background: 'var(--color-accent-purple)',
                    color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)',
                    padding: '8px', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'var(--font-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <Download size={14} /> Customize
                  </button>
                </div>
              </div>

              <div style={{ padding: '10px 12px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wall.title}</h2>
                {wall.artist && <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{wall.artist}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {selectedImage && <ImageEditorModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
};

export default WallpaperGrid;