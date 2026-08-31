import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import { Search, Filter, Printer, CheckCircle2, Clock, Eye, AlertCircle } from 'lucide-react';

export const AdminOrdersPage = () => {
  const { activeRestaurant } = useTenant();
  const { orders, updateOrderStatus } = useCart();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCust = o.customer?.name?.toLowerCase().includes(q);
      if (!matchId && !matchCust) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07080c] flex">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Orders Management Pipeline
            </h1>
            <p className="text-xs text-slate-400">
              Track live orders, advance kitchen status, view customer notes, and generate invoices.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order # or customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-6 flex items-center gap-1.5 overflow-x-auto">
              {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs capitalize font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-amber-500 text-black font-bold shadow-gold-glow'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Fulfillment</th>
                  <th className="py-3 px-3">Items Ordered</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-400">#{ord.id}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{ord.customer?.name}</div>
                      <div className="text-[10px] text-slate-400">{ord.customer?.phone}</div>
                    </td>
                    <td className="py-3.5 px-3 capitalize font-semibold">{ord.orderType?.replace('_', ' ')}</td>
                    <td className="py-3.5 px-3">
                      <div className="truncate max-w-xs">
                        {ord.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">{activeRestaurant.currency}{ord.total}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${ord.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {ord.paymentMethod?.toUpperCase()} ({ord.paymentStatus})
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className="bg-[#141722] border border-white/10 rounded-lg px-2 py-1 text-[11px] font-bold text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedInvoice(ord)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                        title="Print Invoice / KOT"
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

      </div>

      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
