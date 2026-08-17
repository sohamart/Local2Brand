import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Briefcase, LayoutGrid, Users, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    // Sync active tab with current URL
    const path = location.pathname;
    if (path === '/' || path === '/home') setActiveTab('Home');
    else if (path.includes('services')) setActiveTab('Services');
    else if (path.includes('work')) setActiveTab('Work');
    else if (path.includes('community')) setActiveTab('Community');
    else if (path.includes('contact')) setActiveTab('Contact');
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Services', href: '/services', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Work', href: '/work', icon: <LayoutGrid className="w-5 h-5" /> },
    { name: 'Community', href: '/community', icon: <Users className="w-5 h-5" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* DESKTOP TOP NAVBAR */}
      <nav 
        className={`hidden lg:block fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-12 relative h-14 flex items-center">
          
          {/* LOGO (Absolute Left) */}
          <Link to="/" className="absolute left-12 flex items-center group cursor-pointer outline-none">
            <span className="text-2xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
              Local<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">2</span>Brand
            </span>
          </Link>

          {/* DESKTOP NAV (Absolute Center) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-1 rounded-full p-1.5 liquid-glass-dark border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative px-6 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full outline-none"
              >
                {activeTab === link.name && (
                  <motion.div
                    layoutId="desktop-active-pill"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.15)] backdrop-blur-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeTab === link.name ? 'text-white' : 'text-white/60 hover:text-white/90'}`}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* CTA BUTTON (Absolute Right) */}
          <div className="absolute right-12">
            <Link to="/contact" className="group relative overflow-hidden px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-black/40 backdrop-blur-md border border-white/10 hover:border-transparent hover:shadow-[0_0_30px_rgba(192,38,211,0.4)] transition-all duration-500 flex items-center outline-none">
              <span className="relative z-10">Start Your Digital Journey</span>
              <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 group-hover:rotate-[-45deg] transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE TOP BAR (Just for Logo) */}
      <nav className={`lg:hidden fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/50 backdrop-blur-md border-b border-white/5' : 'py-6'}`}>
        <div className="px-6 flex items-center justify-center">
          <Link to="/" className="text-2xl font-black text-white tracking-tight outline-none">
            Local<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">2</span>Brand
          </Link>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION BAR (iOS Style Liquid Glass) */}
      <div className="lg:hidden fixed bottom-6 inset-x-6 z-50 flex justify-center">
        <div className="flex items-center justify-between w-full max-w-sm rounded-[2rem] p-2 liquid-glass-dark border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="relative flex flex-col items-center justify-center w-16 h-16 rounded-[1.5rem] outline-none"
            >
              {activeTab === link.name && (
                <motion.div
                  layoutId="mobile-active-pill"
                  className="absolute inset-0 bg-white/10 rounded-[1.5rem] border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className={`relative z-10 flex flex-col items-center transition-colors duration-300 ${activeTab === link.name ? 'text-cyan-400' : 'text-white/50'}`}>
                {link.icon}
                <span className="text-[10px] font-semibold mt-1 opacity-80">{link.name}</span>
              </div>
              
              {activeTab === link.name && (
                <motion.div 
                  layoutId="mobile-active-dot"
                  className="absolute bottom-1.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" 
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
