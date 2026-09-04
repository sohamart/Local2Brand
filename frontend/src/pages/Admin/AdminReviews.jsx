import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Trash2,
  Edit3,
  MessageSquarePlus,
  Building,
  User,
  ShieldCheck,
  Award,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import AshokaChakra from '../../components/common/AshokaChakra';
import { SEO } from '../../components/common/CommonUI';
import WriteReviewModal from '../../components/common/WriteReviewModal';
import DashboardLoader from '../../components/common/DashboardLoader';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approvedCount: 0,
    pendingCount: 0,
    fiveStarCount: 0,
    avgRating: 5.0,
  });

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);
      if (searchQuery) params.append('search', searchQuery);

      const res = await api.get(`/reviews/admin/all?${params.toString()}`);
      if (res && res.success) {
        setReviews(res.reviews || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, ratingFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      const res = await api.patch(`/reviews/admin/${reviewId}/status`, { status: newStatus });
      if (res && res.success) {
        toast.success(`Review marked as ${newStatus}`);
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r))
        );
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update review status');
    }
  };

  const handleToggleFeatured = async (reviewId, currentFeatured) => {
    try {
      const res = await api.patch(`/reviews/admin/${reviewId}/status`, {
        isFeatured: !currentFeatured,
      });
      if (res && res.success) {
        toast.success(!currentFeatured ? 'Review marked as Featured ⭐' : 'Review unfeatured');
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, isFeatured: !currentFeatured } : r))
        );
      }
    } catch (err) {
      toast.error(err.message || 'Failed to toggle featured status');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      const res = await api.delete(`/reviews/admin/${reviewId}`);
      if (res && res.success) {
        toast.success('Review deleted permanently');
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  return (
    <>
      <SEO title="Client Reviews Management — Master Admin" description="Moderate, feature, and manage all client testimonials and reviews." />

      <div className="space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold mb-1">
              <AshokaChakra size={11} />
              <span>Client Success Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Client Reviews & Testimonials
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Moderate client ratings, showcase top success stories on the homepage, and maintain brand trust.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchReviews()}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
              title="Refresh Reviews"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingReview(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Add Verified Review</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-glass space-y-1">
            <div className="text-[11px] font-bold uppercase text-slate-400">Total Reviews</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">All Submissions</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-glass space-y-1">
            <div className="text-[11px] font-bold uppercase text-slate-400">Average Rating</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center gap-1">
              <span>{stats.avgRating || '5.0'}</span>
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Platform Score</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-glass space-y-1">
            <div className="text-[11px] font-bold uppercase text-slate-400">5-Star Reviews</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.fiveStarCount}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold">Top Tier Experience</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-glass space-y-1">
            <div className="text-[11px] font-bold uppercase text-slate-400">Live & Approved</div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {stats.approvedCount}
            </div>
            <div className="text-[10px] text-indigo-600 font-bold">Published on Home</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-glass space-y-1 col-span-2 lg:col-span-1">
            <div className="text-[11px] font-bold uppercase text-slate-400">Pending Review</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {stats.pendingCount}
            </div>
            <div className="text-[10px] text-amber-600 font-bold">Needs Moderation</div>
          </div>

        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-glass flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, business, text..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Status Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              {['all', 'approved', 'pending', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Rating Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              {['all', '5', '4', '3'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatingFilter(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    ratingFilter === r
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {r === 'all' ? 'All Stars' : `${r}★`}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Reviews List */}
        {loading && reviews.length === 0 ? (
          <div className="py-16 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <DashboardLoader
              title="Loading Client Reviews & Testimonials..."
              subtitle="Fetching verified ratings and feedback from database..."
              role="admin"
            />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
            <Star className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No reviews found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No client reviews match your selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-glass flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all"
              >
                <div>
                  {/* Top Row: User details & Status Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-sm border border-purple-200 dark:border-purple-800 shrink-0">
                        {rev.avatar ? (
                          <img src={rev.avatar} alt={rev.userName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{(rev.userName || 'U')[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {rev.userName}
                          </h4>
                          {rev.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                              <Sparkles className="w-2.5 h-2.5 text-purple-500" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {rev.userRole} • {rev.businessName || 'Business'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        rev.status === 'approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : rev.status === 'rejected'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {rev.status === 'approved' ? '✓ Approved' : rev.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1.5">
                      {rev.rating || 5}.0 ★
                    </span>
                  </div>

                  {/* Comment Quote */}
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Bottom Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400 text-[10px]">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Toggle Featured */}
                    <button
                      onClick={() => handleToggleFeatured(rev._id, rev.isFeatured)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        rev.isFeatured
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-amber-500'
                      }`}
                      title={rev.isFeatured ? 'Remove from Featured' : 'Feature on Home'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    {/* Approve button */}
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(rev._id, 'approved')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        title="Approve Review"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Reject button */}
                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(rev._id, 'rejected')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        title="Reject Review"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Edit button */}
                    <button
                      onClick={() => {
                        setEditingReview(rev);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Review Modal for Admin */}
        <WriteReviewModal
          isOpen={isModalOpen}
          initialData={editingReview}
          onClose={() => {
            setIsModalOpen(false);
            setEditingReview(null);
          }}
          onSuccess={() => {
            fetchReviews();
          }}
        />

      </div>
    </>
  );
}
