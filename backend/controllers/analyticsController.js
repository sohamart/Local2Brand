import mongoose from 'mongoose';
import { PageView } from '../models/PageView.js';
import { ActiveVisitor } from '../models/ActiveVisitor.js';
import { connectDB } from '../config/db.js';

// Helper: Ensure MongoDB is connected
const ensureDb = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {
      console.warn('Analytics DB connect notice:', e.message);
    }
  }
};

// Helper: Get IST Date String (YYYY-MM-DD)
const getIstDateString = (dateObj) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

// Helper: Get Start of Day in IST as a UTC Date object
const getIstStartOfDay = (dateObj = new Date()) => {
  const istStr = getIstDateString(dateObj);
  // Construct ISO string for 00:00:00.000 IST (+05:30)
  return new Date(`${istStr}T00:00:00.000+05:30`);
};

// @desc    Track a page navigation view
// @route   POST /api/analytics/track-view
// @access  Public
export const trackPageView = async (req, res) => {
  try {
    await ensureDb();

    const {
      visitorId,
      userId = null,
      userName = '',
      userEmail = '',
      page = '/',
      title = '',
      referrer = '',
      device = 'desktop',
      browser = '',
      os = '',
    } = req.body || {};

    if (!visitorId) {
      return res.status(400).json({ success: false, message: 'visitorId is required' });
    }

    const cleanPage = String(page || '/').trim();
    const cleanVisitorId = String(visitorId).trim();
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
    const now = new Date();

    // 1. Create PageView record in MongoDB
    const viewPromise = PageView.create({
      visitorId: cleanVisitorId,
      userId: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null,
      page: cleanPage,
      title: String(title || '').trim(),
      referrer: String(referrer || '').trim(),
      device: ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop',
      browser: String(browser || '').trim(),
      os: String(os || '').trim(),
      ip: clientIp,
      createdAt: now,
    }).catch((err) => {
      console.warn('PageView insert notice:', err.message);
    });

    // 2. Upsert into ActiveVisitor collection
    const activeUpdate = {
      currentPage: cleanPage,
      pageTitle: String(title || '').trim(),
      device: ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop',
      browser: String(browser || '').trim(),
      os: String(os || '').trim(),
      ip: clientIp,
      lastSeen: now,
    };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      activeUpdate.userId = userId;
    }
    if (userName) activeUpdate.userName = String(userName).trim();
    if (userEmail) activeUpdate.userEmail = String(userEmail).trim();

    const presencePromise = ActiveVisitor.findOneAndUpdate(
      { visitorId: cleanVisitorId },
      {
        $set: activeUpdate,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, new: true }
    ).catch((err) => {
      console.warn('ActiveVisitor upsert notice:', err.message);
    });

    await Promise.allSettled([viewPromise, presencePromise]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('trackPageView error:', error);
    return res.status(200).json({ success: true, fallback: true });
  }
};

// @desc    Record periodic heartbeat to maintain online status
// @route   POST /api/analytics/heartbeat
// @access  Public
export const recordHeartbeat = async (req, res) => {
  try {
    await ensureDb();

    const {
      visitorId,
      userId = null,
      userName = '',
      userEmail = '',
      page = '/',
      title = '',
      device = 'desktop',
      browser = '',
      os = '',
    } = req.body || {};

    if (!visitorId) {
      return res.status(400).json({ success: false, message: 'visitorId is required' });
    }

    const cleanVisitorId = String(visitorId).trim();
    const cleanPage = String(page || '/').trim();
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
    const now = new Date();

    const activeUpdate = {
      currentPage: cleanPage,
      pageTitle: String(title || '').trim(),
      device: ['desktop', 'mobile', 'tablet'].includes(device) ? device : 'desktop',
      browser: String(browser || '').trim(),
      os: String(os || '').trim(),
      ip: clientIp,
      lastSeen: now,
    };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      activeUpdate.userId = userId;
    }
    if (userName) activeUpdate.userName = String(userName).trim();
    if (userEmail) activeUpdate.userEmail = String(userEmail).trim();

    await ActiveVisitor.findOneAndUpdate(
      { visitorId: cleanVisitorId },
      {
        $set: activeUpdate,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true, timestamp: now.toISOString() });
  } catch (error) {
    return res.status(200).json({ success: true, fallback: true });
  }
};

