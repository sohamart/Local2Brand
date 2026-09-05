import { Review } from '../models/Review.js';
import mongoose from 'mongoose';
import { readLocalStore, writeLocalStore } from '../config/store.js';
import oneSignalBackend from '../services/oneSignalService.js';

const DEFAULT_REVIEWS = [
  {
    _id: 'rev_seed_1',
    userName: 'Vikram Malhotra',
    userRole: 'Founder & Executive Chef',
    businessName: 'Komorebi Rooftop Dining',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    comment: 'LOCAL2BRAND took our dining concept and created a website that looks like it belongs in Tokyo or New York. The direct WhatsApp reservation system alone increased our weekend bookings by over 200%. Incredible turnaround time.',
    status: 'approved',
    isFeatured: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'rev_seed_2',
    userName: 'Sarah Jenkins',
    userRole: 'Creative Director',
    businessName: 'Solis Architectural Studio',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    comment: 'The liquid-glass aesthetic and smooth page physics are truly Apple-grade. We pitched three international real estate developers last month and all three complimented our website before discussing the project proposal.',
    status: 'approved',
    isFeatured: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'rev_seed_3',
    userName: 'Arjun Singhania',
    userRole: 'Managing Director',
    businessName: 'Elysian Prime Estates',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    comment: 'We customized the Real Estate demo in less than 4 days. Our sales team receives pre-qualified buyer inquiries straight on WhatsApp with the specific villa and budget already filled in. It is effortless.',
    status: 'approved',
    isFeatured: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'rev_seed_4',
    userName: 'Pooja Hegde',
    userRole: 'Head of Operations',
    businessName: 'Aura Luxe Salon & Spa',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    comment: 'Clients constantly tell us how easy it is to browse our salon treatments on mobile and click to book their stylist. Our average order ticket increased significantly because people see all our premium packages clearly.',
    status: 'approved',
    isFeatured: false,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'rev_seed_5',
    userName: 'Marcus Vance',
    userRole: 'Co-founder & CEO',
    businessName: 'Pulse Tech Labs',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    comment: 'From our first conversation on WhatsApp to launch was remarkably smooth. No endless meetings, just crisp execution, breathtaking UI, and 99 PageSpeed performance out of the box.',
    status: 'approved',
    isFeatured: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'rev_seed_6',
    userName: 'Rohan Deshmukh',
    userRole: 'Gym Owner & Head Trainer',
    businessName: 'IronForge Elite Fitness',
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    comment: 'Got our full gym site live with membership calculator and class schedules in just 3 days! Already signed up 45+ new annual members this month.',
    status: 'approved',
    isFeatured: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Helper to seed store if empty
const ensureSeedReviews = async () => {
  if (mongoose.connection.readyState === 1) {
    const count = await Review.countDocuments();
    if (count === 0) {
      const cleanSeeds = DEFAULT_REVIEWS.map(({ _id, ...r }) => r);
      await Review.insertMany(cleanSeeds);
    }
  } else {
    let reviews = readLocalStore('reviews');
    if (!reviews || reviews.length === 0) {
      reviews = [...DEFAULT_REVIEWS];
      writeLocalStore('reviews', reviews);
    }
  }
};

/**
 * Public: Get approved reviews (sorted by best reviews first)
 */
export const getReviews = async (req, res) => {
  try {
    await ensureSeedReviews();

    const { sort = 'best', rating, featured, limit = 50 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = { status: 'approved' };
      if (rating) filter.rating = Number(rating);
      if (featured === 'true') filter.isFeatured = true;

      let sortOptions = { isFeatured: -1, rating: -1, createdAt: -1 };
      if (sort === 'latest') {
        sortOptions = { createdAt: -1 };
      } else if (sort === 'rating') {
        sortOptions = { rating: -1, createdAt: -1 };
      }

      const reviews = await Review.find(filter)
        .sort(sortOptions)
        .limit(Number(limit));

      // Calculate stats summary
      const allApproved = await Review.find({ status: 'approved' });
      const totalCount = allApproved.length;
      const avgRating = totalCount > 0
        ? (allApproved.reduce((acc, curr) => acc + (curr.rating || 5), 0) / totalCount).toFixed(1)
        : '5.0';

      return res.status(200).json({
        success: true,
        count: reviews.length,
        totalCount,
        avgRating: Number(avgRating),
        reviews,
      });
    } else {
      let reviews = readLocalStore('reviews') || [];
      if (reviews.length === 0) {
        reviews = [...DEFAULT_REVIEWS];
        writeLocalStore('reviews', reviews);
      }

      let filtered = reviews.filter((r) => r.status === 'approved' || !r.status);
      if (rating) filtered = filtered.filter((r) => Number(r.rating) === Number(rating));
      if (featured === 'true') filtered = filtered.filter((r) => r.isFeatured);

      if (sort === 'latest') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        // Best reviews first (Featured -> Rating desc -> Date desc)
        filtered.sort((a, b) => {
          if ((b.isFeatured ? 1 : 0) !== (a.isFeatured ? 1 : 0)) {
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
          }
          if ((b.rating || 5) !== (a.rating || 5)) {
            return (b.rating || 5) - (a.rating || 5);
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      }

      const totalCount = filtered.length;
      const avgRating = totalCount > 0
        ? (filtered.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) / totalCount).toFixed(1)
        : '5.0';

      return res.status(200).json({
        success: true,
        count: filtered.length,
        totalCount,
        avgRating: Number(avgRating),
        reviews: filtered.slice(0, Number(limit)),
      });
    }
  } catch (error) {
    console.error('getReviews error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching reviews' });
  }
};

/**
 * User: Get user's own submitted reviews
 */
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email;

    if (mongoose.connection.readyState === 1) {
      const query = {
        $or: [
          ...(userId && mongoose.Types.ObjectId.isValid(userId) ? [{ user: userId }] : []),
          ...(userEmail ? [{ userEmail: userEmail.toLowerCase().trim() }] : []),
        ],
      };
      const reviews = await Review.find(query.length > 0 ? query : { user: userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: reviews.length, reviews });
    } else {
      const reviews = readLocalStore('reviews') || [];
      const userReviews = reviews.filter(
        (r) =>
          (userId && String(r.user) === String(userId)) ||
          (userEmail && r.userEmail?.toLowerCase() === userEmail.toLowerCase())
      );
      return res.status(200).json({ success: true, count: userReviews.length, reviews: userReviews });
    }
  } catch (error) {
    console.error('getMyReviews error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching your reviews' });
  }
};

