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
    
    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented; listen to user interaction once
          const startPlaybackOnUserAction = () => {
            if (video) {
              video.muted = true;
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
        className="absolute inset-0 w-full h-full object-cover opacity-25 sm:opacity-30 dark:opacity-20 transition-opacity duration-1000 scale-105 filter saturate-150 contrast-105"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Smooth Soft Radial Vignette Mask */}
      <div 
        className="absolute inset-0 bg-radial-[ellipse_at_center,_transparent_40%,_rgba(248,250,252,0.85)_95%] dark:bg-radial-[ellipse_at_center,_transparent_35%,_#080B11_90%]" 
      />
      
      {/* Gentle Top & Bottom Edge Gradient Blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/70 via-transparent to-slate-50/80 dark:from-[#080B11]/85 dark:via-transparent dark:to-[#080B11]/90" />
      
      {/* Dynamic Cultural Color Hue Tint */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient || 'from-transparent to-transparent'} opacity-35 dark:opacity-25 transition-all duration-1000`} />
    </div>
  );
}


