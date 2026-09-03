import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const containerRef = useRef(null);

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

      if (containerRef.current && containerRef.current.style.opacity !== '1') {
        containerRef.current.style.opacity = '1';
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      if (containerRef.current) containerRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (containerRef.current) containerRef.current.style.opacity = '1';
    };

    // Smooth inertia interpolation loop for the outer ring (lerp)
    const render = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Detect clickable element hovers via direct DOM update (Zero React Re-renders!)
    const handleElementHover = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;
      const isClickable = Boolean(
        target.closest('a, button, input, select, textarea, [role="button"], .glass-card, .cursor-pointer, [tabindex="0"]')
      );

      if (ringRef.current) {
        if (isClickable) {
          ringRef.current.style.width = '48px';
          ringRef.current.style.height = '48px';
          ringRef.current.style.borderColor = 'rgba(168, 85, 247, 0.9)';
          ringRef.current.style.backgroundColor = 'rgba(168, 85, 247, 0.12)';
        } else {
          ringRef.current.style.width = '32px';
          ringRef.current.style.height = '32px';
          ringRef.current.style.borderColor = 'rgba(168, 85, 247, 0.4)';
          ringRef.current.style.backgroundColor = 'transparent';
        }
      }
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
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[2147483647] opacity-0 transition-opacity duration-300 hidden lg:block"
      aria-hidden="true"
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 pointer-events-none shadow-[0_0_10px_rgba(168,85,247,0.8)] will-change-transform"
      />

      {/* Fluid Trailing Ambient Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-purple-500/40 pointer-events-none transition-[width,height,background-color,border-color] duration-200 ease-out will-change-transform"
      />
    </div>,
    document.body
  );
}