/**
 * Create review (Public / Authenticated)
 */
export const createReview = async (req, res) => {
  try {
    const { userName, userEmail, userRole, businessName, rating, comment, avatar } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Review comment is required' });
    }

    const ratingNum = Math.max(1, Math.min(5, Number(rating) || 5));
    const name = userName || req.user?.name || 'Valued Client';
    const email = userEmail || req.user?.email || '';
    const role = userRole || 'Business Owner';
    const business = businessName || req.user?.company || '';
    const userAvatar = avatar || req.user?.avatar || '';

    const reviewData = {
      user: req.user?._id || req.user?.id || null,
      userName: name,
      userEmail: email,
      userRole: role,
      businessName: business,
      rating: ratingNum,
      comment: comment.trim(),
      avatar: userAvatar,
      status: 'approved', // Auto-approved for instant satisfaction, admin can moderate
      isFeatured: false,
      createdAt: new Date().toISOString(),
    };

    // In-App Inbox Alert + Push Notification to Admins
    try {
      const notifMod = await import('../services/notificationDispatcher.js');
      const dispatcher = notifMod.notificationDispatcher || notifMod.default;
      if (dispatcher) {
        dispatcher.dispatchToAdmin({
          title: '⭐ New Client Review Published',
          message: `${name} gave a ${ratingNum}-star review for ${business || 'LOCAL2BRAND'}: "${comment.substring(0, 80)}..."`,
          type: 'system',
          category: 'Reviews',
          link: '/admin/reviews',
          data: { type: 'new_review', rating: ratingNum, userName: name },
          priority: 'normal',
        }).catch(() => {});

        // Personal inbox confirmation to user
        const targetUserId = req.user?._id || req.user?.id;
        if (targetUserId || email) {
          dispatcher.dispatchToUser({
            userId: targetUserId,
            email,
            title: '⭐ Review Published Live!',
            message: 'Thank you for your feedback! Your review is now live on our official showcase.',
            type: 'system',
            category: 'Reviews',
            link: '/portfolio',
            priority: 'normal',
          }).catch(() => {});
        }
      }
    } catch (notifErr) {
      console.warn('Review notification notice:', notifErr.message);
    }

    if (mongoose.connection.readyState === 1) {
      const newReview = await Review.create(reviewData);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your review has been published successfully ⭐',
        review: newReview,
      });
    } else {
      const reviews = readLocalStore('reviews') || [];
      const newReview = {
        _id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        ...reviewData,
      };
      reviews.unshift(newReview);
      writeLocalStore('reviews', reviews);
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your review has been published successfully ⭐',
        review: newReview,
      });
    }
  } catch (error) {
    console.error('createReview error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error submitting review' });
  }
};

