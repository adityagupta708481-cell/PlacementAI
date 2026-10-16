import React from 'react';
import {
  BrainCircuit,
  Radar,
  CalendarCheck,
  Building2,
  Code2,
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle,
} from 'lucide-react';

export default function BentoFeaturesSection() {
  return (
    <section id="features" className="relative z-10 px-6 md:px-10 py-24 md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(5,150,105,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(47,233,43,0.12),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Core Platform Architecture
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            Everything you need to secure the offer.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Built ground-up for placement season. No generic advice, just deep telemetry on your coding skills.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: AI Readiness Engine (Wide: 7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-border bg-card/90 p-7 md:p-8 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/15 transition-all" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Composite Evaluation
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Composite Readiness Score (0-100)
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Unlike simple problem counts, our formula weighs problem difficulty, consistency streaks, contest performance, and repository code quality against verified recruiter cutoffs.
              </p>

              {/* Interactive Visual Preview Box */}
              <div className="rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Calculated Composite</span>
                    <div className="text-3xl font-black text-foreground flex items-center gap-2">
                      87.4 <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary">Tier-1 Ready</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Percentile</span>
                    <div className="text-xl font-bold text-foreground">Top 4.8%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>DSA Depth (LeetCode 412 solved)</span>
                      <span className="font-mono text-primary font-bold">91%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Contest Speed (Codeforces 1540 Specialist)</span>
                      <span className="font-mono text-amber-500 font-bold">84%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>System Projects (GitHub 142 commits)</span>
                      <span className="font-mono text-primary font-bold">88%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Topic Mastery & Weak Spots (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-border bg-card/90 p-7 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Radar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Blind Spot Detection
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Topic Radar & Weak Spots
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Pinpoints the exact topics dragging your score down so you never get surprised in technical rounds.
              </p>

              {/* Topic Bars */}
              <div className="space-y-3 rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Binary Trees & BST</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-bold">96% Strong</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Graphs & Shortest Path</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25 text-blue-700 dark:text-blue-400 font-bold">88% Solid</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Dynamic Programming</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-400 font-bold">68% Needs Practice</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Tries & Bit Manipulation</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/25 text-rose-700 dark:text-rose-400 font-bold">54% Weak Area</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-amber-500 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>12 questions recommended to close the gap</span>
            </div>
          </div>

          {/* Bento Card 3: Spaced Repetition Calendar (5 cols) */}
          <div className="md:col-span-5 rounded-3xl border border-border bg-card/90 p-7 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  CS Fundamentals
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Spaced Repetition Engine
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Never blank out on OS concurrency, DBMS indexing, or TCP/IP handshakes before your interview.
              </p>

              {/* Flashcard pills */}
              <div className="space-y-2.5 rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-foreground font-medium">OS: Paging vs Segmentation</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">Due today</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-foreground font-medium">DBMS: B+ Tree Indexing</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">Due tomorrow</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-foreground font-medium">CN: TCP 3-Way Handshake</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">Due in 3 days</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>CS Mastery Level:</span>
              <span className="font-bold text-foreground">88% (42/48 Topics)</span>
            </div>
          </div>

          {/* Bento Card 4: Company Match & Tier Cutoffs (7 cols) */}
          <div className="md:col-span-7 rounded-3xl border border-border bg-card/90 p-7 md:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Recruitment Matching
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Company Cutoff Matching
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Know where you qualify right now. We compare your profile vector against real interview benchmarks for Tier-1, Tier-2, and Tier-3 recruiters.
              </p>

              {/* Companies cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-4 text-center hover:border-primary/40 transition-all shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Google / Amazon</div>
                  <div className="text-2xl font-black text-primary mb-1">92%</div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    Tier-1 Match
                  </span>
                </div>

                <div className="rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-4 text-center hover:border-primary/40 transition-all shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Oracle / Cisco</div>
                  <div className="text-2xl font-black text-primary mb-1">98%</div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    Tier-2 Match
                  </span>
                </div>

                <div className="rounded-2xl bg-secondary/80 dark:bg-secondary/60 border border-border p-4 text-center hover:border-primary/40 transition-all shadow-xs">
                  <div className="text-xs font-bold text-muted-foreground mb-1">Accenture / TCS Digital</div>
                  <div className="text-2xl font-black text-primary mb-1">100%</div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    Exceeds Bar
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
              <span>Benchmarks updated weekly from campus placement drives</span>
              <span className="text-primary font-bold">15+ Companies Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
