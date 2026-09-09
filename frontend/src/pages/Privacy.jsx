import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, BellRing, Database, UserCheck, ArrowLeft, Mail, Clock, CheckCircle2 } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Privacy() {
  const { settings } = useSiteSettings();
  const lastUpdated = "September 09, 2026";

  const sections = [
    {
      id: "overview",
      icon: Shield,
      title: "1. Privacy Commitment & Overview",
      content: `At LOCAL2BRAND (operating at local2brand.cyou, also known as "Local to Brand" or "Local 2 Brand"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy details how we collect, handle, process, and safeguard your personal information when you visit our website, submit custom design requirements, or subscribe to project notifications.`
    },
    {
      id: "data-collected",
      icon: Database,
      title: "2. Information We Collect",
      content: `We collect information necessary to fulfill our engineering and web agency services, including:
      • Contact Details: Name, email address, phone/WhatsApp number, business name, and location provided during consultation or order submission.
      • Project Specifications: Design preferences, niche category selections, budget choices, and submitted branding assets.
      • Technical & Device Metadata: Browser type, operating system, IP address, and anonymized analytics data used strictly to optimize performance and prevent unauthorized access.`
    },
    {
      id: "data-usage",
      icon: UserCheck,
      title: "3. How We Use Your Information",
      content: `We strictly utilize collected data to:
      • Scaffold, design, and deliver your commissioned website within our 48-hour SLA.
      • Communicate real-time sprint milestones, demo previews, and order status tracking updates.
      • Provide customer support via direct WhatsApp, email, or telephone consultations.
      • Issue invoices, payment receipts, and project sign-off confirmations.
      • We do NOT sell, rent, or trade your personal information to any third-party advertisers or lead brokers.`
    },
    {
      id: "notifications-push",
      icon: BellRing,
      title: "4. Web Push Notifications & OneSignal Engine",
      content: `When you opt-in to browser push notifications on local2brand.cyou, we store a secure, randomized OneSignal device subscription identifier (Player ID). We never broadcast spam or sensitive data over public notification channels. Push alerts are utilized strictly for:
      • Direct client web inbox alerts (e.g., "You have a message in your web inbox").
      • Important platform maintenance or major launch discount broadcasts.
      You may revoke or disable push permissions at any time directly through your browser's site settings.`
    },
    {
      id: "security",
      icon: Lock,
      title: "5. Data Security & Storage Architecture",
      content: `We employ enterprise-grade security protocols, SSL/TLS encryption, restricted MongoDB Atlas database configurations, and strict role-based admin access control. While no internet transmission is 100% invulnerable, we implement continuous monitoring to safeguard your data against unauthorized access, alteration, or disclosure.`
    },
    {
      id: "user-rights",
      icon: Eye,
      title: "6. Your Privacy Rights & Data Controls",
      content: `Under applicable data protection laws (including the Digital Personal Data Protection Act and international standards), you have the right to:
      • Request a copy of the personal information we hold about you.
      • Request correction of inaccurate or incomplete project records.
      • Request permanent deletion of your customer data from our records upon completed project delivery.
      To exercise any of these rights, contact our privacy desk at ${settings.supportEmail || 'local2brand.contact@gmail.com'}.`
    },
    {
      id: "cookies",
      icon: Shield,
      title: "7. Cookies & Local Browser Storage",
      content: `We use minimal essential local storage and cookie tokens to store your visual theme preferences (dark/light mode), active session tokens for client portal access, and admin authentication states. We do not utilize invasive cross-site tracking cookies.`
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 relative">
      <SEO
        title="Privacy Policy — LOCAL2BRAND (Local To Brand)"
        description="Learn how LOCAL2BRAND (local2brand.cyou) protects your personal data, web push privacy, and project information with enterprise-grade security."
        keywords="local2brand privacy, local to brand privacy policy, local 2 brand data security, web push privacy, local2brand.cyou privacy standards"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Privacy & Security</span>
        </div>

        {/* Hero Header */}
        <div className="glass-panel p-6 sm:p-10 rounded-hero border border-white dark:border-slate-800 shadow-glass mb-10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
                <Shield className="w-3.5 h-3.5" />
                <span>Enterprise Data Privacy Standard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Your trust is our highest priority. How we secure data on <span className="font-semibold text-purple-600 dark:text-purple-400">local2brand.cyou</span>.
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Last Revised</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center sm:justify-end gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="glass-panel p-6 sm:p-8 rounded-2xl border border-white dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all"
              >
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{section.title}</span>
                </h2>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-10">
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Protection Officer Callout */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-glass mt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Privacy Inquiries & Data Requests</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Reach out directly to our engineering desk for data deletion, export requests, or privacy questions.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${settings.supportEmail || 'local2brand.contact@gmail.com'}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Privacy Officer</span>
              </a>
              <Link
                to="/terms"
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span>Terms & Conditions</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