/**
 * Update review
 */
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, businessName, userRole, userName, avatar } = req.body;

    if (mongoose.connection.readyState === 1) {
      let review = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        review = await Review.findById(id);
      }
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      // Authorization check (user is admin OR owner)
      const isOwner = req.user && String(review.user) === String(req.user._id);
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
      }

      if (rating !== undefined) review.rating = Math.max(1, Math.min(5, Number(rating)));
      if (comment !== undefined) review.comment = comment;
      if (businessName !== undefined) review.businessName = businessName;
      if (userRole !== undefined) review.userRole = userRole;
      if (userName !== undefined) review.userName = userName;
      if (avatar !== undefined) review.avatar = avatar;

      await review.save();
      return res.status(200).json({ success: true, message: 'Review updated successfully', review });
    } else {
      const reviews = readLocalStore('reviews') || [];
      const idx = reviews.findIndex((r) => String(r._id) === String(id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      const review = reviews[idx];
      const isOwner = req.user && String(review.user) === String(req.user._id || req.user.id);
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
      }

      reviews[idx] = {
        ...reviews[idx],
        ...(rating !== undefined && { rating: Math.max(1, Math.min(5, Number(rating))) }),
        ...(comment !== undefined && { comment }),
        ...(businessName !== undefined && { businessName }),
        ...(userRole !== undefined && { userRole }),
        ...(userName !== undefined && { userName }),
        ...(avatar !== undefined && { avatar }),
        updatedAt: new Date().toISOString(),
      };

      writeLocalStore('reviews', reviews);
      return res.status(200).json({ success: true, message: 'Review updated successfully', review: reviews[idx] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete review
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      let review = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        review = await Review.findById(id);
      }
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      const isOwner = req.user && String(review.user) === String(req.user._id);
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
      }

      await Review.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } else {
      let reviews = readLocalStore('reviews') || [];
      const review = reviews.find((r) => String(r._id) === String(id));
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      const isOwner = req.user && String(review.user) === String(req.user._id || req.user.id);
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
      }

      reviews = reviews.filter((r) => String(r._id) !== String(id));
      writeLocalStore('reviews', reviews);
      return res.status(200).json({ success: true, message: 'Review deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get all reviews with status filter, search, & analytics stats
 */
export const adminGetAllReviews = async (req, res) => {
  try {
    await ensureSeedReviews();

    const { status, rating, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (rating && rating !== 'all') filter.rating = Number(rating);
      if (search) {
        filter.$or = [
          { userName: { $regex: search, $options: 'i' } },
          { businessName: { $regex: search, $options: 'i' } },
          { comment: { $regex: search, $options: 'i' } },
        ];
      }

      const reviews = await Review.find(filter).sort({ createdAt: -1 });

      const allReviews = await Review.find();
      const total = allReviews.length;
      const approvedCount = allReviews.filter((r) => r.status === 'approved').length;
      const pendingCount = allReviews.filter((r) => r.status === 'pending').length;
      const fiveStarCount = allReviews.filter((r) => r.rating === 5).length;
      const avgRating = total > 0
        ? (allReviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / total).toFixed(1)
        : '5.0';

      return res.status(200).json({
        success: true,
        count: reviews.length,
        stats: {
          total,
          approvedCount,
          pendingCount,
          fiveStarCount,
          avgRating: Number(avgRating),
        },
        reviews,
      });
    } else {
      let reviews = readLocalStore('reviews') || [];
      if (reviews.length === 0) {
        reviews = [...DEFAULT_REVIEWS];
        writeLocalStore('reviews', reviews);
      }

      const total = reviews.length;
      const approvedCount = reviews.filter((r) => r.status === 'approved').length;
      const pendingCount = reviews.filter((r) => r.status === 'pending').length;
      const fiveStarCount = reviews.filter((r) => Number(r.rating) === 5).length;
      const avgRating = total > 0
        ? (reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) / total).toFixed(1)
        : '5.0';

      let filtered = [...reviews];
      if (status && status !== 'all') {
        filtered = filtered.filter((r) => r.status === status);
      }
      if (rating && rating !== 'all') {
        filtered = filtered.filter((r) => Number(r.rating) === Number(rating));
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.userName?.toLowerCase().includes(s) ||
            r.businessName?.toLowerCase().includes(s) ||
            r.comment?.toLowerCase().includes(s)
        );
      }

      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,
        count: filtered.length,
        stats: {
          total,
          approvedCount,
          pendingCount,
          fiveStarCount,
          avgRating: Number(avgRating),
        },
        reviews: filtered,
      });
    }
  } catch (error) {
    console.error('adminGetAllReviews error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching admin reviews' });
  }
};

/**
 * Admin: Update review status or toggle featured
 */
export const adminUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isFeatured } = req.body;

    if (mongoose.connection.readyState === 1) {
      const updates = {};
      if (status) updates.status = status;
      if (isFeatured !== undefined) updates.isFeatured = isFeatured;

      let review = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        review = await Review.findByIdAndUpdate(id, { $set: updates }, { new: true });
      }
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      return res.status(200).json({ success: true, message: 'Review status updated', review });
    } else {
      const reviews = readLocalStore('reviews') || [];
      const idx = reviews.findIndex((r) => String(r._id) === String(id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      reviews[idx] = {
        ...reviews[idx],
        ...(status && { status }),
        ...(isFeatured !== undefined && { isFeatured }),
        updatedAt: new Date().toISOString(),
      };
      writeLocalStore('reviews', reviews);

      return res.status(200).json({ success: true, message: 'Review status updated', review: reviews[idx] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
