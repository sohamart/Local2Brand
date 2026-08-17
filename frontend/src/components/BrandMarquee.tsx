const brands = [
  { name: "Acme Corp", font: "font-serif" },
  { name: "Quantum", font: "font-mono" },
  { name: "Globex", font: "font-sans font-black tracking-tighter" },
  { name: "Stark Ind.", font: "font-sans font-bold uppercase tracking-widest" },
  { name: "Soylent", font: "font-serif italic" },
  { name: "Initech", font: "font-mono font-bold tracking-tight" },
  { name: "Cyberdyne", font: "font-sans font-black tracking-widest" },
  { name: "Weyland", font: "font-serif uppercase" },
];

export default function BrandMarquee() {
  return (
    <div className="w-full relative overflow-hidden mt-8 md:mt-12 pt-8 border-t border-white/10">
      {/* Fade masks for the edges */}
      <div className="absolute inset-0 pointer-events-none z-10 [mask-image:linear-gradient(to_right,black,transparent_10%,transparent_90%,black)] bg-transparent" />

      {/* Marquee Container */}
      <div className="flex overflow-hidden w-full group">
        <div className="flex animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] whitespace-nowrap">
          {/* Duplicate the array twice for seamless looping */}
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div 
              key={i} 
              className="mx-6 md:mx-12 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-pointer grayscale hover:grayscale-0"
            >
              <span className={`text-xl md:text-3xl text-white ${brand.font}`}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Inline styles for the marquee keyframes to avoid touching tailwind config */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
