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
  RotateCw,
  Trophy,
  Dices,
  Layers,
  Crown
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import AshokaChakra from './AshokaChakra';

const DEFAULT_PRIZES = [
  {
    id: 'prize-1',
    label: '20% OFF Launch Voucher',
    subLabel: 'Flat 20% Discount on any Plan',
    code: 'INDIA2025',
    discountPercent: 20,
    color: '#8b5cf6',
    icon: '🎉',
  },
  {
    id: 'prize-2',
    label: '₹1,000 Flat Discount',
    subLabel: 'Instant ₹1,000 Savings',
    code: 'LOCAL1000',
    discountPercent: 15,
    color: '#ec4899',
    icon: '⚡',
  },
  {
    id: 'prize-3',
    label: 'Free Custom Domain',
    subLabel: '1-Year .com / .in Domain Setup',
    code: 'FREEDOMAIN',
    discountPercent: 10,
    color: '#06b6d4',
    icon: '🌐',
  },
  {
    id: 'prize-4',
    label: 'VIP Priority 48h Turnaround',
    subLabel: 'Express Delivery in 48 Hours',
    code: 'EXPRESS48',
    discountPercent: 15,
    color: '#10b981',
    icon: '🚀',
  },
  {
    id: 'prize-5',
    label: 'Free SSL + Cloudflare CDN',
    subLabel: 'Lifetime Enterprise Security',
    code: 'SECURE2025',
    discountPercent: 10,
    color: '#f59e0b',
    icon: '🛡️',
  },
  {
    id: 'prize-6',
    label: '15% OFF Starter Package',
    subLabel: 'Special Starter Pack Savings',
    code: 'STARTER15',
    discountPercent: 15,
    color: '#6366f1',
    icon: '✨',
  },
];

