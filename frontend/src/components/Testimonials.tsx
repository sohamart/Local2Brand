import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "CMO, TechFlow",
    text: "They didn't just build a website. They engineered a revenue machine.",
    gradient: "from-cyan-400 via-blue-500 to-violet-600"
  },
  {
    name: "David Chen",
    role: "Founder, Elevate",
    text: "Aesthetic mastery that forced our competitors into complete irrelevance.",
    gradient: "from-fuchsia-500 via-rose-500 to-orange-500"
  },
  {
    name: "Marcus Aurelius",
    role: "CEO, Stoic Brands",
    text: "Absolute dominance. We capture 90% of local search intent now.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate reviews every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full relative">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] lg:min-h-[70vh]">
        
        {/* LEFT COLUMN: The Review Card */}
        <div className="hidden lg:flex relative w-full h-full liquid-glass-dark rounded-[3rem] border-t border-cyan-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex-col justify-center py-12 px-6 md:px-12 z-10">
          
          {/* Background Ambient Glow mapped to the current review - subtle premium glow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <motion.div 
              key={`bg-${currentIndex}`}
              initial={{ opacity: 0.1, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.1, scale: 1.1 }}
              transition={{ duration: 1 }}
              className={`w-[120%] h-[120%] bg-gradient-to-tr ${reviews[currentIndex].gradient} rounded-full blur-[100px] md:blur-[120px]`}
            />
          </div>

          <div className="relative z-10 w-full">
            
            {/* Section Header */}
            <div className="mb-10 md:mb-12 text-center lg:text-left hidden md:block">
              <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-white/40 mb-2">
                Industry Consensus
              </h2>
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto lg:mx-0" />
            </div>

            {/* The Cinematic Review Crossfader */}
            <div className="relative flex flex-col justify-center h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  {/* Typography Quote */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight mb-10 text-center lg:text-left">
                    "<span className={`text-transparent bg-clip-text bg-gradient-to-r ${reviews[currentIndex].gradient}`}>
                      {reviews[currentIndex].text}
                    </span>"
                  </h3>

                  {/* Reviewer Info Pill */}
                  <div className="inline-flex items-center space-x-4 md:space-x-6 liquid-glass px-5 md:px-6 py-3 rounded-[2rem] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mx-auto lg:mx-0 flex-row w-max max-w-full">
                    
                    {/* Avatar */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${reviews[currentIndex].gradient} flex items-center justify-center shadow-inner shrink-0`}>
                      <span className="font-black text-white text-base md:text-lg">{reviews[currentIndex].name.charAt(0)}</span>
                    </div>
                    
                    {/* Name & Role */}
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm md:text-base truncate">{reviews[currentIndex].name}</h4>
                      <p className="text-white/50 text-[10px] md:text-xs font-medium tracking-wide uppercase truncate">{reviews[currentIndex].role}</p>
                    </div>

                    {/* Stars */}
                    <div className="hidden sm:flex space-x-1 pl-4 md:pl-6 border-l border-white/10 shrink-0">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-3 h-3 md:w-4 md:h-4 fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      ))}
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Custom Progress/Pagination Dots */}
            <div className="flex justify-center lg:justify-start space-x-2 md:space-x-3 mt-10 md:mt-12">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className="relative w-10 md:w-16 h-1.5 rounded-full overflow-hidden bg-white/10 outline-none"
                >
                  {i === currentIndex && (
                    <motion.div 
                      layoutId="active-review-progress"
                      className="absolute inset-0 bg-white"
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 6, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Empty Window for 3D Laptop */}
        <div className="hidden lg:block w-full h-full pointer-events-none">
          {/* This empty div forces the grid to reserve the right half of the screen, allowing the fixed GlassBook background to be perfectly framed here. */}
        </div>

      </div>
    </div>
  );
}
