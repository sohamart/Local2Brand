import React, { useEffect, useRef } from 'react';

export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mobile / Touch detection
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    // Mouse coordinates & smooth liquid repulsion
    const mouse = {
      x: -1000,
      y: -1000,
      radius: isTouchDevice ? 130 : 170,
    };

    // Crisp grid node spacing (responsive: 50px on mobile, 58px on desktop)
    const spacing = isTouchDevice ? 50 : 58;
    let cols = Math.ceil(width / spacing) + 2;
    let rows = Math.ceil(height / spacing) + 2;
    let nodes = [];

    // Slow, serene glowing energy streams (ONLY active in Dark Mode)
    const lightStreams = [];
    const maxStreams = isTouchDevice ? 4 : 8;

    class LightStream {
      constructor() {
        this.reset();
      }

      reset() {
        this.horizontal = Math.random() > 0.5;
        this.speed = Math.random() * 0.7 + 0.5; // Slow, calm speed
        this.length = Math.random() * 200 + 120; // Long elegant glow trail

        if (this.horizontal) {
          this.r = Math.floor(Math.random() * rows);
          this.x = -this.length;
        } else {
          this.c = Math.floor(Math.random() * cols);
          this.y = -this.length;
        }

        this.colorType = Math.random() > 0.4 ? 'cyan' : 'purple';
        this.opacity = Math.random() * 0.3 + 0.45;
      }

      update() {
        if (this.horizontal) {
          this.x += this.speed;
          if (this.x - this.length > width) this.reset();
        } else {
          this.y += this.speed;
          if (this.y - this.length > height) this.reset();
        }
      }

      draw(isDark, offsetX, offsetY) {
        // LIGHT MODE DIRECTIVE: Lightings are ONLY drawn in dark mode!
        if (!isDark) return;

        if (this.horizontal) {
          const streamY = offsetY + this.r * spacing;
          const headX = this.x;
          const tailX = Math.max(0, this.x - this.length);

          const grad = ctx.createLinearGradient(tailX, streamY, headX, streamY);
          const col = this.colorType === 'cyan' ? '56, 189, 248' : '168, 85, 247';

          grad.addColorStop(0, `rgba(${col}, 0)`);
          grad.addColorStop(0.7, `rgba(${col}, ${this.opacity * 0.4})`);
          grad.addColorStop(1, `rgba(${col}, ${this.opacity})`);

          // Soft glowing beam
          ctx.beginPath();
          ctx.moveTo(tailX, streamY);
          ctx.lineTo(headX, streamY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          // Glowing head node
          ctx.beginPath();
          ctx.arc(headX, streamY, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col}, ${this.opacity * 0.9})`;
          ctx.fill();
        } else {
          const streamX = offsetX + this.c * spacing;
          const headY = this.y;
          const tailY = Math.max(0, this.y - this.length);

          const grad = ctx.createLinearGradient(streamX, tailY, streamX, headY);
          const col = this.colorType === 'cyan' ? '56, 189, 248' : '168, 85, 247';

          grad.addColorStop(0, `rgba(${col}, 0)`);
          grad.addColorStop(0.7, `rgba(${col}, ${this.opacity * 0.4})`);
          grad.addColorStop(1, `rgba(${col}, ${this.opacity})`);

          ctx.beginPath();
          ctx.moveTo(streamX, tailY);
          ctx.lineTo(streamX, headY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(streamX, headY, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col}, ${this.opacity * 0.9})`;
          ctx.fill();
        }
      }
    }

    class LiquidNode {
      constructor(originX, originY) {
        this.originX = originX;
        this.originY = originY;
        this.x = originX;
        this.y = originY;
        this.vx = 0;
        this.vy = 0;
        this.radius = isTouchDevice ? 1.1 : 1.3;
      }

      update() {
        // Fluid Magnetic Repulsion from cursor / touch
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && distance > 0) {
          const force = (1 - distance / mouse.radius) * (isTouchDevice ? 4.5 : 6.0);
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force;
          this.vy -= Math.sin(angle) * force;
        }

        // Slow smooth spring return physics
        const returnDx = this.originX - this.x;
        const returnDy = this.originY - this.y;
        this.vx += returnDx * 0.045;
        this.vy += returnDy * 0.045;

        // Friction damping
        this.vx *= 0.84;
        this.vy *= 0.84;

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    const initGrid = () => {
      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;
      nodes = [];

      const totalGridW = (cols - 1) * spacing;
      const totalGridH = (rows - 1) * spacing;
      const offsetX = (width - totalGridW) / 2;
      const offsetY = (height - totalGridH) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * spacing;
          const originY = offsetY + r * spacing;
          nodes.push(new LiquidNode(originX, originY));
        }
      }
    };

    initGrid();

    for (let i = 0; i < maxStreams; i++) {
      const s = new LightStream();
      if (s.horizontal) s.x = Math.random() * width;
      else s.y = Math.random() * height;
      lightStreams.push(s);
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      const totalW = (cols - 1) * spacing;
      const totalH = (rows - 1) * spacing;
      const offsetX = (width - totalW) / 2;
      const offsetY = (height - totalH) / 2;

      const totalNodes = nodes.length;
      for (let i = 0; i < totalNodes; i++) {
        nodes[i].update();
      }

      // 1. Single Batched Stroke for all connecting liquid grid lines (Crisp & Clean)
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const current = nodes[index];
          if (!current) continue;

          // Connect to right neighbor
          if (c < cols - 1) {
            const right = nodes[index + 1];
            if (right) {
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(right.x, right.y);
            }
          }

          // Connect to bottom neighbor
          if (r < rows - 1) {
            const bottom = nodes[index + cols];
            if (bottom) {
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(bottom.x, bottom.y);
            }
          }
        }
      }
      ctx.strokeStyle = isDark
        ? 'rgba(255, 255, 255, 0.055)'
        : 'rgba(0, 114, 255, 0.075)';
      ctx.lineWidth = isTouchDevice ? 0.85 : 0.95;
      ctx.stroke();

      // 2. Single Batched Fill for all intersection node dots
      ctx.beginPath();
      for (let i = 0; i < totalNodes; i++) {
        const node = nodes[i];
        ctx.moveTo(node.x + node.radius, node.y);
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      }
      ctx.fillStyle = isDark
        ? 'rgba(56, 189, 248, 0.28)'
        : 'rgba(0, 114, 255, 0.2)';
      ctx.fill();

      // 3. Slow, Serene Glowing Light Streams (ONLY in Dark Mode)
      if (isDark) {
        for (let i = 0; i < lightStreams.length; i++) {
          lightStreams[i].update();
          lightStreams[i].draw(isDark, offsetX, offsetY);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Interactive Liquid Magnetic Grid Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90 pointer-events-none"
      />
    </div>
  );
}
