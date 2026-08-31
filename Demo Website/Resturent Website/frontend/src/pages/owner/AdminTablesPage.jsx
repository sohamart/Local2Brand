import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { TABLES, RESERVATIONS } from '../../data/mockData';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Calendar, Users, Plus, CheckCircle2, Clock, MapPin, X, AlertCircle } from 'lucide-react';

export const AdminTablesPage = () => {
  const { activeRestaurant } = useTenant();
  const [tableList, setTableList] = useState(TABLES.filter(t => t.restaurantId === activeRestaurant.id || t.restaurantId === 'rest-001'));
  const [reservations, setReservations] = useState(RESERVATIONS);
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTable, setNewTable] = useState({ number: '', capacity: 4, section: 'Royal Canopy' });

  const handleAddTable = (e) => {
    e.preventDefault();
    const created = {
      id: `tbl-${Date.now()}`,
      restaurantId: activeRestaurant.id,
      number: newTable.number,
      capacity: Number(newTable.capacity),
      section: newTable.section,
      status: 'available'
    };
    setTableList([...tableList, created]);
    setIsAddTableOpen(false);
    setNewTable({ number: '', capacity: 4, section: 'Royal Canopy' });
  };

  const handleUpdateReservationStatus = (id, status) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="min-h-screen bg-[#07080c] flex">
      <AdminSidebar />

      <div className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Floor Plan & Table Reservations
            </h1>
            <p className="text-xs text-slate-400">
              Manage physical table inventory, section capacities, and guest reservations.
            </p>
          </div>

          <button
            onClick={() => setIsAddTableOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dining Table</span>
          </button>
        </div>

        {/* Visual Floor Layout Cards */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-white text-base">Live Floor Layout ({tableList.length} Tables)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableList.map((tbl) => (
              <div
                key={tbl.id}
                className={`glass-panel p-5 rounded-2xl border transition-all ${
                  tbl.status === 'occupied'
                    ? 'border-red-500/40 bg-red-500/5'
                    : tbl.status === 'reserved'
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-heading font-bold text-white text-base">{tbl.number}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    tbl.status === 'occupied'
                      ? 'bg-red-500/20 text-red-300'
                      : tbl.status === 'reserved'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {tbl.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 mt-2">Section: <strong className="text-amber-400">{tbl.section}</strong></div>
                <div className="text-[11px] text-slate-400 mt-0.5">Seating Capacity: {tbl.capacity} Persons</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Reservations Table */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
          <h3 className="font-heading font-bold text-white text-base">Upcoming Guest Bookings</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Booking Ref</th>
                  <th className="py-3 px-3">Guest</th>
                  <th className="py-3 px-3">Date & Slot</th>
                  <th className="py-3 px-3">Table</th>
                  <th className="py-3 px-3">Occasion</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">#{res.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{res.customerName}</div>
                      <div className="text-[10px] text-slate-400">{res.phone}</div>
                    </td>
                    <td className="py-3 px-3">{res.date} • {res.time}</td>
                    <td className="py-3 px-3 font-bold text-amber-300">{res.tableNumber}</td>
                    <td className="py-3 px-3 text-slate-300">{res.occasion}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {res.status === 'pending' ? (
                        <button
                          onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                          className="px-3 py-1 bg-emerald-500 text-black font-bold text-xs rounded-lg shadow-sm"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateReservationStatus(res.id, 'completed')}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg"
                        >
                          Mark Seated
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f111a] border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-white text-base">Add Table to Inventory</h3>
              <button onClick={() => setIsAddTableOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Table Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 7 (VIP Terrace)"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Seating Capacity (Guests)</label>
                <input
                  type="number"
                  required
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase">Floor Section</label>
                <select
                  value={newTable.section}
                  onChange={(e) => setNewTable({ ...newTable, section: e.target.value })}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Courtyard Terrace">Courtyard Terrace</option>
                  <option value="Royal Canopy">Royal Canopy</option>
                  <option value="Heritage Indoor">Heritage Indoor Hall</option>
                  <option value="Sheesh Mahal Glass Lounge">Sheesh Mahal Glass Lounge</option>
                  <option value="Private VIP Dining Room">Private VIP Dining Room</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-95 transition-all mt-2"
              >
                Add Table to Floor Map
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
