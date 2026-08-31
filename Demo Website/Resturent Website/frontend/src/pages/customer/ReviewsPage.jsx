import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { REVIEWS } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '../../components/common/MotionWrapper';
import { Star, MessageSquare, Plus, CheckCircle, Award, X, ThumbsUp } from 'lucide-react';

export const ReviewsPage = () => {
  const { activeRestaurant } = useTenant();
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    dish: '',
    rating: 5,
    foodRating: 5,
    serviceRating: 5,
    comment: ''
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const created = {
      id: `rev-${Date.now()}`,
      restaurantId: activeRestaurant.id,
      author: newReview.author || 'Gourmet Patron',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      rating: Number(newReview.rating),
      foodRating: Number(newReview.foodRating),
      serviceRating: Number(newReview.serviceRating),
      date: 'Just now',
      dish: newReview.dish || 'Imperial Feast',
      comment: newReview.comment,
      verifiedPurchase: true
    };

    setReviewsList([created, ...reviewsList]);
    setIsModalOpen(false);
    setNewReview({ author: '', dish: '', rating: 5, foodRating: 5, serviceRating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 space-y-12">
      <PageHeader
        title="Patron Acclaim & Critic Reviews"
        subtitle="Discover authentic testimonials and gastronomic reviews from food critics and discerning patrons."
        badge="4.9 / 5.0 Michelin Guild"
        breadcrumbs={[{ label: 'Reviews' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Rating Summary Header */}
        <FadeIn>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-heading text-4xl sm:text-5xl font-extrabold text-amber-400">4.9</div>
                <div className="flex items-center gap-1 text-amber-400 justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Based on 400+ reviews</div>
              </div>

              <div className="h-14 w-px bg-white/10 hidden sm:block" />

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-400">Food Quality</span>
                  <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full w-[98%]" />
                  </div>
                  <span className="font-bold text-white">4.95</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-400">Ambiance</span>
                  <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full w-[96%]" />
                  </div>
                  <span className="font-bold text-white">4.90</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-slate-400">Silver Service</span>
                  <div className="w-32 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full w-[95%]" />
                  </div>
                  <span className="font-bold text-white">4.88</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Verified Review</span>
            </button>
          </div>
        </FadeIn>

        {/* Reviews Grid */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsList.map((rev) => (
            <FadeInStaggerItem key={rev.id}>
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between h-full hover:border-amber-400/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="text-[11px] text-amber-400 font-semibold">
                    Dished: {rev.dish}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white">{rev.author}</h5>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified Patron
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0f111a] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-lg">Submit Culinary Review</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Natasha Poonawalla"
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Dish Enjoyed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zafrani Mutton Dum Biryani"
                  value={newReview.dish}
                  onChange={(e) => setNewReview({ ...newReview, dish: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Your Overall Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Imperial Perfection)</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars (Excellent)</option>
                  <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Your Review & Notes</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the aroma, texture, and silver service..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
