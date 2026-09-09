import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowLeft, Mail, Phone, ExternalLink } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useSiteSettings } from '../context/SiteSettingsContext';
import AshokaChakra from '../components/common/AshokaChakra';

export default function Terms() {
  const { settings } = useSiteSettings();
  const lastUpdated = "September 09, 2026";

  const sections = [
    {
      id: "agreement",
      title: "1. Acceptance of Terms",
      content: `By accessing, browsing, or commissioning website engineering services from LOCAL2BRAND (accessible at local2brand.cyou, also known as "Local to Brand" or "Local 2 Brand"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our platform or engage our development services.`
    },
    {
      id: "services",
      title: "2. Scope of Services & 48-Hour Fast-Track SLA",
      content: `LOCAL2BRAND provides bespoke website design, web application development, template deployment, speed optimization, and e-commerce configuration services. Our advertised "48-Hour Turnaround" applies to verified ready-made templates and standard rapid-deployment packages from the moment all required client assets (brand logos, text copy, imagery, and necessary credentials) are verified by our engineering team. Custom enterprise scopes follow custom development milestones agreed upon in the project statement.`
    },
    {
      id: "intellectual-property",
      title: "3. Intellectual Property & Code Ownership",
      content: `Upon 100% full payment settlement of the commissioned project invoice, the client receives full ownership rights of the custom frontend design assets, branding collateral, and final production source code prepared specifically for their deployment. LOCAL2BRAND retains the rights to proprietary base engine frameworks, shared UI component libraries, internal scaffolding tools, and reserve the right to display the completed work in our official public design portfolio unless explicitly protected under a signed non-disclosure agreement (NDA).`
    },
    {
      id: "revisions",
      title: "4. Client Revisions & Milestone Sign-Off",
      content: `Each project tier includes a specified period of post-launch hypercare and complimentary revision rounds (ranging from 14 to 60 days depending on the selected package). Revisions include bug fixes, color/font tweaks, content updates, and minor layout modifications. Substantial changes outside the original agreed requirement sheet or structural redesign requests will be quoted separately as add-on sprints.`
    },
    {
      id: "payments",
      title: "5. Payments, Deposits & Refund Policy",
      content: `Web development projects require an upfront milestone commitment deposit prior to development kickoff. Because our engineers immediately allocate dedicated high-performance resources, compute time, and custom design hours, deposits are non-refundable once development or template scaffolding has commenced. We guarantee 100% satisfaction and will work diligently through the revision cycles to ensure deliverables exceed client expectations.`
    },
    {
      id: "client-obligations",
      title: "6. Client Responsibilities & Content Legality",
      content: `Clients represent and warrant that all materials, media, trademarks, text, and images provided to LOCAL2BRAND are lawfully owned or licensed by the client. The client agrees to indemnify and hold LOCAL2BRAND and its founders harmless from any copyright infringement, trademark disputes, or regulatory violations arising from client-submitted assets.`
    },
    {
      id: "uptime-liability",
      title: "7. Third-Party Services & Limitation of Liability",
      content: `While LOCAL2BRAND implements bank-grade security and sub-second performance architectures, we are not liable for outages, delays, or service disruptions caused by third-party infrastructure providers (including domain registrars, hosting servers like Vercel/AWS, payment gateways like Razorpay/Stripe, or external APIs). Under no circumstances shall LOCAL2BRAND's aggregate liability exceed the total project fee paid by the client.`
    },
    {
      id: "governing-law",
      title: "8. Governing Law & Dispute Resolution",
      content: `These terms and any disputes arising out of or related to our services shall be governed by and construed in accordance with the laws of India. Any legal action or proceeding shall be brought exclusively in the competent courts located in West Bengal, India.`
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 relative">
      <SEO
        title="Terms and Conditions — LOCAL2BRAND (Local To Brand)"
        description="Review the official Terms of Service and Client Agreement for LOCAL2BRAND (local2brand.cyou). Transparent SLAs, code ownership rights, and 48-hour delivery policies."
        keywords="local2brand terms, local to brand terms of service, local 2 brand client agreement, website development contract, local2brand.cyou policies"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Legal Documents</span>
        </div>

        {/* Hero Header */}
        <div className="glass-panel p-6 sm:p-10 rounded-hero border border-white dark:border-slate-800 shadow-glass mb-10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-bold mb-3">
                <FileText className="w-3.5 h-3.5" />
                <span>Enterprise Service Agreement</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Terms and Conditions
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                Official terms of service governing projects and interactions on <span className="font-semibold text-purple-600 dark:text-purple-400">local2brand.cyou</span>.
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">Last Revised</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center sm:justify-end gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Stream */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-white dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all"
            >
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                <span>{section.title}</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact & Support Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-200/60 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20 shadow-glass mt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Questions Regarding Our Terms?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Our executive team is available to assist with custom client contracts and enterprise NDAs.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${settings.supportEmail || 'local2brand.contact@gmail.com'}`}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Support</span>
              </a>
              <Link
                to="/contact"
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                <span>Contact Form</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
