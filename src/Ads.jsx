import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { getThemeColors } from './themeColors';
import { sb } from './Site';

const Ads = ({ position = "home", limit = 3 }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com'];
    return videoExtensions.some(ext => url.includes(ext)) ||
           videoPlatforms.some(platform => url.includes(platform));
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const { data, error } = await sb
          .from("ads")
          .select("*")
          .eq("active", true)
          .eq("position", position)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) {
          console.error("Error fetching ads:", error);
          return;
        }

        if (data) {
          setAds(data);
        }
      } catch (err) {
        console.error("Failed to load ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position, limit]);

  const handleAdClick = async (ad) => {
    try {
      await sb
        .from("ads")
        .update({ clicks: ad.clicks + 1 })
        .eq("id", ad.id);
      setSelectedAd(ad);
    } catch (err) {
      console.error("Error recording click:", err);
    }
  };

  const closeFullscreen = () => {
    setSelectedAd(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${colors.borderColor}`, borderTopColor: colors.textPrimary }} />
      </div>
    );
  }

  if (ads.length === 0) return null;

  return (
    <>
      {/* 🔥 BOX GRID - Like your gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ads.map((ad, index) => {
          const videoUrl = ad.video_url || ad.link_url;
          const isVideoAd = videoUrl && isVideo(videoUrl);
          const embedUrl = isVideoAd ? getEmbedUrl(videoUrl) : null;
          
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="group cursor-pointer overflow-hidden rounded-2xl"
              style={{
                aspectRatio: "3/4",
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => handleAdClick(ad)}
            >
              <div className="w-full h-full flex flex-col">
                {/* Image/Video - takes most of the space */}
                <div className="flex-1 overflow-hidden relative">
                  {ad.image_url && !isVideoAd && (
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  {isVideoAd && (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                      <span className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                        ▶ Video
                      </span>
                    </div>
                  )}

                  {/* Ad badge */}
                  <div className="absolute top-2 right-2 text-[10px] font-body px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)' }}>
                    Ad
                  </div>
                </div>

                {/* Title - at the bottom */}
                <div className="p-3">
                  <h4 className="font-body text-[13px] font-semibold truncate" style={{ color: colors.textPrimary }}>
                    {ad.title}
                  </h4>
                  <p className="font-body text-[10px] mt-0.5 flex items-center gap-1" style={{ color: colors.textMuted }}>
                    <Maximize2 size={12} />
                    Tap to view
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 FULLSCREEN MODAL */}
      {selectedAd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
          onClick={closeFullscreen}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-auto"
            style={{ background: isDark ? '#0E1015' : '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              {selectedAd.image_url && (
                <div className="w-full rounded-xl overflow-hidden mb-4">
                  <img 
                    src={selectedAd.image_url} 
                    alt={selectedAd.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                </div>
              )}

              {selectedAd.video_url && isVideo(selectedAd.video_url) && (
                <div className="w-full rounded-xl overflow-hidden mb-4">
                  {selectedAd.video_url.match(/\.(mp4|webm|mov)$/i) ? (
                    <video
                      src={selectedAd.video_url}
                      className="w-full max-h-[60vh]"
                      controls
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(selectedAd.video_url)}
                      className="w-full aspect-video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedAd.title}
                    />
                  )}
                </div>
              )}

              <h2 className="font-fraunces text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {selectedAd.title}
              </h2>
              
              {selectedAd.link_url && (
                <a
                  href={selectedAd.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-3 rounded-xl font-body text-[14px] font-semibold"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)', color: 'white' }}
                >
                  Visit Link →
                </a>
              )}

              <p className="font-body text-[12px] mt-4" style={{ color: colors.textMuted }}>
                {selectedAd.clicks || 0} clicks • Sponsored
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Ads;