// @desc    Record visitor tab leave / unload
// @route   POST /api/analytics/leave
// @access  Public
export const recordLeave = async (req, res) => {
  try {
    await ensureDb();
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const { visitorId } = body || {};

    if (visitorId) {
      // Drop lastSeen past the 2-minute online threshold
      await ActiveVisitor.findOneAndUpdate(
        { visitorId: String(visitorId).trim() },
        { $set: { lastSeen: new Date(0) } }
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(200).json({ success: true });
  }
};

// @desc    Get complete analytics dashboard data via MongoDB aggregation
// @route   GET /api/analytics/stats
// @access  Public (or Admin protected)
export const getAnalyticsStats = async (req, res) => {
  try {
    await ensureDb();

    const now = new Date();
    // 2 minutes online threshold
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    // Time window anchors in local IST (+05:30)
    const todayStart = getIstStartOfDay(now);

    const sevenDaysAgoStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgoStart = new Date(todayStart.getTime() - 29 * 24 * 60 * 60 * 1000);

    // 1. Query Active Online Visitors (within last 2 mins)
    const activeVisitors = await ActiveVisitor.find({
      lastSeen: { $gte: twoMinutesAgo },
    })
      .sort({ lastSeen: -1 })
      .limit(100)
      .lean();

    const onlineUsersNow = activeVisitors.length;

    // 2. Parallel aggregations for Views and Unique Visitors
    const [
      todayViews,
      sevenDaysViews,
      thirtyDaysViews,
      lifetimeViews,
      todayUniques,
      sevenDaysUniques,
      thirtyDaysUniques,
      lifetimeUniques,
      topPagesAgg,
      dailyTrendAgg,
      deviceAgg,
    ] = await Promise.all([
      PageView.countDocuments({ createdAt: { $gte: todayStart } }),
      PageView.countDocuments({ createdAt: { $gte: sevenDaysAgoStart } }),
      PageView.countDocuments({ createdAt: { $gte: thirtyDaysAgoStart } }),
      PageView.countDocuments({}),

      PageView.distinct('visitorId', { createdAt: { $gte: todayStart } }),
      PageView.distinct('visitorId', { createdAt: { $gte: sevenDaysAgoStart } }),
      PageView.distinct('visitorId', { createdAt: { $gte: thirtyDaysAgoStart } }),
      PageView.distinct('visitorId', {}),

      // Top 10 Most Visited Pages
      PageView.aggregate([
        {
          $group: {
            _id: '$page',
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$visitorId' },
            latestTitle: { $last: '$title' },
          },
        },
        {
          $project: {
            page: '$_id',
            views: 1,
            uniqueCount: { $size: '$uniqueVisitors' },
            title: '$latestTitle',
          },
        },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // 30-Day Daily Chart Aggregation (IST format %Y-%m-%d)
      PageView.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgoStart },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
                timezone: '+05:30',
              },
            },
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$visitorId' },
          },
        },
        {
          $project: {
            date: '$_id',
            views: '$views',
            uniqueCount: { $size: '$uniqueVisitors' },
          },
        },
      ]),

      // Device Distribution Aggregation
      PageView.aggregate([
        {
          $group: {
            _id: '$device',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Format Top Pages
    const mostVisitedPages = (topPagesAgg || []).map((p) => ({
      page: p.page || '/',
      views: p.views || 0,
      uniqueVisitors: p.uniqueCount || 0,
      title: p.title || p.page,
    }));

    // Build guaranteed continuous 30-day timeline
    const trendMap = new Map();
    (dailyTrendAgg || []).forEach((item) => {
      if (item.date) {
        trendMap.set(item.date, {
          views: item.views || 0,
          uniqueVisitors: item.uniqueCount || 0,
        });
      }
    });

    const thirtyDayDailyTrends = [];
    for (let i = 29; i >= 0; i--) {
      const dayDate = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = getIstDateString(dayDate);
      const dayName = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
      }).format(dayDate);

      const found = trendMap.get(dateStr) || { views: 0, uniqueVisitors: 0 };
      thirtyDayDailyTrends.push({
        date: dateStr,
        day: dayName,
        views: found.views,
        uniqueVisitors: found.uniqueVisitors,
      });
    }

    // Format Device Distribution
    const totalDeviceHits = (deviceAgg || []).reduce((acc, d) => acc + (d.count || 0), 0) || 1;
    const deviceBreakdown = {
      desktop: {
        count: deviceAgg?.find((d) => d._id === 'desktop')?.count || 0,
        percentage: Math.round(((deviceAgg?.find((d) => d._id === 'desktop')?.count || 0) / totalDeviceHits) * 100),
      },
      mobile: {
        count: deviceAgg?.find((d) => d._id === 'mobile')?.count || 0,
        percentage: Math.round(((deviceAgg?.find((d) => d._id === 'mobile')?.count || 0) / totalDeviceHits) * 100),
      },
      tablet: {
        count: deviceAgg?.find((d) => d._id === 'tablet')?.count || 0,
        percentage: Math.round(((deviceAgg?.find((d) => d._id === 'tablet')?.count || 0) / totalDeviceHits) * 100),
      },
    };

    // Format Active Visitors List for UI
    const formattedOnlineVisitors = activeVisitors.map((v) => {
      const secondsAgo = Math.max(0, Math.floor((now.getTime() - new Date(v.lastSeen).getTime()) / 1000));
      return {
        visitorId: v.visitorId,
        userId: v.userId,
        userName: v.userName || (v.userId ? 'Logged-In User' : 'Anonymous Visitor'),
        userEmail: v.userEmail || '',
        currentPage: v.currentPage || '/',
        pageTitle: v.pageTitle || '',
        device: v.device || 'desktop',
        browser: v.browser || 'Browser',
        os: v.os || 'OS',
        ip: v.ip || '',
        lastSeen: v.lastSeen,
        secondsAgo,
        isOnline: secondsAgo <= 120,
      };
    });

    return res.status(200).json({
      success: true,
      timestamp: now.toISOString(),
      summary: {
        onlineUsersNow,
        todayViews,
        sevenDaysViews,
        thirtyDaysViews,
        lifetimeViews,
        todayUniqueVisitors: todayUniques.length,
        sevenDaysUniqueVisitors: sevenDaysUniques.length,
        thirtyDaysUniqueVisitors: thirtyDaysUniques.length,
        lifetimeUniqueVisitors: lifetimeUniques.length,
      },
      onlineVisitors: formattedOnlineVisitors,
      mostVisitedPages,
      thirtyDayDailyTrends,
      deviceBreakdown,
    });
  } catch (error) {
    console.error('getAnalyticsStats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error computing website analytics',
    });
  }
};