export default function LuckyWheelModal({ isOpen, onClose }) {
  const { settings } = useSiteSettings();
  const { openOrderModal } = useOrderModal();

  const gameMode = settings?.luckyWheel?.activeGame || 'wheel'; // 'wheel' | 'slots' | 'boxes' | 'scratch'
  const prizes = Array.isArray(settings?.luckyWheel?.prizes) && settings.luckyWheel.prizes.length > 0
    ? settings.luckyWheel.prizes
    : DEFAULT_PRIZES;

  const [isPlaying, setIsPlaying] = useState(false);
  const [winningPrize, setWinningPrize] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Wheel State
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);

  // Slots State
  const [slotReels, setSlotReels] = useState(['🎁', '⚡', '🎉']);
  const [isSlotSpinning, setIsSlotSpinning] = useState(false);

  // Boxes State
  const [selectedBoxIdx, setSelectedBoxIdx] = useState(null);

  // Scratch State
  const scratchCanvasRef = useRef(null);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);

  // Check if user has already played for current campaign version
  useEffect(() => {
    if (!isOpen) return;
    try {
      const currentCampaign = settings?.luckyWheel?.campaignVersion || 1;
      const spunCampaign = parseInt(localStorage.getItem('l2b_wheel_spun_version') || '0', 10);
      const savedPrize = localStorage.getItem('l2b_won_voucher');

      if (spunCampaign >= currentCampaign && savedPrize) {
        const parsed = JSON.parse(savedPrize);
        setWinningPrize(parsed);
        setHasPlayed(true);
      } else {
        setHasPlayed(false);
        setWinningPrize(null);
        setSelectedBoxIdx(null);
        setScratchPercent(0);
      }
    } catch (e) {}
  }, [isOpen, settings?.luckyWheel?.campaignVersion]);

  // Award prize and transition
  const handleAwardPrize = (selected) => {
    setWinningPrize(selected);
    setHasPlayed(true);

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

    setTimeout(() => {
      onClose();
      window.dispatchEvent(new CustomEvent('l2b_open_chatbot_prize', { detail: selected }));
    }, 2800);
  };

  // --- GAME 1: WHEEL DRAWING & SPIN ---
  const totalSlices = prizes.length;
  const sliceDeg = 360 / totalSlices;

  useEffect(() => {
    if (!isOpen || gameMode !== 'wheel') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2;
    const sliceRad = (2 * Math.PI) / totalSlices;

    ctx.clearRect(0, 0, width, height);

    prizes.forEach((prize, i) => {
      const angle = i * sliceRad;

      ctx.beginPath();
      ctx.fillStyle = prize.color || '#8b5cf6';
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 8, angle, angle + sliceRad);
      ctx.lineTo(radius, radius);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = '#ffffff30';
      ctx.lineWidth = 2;
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius - 8, angle, angle + sliceRad);
      ctx.stroke();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angle + sliceRad / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';

      ctx.font = 'bold 12px Inter, system-ui, sans-serif';
      ctx.fillText(prize.icon ? `${prize.icon} ${prize.label.slice(0, 14)}` : prize.label.slice(0, 14), radius - 24, 4);

      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(radius, radius, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();
  }, [isOpen, gameMode, prizes, totalSlices]);

  const handleSpinWheel = () => {
    if (isPlaying || hasPlayed) return;
    setIsPlaying(true);

    const winIdx = Math.floor(Math.random() * prizes.length);
    const selected = prizes[winIdx];
    const sliceAngle = 360 / prizes.length;
    const stopAngle = 360 - (winIdx * sliceAngle + sliceAngle / 2);
    const totalSpins = 360 * 5;
    const finalAngle = totalSpins + stopAngle;

    setRotation((prev) => prev + finalAngle);

    setTimeout(() => {
      setIsPlaying(false);
      handleAwardPrize(selected);
    }, 4500);
  };

  // --- GAME 2: SLOTS PLAY ---
  const handlePlaySlots = () => {
    if (isPlaying || hasPlayed) return;
    setIsPlaying(true);
    setIsSlotSpinning(true);

    const selected = prizes[Math.floor(Math.random() * prizes.length)];
    const targetIcon = selected.icon || '🎉';
    const iconsPool = ['🎁', '⚡', '🎉', '🚀', '👑', '💎', '🔥', '✨'];

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setSlotReels([
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
      ]);

      if (count > 25) {
        clearInterval(interval);
        setSlotReels([targetIcon, targetIcon, targetIcon]); // Jackpot Triple Match!
        setIsSlotSpinning(false);
        setIsPlaying(false);
        handleAwardPrize(selected);
      }
    }, 100);
  };

  // --- GAME 3: MYSTERY BOXES PICK ---
  const handlePickBox = (boxIdx) => {
    if (isPlaying || hasPlayed || selectedBoxIdx !== null) return;
    setSelectedBoxIdx(boxIdx);
    setIsPlaying(true);

    const selected = prizes[boxIdx % prizes.length] || prizes[0];

    setTimeout(() => {
      setIsPlaying(false);
      handleAwardPrize(selected);
    }, 1200);
  };

  // --- GAME 4: SCRATCHCARD REVEAL ---
  useEffect(() => {
    if (!isOpen || gameMode !== 'scratch' || hasPlayed) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Draw gold foil overlay
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(0.5, '#fbbf24');
    gradient.addColorStop(1, '#d97706');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to Reveal VIP Voucher ✨', w / 2, h / 2 + 5);
  }, [isOpen, gameMode, hasPlayed]);

  const handleScratchMove = (e) => {
    if (hasPlayed || isPlaying) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (!clientX || !clientY) return;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    setScratchPercent((prev) => {
      const next = prev + 4;
      if (next >= 45 && !hasPlayed && !isPlaying) {
        setIsPlaying(true);
        const selected = prizes[Math.floor(Math.random() * prizes.length)];
        setTimeout(() => {
          setIsPlaying(false);
          handleAwardPrize(selected);
        }, 500);
      }
      return next;
    });
  };

  const handleCopyCode = async () => {
    if (!winningPrize) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(winningPrize.code);
      }
      setCopied(true);
      toast.info(`Coupon code "${winningPrize.code}" copied!`);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-500/50 dark:border-cyan-500/50 shadow-2xl overflow-hidden p-5 sm:p-7 flex flex-col items-center text-center">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gradient-to-b from-purple-500/25 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="mb-4 space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Launch Rewards</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {settings?.luckyWheel?.title || 'Interactive Rewards & Launch Gifts'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {settings?.luckyWheel?.subtitle || 'Play our interactive launch game to win instant discounts, free domains, and launch vouchers!'}
          </p>
        </div>

        {/* -------------------- GAME VIEWPORT -------------------- */}

        {/* 1. WHEEL GAME */}
        {gameMode === 'wheel' && (
          <div className="relative my-2 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
            {/* Top Pointer Arrow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-2">
              <div className="w-5 h-7 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-lg shadow-lg border-2 border-white dark:border-slate-900 flex items-end justify-center pb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping" />
              </div>
            </div>

            {/* Canvas Wheel */}
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isPlaying ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
              }}
              className="w-full h-full rounded-full shadow-2xl border-4 border-amber-400"
            />

            {/* Center Spin Button */}
            <button
              type="button"
              onClick={handleSpinWheel}
              disabled={isPlaying || hasPlayed}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase shadow-xl flex flex-col items-center justify-center gap-0.5 border-2 border-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-80 z-20 cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>{isPlaying ? 'Spinning' : 'SPIN'}</span>
            </button>
          </div>
        )}

        {/* 2. LAS VEGAS SLOTS GAME */}
        {gameMode === 'slots' && (
          <div className="my-4 w-full max-w-sm space-y-4">
            <div className="p-4 rounded-3xl bg-slate-950 border-4 border-amber-400 shadow-2xl flex items-center justify-center gap-3">
              {slotReels.map((icon, idx) => (
                <div
                  key={idx}
                  className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-300/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner overflow-hidden"
                >
                  <span className={`transform ${isSlotSpinning ? 'animate-bounce' : 'scale-105 transition-transform'}`}>
                    {icon}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePlaySlots}
              disabled={isPlaying || hasPlayed}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:opacity-95 shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Dices className="w-5 h-5" />
              <span>{isPlaying ? '🎰 Spinning Reels...' : 'Pull Lever & Spin Reels 🎰'}</span>
            </button>
          </div>
        )}

        {/* 3. MYSTERY GIFT BOXES GAME */}
        {gameMode === 'boxes' && (
          <div className="my-3 w-full max-w-sm space-y-3">
            <p className="text-xs font-bold text-purple-600 dark:text-cyan-400 uppercase tracking-wider">
              Pick Any 1 Mystery Gift Box to Reveal Your Prize!
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const isPicked = selectedBoxIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePickBox(idx)}
                    disabled={isPlaying || hasPlayed}
                    className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isPicked
                        ? 'bg-gradient-to-tr from-amber-400 to-pink-500 border-amber-300 text-white scale-105 shadow-xl animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:scale-105 text-slate-700 dark:text-white'
                    }`}
                  >
                    <Gift className={`w-8 h-8 ${isPicked ? 'animate-bounce text-white' : 'text-purple-600 dark:text-cyan-400'}`} />
                    <span className="text-[10px] font-black uppercase">Box #{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. GOLDEN SCRATCHCARD GAME */}
        {gameMode === 'scratch' && (
          <div className="my-3 w-full max-w-sm space-y-3">
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex flex-col items-center justify-center text-white p-4 select-none">
              <Trophy className="w-10 h-10 text-amber-300 animate-bounce mb-1" />
              <span className="text-xs font-black uppercase tracking-wider">🎉 VIP LAUNCH REWARD</span>
              <span className="text-xl font-black">{winningPrize?.label || '20% OFF Launch Voucher'}</span>
              <span className="font-mono text-sm font-black bg-white/20 px-3 py-1 rounded-lg mt-1 border border-white/30">
                {winningPrize?.code || 'INDIA2025'}
              </span>

              {/* Scratchable Canvas Foil */}
              {!hasPlayed && (
                <canvas
                  ref={scratchCanvasRef}
                  width={380}
                  height={176}
                  onMouseMove={handleScratchMove}
                  onTouchMove={handleScratchMove}
                  className="absolute inset-0 w-full h-full cursor-crosshair z-20 touch-none"
                />
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              💡 Move your cursor or swipe your finger across the golden card to scrape away the foil!
            </p>
          </div>
        )}

        {/* -------------------- WINNING REWARD CARD -------------------- */}
        {winningPrize && (
          <div className="w-full mt-3 p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-amber-500/15 border-2 border-purple-400/50 shadow-md space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                🎉 Won Reward
              </span>
              <span className="font-mono text-xs font-black text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-purple-300 dark:border-purple-700">
                {winningPrize.code}
              </span>
            </div>

            <div className="text-left">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {winningPrize.label}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {winningPrize.subLabel || 'Use this promo voucher on your website proposal!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyCode}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openOrderModal({
                    promoCode: winningPrize.code,
                    discountPercent: winningPrize.discountPercent || 20,
                    autoApplyOffer: true,
                    websiteType: `Won Prize: ${winningPrize.label} (Code: ${winningPrize.code})`,
                    initialRequirements: `I won the reward "${winningPrize.label}" with promo code "${winningPrize.code}". Please apply this discount to my website project!`,
                  });
                }}
                className="py-2.5 px-3 rounded-xl text-xs font-black text-white l2b-gradient-bg shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Apply Voucher</span>
              </button>
            </div>
          </div>
        )}

        {hasPlayed && !isPlaying && (
          <span className="text-[10px] text-slate-400 mt-2 block">
            🔒 You have claimed your reward for this campaign round.
          </span>
        )}
      </div>
    </div>
  );
}
