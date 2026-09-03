import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Users,
  Eye,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Layers,
  ArrowUpRight,
  Radio,
  Zap
} from 'lucide-react';
import { SEO } from '../../components/common/CommonUI';
import DashboardLoader from '../../components/common/DashboardLoader';
import AshokaChakra from '../../components/common/AshokaChakra';
import api from '../../services/api';

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [chartMetric, setChartMetric] = useState('views'); // 'views' or 'uniqueVisitors'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const res = await api.get('/analytics/stats');
      if (res.success) {
        setAnalyticsData(res);
      }
    } catch (err) {
      console.warn('Analytics fetch notice:', err.message);
    } finally {
      if (!isSilent) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(false);
  }, [fetchAnalytics]);

  // Auto-refresh polling every 15 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalytics]);

  if (loading && !analyticsData) {
    return (
      <div className="py-24 flex items-center justify-center">
        <DashboardLoader title="Loading Real-Time Analytics from MongoDB..." role="admin" />
      </div>
    );
  }

  const summary = analyticsData?.summary || {
    onlineUsersNow: 0,
    todayViews: 0,
    sevenDaysViews: 0,
    thirtyDaysViews: 0,
    lifetimeViews: 0,
    todayUniqueVisitors: 0,
    sevenDaysUniqueVisitors: 0,
    thirtyDaysUniqueVisitors: 0,
    lifetimeUniqueVisitors: 0,
  };

  const onlineVisitors = analyticsData?.onlineVisitors || [];
  const mostVisitedPages = analyticsData?.mostVisitedPages || [];
  const dailyTrends = analyticsData?.thirtyDayDailyTrends || [];
  const deviceBreakdown = analyticsData?.deviceBreakdown || {
    desktop: { count: 0, percentage: 0 },
    mobile: { count: 0, percentage: 0 },
    tablet: { count: 0, percentage: 0 },
  };

  // Compute Chart Max Value for scaling
  const chartValues = dailyTrends.map((d) => (chartMetric === 'views' ? d.views : d.uniqueVisitors) || 0);
  const maxChartValue = Math.max(5, ...chartValues);
  const totalChartViews = dailyTrends.reduce((acc, d) => acc + (d.views || 0), 0);
  const totalChartUniques = dailyTrends.reduce((acc, d) => acc + (d.uniqueVisitors || 0), 0);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 30;
  const paddingY = 25;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  // Generate SVG Points
  const points = dailyTrends.map((d, index) => {
    const val = chartMetric === 'views' ? d.views || 0 : d.uniqueVisitors || 0;
    const x = paddingX + (index / Math.max(1, dailyTrends.length - 1)) * usableWidth;
    const y = svgHeight - paddingY - (val / maxChartValue) * usableHeight;
    return { x, y, val, ...d };
  });

  const pathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  const maxPageHits = Math.max(1, ...(mostVisitedPages.map((p) => p.views) || [1]));

  return (
    <>
      <SEO
        title="Live Website Analytics — LOCAL2BRAND Admin"
        description="Comprehensive real-time website traffic metrics, active visitors, 30-day view charts, and page analytics."
      />

      <div className="space-y-8 select-text">
        
        {/* 1. Header & Live Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <AshokaChakra size={12} />
              <span>MongoDB Real-Time Serverless Analytics Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Website Traffic &amp; Live Presence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Precise visitor metrics, live active sessions, route transitions, and 30-day growth trends.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-Refresh Toggle */}
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span className="hidden xs:inline">Auto-Sync (15s)</span>
            </label>

            {/* Manual Sync Button */}
            <button
              onClick={() => fetchAnalytics(false)}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* 2. Top Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* Card 1: Live Online Now */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 dark:border-emerald-500/20 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Online Right Now
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {summary.onlineUsersNow}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Active Visitors</span>
            </div>
            <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium mt-1">
              Seen in last 2 mins
            </p>
          </div>

          {/* Card 2: Today's Views */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Today's Traffic</span>
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {summary.todayViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-purple-600 font-bold">Views</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              <strong className="text-slate-700 dark:text-slate-300">{summary.todayUniqueVisitors}</strong> Unique Visitors
            </p>
          </div>

          {/* Card 3: Last 7 Days */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Last 7 Days</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {summary.sevenDaysViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-600 font-bold">Views</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              <strong className="text-slate-700 dark:text-slate-300">{summary.sevenDaysUniqueVisitors}</strong> Unique Visitors
            </p>
          </div>

          {/* Card 4: Last 30 Days */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Last 30 Days</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {summary.thirtyDaysViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">Views</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              <strong className="text-slate-700 dark:text-slate-300">{summary.thirtyDaysUniqueVisitors}</strong> Unique Visitors
            </p>
          </div>

          {/* Card 5: Lifetime Totals */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-200 dark:border-purple-800/60 shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                Lifetime Reach
              </span>
              <Globe className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300">
                {summary.lifetimeViews.toLocaleString()}
              </span>
              <span className="text-[10px] text-purple-600 font-bold">Views</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-1">
              <strong className="text-slate-700 dark:text-slate-300">{summary.lifetimeUniqueVisitors.toLocaleString()}</strong> Total Visitors
            </p>
          </div>

        </div>

        {/* 3. 30-Day Daily Interactive Traffic Trends Chart */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>30-Day Traffic Trajectory (Daily Trend)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Daily volume recorded across Indian Standard Time (IST).
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setChartMetric('views')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartMetric === 'views'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Page Views ({totalChartViews})
              </button>
              <button
                onClick={() => setChartMetric('uniqueVisitors')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  chartMetric === 'uniqueVisitors'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Unique Visitors ({totalChartUniques})
              </button>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="relative w-full overflow-hidden pt-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 sm:h-56 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = paddingY + ratio * usableHeight;
                const valLabel = Math.round((1 - ratio) * maxChartValue);
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800 stroke-[1]"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 6}
                      y={y + 3}
                      textAnchor="end"
                      className="fill-slate-400 text-[10px] font-mono"
                    >
                      {valLabel}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              {areaD && (
                <path
                  d={areaD}
                  fill="url(#analyticsGradient)"
                />
              )}

              {/* Line Path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.date === p.date ? 6 : 3}
                    className="fill-white dark:fill-slate-900 stroke-purple-600 stroke-[2] transition-all duration-150 cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Popup */}
            {hoveredPoint && (
              <div
                className="absolute z-20 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700 pointer-events-none -translate-x-1/2 -translate-y-full mb-2"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                }}
              >
                <div className="font-bold text-amber-300">{hoveredPoint.date} ({hoveredPoint.day})</div>
                <div className="text-[11px] text-slate-300">
                  {hoveredPoint.views} Page Views • {hoveredPoint.uniqueVisitors} Uniques
                </div>
              </div>
            )}
          </div>

          {/* Date Range Labels */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>{dailyTrends[0]?.date} ({dailyTrends[0]?.day})</span>
            <span className="hidden sm:inline">Daily Interval Sampling (IST Timezone)</span>
            <span>{dailyTrends[dailyTrends.length - 1]?.date} (Today)</span>
          </div>
        </div>

        {/* 4. Live Active Visitors & Device Distribution Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Visitors Live Feed (2 Columns) */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span>Real-Time Online Presence (Last 2 Mins)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {onlineVisitors.length} active visitor session(s) streaming live.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                Live Pulse Active
              </span>
            </div>

            {onlineVisitors.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto opacity-30 mb-2" />
                <p className="text-xs">No active visitors in the last 2 minutes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2.5">Visitor / Account</th>
                      <th className="pb-2.5">Current Route</th>
                      <th className="pb-2.5">Device &amp; OS</th>
                      <th className="pb-2.5 text-right">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {onlineVisitors.map((v) => (
                      <tr key={v.visitorId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-200">
                                {v.userName}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {v.userEmail || v.visitorId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <a
                            href={v.currentPage}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline"
                          >
                            <span className="max-w-[140px] truncate">{v.currentPage}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                            {v.device === 'mobile' ? (
                              <Smartphone className="w-3 h-3 text-blue-500" />
                            ) : v.device === 'tablet' ? (
                              <Tablet className="w-3 h-3 text-purple-500" />
                            ) : (
                              <Monitor className="w-3 h-3 text-emerald-500" />
                            )}
                            <span className="capitalize">{v.device}</span>
                            <span className="text-slate-400">• {v.browser}</span>
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            {v.secondsAgo < 10 ? 'Just now' : `${v.secondsAgo}s ago`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Device & Platform Breakdown (1 Column) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-600" />
                <span>Device Distribution</span>
              </h2>
              <p className="text-xs text-slate-500">
                Visitor device category breakdown.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Desktop */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-purple-600" />
                    <span>Desktop Workstations</span>
                  </span>
                  <span>{deviceBreakdown.desktop.percentage}% ({deviceBreakdown.desktop.count})</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${deviceBreakdown.desktop.percentage}%` }}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Mobile Phones</span>
                  </span>
                  <span>{deviceBreakdown.mobile.percentage}% ({deviceBreakdown.mobile.count})</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${deviceBreakdown.mobile.percentage}%` }}
                  />
                </div>
              </div>

              {/* Tablet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Tablet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>iPads &amp; Tablets</span>
                  </span>
                  <span>{deviceBreakdown.tablet.percentage}% ({deviceBreakdown.tablet.count})</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${deviceBreakdown.tablet.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 mt-4">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Zero Serverless Memory Overhead</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                All visitor sessions are indexed and persisted in MongoDB Atlas, ensuring 100% accuracy on Vercel Serverless deployments.
              </p>
            </div>
          </div>

        </div>

        {/* 5. Top 10 Most Visited Pages Table */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <span>Top 10 Most Visited Pages</span>
              </h2>
              <p className="text-xs text-slate-500">
                Most popular routes across the website ranked by total hits.
              </p>
            </div>
          </div>

          {mostVisitedPages.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No page navigation views recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">#</th>
                    <th className="pb-2.5">Page Path</th>
                    <th className="pb-2.5">Page Title / Context</th>
                    <th className="pb-2.5 text-right">Unique Visitors</th>
                    <th className="pb-2.5 text-right">Total Hits</th>
                    <th className="pb-2.5 w-36 text-right">Share of Traffic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {mostVisitedPages.map((page, idx) => {
                    const sharePct = Math.round((page.views / maxPageHits) * 100);
                    return (
                      <tr key={page.page} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3">
                          <Link
                            to={page.page}
                            className="font-mono text-purple-600 hover:text-purple-700 dark:text-purple-400 font-bold hover:underline"
                          >
                            {page.page}
                          </Link>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">
                          {page.title || 'LOCAL2BRAND Platform'}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-300">
                          {page.uniqueVisitors.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                          {page.views.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${sharePct}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-slate-400">{sharePct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
