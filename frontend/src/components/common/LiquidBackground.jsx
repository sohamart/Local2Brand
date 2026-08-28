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

    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    // Mouse coordinates & interaction radius
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
    };

    // Responsive grid node spacing (90px for smooth 120 FPS)
    const spacing = 85;
    let cols = Math.ceil(width / spacing) + 2;
    let rows = Math.ceil(height / spacing) + 2;
    let nodes = [];

    class Node {
      constructor(originX, originY) {
        this.originX = originX;
        this.originY = originY;
        this.x = originX;
        this.y = originY;
        this.vx = 0;
        this.vy = 0;
      }

      update() {
        if (isTouchDevice) return; // Skip physics computation on touch

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && distance > 0) {
          const force = (1 - distance / mouse.radius) * 6;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force;
          this.vy -= Math.sin(angle) * force;
        }

        // Spring return physics
        const returnDx = this.originX - this.x;
        const returnDy = this.originY - this.y;
        this.vx += returnDx * 0.06;
        this.vy += returnDy * 0.06;

        // Friction dampening
        this.vx *= 0.82;
        this.vy *= 0.82;

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
          nodes.push(new Node(originX, originY));
        }
      }
    };

    initGrid();

    const drawCanvas = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      const totalNodes = nodes.length;
      for (let i = 0; i < totalNodes; i++) {
        nodes[i].update();
      }

      // 1. Single Batched Stroke for all Grid Lines
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const current = nodes[index];
          if (!current) continue;

          if (c < cols - 1) {
            const right = nodes[index + 1];
            if (right) {
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(right.x, right.y);
            }
          }

          if (r < rows - 1) {
            const bottom = nodes[index + cols];
            if (bottom) {
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(bottom.x, bottom.y);
            }
          }
        }
      }
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(0, 114, 255, 0.05)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 2. Single Batched Fill for all Nodes
      ctx.beginPath();
      for (let i = 0; i < totalNodes; i++) {
        const node = nodes[i];
        ctx.moveTo(node.x + 1.5, node.y);
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
      }
      ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.35)' : 'rgba(121, 40, 202, 0.22)';
      ctx.fill();
    };

    // On mobile devices, draw once statically to keep scrolling at 120 FPS with 0 battery drain
    if (isTouchDevice) {
      drawCanvas();
      const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initGrid();
        drawCanvas();
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    // On desktop devices with mouse, run interactive physics render loop
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
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
    window.addEventListener('resize', handleResize);

    const render = () => {
      drawCanvas();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* High-Performance Symmetrical Ambient Gradient Halos */}
      <div
        className="absolute top-0 w-[700px] h-[450px] rounded-full pointer-events-none"
        style={{
          left: '50%',
          transform: 'translate3d(-50%, 0, 0)',
          background: 'radial-gradient(circle, rgba(0, 198, 255, 0.08) 0%, rgba(121, 40, 202, 0.06) 40%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 w-[750px] h-[500px] rounded-full pointer-events-none"
        style={{
          left: '50%',
          transform: 'translate3d(-50%, 0, 0)',
          background: 'radial-gradient(circle, rgba(121, 40, 202, 0.08) 0%, rgba(255, 0, 128, 0.05) 40%, transparent 70%)',
        }}
      />

      {/* Interactive Physics Magnetic Repulsion Grid Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-80 pointer-events-none"
      />
    </div>
  );
}
