import React, { useRef, useEffect, useState } from 'react';
import { COUNTRY_CULTURAL_THEMES } from '../../data/countryThemes';

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

export default function BackgroundCountryArt({ country = 'India' }) {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  
  const theme = COUNTRY_CULTURAL_THEMES[country] || COUNTRY_CULTURAL_THEMES['India'] || COUNTRY_CULTURAL_THEMES['Other'];
  const videoSrc = theme?.videoBg || '/india.mp4';
  const videoPoster = theme?.videoPoster || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80';
  const youtubeId = extractYouTubeId(videoSrc);

  // Reset error state when video source switches
  useEffect(() => {
    setVideoFailed(false);
  }, [videoSrc, youtubeId]);

  // Direct HTML5 Video Player lifecycle (Instant Play)
  useEffect(() => {
    if (youtubeId) return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    
    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const startPlaybackOnUserAction = () => {
            if (video) {
              video.muted = true;
              video.loop = true;
              video.play().catch(() => setVideoFailed(true));
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
    };

    video.load();
    playVideo();
  }, [videoSrc, youtubeId]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      
      {/* 1. High-Resolution Scenic Poster Image (ONLY shown as Fallback if Video fails or cannot load) */}
      {videoFailed && videoPoster && (
        <img
          src={videoPoster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-60 sm:opacity-45 dark:opacity-40 sm:dark:opacity-25 transition-opacity duration-700 scale-105 filter saturate-125 contrast-105"
        />
      )}

      {/* 2. YouTube Background Player (Instant Live Stream) */}
      {!videoFailed && youtubeId ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-50 sm:opacity-35 dark:opacity-40 sm:dark:opacity-25">
          <iframe
            key={youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0`}
            title="Cultural Ambient Background Video"
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex="-1"
            onError={() => setVideoFailed(true)}
            className="yt-bg-iframe filter saturate-125 contrast-105"
          />
        </div>
      ) : !videoFailed ? (
        /* 3. Direct HTML5 MP4 / WebM Video Player (Instant 60fps Native Playback) */
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          onEnded={(e) => {
            try {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            } catch (err) {}
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-65 sm:opacity-50 dark:opacity-40 sm:dark:opacity-25 scale-105 filter saturate-125 contrast-105"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}

      {/* Smooth Soft Radial Vignette Mask */}
      <div 
        className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_55%,_rgba(255,255,255,0.70)_95%] dark:bg-radial-[ellipse_at_center,_transparent_45%,_rgba(8,11,17,0.75)_95%]" 
      />
      
      {/* Gentle Top & Bottom Edge Gradient Blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/50 dark:from-[#080B11]/50 dark:via-transparent dark:to-[#080B11]/70" />
      
      {/* Dynamic Cultural Color Hue Tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient || 'from-transparent to-transparent'} opacity-15 dark:opacity-20 transition-all duration-1000`} />
    </div>
  );
}


