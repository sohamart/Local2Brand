import React, { useRef, useEffect, useState } from 'react';
import { getEffectiveCountryTheme } from '../../data/countryThemes';
import api from '../../services/api';

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[\w-]{11}$/.test(url.trim())) {
    return url.trim();
  }
  return null;
}

function getOptimizedVideoUrl(url) {
  if (!url || typeof url !== 'string') return url;
  // If Cloudinary video, auto inject sub-second fast-start streaming & compression parameters
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('q_auto') && !url.includes('f_auto') && !url.includes('vc_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto:eco,vc_auto,w_1280,ac_none/');
    }
  }
  return url;
}

export default function BackgroundCountryArt({ country = 'India' }) {
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [dynamicThemes, setDynamicThemes] = useState(() => {
    try {
      const cached = localStorage.getItem('l2b_country_themes_cache');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  // Live Real-Time Multi-Tab Sync with Cloudinary Video/Poster Changes
  useEffect(() => {
    let isMounted = true;

    // 1. Initial backend sync
    api.get('/settings').then(res => {
      if (isMounted && res?.settings?.countryThemes) {
        setDynamicThemes(res.settings.countryThemes);
        try {
          localStorage.setItem('l2b_country_themes_cache', JSON.stringify(res.settings.countryThemes));
        } catch (e) {}
      }
    }).catch(() => {});

    // 2. Custom local event listener
    const handleThemesUpdate = (e) => {
      if (!isMounted) return;
      const newThemes = e.detail;
      if (newThemes) {
        setDynamicThemes(newThemes);
      }
    };

    // 3. Storage event listener (other tabs)
    const handleStorageChange = (e) => {
      if (!isMounted) return;
      if (e.key === 'l2b_country_themes_cache' && e.newValue) {
        try {
          setDynamicThemes(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    // 4. BroadcastChannel for instant cross-tab sync
    let bc = null;
    try {
      bc = new BroadcastChannel('l2b_country_themes_sync');
      bc.onmessage = (event) => {
        if (!isMounted) return;
        if (event.data?.type === 'THEMES_UPDATED' && event.data?.themes) {
          setDynamicThemes(event.data.themes);
        }
      };
    } catch (err) {}

    window.addEventListener('l2b_country_themes_updated', handleThemesUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('l2b_country_themes_updated', handleThemesUpdate);
      window.removeEventListener('storage', handleStorageChange);
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
    };
  }, []);

  const theme = getEffectiveCountryTheme(country, dynamicThemes);
  let rawVideoSrc = theme?.videoBg || 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-complex-at-sunset-42867-large.mp4';
  
  // Sanitize stale local /india.mp4 path to CDN video
  if (rawVideoSrc === '/india.mp4') {
    rawVideoSrc = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-complex-at-sunset-42867-large.mp4';
  }

  const videoSrc = getOptimizedVideoUrl(rawVideoSrc);
  const videoPoster = theme?.videoPoster || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&auto=format&fit=crop&q=85';
  const youtubeId = extractYouTubeId(videoSrc);

  // Reset state when country or video source changes
  useEffect(() => {
    setVideoPlaying(false);
    setVideoFailed(false);
  }, [videoSrc, youtubeId, country]);

  // Direct HTML5 Video Player lifecycle (Instant Autoplay without resetting network buffer)
  useEffect(() => {
    if (youtubeId) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    
    // Directly attempt instant playback
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setVideoPlaying(true);
        })
        .catch(() => {
          const startPlaybackOnUserAction = () => {
            if (video) {
              video.muted = true;
              video.play()
                .then(() => setVideoPlaying(true))
                .catch(() => setVideoFailed(true));
            }
            window.removeEventListener('click', startPlaybackOnUserAction);
            window.removeEventListener('touchstart', startPlaybackOnUserAction);
            window.removeEventListener('scroll', startPlaybackOnUserAction);
          };
          window.addEventListener('click', startPlaybackOnUserAction, { once: true });
          window.addEventListener('touchstart', startPlaybackOnUserAction, { once: true });
          window.addEventListener('scroll', startPlaybackOnUserAction, { once: true });
        });
    }
  }, [videoSrc, youtubeId]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-slate-950">
      
      {/* 1. High-Resolution Scenic Poster / Thumbnail (ONLY visible while video is buffering or if video fails) */}
      {videoPoster && (
        <img
          src={videoPoster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 scale-105 filter saturate-125 contrast-105 ${
            videoPlaying && !videoFailed
              ? 'opacity-0 pointer-events-none'
              : 'opacity-80 sm:opacity-65 dark:opacity-50 sm:dark:opacity-35'
          }`}
        />
      )}

      {/* 2. YouTube Background Player (Smooth Faded Live Stream) */}
      {!videoFailed && youtubeId && (
        <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-1000 ${
          videoPlaying ? 'opacity-80 sm:opacity-65 dark:opacity-55 sm:dark:opacity-40' : 'opacity-0'
        }`}>
          <iframe
            key={youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0`}
            title="Cultural Ambient Background Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex="-1"
            onLoad={() => setVideoPlaying(true)}
            onError={() => setVideoFailed(true)}
            className="yt-bg-iframe filter saturate-125 contrast-105"
          />
        </div>
      )}

      {/* 3. Direct HTML5 MP4 / WebM Video Player (Cross-fades in, replaces the thumbnail completely) */}
      {!videoFailed && !youtubeId && (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setVideoPlaying(true)}
          onLoadedData={() => setVideoPlaying(true)}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0.1 && !videoPlaying) {
              setVideoPlaying(true);
            }
          }}
          onError={() => {
            setVideoFailed(true);
            setVideoPlaying(false);
          }}
          onEnded={(e) => {
            try {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            } catch (err) {}
          }}
          className={`absolute inset-0 w-full h-full object-cover scale-105 filter saturate-125 contrast-105 transition-opacity duration-1000 ${
            videoPlaying
              ? 'opacity-80 sm:opacity-65 dark:opacity-55 sm:dark:opacity-40'
              : 'opacity-0'
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Smooth Soft Radial Vignette Mask */}
      <div 
        className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_50%,_rgba(255,255,255,0.70)_95%] dark:bg-radial-[ellipse_at_center,_transparent_40%,_rgba(8,11,17,0.78)_95%]" 
      />
      
      {/* Gentle Top & Bottom Edge Gradient Blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/45 dark:from-[#080B11]/45 dark:via-transparent dark:to-[#080B11]/65" />
      
      {/* Dynamic Cultural Color Hue Tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme?.bgGradient || 'from-transparent to-transparent'} opacity-20 dark:opacity-25 transition-all duration-1000`} />
    </div>
  );
}
