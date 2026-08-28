import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, HelpCircle } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ScrollReveal from '../common/ScrollReveal';
import { agencyFaqs } from '../../data/faqs';
import { generateWhatsAppGeneralUrl, openWhatsAppChat } from '../../utils/whatsapp';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleWhatsAppHelp = () => {
    openWhatsAppChat(generateWhatsAppGeneralUrl());
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Frequently Asked Questions"
          title="Got Questions? We Have Answers."
          subtitle="Everything you need to know about our design process, turnaround times, WhatsApp order flow, and deliverables."
        />

        {/* FAQ Accordion List with Staggered Scroll Reveal */}
        <div className="mt-16 space-y-4">
          {agencyFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <ScrollReveal
                key={faq.question}
                variant="fade-up"
                delay={index * 60}
                duration={600}
              >
                <div
                  className={`glass-panel rounded-2xl transition-all duration-200 overflow-hidden border ${
                    isOpen
                      ? 'border-purple-300 dark:border-purple-500/50 shadow-glass bg-white dark:bg-slate-900'
                      : 'border-white/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/60'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </span>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Still have questions banner with Fade-Up */}
        <ScrollReveal variant="fade-up" delay={200} duration={650} className="mt-12">
          <div className="p-6 rounded-2xl glass-card border border-white dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Have a custom question?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Chat directly with our team on WhatsApp for an immediate response.</p>
              </div>
            </div>

            <button
              onClick={handleWhatsAppHelp}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-500/40 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              Ask Us on WhatsApp
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
