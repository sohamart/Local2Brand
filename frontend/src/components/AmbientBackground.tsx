import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';

export default function AmbientBackground() {
  const [isMobile, setIsMobile] = useState(false);

  // High-performance motion values that bypass React re-renders (fixes jitter)
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth spring for the background spotlight
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, mouseX, mouseY]);

  // Dynamic CSS templates updated via Framer Motion without re-rendering the DOM
  const textMaskImage = useMotionTemplate`radial-gradient(circle 300px at ${mouseX}px ${mouseY}px, black 10%, transparent 100%)`;

  return (
    <div className="fixed inset-0 w-full h-full -z-20 overflow-hidden bg-black">
      
      {/* 1. Fluid Aurora Mesh Gradients - Sped up for more noticeable, soft animation */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-50 mix-blend-screen">
          <motion.div 
            animate={{ 
              x: ['0%', '15%', '-15%', '0%'],
              y: ['0%', '-15%', '15%', '0%'],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-fuchsia-600/30 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: ['0%', '-20%', '10%', '0%'],
              y: ['0%', '20%', '-10%', '0%'],
              scale: [1, 0.9, 1.2, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] bg-cyan-600/30 rounded-full blur-[130px]"
          />
          <motion.div 
            animate={{ 
              x: ['0%', '20%', '-10%', '0%'],
              y: ['0%', '-10%', '20%', '0%'],
              scale: [1, 1.1, 0.8, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[40%] w-[35vw] h-[35vw] bg-violet-600/20 rounded-full blur-[100px]"
          />
        </div>
      )}

      {/* 2. Premium SVG Dot Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 3. Mouse-Revealed Floating Tech Text (Only visible near cursor) */}
      {!isMobile && (
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            WebkitMaskImage: textMaskImage,
            maskImage: textMaskImage
          }}
        >
          {/* Left Side Texts (Colorful) */}
          {[
            { text: 'React', color: 'text-cyan-400' },
            { text: 'Next.js', color: 'text-white' },
            { text: 'Framer', color: 'text-fuchsia-400' }
          ].map((item, i) => (
            <motion.div
              key={`left-${i}`}
              initial={{ y: `${20 + i * 25}vh`, x: `${5 + Math.random() * 10}vw` }}
              animate={{
                y: [`${20 + i * 25}vh`, `${10 + i * 25}vh`, `${20 + i * 25}vh`],
                x: [`${5 + Math.random() * 10}vw`, `${10 + Math.random() * 5}vw`, `${5 + Math.random() * 10}vw`],
              }}
              transition={{ duration: 25 + i * 5, repeat: Infinity, ease: "linear" }}
              className={`absolute font-bold text-2xl tracking-widest ${item.color} select-none drop-shadow-md`}
              style={{ rotate: '-90deg' }}
            >
              {item.text}
            </motion.div>
          ))}

          {/* Right Side Texts (Colorful) */}
          {[
            { text: 'TypeScript', color: 'text-blue-400' },
            { text: 'Tailwind', color: 'text-teal-400' },
            { text: 'SEO', color: 'text-violet-400' }
          ].map((item, i) => (
            <motion.div
              key={`right-${i}`}
              initial={{ y: `${20 + i * 25}vh`, x: `${85 - Math.random() * 10}vw` }}
              animate={{
                y: [`${20 + i * 25}vh`, `${30 + i * 25}vh`, `${20 + i * 25}vh`],
                x: [`${85 - Math.random() * 10}vw`, `${80 - Math.random() * 5}vw`, `${85 - Math.random() * 10}vw`],
              }}
              transition={{ duration: 28 + i * 5, repeat: Infinity, ease: "linear" }}
              className={`absolute font-bold text-2xl tracking-widest ${item.color} select-none drop-shadow-md`}
              style={{ rotate: '90deg' }}
            >
              {item.text}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 4. Mouse Interactive Spotlight (Follows Cursor Smoothly) */}
      {!isMobile && (
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
      )}

      {/* 5. Vignette Shadow (Darkens the edges) */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none [mask-image:radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
      
    </div>
  );
}
