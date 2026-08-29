import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  LogOut, 
  Save, 
  Loader2,
  Receipt,
  Bike,
  Sparkles,
  CheckCircle,
  Clock,
  Camera,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AVATAR_PRESETS = [
  { label: 'Foodie VIP', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
  { label: 'Gourmet Patron', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Chef', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80' },
  { label: 'Express Rider', url: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80' },
  { label: 'Royal Guest', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' }
];

export default function CustomerProfileModal({ isOpen, onClose, onTrackOrder, onOpenRider }) {
  const { user, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    profile_image: user?.profile_image || ''
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        profile_image: user.profile_image || ''
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.getMyOrders();
      setOrders(res || []);
    } catch (err) {
      console.error('Failed to load my orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await api.uploadImage(formData);
      if (uploadRes?.url) {
        setEditForm(prev => ({ ...prev, profile_image: uploadRes.url }));
      }
    } catch (err) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(editForm);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const currentAvatar = editForm.profile_image || user.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 text-[#F3E9D8] font-sans">
      <div 
        className="relative w-full max-w-3xl my-auto sm:my-6 bg-[#171310] border-0 sm:border sm:border-[#A9865A]/40 rounded-none sm:rounded-3xl overflow-hidden shadow-2xl space-y-0 flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-[#0f0c0a] border-b border-[#A9865A]/20 flex items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <img 
                src={currentAvatar} 
                alt={user.name} 
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl object-cover border-2 border-[#E8AC4E] shadow-md shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#171310]"></span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-xl font-bold text-[#F3E9D8] truncate">{user.name}</h3>
                {user.role === 'delivery' ? (
                  <span className="px-2 py-0.5 rounded bg-[#D8632C]/20 text-[#D8632C] border border-[#D8632C]/40 text-[9px] font-bold shrink-0">
                    🛵 Rider Partner
                  </span>
                ) : user.role === 'admin' ? (
                  <span className="px-2 py-0.5 rounded bg-[#33402E] text-[#92b584] text-[9px] font-bold shrink-0">
                    👑 Master Admin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-[#231d19] text-[#E8AC4E] border border-[#A9865A]/30 text-[9px] font-bold shrink-0">
                    ✨ Member
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-[#A9865A] truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {user.role === 'delivery' && onOpenRider && (
              <button
                onClick={() => { onClose(); onOpenRider(); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#D8632C] hover:bg-[#e37440] text-slate-950 font-bold text-[11px] sm:text-xs transition-colors shadow-md"
              >
                <Bike className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rider Hub</span>
              </button>
            )}

            <button
              onClick={() => { logout(); onClose(); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-[11px] sm:text-xs hover:bg-red-900/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-[#231d19] border border-[#A9865A]/30 text-[#A9865A] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Member Stats Strip */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-[#14100e] border-b border-[#A9865A]/20 font-mono text-xs">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#1c1613] border border-[#A9865A]/20 text-center">
            <span className="text-[9px] sm:text-[10px] text-[#A9865A] uppercase block font-bold">Total Orders</span>
            <span className="text-sm sm:text-base font-bold text-[#E8AC4E]">{orders.length}</span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-[#1c1613] border border-[#A9865A]/20 text-center">
            <span className="text-[9px] sm:text-[10px] text-[#A9865A] uppercase block font-bold">Total Spent</span>
            <span className="text-sm sm:text-base font-bold text-[#92b584]">₹{totalSpent}</span>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl bg-[#1c1613] border border-[#A9865A]/20 text-center">
            <span className="text-[9px] sm:text-[10px] text-[#A9865A] uppercase block font-bold">VIP Status</span>
            <span className="text-sm sm:text-base font-bold text-[#D8632C]">Smoke Club</span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 font-mono text-xs flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Left: Profile Form & Photo Selector */}
            <div className="md:col-span-5 space-y-3">
              <h4 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#A9865A]" />
                <span>Profile & Photo Settings</span>
              </h4>

              <form onSubmit={handleUpdate} className="space-y-3 bg-[#0f0c0a] p-3.5 sm:p-4 rounded-2xl border border-[#A9865A]/25">
                {/* Avatar Preview & Upload Controls */}
                <div className="space-y-2 border-b border-[#A9865A]/20 pb-3">
                  <span className="text-[10px] text-[#A9865A] uppercase font-bold block">Profile Avatar Image</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={currentAvatar}
                      alt="Avatar preview"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E8AC4E] shadow shrink-0"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingPhoto}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-1.5 px-2 rounded-xl bg-[#231d19] hover:bg-[#332b25] border border-[#A9865A]/40 text-[#E8AC4E] font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                      >
                        {uploadingPhoto ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                        <span>{uploadingPhoto ? 'Uploading Photo...' : 'Upload New Photo'}</span>
                      </button>

                      <input
                        type="text"
                        placeholder="Or paste image URL"
                        value={editForm.profile_image}
                        onChange={(e) => setEditForm({ ...editForm, profile_image: e.target.value })}
                        className="w-full px-2 py-1 bg-[#171310] border border-[#A9865A]/30 rounded-lg text-white text-[10px] focus:outline-none focus:border-[#D8632C]"
                      />
                    </div>
                  </div>

                  {/* Avatar Quick Presets */}
                  <div className="pt-1">
                    <span className="text-[9px] text-[#A9865A] block mb-1">Quick Avatar Presets:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {AVATAR_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, profile_image: p.url }))}
                          className={`w-7 h-7 rounded-lg overflow-hidden border transition-all ${
                            editForm.profile_image === p.url ? 'border-[#E8AC4E] ring-2 ring-[#E8AC4E]/40 scale-105' : 'border-[#A9865A]/30 opacity-70 hover:opacity-100'
                          }`}
                          title={p.label}
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[#A9865A] text-[11px] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white text-xs focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                <div>
                  <label className="text-[#A9865A] text-[11px] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white text-xs focus:outline-none focus:border-[#D8632C]"
                  />
                </div>

                <div>
                  <label className="text-[#A9865A] text-[11px] block mb-1">Default Delivery Address</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Badamtala, Burdwan - 713101, West Bengal"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white text-xs focus:outline-none focus:border-[#D8632C] resize-none"
                  ></textarea>
                </div>

                {savedSuccess && (
                  <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Profile saved successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-ember-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? 'Saved!' : 'Save Details'}</span>
                </button>
              </form>
            </div>

            {/* Right: Past Orders & Live Track */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-[#A9865A]" />
                  <span>Order Tickets History ({orders.length})</span>
                </h4>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {loadingOrders ? (
                  <div className="py-12 text-center text-[#A9865A] space-y-2">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#D8632C]" />
                    <p>Loading your past order tickets...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center bg-[#0f0c0a] rounded-2xl border border-[#A9865A]/20 text-[#A9865A] space-y-1">
                    <ShoppingBag className="w-8 h-8 mx-auto text-[#A9865A]/40 mb-2" />
                    <p className="text-xs text-[#F3E9D8] font-bold">No order tickets fired yet</p>
                    <p className="text-[11px]">Explore our charcoal menu to place your first hot tandoor order!</p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div 
                      key={ord.id}
                      className="p-3.5 rounded-2xl bg-[#0f0c0a] border border-[#A9865A]/25 space-y-2.5 hover:border-[#E8AC4E]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#A9865A]/15 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-[#F3E9D8]">#{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            ord.order_status === 'delivered'
                              ? 'bg-[#33402E] text-[#92b584]'
                              : ord.order_status === 'out_for_delivery'
                              ? 'bg-[#D8632C] text-[#171310] font-black'
                              : 'bg-[#D8632C]/20 text-[#E8AC4E] border border-[#D8632C]/40'
                          }`}>
                            {ord.order_status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-[#E8AC4E]">₹{ord.total}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#A9865A]">
                        <div className="truncate max-w-xs">
                          <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                          <span> • </span>
                          <span className="text-[#D6C8B2]">{ord.items?.length || 0} dishes</span>
                          <span> • </span>
                          <span className="truncate">{ord.delivery_address}</span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onTrackOrder(ord.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#231d19] hover:bg-[#332b25] text-xs font-bold text-[#E8AC4E] border border-[#A9865A]/40 flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Track Live Order →</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
