import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Settings, Save, CheckCircle2, ShieldCheck, CreditCard, Banknote, Clock, MapPin } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { activeRestaurant, updateRestaurant } = useTenant();

  const [settings, setSettings] = useState({
    name: activeRestaurant.name,
    tagline: activeRestaurant.tagline,
    phone: activeRestaurant.phone,
    email: activeRestaurant.email,
    address: activeRestaurant.address,
    openingHours: activeRestaurant.openingHours,
    gstRate: 5,
    deliveryFee: 50,
    freeDeliveryThreshold: 999,
    enableRazorpay: true,
    razorpayKeyId: 'rzp_test_98k210d9',
    enableCOD: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateRestaurant({
      id: activeRestaurant.id,
      name: settings.name,
      tagline: settings.tagline,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      openingHours: settings.openingHours
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Restaurant Business Configuration
            </h1>
            <p className="text-xs text-slate-400">
              Control delivery zones, GST tax rates, payment gateways, and concierge contacts.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings successfully synced and published!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* 1. General Info */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>General Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Restaurant Legal Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Customer Helpline Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Concierge Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Physical Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Taxes & Delivery */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Tax & Fulfillment Surcharges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">GST Rate (%)</label>
                <input
                  type="number"
                  value={settings.gstRate}
                  onChange={(e) => setSettings({ ...settings, gstRate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Standard Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Free Delivery on Orders Above (₹)</label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Gateway Config */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Razorpay & Payment Gateways</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <div className="font-bold text-white">Razorpay Online Gateway (UPI / Cards / NetBanking)</div>
                  <div className="text-[11px] text-slate-400">Accept automated instant settlements</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, enableRazorpay: !settings.enableRazorpay })}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                    settings.enableRazorpay ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.enableRazorpay ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Razorpay Key ID (Sandbox / Live)</label>
                <input
                  type="text"
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <div className="font-bold text-white">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-slate-400">Allow customers to pay via cash or UPI QR upon delivery</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, enableCOD: !settings.enableCOD })}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                    settings.enableCOD ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.enableCOD ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
