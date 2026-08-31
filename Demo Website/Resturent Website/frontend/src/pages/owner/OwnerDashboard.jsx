import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { ANALYTICS_DATA, TABLES, RESERVATIONS } from '../../data/mockData';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import {
  DollarSign,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  Printer,
  ChevronRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Search,
  Filter
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
  ResponsiveContainer
} from 'recharts';

export const OwnerDashboard = () => {
  const { activeRestaurant } = useTenant();
  const { orders, updateOrderStatus } = useCart();

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'pending', 'preparing', 'ready', 'delivered'

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === orderFilter);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
              {activeRestaurant.name} • Executive Management
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Restaurant Operations & Insights
          </h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry, table occupancy, kitchen queue, and AI business intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitchen Terminal: <strong className="text-emerald-400">ONLINE</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2 shadow-lg hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {activeRestaurant.currency}{ANALYTICS_DATA.overview.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.6% vs last week</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2 shadow-lg hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-brand-primary/20 text-brand-primary">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {ANALYTICS_DATA.overview.totalOrders}
          </div>
          <div className="text-[11px] text-slate-400">
            Avg Ticket: <strong className="text-amber-400">{activeRestaurant.currency}{ANALYTICS_DATA.overview.averageOrderValue}</strong>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2 shadow-lg hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bookings</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {ANALYTICS_DATA.overview.activeReservations}
          </div>
          <div className="text-[11px] text-amber-400 font-semibold">
            96% Peak Weekend Occupancy
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2 shadow-lg hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repeat Patrons</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {ANALYTICS_DATA.overview.repeatCustomerRate}
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Royal Loyalty Club
          </div>
        </div>

      </div>

      {/* AI Business Intelligence Insights */}
      <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 space-y-3 bg-gradient-to-r from-amber-500/5 via-transparent to-brand-primary/5">
        <div className="flex items-center gap-2 text-amber-400">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider">
            GourmetOS Automated Business Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ANALYTICS_DATA.businessInsights.map((insight, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
              <div className="font-bold text-amber-300">{insight.title}</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Graphical Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Trend Area Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-white text-base">Weekly Revenue Velocity</h3>
              <p className="text-[11px] text-slate-400">Daily gross turnover (Monday – Sunday)</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              Week Total: ₹4,89,900
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA.revenueTrends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dfa645" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#dfa645" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252a3a" />
                <XAxis dataKey="day" stroke="#64748b" textAnchor="end" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f111a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#dfa645" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Channel Distribution Bar Chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-white text-base">Channel Volume</h3>
            <p className="text-[11px] text-slate-400">Dine-in vs Online Delivery</p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252a3a" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f111a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="dineIn" fill="#dfa645" radius={[4, 4, 0, 0]} name="Dine-In" />
                <Bar dataKey="delivery" fill="#e63946" radius={[4, 4, 0, 0]} name="Delivery" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Dine-In</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-primary" /> Delivery</span>
          </div>
        </div>

      </div>

      {/* Live Orders Queue Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="font-heading font-bold text-white text-lg">Live Orders Pipeline</h3>
            <p className="text-xs text-slate-400">Real-time status transition and thermal printing</p>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs capitalize font-medium transition-all ${
                  orderFilter === st
                    ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-amber-400">#{ord.id}</td>
                  <td className="py-3 px-2">
                    <div className="font-bold text-white">{ord.customer?.name}</div>
                    <div className="text-[10px] text-slate-400">{ord.customer?.phone}</div>
                  </td>
                  <td className="py-3 px-2 capitalize font-medium">{ord.orderType?.replace('_', ' ')}</td>
                  <td className="py-3 px-2">
                    <div className="truncate max-w-[200px]">
                      {ord.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-2 font-bold text-white">
                    {activeRestaurant.currency}{ord.total}
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : ord.orderStatus === 'preparing'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : ord.orderStatus === 'ready'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : 'bg-white/10 text-white border-white/20'
                      }`}
                    >
                      <option value="pending" className="bg-[#141722] text-white">Pending</option>
                      <option value="confirmed" className="bg-[#141722] text-white">Confirmed</option>
                      <option value="preparing" className="bg-[#141722] text-white">Preparing</option>
                      <option value="ready" className="bg-[#141722] text-white">Ready</option>
                      <option value="delivered" className="bg-[#141722] text-white">Delivered</option>
                    </select>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                      title="Print Thermal / Tax Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Invoice Modal for Owner / Kitchen Thermal Printing */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
