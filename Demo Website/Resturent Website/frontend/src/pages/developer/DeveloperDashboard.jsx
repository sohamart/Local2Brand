import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PLATFORM_METRICS, RESTAURANTS } from '../../data/mockData';
import {
  ShieldCheck,
  Building2,
  DollarSign,
  Plus,
  Server,
  Globe,
  Sliders,
  ExternalLink,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DeveloperDashboard = () => {
  const { restaurants, switchTenant, addRestaurant } = useTenant();
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    slug: '',
    tagline: 'Artisan Culinary Experience',
    cuisine: 'Fine Dining, Contemporary',
    ownerName: '',
    ownerEmail: '',
    template: 'luxury',
    primaryColor: '#e63946',
    secondaryColor: '#dfa645'
  });

  const handleCreateRestaurant = (e) => {
    e.preventDefault();
    const slug = newClient.slug || newClient.name.toLowerCase().replace(/\s+/g, '-');
    const created = {
      id: `rest-${Date.now().toString().slice(-4)}`,
      name: newClient.name,
      slug,
      tagline: newClient.tagline,
      description: `Welcome to ${newClient.name}, an exquisite gastronomic destination serving handcrafted culinary delights.`,
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=160&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80',
      heroImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=80',
      cuisine: newClient.cuisine.split(',').map(s => s.trim()),
      rating: 5.0,
      reviewCount: 1,
      currency: '₹',
      currencyCode: 'INR',
      phone: '+91 98765 00000',
      email: newClient.ownerEmail || 'contact@restaurant.com',
      address: '7th Avenue Central Boulevard, Metropolitan Plaza',
      openingHours: '11:00 AM – 11:00 PM Everyday',
      theme: {
        template: newClient.template,
        primary: newClient.primaryColor,
        secondary: newClient.secondaryColor,
        accent: '#2a9d8f',
        fontHeading: 'Playfair Display',
        fontBody: 'Outfit',
        borderRadius: '16px',
        heroLayout: 'cinematic-split'
      },
      sections: {
        hero: { enabled: true, title: `Welcome to ${newClient.name}`, subtitle: 'Crafted culinary perfection delivered fresh to your table.' },
        specials: { enabled: true, title: "Chef's Signature Selections" },
        story: { enabled: true, title: 'Our Story & Gastronomy Passion' },
        offers: { enabled: true, title: 'Exclusive Client Privileges' },
        reviews: { enabled: true, title: 'What Patrons Say' },
        reservation: { enabled: true, title: 'Reserve a Private Banquet' }
      }
    };

    addRestaurant(created);
    setIsWizardOpen(false);

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleImpersonateAndOpen = (restId) => {
    switchTenant(restId);
    switchRole('owner');
    navigate('/admin');
  };

  const handleOpenCustomizer = (restId) => {
    switchTenant(restId);
    navigate('/customizer');
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Super Admin Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl bg-gradient-to-r from-purple-900/20 via-black/50 to-brand-primary/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              SaaS Multi-Tenant Platform Master Control
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white">
            GourmetOS Super-Admin
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Manage multi-tenant restaurant instances, white-label client provisioning, domain routing, and platform metrics.
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Restaurant Client</span>
        </button>
      </div>

      {/* 4 Platform Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Live Restaurant Tenants</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{restaurants.length}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">100% Isolated Data Scopes</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Platform Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            ₹{PLATFORM_METRICS.totalPlatformRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">MRR: ₹{PLATFORM_METRICS.monthlyRecurringRevenue.toLocaleString('en-IN')}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Customers Served</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{PLATFORM_METRICS.totalCustomersServed.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400">Across all tenant storefronts</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Global Cloud Health</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{PLATFORM_METRICS.avgUptime}</div>
          <div className="text-[11px] text-slate-400">AWS & Mongo Atlas Latency: 18ms</div>
        </div>

      </div>

      {/* Multi-Tenant Instances Management Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="font-heading font-bold text-white text-lg">Active White-Label Tenants</h3>
            <p className="text-xs text-slate-400">Click to customize branding, launch storefront, or impersonate restaurant manager</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Restaurant Client</th>
                <th className="py-3 px-3">Subdomain / Tenant Slug</th>
                <th className="py-3 px-3">Theme Template</th>
                <th className="py-3 px-3">Brand Palette</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {restaurants.map((rest) => (
                <tr key={rest.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rest.logo}
                        alt={rest.name}
                        className="w-9 h-9 rounded-xl object-cover border border-white/20"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{rest.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{rest.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-amber-400">
                    {rest.slug}.gourmetos.io
                  </td>
                  <td className="py-3.5 px-3 capitalize font-medium text-slate-200">
                    {rest.theme?.template || 'luxury'}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: rest.theme?.primary }}
                        title="Primary Color"
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: rest.theme?.secondary }}
                        title="Secondary Color"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenCustomizer(rest.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-black text-slate-300 transition-all"
                        title="Open Visual Customizer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleImpersonateAndOpen(rest.id)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold transition-all flex items-center gap-1.5"
                        title="Impersonate Owner Admin"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Client Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0f111a] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-heading font-bold text-white text-lg">
                  Provision New Restaurant Tenant
                </h3>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Restaurant Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Courtyard"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Tenant Subdomain Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. saffron-courtyard"
                    value={newClient.slug}
                    onChange={(e) => setNewClient({ ...newClient, slug: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Cuisine Tags</label>
                  <input
                    type="text"
                    placeholder="e.g. Mughlai, Kebabs, Tandoor"
                    value={newClient.cuisine}
                    onChange={(e) => setNewClient({ ...newClient, cuisine: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Starter Website Template</label>
                <select
                  value={newClient.template}
                  onChange={(e) => setNewClient({ ...newClient, template: e.target.value })}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="luxury">Template 01 — Royal Luxury & Michelin Fine Dining</option>
                  <option value="modern-cafe">Template 02 — Modern Artisan Cafe & Roastery</option>
                  <option value="italian">Template 03 — Authentic Italian Wood-Fired Trattoria</option>
                  <option value="fast-casual">Template 04 — Fast-Casual Burgers & Shakes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Primary Brand Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newClient.primaryColor}
                      onChange={(e) => setNewClient({ ...newClient, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-white">{newClient.primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">Secondary Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newClient.secondaryColor}
                      onChange={(e) => setNewClient({ ...newClient, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-white">{newClient.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all"
                >
                  Auto-Provision Multi-Tenant Instance
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
