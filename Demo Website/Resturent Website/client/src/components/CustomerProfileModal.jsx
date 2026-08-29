import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  LogOut, 
  Save, 
  Loader2,
  Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CustomerProfileModal({ isOpen, onClose, onTrackOrder }) {
  const { user, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(editForm);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative w-full max-w-3xl bg-[#231d19] border border-[#A9865A]/40 rounded-3xl overflow-hidden shadow-2xl my-3 sm:my-8 text-[#F3E9D8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#171310] border-b border-[#A9865A]/20 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#231d19] border border-[#A9865A]/40 flex items-center justify-center text-[#E8AC4E] font-bold text-base">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-[#F3E9D8]">{user.name}</h3>
              <p className="text-xs text-[#A9865A]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { logout(); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs hover:bg-red-900/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#231d19] text-[#A9865A] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono text-xs">
          
          {/* Profile Form */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#A9865A]" />
              Default Delivery Profile
            </h4>

            <form onSubmit={handleUpdate} className="space-y-3 bg-[#171310] p-4 rounded-2xl border border-[#A9865A]/20">
              <div>
                <label className="text-[#A9865A] block mb-1">Your Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-[#A9865A] block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-[#A9865A] block mb-1">Default Address</label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#231d19] border border-[#A9865A]/30 rounded-lg text-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-ember-primary w-full py-2 rounded-lg font-sans font-bold flex items-center justify-center gap-1.5"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved!' : 'Save Details'}</span>
              </button>
            </form>
          </div>

          {/* Past Orders */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="font-bold text-[#E8AC4E] uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#A9865A]" />
              Fired Tickets History ({orders.length})
            </h4>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {loadingOrders ? (
                <div className="py-8 text-center text-[#A9865A]">
                  Reading order tickets...
                </div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center bg-[#171310] rounded-2xl border border-[#A9865A]/20 text-[#A9865A]">
                  No tickets fired yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="p-3.5 rounded-xl bg-[#171310] border border-[#A9865A]/20 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#F3E9D8]">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.order_status === 'delivered'
                            ? 'bg-[#33402E] text-[#92b584]'
                            : 'bg-[#D8632C]/20 text-[#E8AC4E] border border-[#D8632C]/40'
                        }`}>
                          {ord.order_status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[#A9865A] text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString()} • {ord.items?.length || 0} plates • ₹{ord.total}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onTrackOrder(ord.id);
                      }}
                      className="btn-brass-pill px-3 py-1.5 rounded-lg text-xs font-bold text-[#E8AC4E] flex items-center gap-1 shrink-0"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
