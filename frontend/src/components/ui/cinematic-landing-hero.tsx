// src/components/ui/cinematic-landing-hero.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }
  .transform-style-3d { transform-style: preserve-3d; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS (Restored 3D Depth)
  ---------------------------------------------------------------------- */
  
  /* OUTSIDE THE CARD: Theme-aware text (Shadow in Light Mode, Glow in Dark Mode) */
  .text-3d-matte {
      color: #f8fafc;
      text-shadow: 
          0 10px 30px rgba(0, 0, 0, 0.75), 
          0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.6)) 
          drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.4));
  }

  /* INSIDE THE CARD: Luminous Silver/White for the dark background, deep rich shadows */
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) 
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  /* Deep Physical Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(145deg, #131916 0%, #0a0e0c 50%, #080b09 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.95),
          0 20px 40px -20px rgba(0, 0, 0, 0.85),
          inset 0 1px 2px rgba(47, 233, 43, 0.35),
          inset 0 -2px 4px rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(47, 233, 43, 0.28);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(47,233,43,0.08) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Laptop Screen Display Materials (Dark Mode Baseline) */
  .laptop-display-screen {
      background: #070b10;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.9);
  }
  .laptop-title-bar {
      background: rgba(13, 17, 24, 0.95);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .laptop-address-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
  }
  .laptop-widget-box {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
  .laptop-score-track {
      stroke: rgba(255, 255, 255, 0.08);
  }
  .laptop-score-text {
      color: #ffffff;
  }
  .laptop-score-label {
      color: #2fe92b;
  }
  .laptop-sub-border {
      border-color: rgba(255, 255, 255, 0.08);
  }

  /* Physical Card Text & Surfaces (Dark Mode Baseline) */
  .card-val-badge {
      background: rgba(47, 233, 43, 0.15) !important;
      border: 1px solid rgba(47, 233, 43, 0.3) !important;
      color: #2fe92b !important;
  }
  .card-val-heading {
      color: #ffffff !important;
  }
  .card-val-desc {
      color: #cbd5e1 !important;
  }
  .card-val-bullet-box {
      border-color: rgba(255, 255, 255, 0.15) !important;
  }
  .card-val-bullet {
      color: #cbd5e1 !important;
  }
  .card-val-check {
      background: rgba(47, 233, 43, 0.2) !important;
      color: #2fe92b !important;
      border: 1px solid rgba(47, 233, 43, 0.4) !important;
  }
  .card-telemetry-box {
      background: rgba(14, 18, 26, 0.96) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.85) !important;
  }
  .card-telemetry-header-border {
      border-color: rgba(255, 255, 255, 0.1) !important;
  }
  .card-telemetry-title {
      color: #ffffff !important;
  }
  .card-telemetry-sub {
      color: #94a3b8 !important;
  }
  .card-telemetry-label {
      color: #cbd5e1 !important;
  }
  .card-telemetry-val {
      color: #ffffff !important;
  }
  .card-telemetry-ready {
      color: #2fe92b !important;
  }
  .card-telemetry-priority {
      color: #ff9821 !important;
  }
  .card-telemetry-track {
      background: rgba(255, 255, 255, 0.1) !important;
  }
  .card-telemetry-bar {
      background: #2fe92b !important;
  }
  .card-floating-badge {
      background: linear-gradient(135deg, rgba(20, 26, 22, 0.95) 0%, rgba(12, 16, 14, 0.95) 100%) !important;
      border: 1px solid rgba(47, 233, 43, 0.35) !important;
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.8), 0 0 16px rgba(47, 233, 43, 0.15) !important;
  }
  .card-floating-title {
      color: #ffffff !important;
  }
  .card-floating-sub {
      color: #cbd5e1 !important;
  }
  .laptop-item-title {
      color: #ffffff !important;
  }
  .laptop-item-sub {
      color: #cbd5e1 !important;
  }
  .laptop-chip-label {
      color: #e2e8f0 !important;
  }
  .laptop-chip-val {
      color: #ff9821 !important;
  }
  .laptop-dock-label {
      color: #94a3b8 !important;
  }
  .laptop-dock-accent {
      color: #4ade80 !important;
  }
  .hero-sub-text {
      color: #cbd5e1 !important;
  }
  .hero-scroll-prompt {
      color: #94a3b8 !important;
  }

  /* -------------------------------------------------------------------
     REALISTIC LAPTOP HARDWARE (MacBook Pro Aesthetic)
  ---------------------------------------------------------------------- */
  .laptop-chassis {
      transform-style: preserve-3d;
      filter: 
          drop-shadow(0 30px 60px rgba(0, 0, 0, 0.95)) 
          drop-shadow(0 12px 24px rgba(0, 0, 0, 0.85));
  }

  .laptop-lid {
      background: linear-gradient(180deg, #22242a 0%, #101114 100%);
      border-radius: 18px 18px 0 0;
      box-shadow: 
          inset 0 0 0 1px rgba(255, 255, 255, 0.16),
          inset 0 1.5px 0 rgba(255, 255, 255, 0.32),
          0 0 0 1px #050608;
      position: relative;
  }

  .laptop-screen-bezel {
      background-color: #050608;
      border-radius: 12px 12px 0 0;
      box-shadow: 
          inset 0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 2px 4px rgba(0, 0, 0, 0.9);
  }

  .laptop-hinge {
      background: linear-gradient(180deg, #0a0b0e 0%, #181920 45%, #050608 100%);
      box-shadow: 
          inset 0 1px 1px rgba(255, 255, 255, 0.15),
          0 2px 4px rgba(0, 0, 0, 0.8);
  }

  .laptop-base-top {
      background: linear-gradient(180deg, #32353e 0%, #1a1b20 100%);
      box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          0 1px 2px rgba(0, 0, 0, 0.85);
  }

  .laptop-base-lip {
      background: linear-gradient(180deg, #1b1c22 0%, #0d0e12 100%);
      border-radius: 0 0 14px 14px;
      box-shadow: 
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          0 8px 20px rgba(0, 0, 0, 0.95),
          0 25px 50px -10px rgba(0, 0, 0, 1);
  }

  .laptop-notch-opening {
      background: #090a0d;
      border-radius: 0 0 6px 6px;
      box-shadow: 
          inset 0 -1px 1px rgba(255, 255, 255, 0.18),
          inset 0 1px 2px rgba(0, 0, 0, 0.8);
  }

  .screen-glare {
      background: linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 30%, transparent 60%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 8px 18px rgba(0,0,0,0.35),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.04);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(20, 25, 22, 0.85) 0%, rgba(10, 12, 11, 0.9) 100%);
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 
          0 0 0 1px rgba(47, 233, 43, 0.25),
          0 20px 40px -10px rgba(0, 0, 0, 0.9),
          0 0 20px rgba(47, 233, 43, 0.12),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #2fe92b 0%, #25c022 100%);
      color: #0f0f0f;
      font-weight: 700;
      box-shadow: 0 0 0 1px rgba(47,233,43,0.4), 0 2px 4px rgba(0,0,0,0.2), 0 12px 24px -4px rgba(47,233,43,0.45), inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(0,0,0,0.15);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3efd3a 0%, #2fe92b 100%);
      box-shadow: 0 0 0 1px rgba(47,233,43,0.5), 0 6px 12px -2px rgba(47,233,43,0.3), 0 20px 32px -6px rgba(47,233,43,0.5), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.15);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #25c022 0%, #1ea51c 100%);
      box-shadow: 0 0 0 1px rgba(47,233,43,0.3), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(0,0,0,0.02);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #1b1b1d 0%, #0f0f0f 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(38,39,45,0.8), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.08), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #2a2a2c 0%, #1b1b1d 100%);
      box-shadow: 0 0 0 1px rgba(47,233,43,0.3), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #0f0f0f;
      box-shadow: 0 0 0 1px rgba(38,39,45,0.5), inset 0 3px 8px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.5);
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }

  /* Light Gray Theme Visual Styling for Hero Mockup & 3D Elements */
  .light .text-3d-matte {
      color: #0f172a !important;
      text-shadow: 0 4px 14px rgba(15, 23, 42, 0.12) !important;
  }

  .light .text-silver-matte {
      background: linear-gradient(180deg, #0f172a 0%, #334155 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      filter: drop-shadow(0px 2px 6px rgba(15, 23, 42, 0.12)) !important;
  }

  .light .premium-depth-card {
      background: linear-gradient(145deg, #f8fafc 0%, #edf1f7 100%) !important;
      box-shadow: 
          0 30px 80px -15px rgba(15, 23, 42, 0.14),
          0 15px 35px -15px rgba(15, 23, 42, 0.10),
          inset 0 1px 2px rgba(255, 255, 255, 0.95),
          inset 0 -2px 4px rgba(15, 23, 42, 0.04) !important;
      border: 1px solid #d1d7e2 !important;
  }

  .light .text-card-silver-matte {
      background: linear-gradient(180deg, #0f172a 0%, #334155 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      filter: drop-shadow(0px 4px 8px rgba(15, 23, 42, 0.08)) !important;
  }

  .light .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%) !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 
          0 16px 32px -8px rgba(15, 23, 42, 0.14),
          0 0 20px rgba(5, 150, 105, 0.12),
          inset 0 1px 1px rgba(255, 255, 255, 1),
          inset 0 -1px 1px rgba(15, 23, 42, 0.04) !important;
  }

  /* Laptop screen light theme adaptation */
  .light .laptop-display-screen {
      background: #f8fafc !important;
      color: #0f172a !important;
      border-color: #cbd5e1 !important;
      box-shadow: inset 0 0 16px rgba(15, 23, 42, 0.06) !important;
  }
  .light .laptop-title-bar {
      background: #e2e8f0 !important;
      border-bottom-color: #cbd5e1 !important;
  }
  .light .laptop-address-pill {
      background: #ffffff !important;
      border-color: #cbd5e1 !important;
      color: #1e293b !important;
  }
  .light .laptop-widget-box {
      background: #ffffff !important;
      border-color: #cbd5e1 !important;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04) !important;
  }
  .light .laptop-score-track {
      stroke: #e2e8f0 !important;
  }
  .light .laptop-score-text {
      color: #020617 !important;
  }
  .light .laptop-score-label {
      color: #047857 !important;
  }
  .light .laptop-sub-border {
      border-color: #e2e8f0 !important;
  }

  /* Physical Card Text & Surfaces (Light Gray Theme Overrides) */
  .light .card-val-badge {
      background: rgba(5, 150, 105, 0.12) !important;
      border: 1px solid rgba(5, 150, 105, 0.35) !important;
      color: #047857 !important;
  }
  .light .card-val-heading {
      color: #020617 !important;
  }
  .light .card-val-desc {
      color: #1e293b !important;
  }
  .light .card-val-bullet-box {
      border-color: #cbd5e1 !important;
  }
  .light .card-val-bullet {
      color: #1e293b !important;
  }
  .light .card-val-check {
      background: rgba(5, 150, 105, 0.15) !important;
      color: #047857 !important;
      border: 1px solid rgba(5, 150, 105, 0.35) !important;
  }
  .light .card-telemetry-box {
      background: rgba(255, 255, 255, 0.98) !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08) !important;
  }
  .light .card-telemetry-header-border {
      border-color: #e2e8f0 !important;
  }
  .light .card-telemetry-title {
      color: #020617 !important;
  }
  .light .card-telemetry-sub {
      color: #475569 !important;
  }
  .light .card-telemetry-label {
      color: #1e293b !important;
  }
  .light .card-telemetry-val {
      color: #020617 !important;
  }
  .light .card-telemetry-ready {
      color: #047857 !important;
  }
  .light .card-telemetry-priority {
      color: #c2410c !important;
  }
  .light .card-telemetry-track {
      background: #e2e8f0 !important;
  }
  .light .card-telemetry-bar {
      background: #059669 !important;
  }
  .light .card-floating-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%) !important;
      border: 1px solid #cbd5e1 !important;
      box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.14) !important;
  }
  .light .card-floating-title {
      color: #020617 !important;
  }
  .light .card-floating-sub {
      color: #334155 !important;
  }
  .light .laptop-item-title {
      color: #020617 !important;
  }
  .light .laptop-item-sub {
      color: #334155 !important;
  }
  .light .laptop-chip-label {
      color: #1e293b !important;
  }
  .light .laptop-chip-val {
      color: #c2410c !important;
  }
  .light .laptop-dock-label {
      color: #475569 !important;
  }
  .light .laptop-dock-accent {
      color: #047857 !important;
  }
  .light .hero-sub-text {
      color: #334155 !important;
  }
  .light .hero-scroll-prompt {
      color: #475569 !important;
  }

  /* Silver Aluminum MacBook Hardware in Light Gray Theme */
  .light .laptop-lid {
      background: linear-gradient(180deg, #e2e6ed 0%, #c9d0dc 100%);
      box-shadow: 
          inset 0 0 0 1px rgba(255, 255, 255, 0.7),
          inset 0 1.5px 0 rgba(255, 255, 255, 0.9),
          0 0 0 1px #94a3b8;
  }
  .light .laptop-hinge {
      background: linear-gradient(180deg, #c9d0dc 0%, #94a3b8 45%, #64748b 100%);
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 2px 4px rgba(15, 23, 42, 0.25);
  }
  .light .laptop-base-top {
      background: linear-gradient(180deg, #f1f4f9 0%, #cbd2dd 100%);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 2px rgba(15, 23, 42, 0.2);
  }
  .light .laptop-base-lip {
      background: linear-gradient(180deg, #cbd2dd 0%, #94a3b8 100%);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 20px rgba(15, 23, 42, 0.2), 0 25px 40px -10px rgba(15, 23, 42, 0.25);
  }
  .light .laptop-notch-opening {
      background: #64748b;
      box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.4), inset 0 1px 2px rgba(15, 23, 42, 0.3);
  }

  .light .btn-modern-dark {
      background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
      color: #0f172a;
      border: 1px solid #cbd5e1;
      box-shadow: 0 0 0 1px rgba(209, 215, 226, 0.8), 0 2px 4px rgba(15, 23, 42, 0.05), 0 12px 24px -4px rgba(15, 23, 42, 0.08), inset 0 1px 1px #ffffff, inset 0 -3px 6px rgba(15, 23, 42, 0.05);
  }
  .light .btn-modern-dark:hover {
      background: linear-gradient(180deg, #ffffff 0%, #edf2f7 100%);
      border-color: #059669;
      box-shadow: 0 0 0 1px rgba(5, 150, 105, 0.3), 0 6px 12px -2px rgba(15, 23, 42, 0.08), 0 20px 32px -6px rgba(15, 23, 42, 0.12);
  }
  .light .btn-modern-dark:active {
      background: #e2e8f0;
  }

  .light .btn-modern-light {
      background: linear-gradient(180deg, #059669 0%, #047857 100%);
      color: #ffffff;
      box-shadow: 0 0 0 1px rgba(5, 150, 105, 0.5), 0 2px 4px rgba(15, 23, 42, 0.1), 0 12px 24px -4px rgba(5, 150, 105, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.12);
  }
  .light .btn-modern-light:hover {
      background: linear-gradient(180deg, #10b981 0%, #059669 100%);
      box-shadow: 0 0 0 1px rgba(5, 150, 105, 0.6), 0 6px 12px -2px rgba(15, 23, 42, 0.15), 0 20px 32px -6px rgba(5, 150, 105, 0.45);
  }
`;

export interface CinematicHeroBadge {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export interface CinematicHeroItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  /** Tailwind color family used for the icon tile accent */
  tone?: "blue" | "emerald" | "indigo" | "amber";
}

// Backwards compatibility alias
export type CinematicHeroPhoneItem = CinematicHeroItem;
export type CinematicHeroLaptopItem = CinematicHeroItem;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: React.ReactNode;
  brandClassName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaActions?: React.ReactNode;
  badges?: [CinematicHeroBadge, CinematicHeroBadge];
  phoneEyebrow?: string;
  phoneTitle?: string;
  phoneInitials?: string;
  phoneItems?: CinematicHeroItem[];
  laptopEyebrow?: string;
  laptopTitle?: string;
  laptopInitials?: string;
  laptopItems?: CinematicHeroItem[];
}

const DEFAULT_BADGES: [CinematicHeroBadge, CinematicHeroBadge] = [
  { icon: <span aria-hidden="true">🔥</span>, title: "45-Day Streak", subtitle: "Daily goal crushed" },
  { icon: <span aria-hidden="true">🎯</span>, title: "Company Match", subtitle: "92% fit · Tier-1" },
];

const TONE_CLASSES: Record<NonNullable<CinematicHeroItem["tone"]>, string> = {
  blue: "from-[#2fe92b]/20 to-[#2fe92b]/5 border-[#2fe92b]/30 text-[#2fe92b]",
  emerald: "from-[#2fe92b]/20 to-[#2fe92b]/5 border-[#2fe92b]/30 text-[#2fe92b]",
  indigo: "from-[#ff9821]/20 to-[#ff9821]/5 border-[#ff9821]/30 text-[#ff9821]",
  amber: "from-[#f57733]/20 to-[#f57733]/5 border-[#f57733]/30 text-[#f57733]",
};

function DefaultStoreButtons() {
  return (
    <>
      <a
        href="/register"
        aria-label="Get started free"
        className="btn-modern-light flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group no-underline focus:outline-none focus:ring-2 focus:ring-[#2fe92b] focus:ring-offset-2"
      >
        <div className="text-left">
          <div className="text-[10px] font-bold tracking-wider text-black dark:text-neutral-900 uppercase mb-[-2px]">Free for students</div>
          <div className="text-xl font-bold leading-none tracking-tight">Get started</div>
        </div>
      </a>
      <a
        href="/login"
        aria-label="Sign in"
        className="btn-modern-dark flex items-center justify-center gap-3 px-8 py-4 rounded-[1.25rem] group no-underline focus:outline-none focus:ring-2 focus:ring-[#2fe92b] focus:ring-offset-2 focus:ring-offset-background"
      >
        <div className="text-left">
          <div className="text-[10px] font-bold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase mb-[-2px]">Already preparing?</div>
          <div className="text-xl font-bold leading-none tracking-tight">Sign in</div>
        </div>
      </a>
    </>
  );
}

export function CinematicHero({ 
  brandName = "Placement AI",
  tagline1 = "Prep smarter,",
  tagline2 = "land the offer.",
  cardHeading = "Placement readiness, decoded.",
  cardDescription = <>PlacementAI syncs your coding profiles, scores your readiness, and matches you with top tier opportunities.</>,
  metricValue = 87,
  metricLabel = "Readiness Score",
  ctaHeading = "Your offer starts here.",
  ctaDescription = "Connect your coding profiles in under a minute and get an AI-powered placement readiness report today.",
  ctaActions,
  badges = DEFAULT_BADGES,
  phoneEyebrow,
  phoneTitle,
  phoneInitials,
  phoneItems,
  laptopEyebrow,
  laptopTitle,
  laptopInitials,
  laptopItems,
  brandClassName,
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  const resolvedEyebrow = laptopEyebrow ?? phoneEyebrow ?? "This week";
  const resolvedTitle = laptopTitle ?? phoneTitle ?? "Readiness";
  const resolvedInitials = laptopInitials ?? phoneInitials ?? "PA";
  const resolvedItems = laptopItems ?? phoneItems;

  // 1. High-Performance Mouse Interaction Logic (Using requestAnimationFrame)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);
      
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          mainCardRef.current.style.setProperty("--mouse-x", `${mouseX}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${mouseY}px`);

          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

          gsap.to(mockupRef.current, {
            rotationY: xVal * 8,
            rotationX: -yVal * 6,
            ease: "power3.out",
            duration: 1.2,
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Refined Cinematic Scroll Timeline (Snappy & Responsive)
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Start in a visible, clean state
      gsap.set(".text-track", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 0% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 150, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".laptop-widget", ".mockup-widget", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      // Trigger on sectionRef, pin containerRef inside the section to prevent React DOM tree mutability conflicts
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: containerRef.current,
          start: "top top",
          end: "+=2600",
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      scrollTl
        // 1. Fade/blur background title as the physical card ascends
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.05, opacity: 0.15, ease: "power2.inOut", duration: 1.2 }, 0)
        .to(".main-card", { y: 0, scale: 1, ease: "power3.inOut", duration: 1.5 }, 0)
        
        // 2. Laptop 3D entry
        .fromTo(".mockup-scroll-wrapper",
          { y: 180, z: -350, rotationX: 35, rotationY: -18, autoAlpha: 0, scale: 0.8 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.8 }, "-=0.6"
        )
        // 3. Stagger reveal widgets inside screen and beside it
        .fromTo([".laptop-widget", ".mockup-widget", ".phone-widget"], { y: 20, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.08, ease: "back.out(1.2)", duration: 1.2 }, "-=1.2")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 1.5, ease: "power3.inOut" }, "-=1.0")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 1.5, ease: "expo.out" }, "-=1.5")
        
        // 4. Reveal floating badges & flanking panels
        .fromTo(".floating-badge", { y: 40, autoAlpha: 0, scale: 0.8 }, { y: 0, autoAlpha: 1, scale: 1, ease: "back.out(1.5)", duration: 1.0, stagger: 0.15 }, "-=1.2")
        .fromTo(".card-left-text", { x: -35, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.0 }, "-=1.0")
        .fromTo(".card-right-text", { x: 35, autoAlpha: 0, scale: 0.95 }, { x: 0, autoAlpha: 1, ease: "expo.out", duration: 1.0 }, "<")
        
        // Brief plateau to inspect the dashboard
        .to({}, { duration: 1.5 })
        
        // Transition to final hero CTA pullback
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 }) 
        .to({}, { duration: 0.6 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.94, y: -25, z: -120, autoAlpha: 0, ease: "power3.in", duration: 0.8, stagger: 0.03,
        })
        .to(".main-card", { 
          scale: isMobile ? 0.96 : 0.94, 
          ease: "expo.inOut", 
          duration: 1.2 
        }, "pullback") 
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.2 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 250, ease: "power3.in", duration: 1.0 })
        .to(".cta-wrapper", { autoAlpha: 0, ease: "power2.in", duration: 0.6 }, "-=0.5");

    }, sectionRef.current);

    return () => ctx.revert();
  }, [metricValue]); 

  const [badgeTop, badgeBottom] = badges;

  return (
    <section ref={sectionRef} className="relative w-full overflow-x-clip">
      <div
        ref={containerRef}
        className={cn("relative w-full h-screen min-h-[100dvh] overflow-hidden flex items-center justify-center bg-transparent text-foreground font-sans antialiased", className)}
        style={{ perspective: "1500px" }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
        <div className="film-grain" aria-hidden="true" />
        <div className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-40" aria-hidden="true" />

        {/* BACKGROUND LAYER 1: Hero Texts */}
        <div className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-full px-4 will-change-transform transform-style-3d">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/15 dark:bg-[#2fe92b]/15 border border-emerald-600/30 dark:border-[#2fe92b]/30 text-[11px] sm:text-xs font-bold text-emerald-800 dark:text-[#2fe92b] mb-4 shadow-[0_0_20px_rgba(5,150,105,0.15)] dark:shadow-[0_0_20px_rgba(47,233,43,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#2fe92b] animate-ping" />
            <span>Next-Gen College Placement AI Engine</span>
          </div>
          <h1 className="text-track text-3d-matte text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black tracking-tight mb-2">
            {tagline1}
          </h1>
          <h1 className="text-days text-silver-matte text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black tracking-tighter">
            {tagline2}
          </h1>
          <p className="hero-sub-text mt-3 sm:mt-4 text-sm sm:text-base md:text-xl max-w-xl mx-auto font-medium px-2">
            Turn scattered LeetCode, Codeforces and GitHub grind into one definitive readiness score.
          </p>
          <div className="hero-scroll-prompt mt-5 sm:mt-6 flex items-center gap-2 text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase">
            <span>Scroll to inspect platform</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>

        {/* BACKGROUND LAYER 2: Tactile CTA Buttons */}
        <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-full px-4 gsap-reveal pointer-events-auto will-change-transform">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight text-silver-matte">
            {ctaHeading}
          </h2>
          <p className="hero-sub-text text-sm sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl mx-auto font-medium leading-relaxed px-2">
            {ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
            {ctaActions ?? <DefaultStoreButtons />}
          </div>
        </div>

        {/* FOREGROUND LAYER: The Physical Deep Card */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
          <div
            ref={mainCardRef}
            className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[94vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[24px] sm:rounded-[32px] md:rounded-[40px]"
          >
            <div className="card-sheen" aria-hidden="true" />

            {/* DYNAMIC RESPONSIVE 12-COL GRID (Desktop) / STACK (Mobile) */}
            <div className="relative w-full h-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 xl:px-10 flex flex-col justify-evenly lg:grid lg:grid-cols-12 items-center lg:gap-6 xl:gap-8 z-10 py-4 sm:py-6 lg:py-0 overflow-y-auto lg:overflow-visible">
              
              {/* 1. LEFT COLUMN: VALUE PROPOSITION COPY */}
              <div className="card-left-text gsap-reveal order-3 lg:order-1 lg:col-span-3 flex flex-col justify-center text-center lg:text-left z-20 w-full px-2 lg:px-0">
                <div className="card-val-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold mb-2 sm:mb-3 self-center lg:self-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>AI Readiness Radar</span>
                </div>
                <h3 className="card-val-heading text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 sm:mb-3 tracking-tight leading-tight">
                  {cardHeading}
                </h3>
                <div className="card-val-desc text-xs md:text-sm leading-relaxed mb-3 sm:mb-4 font-medium">
                  {cardDescription}
                </div>
                
                {/* Feature bullet list */}
                <div className="card-val-bullet-box hidden lg:flex flex-col space-y-2 pt-2 border-t text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="card-val-check w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="card-val-bullet">Auto-syncs LeetCode & Codeforces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="card-val-check w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="card-val-bullet">Matches dream company cutoffs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="card-val-check w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="card-val-bullet">Smart spaced repetition for CS core</span>
                  </div>
                </div>
              </div>

              {/* 2. CENTER COLUMN: MACBOOK PRO LAPTOP MOCKUP */}
              <div className="mockup-scroll-wrapper order-2 lg:order-2 lg:col-span-6 relative w-full h-[300px] xs:h-[340px] sm:h-[390px] md:h-[430px] lg:h-[480px] flex items-center justify-center z-10" style={{ perspective: "1200px" }}>
                
                {/* Laptop Wrapper with 3D Tilt */}
                <div className="relative w-full flex items-center justify-center">
                  {/* The Laptop Chassis with 3D Tilt */}
                  <div
                    ref={mockupRef}
                    className="laptop-chassis relative w-[min(100%,_530px)] max-w-[275px] xs:max-w-[325px] sm:max-w-[390px] md:max-w-[440px] lg:max-w-[490px] xl:max-w-[530px] flex flex-col items-center will-change-transform transform-style-3d"
                  >
                    {/* Floating Badges Positioned Outside the Laptop Bezel */}
                    <div className="floating-badge hidden sm:flex absolute -top-5 sm:-top-7 -left-3 sm:-left-7 lg:-left-10 card-floating-badge rounded-xl lg:rounded-2xl p-2 sm:p-2.5 items-center gap-2 z-30">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-emerald-500/20 dark:from-[#2fe92b]/30 to-emerald-500/5 dark:to-[#2fe92b]/5 flex items-center justify-center border border-emerald-500/30 dark:border-[#2fe92b]/40 text-emerald-800 dark:text-[#2fe92b]">
                        <span className="text-xs sm:text-sm drop-shadow-md">{badgeTop.icon}</span>
                      </div>
                      <div>
                        <p className="card-floating-title text-[11px] sm:text-xs font-bold tracking-tight">{badgeTop.title}</p>
                        <p className="card-floating-sub text-[9px] sm:text-[10px] font-semibold">{badgeTop.subtitle}</p>
                      </div>
                    </div>

                    <div className="floating-badge hidden sm:flex absolute -bottom-5 sm:-bottom-7 -right-3 sm:-right-7 lg:-right-10 card-floating-badge rounded-xl lg:rounded-2xl p-2 sm:p-2.5 items-center gap-2 z-30">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-b from-[#ff9821]/30 to-[#ff9821]/5 flex items-center justify-center border border-[#ff9821]/40 text-amber-700 dark:text-[#ff9821]">
                        <span className="text-xs sm:text-sm drop-shadow-md">{badgeBottom.icon}</span>
                      </div>
                      <div>
                        <p className="card-floating-title text-[11px] sm:text-xs font-bold tracking-tight">{badgeBottom.title}</p>
                        <p className="card-floating-sub text-[9px] sm:text-[10px] font-semibold">{badgeBottom.subtitle}</p>
                      </div>
                    </div>
                    {/* --- 1. THE LAPTOP SCREEN LID --- */}
                    <div className="laptop-lid w-full p-[5px] sm:p-[7px] md:p-[8px] pb-0 flex flex-col">
                      {/* Inner Black Bezel */}
                      <div className="laptop-screen-bezel relative w-full overflow-hidden flex flex-col pt-1 sm:pt-1.5 px-1.5 sm:px-2.5 pb-1.5 sm:pb-2.5 bg-[#050608]">
                        
                        {/* Top Webcam Notch Area */}
                        <div className="relative w-full flex items-center justify-center pb-0.5 sm:pb-1">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-white/5">
                            {/* Camera lens */}
                            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#12141a] border border-neutral-700/60 flex items-center justify-center">
                              <div className="w-0.5 h-0.5 rounded-full bg-blue-400/70" />
                            </div>
                            {/* Active green indicator LED */}
                            <div className="w-1 h-1 rounded-full bg-[#2fe92b] shadow-[0_0_6px_rgba(47,233,43,0.9)] animate-pulse" />
                          </div>
                        </div>

                        {/* Display Screen Panel (16:10 Ratio) */}
                        <div className="laptop-display-screen relative w-full aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden select-none transition-colors duration-300">
                          {/* Screen Glare Sheen */}
                          <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                          {/* macOS Window Title Bar */}
                          <div className="laptop-title-bar h-5 sm:h-6 px-2 sm:px-2.5 flex items-center justify-between shrink-0 z-30 transition-colors duration-300">
                            {/* Traffic Lights */}
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" />
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" />
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" />
                            </div>

                            {/* Centered Browser Address Pill */}
                            <div className="laptop-address-pill flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[7px] sm:text-[9px] font-mono transition-colors duration-300">
                              <svg className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-emerald-600 dark:text-[#2fe92b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span className="font-semibold card-floating-title">placementai.app</span>
                              <span className="card-floating-sub">/readiness</span>
                            </div>

                            {/* User Avatar Badge */}
                            <div className="flex items-center gap-1">
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-emerald-500/30 dark:from-[#2fe92b]/30 to-emerald-500/10 dark:to-[#2fe92b]/10 border border-emerald-600/40 dark:border-[#2fe92b]/40 text-emerald-800 dark:text-[#2fe92b] font-bold text-[7px] sm:text-[8px] flex items-center justify-center shadow-xs">
                                {resolvedInitials}
                              </div>
                            </div>
                          </div>

                          {/* Screen Dashboard Interface */}
                          <div className="relative flex-1 p-1.5 sm:p-2.5 overflow-hidden flex flex-col justify-between">
                            {/* App Subheader */}
                            <div className="laptop-widget mockup-widget laptop-sub-border flex items-center justify-between pb-1 border-b">
                              <div>
                                <div className="text-[6px] sm:text-[8px] uppercase tracking-widest font-extrabold text-emerald-700 dark:text-[#2fe92b]">{resolvedEyebrow}</div>
                                <div className="text-[9px] sm:text-xs font-extrabold tracking-tight laptop-item-title leading-none">{resolvedTitle}</div>
                              </div>
                              <div className="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 rounded-full bg-emerald-500/15 dark:bg-[#2fe92b]/15 border border-emerald-600/30 dark:border-[#2fe92b]/30 text-[6px] sm:text-[7px] text-emerald-800 dark:text-[#2fe92b] font-bold">
                                <span className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-[#2fe92b] animate-ping" />
                                <span>Live Synced</span>
                              </div>
                            </div>

                            {/* Two-Column App Dashboard Grid */}
                            <div className="grid grid-cols-12 gap-1.5 sm:gap-2 my-auto items-center">
                              {/* Left: Circular Readiness Score Gauge (5 cols) */}
                              <div className="col-span-5 flex flex-col items-center justify-center p-1 sm:p-1.5 rounded-lg sm:rounded-xl laptop-widget-box">
                                <div className="laptop-widget mockup-widget relative w-14 h-14 xs:w-16 xs:h-16 sm:w-18 sm:h-18 md:w-22 md:h-22 flex items-center justify-center">
                                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 176 176" aria-hidden="true">
                                    <circle className="laptop-score-track" cx="88" cy="88" r="64" fill="none" strokeWidth="12" />
                                    <circle className="progress-ring stroke-emerald-600 dark:stroke-[#2fe92b]" cx="88" cy="88" r="64" fill="none" strokeWidth="12" />
                                  </svg>
                                  <div className="text-center z-10 flex flex-col items-center">
                                    <span className="counter-val laptop-score-text text-sm xs:text-base sm:text-xl md:text-2xl font-black tracking-tighter">0</span>
                                    <span className="laptop-score-label text-[5px] xs:text-[6px] sm:text-[7px] uppercase tracking-wider font-extrabold">{metricLabel}</span>
                                  </div>
                                </div>
                                <div className="laptop-widget mockup-widget mt-0.5 px-1 py-0.5 rounded bg-emerald-500/15 dark:bg-[#2fe92b]/15 text-[6px] sm:text-[7px] font-bold text-emerald-800 dark:text-[#2fe92b] tracking-tight text-center">
                                  Tier-1 Qualified
                                </div>
                              </div>

                              {/* Right: Platform Metrics & Topic Recommendations (7 cols) */}
                              <div className="col-span-7 flex flex-col justify-between space-y-1">
                                {resolvedItems ? (
                                  resolvedItems.map((item, i) => (
                                    <div key={i} className="laptop-widget mockup-widget laptop-widget-box rounded sm:rounded-lg p-1 sm:p-1.5 flex items-center gap-1 sm:gap-1.5">
                                      <div className={cn("w-5 h-5 sm:w-6 sm:h-6 rounded bg-gradient-to-br flex items-center justify-center shrink-0 border shadow-inner text-[9px] sm:text-[10px]", TONE_CLASSES[item.tone ?? "blue"])}>
                                        {item.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-[8px] sm:text-[10px] font-bold laptop-item-title leading-tight truncate">{item.title}</div>
                                        <div className="text-[6px] sm:text-[8px] laptop-item-sub font-medium leading-tight truncate mt-0.5">{item.subtitle}</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <>
                                    <div className="laptop-widget mockup-widget laptop-widget-box rounded p-1 flex items-center gap-1.5">
                                      <div className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-[9px]">✓</div>
                                      <div className="flex-1">
                                        <div className="h-1 w-14 bg-slate-400 dark:bg-neutral-300 rounded-full mb-1" />
                                        <div className="h-1 w-8 bg-slate-300 dark:bg-neutral-600 rounded-full" />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Target Skill Focus Strip */}
                                <div className="laptop-widget mockup-widget rounded laptop-widget-box p-1 flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-[#ff9821]" />
                                    <span className="text-[6px] sm:text-[7px] font-semibold laptop-chip-label truncate">DSA & DP Focus</span>
                                  </div>
                                  <span className="text-[6px] sm:text-[7px] font-bold laptop-chip-val">92% Fit</span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Dock / Status Strip */}
                            <div className="laptop-widget mockup-widget pt-0.5 laptop-sub-border border-t flex items-center justify-between text-[5px] sm:text-[7px] font-medium">
                              <span className="laptop-dock-label">PlacementAI Engine</span>
                              <span className="laptop-dock-accent font-mono font-semibold">LeetCode · Codeforces · GitHub</span>
                            </div>
                          </div>
                        </div>

                        {/* Display Bottom Chin with subtle brand engraving */}
                        <div className="w-full pt-0.5 sm:pt-1 flex items-center justify-center">
                          <span className="text-[5px] sm:text-[6px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-neutral-500">PlacementAI</span>
                        </div>
                      </div>
                    </div>

                    {/* --- 2. THE LAPTOP HINGE --- */}
                    <div className="laptop-hinge w-[24%] sm:w-[28%] h-[2.5px] sm:h-[3px] mx-auto rounded-b-sm z-10" />

                    {/* --- 3. THE LAPTOP BASE CHASSIS (KEYBOARD DECK FRONT) --- */}
                    <div className="relative w-[108%] -ml-[4%] z-0">
                      {/* Base top chamfer edge reflection */}
                      <div className="laptop-base-top h-[1.5px] sm:h-[2px] w-full" />
                      
                      {/* Base front lip with thumb opening notch */}
                      <div className="laptop-base-lip h-[7px] sm:h-[9px] md:h-[11px] w-full flex justify-center items-start">
                        <div className="laptop-notch-opening w-10 sm:w-14 h-1 sm:h-1.5" />
                      </div>

                      {/* Ambient cast shadow under laptop */}
                      <div className="absolute -bottom-3 inset-x-6 h-5 bg-black/90 blur-lg -z-10 rounded-full pointer-events-none" />
                    </div>

                  </div>
                </div>
              </div>

              {/* 3. RIGHT COLUMN: LIVE RECRUITMENT BENCHMARK PANEL */}
              <div className="card-right-text gsap-reveal order-3 lg:order-3 lg:col-span-3 flex flex-col justify-center items-center lg:items-end z-20 w-full px-2 lg:px-0">
                <div className="card-telemetry-box w-full max-w-[280px] rounded-2xl p-3 sm:p-4 backdrop-blur-xl">
                  <div className="card-telemetry-header-border flex items-center justify-between pb-2 sm:pb-3 mb-2 sm:mb-3 border-b">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-[#2fe92b] shadow-[0_0_8px_rgba(5,150,105,0.4)] dark:shadow-[0_0_8px_rgba(47,233,43,0.8)]" />
                      <span className="card-telemetry-title text-xs font-bold uppercase tracking-wider">Target Telemetry</span>
                    </div>
                    <span className="card-telemetry-sub text-[10px] font-mono font-semibold">2026 Batch</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="card-telemetry-label font-medium">Tier-1 Fit</span>
                      <span className="card-telemetry-ready font-bold">94% Ready</span>
                    </div>
                    <div className="card-telemetry-track w-full h-1.5 rounded-full overflow-hidden">
                      <div className="card-telemetry-bar h-full rounded-full" style={{ width: "94%" }} />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="card-telemetry-label font-medium">Target Companies</span>
                      <span className="card-telemetry-val font-bold">Google, Amazon</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="card-telemetry-label font-medium">Candidate Cohort</span>
                      <span className="card-telemetry-val font-bold">Top 4.8%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="card-telemetry-label font-medium">Next Priority</span>
                      <span className="card-telemetry-priority font-bold">DP on Trees</span>
                    </div>
                  </div>

                  <div className="card-telemetry-header-border mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t flex items-center justify-between text-[11px] font-medium">
                    <span className="card-telemetry-label">AI Vector Score</span>
                    <span className="card-telemetry-val font-mono font-bold">0.892 / 1.0</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CinematicHero;
