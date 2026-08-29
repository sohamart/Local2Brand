import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Calendar, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight
} from 'lucide-react';
import EmberCanvas from './EmberCanvas';
import { useSettings } from '../context/SettingsContext';

export default function Hero({ onOpenReservation }) {
  const { settings } = useSettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#171310] pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-[#A9865A]/20">
      
      {/* Ember Particles Canvas */}
      <EmberCanvas />

      {/* Atmospheric Smoke & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[700px] h-[300px] sm:h-[450px] bg-[#D8632C]/10 blur-[100px] sm:blur-[140px] rounded-full"></div>
        <div className="absolute bottom-10 right-1/4 w-[250px] sm:w-[400px] h-[200px] sm:h-[300px] bg-[#E8AC4E]/8 blur-[90px] sm:blur-[120px] rounded-full"></div>
        
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80" 
          alt="Tandoor Charcoal Grill" 
          className="w-full h-full object-cover opacity-15 mix-blend-luminosity filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171310] via-[#171310]/85 to-[#171310]/40"></div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Status Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#231d19]/90 border border-[#A9865A]/40 text-[#F3E9D8] text-[11px] sm:text-xs font-mono mb-6 sm:mb-8 backdrop-blur-md shadow-lg max-w-full truncate">
          <span className="w-2 h-2 rounded-full bg-[#D8632C] shadow-[0_0_10px_#D8632C] animate-pulse shrink-0"></span>
          <span className="text-[#E8AC4E] font-semibold uppercase tracking-wider">Fires Lit</span>
          <span className="text-[#A9865A]">•</span>
          <span className="text-[#D6C8B2] truncate">30-Min Charcoal Express Dispatch</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={itemVariants}
          className="font-display text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-bold text-[#F3E9D8] tracking-tight leading-[1.1] max-w-4xl mx-auto mb-4 sm:mb-6"
        >
          Fine Dining Meets <br />
          <span className="italic font-normal text-[#E8AC4E] font-display">the Open Flame.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-[#D6C8B2] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10 font-sans px-2"
        >
          The romance of heritage recipes fused with the raw theatre of the tandoor. 
          Smoked Afghan tandoor meats, 24-hour slow-dum handis, and artisanal plates fired to order.
        </motion.p>

        {/* Responsive Pill Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          
          <a
            href="#menu"
            className="btn-ember-primary w-full xs:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 font-bold"
          >
            <Flame className="w-4 h-4 fill-[#171310]" />
            <span>Order Delivery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenReservation}
            className="btn-brass-pill w-full xs:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#A9865A]" />
            <span>Book a Table</span>
          </button>

          <a
            href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent("Hello L'Amour Gourmet, I'd like to check today's chef specials and place an order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brass-pill w-full xs:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:border-[#25D366]/60"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Order</span>
          </a>

          <a
            href={`tel:${settings.phone}`}
            className="btn-brass-pill px-4 sm:px-5 py-3 sm:py-3.5 rounded-full text-xs font-mono hidden sm:flex items-center gap-2 text-[#A9865A]"
            title="Direct Kitchen Phone"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#E8AC4E]" />
            <span>{settings.phone}</span>
          </a>

        </motion.div>

        {/* Value Stamps Responsive Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-4xl mx-auto text-left"
        >
          
          <div className="p-4 sm:p-5 rounded-2xl bg-[#231d19]/70 border border-[#A9865A]/25 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="stamp-seal-ember">30-MIN</span>
              <h4 className="font-display font-bold text-xs sm:text-sm text-[#F3E9D8]">Insulated Heat Delivery</h4>
            </div>
            <p className="text-[#D6C8B2] text-xs leading-relaxed font-sans">
              Thermo-sealed packaging ensures clay-oven charcoal aromas arrive piping hot.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#231d19]/70 border border-[#A9865A]/25 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="stamp-seal-spice">TANDOOR</span>
              <h4 className="font-display font-bold text-xs sm:text-sm text-[#F3E9D8]">Fruitwood Charcoal</h4>
            </div>
            <p className="text-[#D6C8B2] text-xs leading-relaxed font-sans">
              Authentic clay oven bakes seasoned over slow fruitwood coals for deep smoky flavor.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#231d19]/70 border border-[#A9865A]/25 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
              <span className="stamp-seal-veg">LIVE KOT</span>
              <h4 className="font-display font-bold text-xs sm:text-sm text-[#F3E9D8]">Thermal Ticket Tracking</h4>
            </div>
            <p className="text-[#D6C8B2] text-xs leading-relaxed font-sans">
              Watch your ticket fire through prep, packing, and live rider milestone telemetry.
            </p>
          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}
