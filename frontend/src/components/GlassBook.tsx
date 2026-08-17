import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { FaApple } from 'react-icons/fa';

export default function GlassBook({ onBootComplete }: { onBootComplete?: () => void }) {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  
  // 0=Init, 1=Logo, 2=Progress, 3=Closing/Transforming, 4=Done (Scroll Physics Active)
  const [bootPhase, setBootPhase] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- BOOT SEQUENCE MOTION VALUES ---
  const actualRotateX = useMotionValue(0); // Starts open!
  const actualScale = useMotionValue(1.5); // Starts massive!
  const actualY = useMotionValue('5vh'); // Shifted down just a little bit

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setBootPhase(4);
      actualScale.set(1);
      actualRotateX.set(90);
      actualY.set('0vh');
      if (onBootComplete) onBootComplete();
      return;
    }

    // Sequence
    const t1 = setTimeout(() => setBootPhase(1), 600);
    const t2 = setTimeout(() => setBootPhase(2), 2000);
    const t3 = setTimeout(() => {
      setBootPhase(3);
      
      // Transform physically into the exact start position of the normal GlassBook!
      animate(actualRotateX, 90, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
      animate(actualScale, 1, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
      animate(actualY, '-5vh', { duration: 1.5, ease: [0.22, 1, 0.36, 1], onComplete: () => {
         setBootPhase(4);
         if (onBootComplete) onBootComplete();
      }});
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onBootComplete, actualRotateX, actualScale, actualY]);


  // --- SCROLL PHYSICS ENGINE ---
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [90, 0, 0, 90]);
  const laptopX = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.4, 0.45, 0.65, 0.7, 0.85, 0.9, 0.95, 1], 
    ['0vw', '0vw', '-25vw', '-25vw', '25vw', '25vw', '0vw', '0vw', '25vw', '25vw', '0vw']
  );
  const scrollY = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.4, 0.45, 0.65, 0.7, 0.85, 0.9, 0.95, 1], 
    ['-5vh', '15vh', '20vh', '20vh', '20vh', '20vh', '15vh', '15vh', '0vh', '0vh', '10vh']
  );
  const laptopRotateY = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.4, 0.45, 0.65, 0.7, 0.85, 0.9, 0.95, 1], 
    [0, 0, 25, 25, -25, -25, 0, 0, -25, -25, 0]
  );
  
  // Handover control from programmatic animation to scroll physics
  useMotionValueEvent(scrollRotateX, "change", (latest) => {
    if (bootPhase === 4) actualRotateX.set(latest);
  });
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (bootPhase === 4) actualY.set(latest);
  });

  const laptopLogoOpacity = useTransform(actualRotateX, [90, 80], [1, 0]);

  // -- MOBILE 3 PHONES SWIPE LOGIC --
  const phone1X = useTransform(scrollYProgress, [0, 0.3, 0.4], ['0vw', '-50vw', '-50vw']);
  const phone1Y = useTransform(scrollYProgress, [0, 0.3, 0.4], ['0vh', '-10vh', '-10vh']);
  const phone1Rotate = useTransform(scrollYProgress, [0, 0.3, 0.4], [0, -15, -15]);
  const phone1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 0, 0]);
  const phone1Scale = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 0.8, 0.8]);

  const phone2X = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], ['10vw', '0vw', '0vw', '-50vw', '-50vw']);
  const phone2Y = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], ['-4vh', '0vh', '0vh', '-10vh', '-10vh']);
  const phone2Rotate = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], [5, 0, 0, -15, -15]);
  const phone2Opacity = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], [0.6, 1, 1, 0, 0]);
  const phone2Scale = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], [0.9, 1, 1, 0.8, 0.8]);

  const phone3X = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], ['20vw', '10vw', '10vw', '0vw', '0vw']);
  const phone3Y = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], ['-8vh', '-4vh', '-4vh', '0vh', '0vh']);
  const phone3Rotate = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], [10, 5, 5, 0, 0]);
  const phone3Opacity = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], [0.3, 0.6, 0.6, 1, 1]);
  const phone3Scale = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7], [0.8, 0.9, 0.9, 1, 1]);

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
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-8 z-30">
      <AnimatePresence>
        {bootPhase >= 1 && bootPhase < 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="text-5xl md:text-8xl font-black tracking-tighter">
              Local<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500 filter drop-shadow-[0_0_20px_rgba(217,70,239,0.8)]">2</span>Brand
            </div>
            
            <div className="font-mono text-sm md:text-lg text-emerald-400 opacity-80">
              {bootPhase === 1 ? "> Initializing Agency Protocol..." : "> Uplink Established. Access Granted."}
            </div>

            <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden mt-8">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: bootPhase === 2 ? "100%" : "30%" }}
                transition={{ duration: bootPhase === 2 ? 0.4 : 1.2, ease: "circInOut" }}
                className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_15px_rgba(217,70,239,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
    </div>
  );

  const renderScreenContent = () => (
    <motion.div 
      style={{ scale: screenScale }}
      className={`w-[95%] h-[93%] rounded-xl bg-black border border-white/10 relative overflow-hidden flex flex-col p-10 shadow-[inset_0_0_50px_rgba(0,0,0,1)]`}
    >
      {/* Show the boot screen overlay if booting, otherwise show normal content! */}
      {bootPhase < 3 && renderBootScreen()}

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

      {/* --- MOBILE 3 PHONES SWIPE RENDER --- */}
      {isMobile && (
        <div className="relative w-[160px] h-[320px] mt-[15vh] perspective-[2000px]">
          {/* Phones omitted for brevity in boot sequence */}
          <motion.div style={{ x: phone3X, y: phone3Y, rotateZ: phone3Rotate, opacity: phone3Opacity, scale: phone3Scale }} className="absolute inset-0 w-full h-full rounded-[2rem] liquid-glass-dark shadow-[0_30px_60px_rgba(0,0,0,0.8)] origin-bottom-right"><MobilePhoneUI color="from-fuchsia-500 to-transparent" title="SEO Dominance" iconClass="bg-fuchsia-500/20" /></motion.div>
          <motion.div style={{ x: phone2X, y: phone2Y, rotateZ: phone2Rotate, opacity: phone2Opacity, scale: phone2Scale }} className="absolute inset-0 w-full h-full rounded-[2rem] liquid-glass-dark shadow-[0_30px_60px_rgba(0,0,0,0.8)] origin-bottom-right"><MobilePhoneUI color="from-cyan-500 to-transparent" title="Web Engineering" iconClass="bg-cyan-500/20" /></motion.div>
          <motion.div style={{ x: phone1X, y: phone1Y, rotateZ: phone1Rotate, opacity: phone1Opacity, scale: phone1Scale }} className="absolute inset-0 w-full h-full rounded-[2rem] liquid-glass-dark shadow-[0_30px_60px_rgba(0,0,0,0.8)] origin-bottom-right"><MobilePhoneUI color="from-emerald-500 to-transparent" title="Strategic Audit" iconClass="bg-emerald-500/20" /></motion.div>
        </div>
      )}

    </div>
  );
}
