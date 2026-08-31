import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth inertia interpolation loop for the outer ring (lerp)
    const render = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Detect clickable element hovers across the entire DOM tree
    const handleElementHover = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      const isClickable = target.closest('a, button, input, select, textarea, [role="button"], .glass-card, .cursor-pointer, [tabindex="0"]');
      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`pointer-events-none fixed inset-0 z-[2147483647] transition-opacity duration-300 hidden lg:block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 ease-out z-[2147483647] ${
          isHovered
            ? 'w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.9)]'
            : 'w-2 h-2 bg-purple-600 dark:bg-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Smooth Trailing Liquid Glass Ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 rounded-full border transition-all duration-300 ease-out z-[2147483647] ${
          isHovered
            ? 'w-14 h-14 bg-purple-500/15 dark:bg-purple-500/25 border-purple-500/70 dark:border-pink-400/80 backdrop-blur-[2px] scale-110 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
            : 'w-9 h-9 bg-purple-500/5 dark:bg-cyan-500/10 border-purple-500/30 dark:border-cyan-400/40'
        }`}
        style={{ willChange: 'transform' }}
      />
    </div>,
    document.body
  );
}
