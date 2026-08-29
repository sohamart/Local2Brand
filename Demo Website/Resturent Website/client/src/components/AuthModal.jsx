import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  KeyRound,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, defaultAdminMode = false, onLoginSuccess }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(defaultAdminMode);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let loggedInUser;
      if (isRegister && !isAdminMode) {
        loggedInUser = await register(formData);
      } else {
        loggedInUser = await login(formData.email, formData.password);
      }
      onClose();
      if (onLoginSuccess) onLoginSuccess(loggedInUser);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (type) => {
    if (type === 'admin') {
      setIsAdminMode(true);
      setIsRegister(false);
      setFormData({
        email: 'admin@restaurant.com',
        password: 'admin123',
        name: '',
        phone: '',
        address: ''
      });
    } else {
      setIsAdminMode(false);
      setIsRegister(false);
      setFormData({
        email: 'customer@example.com',
        password: 'customer123',
        name: '',
        phone: '',
        address: ''
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative w-full max-w-md bg-[#231d19] border border-[#A9865A]/40 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-8 text-[#F3E9D8] my-3 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#171310] text-[#A9865A] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#171310] border border-[#A9865A]/30 flex items-center justify-center mx-auto mb-3 text-[#E8AC4E]">
            {isAdminMode ? <ShieldCheck className="w-6 h-6 text-[#92b584]" /> : <Flame className="w-6 h-6 text-[#D8632C]" />}
          </div>

          <h3 className="font-display text-2xl font-bold text-[#F3E9D8]">
            {isAdminMode 
              ? 'Kitchen Admin Hub' 
              : isRegister 
              ? 'Join Dining Club' 
              : 'Sign In'}
          </h3>
          <p className="font-mono text-xs text-[#A9865A] mt-1">
            {isAdminMode 
              ? 'Manage live dispatch, menu items & payment switches' 
              : isRegister 
              ? 'Create an account to save tickets & enjoy offers' 
              : 'Access your order history & saved destinations'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl bg-[#171310] p-1 mb-5 border border-[#A9865A]/20 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setIsAdminMode(false); setIsRegister(false); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isAdminMode && !isRegister ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow' : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            Customer
          </button>
          
          <button
            type="button"
            onClick={() => { setIsAdminMode(false); setIsRegister(true); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              !isAdminMode && isRegister ? 'bg-[#E8AC4E] text-[#171310] font-bold shadow' : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => { setIsAdminMode(true); setIsRegister(false); }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              isAdminMode ? 'bg-[#33402E] text-[#92b584] font-bold shadow' : 'text-[#D6C8B2] hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="flex gap-2 mb-5 font-mono">
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            className="flex-1 py-1 px-2 rounded-lg bg-[#171310] border border-[#A9865A]/30 text-[10px] text-[#E8AC4E] font-bold text-center"
          >
            ⚡ Demo Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="flex-1 py-1 px-2 rounded-lg bg-[#171310] border border-[#33402E] text-[10px] text-[#92b584] font-bold text-center"
          >
            👑 Demo Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
          
          {error && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300">
              {error}
            </div>
          )}

          {isRegister && !isAdminMode && (
            <div>
              <label className="text-[#D6C8B2] block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[#D6C8B2] block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
              />
            </div>
          </div>

          <div>
            <label className="text-[#D6C8B2] block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
              />
            </div>
          </div>

          {isRegister && !isAdminMode && (
            <>
              <div>
                <label className="text-[#D6C8B2] block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#D6C8B2] block mb-1">Saved Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#A9865A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Flat 402, Royal Palms"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 rounded-full font-sans font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 ${
              isAdminMode 
                ? 'bg-[#33402E] hover:bg-[#3e4e37] text-[#92b584] border border-[#92b584]/30' 
                : 'btn-ember-primary'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            <span>
              {isAdminMode 
                ? 'Authenticate Master Admin' 
                : isRegister 
                ? 'Complete Account Signup' 
                : 'Sign In to Account'}
            </span>
          </button>

        </form>

      </div>
    </div>
  );
}
