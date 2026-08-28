import React, { useEffect, useRef, useState } from 'react';

/**
 * Ultra-Optimized 120 FPS Scroll Reveal Component
 * Uses pure GPU transform3d + opacity with zero expensive blur re-rasterization.
 */
export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.08,
  className = '',
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
        rootMargin: '0px 0px -30px 0px',
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

  const getInitialTransform = () => {
    switch (variant) {
      case 'fade-up':
        return 'translate3d(0, 24px, 0)';
      case 'fade-down':
        return 'translate3d(0, -24px, 0)';
      case 'fade-left':
        return 'translate3d(-28px, 0, 0)';
      case 'fade-right':
        return 'translate3d(28px, 0, 0)';
      case 'zoom-in':
        return 'translate3d(0, 16px, 0) scale(0.96)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={domRef} style={style} className={`scroll-reveal-box ${className}`} {...props}>
      {children}
    </div>
  );
}
