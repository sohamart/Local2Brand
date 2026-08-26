import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, HelpCircle } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
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
      {/* Subtle Ambient Section Glow */}
      <div className="section-glow section-glow-blue top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Frequently Asked Questions"
          title="Got Questions? We Have Answers."
          subtitle="Everything you need to know about our design process, turnaround times, WhatsApp order flow, and deliverables."
        />

        {/* FAQ Accordion List */}
        <div className="mt-16 space-y-4">
          {agencyFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`glass-panel rounded-2xl transition-all duration-200 overflow-hidden border ${isOpen
                    ? 'border-purple-300 shadow-glass bg-white'
                    : 'border-white/90 hover:border-slate-300/80 bg-white/70'
                  }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-2xl glass-card border border-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Have a custom question?</h4>
              <p className="text-xs text-slate-500">Chat directly with our team on WhatsApp for an immediate response.</p>
            </div>
          </div>

          <button
            onClick={handleWhatsAppHelp}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            Ask Us on WhatsApp
          </button>
        </div>

      </div>
    </section>
  );
}
