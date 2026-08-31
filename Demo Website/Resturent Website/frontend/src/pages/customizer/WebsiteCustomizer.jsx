import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { HomePage } from '../customer/HomePage';
import {
  Sliders,
  Palette,
  Type,
  Layout,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Check,
  ChevronDown,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WebsiteCustomizer = () => {
  const { activeRestaurant, updateRestaurant } = useTenant();

  // Local draft state for live edits
  const [draft, setDraft] = useState({
    name: activeRestaurant.name,
    tagline: activeRestaurant.tagline,
    description: activeRestaurant.description,
    logo: activeRestaurant.logo,
    heroImage: activeRestaurant.heroImage,
    theme: {
      ...activeRestaurant.theme,
      primary: activeRestaurant.theme?.primary || '#e63946',
      secondary: activeRestaurant.theme?.secondary || '#dfa645',
      accent: activeRestaurant.theme?.accent || '#2a9d8f',
      fontHeading: activeRestaurant.theme?.fontHeading || 'Playfair Display',
      borderRadius: activeRestaurant.theme?.borderRadius || '18px',
      heroLayout: activeRestaurant.theme?.heroLayout || 'cinematic-split'
    },
    sections: {
      hero: { ...activeRestaurant.sections?.hero },
      specials: { ...activeRestaurant.sections?.specials },
      story: { ...activeRestaurant.sections?.story },
      offers: { ...activeRestaurant.sections?.offers },
      reviews: { ...activeRestaurant.sections?.reviews },
      reservation: { ...activeRestaurant.sections?.reservation }
    }
  });

  const [activeTab, setActiveTab] = useState('branding'); // 'branding', 'colors', 'typography', 'sections'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleColorChange = (key, color) => {
    const updatedTheme = { ...draft.theme, [key]: color };
    setDraft({ ...draft, theme: updatedTheme });

    // Live inject into root
    if (key === 'primary') {
      document.documentElement.style.setProperty('--brand-primary', color);
    }
    if (key === 'secondary') {
      document.documentElement.style.setProperty('--brand-secondary', color);
    }
  };

  const handleFontChange = (fontName) => {
    const updatedTheme = { ...draft.theme, fontHeading: fontName };
    setDraft({ ...draft, theme: updatedTheme });
    document.documentElement.style.setProperty('--font-heading', fontName);
  };

  const handleSectionToggle = (sectionKey) => {
    const currentEnabled = draft.sections[sectionKey]?.enabled !== false;
    setDraft({
      ...draft,
      sections: {
        ...draft.sections,
        [sectionKey]: {
          ...draft.sections[sectionKey],
          enabled: !currentEnabled
        }
      }
    });
  };

  const handleSaveAndPublish = () => {
    updateRestaurant({
      id: activeRestaurant.id,
      ...draft
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden bg-[#0a0c12]">
      
      {/* Customizer Top Command Bar */}
      <div className="bg-[#0f111a] border-b border-white/10 px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white leading-none">
              Visual Website Customizer
            </h1>
            <span className="text-[10px] text-amber-400">
              Live White-Label Client: {activeRestaurant.name}
            </span>
          </div>
        </div>

        {/* Viewport Device Switcher */}
        <div className="hidden sm:flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1 text-xs">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-lg transition-all ${
              previewDevice === 'desktop' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded-lg transition-all ${
              previewDevice === 'tablet' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-lg transition-all ${
              previewDevice === 'mobile' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Save & Publish Action */}
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Published!
            </span>
          )}
          <button
            onClick={handleSaveAndPublish}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Controls Panel | Right Live Canvas */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT CONTROLS SIDEBAR */}
        <div className="w-80 sm:w-96 bg-[#0f111a] border-r border-white/10 flex flex-col h-full shrink-0 shadow-2xl z-20">
          
          {/* Customizer Sub-tabs */}
          <div className="grid grid-cols-4 p-2 gap-1 bg-black/40 border-b border-white/5 text-[11px] font-semibold">
            {[
              { key: 'branding', label: 'Brand', icon: Sparkles },
              { key: 'colors', label: 'Colors', icon: Palette },
              { key: 'typography', label: 'Fonts', icon: Type },
              { key: 'sections', label: 'Sections', icon: Layers }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                  activeTab === key
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Controls Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            
            {/* 1. BRANDING TAB */}
            {activeTab === 'branding' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Restaurant Name</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Tagline</label>
                  <input
                    type="text"
                    value={draft.tagline}
                    onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Logo Image URL</label>
                  <input
                    type="text"
                    value={draft.logo}
                    onChange={(e) => setDraft({ ...draft, logo: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono text-[10px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Hero Food Showcase URL</label>
                  <input
                    type="text"
                    value={draft.heroImage}
                    onChange={(e) => setDraft({ ...draft, heroImage: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono text-[10px]"
                  />
                </div>
              </div>
            )}

            {/* 2. COLORS TAB */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Brand Primary Accent</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={draft.theme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={draft.theme.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                {/* Preset Luxury Color Palettes */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Curated Preset Palettes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Royal Crimson', p: '#e63946', s: '#dfa645' },
                      { name: 'Golden Amber', p: '#f59e0b', s: '#10b981' },
                      { name: 'Emerald Velvet', p: '#059669', s: '#f59e0b' },
                      { name: 'Tuscan Terracotta', p: '#ef4444', s: '#84cc16' }
                    ].map(pal => (
                      <button
                        key={pal.name}
                        onClick={() => {
                          handleColorChange('primary', pal.p);
                          handleColorChange('secondary', pal.s);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between"
                      >
                        <span className="text-[11px] font-medium text-white">{pal.name}</span>
                        <div className="flex gap-1">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.p }} />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.s }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. TYPOGRAPHY TAB */}
            {activeTab === 'typography' && (
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Heading Typography</label>
                {[
                  { name: 'Playfair Display', desc: 'Regal, Heritage, Michelin Fine Dining' },
                  { name: 'Plus Jakarta Sans', desc: 'Modern, Minimalist, Fast-Casual' },
                  { name: 'Cinzel', desc: 'Luxury Aristocratic Roman' },
                  { name: 'Outfit', desc: 'Clean, Geometric Modern' }
                ].map(font => (
                  <button
                    key={font.name}
                    onClick={() => handleFontChange(font.name)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      draft.theme.fontHeading === font.name
                        ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-gold-glow'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-sm font-bold" style={{ fontFamily: font.name }}>{font.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{font.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* 4. SECTIONS TAB */}
            {activeTab === 'sections' && (
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Homepage Section Toggles</label>
                {[
                  { key: 'hero', name: 'Cinematic Hero Banner' },
                  { key: 'specials', name: "Today's Chef Specials" },
                  { key: 'story', name: 'Heritage Story & Legacy' },
                  { key: 'offers', name: 'Promos & Coupon Privileges' },
                  { key: 'reviews', name: 'Connoisseur Reviews Masonry' },
                  { key: 'reservation', name: 'Table Reservation Booking CTA' }
                ].map(({ key, name }) => {
                  const isEnabled = draft.sections[key]?.enabled !== false;
                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <span className="font-medium text-white">{name}</span>
                      <button
                        onClick={() => handleSectionToggle(key)}
                        className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                          isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT LIVE PREVIEW CANVAS */}
        <div className="flex-1 bg-[#06080d] p-3 sm:p-6 overflow-y-auto flex items-center justify-center">
          <div
            className={`transition-all duration-300 bg-[#0c0e14] rounded-3xl border border-white/20 shadow-2xl overflow-y-auto h-full ${
              previewDevice === 'mobile'
                ? 'w-[375px] max-h-[750px] border-4 border-slate-700'
                : previewDevice === 'tablet'
                ? 'w-[768px] max-h-[850px] border-4 border-slate-700'
                : 'w-full h-full'
            }`}
          >
            <HomePage />
          </div>
        </div>

      </div>

    </div>
  );
};
