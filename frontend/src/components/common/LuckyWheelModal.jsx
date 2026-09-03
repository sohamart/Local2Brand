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
  Crown,
  Volume2,
  VolumeX,
  Star
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useOrderModal } from '../../context/OrderModalContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
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

// High-Performance Web Audio Synthesizer for Arcade Sounds
function playSound(type, soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'lever') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'slot_roll') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'unbox') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'scratch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600 + Math.random() * 500, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
      });
    }
  } catch (e) {}
}

export default function LuckyWheelModal({ isOpen, onClose }) {
  const { settings } = useSiteSettings();
  const { openOrderModal } = useOrderModal();
  const { user } = useAuth();

  const gameMode = settings?.luckyWheel?.activeGame || 'wheel'; // 'wheel' | 'slots' | 'boxes' | 'scratch'
  const prizes = Array.isArray(settings?.luckyWheel?.prizes) && settings.luckyWheel.prizes.length > 0
    ? settings.luckyWheel.prizes
    : DEFAULT_PRIZES;

  const [isPlaying, setIsPlaying] = useState(false);
  const [winningPrize, setWinningPrize] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Wheel State
  const [rotation, setRotation] = useState(0);
  const [pointerWiggle, setPointerWiggle] = useState(false);
  const wheelCanvasRef = useRef(null);

  // Slots State
  const [slotReels, setSlotReels] = useState(['🎁', '⚡', '🎉']);
  const [leverPulled, setLeverPulled] = useState(false);

  // Boxes State
  const [openedBoxIdx, setOpenedBoxIdx] = useState(null);

  // Scratch State
  const scratchCanvasRef = useRef(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const isScratchRevealedRef = useRef(false);

  // Check storage on campaign version
  useEffect(() => {
    if (!isOpen) return;
    try {
      const currentCampaign = settings?.luckyWheel?.campaignVersion || 1;
      const spunCampaign = parseInt(localStorage.getItem('l2b_wheel_spun_version') || '0', 10);
      const wonData = localStorage.getItem('l2b_won_voucher');

      if (spunCampaign >= currentCampaign && wonData) {
        setHasPlayed(true);
        setWinningPrize(JSON.parse(wonData));
      } else {
        setHasPlayed(false);
        setWinningPrize(null);
        setOpenedBoxIdx(null);
        setScratchedPercent(0);
        isScratchRevealedRef.current = false;
      }
    } catch (e) {}
  }, [isOpen, settings?.luckyWheel?.campaignVersion]);

  // Handle Win Completion
  const handleAwardPrize = (prize) => {
    setWinningPrize(prize);
    setHasPlayed(true);
    setIsPlaying(false);

    try {
      const currentCampaign = settings?.luckyWheel?.campaignVersion || 1;
      localStorage.setItem('l2b_wheel_spun_version', currentCampaign.toString());
      localStorage.setItem('l2b_wheel_spun', 'true');
      localStorage.setItem('l2b_won_voucher', JSON.stringify(prize));
    } catch (e) {}

    playSound('fanfare', soundEnabled);

    // If user is logged in, send win reward email notification!
    if (user && user.email) {
      api.post('/auth/claim-reward-email', { prize })
        .then(() => {
          toast.info(`🎉 A copy of your ${prize.code} voucher was emailed to ${user.email}!`, {
            autoClose: 5000,
          });
        })
        .catch((err) => {
          console.warn('Could not send reward email notification:', err?.message);
        });
    }

    // Broadcast win to Assistant Chatbot
    try {
      window.dispatchEvent(
        new CustomEvent('l2b_open_chatbot_prize', {
          detail: prize,
        })
      );
    } catch (err) {}
  };


  // ----------------------------------------------------
  // GAME 1: 3D CASINO LUCKY PRIZE WHEEL
  // ----------------------------------------------------
  useEffect(() => {
    if (gameMode !== 'wheel' || !isOpen || !wheelCanvasRef.current) return;
    const canvas = wheelCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 16;
    const numSegments = prizes.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Outer Golden Bezel
    const bezelGrad = ctx.createRadialGradient(centerX, centerY, radius - 4, centerX, centerY, radius + 14);
    bezelGrad.addColorStop(0, '#78350f');
    bezelGrad.addColorStop(0.3, '#fbbf24');
    bezelGrad.addColorStop(0.7, '#fef08a');
    bezelGrad.addColorStop(1, '#92400e');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 12, 0, 2 * Math.PI);
    ctx.fillStyle = bezelGrad;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 2. Draw 16 Outer LED Studs
    const numStuds = 16;
    for (let i = 0; i < numStuds; i++) {
      const studAngle = (i * (2 * Math.PI)) / numStuds;
      const studX = centerX + (radius + 6) * Math.cos(studAngle);
      const studY = centerY + (radius + 6) * Math.sin(studAngle);
      ctx.beginPath();
      ctx.arc(studX, studY, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#fef08a';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 3. Draw Colored Segments
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    prizes.forEach((prize, index) => {
      const startAngle = index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Metallic Radial Gradient on each slice
      const sliceGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
      sliceGrad.addColorStop(0, '#ffffff');
      sliceGrad.addColorStop(0.15, prize.color || '#8b5cf6');
      sliceGrad.addColorStop(1, '#1e1035');
      ctx.fillStyle = sliceGrad;
      ctx.fill();

      // Slice Golden Divider Lines
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw Slice Text & Emoji
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 4;

      const displayLabel = prize.label.length > 18 ? prize.label.substring(0, 17) + '…' : prize.label;
      ctx.fillText(`${prize.icon || '🎁'} ${displayLabel}`, radius - 20, 4);
      ctx.restore();
    });

    ctx.restore();

    // 4. Draw Center 3D Gold Hub
    const hubGrad = ctx.createRadialGradient(centerX - 4, centerY - 4, 2, centerX, centerY, 30);
    hubGrad.addColorStop(0, '#fef08a');
    hubGrad.addColorStop(0.5, '#f59e0b');
    hubGrad.addColorStop(1, '#78350f');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = hubGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e1b4b';
    ctx.fill();

    // Small Gold Star in Center
    ctx.fillStyle = '#fbbf24';
    ctx.font = '16px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', centerX, centerY + 1);

  }, [rotation, prizes, gameMode, isOpen]);

  const spinWheel = () => {
    if (isPlaying || hasPlayed) return;
    setIsPlaying(true);

    const winningIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[winningIndex];

    const numSegments = prizes.length;
    const segmentAngle = 360 / numSegments;
    const targetSliceAngle = 270 - (winningIndex * segmentAngle + segmentAngle / 2);
    const fullSpins = 360 * 6; // 6 dramatic full revolutions
    const totalRotation = fullSpins + targetSliceAngle;

    const startTime = performance.now();
    const duration = 4800; // 4.8s physics deceleration
    let lastTickAngle = 0;

    const animateWheel = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic Deceleration Curve
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentRotation = easeOut * totalRotation;
      setRotation(currentRotation % 360);

      // Play tick sound whenever crossing segment pin
      if (Math.floor(currentRotation / segmentAngle) !== lastTickAngle) {
        lastTickAngle = Math.floor(currentRotation / segmentAngle);
        playSound('tick', soundEnabled);
        setPointerWiggle(true);
        setTimeout(() => setPointerWiggle(false), 50);
      }

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        setTimeout(() => {
          handleAwardPrize(selectedPrize);
        }, 300);
      }
    };

    requestAnimationFrame(animateWheel);
  };

  // ----------------------------------------------------
  // GAME 2: 3D LAS VEGAS SLOTS MACHINE
  // ----------------------------------------------------
  const spinSlots = () => {
    if (isPlaying || hasPlayed) return;
    setIsPlaying(true);
    setLeverPulled(true);
    playSound('lever', soundEnabled);
    setTimeout(() => setLeverPulled(false), 400);

    const winningIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[winningIndex];
    const winningIcon = selectedPrize.icon || '🎉';

    const iconsPool = ['🎁', '⚡', '🎉', '🚀', '👑', '💎', '🔥', '✨'];
    let counter = 0;
    const rollInterval = setInterval(() => {
      setSlotReels([
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
      ]);
      playSound('slot_roll', soundEnabled);
      counter++;

      if (counter > 28) {
        clearInterval(rollInterval);
        setSlotReels([winningIcon, winningIcon, winningIcon]);
        setTimeout(() => {
          handleAwardPrize(selectedPrize);
        }, 400);
      }
    }, 90);
  };

  // ----------------------------------------------------
  // GAME 3: 3D MYSTERY GIFT BOXES (UNBOXING)
  // ----------------------------------------------------
  const handleOpenBox = (idx) => {
    if (isPlaying || hasPlayed || openedBoxIdx !== null) return;
    setIsPlaying(true);
    setOpenedBoxIdx(idx);
    playSound('unbox', soundEnabled);

    const winningIndex = idx % prizes.length;
    const selectedPrize = prizes[winningIndex];

    setTimeout(() => {
      handleAwardPrize(selectedPrize);
    }, 1200);
  };

  // ----------------------------------------------------
  // GAME 4: VIP GOLDEN SCRATCHCARD
  // ----------------------------------------------------
  const targetScratchPrizeRef = useRef(prizes[Math.floor(Math.random() * prizes.length)]);

  useEffect(() => {
    if (gameMode !== 'scratch' || !isOpen || !scratchCanvasRef.current) return;
    const canvas = scratchCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw Golden Foil Cover
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#d97706');
    goldGrad.addColorStop(0.25, '#fbbf24');
    goldGrad.addColorStop(0.5, '#fef08a');
    goldGrad.addColorStop(0.75, '#f59e0b');
    goldGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Holographic Foil Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    for (let i = -width; i < width * 2; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Centered Golden Foil Seal
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255,255,255,0.6)';
    ctx.shadowBlur = 6;
    ctx.fillText('✦ VIP GOLDEN REWARD ✦', width / 2, height / 2 - 10);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('Swipe / Scratch Foil to Reveal', width / 2, height / 2 + 12);
    ctx.shadowBlur = 0;
  }, [gameMode, isOpen]);

  const scratchAtPoint = (clientX, clientY) => {
    if (hasPlayed || isScratchRevealedRef.current || !scratchCanvasRef.current) return;
    const canvas = scratchCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, 2 * Math.PI);
    ctx.fill();

    playSound('scratch', soundEnabled);

    // Estimate scratched percentage
    setScratchedPercent((prev) => {
      const next = Math.min(prev + 3.5, 100);
      if (next >= 42 && !isScratchRevealedRef.current) {
        isScratchRevealedRef.current = true;
        // Clear all canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
          handleAwardPrize(targetScratchPrizeRef.current);
        }, 400);
      }
      return next;
    });
  };

  const handleCopyCode = () => {
    if (!winningPrize?.code) return;
    navigator.clipboard.writeText(winningPrize.code);
    setCopied(true);
    toast.success(`Coupon code ${winningPrize.code} copied! 🚀`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyVoucher = () => {
    if (!winningPrize) return;
    onClose();
    openOrderModal({
      promoCode: winningPrize.code,
      discountPercent: winningPrize.discountPercent || 20,
      autoApplyOffer: true,
      websiteType: `Won Prize: ${winningPrize.label} (Code: ${winningPrize.code})`,
      initialRequirements: `I have won the ${winningPrize.label} reward with code "${winningPrize.code}". Please apply this discount to my website project!`,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#0e1628] via-[#090e1c] to-[#060913] text-white rounded-3xl border-2 border-purple-500/50 shadow-[0_0_80px_rgba(168,85,247,0.35)] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500/20 text-amber-300 border border-purple-400/40 shadow-xs">
              <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
            </span>
            <div>
              <h3 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                <span>LOCAL2BRAND REWARDS</span>
                <AshokaChakra size={12} />
              </h3>
              <p className="text-[10px] text-purple-300 font-bold">
                {gameMode === 'wheel' && '🎡 Spin 3D Casino Wheel to Win'}
                {gameMode === 'slots' && '🎰 Las Vegas 3D Jackpot Slots'}
                {gameMode === 'boxes' && '🎁 Pick a 3D Mystery Gift Box'}
                {gameMode === 'scratch' && '🃏 VIP Golden Scratchcard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col items-center justify-center text-center">

          {/* ==================================================== */}
          {/* STATE A: GAME ACTIVE (NOT WON YET)                   */}
          {/* ==================================================== */}
          {!winningPrize && (
            <div className="w-full flex flex-col items-center">

              {/* GAME 1: 3D CASINO WHEEL */}
              {gameMode === 'wheel' && (
                <div className="relative my-2 flex flex-col items-center">
                  {/* Glowing 3D Golden Pointer with ruby jewel tip */}
                  <div
                    className={`absolute -top-3 z-30 transition-transform duration-75 ${
                      pointerWiggle ? '-rotate-12 scale-110' : 'rotate-0'
                    }`}
                  >
                    <div className="w-6 h-8 bg-gradient-to-b from-amber-300 via-amber-500 to-rose-600 rounded-b-full shadow-[0_0_15px_rgba(245,158,11,0.9)] border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-rose-200 shadow-xs" />
                    </div>
                  </div>

                  {/* 3D Wheel Canvas */}
                  <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-500 shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                    <canvas
                      ref={wheelCanvasRef}
                      width={310}
                      height={310}
                      className="rounded-full select-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={spinWheel}
                    disabled={isPlaying}
                    className="mt-5 w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:scale-103 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                    <span>{isPlaying ? 'Spinning Wheel...' : '🎡 SPIN TO WIN 100% PRIZE'}</span>
                  </button>
                </div>
              )}

              {/* GAME 2: LAS VEGAS 3D SLOTS */}
              {gameMode === 'slots' && (
                <div className="w-full my-2 flex flex-col items-center">
                  <div className="relative w-full max-w-[340px] p-4 rounded-3xl bg-gradient-to-b from-amber-500/30 via-slate-900 to-purple-950 border-3 border-amber-400/80 shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                    
                    {/* Flashing Neon Marquee */}
                    <div className="py-1 px-3 mb-4 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md animate-pulse">
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>★ 777 JACKPOT REWARD ★</span>
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    </div>

                    {/* 3 Mechanical Reels */}
                    <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950 border-2 border-amber-500/40 shadow-inner">
                      {slotReels.map((icon, idx) => (
                        <div
                          key={idx}
                          className="h-24 rounded-xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center text-4xl shadow-md transform transition-transform"
                        >
                          <span className={`${isPlaying ? 'animate-bounce blur-[0.5px]' : 'scale-110'} select-none`}>
                            {icon}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 3D Side Pull Lever */}
                    <div
                      onClick={spinSlots}
                      className={`mt-4 cursor-pointer py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-102 active:scale-95 transition-all ${
                        leverPulled ? 'scale-90 bg-amber-600' : ''
                      }`}
                    >
                      <RotateCw className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
                      <span>{isPlaying ? 'Rolling Reels...' : '🎰 PULL LEVER TO SPIN'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 3: 3D MYSTERY GIFT BOXES */}
              {gameMode === 'boxes' && (
                <div className="w-full my-2">
                  <p className="text-xs text-purple-200 font-semibold mb-3">
                    ✨ Tap any glowing 3D box below to unbox your secret reward!
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const isOpened = openedBoxIdx === idx;
                      const boxColors = [
                        'from-purple-600 to-indigo-700',
                        'from-pink-600 to-rose-700',
                        'from-amber-500 to-yellow-600',
                        'from-emerald-600 to-teal-700',
                        'from-cyan-600 to-blue-700',
                        'from-violet-600 to-purple-800',
                      ];

                      return (
                        <div
                          key={idx}
                          onClick={() => handleOpenBox(idx)}
                          className={`relative p-3.5 rounded-2xl bg-gradient-to-b ${boxColors[idx]} border-2 border-white/40 shadow-lg cursor-pointer transform hover:scale-108 hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center group ${
                            isOpened ? 'scale-110 ring-4 ring-amber-300 animate-pulse' : ''
                          }`}
                        >
                          <Gift className={`w-8 h-8 text-white drop-shadow-md group-hover:rotate-12 transition-transform ${isOpened ? 'animate-bounce' : ''}`} />
                          <span className="mt-1 text-[10px] font-black uppercase tracking-wider text-white">
                            {isOpened ? 'UNBOXED!' : `BOX #${idx + 1}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* GAME 4: VIP GOLDEN SCRATCHCARD */}
              {gameMode === 'scratch' && (
                <div className="w-full my-2 flex flex-col items-center">
                  <p className="text-xs text-purple-200 font-semibold mb-2">
                    🃏 Scratch the golden card below with your finger or mouse!
                  </p>

                  <div className="relative w-[300px] h-[160px] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-amber-400">
                    
                    {/* Underlying Prize Card */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-3xl">{targetScratchPrizeRef.current.icon || '🎉'}</span>
                      <span className="text-xs font-black text-amber-300 mt-1">
                        {targetScratchPrizeRef.current.label}
                      </span>
                      <span className="text-[10px] text-purple-200 font-bold">
                        Code: {targetScratchPrizeRef.current.code}
                      </span>
                    </div>

                    {/* Canvas Scratch Foil Layer */}
                    <canvas
                      ref={scratchCanvasRef}
                      width={300}
                      height={160}
                      onMouseDown={() => setIsScratching(true)}
                      onMouseUp={() => setIsScratching(false)}
                      onMouseMove={(e) => {
                        if (isScratching) scratchAtPoint(e.clientX, e.clientY);
                      }}
                      onTouchMove={(e) => {
                        const touch = e.touches[0];
                        if (touch) scratchAtPoint(touch.clientX, touch.clientY);
                      }}
                      className="absolute inset-0 cursor-crosshair touch-none"
                    />
                  </div>

                  {/* Scratched Progress Meter */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{Math.round(scratchedPercent)}% Scratched</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* STATE B: VICTORY REWARD SCREEN                       */}
          {/* ==================================================== */}
          {winningPrize && (
            <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
              
              {/* Golden Trophy Crown Badge */}
              <div className="relative my-2">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(245,158,11,0.8)] border-2 border-white animate-bounce">
                  {winningPrize.icon || '🎉'}
                </div>
                <span className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                </span>
              </div>

              <h2 className="text-xl font-black text-white mt-1">
                🎉 Congratulations!
              </h2>
              <p className="text-xs text-purple-200 font-semibold mt-0.5">
                You just won the exclusive launch prize:
              </p>

              {/* Holographic Glowing Voucher Card */}
              <div className="my-4 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border-2 border-purple-400/60 shadow-xl flex flex-col items-center">
                <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                  {winningPrize.label}
                </span>
                <span className="text-[11px] text-slate-300 mt-0.5">
                  {winningPrize.subLabel || 'Exclusive Client Launch Reward'}
                </span>

                {/* Coupon Code Pill */}
                <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-purple-400/40 w-full justify-between">
                  <span className="font-mono font-black text-sm text-emerald-400 tracking-wider">
                    {winningPrize.code}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡ Apply Voucher to Website Specification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
