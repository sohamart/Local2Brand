import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
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
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('q_auto') && !url.includes('f_auto') && !url.includes('vc_auto')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto:eco,vc_auto,w_1280/');
    }
  }
  return url;
}

function BackgroundCountryArt({ country = 'India' }) {
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [dynamicThemes, setDynamicThemes] = useState(() => {
    try {
      const cached = localStorage.getItem('l2b_country_themes_cache');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  // Listen for Sound Toggle Events
  useEffect(() => {
    const handleSoundToggle = (e) => {
      const targetMuted = e.detail?.isMuted ?? !isMuted;
      setIsMuted(targetMuted);

      const video = videoRef.current;
      if (video) {
        video.muted = targetMuted;
        if (!targetMuted) {
          video.volume = 0.75;
          video.play().catch(() => {});
        }
      }

      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        try {
          if (!targetMuted) {
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [75] }), '*');
          } else {
            iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
          }
        } catch (err) {}
      }
    };

    window.addEventListener('l2b_toggle_ambient_sound', handleSoundToggle);
    return () => {
      window.removeEventListener('l2b_toggle_ambient_sound', handleSoundToggle);
    };
  }, [isMuted]);

  // Live Multi-Tab Sync with Cloudinary Video/Poster Changes
  useEffect(() => {
    let isMounted = true;

    api.get('/settings').then(res => {
      if (isMounted && res?.settings?.countryThemes) {
        setDynamicThemes(res.settings.countryThemes);
        try {
          localStorage.setItem('l2b_country_themes_cache', JSON.stringify(res.settings.countryThemes));
        } catch (e) {}
      }
    }).catch(() => {});

    const handleThemesUpdate = (e) => {
      if (!isMounted) return;
      if (e.detail) setDynamicThemes(e.detail);
    };

    const handleStorageChange = (e) => {
      if (!isMounted) return;
      if (e.key === 'l2b_country_themes_cache' && e.newValue) {
        try {
          setDynamicThemes(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener('l2b_country_themes_updated', handleThemesUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('l2b_country_themes_updated', handleThemesUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const theme = getEffectiveCountryTheme(country, dynamicThemes);
  let rawVideoSrc = theme?.videoBg || 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-complex-at-sunset-42867-large.mp4';
  
  if (rawVideoSrc === '/india.mp4') {
    rawVideoSrc = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-complex-at-sunset-42867-large.mp4';
  }

  const videoSrc = getOptimizedVideoUrl(rawVideoSrc);
  const videoPoster = theme?.videoPoster || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&auto=format&fit=crop&q=85';
  const youtubeId = extractYouTubeId(videoSrc);

  // Pure continuous playback without seeking interruptions
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoPlaying(true))
          .catch(() => {});
      }
    } else {
      setVideoPlaying(true);
    }
  }, [isMuted]);

  useEffect(() => {
    setVideoPlaying(false);
    setVideoFailed(false);
  }, [videoSrc, youtubeId, country]);

  useEffect(() => {
    if (youtubeId) return;
    const video = videoRef.current;
    if (!video) return;

    attemptPlay();

    const forceResume = () => {
      if (video && video.paused) {
        attemptPlay();
      }
    };

    // Keep playing even if tab changes or is minimized
    const watchdog = setInterval(forceResume, 1500);

    document.addEventListener('visibilitychange', forceResume);
    window.addEventListener('focus', forceResume);
    window.addEventListener('blur', forceResume);
    window.addEventListener('click', forceResume, { passive: true });
    window.addEventListener('touchstart', forceResume, { passive: true });

    return () => {
      clearInterval(watchdog);
      document.removeEventListener('visibilitychange', forceResume);
      window.removeEventListener('focus', forceResume);
      window.removeEventListener('blur', forceResume);
      window.removeEventListener('click', forceResume);
      window.removeEventListener('touchstart', forceResume);
    };
  }, [videoSrc, youtubeId, country, attemptPlay]);

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen pointer-events-none overflow-hidden z-0 select-none bg-slate-950">
      
      {/* 1. Scenic Poster / Thumbnail (ONLY while video is buffering or if video fails) */}
      {videoPoster && (
        <img
          src={videoPoster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 scale-[1.14] filter saturate-125 contrast-105 ${
            videoPlaying && !videoFailed
              ? 'opacity-0 pointer-events-none'
              : 'opacity-80 sm:opacity-65 dark:opacity-50 sm:dark:opacity-35'
          }`}
        />
      )}

      {/* 2. YouTube Background Player (Smooth Faded Live Stream with Audio API enabled) */}
      {!videoFailed && youtubeId && (
        <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-opacity duration-1000 ${
          videoPlaying ? 'opacity-80 sm:opacity-65 dark:opacity-55 sm:dark:opacity-40' : 'opacity-0'
        }`}>
          <iframe
            ref={iframeRef}
            key={youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&enablejsapi=1`}
            title="Cultural Ambient Background Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex="-1"
            onLoad={() => setVideoPlaying(true)}
            onError={() => setVideoFailed(true)}
            className="yt-bg-iframe filter saturate-125 contrast-105 scale-[1.20]"
          />
        </div>
      )}

      {/* 3. Direct HTML5 Full-Length Smooth Looping Video Player */}
      {!videoFailed && !youtubeId && (
        <video
          id="global-bg-country-video"
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          onPlaying={() => setVideoPlaying(true)}
          onLoadedData={() => setVideoPlaying(true)}
          onPause={(e) => {
            // Prevent auto-pausing when tab switches
            e.currentTarget.play().catch(() => {});
          }}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0.1 && !videoPlaying) {
              setVideoPlaying(true);
            }
          }}
          onError={() => {
            setVideoFailed(true);
            setVideoPlaying(false);
          }}
          className={`absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center scale-[1.14] filter saturate-125 contrast-105 transition-opacity duration-1000 ${
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
        className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_60%,_rgba(248,250,252,0.45)_95%] dark:bg-radial-[ellipse_at_center,_transparent_40%,_rgba(8,11,17,0.70)_95%]" 
      />
      
      {/* Dynamic Cultural Color Hue Tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme?.bgGradient || 'from-purple-500/10 via-indigo-500/5 to-pink-500/10'} opacity-30 dark:opacity-25 transition-all duration-1000`} />
    </div>
  );
}

export default memo(BackgroundCountryArt);
