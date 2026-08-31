import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Star,
  Sparkles,
  Send,
  Building,
  User,
  Briefcase,
  MessageSquare,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import AshokaChakra from './AshokaChakra';

const RATING_LABELS = {
  1: 'Poor / Needs Improvement 🙁',
  2: 'Fair / Below Expectation 😐',
  3: 'Good / Decent Result 🙂',
  4: 'Very Good / High Quality 😊',
  5: 'Exceptional & Outstanding! 🌟'
};

export default function WriteReviewModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null, // for editing existing review
}) {
  const { user, openAuthModal } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [rating, setRating] = useState(initialData?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 5);
      setUserName(initialData.userName || '');
      setBusinessName(initialData.businessName || '');
      setUserRole(initialData.userRole || '');
      setComment(initialData.comment || '');
    } else if (user) {
      setUserName(user.name || '');
      setBusinessName(user.company || '');
      setUserRole('Business Founder');
      setRating(5);
      setComment('');
    } else {
      setUserName('');
      setBusinessName('');
      setUserRole('Business Owner');
      setRating(5);
      setComment('');
    }
  }, [initialData, user, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Please enter your review feedback');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rating,
        userName: userName.trim() || user?.name || 'Valued Client',
        userEmail: user?.email || '',
        businessName: businessName.trim() || user?.company || 'Local Business',
        userRole: userRole.trim() || 'Business Owner',
        comment: comment.trim(),
        avatar: user?.avatar || initialData?.avatar || '',
      };

      let res;
      if (initialData && initialData._id) {
        res = await api.put(`/reviews/${initialData._id}`, payload);
      } else {
        res = await api.post('/reviews', payload);
      }

      if (res && res.success) {
        toast.success(res.message || 'Review submitted successfully! 🎉');
        if (onSuccess) onSuccess(res.review);
        onClose();
      } else {
        throw new Error(res?.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[2147483640] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-2xl animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] sm:max-h-[86vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden my-auto"
      >
        {/* Header Ribbon (Sticky Top) */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 sm:p-2.5 rounded-full bg-black/25 hover:bg-black/50 text-white transition-all cursor-pointer z-20"
            aria-label="Close review modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold mb-1.5">
            <AshokaChakra size={11} />
            <span>{initialData ? 'Update Feedback' : 'Client Success Voice'}</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight pr-8">
            {initialData ? 'Edit Your Review' : 'Share Your Experience'}
          </h3>
          <p className="text-xs text-purple-100 mt-0.5 sm:mt-1 pr-6">
            Help other business owners discover the power of high-converting web experiences.
          </p>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto overscroll-contain">
          
          {/* Interactive Star Picker */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              How would you rate your experience? ⭐
            </label>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 sm:p-1.5 focus:outline-none transition-transform hover:scale-125 cursor-pointer touch-manipulation"
                  title={`${star} Star`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {RATING_LABELS[hoverRating || rating]}
            </p>
          </div>

          {/* Name & Role Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-500" />
                <span>Your Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm sm:text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                <span>Your Role / Title</span>
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="e.g. Founder & Chef, CEO"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm sm:text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-purple-500" />
              <span>Business / Brand Name</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Komorebi Rooftop Restaurant"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm sm:text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Feedback Comment */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                <span>Your Review & Results *</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {comment.length} / 600 chars
              </span>
            </label>
            <textarea
              required
              rows={3}
              maxLength={600}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share how LOCAL2BRAND transformed your online speed, inquiries, design quality, or WhatsApp bookings..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm sm:text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* User Account Info / Guest Notice */}
          {!user && (
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                💡 Have an account? Log in to link your verified client avatar.
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal();
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-500 self-start sm:self-auto cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{initialData ? 'Save Changes' : 'Publish Review ⭐'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
