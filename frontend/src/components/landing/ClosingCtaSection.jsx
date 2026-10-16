import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ClosingCtaSection() {
  return (
    <section className="relative z-10 px-6 md:px-10 py-24 md:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-5xl">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(47,233,43,0.18),transparent_70%)] pointer-events-none" />

        <div className="relative rounded-[2.5rem] border border-border bg-gradient-to-b from-[#f8fafc] to-[#eef1f6] dark:bg-gradient-to-b dark:from-[#0f1f10]/90 dark:via-[#070e08]/90 dark:to-black/95 dark:border-[#2fe92b]/30 p-8 md:p-16 text-center shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Subtle grid in background */}
          <div className="absolute inset-0 bg-grid-theme opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Recruitment Season 2026</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-5 leading-tight">
              Know where you stand — before the recruiters do.
            </h2>

            <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
              Connect your LeetCode, Codeforces, and GitHub profiles in under a minute. Get your personalized readiness score and focus on the topics that actually matter.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                to="/register"
                id="cta-register-bottom"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm bg-primary text-primary-foreground shadow-[0_10px_25px_var(--primary-glow)] hover:opacity-90 hover:-translate-y-0.5 transition-all no-underline"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                id="cta-signin-bottom"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm bg-secondary border border-border text-foreground hover:bg-secondary/70 transition-all no-underline shadow-xs"
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>60-second instant setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Zero passwords required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>100% Free for students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
