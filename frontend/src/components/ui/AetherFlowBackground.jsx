import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AetherFlowBackground
 * Ultra-smooth, high-performance ambient particle canvas.
 * - Batched 2D draw calls (1-2 strokes per frame instead of 1000+)
 * - Distance-squared spatial check (avoids expensive Math.sqrt)
 * - Adaptive particle count capped for 60/120fps fluid execution
 * - Pauses execution when tab is hidden (zero background CPU waste)
 * - DPR clamped to 2 for crisp retina rendering without fill-rate bottleneck
 * - Theme-reactive: Adapts clear background and particle palette seamlessly
 */
export default function AetherFlowBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const isDarkRef = useRef(isDark);
  const particlesRef = useRef([]);

  const darkColors = [
    'rgba(47, 233, 43, 0.95)',   // Neon green #2fe92b (Primary)
    'rgba(47, 233, 43, 0.6)',    // Neon green ambient
    'rgba(255, 152, 33, 0.85)',  // Warm amber #ff9821
    'rgba(245, 119, 51, 0.85)',  // Coral orange #f57733
    'rgba(187, 203, 178, 0.8)',  // Sage #bbcbb2
  ];

  const lightColors = [
    'rgba(5, 150, 105, 0.92)',   // Lustrous emerald #059669 (Primary)
    'rgba(16, 185, 129, 0.75)',  // Emerald ambient #10b981
    'rgba(217, 119, 6, 0.85)',   // Amber #d97706
    'rgba(234, 88, 12, 0.8)',    // Orange #ea580c
    'rgba(71, 85, 105, 0.75)',   // Slate gray #475569
  ];

  // Dynamically update particle palette when theme changes
  useEffect(() => {
    isDarkRef.current = isDark;
    const colors = isDark ? darkColors : lightColors;
    particlesRef.current.forEach((p) => {
      p.color = colors[Math.floor(Math.random() * colors.length)];
    });
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animationFrameId;
    let isTabVisible = !document.hidden;
    const mouse = { x: null, y: null, radiusSq: 180 * 180 };

    class Particle {
      constructor(x, y, vx, vy, size, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
      }

      update(width, height) {
        // Bounce off bounds
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Smooth mouse deflection
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouse.radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (180 - dist) / 180;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
      }
    }

    const initParticles = (width, height) => {
      particlesRef.current = [];
      const isMobile = width < 768;
      // High-fluidity particle count ensures stable 60-120fps on any GPU
      const targetCount = isMobile ? 36 : Math.min(75, Math.floor((width * height) / 19000));
      const colors = isDarkRef.current ? darkColors : lightColors;

      for (let i = 0; i < targetCount; i++) {
        const size = Math.random() * 2.2 + 1.2;
        const x = Math.random() * (width - 20) + 10;
        const y = Math.random() * (height - 20) + 10;
        const vx = (Math.random() - 0.5) * 0.45;
        const vy = (Math.random() - 0.5) * 0.45;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesRef.current.push(new Particle(x, y, vx, vy, size, color));
      }
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
    };

    resize();

    // High performance batched render loop
    const maxDist = 135;
    const maxDistSq = maxDist * maxDist;

    const render = () => {
      if (!isTabVisible) return;
      animationFrameId = requestAnimationFrame(render);

      // Fast solid clear with theme background
      ctx.fillStyle = isDarkRef.current ? '#07080b' : '#ebedf2';
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const pLen = particles.length;

      // 1. Update particles & draw them
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        p.update(width, height);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // 2. Batch line rendering into two passes: ambient pass and mouse-highlight pass
      ctx.beginPath();
      let hasAmbientLines = false;
      const mouseLines = [];

      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            let isNearMouse = false;
            if (mouse.x !== null && mouse.y !== null) {
              const mdx = p1.x - mouse.x;
              const mdy = p1.y - mouse.y;
              if (mdx * mdx + mdy * mdy < mouse.radiusSq) {
                isNearMouse = true;
              }
            }

            if (isNearMouse) {
              mouseLines.push(p1.x, p1.y, p2.x, p2.y);
            } else {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              hasAmbientLines = true;
            }
          }
        }
      }

      // Stroke all ambient lines at once
      if (hasAmbientLines) {
        ctx.strokeStyle = isDarkRef.current ? 'rgba(47, 233, 43, 0.16)' : 'rgba(5, 150, 105, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Stroke mouse-highlighted lines at once
      if (mouseLines.length > 0) {
        ctx.beginPath();
        for (let k = 0; k < mouseLines.length; k += 4) {
          ctx.moveTo(mouseLines[k], mouseLines[k + 1]);
          ctx.lineTo(mouseLines[k + 2], mouseLines[k + 3]);
        }
        ctx.strokeStyle = isDarkRef.current ? 'rgba(47, 233, 43, 0.65)' : 'rgba(5, 150, 105, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    // Passive & throttled mouse events
    let mouseRaf = 0;
    const onMouseMove = (e) => {
      cancelAnimationFrame(mouseRaf);
      mouseRaf = requestAnimationFrame(() => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
    };

    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      cancelAnimationFrame(mouseRaf);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'translateZ(0)',
        }}
      />
      {/* Subtle depth vignette to ensure perfect readability of cards & typography */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'background 0.3s ease',
          background: isDark
            ? 'radial-gradient(circle at 50% 35%, rgba(0, 0, 0, 0.08) 0%, rgba(7, 8, 11, 0.65) 100%)'
            : 'radial-gradient(circle at 50% 35%, rgba(235, 237, 242, 0.05) 0%, rgba(209, 215, 226, 0.45) 100%)',
        }}
      />
    </>
  );
}
