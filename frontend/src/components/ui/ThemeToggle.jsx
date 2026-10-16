import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Laptop, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Custom Animated Sun Glyph with rotating solar corona and warm glow
 */
function SunGlyph({ size = 18 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.55)]"
      initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Central Sun Disc */}
      <motion.circle
        cx="12"
        cy="12"
        r="4.5"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
      />
      {/* 8 Radial Rays */}
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </motion.svg>
  );
}

/**
 * Custom Animated Moon Glyph with cyber-emerald crescent and twinkling stars
 */
function MoonGlyph({ size = 18 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-emerald-400 drop-shadow-[0_0_8px_rgba(47,233,43,0.55)]"
      initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Crescent Moon */}
      <path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
      />
      {/* Twinkling Star 1 */}
      <motion.circle
        cx="19"
        cy="5"
        r="1"
        fill="currentColor"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      />
      {/* Twinkling Star 2 */}
      <motion.circle
        cx="18"
        cy="11"
        r="0.75"
        fill="currentColor"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

/**
 * Custom Animated System / Device Glyph
 */
function SystemGlyph({ size = 18, isDark = true }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <rect width="20" height="14" x="2" y="3" rx="2" fill="currentColor" fillOpacity="0.1" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
      {/* Split screen preview inside display */}
      <path
        d="M 2 10 L 22 10"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <circle cx="12" cy="7" r="1.5" fill={isDark ? '#2fe92b' : '#ff9821'} />
    </motion.svg>
  );
}

/**
 * Senior-level ThemeToggle component with:
 * 1. Fluid spring micro-interactions & custom SVG glyphs
 * 2. Circular View Transitions API integration
 * 3. 3-state system preference support ('light' | 'dark' | 'system')
 * 4. Ambient theme glow aura
 * 5. Right-click / dropdown fast theme switcher popover
 * 6. Global keyboard shortcut ('Alt + T')
 * 7. Multiple presentation variants: 'default', 'sm', 'pill'/'segmented', 'dropdown'
 */
