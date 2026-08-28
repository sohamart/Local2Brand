import React, { useEffect, useRef, useState } from 'react';

/**
 * Unique 3D Liquid Scroll Reveal Component
 * Provides Apple/Linear-grade smooth scroll-triggered entrances with 3D liquid lift, unblur & stagger.
 */
export default function ScrollReveal({
  children,
  variant = 'fade-up', // 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in'
  delay = 0, // delay in ms
  duration = 750, // duration in ms
  threshold = 0.12,
  className = '',
  cascade = false, // if true, staggers direct children automatically
  staggerDelay = 80, // delay per child in ms if cascade is true
  ...props
}) {
  const domRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = domRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [threshold]);

  // Initial hidden transform styles based on variant
  const getInitialTransform = () => {
    switch (variant) {
      case 'fade-up':
        return 'translate3d(0, 36px, 0) scale(0.97) rotateX(4deg)';
      case 'fade-down':
        return 'translate3d(0, -36px, 0) scale(0.97)';
      case 'fade-left':
        return 'translate3d(-40px, 0, 0) scale(0.98)';
      case 'fade-right':
        return 'translate3d(40px, 0, 0) scale(0.98)';
      case 'zoom-in':
        return 'translate3d(0, 20px, 0) scale(0.92)';
      default:
        return 'translate3d(0, 32px, 0)';
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale(1) rotateX(0deg)' : getInitialTransform(),
    filter: isVisible ? 'blur(0px)' : 'blur(5px)',
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform, filter',
    transformStyle: 'preserve-3d',
  };

  return (
    <div ref={domRef} style={style} className={`scroll-reveal-box ${className}`} {...props}>
      {children}
    </div>
  );
}
