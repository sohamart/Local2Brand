import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { downloadInvoicePDF, printInvoiceContent } from '../../utils/pdfGenerator';
import {
  X,
  Printer,
  Download,
  Receipt,
  Building2,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  QrCode,
  ShieldCheck
} from 'lucide-react';

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const { activeRestaurant } = useTenant();
  const [viewMode, setViewMode] = useState('luxury'); // 'luxury' or 'thermal'
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    await downloadInvoicePDF('pdf-invoice-container', order.id);
    setIsGeneratingPDF(false);
  };

  const handlePrint = () => {
    printInvoiceContent('pdf-invoice-container');
  };

  const cgst = Number((order.tax / 2).toFixed(2));
  const sgst = Number((order.tax / 2).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0f111a] rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white text-base">
                  Professional Restaurant Tax Invoice
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                  Local2Brand Agency Verified
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Invoice #{order.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex bg-white/10 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setViewMode('luxury')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'luxury' ? 'bg-amber-500 text-black font-bold shadow-gold-glow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Tax Invoice
              </button>
              <button
                onClick={() => setViewMode('thermal')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'thermal' ? 'bg-amber-500 text-black font-bold shadow-gold-glow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Thermal KOT
              </button>
            </div>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-extrabold text-xs shadow-emerald-glow hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-[#090b10]">
          
          {/* Printable Element */}
          <div
            id="pdf-invoice-container"
            className={`mx-auto p-6 sm:p-8 rounded-2xl shadow-2xl transition-all ${
              viewMode === 'luxury'
                ? 'max-w-2xl bg-white text-slate-900 border border-slate-300'
                : 'max-w-xs bg-white text-black font-mono text-[11px] border border-slate-300'
            }`}
          >
            {viewMode === 'luxury' ? (
              /* PROFESSIONAL RESTAURANT TAX INVOICE WITH LOCAL2BRAND AGENCY BRANDING */
              <div className="space-y-6">
                
                {/* Agency Watermark Bar */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-800">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Powered & Managed by <strong className="text-black font-extrabold">Local2Brand Agency</strong></span>
                  </div>
                  <div className="text-slate-700">
                    GST Compliant POS • SAC: 996331
                  </div>
                </div>

                {/* Header: Restaurant Branding & Invoice Meta */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={activeRestaurant.logo}
                      alt={activeRestaurant.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-sm shrink-0"
                    />
                    <div className="space-y-0.5">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif leading-tight">
                        {activeRestaurant.name}
                      </h1>
                      <div className="text-xs font-semibold text-amber-700">{activeRestaurant.tagline}</div>
                      <div className="text-[11px] text-slate-600 max-w-sm">{activeRestaurant.address}</div>
                      <div className="text-[10px] text-slate-500 pt-0.5">
                        GSTIN: <strong>19AABCU9603R1ZM</strong> • FSSAI Lic: <strong>12821013000492</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Phone: {activeRestaurant.phone} • Email: {activeRestaurant.email}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
                    <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-widest">
                      TAX INVOICE — {order.paymentStatus === 'paid' ? 'PAID' : 'CASH DUE'}
                    </div>
                    <div className="text-xs text-slate-700">
                      Invoice No: <strong className="text-slate-900 font-mono">INV-2026-{order.id?.replace('ORD-', '')}</strong>
                    </div>
                    <div className="text-xs text-slate-700">
                      Order Ref: <strong className="text-amber-700 font-mono">#{order.id}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Date & Time: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Billed To / Fulfillment Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400">Customer Details (Billed To)</div>
                    <div className="font-bold text-slate-900 text-sm">{order.customer?.name}</div>
                    <div className="text-slate-600">{order.customer?.phone}</div>
                    <div className="text-slate-600">{order.customer?.email}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400">Fulfillment & Delivery Destination</div>
                    <div className="font-bold text-amber-700 capitalize">{order.orderType?.replace('_', ' ')} Service</div>
                    <div className="text-slate-600 truncate">{order.customer?.address}</div>
                    <div className="text-[11px] text-slate-500">Payment: <strong className="uppercase text-slate-900">{order.paymentMethod}</strong> (Auth: L2B-OK-8842)</div>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                        <th className="py-2.5 px-3 rounded-l-lg">#</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-2 text-center">HSN/SAC</th>
                        <th className="py-2.5 px-2 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Rate</th>
                        <th className="py-2.5 px-3 text-right rounded-r-lg">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{item.name}</div>
                            {item.variant && <div className="text-[11px] text-amber-700 font-semibold">{item.variant}</div>}
                            {item.addons && item.addons.length > 0 && (
                              <div className="text-[10px] text-slate-500">+{item.addons.join(', ')}</div>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-500 font-mono text-[10px]">996331</td>
                          <td className="py-2.5 px-2 text-center font-bold text-slate-900">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">{activeRestaurant.currency}{item.unitPrice}</td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">{activeRestaurant.currency}{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotals & Taxes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Left: GST Tax Breakup Table */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5">
                    <div className="font-bold text-slate-800 uppercase text-[10px]">Tax Computation (SAC 996331)</div>
                    <div className="flex justify-between text-slate-600">
                      <span>Central GST (CGST @ 2.5%):</span>
                      <strong className="text-slate-900">{activeRestaurant.currency}{cgst}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>State GST (SGST @ 2.5%):</span>
                      <strong className="text-slate-900">{activeRestaurant.currency}{sgst}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1 font-bold">
                      <span>Total GST Tax:</span>
                      <span className="text-slate-900">{activeRestaurant.currency}{order.tax}</span>
                    </div>
                  </div>

                  {/* Right: Net Summary */}
                  <div className="space-y-1.5 text-xs text-slate-700 text-right">
                    <div className="flex justify-between">
                      <span>Gross Item Subtotal:</span>
                      <strong className="text-slate-900">{activeRestaurant.currency}{order.subtotal}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Taxes (5%):</span>
                      <strong className="text-slate-900">{activeRestaurant.currency}{order.tax}</strong>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Fulfillment / Delivery Charge:</span>
                        <strong className="text-slate-900">{activeRestaurant.currency}{order.deliveryFee}</strong>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Privilege Promo Discount:</span>
                        <span>-{activeRestaurant.currency}{order.discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t-2 border-slate-900">
                      <span>NET AMOUNT PAYABLE:</span>
                      <span className="text-amber-700 text-lg">{activeRestaurant.currency}{order.total}</span>
                    </div>
                  </div>

                </div>

                {/* Local2Brand Agency Footer & Signature Guarantee */}
                <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div><strong>Terms & Conditions:</strong> 1. Goods once prepared cannot be cancelled. 2. Subject to Local Jurisdiction.</div>
                    <div>Digital Restaurant Platform Developed & Managed by <strong>Local2Brand Agency</strong> (www.local2brand.com)</div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg border border-slate-300 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div className="text-left">
                      <div className="font-bold text-slate-800 text-[10px] leading-none">Local2Brand Certified</div>
                      <div className="text-[9px] text-slate-500">Authentic E-Invoice</div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* 80mm THERMAL RECEIPT WITH AGENCY BRANDING */
              <div className="space-y-3 leading-tight">
                <div className="text-center space-y-1 border-b border-black pb-2">
                  <div className="font-bold text-sm uppercase">{activeRestaurant.name}</div>
                  <div className="text-[9px]">{activeRestaurant.address}</div>
                  <div className="text-[9px]">FSSAI Lic: 12821013000492 • GSTIN: 19AABCU9603R1ZM</div>
                  <div className="font-bold text-xs pt-1">*** KITCHEN ORDER TICKET (KOT) ***</div>
                </div>

                <div className="flex justify-between text-[10px] font-bold">
                  <span>TOKEN: #{order.id}</span>
                  <span>TYPE: {order.orderType?.toUpperCase()}</span>
                </div>
                <div className="text-[10px]">
                  GUEST: {order.customer?.name} ({order.customer?.phone})
                </div>

                <div className="border-t border-b border-black py-1.5 space-y-1.5">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <div>
                        <span className="font-bold">{it.quantity}x</span> {it.name}
                        {it.variant && <div className="text-[9px] pl-3">({it.variant})</div>}
                        {it.addons && it.addons.length > 0 && (
                          <div className="text-[9px] pl-3">+ {it.addons.join(', ')}</div>
                        )}
                      </div>
                      <span className="font-bold">{it.total}</span>
                    </div>
                  ))}
                </div>

                {order.kitchenNotes && (
                  <div className="border-b border-black pb-1 text-[10px]">
                    <span className="font-bold">CHEF NOTES:</span> {order.kitchenNotes}
                  </div>
                )}

                <div className="space-y-0.5 text-right font-bold text-xs">
                  <div>TOTAL: {activeRestaurant.currency}{order.total}</div>
                  <div className="text-[9px] font-normal">PAYMENT: {order.paymentMethod?.toUpperCase()}</div>
                </div>

                <div className="text-center text-[9px] pt-2 border-t border-black space-y-0.5">
                  <div>*** SERVE FRESH & STEAMING HOT ***</div>
                  <div className="text-[8px] text-slate-700">POS Powered by Local2Brand Agency</div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
