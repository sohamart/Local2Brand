import React from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { Phone, Mail, MapPin, Clock, Award, ShieldCheck, Heart, Sparkles, Send, Globe, Share2 } from 'lucide-react';

export const Footer = () => {
  const { activeRestaurant } = useTenant();

  return (
    <footer className="bg-[#08090d] border-t border-white/10 pt-16 pb-12 text-slate-400 text-sm relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-radial-glow opacity-30 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1 & 2: Restaurant Identity & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={activeRestaurant.logo}
                alt={activeRestaurant.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/20"
              />
              <div>
                <span className="font-heading text-xl font-bold text-white tracking-wide block">
                  {activeRestaurant.name}
                </span>
                <span className="text-xs text-amber-400/90 font-medium tracking-wider uppercase">
                  {activeRestaurant.cuisine.join(' • ')}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {activeRestaurant.description}
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-md">
              <div className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Join Our Royal Epicurean Club</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 flex-1"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0">
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Gastronomy Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Culinary</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/menu" className="hover:text-amber-400 transition-colors">A La Carte Menu</Link></li>
              <li><Link to="/#specials" className="hover:text-amber-400 transition-colors">Chef's Tasting Specials</Link></li>
              <li><Link to="/reserve" className="hover:text-amber-400 transition-colors">Book Private Table</Link></li>
              <li><Link to="/#story" className="hover:text-amber-400 transition-colors">Culinary Heritage</Link></li>
              <li><Link to="/#offers" className="hover:text-amber-400 transition-colors">Festive Privileges</Link></li>
            </ul>
          </div>

          {/* Column 4: Operational Hours & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Visit & Dine</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{activeRestaurant.openingHours}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{activeRestaurant.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href={`tel:${activeRestaurant.phone}`} className="hover:text-white transition-colors">{activeRestaurant.phone}</a>
              </li>
            </ul>
          </div>

          {/* Column 5: Badges & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Excellence</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white leading-tight">4.9 Star Michelin Guild</div>
                  <div className="text-[10px] text-slate-500">Based on 400+ Verified Critics</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white leading-tight">FSSAI Certified 5-Star</div>
                  <div className="text-[10px] text-slate-500">Ultra-Clean Kitchen Standards</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a href="#social" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 border border-white/10 flex items-center justify-center transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#share" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 border border-white/10 flex items-center justify-center transition-all">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Platform White-Label Credit & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {activeRestaurant.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Powered by</span>
            <span className="text-amber-400 font-bold tracking-wide">GourmetOS</span>
            <span>— White-Label Multi-Tenant SaaS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
