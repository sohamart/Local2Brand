import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

export default function ComingSoon() {
  const location = useLocation();
  const pageName = location.pathname.split('/')[1] || 'Page';
  
  // Capitalize first letter
  const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="w-full min-h-screen font-sans text-white relative flex flex-col pt-32">
      <div className="flex-grow flex items-center justify-center px-6">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="liquid-glass-dark p-10 md:p-16 rounded-[3rem] border-t border-white/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] max-w-2xl w-full text-center relative overflow-hidden"
        >
          {/* Subtle background glow inside card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-[1.5rem] liquid-glass flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <Clock className="w-10 h-10 text-cyan-400" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-400">{formattedName}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">is Coming Soon.</h2>
            
            <p className="text-white/60 text-lg mb-10 max-w-md mx-auto">
              We are engineering something incredible for this section. Check back shortly to see the next evolution of our platform.
            </p>
            
            <Link 
              to="/" 
              className="liquid-glass group relative overflow-hidden px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 flex items-center outline-none"
            >
              <ArrowLeft className="w-5 h-5 mr-3 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="relative z-10">Return to Mission Control</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-blue-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
            </Link>
          </div>
        </motion.div>
        
      </div>
      
      <Footer />
    </div>
  );
}
