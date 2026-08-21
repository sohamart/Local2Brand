import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, CheckCircle2, AlertCircle, FileSpreadsheet, Download } from 'lucide-react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingInvoice, setPayingInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Since we are mocking database responses, let's load client's invoices
        // We will seed or request it from backend project details
        const res = await API.get('/projects');
        if (res.data?.projects) {
          // Mock invoices based on project budgets
          const mockInvoices = res.data.projects.map((p, idx) => ({
            _id: `inv-${idx}`,
            invoiceNumber: `L2B-2026-00${idx + 1}`,
            projectName: p.name,
            amount: p.budget,
            status: idx === 0 ? 'Partially Paid' : 'Pending',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            downloadUrl: '#',
          }));
          setInvoices(mockInvoices);
        }
      } catch (err) {
        console.error('Error fetching invoices', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handlePayMock = (invoice) => {
    setPayingInvoice(invoice);
  };

  const confirmMockPayment = () => {
    setInvoices(prev =>
      prev.map(inv => (inv._id === payingInvoice._id ? { ...inv, status: 'Paid' } : inv))
    );
    setPayingInvoice(null);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">Billing & Invoices</h1>
        <p className="text-xs text-slate-500">View billed project amounts and coordinate direct payments.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : invoices.length === 0 ? (
        <div className="text-center py-20 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] glass-panel">
          <p className="text-slate-605 dark:text-slate-400 text-xs">No invoices dispatched yet.</p>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[28px] overflow-hidden shadow-lg glass-panel">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 select-none">
                  <th className="p-4 font-bold uppercase tracking-wider">Invoice Details</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Project</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Amount</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 font-bold">
                        <FileSpreadsheet size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{inv.invoiceNumber}</p>
                        <span className="text-[9px] text-slate-550">Due: {inv.dueDate}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{inv.projectName}</td>
                    <td className="p-4 font-extrabold text-slate-950 dark:text-white">₹{inv.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : inv.status === 'Partially Paid'
                          ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                          : 'bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-400'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <a
                        href={inv.downloadUrl}
                        className="p-1.5 rounded-lg border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-450 hover:text-slate-950 dark:hover:text-white"
                        title="Download pdf summary"
                      >
                        <Download size={14} />
                      </a>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => handlePayMock(inv)}
                          className="px-3 py-1.5 text-[10px] font-bold liquid-btn"
                        >
                          Pay Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pay Modal Mockup */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-250 dark:border-white/10 p-6 rounded-[28px] space-y-6 text-center shadow-2xl glass-panel">
            <Landmark size={32} className="text-yellow-600 dark:text-yellow-450 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Razorpay Secure Checkout</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Pay amount for invoice {payingInvoice.invoiceNumber}</p>
            </div>
            <div className="py-3 bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-white/5 rounded-xl">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">₹{payingInvoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setPayingInvoice(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-450 hover:text-slate-950 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmMockPayment}
                className="flex-1 py-2.5 text-xs font-bold liquid-btn"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
