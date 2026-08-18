import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Code, PenTool, TrendingUp, Search, ShoppingCart, BarChart, ChevronRight } from 'lucide-react';
import GlassBook from '../components/GlassBook';
import AmbientBackground from '../components/AmbientBackground';
import BrandMarquee from '../components/BrandMarquee';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const services = [
  { icon: <Code className="w-8 h-8 text-cyan-400" />, title: "Web Engineering", desc: "High-performance applications built with modern stacks." },
  { icon: <PenTool className="w-8 h-8 text-fuchsia-400" />, title: "Brand Identity", desc: "Aesthetic mastery that forces your competitors into irrelevance." },
  { icon: <TrendingUp className="w-8 h-8 text-violet-400" />, title: "Growth Marketing", desc: "Data-driven campaigns that relentlessly acquire customers." },
  { icon: <Search className="w-8 h-8 text-emerald-400" />, title: "Search Dominance", desc: "Own the first page of Google and capture all local intent." },
  { icon: <ShoppingCart className="w-8 h-8 text-blue-400" />, title: "E-Commerce", desc: "Frictionless buying experiences that maximize conversion." },
  { icon: <BarChart className="w-8 h-8 text-orange-400" />, title: "Scale Strategy", desc: "Architecting your transition from a local shop to a massive brand." },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const flipUpVariant: Variants = {
  hidden: { opacity: 0, rotateX: -30, y: 50 },
  show: { opacity: 1, rotateX: 0, y: 0, transition: { type: "spring", stiffness: 80, damping: 20, duration: 0.8 } }
};

interface HomeProps {
  isBootComplete: boolean;
  onBootComplete: () => void;
}

const Home = ({ isBootComplete, onBootComplete }: HomeProps) => {
  return (
    <div className={`w-full font-sans text-white relative ${!isBootComplete ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isBootComplete ? 1 : 0, scale: isBootComplete ? 1 : 1.05 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "opacity, transform" }}
        className="fixed inset-0 w-full h-full -z-20 pointer-events-none"
      >
        <AmbientBackground />
      </motion.div>

      {/* GlassBook (Internal 3D Scroll Logic handles all movement) */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none flex items-center justify-center">
        <GlassBook isBootComplete={isBootComplete} onBootComplete={onBootComplete} />
      </div>
      
      {/* HTML Content - Native Scrolling */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isBootComplete ? 1 : 0 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full relative z-10"
      >
        {/* HERO SECTION - Fade and transform elegantly without CSS blur */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isBootComplete ? 1 : 0, y: isBootComplete ? 0 : 20 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "opacity, transform" }}
          className="relative h-[100vh] flex flex-col items-center justify-start pt-[10vh] md:pt-[18vh] px-6 pointer-events-none"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="liquid-glass inline-flex items-center px-5 py-2.5 rounded-full mb-8 shadow-[0_0_30px_rgba(34,211,238,0.25)] border border-cyan-400/30 backdrop-blur-3xl"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse mr-3 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <span className="text-xs md:text-sm text-cyan-50 font-bold tracking-[0.2em] uppercase">The Digital Frontier</span>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1 
              variants={fadeUpVariant}
              className="text-[4rem] sm:text-7xl md:text-8xl lg:text-[8rem] font-black leading-[0.9] tracking-tighter"
            >
              BEYOND
            </motion.h1>
            <motion.h1 
              variants={fadeUpVariant}
              className="text-[4.5rem] sm:text-7xl md:text-8xl lg:text-[8rem] font-black leading-[0.9] tracking-tighter"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 [text-shadow:0_0_40px_rgba(217,70,239,0.5)]">
                LOCAL.
              </span>
            </motion.h1>
          </motion.div>
        </motion.section>

        {/* STATS */}
        <section className="py-20 relative mt-[5vh] md:mt-[20vh] z-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className="liquid-glass-dark rounded-[2.5rem] p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.8)] grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 border-t border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,rgba(217,70,239,0.15)_50%,rgba(139,92,246,0.15)_100%)] pointer-events-none" />
              
              {[
                { value: "50+", label: "Brands Elevated" },
                { value: "75+", label: "Digital Assets" },
                { value: "20+", label: "Sectors Mastered" },
                { value: "100%", label: "Impact Driven" },
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex flex-col items-center justify-center text-center group cursor-default relative z-10"
                >
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-2 group-hover:from-cyan-400 group-hover:to-blue-600 transition-all duration-500 group-hover:[text-shadow:0_0_20px_rgba(34,211,238,0.5)]">
                    {stat.value}
                  </h2>
                  <p className="text-white/60 font-bold tracking-[0.15em] uppercase text-[10px] sm:text-xs group-hover:text-white transition-colors duration-500">{stat.label}</p>
                </motion.div>
              ))}
              
              <div className="col-span-2 md:col-span-4 w-full">
                <BrandMarquee />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SCROLL REVEAL EVOLUTION (Right Aligned on Desktop) */}
        <section className="py-24 md:py-40 px-6 lg:px-12 max-w-7xl mx-auto relative pointer-events-none z-20">
          <div className="ml-auto w-full lg:w-[45%] pointer-events-auto">
            <div className="max-w-7xl mx-auto w-full relative z-10">
              
            <div className="mb-16 md:mb-24 relative">
              <motion.h2 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter leading-tight"
              >
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-violet-500 [text-shadow:0_0_30px_rgba(217,70,239,0.4)]">Evolution</span> Protocol.
              </motion.h2>
            </div>

            <div className="space-y-16 md:space-y-24 relative before:absolute before:inset-0 before:ml-[23px] md:before:ml-[27px] before:h-full before:w-1 before:bg-gradient-to-b before:from-fuchsia-500 before:via-violet-400 before:to-transparent">
              {[
                { step: "01", title: "Strategic Audit", desc: "Identify massive gaps in your local market." },
                { step: "02", title: "Architecture", desc: "High-converting website and brand blueprint." },
                { step: "03", title: "Engineering", desc: "Lightning-fast platforms using React & Node." },
                { step: "04", title: "Domination", desc: "Ruthless SEO and paid marketing campaigns." },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={flipUpVariant}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-15%" }}
                  className="relative flex items-center justify-normal group"
                >
                  <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-[0_0_30px_rgba(217,70,239,0.5)] shrink-0 z-10 transition-transform duration-500 group-hover:scale-110">
                    <span className="font-bold text-white text-sm md:text-base">{item.step}</span>
                  </div>
                  
                  {/* Frosted Liquid Glass Timeline Card with Pure Backdrop Blur */}
                  <div className="w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] p-6 md:p-8 rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/10 group-hover:bg-white/10 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ml-6 md:ml-8 relative overflow-hidden">
                    {/* Soft glowing colored background inside the card without CSS blur */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(192,38,211,0.15),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.15),transparent_60%)] pointer-events-none" />
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/0 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-white group-hover:text-fuchsia-400 transition-colors relative z-10">{item.title}</h3>
                    <p className="text-white/70 text-sm md:text-lg leading-relaxed relative z-10">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* BENTO GRID SERVICES (Left Aligned on Desktop) */}
        <section className="py-24 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto relative pointer-events-none z-20">
          <div className="mr-auto w-full lg:w-[50%] pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-12 md:mb-16 liquid-glass-dark p-8 md:p-10 rounded-[2.5rem] border-t border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group"
            >
              {/* Giant glowing orb replaced with massive radial gradient */}
              <div className="absolute top-[0] right-[0] w-[150%] h-[150%] translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_50%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2),transparent_50%)] transition-colors duration-700 pointer-events-none" />
              
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 tracking-tighter relative z-10">We Build <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 [text-shadow:0_0_30px_rgba(52,211,153,0.4)]">Weapons.</span></h2>
              <p className="text-base md:text-lg text-white/70 relative z-10">
                Not just websites. We build digital assets designed to crush your competition and generate revenue.
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-10%" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 auto-rows-[240px] md:auto-rows-[280px]"
            >
              {services.map((service, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUpVariant}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group rounded-[2rem] p-6 overflow-hidden liquid-glass-dark border border-white/10 transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl liquid-glass border border-white/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg bg-black/40">
                      {service.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 group-hover:text-cyan-300 transition-colors">{service.title}</h3>
                    <p className="text-white/60 text-xs md:text-sm line-clamp-2 md:line-clamp-3 mb-4">{service.desc}</p>
                    
                    <div className="mt-auto flex items-center text-white text-xs md:text-sm font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-cyan-400">
                      Deploy <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3D AUDIT CTA */}
        <section className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden z-20">
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full liquid-glass-dark rounded-[3rem] p-10 md:p-16 text-center border-t border-white/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(249,115,22,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter relative z-10 leading-tight">
                Your Digital <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-500 to-pink-500 [text-shadow:0_0_30px_rgba(244,63,94,0.5)]">Transformation</span> Starts Here.
              </h2>
              <p className="text-lg md:text-xl text-white/70 mb-10 md:mb-12 max-w-2xl mx-auto relative z-10">
                Request a comprehensive technical and strategic audit of your business. Free of charge.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto relative z-10 w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="w-full liquid-glass border border-white/10 rounded-[1.5rem] px-6 py-4 md:py-5 text-white placeholder-white/50 focus:outline-none focus:border-orange-400/50 transition-colors text-base md:text-lg shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]" 
                />
                <button className="liquid-glass group relative overflow-hidden text-white font-bold px-8 md:px-10 py-4 md:py-5 rounded-[1.5rem] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] flex items-center justify-center shrink-0 border border-white/20 hover:border-orange-400/50">
                  <span className="relative z-10">Audit My Business</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <div className="relative z-30 w-full">
          <Testimonials />
        </div>

        {/* FOOTER */}
        <section className="relative z-50">
          <Footer />
        </section>
      </motion.div>
    </div>
  );
};

export default Home;
