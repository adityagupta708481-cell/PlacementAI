import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

const COMPARISONS = [
  {
    feature: 'Profile Tracking',
    oldWay: 'Manual Google Sheets, forgotten spreadsheets, copy-pasting problem links.',
    placementAi: 'Instant auto-sync from LeetCode, Codeforces, GitHub — no manual logging.',
  },
  {
    feature: 'Readiness Assessment',
    oldWay: 'Guesswork based on total count. "I solved 300 problems, am I ready for Google?"',
    placementAi: 'Composite AI Readiness Score (0-100) benchmarked against company cutoff vectors.',
  },
  {
    feature: 'Practice Direction',
    oldWay: 'Blindly following random 150-question sheets without knowing personal weaknesses.',
    placementAi: 'Topic Radar maps your exact blind spots (e.g. DP on Trees) with focused question sets.',
  },
  {
    feature: 'CS Core Retention',
    oldWay: 'Cramming OS, DBMS, and CN slides 2 days before the interview and forgetting in round 2.',
    placementAi: 'Smart spaced-repetition deck with automated daily flashcard reviews.',
  },
  {
    feature: 'Company Targeting',
    oldWay: 'Applying blindly to campus drives without knowing if your profile matches the bar.',
    placementAi: 'Direct Tier-1, Tier-2, and Tier-3 percentage fit so you apply with confidence.',
  },
];

export default function ComparisonSection() {
  return (
    <section className="relative z-10 px-6 md:px-10 py-24 md:py-32 border-t border-border bg-card/60 dark:bg-card/40">
      <div className="relative mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Why PlacementAI
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            Stop grinding blindly.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            See the difference between scattered preparation and an AI-guided placement engine.
          </p>
        </div>

        {/* Desktop View Matrix */}
        <div className="hidden md:block rounded-3xl border border-border bg-card/95 dark:bg-card/85 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header Row */}
          <div className="grid grid-cols-12 border-b border-border bg-secondary/80 dark:bg-secondary/60">
            <div className="col-span-4 p-5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Capability
            </div>
            <div className="col-span-4 p-5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-l border-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>The Old Way (Spreadsheets)</span>
            </div>
            <div className="col-span-4 p-5 font-bold text-xs uppercase tracking-wider text-primary border-l border-border bg-primary/10 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>With PlacementAI</span>
            </div>
          </div>

          {/* Rows */}
          {COMPARISONS.map(({ feature, oldWay, placementAi }, idx) => (
            <div
              key={feature}
              className={`grid grid-cols-12 text-sm border-b border-border transition-colors hover:bg-secondary/40 ${
                idx === COMPARISONS.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="col-span-4 p-5 font-bold text-foreground flex items-center">
                {feature}
              </div>

              <div className="col-span-4 p-5 text-muted-foreground border-l border-border flex items-start gap-3">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{oldWay}</span>
              </div>

              <div className="col-span-4 p-5 text-foreground border-l border-border bg-primary/[0.05] dark:bg-primary/[0.04] flex items-start gap-3">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed font-medium">{placementAi}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View Responsive Cards */}
        <div className="md:hidden space-y-4">
          {COMPARISONS.map(({ feature, oldWay, placementAi }) => (
            <div
              key={feature}
              className="rounded-2xl border border-border bg-card/95 dark:bg-card/85 p-4 sm:p-5 shadow-xl backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-bold text-sm text-foreground">{feature}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Targeted
                </span>
              </div>

              {/* The Old Way */}
              <div className="rounded-xl bg-secondary/40 border border-rose-500/20 p-3 flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-0.5">
                    The Old Way
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{oldWay}</div>
                </div>
              </div>

              {/* With PlacementAI */}
              <div className="rounded-xl bg-primary/[0.06] border border-primary/30 p-3 flex items-start gap-2.5 shadow-xs">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>With PlacementAI</span>
                  </div>
                  <div className="text-xs text-foreground leading-relaxed font-medium">
                    {placementAi}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