export default function ThemeToggle({
  className = '',
  style = {},
  variant = 'default',
  enableShortcut = true,
  showDropdown = false,
}) {
  const { theme, resolvedTheme, isDark, toggleTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const containerRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  // Close context dropdown on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Global keyboard shortcut listener (Alt + T or Option + T)
  useEffect(() => {
    if (!enableShortcut) return;
    const handleGlobalKey = (e) => {
      // Check Alt+T / Option+T
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        const target = e.target;
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;
        if (!isInput) {
          e.preventDefault();
          toggleTheme(e);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [enableShortcut, toggleTheme]);

  // Hover Tooltip Handlers
  const handleMouseEnter = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipVisible(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setTooltipVisible(false);
  };

  // Right-click / context menu handler to open 3-way theme selector
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuOpen((prev) => !prev);
  };

  const isSmall = variant === 'sm';

  // -------------------------------------------------------------
  // PILL / SEGMENTED VARIANT (Sun | System | Moon)
  // -------------------------------------------------------------
  if (variant === 'pill' || variant === 'segmented') {
    const options = [
      { id: 'light', label: 'Light Gray', icon: Sun },
      { id: 'system', label: 'System', icon: Laptop },
      { id: 'dark', label: 'Dark', icon: Moon },
    ];

    return (
      <div
        ref={containerRef}
        role="radiogroup"
        aria-label="Theme selection"
        className={`inline-flex items-center p-1 rounded-full border border-border bg-secondary/80 backdrop-blur-md shadow-inner ${className}`}
        style={style}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={(e) => setTheme(opt.id, e)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors duration-200 z-10 cursor-pointer ${
                isSelected
                  ? 'text-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-theme-pill"
                  className="absolute inset-0 rounded-full bg-card shadow-sm border border-border/80"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <Icon
                size={14}
                className={
                  isSelected
                    ? opt.id === 'light'
                      ? 'text-amber-500'
                      : opt.id === 'dark'
                      ? 'text-emerald-400'
                      : 'text-cyan-400'
                    : ''
                }
              />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // -------------------------------------------------------------
  // DROPDOWN VARIANT
  // -------------------------------------------------------------
  if (variant === 'dropdown') {
    return (
      <div ref={containerRef} className={`relative inline-block ${className}`} style={style}>
        <motion.button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
          aria-label="Theme menu"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-secondary/80 backdrop-blur-md text-foreground text-xs font-medium hover:border-primary/50 transition-colors shadow-sm"
        >
          {theme === 'system' ? (
            <Laptop size={15} className="text-cyan-400" />
          ) : isDark ? (
            <Moon size={15} className="text-emerald-400" />
          ) : (
            <Sun size={15} className="text-amber-500" />
          )}
          <span className="capitalize">{theme}</span>
          <ChevronDown
            size={13}
            className={`text-muted-foreground transition-transform duration-200 ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <ThemeMenuDropdown
              theme={theme}
              onSelect={(mode, e) => {
                setTheme(mode, e);
                setMenuOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DEFAULT / COMPACT ICON BUTTON (Navbar, Sidebar, Mobile Header)
  // -------------------------------------------------------------
  const buttonSize = isSmall ? 34 : 38;
  const iconSize = isSmall ? 16 : 18;

  const glowStyle = isDark
    ? 'rgba(47, 233, 43, 0.22)'
    : 'rgba(5, 150, 105, 0.22)';

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      style={style}
    >
      <motion.button
        type="button"
        onClick={(e) => toggleTheme(e)}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        aria-label={`Switch theme (currently ${theme === 'light' ? 'Light Gray' : theme}). Right-click or press Alt+T for options.`}
        title={`Theme: ${theme === 'light' ? 'Light Gray' : theme === 'system' ? `System (${resolvedTheme === 'light' ? 'Light Gray' : 'Dark'})` : 'Dark'} — Click to toggle, Right-click for menu (Alt+T)`}
        className="theme-toggle-btn relative inline-flex items-center justify-center cursor-pointer select-none rounded-[10px] border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 group"
        style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          background: 'var(--secondary)',
          borderColor: 'var(--border)',
          color: 'var(--foreground)',
          boxShadow: `0 2px 10px ${glowStyle}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
        }}
      >
        {/* Ambient Pulsing Glow on Hover */}
        <motion.div
          className="absolute inset-0 rounded-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: isDark
              ? '0 0 16px 2px rgba(47, 233, 43, 0.35)'
              : '0 0 16px 2px rgba(5, 150, 105, 0.35)',
          }}
        />

        {/* System Mode LED Indicator Badge */}
        {theme === 'system' && (
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-card animate-pulse"
            title="Auto System theme active"
          />
        )}

        {/* Animated Icon Morphing */}
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'system' ? (
            <SystemGlyph key="system" size={iconSize} isDark={isDark} />
          ) : isDark ? (
            <MoonGlyph key="moon" size={iconSize} />
          ) : (
            <SunGlyph key="sun" size={iconSize} />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Right-Click / Option Menu Popover */}
      <AnimatePresence>
        {menuOpen && (
          <ThemeMenuDropdown
            theme={theme}
            onSelect={(mode, e) => {
              setTheme(mode, e);
              setMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Micro-Tooltip on prolonged hover */}
      <AnimatePresence>
        {tooltipVisible && !menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium bg-card/95 backdrop-blur-md border border-border text-foreground shadow-lg flex items-center gap-1.5"
          >
            <span>
              Theme: <strong className="capitalize">{theme === 'light' ? 'Light Gray' : theme}</strong>
            </span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-muted text-muted-foreground font-mono">
              Alt+T
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Reusable Floating Theme Menu Dropdown
 */
function ThemeMenuDropdown({ theme, onSelect }) {
  const options = [
    {
      id: 'light',
      label: 'Light Gray',
      desc: 'Refined slate-gray clarity & ergonomics',
      icon: Sun,
      color: 'text-amber-500',
      badge: 'Light Gray',
    },
    {
      id: 'dark',
      label: 'Dark',
      desc: 'Signature cyberpunk neon stealth',
      icon: Moon,
      color: 'text-emerald-400',
      badge: 'Neon',
    },
    {
      id: 'system',
      label: 'System',
      desc: 'Synchronize with OS',
      icon: Laptop,
      color: 'text-cyan-400',
      badge: 'Auto',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 6 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-1.5 shadow-2xl z-[150] text-foreground"
    >
      <div className="px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center justify-between border-b border-border/50 mb-1">
        <span>Appearance</span>
        <span className="font-mono text-[9px] text-primary">Alt+T</span>
      </div>

      <div className="flex flex-col gap-0.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={(e) => onSelect(opt.id, e)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                isSelected
                  ? 'bg-secondary font-semibold text-foreground'
                  : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center bg-card border border-border/60 ${opt.color}`}
                >
                  <Icon size={14} />
                </div>
                <div>
                  <div className="leading-tight">{opt.label}</div>
                  <div className="text-[10px] text-muted-foreground font-normal leading-tight">
                    {opt.desc}
                  </div>
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                >
                  <Check size={14} className="text-primary" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
