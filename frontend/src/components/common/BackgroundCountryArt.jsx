import React, { useRef, useEffect } from 'react';
import { COUNTRY_CULTURAL_THEMES } from '../../data/countryThemes';

export default function BackgroundCountryArt({ country = 'India' }) {
  const videoRef = useRef(null);
  const theme = COUNTRY_CULTURAL_THEMES[country] || COUNTRY_CULTURAL_THEMES['India'] || COUNTRY_CULTURAL_THEMES['Other'];
  const videoSrc = theme?.videoBg || '/india.mp4';
  const videoPoster = theme?.videoPoster || '';

  // Ensure seamless playback when country switches or on initial load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    
    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented; listen to user interaction once
          const startPlaybackOnUserAction = () => {
            if (video) {
              video.muted = true;
              video.loop = true;
              video.play().catch(() => {});
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
  }, [videoSrc]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* High-Clarity Scenic Video Loop for Both Light & Dark Modes */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={videoPoster}
        onEnded={(e) => {
          // Guaranteed seamless infinite loop across all mobile devices
          try {
            e.currentTarget.currentTime = 0;
            e.currentTarget.play().catch(() => {});
          } catch (err) {}
        }}
        className="absolute inset-0 w-full h-full object-cover opacity-50 sm:opacity-35 dark:opacity-40 sm:dark:opacity-25 transition-opacity duration-1000 scale-105 filter saturate-150 contrast-110"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Smooth Soft Radial Vignette Mask */}
      <div 
        className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_50%,_rgba(248,250,252,0.65)_95%] dark:bg-radial-[ellipse_at_center,_transparent_45%,_rgba(8,11,17,0.75)_95%]" 
      />
      
      {/* Gentle Top & Bottom Edge Gradient Blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-transparent to-slate-50/60 dark:from-[#080B11]/50 dark:via-transparent dark:to-[#080B11]/70" />
      
      {/* Dynamic Cultural Color Hue Tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient || 'from-transparent to-transparent'} opacity-25 dark:opacity-20 transition-all duration-1000`} />
    </div>
  );
}


