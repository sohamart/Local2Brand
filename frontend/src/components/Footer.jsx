import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageSquare, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#09090b] border-t border-slate-200 dark:border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent w-fit">
            Local2Brand
          </Link>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
            "Turn Your Local Business Into a Digital Brand." We help local businesses, startups, and creators build modern, fast, and high-converting websites.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Social Link">
              <Globe size={16} />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Social Link">
              <Users size={16} />
            </a>
            <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Social Link">
              <MessageSquare size={16} />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-slate-800 dark:text-white text-sm font-semibold tracking-wider uppercase mb-4">Company</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">About Us</Link>
            <Link to="/portfolio" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Portfolio</Link>
            <Link to="/demos" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Demos</Link>
            <Link to="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Pricing</Link>
            <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Contact</Link>
          </div>
        </div>

        {/* Resources Links */}
        <div>
          <h4 className="text-slate-800 dark:text-white text-sm font-semibold tracking-wider uppercase mb-4">Resources</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">How It Works</Link>
            <Link to="/how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">FAQ</Link>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Support Center</a>
          </div>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-slate-800 dark:text-white text-sm font-semibold tracking-wider uppercase mb-4">Legal</h4>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Terms & Conditions</a>
            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} Local2Brand. All rights reserved.
        </p>
        <p className="text-slate-500 text-xs">
          Designed with ❤️ for Local Businesses
        </p>
      </div>
    </footer>
  );
};

export default Footer;
