import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Copy,
  Check,
  ArrowRight,
  Flame,
  Award,
  Zap,
  RotateCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import AshokaChakra from './AshokaChakra';

const PRIZES = [
  {
    id: 1,
    label: '20% OFF',
    subLabel: 'Launch Voucher',
    code: 'INDIA2025',
    discountPercent: 20,
    color: '#8b5cf6', // Violet
    textColor: '#ffffff',
    icon: Flame,
  },
  {
    id: 2,
    label: '₹1,000 OFF',
    subLabel: 'Flat Cash Discount',
    code: 'LOCAL1000',
    discountPercent: 15,
    color: '#ec4899', // Pink
    textColor: '#ffffff',
    icon: Gift,
  },
  {
    id: 3,
    label: 'FREE .IN Domain',
    subLabel: '1-Year Included',
    code: 'FREEDOMAIN',
    discountPercent: 10,
    color: '#3b82f6', // Blue
    textColor: '#ffffff',
    icon: Award,
  },
  {
    id: 4,
    label: '48h Fast Track',
    subLabel: 'VIP Priority Delivery',
    code: 'FASTL2B',
    discountPercent: 15,
    color: '#10b981', // Emerald
    textColor: '#ffffff',
    icon: Zap,
  },
  {
    id: 5,
    label: '15% OFF',
    subLabel: 'Growth Package',
    code: 'GROWTH15',
    discountPercent: 15,
    color: '#f59e0b', // Amber
    textColor: '#ffffff',
    icon: Sparkles,
  },
  {
    id: 6,
    label: 'Speed & SSL Kit',
    subLabel: 'Lifetime Setup',
    code: 'BOOSTSPEED',
    discountPercent: 10,
    color: '#06b6d4', // Cyan
    textColor: '#ffffff',
    icon: Award,
  },
];

