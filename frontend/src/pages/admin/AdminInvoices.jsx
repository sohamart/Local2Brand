import React, { useState, useEffect } from 'react';
import { Landmark, PlusCircle, Check, FileSpreadsheet, Trash2 } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Invoice Form
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchInvoices = async () => {
    try {
      const res = await API.get('/admin/invoices');
      if (res.data?.invoices) {
        setInvoices(res.data.invoices);
      }
      const projRes = await API.get('/admin/projects');
      if (projRes.data?.projects) {
        setProjects(projRes.data.projects.filter(p => p.status !== 'Pending'));
        if (projRes.data.projects.length > 0) {
          setSelectedProjectId(projRes.data.projects[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching admin invoices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceNumber || !selectedProjectId || !amount || !dueDate) return;

    const targetProject = projects.find(p => p._id === selectedProjectId);
    if (!targetProject) return;

    const payload = {
      invoiceNumber,
      project: selectedProjectId,
      client: targetProject.client?._id,
      amount: parseInt(amount),
      dueDate: new Date(dueDate),
      status: 'Pending',
    };

    try {
      const res = await API.post('/admin/invoices', payload);
      if (res.data?.success) {
        setInvoices(prev => [res.data.invoice, ...prev]);
        setShowAddForm(false);
        setInvoiceNumber('');
        setAmount('');
        setDueDate('');
        fetchInvoices(); // Refresh populated values
      }
    } catch (err) {
      console.error('Error creating invoice', err);
    }
  };

  const handlePaid = async (id) => {
    try {
      const res = await API.put(`/admin/invoices/${id}`, { status: 'Paid' });
      if (res.data?.success) {
        setInvoices(prev => prev.map(inv => (inv._id === id ? { ...inv, status: 'Paid' } : inv)));
      }
    } catch (err) {
      console.error('Error updating invoice state', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Billing Dispatch</h1>
          <p className="text-xs text-slate-500">Track paid margins, issue milestones, and draft billing slips.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <PlusCircle size={14} />
          Issue Invoice
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoices list */}
          <div className="lg:col-span-2 bg-[#090d1a] border border-white/5 p-5 rounded-2xl h-fit">
            <h3 className="font-bold text-sm text-slate-200 border-b border-white/5 pb-3">Dispatched Invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-white/5 text-slate-400 select-none">
                    <th className="p-4 font-bold uppercase tracking-wider">Invoice</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Client</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Amount</th>
                    <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-200">{inv.invoiceNumber}</p>
                        <span className="text-[9px] text-slate-500">Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-400">{inv.client?.name}</td>
                      <td className="p-4 font-extrabold text-white">₹{inv.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {inv.status !== 'Paid' && (
                          <button
                            onClick={() => handlePaid(inv._id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white cursor-pointer ml-auto"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Invoice Panel */}
          {showAddForm && (
            <div className="lg:col-span-1 bg-[#090d1a] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl h-fit">
              <h3 className="font-bold text-sm text-white">Draft Invoice</h3>
              <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Invoice Slip Number *</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                    placeholder="e.g. L2B-2026-002"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Assign Project *</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Amount Billed (INR) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                    placeholder="e.g. 10000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  <Check size={13} />
                  Issue Invoice
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;
