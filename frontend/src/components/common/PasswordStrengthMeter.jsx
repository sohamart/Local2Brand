import React from 'react';
import { Check, X, Shield, ShieldCheck, Zap } from 'lucide-react';

export function calculatePasswordStrength(pass = '') {
  const password = String(pass || '');
  let score = 0;

  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  if (checks.length) score += 1;
  if (checks.hasUpper && checks.hasLower) score += 1;
  if (checks.hasNumber) score += 1;
  if (checks.hasSpecial) score += 1;
  if (password.length >= 12 && score === 4) score = 5;

  let label = 'Enter password';
  let color = 'bg-slate-300 dark:bg-slate-700';
  let textColor = 'text-slate-400';
  let glowColor = '';

  if (password.length === 0) {
    label = 'Password required';
  } else if (score <= 1) {
    label = '🔴 Weak (Need more variety)';
    color = 'bg-rose-500';
    textColor = 'text-rose-600 dark:text-rose-400';
    glowColor = 'shadow-rose-500/30';
  } else if (score === 2) {
    label = '🟠 Moderate';
    color = 'bg-amber-500';
    textColor = 'text-amber-600 dark:text-amber-400';
    glowColor = 'shadow-amber-500/30';
  } else if (score === 3) {
    label = '🟡 Good Security';
    color = 'bg-yellow-500';
    textColor = 'text-yellow-600 dark:text-yellow-400';
    glowColor = 'shadow-yellow-500/30';
  } else if (score === 4) {
    label = '🟢 Strong Password';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-600 dark:text-emerald-400';
    glowColor = 'shadow-emerald-500/40';
  } else if (score >= 5) {
    label = '🛡️ Ironclad Hard Password 🚀';
    color = 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400';
    textColor = 'text-teal-600 dark:text-teal-300 font-black';
    glowColor = 'shadow-teal-500/50';
  }

  return { score, checks, label, color, textColor, glowColor };
}

export default function PasswordStrengthMeter({ password = '', showChecks = true }) {
  const { score, checks, label, color, textColor, glowColor } = calculatePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
      {/* 4-Segment Animated Gauge */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Security Strength</span>
          </span>
          <span className={`transition-all duration-300 font-extrabold ${textColor}`}>
            {label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((seg) => (
            <div
              key={seg}
              className="h-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
            >
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  score >= seg ? `${color} ${glowColor} shadow-sm` : 'w-0'
                }`}
                style={{ width: score >= seg ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Animated Criteria Requirement Check Pills */}
      {showChecks && (
        <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
              checks.length
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            {checks.length ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />}
            <span>8+ characters</span>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
              checks.hasUpper && checks.hasLower
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            {checks.hasUpper && checks.hasLower ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />}
            <span>Upper & lowercase</span>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
              checks.hasNumber
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            {checks.hasNumber ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />}
            <span>At least 1 number</span>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all ${
              checks.hasSpecial
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            {checks.hasSpecial ? <Check className="w-3 h-3 text-emerald-500 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />}
            <span>Special character (@#$)</span>
          </div>
        </div>
      )}
    </div>
  );
}