export default function LuckyWheelModal({ isOpen, onClose }) {
  const { settings } = useSiteSettings();
  const { openOrderModal } = useOrderModal();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningPrize, setWinningPrize] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  const canvasRef = useRef(null);

  const totalSlices = PRIZES.length;
  const sliceDeg = 360 / totalSlices;

  // Check if user has already spun the wheel for the current campaign version
  useEffect(() => {
    if (!isOpen) return;
    try {
      const currentCampaign = settings?.luckyWheel?.campaignVersion || 1;
      const spunCampaign = parseInt(localStorage.getItem('l2b_wheel_spun_version') || '0', 10);
      const savedPrize = localStorage.getItem('l2b_won_voucher');

      if (spunCampaign >= currentCampaign && savedPrize) {
        const parsed = JSON.parse(savedPrize);
        setWinningPrize(parsed);
        setHasSpun(true);
      } else {
        // Admin launched a new campaign or user hasn't spun yet
        setHasSpun(false);
        setWinningPrize(null);
      }
    } catch (e) {}
  }, [isOpen, settings?.luckyWheel?.campaignVersion]);


  // Draw the wheel on canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 10;

    ctx.clearRect(0, 0, width, height);

    // Draw slices
    PRIZES.forEach((prize, i) => {
      const startAngle = (i * sliceDeg - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * sliceDeg - 90) * (Math.PI / 180);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Border between slices
      ctx.strokeStyle = '#ffffff30';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Slice Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + (sliceDeg / 2) * (Math.PI / 180));
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.fillText(prize.label, radius - 24, 5);

      ctx.font = '8px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffffcc';
      ctx.fillText(prize.subLabel, radius - 24, 18);
      ctx.restore();
    });

    // Outer rim lights
    const numLights = 24;
    for (let i = 0; i < numLights; i++) {
      const angle = (i * (360 / numLights) - 90) * (Math.PI / 180);
      const x = centerX + (radius + 2) * Math.cos(angle);
      const y = centerY + (radius + 2) * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#ffffff';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    if (hasSpun && winningPrize) {
      toast.info(`You have already claimed your prize: ${winningPrize.label} (${winningPrize.code})!`);
      return;
    }

    setIsSpinning(true);
    setWinningPrize(null);
    setCopied(false);

    // Pick winning slice
    const winningIndex = Math.floor(Math.random() * PRIZES.length);
    const selected = PRIZES[winningIndex];

    // Compute target rotation
    const baseSpins = 6 * 360; // 6 full revolutions
    const sliceMiddleAngle = winningIndex * sliceDeg + sliceDeg / 2;
    const finalAngle = baseSpins + (360 - sliceMiddleAngle);

    setRotation((prev) => prev + finalAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWinningPrize(selected);
      setHasSpun(true);

      // Save won voucher and mark current campaign version as spun permanently
      try {
        const currentCampaign = settings?.luckyWheel?.campaignVersion || 1;
        localStorage.setItem('l2b_wheel_spun_version', String(currentCampaign));
        localStorage.setItem('l2b_wheel_spun', 'true');
        localStorage.setItem('l2b_won_voucher', JSON.stringify(selected));
      } catch (e) {}


      toast.success(`🎉 Congratulations! You won: ${selected.label} (${selected.code})`, {
        icon: '🎁',
        autoClose: 3500
      });

      // Automatically transition directly into AI Chatbot after 2.5 seconds
      setTimeout(() => {
        onClose();
        window.dispatchEvent(new CustomEvent('l2b_open_chatbot_prize', { detail: selected }));
      }, 2500);
    }, 4500);
  };

  const handleCopyCode = async () => {
    if (!winningPrize) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(winningPrize.code);
      }
    } catch (e) {}
    setCopied(true);
    toast.info(`Copied "${winningPrize.code}" to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaimNow = () => {
    if (!winningPrize) return;
    onClose();
    window.dispatchEvent(new CustomEvent('l2b_open_chatbot_prize', { detail: winningPrize }));
  };


  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in select-text modal-touch-scroll"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSpinning) onClose();
      }}
    >
      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-300/50 dark:border-purple-500/30 overflow-hidden flex flex-col items-center p-5 sm:p-7 text-center transition-all"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSpinning}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
          <AshokaChakra size={12} />
          <span>India Launch Exclusive</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {settings?.luckyWheel?.title || '🎡 Spin & Win Website Rewards!'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
          {settings?.luckyWheel?.subtitle || 'Spin the lucky wheel to win instant discounts, free domains, and launch vouchers!'}
        </p>

        {/* Interactive Spinning Wheel Container */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Wheel Pointer Pin at Top Center */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-md">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-amber-400 animate-bounce" />
          </div>

          {/* Glowing Wheel Outer Rim */}
          <div className="p-2 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 shadow-[0_0_35px_rgba(168,85,247,0.35)] relative">
            <div
              className="rounded-full overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="w-[260px] h-[260px] sm:w-[280px] sm:h-[280px] block"
              />
            </div>

            {/* Center Cap Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || (hasSpun && !!winningPrize)}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full text-white font-black text-[11px] uppercase tracking-wider flex flex-col items-center justify-center shadow-lg border-2 border-amber-400 transition-all z-20 ${
                hasSpun && winningPrize
                  ? 'bg-emerald-700 cursor-default opacity-90'
                  : 'bg-slate-900 cursor-pointer hover:scale-105 active:scale-95'
              }`}
            >
              <RotateCw className={`w-4 h-4 text-amber-400 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? '...' : hasSpun && winningPrize ? 'WON 🎁' : 'SPIN'}</span>
            </button>
          </div>
        </div>


        {/* Prize Winner Card Banner */}
        {winningPrize && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-400/40 dark:border-purple-500/30 text-left animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
                  🎉 YOU WON
                </span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {winningPrize.label}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                {winningPrize.subLabel}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Coupon Code:</span>
                <strong className="font-mono text-sm text-purple-600 dark:text-purple-400 font-black tracking-wider">
                  {winningPrize.code}
                </strong>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full mt-4 flex flex-col sm:flex-row items-center gap-2.5">
          {winningPrize ? (
            <button
              onClick={handleClaimNow}
              className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
            >
              <span>Apply {winningPrize.code} &amp; Start Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white l2b-gradient-bg shadow-glass-highlight hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning the Wheel...' : 'Spin the Wheel Now 🎡'}</span>
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-400 mt-3">
          1 Spin per visitor • Code valid for all Website Packages • Instant WhatsApp Support Included
        </p>
      </div>
    </div>
  );
}
