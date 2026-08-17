import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { FaApple } from 'react-icons/fa';

export default function GlassBook({ isBootComplete = false, onBootComplete }: { isBootComplete?: boolean, onBootComplete?: () => void }) {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
  
  // 0=Init, 1=Logo, 2=Progress, 3=Closing/Transforming, 4=Done (Scroll Physics Active)
  // If already booted, skip straight to phase 4!
  const [bootPhase, setBootPhase] = useState(isBootComplete ? 4 : 0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- BOOT SEQUENCE MOTION VALUES ---
  const actualRotateX = useMotionValue(isBootComplete ? 90 : 0); // Starts open!
  const actualScale = useMotionValue(isBootComplete ? 1 : 1.5); // Starts massive!
  const actualY = useMotionValue(isBootComplete ? (isMobile ? '25vh' : '-5vh') : '5vh'); // Shifted down just a little bit

  useEffect(() => {
    if (isBootComplete) return; // Skip boot sequence if already booted!

    // Sequence
    const t1 = setTimeout(() => setBootPhase(1), 600);
    const t2 = setTimeout(() => setBootPhase(2), 2000);
    const t3 = setTimeout(() => {
      setBootPhase(3);
      
      // TRANSFORMATION (Shared by Desktop Laptop and Mobile Phone)
      if (!isMobile) {
        animate(actualRotateX, 90, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
      }
      animate(actualScale, 1, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
      
      const finalY = isMobile ? '25vh' : '-5vh';
      animate(actualY, finalY, { duration: 1.5, ease: [0.22, 1, 0.36, 1], onComplete: () => {
         setBootPhase(4);
         if (onBootComplete) onBootComplete();
      }});
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onBootComplete, actualRotateX, actualScale, actualY, isMobile]);


  // --- SCROLL PHYSICS ENGINE ---
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [90, 0, 0, 90]);
  const laptopX = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.4, 0.45, 0.65, 0.7, 0.85, 0.9, 0.95, 1], 
    ['0vw', '0vw', '-25vw', '-25vw', '25vw', '25vw', '0vw', '0vw', '25vw', '25vw', '0vw']
  );
  const laptopScrollY = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.4, 0.45, 0.65, 0.7, 0.85, 0.9, 0.95, 1], 
    ['-5vh', '15vh', '20vh', '20vh', '20vh', '20vh', '15vh', '15vh', '0vh', '0vh', '10vh']
  );
  const mobileScrollY = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.4, 0.45, 0.65, 0.7, 0.85, 0.9, 0.95, 1], 
    ['25vh', '15vh', '20vh', '20vh', '20vh', '20vh', '15vh', '15vh', '0vh', '0vh', '10vh']
  );
  
  const laptopRotateY = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.4, 0.45, 0.65, 0.7, 0.85, 0.9, 0.95, 1], 
    [0, 0, 25, 25, -25, -25, 0, 0, -25, -25, 0]
  );
  
  // Handover control from programmatic animation to scroll physics
  useMotionValueEvent(scrollRotateX, "change", (latest) => {
    if (bootPhase === 4) actualRotateX.set(latest);
  });
  useMotionValueEvent(laptopScrollY, "change", (latest) => {
    if (!isMobile && bootPhase === 4) actualY.set(latest);
  });
  useMotionValueEvent(mobileScrollY, "change", (latest) => {
    if (isMobile && bootPhase === 4) actualY.set(latest);
  });

  const laptopLogoOpacity = useTransform(actualRotateX, [90, 80], [1, 0]);



  const screenScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 1]);

  const [screenData, setScreenData] = useState({
    title: "LOCAL2BRAND",
    subtitle: "Initializing digital footprint...",
    color: "text-cyan-400",
    gradient: "from-blue-400 via-cyan-300 to-emerald-300"
  });

  useEffect(() => {
    if (bootPhase < 4) return;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.85) {
        setScreenData({ title: "SYSTEM READY", subtitle: "Commencing power down sequence...", color: "text-rose-400", gradient: "from-rose-500 via-red-400 to-orange-400" });
      } else if (latest > 0.75) {
        setScreenData({ title: "TRANSFORMATION", subtitle: "Awaiting final user authorization.", color: "text-orange-400", gradient: "from-orange-400 via-amber-300 to-yellow-300" });
      } else if (latest > 0.45) {
        setScreenData({ title: "WEAPONS ONLINE", subtitle: "Deploying Web Engineering & SEO Dominance.", color: "text-emerald-400", gradient: "from-emerald-400 via-teal-300 to-cyan-400" });
      } else if (latest > 0.15) {
        setScreenData({ title: "EVOLUTION PROTOCOL", subtitle: "Executing Phase 1: Strategic Market Audit.", color: "text-fuchsia-400", gradient: "from-fuchsia-500 via-purple-400 to-pink-400" });
      } else {
        setScreenData({ title: "LOCAL2BRAND", subtitle: "Initializing digital footprint...", color: "text-cyan-400", gradient: "from-blue-400 via-cyan-300 to-emerald-300" });
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, bootPhase]);

  const renderBootScreen = () => (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#030303] z-30 overflow-hidden">
      {/* Subtle ambient core glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence>
        {bootPhase >= 1 && bootPhase < 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }} // Clean opacity exit (no blur) to maintain perfect 60fps during 3D shrink
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center z-10 w-full px-8"
          >
            {/* Minimalist Glass Logo Mark */}
            <div className="relative mb-8">
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20 opacity-60" />
                <span className="font-medium text-lg text-white tracking-[0.1em] relative z-10">L2B</span>
              </div>
            </div>

            {/* Premium Typography */}
            <h1 className="text-xl md:text-3xl font-light tracking-[0.3em] text-white/90 uppercase mb-12">
              Local<span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">2</span>Brand
            </h1>
            
            {/* Razor-thin glowing progress bar */}
            <div className="w-48 md:w-64 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: bootPhase === 2 ? "100%" : "35%" }}
                transition={{ duration: bootPhase === 2 ? 0.3 : 1.5, ease: "circOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              />
            </div>

            {/* Ultra-subtle status text */}
            <div className="mt-6 font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-white/30 uppercase">
              {bootPhase === 1 ? "Authenticating Session" : "Secure Connection Established"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Premium Glass Screen Glare */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.08] pointer-events-none" />
    </div>
  );

  const renderScreenContent = () => (
    <motion.div 
      style={{ scale: screenScale }}
      className={`w-[95%] h-[93%] rounded-xl bg-black border border-white/10 relative overflow-hidden flex flex-col p-10 shadow-[inset_0_0_50px_rgba(0,0,0,1)]`}
    >
      {/* Show the boot screen overlay if booting, otherwise show normal content! */}
      {bootPhase < 4 && renderBootScreen()}

      <div className="flex items-center gap-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
      </div>
      
      <div className={`${screenData.color} text-base font-mono mb-2 transition-colors duration-500 drop-shadow-md`}>~ /local2brand/core</div>
      <div className="text-base font-mono text-green-400 mb-1 drop-shadow-md">$ {screenData.subtitle}</div>
      <div className="text-base font-mono text-blue-300/80 mb-8 animate-pulse drop-shadow-md">[INFO] Processing layout data...</div>
      
      <h1 className={`text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${screenData.gradient} mt-auto transition-all duration-700 filter drop-shadow-lg`}>
        {screenData.title}
      </h1>
      
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
    </motion.div>
  );

  const MobilePhoneUI = ({ color, title, iconClass }: { color: string, title: string, iconClass: string }) => (
    <div className="w-full h-full bg-black rounded-[2rem] border-[4px] border-zinc-700 overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,1)] flex flex-col pt-8 p-4">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-20 flex items-center justify-end px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-b ${color} opacity-20 pointer-events-none blur-xl`} />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <FaApple className="w-4 h-4 text-white" />
          </div>
          <div className="w-6 h-6 rounded-full border border-white/20" />
        </div>
        <div className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl mb-4 flex items-center justify-center">
          <div className={`w-10 h-10 rounded-full ${iconClass} flex items-center justify-center`}>
            <div className="w-4 h-4 bg-white/50 rounded-full" />
          </div>
        </div>
        <h3 className="text-white font-bold text-lg mb-2 leading-tight">{title}</h3>
        <div className="space-y-2 mt-auto">
          <div className="w-full h-2 bg-white/10 rounded-full" />
          <div className="w-3/4 h-2 bg-white/10 rounded-full" />
          <div className="w-1/2 h-2 bg-white/10 rounded-full" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50 pointer-events-none transform -skew-x-12 translate-x-1/4" />
    </div>
  );

  return (
    <div className="w-full h-full flex items-center justify-center relative pointer-events-none" style={{ perspective: '1500px' }}>
      
      {/* --- DESKTOP LAPTOP RENDER --- */}
      {!isMobile && (
        <motion.div 
          style={{ 
            x: laptopX, 
            y: actualY, 
            rotateY: laptopRotateY, 
            scale: actualScale
          }}
          className="relative flex flex-col items-center transform-style-preserve-3d transition-transform duration-300"
        >
          <motion.div 
            style={{ rotateX: actualRotateX, transformOrigin: "bottom" }}
            className={`relative w-[650px] h-[420px] rounded-t-[2rem] border-[3px] ${bootPhase < 3 ? 'border-[#1a1a1a] bg-[#0a0a0a]' : 'border-zinc-700 bg-zinc-900'} shadow-[0_-20px_50px_rgba(255,255,255,0.05)] flex items-center justify-center overflow-hidden z-20 transition-colors duration-1000`}
          >
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-60" />
            {renderScreenContent()}
            <motion.div 
              style={{ opacity: laptopLogoOpacity }}
              className="absolute inset-0 flex items-center justify-center bg-zinc-800 rounded-t-[2rem] border-[2px] border-zinc-600 z-50 transform rotate-x-180 backface-hidden"
            >
              <FaApple className="w-24 h-24 text-zinc-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" />
            </motion.div>
          </motion.div>

          {/* Laptop Base */}
          <div className={`relative w-[650px] h-[25px] rounded-b-2xl border ${bootPhase < 3 ? 'border-[#1a1a1a] bg-[#2a2a2a]' : 'border-zinc-600 bg-zinc-800'} shadow-[0_40px_80px_rgba(0,0,0,1)] z-10 transition-colors duration-1000`}>
            <div className="absolute top-0 inset-x-0 h-[2px] bg-white/40" />
            <div className="absolute -bottom-[6px] inset-x-4 h-[6px] bg-zinc-900/80 rounded-b-full blur-[3px]" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[100px] h-[4px] bg-zinc-600 rounded-b-md" />
            <div 
              className={`absolute -top-[300px] inset-x-0 h-[300px] ${bootPhase < 3 ? 'bg-[#1a1a1a]' : 'bg-zinc-800/90'} border border-white/10 rounded-t-xl transition-colors duration-1000`}
              style={{ transform: 'rotateX(90deg)', transformOrigin: 'bottom' }}
            >
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[150px] h-[90px] rounded-md bg-zinc-900/80 border border-white/5" />
              <div className="absolute top-4 inset-x-6 bottom-[120px] rounded-lg bg-black/90 border border-white/5" />
            </div>
          </div>
          
          <div className="absolute -bottom-[120px] w-[800px] h-[60px] bg-cyan-900/30 blur-[50px] rounded-full" />
        </motion.div>
      )}

      {/* --- MOBILE PHONE RENDER (Identical behavior to Laptop) --- */}
      {isMobile && (
        <motion.div 
          style={{ 
            scale: actualScale, 
            y: actualY,
            x: laptopX,
            rotateY: laptopRotateY,
          }}
          className="relative w-[240px] h-[480px] perspective-[2000px] flex items-center justify-center"
        >
          <div className="absolute inset-0 w-full h-full rounded-[2.5rem] border-[4px] border-zinc-700 bg-black shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Glossy bezel reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-50" />
            
            {/* Dynamic notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-40 flex items-center justify-end px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
            </div>

            {/* Inner Content! */}
            <div className="relative w-full h-full pt-6">
              {bootPhase < 4 && renderBootScreen()}
              <div className="w-full h-full flex flex-col p-4">
                <MobilePhoneUI color="from-cyan-500 to-transparent" title="Web Engineering" iconClass="bg-cyan-500/20" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
