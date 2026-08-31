import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { ANALYTICS_DATA } from '../../data/mockData';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Award,
  Users,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminAnalyticsPage = () => {
  const { activeRestaurant } = useTenant();
  const [timeRange, setTimeRange] = useState('7d');

  const channelData = [
    { name: 'Online Delivery', value: 58, color: '#e63946' },
    { name: 'Dine-In Banquets', value: 34, color: '#dfa645' },
    { name: 'Curbside Takeaway', value: 8, color: '#10b981' }
  ];

  return (
    <div className="min-h-screen bg-[#07080c] flex">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Deep Business Intelligence & Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Aggregated margins, channel distribution, peak order velocity, and customer retention metrics.
            </p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            {['Today', '7d', '30d', 'This Year'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeRange === t ? 'bg-amber-500 text-black shadow-gold-glow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Gross Sales</span>
            <div className="text-2xl font-extrabold text-white">₹{ANALYTICS_DATA.overview.grossSales.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">+18.2% Growth</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Net Margin Profit</span>
            <div className="text-2xl font-extrabold text-amber-400">₹{ANALYTICS_DATA.overview.netProfit.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-400">Avg 62% Food Margin</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Average Ticket (AOV)</span>
            <div className="text-2xl font-extrabold text-white">₹{ANALYTICS_DATA.overview.averageOrderValue}</div>
            <div className="text-[11px] text-emerald-400">+₹45 vs Last Month</div>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Repeat Customer Rate</span>
            <div className="text-2xl font-extrabold text-white">{ANALYTICS_DATA.overview.repeatCustomerRate}</div>
            <div className="text-[11px] text-amber-400">High Brand Loyalty</div>
          </div>
        </div>

        {/* Charts Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Revenue Velocity Chart */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-white text-base">Revenue Velocity & Trends</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_DATA.revenueTrends}>
                  <defs>
                    <linearGradient id="anRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dfa645" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#dfa645" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252a3a" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f111a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#dfa645" strokeWidth={3} fillOpacity={1} fill="url(#anRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channel Pie Chart */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
            <h3 className="font-heading font-bold text-white text-base">Channel Share (%)</h3>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4}>
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f111a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              {channelData.map(c => (
                <div key={c.name} className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /> {c.name}</span>
                  <strong className="text-white">{c.value}%</strong>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Top Product Margins Table */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <h3 className="font-heading font-bold text-white text-base">Dishes Profitability Matrix</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Recipe Name</th>
                  <th className="py-3 px-3">Units Sold</th>
                  <th className="py-3 px-3">Total Gross Revenue</th>
                  <th className="py-3 px-3">Profit Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {ANALYTICS_DATA.topDishes.map((dish, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{dish.name}</td>
                    <td className="py-3 px-3">{dish.sales} orders</td>
                    <td className="py-3 px-3 font-bold text-amber-400">₹{dish.revenue.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {dish.margin}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
