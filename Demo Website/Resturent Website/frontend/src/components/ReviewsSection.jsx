import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquarePlus, 
  Quote, 
  CheckCircle, 
  Flame, 
  X, 
  Loader2 
} from 'lucide-react';
import { api } from '../services/api';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 5.0 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [dishName, setDishName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.getReviews();
      setReviews(res.reviews || []);
      setStats(res.stats || { total: 0, average: 5.0 });
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      await api.submitReview({
        user_name: name,
        rating,
        dish_name: dishName || 'Tandoor & Charcoal Experience',
        comment
      });
      setSuccessMsg('Thank you for sharing your experience!');
      fetchReviews();
      setTimeout(() => {
        setSuccessMsg('');
        setShowReviewModal(false);
        setName('');
        setComment('');
        setDishName('');
      }, 1600);
    } catch (err) {
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-24 bg-[#171310] relative border-b border-[#A9865A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#231d19] border border-[#A9865A]/30 text-[#E8AC4E] text-[11px] font-mono uppercase tracking-widest mb-3">
              <Star className="w-3 h-3 text-[#E8AC4E] fill-[#E8AC4E]" />
              <span>Customer Gastronomy Reviews</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F3E9D8] tracking-tight">
              Words From <span className="italic font-normal text-[#E8AC4E]">Our Foodies</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#231d19] border border-[#A9865A]/30 px-4 py-2 rounded-2xl flex items-center gap-3 font-mono">
              <div className="flex items-center text-[#E8AC4E]">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#E8AC4E]" />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#F3E9D8]">{stats.average} / 5</span>
                <span className="text-[#A9865A] text-[10px] block">({stats.total} Reviews)</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-brass-pill px-4 py-2.5 rounded-full text-xs font-mono font-bold text-[#E8AC4E] flex items-center gap-2"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Leave Feedback</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-44 rounded-2xl bg-[#231d19]/40 border border-[#A9865A]/20 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="p-6 rounded-3xl bg-[#231d19]/70 border border-[#A9865A]/20 flex flex-col justify-between hover:border-[#A9865A]/50 transition-all"
              >
                <div>
                  <Quote className="w-7 h-7 text-[#A9865A]/30 mb-3" />
                  
                  <div className="flex items-center gap-1 mb-3 text-[#E8AC4E]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E8AC4E]" />
                    ))}
                  </div>

                  <p className="text-[#D6C8B2] text-xs sm:text-sm leading-relaxed mb-4 line-clamp-4 font-sans font-normal">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#A9865A]/15 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.user_name)}&backgroundColor=d8632c,e8ac4e,33402e&textColor=ffffff`}
                      alt={rev.user_name}
                      className="w-8 h-8 rounded-full object-cover border border-[#E8AC4E]/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-[#F3E9D8] truncate max-w-[120px]">{rev.user_name}</h4>
                      <span className="text-[10px] text-[#A9865A] block truncate">{rev.dish_name || 'Verified Foodie'}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#92b584] flex items-center gap-1 font-bold shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div 
              className="relative w-full max-w-md bg-[#231d19] border border-[#A9865A]/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 font-mono text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-[#F3E9D8]">Write a Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1.5 rounded-lg bg-[#171310] text-[#A9865A] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {successMsg ? (
                <div className="py-8 text-center text-[#92b584] space-y-2">
                  <CheckCircle className="w-10 h-10 mx-auto" />
                  <p className="font-bold text-sm text-[#F3E9D8]">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-[#D6C8B2] block mb-1">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          className="p-1 focus:outline-none"
                        >
                          <Star className={`w-5 h-5 ${s <= rating ? 'text-[#E8AC4E] fill-[#E8AC4E]' : 'text-slate-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[#D6C8B2] block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Guest Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                    />
                  </div>

                  <div>
                    <label className="text-[#D6C8B2] block mb-1">Dish Enjoyed</label>
                    <input
                      type="text"
                      placeholder="e.g. Awadhi Dum Mutton Biryani"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C]"
                    />
                  </div>

                  <div>
                    <label className="text-[#D6C8B2] block mb-1">Comments *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us about the flavours and packaging..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 bg-[#171310] border border-[#A9865A]/30 rounded-xl text-white focus:outline-none focus:border-[#D8632C] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-ember-primary w-full py-3 rounded-full font-sans font-bold"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
