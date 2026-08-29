import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Bike, 
  Home, 
  Phone, 
  MapPin, 
  Receipt, 
  AlertCircle,
  RefreshCw,
  Printer,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

const KITCHEN_STAMPS = [
  { key: 'received', stampNum: '01', title: 'TICKET FIRED', desc: 'Received & routed to tandoor chef' },
  { key: 'preparing', stampNum: '02', title: 'IN TANDOOR', desc: 'Charcoal grilled & slow-dum simmering' },
  { key: 'out_for_delivery', stampNum: '03', title: 'ON THE ROAD', desc: 'Rider dispatched with thermal box' },
  { key: 'delivered', stampNum: '04', title: 'DELIVERED', desc: 'Plated & served at your table' }
];

export default function OrderTrackerModal({ orderId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [driverProgress, setDriverProgress] = useState(38);

  const fetchTracking = async () => {
    if (!orderId) return;
    try {
      const res = await api.trackOrder(orderId);
      setData(res);
      setError('');
    } catch (err) {
      setError('Kitchen ticket not found. Please verify code.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (data?.order?.order_status === 'out_for_delivery') {
      const moveInterval = setInterval(() => {
        setDriverProgress(prev => (prev >= 88 ? 32 : prev + 6));
      }, 2000);
      return () => clearInterval(moveInterval);
    } else if (data?.order?.order_status === 'delivered') {
      setDriverProgress(100);
    }
  }, [data?.order?.order_status]);

  if (!orderId) return null;

  const order = data?.order;
  const restaurant = data?.restaurant;

  const getStageIndex = () => {
    if (!order) return 0;
    if (order.order_status === 'cancelled') return -1;
    const idx = KITCHEN_STAMPS.findIndex(s => s.key === order.order_status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIdx = getStageIndex();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div 
        className="relative w-full max-w-2xl my-3 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Controls */}
        <div className="flex items-center justify-between mb-3 px-2 text-xs font-mono text-[#A9865A]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D8632C] animate-pulse"></span>
            <span className="text-[#F3E9D8] uppercase tracking-wider">Kitchen Telemetry Feed</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 px-3 rounded-lg bg-[#231d19] border border-[#A9865A]/40 text-[#F3E9D8] hover:text-[#E8AC4E] flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print KOT</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#231d19] border border-[#A9865A]/40 text-[#D6C8B2] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Physical Printing Kitchen KOT / Thermal Ticket */}
        <div className="kitchen-ticket rounded-2xl overflow-hidden shadow-2xl ticket-feed-enter">
          
          {/* Top Serrated Edge */}
          <div className="ticket-edge-top"></div>

          {/* Ticket Header */}
          <div className="p-6 sm:p-8 border-b-2 border-dashed border-[#A9865A]/40 text-center font-mono space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#D8632C]">
              <Flame className="w-5 h-5 fill-[#D8632C]" />
              <span className="font-bold text-sm tracking-widest uppercase">L'AMOUR KITCHEN KOT</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171310]">
              TICKET #{orderId}
            </h2>
            
            <div className="text-xs text-[#524438] flex flex-wrap items-center justify-center gap-3 pt-1">
              <span>TABLE / RIDER DISPATCH</span>
              <span>•</span>
              <span>{order ? new Date(order.created_at).toLocaleTimeString() : 'NOW'}</span>
              <span>•</span>
              <span className="font-bold text-[#D8632C] uppercase">{order?.payment_method || 'ONLINE'}</span>
            </div>
          </div>

          {/* Body Content */}
          {loading ? (
            <div className="p-12 text-center font-mono">
              <div className="w-8 h-8 border-3 border-[#D8632C] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-[#524438]">Printing ticket & reading thermal sensors...</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center font-mono">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-[#171310]">{error}</p>
            </div>
          ) : (
            <div className="p-6 sm:p-8 space-y-6 font-mono">
              
              {/* ETA & Driver Banner */}
              <div className="p-4 rounded-xl bg-[#ede1ce] border border-[#D6C8B2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#524438] uppercase font-bold tracking-wider block">Estimated Drop Time</span>
                  <span className="text-xl font-bold text-[#171310]">
                    {order.order_status === 'delivered' ? 'DELIVERED TO DESTINATION' : (order.estimated_delivery_time || '30-40 mins')}
                  </span>
                  <p className="text-[11px] text-[#524438] truncate max-w-xs mt-0.5">{order.delivery_address}</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-[#D6C8B2] shrink-0">
                  <div className="text-xs">
                    <span className="font-bold text-[#171310] block">{order.driver_name || 'Vikram Express'}</span>
                    <span className="text-[10px] text-[#524438]">Rider In Charge</span>
                  </div>
                  <a
                    href={`tel:${order.driver_phone || '+919830055443'}`}
                    className="p-1.5 rounded bg-[#D8632C] text-[#171310] font-bold text-xs"
                    title="Call Rider"
                  >
                    <Phone className="w-3.5 h-3.5 fill-[#171310]" />
                  </a>
                </div>
              </div>

              {/* Thermal Printer Stamped Line Steps */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] text-[#524438] uppercase tracking-wider font-bold block">
                  Kitchen Execution Milestones
                </span>

                <div className="space-y-2.5">
                  {KITCHEN_STAMPS.map((stamp, idx) => {
                    const isDone = currentStageIdx >= idx;
                    const isCurrent = currentStageIdx === idx;

                    return (
                      <div
                        key={stamp.key}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-[#171310] text-[#F3E9D8] border-[#171310] shadow-md'
                            : isDone
                            ? 'bg-white border-[#33402E] text-[#171310]'
                            : 'bg-transparent border-dashed border-[#D6C8B2] text-[#8a7565] opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                            isCurrent ? 'bg-[#D8632C] text-[#171310]' : isDone ? 'bg-[#33402E] text-[#92b584]' : 'bg-[#ede1ce] text-[#8a7565]'
                          }`}>
                            {stamp.stampNum}
                          </span>
                          <div>
                            <span className="font-bold text-xs block">{stamp.title}</span>
                            <span className={`text-[10px] ${isCurrent ? 'text-[#D6C8B2]' : 'text-[#524438]'}`}>{stamp.desc}</span>
                          </div>
                        </div>

                        {isDone && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            isCurrent ? 'bg-[#D8632C] text-[#171310] border-[#D8632C]' : 'bg-[#33402E] text-[#92b584] border-[#33402E]'
                          }`}>
                            {isCurrent ? 'ACTIVE' : 'DONE'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stylized Char & Brass Live Route Radar */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#171310] border border-[#231d19] p-4 flex flex-col justify-between text-[#F3E9D8]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E8AC4E_1px,transparent_1px)] [background-size:14px_14px]"></div>
                
                {/* Road Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-[#A9865A]/40" strokeWidth="2.5" strokeDasharray="4 4">
                  <path d="M 40 110 Q 180 40 340 90 T 560 60" fill="none" />
                </svg>

                {/* Origin Restaurant */}
                <div className="relative z-10 flex items-center gap-1.5 text-[10px] text-[#A9865A] bg-[#231d19]/90 px-2 py-1 rounded w-max border border-[#A9865A]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D8632C] animate-ping"></span>
                  <span>{restaurant?.name || "L'Amour Tandoor"}</span>
                </div>

                {/* Animated Rider Marker */}
                <div 
                  className="absolute z-20 transition-all duration-1000 flex items-center gap-1 bg-[#171310] px-2 py-0.5 rounded-full border border-[#D8632C] shadow-lg text-[10px] text-[#E8AC4E]"
                  style={{
                    left: `${driverProgress}%`,
                    top: `${35 + Math.sin(driverProgress / 8) * 12}%`
                  }}
                >
                  <Bike className="w-3.5 h-3.5 text-[#D8632C]" />
                  <span className="font-bold">Rider</span>
                </div>

                {/* Destination */}
                <div className="relative z-10 self-end flex items-center gap-1 text-[10px] text-[#92b584] bg-[#231d19]/90 px-2 py-1 rounded border border-[#33402E]">
                  <MapPin className="w-3 h-3 text-[#92b584]" />
                  <span className="truncate max-w-[120px]">{order.delivery_address}</span>
                </div>
              </div>

              {/* Plated Dishes List */}
              <div className="pt-2 border-t-2 border-dashed border-[#A9865A]/30 text-xs space-y-2">
                <span className="text-[10px] text-[#524438] uppercase font-bold tracking-wider block">
                  Items Fired On Ticket
                </span>

                <div className="divide-y divide-[#D6C8B2]/50">
                  {order.items && order.items.map((i, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span>{i.name} <strong>×{i.quantity}</strong></span>
                      <span className="font-bold">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#D6C8B2] flex justify-between font-bold text-sm text-[#171310]">
                  <span>TOTAL CHARGED</span>
                  <span className="text-[#D8632C]">₹{order.total}</span>
                </div>
              </div>

            </div>
          )}

          {/* Bottom Serrated Edge */}
          <div className="ticket-edge-bottom"></div>

        </div>

      </div>
    </div>
  );
}
