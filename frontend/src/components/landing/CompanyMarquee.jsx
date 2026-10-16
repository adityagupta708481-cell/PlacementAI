import React from 'react';
import { Sparkles } from 'lucide-react';

const RECRUITERS = [
  { name: 'Google', tier: 'Tier-1' },
  { name: 'Microsoft', tier: 'Tier-1' },
  { name: 'Amazon', tier: 'Tier-1' },
  { name: 'Atlassian', tier: 'Tier-1' },
  { name: 'Goldman Sachs', tier: 'Tier-1' },
  { name: 'Uber', tier: 'Tier-1' },
  { name: 'Adobe', tier: 'Tier-1' },
  { name: 'NVIDIA', tier: 'Tier-1' },
  { name: 'Salesforce', tier: 'Tier-1' },
  { name: 'Oracle', tier: 'Tier-2' },
  { name: 'Cisco', tier: 'Tier-2' },
  { name: 'JPMorgan', tier: 'Tier-1' },
];

const PLATFORMS = [
  { name: 'LeetCode', count: '410+ solved', tag: 'DSA' },
  { name: 'Codeforces', count: 'Specialist 1540', tag: 'CP' },
  { name: 'GitHub', count: '140+ commits', tag: 'Projects' },
  { name: 'HackerRank', count: 'Gold Badge', tag: 'Core' },
  { name: 'CodeChef', count: '4 Star', tag: 'Contests' },
];

export default function CompanyMarquee() {
  return (
    <section className="relative z-10 py-16 border-y border-border bg-card/75 dark:bg-card/60 backdrop-blur-md overflow-hidden">
      {/* Background glow strip */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.05),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(47,233,43,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] font-semibold text-primary mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Platform Sync & Recruiter Benchmarks</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Sync your coding profiles. Benchmark against campus recruiters.
        </h2>
      </div>

      {/* Recruiter Chips Row */}
      <div className="relative flex overflow-x-hidden group">
        <div className="flex shrink-0 animate-marquee gap-4 py-2">
          {RECRUITERS.concat(RECRUITERS).map((recruiter, idx) => (
            <div
              key={`${recruiter.name}-${idx}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card/90 dark:bg-secondary/80 border border-border hover:border-primary/50 hover:bg-card hover:shadow-md transition-all whitespace-nowrap shadow-xs group-hover:pause"
            >
              <span className="font-bold text-sm text-foreground">{recruiter.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                {recruiter.tier}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Integrations Strip */}
      <div className="max-w-4xl mx-auto mt-10 px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {PLATFORMS.map((platform, idx) => (
            <div
              key={platform.name}
              className={`flex flex-col items-center justify-center p-3 rounded-xl bg-card/90 dark:bg-secondary/60 border border-border hover:border-primary/30 transition-all text-center shadow-xs ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <span className="text-xs font-bold text-foreground mb-0.5">{platform.name}</span>
              <span className="text-[10px] text-primary font-medium">{platform.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
