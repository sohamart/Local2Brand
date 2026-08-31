import React, { useState } from 'react';
import { X, PhoneCall, CheckCircle2, AlertCircle, Clock, User, Mail, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AshokaChakra from './AshokaChakra';

const TIME_SLOTS = [
  '⚡ ASAP (Within 30 mins during business hours)',
  '🌅 Morning (10:00 AM – 1:00 PM IST)',
  '☀️ Afternoon (2:00 PM – 5:00 PM IST)',
  '🌆 Evening (6:00 PM – 9:00 PM IST)'
];

const TOPICS = [
  'General Website Discussion',
  'Template Customization (48h Express)',
  'Custom UI/UX & High-Ticket Build',
  'Pricing & Packages Consultation',
  'Technical Architecture / E-Commerce'
];

export default function CallbackModal() {
  const { isCallbackOpen, closeCallbackModal, callbackData } = useOrderModal();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredTime: '⚡ ASAP (Within 30 mins during business hours)',
    topic: 'General Website Discussion',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (isCallbackOpen) {
      setFormData({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        preferredTime: callbackData?.preferredTime || '⚡ ASAP (Within 30 mins during business hours)',
        topic: callbackData?.topic || 'General Website Discussion',
        notes: ''
      });
      setSubmitted(false);
      setErrorMessage('');
    }
  }, [isCallbackOpen, user, callbackData]);

  if (!isCallbackOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage('Please provide your name and phone number.');
      toast.warning('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await api.post('/callbacks', formData);
      setSubmitted(true);
      toast.success('Callback requested! Our tech consultant will connect shortly. 📞');
    } catch (err) {
      setErrorMessage(err.message || 'Error requesting callback. Please try again.');
      toast.error(err.message || 'Error requesting callback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 inline-flex items-center gap-1">
              <AshokaChakra size={10} />
              <span>Direct Founder Consultation</span>
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {submitted ? 'Callback Scheduled!' : 'Request a Callback'}
            </h2>
          </div>

          <button
            onClick={closeCallbackModal}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                We'll Call You Shortly! 📞
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Our team has received your request. We will reach out to <strong>{formData.phone}</strong> at your chosen slot.
              </p>
              <button
                onClick={closeCallbackModal}
                className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold text-white l2b-gradient-bg shadow-md cursor-pointer hover:opacity-95"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ankit Verma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email (Optional for confirmation)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. ankit@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-purple-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Preferred Call Time Slot
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferredTime: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-purple-500 text-slate-900 dark:text-white"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Topic of Discussion
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-purple-500 text-slate-900 dark:text-white"
                >
                  {TOPICS.map((top) => (
                    <option key={top} value={top}>{top}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Request Instant Callback'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
