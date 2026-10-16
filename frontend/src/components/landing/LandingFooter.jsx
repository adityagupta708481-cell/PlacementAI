import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, ShieldCheck, Heart } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function LandingFooter() {
  return (
    <footer className="relative z-10 border-t border-border bg-card/90 text-muted-foreground text-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 no-underline text-foreground">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[#15803d] shadow-[0_2px_10px_var(--primary-glow)]">
                <Sparkles size={16} color="var(--primary-foreground)" />
              </span>
              <span className="font-extrabold tracking-tight text-lg text-foreground">PlacementAI</span>
            </Link>

            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              The automated readiness and diagnostic engine for college students preparing for technical interviews and campus recruitment.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All sync pipelines operational</span>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs list-none p-0 m-0">
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  AI Readiness Engine
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Topic Radar Chart
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Spaced Repetition Deck
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Company Benchmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Integrations</h4>
            <ul className="space-y-2.5 text-xs list-none p-0 m-0">
              <li className="flex items-center gap-1.5 text-muted-foreground">
                <span>LeetCode</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">Live</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground">
                <span>Codeforces</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">Live</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground">
                <span>GitHub</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">Live</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground">
                <span>HackerRank</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-secondary text-muted-foreground border border-border">Beta</span>
              </li>
              <li className="flex items-center gap-1.5 text-muted-foreground">
                <span>CodeChef</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-secondary text-muted-foreground border border-border">Beta</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Account</h4>
            <ul className="space-y-2.5 text-xs list-none p-0 m-0">
              <li>
                <Link to="/login" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors no-underline text-muted-foreground">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} PlacementAI. Built for students navigating campus placement season.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <ThemeToggle variant="segmented" />
            <span>Free & Open for College Students</span>
            <span>Zero Tracking Passwords</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
