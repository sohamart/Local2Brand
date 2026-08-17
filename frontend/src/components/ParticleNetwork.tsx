import { useEffect, useRef, useState } from 'react';

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: Particle[] = [];
    const particleCount = 200; // Slightly more for the larger size

    // Target mouse position
    let mouse = {
      x: width / 2,
      y: height / 2,
    };

    // Actual center of the sphere (eases towards mouse)
    let center = {
      x: width / 2,
      y: height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    class Particle {
      angle: number;
      baseRadius: number;
      length: number;
      phaseOffset: number;
      speed: number;

      constructor(index: number) {
        // Distribute evenly around the circle
        this.angle = (index / particleCount) * Math.PI * 2;
        
        // Ektu Boro: Increased radius (160 to 450)
        this.baseRadius = 160 + Math.random() * 290; 
        
        this.length = Math.random() * 6 + 4; // Slightly longer dashes
        this.phaseOffset = this.angle * 4 + Math.random(); // More complex wave pattern
        
        // Faster base rotation
        this.speed = 0.002 + Math.random() * 0.002;
      }

      update() {
        // Faster rotation
        this.angle += this.speed;
      }

      draw(currentTime: number) {
        if (!ctx) return;

        // The Magic Wave Math!
        // Faster wave pulse
        const wave = Math.sin(currentTime * 3 + this.phaseOffset);
        
        // Much larger wave amplitude (60px pulse instead of 25px)
        const currentRadius = this.baseRadius + wave * 60;

        // Calculate exact position
        const x = center.x + Math.cos(this.angle) * currentRadius;
        const y = center.y + Math.sin(this.angle) * currentRadius;

        // Draw outward facing dash
        const endX = x + Math.cos(this.angle) * this.length;
        const endY = y + Math.sin(this.angle) * this.length;

        // Modern Color Shift
        let r, g, b;
        if (wave > 0.2) {
          // Intense Fuchsia / Neon Red peak
          r = 244; g = 63; b = 94; // Rose-500
        } else if (wave < -0.2) {
          // Intense Neon Cyan trough
          r = 34; g = 211; b = 238; // Cyan-400
        } else {
          // Transition violet
          r = 167; g = 139; b = 250; // Violet-400
        }
        
        // Dynamic opacity based on wave
        const opacity = 0.4 + ((wave + 1) / 2) * 0.6; // 0.4 to 1.0

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        
        // Super modern glowing effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        
        ctx.stroke();
        
        // Reset shadow for next draw
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(i));
    }

    let animationFrameId: number;

    const animate = () => {
      // Clear with slight trailing effect for motion blur
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Faster mouse easing
      center.x += (mouse.x - center.x) * 0.1;
      center.y += (mouse.y - center.y) * 0.1;

      // Faster global time
      time += 0.035; 

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(time);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20"
      style={{ opacity: 1 }}
    />
  );
}
