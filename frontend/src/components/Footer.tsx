import { Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-12 mt-4 pb-24 lg:pb-12">
      {/* Floating Island Footer */}
      <div className="max-w-7xl mx-auto liquid-glass-dark rounded-[3rem] border border-white/20 p-8 sm:p-12 lg:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        {/* Glass reflection */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center group cursor-pointer w-fit">
              <span className="text-3xl font-black text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
                Local<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">2</span>Brand
              </span>
            </div>
            <p className="text-white/60 max-w-sm text-lg">
              Turning local businesses into absolute digital powerhouses. We build brands, not just websites.
            </p>
            <div className="flex space-x-4 pt-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <div key={social} className="w-12 h-12 rounded-full liquid-glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer">
                  <span className="text-xs font-bold">{social.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-xl tracking-tight">Ecosystem</h3>
            <ul className="space-y-4">
              {['Web Engineering', 'Brand Identity', 'Growth Marketing', 'Search Dominance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-cyan-400 hover:pl-2 transition-all duration-300 block text-base font-medium">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-xl tracking-tight">Headquarters</h3>
            <ul className="space-y-4 text-white/50 text-base font-medium">
              <li>West Bengal, India</li>
              <li>contact@local2brand.com</li>
              <li>+91 (XXX) XXX-XXXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-white/40 text-sm font-medium relative z-10">
          <p>© {new Date().getFullYear()} Local2Brand. All rights reserved.</p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0 liquid-glass px-4 py-2 rounded-full border border-white/5">
            <Code className="w-4 h-4 text-cyan-500" />
            <span>Engineered for scale</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
