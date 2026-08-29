import React, { useEffect, useRef } from 'react';

export default function EmberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return () => window.removeEventListener('resize', handleResize);
    }

    const particleCount = Math.min(45, Math.floor(width / 30));
    const embers = [];

    const colors = [
      'rgba(216, 99, 44, ',   // Ember #D8632C
      'rgba(232, 172, 78, ',  // Saffron #E8AC4E
      'rgba(255, 120, 60, ',  // Bright Flame
      'rgba(169, 134, 90, '   // Brass #A9865A
    ];

    for (let i = 0; i < particleCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedY: Math.random() * 0.7 + 0.25,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        oscillation: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.02 + 0.01
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      embers.forEach((p) => {
        p.y -= p.speedY;
        p.oscillation += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.oscillation) * 0.35;

        // Pulse opacity
        p.opacity += (Math.random() - 0.5) * 0.03;
        if (p.opacity > 0.8) p.opacity = 0.8;
        if (p.opacity < 0.1) p.opacity = 0.1;

        // Reset if goes off top or sides
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.opacity = Math.random() * 0.5 + 0.2;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${p.opacity})`;
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = '#D8632C';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-70"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
