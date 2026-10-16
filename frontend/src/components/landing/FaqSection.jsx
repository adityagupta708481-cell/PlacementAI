import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'How does the AI Composite Readiness Score work?',
    a: 'PlacementAI uses a multi-vector scoring model. Instead of just counting solved problems, we analyze problem difficulty distribution (Easy/Medium/Hard), contest ratings (Codeforces/CodeChef), commit frequency (GitHub), and CS subject mastery. This vector is benchmarked against real company placement cutoffs to generate your 0-100 score.',
  },
  {
    q: 'Do I need to share my passwords or login credentials?',
    a: 'Never. You only provide your public profile usernames or handles (e.g., your LeetCode username or GitHub handle). Our scrapers and APIs pull only publicly accessible activity data.',
  },
  {
    q: 'How often does my coding activity sync?',
    a: 'Profiles can be auto-synced or manually refreshed on-demand with one click from your dashboard. We update your problem solved count, streak, contest rating changes, and recent submissions instantly.',
  },
  {
    q: 'What is the difference between Tier-1, Tier-2, and Tier-3 benchmarks?',
    a: 'Tier-1 represents top product companies (Google, Microsoft, Amazon, Uber) demanding deep DSA, graph algorithms, and system architecture. Tier-2 includes large tech firms (Oracle, Cisco, Salesforce) requiring solid medium-level problem-solving and CS fundamentals. Tier-3 covers mass campus recruiters and IT service firms.',
  },
  {
    q: 'Can I track Operating Systems, DBMS, and Aptitude preparation?',
    a: 'Yes! PlacementAI includes a dedicated CS Fundamentals module with spaced-repetition flashcards for OS, DBMS, Computer Networks, and Quantitative Aptitude. It ensures you review forgotten concepts right before your interviews.',
  },
  {
    q: 'Is PlacementAI free for college students?',
    a: 'Yes, PlacementAI is 100% free for students preparing for campus placement season. You can connect all your platforms, generate AI readiness reports, and access revision calendars at zero cost.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative z-10 px-6 md:px-10 py-24 md:py-32 border-t border-border bg-card/60 dark:bg-card/40">
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Got Questions?
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Everything you need to know about profile syncing, AI scoring, and interview benchmarks.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map(({ q, a }, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={q}
                className="rounded-2xl border border-border bg-card/95 dark:bg-card/85 overflow-hidden transition-all duration-200 hover:border-primary/50 shadow-xs backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-base md:text-lg text-foreground pr-4">{q}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-primary/10 border-primary/30 text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/60">
                        <p className="pt-4">{a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
