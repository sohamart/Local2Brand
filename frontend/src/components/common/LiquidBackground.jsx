import React, { useEffect, useRef } from 'react';

export default function LiquidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & interaction radius
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180, // Repulsion influence radius
    };

    // Responsive grid node spacing
    const spacing = 55;
    const cols = Math.floor(width / spacing) + 2;
    const rows = Math.floor(height / spacing) + 2;

    class Node {
      constructor(originX, originY) {
        this.originX = originX;
        this.originY = originY;
        this.x = originX;
        this.y = originY;
        this.vx = 0;
        this.vy = 0;
        this.radius = 1.5;
        this.color = '#7928ca';
      }

      update() {
        // 1. Mouse Reverse Repulsion Physics (Pushes away from cursor)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && distance > 0) {
          const force = (1 - distance / mouse.radius) * 7; // Reverse thrust intensity
          const angle = Math.atan2(dy, dx);
          // Push reversely in opposite direction of mouse
          this.vx -= Math.cos(angle) * force;
          this.vy -= Math.sin(angle) * force;
        }

        // 2. Spring return physics to original coordinate
        const returnDx = this.originX - this.x;
        const returnDy = this.originY - this.y;
        this.vx += returnDx * 0.05; // Spring stiffness
        this.vy += returnDy * 0.05;

        // 3. Friction dampening
        this.vx *= 0.84;
        this.vy *= 0.84;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.25;
        ctx.fill();
      }
    }

    // Initialize grid of physics nodes
    const nodes = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const originX = c * spacing - spacing / 2;
        const originY = r * spacing - spacing / 2;
        nodes.push(new Node(originX, originY));
      }
    }

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
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Render loop with dynamic connecting mesh lines
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid spring mesh lines between horizontal & vertical neighbors
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          const current = nodes[index];
          if (!current) continue;

          current.update();
          current.draw();

          // Connect to right neighbor
          if (c < cols - 1) {
            const right = nodes[index + 1];
            if (right) {
              ctx.beginPath();
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(right.x, right.y);
              ctx.strokeStyle = '#0072ff';
              ctx.globalAlpha = 0.055;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          // Connect to bottom neighbor
          if (r < rows - 1) {
            const bottom = nodes[index + cols];
            if (bottom) {
              ctx.beginPath();
              ctx.moveTo(current.x, current.y);
              ctx.lineTo(bottom.x, bottom.y);
              ctx.strokeStyle = '#7928ca';
              ctx.globalAlpha = 0.055;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

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
      {/* Interactive Physics Magnetic Repulsion Grid Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-80"
      />
    </div>
  );
}
