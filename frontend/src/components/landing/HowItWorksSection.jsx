import React from 'react';
import { RefreshCw, BrainCircuit, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: '01',
    icon: RefreshCw,
    title: 'One-Click Profile Sync',
    description:
      'Enter your public usernames for LeetCode, Codeforces, and GitHub. No passwords required. Our scrapers pull submission count, difficulty splits, contest ratings, and commit velocity automatically.',
    badge: 'Zero passwords needed',
    highlights: ['410+ problems classified', 'Contest ratings synced', 'Git activity mapped'],
  },
  {
    step: '02',
    icon: BrainCircuit,
    title: 'AI Readiness Scoring',
    description:
      'Our NLP embeddings benchmark your problem-solving depth against real college placement test patterns from Tier-1 (Google/Amazon), Tier-2 (Oracle/Cisco), and Tier-3 recruiters to compute a single verified score.',
    badge: 'Hugging Face embeddings',
    highlights: ['Multi-vector composite formula', 'DSA topic depth radar', 'Gap analysis by company'],
  },
  {
    step: '03',
    icon: Target,
    title: 'Targeted Revision & Action',
    description:
      'Stop blindly solving random questions. PlacementAI tells you exactly what to revise today — whether that is Dynamic Programming on Trees or spaced-repetition flashcards for DBMS and Operating Systems.',
    badge: 'Spaced repetition',
    highlights: ['Weak area alerts', 'CS core revision deck', 'Company cutoff tracking'],
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative z-10 px-6 md:px-10 py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Systematic Preparation
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            How PlacementAI gets you offer-ready.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            A three-step loop that transforms fragmented daily practice into measurable placement readiness.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ step, icon: Icon, title, description, badge, highlights }) => (
            <div
              key={step}
              className="relative rounded-3xl border border-border bg-card/90 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl flex flex-col justify-between group"
            >
              {/* Card top row */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-foreground/25 dark:text-foreground/20">{step}</span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-md bg-secondary border border-border text-[11px] font-semibold text-foreground mb-3">
                  {badge}
                </div>

                <h3 className="text-xl font-bold tracking-tight text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-border/60 space-y-2">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-2xl border border-border bg-card/95 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-foreground">Ready to run your first evaluation?</h4>
            <p className="text-xs text-muted-foreground">Syncs take less than 60 seconds with instant results.</p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-primary text-primary-foreground shadow-[0_4px_14px_var(--primary-glow)] hover:opacity-90 hover:shadow-[0_6px_20px_var(--primary-glow)] transition-all no-underline shrink-0"
          >
            Start Free Evaluation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
