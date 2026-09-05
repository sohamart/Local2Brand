import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Sparkles, Globe, Compass, ShieldCheck, Zap, Video as VideoIcon, Volume2, VolumeX } from 'lucide-react';
import { getEffectiveCountryTheme } from '../../data/countryThemes';
import api from '../../services/api';

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
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

function getCountryFlagUrl(countryCode) {
  if (!countryCode) return 'https://flagcdn.com/w160/in.png';
  const c = countryCode.toLowerCase().trim();
  if (c === 'global' || c === 'other') return 'https://flagcdn.com/w160/un.png';
  return `https://flagcdn.com/w160/${c}.png`;
}

function CulturalMascotArt({ country = 'India', lang = 'en' }) {
  const bgVideoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [interactiveSparkle, setInteractiveSparkle] = useState(false);
  const [flagImgError, setFlagImgError] = useState(false);
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [dynamicThemes, setDynamicThemes] = useState(() => {
    try {
      const cached = localStorage.getItem('l2b_country_themes_cache');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });

  // Synchronize dynamic themes from server / storage
  useEffect(() => {
    let isMounted = true;
    api.get('/settings').then(res => {
      if (isMounted && res?.settings?.countryThemes) {
        setDynamicThemes(res.settings.countryThemes);
      }
    }).catch(() => {});

    const handleThemesUpdate = (e) => {
      if (!isMounted) return;
      if (e.detail) setDynamicThemes(e.detail);
    };

    window.addEventListener('l2b_country_themes_updated', handleThemesUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('l2b_country_themes_updated', handleThemesUpdate);
    };
  }, []);

  // Synchronize audio state across banner and background
  useEffect(() => {
    const handleSoundToggleEvent = (e) => {
      const targetMuted = e.detail?.isMuted ?? !isSoundActive;
      setIsSoundActive(!targetMuted);
    };

    window.addEventListener('l2b_toggle_ambient_sound', handleSoundToggleEvent);
    return () => {
      window.removeEventListener('l2b_toggle_ambient_sound', handleSoundToggleEvent);
    };
  }, [isSoundActive]);

  const toggleSound = () => {
    const nextState = !isSoundActive;
    setIsSoundActive(nextState);
    window.dispatchEvent(new CustomEvent('l2b_toggle_ambient_sound', { detail: { isMuted: !nextState } }));
  };

  const theme = getEffectiveCountryTheme(country, dynamicThemes);
  
  let rawVideoSrc = theme?.videoBg || 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-complex-at-sunset-42867-large.mp4';
  if (rawVideoSrc === '/india.mp4') {
    rawVideoSrc = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-complex-at-sunset-42867-large.mp4';
  }
  const videoSrc = getOptimizedVideoUrl(rawVideoSrc);
  const videoPoster = theme?.videoPoster || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&auto=format&fit=crop&q=85';
  const youtubeId = extractYouTubeId(videoSrc);

  const flagCode = theme?.code || 'IN';
  const flagUrl = getCountryFlagUrl(flagCode);

  const attemptPlay = useCallback(() => {
    const video = bgVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    const master = document.getElementById('global-bg-country-video');
    if (master && master.currentTime > 0) {
      try {
        if (Math.abs(video.currentTime - master.currentTime) > 0.5) {
          video.currentTime = master.currentTime;
        }
      } catch (e) {}
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setVideoPlaying(true);
          setVideoFailed(false);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    setVideoFailed(false);
    setFlagImgError(false);
  }, [videoSrc, youtubeId, country]);

  // Synchronize banner video with background master video
  useEffect(() => {
    if (youtubeId) return;

    const slave = bgVideoRef.current;
    const master = document.getElementById('global-bg-country-video');

    const handleSync = () => {
      const m = document.getElementById('global-bg-country-video') || master;
      const s = bgVideoRef.current;
      if (!s) return;

      if (s.paused) {
        if (m && m.currentTime > 0) {
          try {
            s.currentTime = m.currentTime;
          } catch (e) {}
        }
        s.play()
          .then(() => {
            setVideoPlaying(true);
            setVideoFailed(false);
          })
          .catch(() => {});
      }
    };

    attemptPlay();

    if (master) {
      master.addEventListener('play', handleSync);
      master.addEventListener('playing', handleSync);
      handleSync();
    }

    const handleUserTouch = () => {
      handleSync();
    };

    const handleVisibilityChange = () => {
      handleSync();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('click', handleUserTouch, { passive: true });
    window.addEventListener('touchstart', handleUserTouch, { passive: true });

    return () => {
      if (master) {
        master.removeEventListener('play', handleSync);
        master.removeEventListener('playing', handleSync);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('click', handleUserTouch);
      window.removeEventListener('touchstart', handleUserTouch);
    };
  }, [videoSrc, youtubeId, country, attemptPlay]);

  const handleMascotClick = () => {
    setInteractiveSparkle(true);
    setTimeout(() => setInteractiveSparkle(false), 1400);
  };

  return (
    <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/90 dark:border-slate-800/90 shadow-[0_12px_40px_-8px_rgba(99,102,241,0.18),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-slate-950/80 backdrop-blur-2xl transition-all duration-500 group bg-white/90 dark:bg-slate-950/85 ring-1 ring-white/80 dark:ring-0">
      
      {/* Radiant Top Glow Stripe in Accent Colors */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] z-20 bg-gradient-to-r ${theme?.flagStripe || 'from-purple-600 via-indigo-500 to-pink-600'} opacity-90`} />

      {/* 1. Full Atmospheric Country Scenic Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        {/* Poster Fallback / Loading Background (Fades out completely when video is playing) */}
        {videoPoster && (
          <img
            src={videoPoster}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center scale-[1.14] filter saturate-125 contrast-105 transition-opacity duration-700 z-0 ${
              videoPlaying && !videoFailed ? 'opacity-0 pointer-events-none' : 'opacity-85 dark:opacity-65'
            }`}
          />
        )}

        {/* Embedded HTML5 Full-Length Smooth Video */}
        {!videoFailed && !youtubeId && (
          <video
            ref={bgVideoRef}
            key={`bg-${videoSrc}`}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            onPlaying={() => setVideoPlaying(true)}
            onLoadedData={() => {
              setVideoPlaying(true);
              attemptPlay();
            }}
            onCanPlay={() => {
              attemptPlay();
            }}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime > 0.05 && !videoPlaying) {
                setVideoPlaying(true);
              }
            }}
            onError={() => {
              setVideoFailed(true);
            }}
            className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center scale-[1.14] filter saturate-125 contrast-105 opacity-100 z-[1]"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* YouTube Iframe Fallback */}
        {!videoFailed && youtubeId && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-100 z-[1]">
            <iframe
              key={youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0`}
              title="Country Cultural Video"
              allow="autoplay; encrypted-media"
              tabIndex="-1"
              onLoad={() => setVideoPlaying(true)}
              onError={() => setVideoFailed(true)}
              className="w-full h-full scale-[1.20] pointer-events-none"
            />
          </div>
        )}

        {/* Dynamic Cultural Ambient Color Gradient Overlay */}
        <div className={`absolute inset-0 z-[2] bg-gradient-to-r ${theme?.flagStripe || 'from-purple-600/30 via-indigo-600/20 to-pink-600/30'} opacity-25 dark:opacity-35 mix-blend-overlay pointer-events-none`} />
        
        {/* Balanced Light/Dark Gradient Mask: Keeps text crystal clear on the left, let scenic video glow on the right */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-white/95 via-white/70 to-white/20 dark:from-slate-950/95 dark:via-slate-950/70 dark:to-slate-950/20 pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-white/75 via-transparent to-white/25 dark:from-slate-950/75 dark:via-transparent dark:to-slate-950/25 pointer-events-none" />
      </div>

      {/* 2. Banner Foreground Content (Light & Dark Responsive) */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-5">
        
        {/* Left: Country Flag Picture Avatar + Cultural Greeting */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          
          {/* Flag Image Badge / Country Avatar */}
          <div
            onClick={handleMascotClick}
            className="relative cursor-pointer group/mascot shrink-0 transition-transform active:scale-95"
            title="Click for celebratory sparkles! ✨"
          >
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-amber-500 to-rose-600 p-0.5 shadow-xl shadow-purple-500/25 group-hover/mascot:scale-105 transition-all ring-2 ring-white/90 dark:ring-slate-800">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden border border-white/60 dark:border-slate-800 shadow-inner">
                {!flagImgError ? (
                  <img
                    src={flagUrl}
                    alt={`${country} Flag`}
                    onError={() => setFlagImgError(true)}
                    className="w-full h-full object-cover rounded-[14px] group-hover/mascot:scale-110 transition-transform duration-300"
                    loading="eager"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl transform group-hover/mascot:scale-110 transition-transform">
                    {theme?.flag || '🌐'}
                  </span>
                )}
                {interactiveSparkle && (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl animate-ping bg-purple-500/20">
                    ✨
                  </span>
                )}
              </div>
            </div>

            {/* Live active pulsing dot */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950 shadow-xs"></span>
            </span>
          </div>

          {/* Cultural Greeting & Subtext */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="text-sm sm:text-base font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>{theme?.greeting || 'Welcome'}</span>
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100/90 dark:bg-purple-950/80 border border-purple-300/80 dark:border-purple-700 text-purple-900 dark:text-purple-300 backdrop-blur-md shadow-xs uppercase tracking-wider">
                {theme?.badge || `${country} Edition`}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
              {theme?.subGreeting || theme?.tagline || 'World-class digital engineering & fast website deployment'}
            </p>

            {/* Cultural Motifs & City Highlight */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-amber-800 dark:text-amber-300 mt-1">
              <span className="truncate max-w-[220px] sm:max-w-none">{theme?.culturalPattern || theme?.festiveMotif}</span>
              {theme?.defaultCity && (
                <>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="text-slate-800 dark:text-slate-200 hidden sm:inline">{theme.defaultCity}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sound Control, Cultural Theme Info & Currency Standard */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-2.5 w-full md:w-auto pt-2 md:pt-0 border-t border-slate-200/80 dark:border-slate-800/80 md:border-0 shrink-0">
          
          {/* Ambient Video Sound Play/Mute Option Button */}
          <button
            type="button"
            onClick={toggleSound}
            title={isSoundActive ? "Mute video sound" : "Play video sound"}
            className={`flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md transition-all duration-300 text-[11px] font-bold shadow-xs active:scale-95 cursor-pointer select-none ${
              isSoundActive
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 ring-2 ring-emerald-500/20'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
            }`}
          >
            {isSoundActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-3.5 bg-emerald-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" />
                  <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s]" />
                </span>
                <span>Sound Playing</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Play Sound</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-wider hidden xs:inline">CULTURAL THEME</span>
            <span className="uppercase tracking-wider xs:hidden">THEME</span>
          </div>

          <div className="text-right hidden sm:block pl-2 border-l border-slate-200/90 dark:border-slate-800">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">Standard</div>
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono">
              {theme?.currency || 'INR'} ({theme?.symbol || '₹'}) • 48h
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default memo(CulturalMascotArt);

