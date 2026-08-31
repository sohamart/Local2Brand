import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { COUPONS } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { FadeIn, FadeInStagger, FadeInStaggerItem } from '../../components/common/MotionWrapper';
import { Tag, Copy, Check, Sparkles, Percent, Gift, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OffersPage = () => {
  const { activeRestaurant } = useTenant();
  const { applyCouponCode, setIsCartOpen } = useCart();
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopyAndApply = (code) => {
    navigator.clipboard.writeText(code);
    applyCouponCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07080c] pb-24 space-y-12">
      <PageHeader
        title="Festive Privileges & Promo Vault"
        subtitle="Claim exclusive gourmet savings, seasonal feast discounts, and celebratory banquet codes."
        badge="Exclusive Privileges"
        breadcrumbs={[{ label: 'Offers & Coupons' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Active Promo Codes Grid */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COUPONS.map((coupon) => (
            <FadeInStaggerItem key={coupon.id}>
              <div className="glass-panel-gold p-6 rounded-3xl border border-amber-500/30 space-y-4 shadow-xl flex flex-col justify-between h-full group hover:border-amber-400 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Tag className="w-5 h-5" />
                      <span className="font-mono font-bold text-lg tracking-wider">{coupon.code}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                      Active
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white leading-tight">
                    {coupon.description}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Minimum Order:</span>
                      <strong className="text-white">{activeRestaurant.currency}{coupon.minOrder}</strong>
                    </div>
                    {coupon.maxDiscount && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max Discount:</span>
                        <strong className="text-amber-400">{activeRestaurant.currency}{coupon.maxDiscount}</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Validity:</span>
                      <strong className="text-slate-300">{coupon.expiresAt}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => handleCopyAndApply(coupon.code)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-gold-glow hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                  >
                    {copiedCode === coupon.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode === coupon.code ? 'Applied to Cart!' : 'Copy & Apply'}</span>
                  </button>
                </div>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

        {/* Loyalty Rewards Multiplier Showcase */}
        <FadeIn>
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Gift className="w-6 h-6" />
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
                  Join The Imperial Club & Earn 10% Back
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Earn 10 loyalty points on every ₹100 spent across dining and delivery. Redeem points directly for instant bill deductions at checkout.
              </p>
              <Link
                to="/account"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all"
              >
                <span>View My Loyalty Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-amber-400 font-bold text-xl">10 Pts / ₹100</div>
                <div className="text-xs text-slate-400">Auto Credit</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-emerald-400 font-bold text-xl">Instant Cash</div>
                <div className="text-xs text-slate-400">Zero Expiry Date</div>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
};
