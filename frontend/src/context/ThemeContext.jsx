import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { playThemeSound } from '../utils/themeAudio';

const THEME_STORAGE_KEY = 'placement_theme';

const ThemeContext = createContext({
  theme: 'dark',
  resolvedTheme: 'dark',
  isDark: true,
  systemTheme: 'dark',
  toggleTheme: () => {},
  cycleTheme: () => {},
  setTheme: () => {},
});

/**
 * Senior-level ThemeProvider with:
 * - 3-state theme support ('dark' | 'light' | 'system')
 * - Real-time OS color scheme synchronization
 * - Cross-tab real-time sync via storage events
 * - Circular ripple View Transitions API with fallback
 * - Synthesized tactile micro-audio feedback
 */
export function ThemeProvider({ children }) {
  // 1. Initial theme selection (defaulting to dark signature mode)
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          return saved;
        }
      } catch (_) {}
    }
    return 'dark';
  });

  // 2. Track OS theme preference
  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  // 3. Listen to live OS theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, []);

  // 4. Compute active resolved theme
  const resolvedTheme = useMemo(() => {
    return theme === 'system' ? systemTheme : theme;
  }, [theme, systemTheme]);

  const isDark = resolvedTheme === 'dark';

  // Apply class and color scheme directly to document root
  const applyThemeToDOM = useCallback((mode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, []);

  // 5. Update DOM and persist to localStorage
  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) {}
  }, [theme, resolvedTheme, applyThemeToDOM]);

  // 6. Cross-tab synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        if (['dark', 'light', 'system'].includes(e.newValue)) {
          setThemeState(e.newValue);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 7. Transition orchestrator with Circular View Transitions API
  const switchThemeWithTransition = useCallback((nextTheme, event, options = {}) => {
    const { playSound = true } = options;
    const nextResolved = nextTheme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : nextTheme;

    if (playSound) {
      playThemeSound(nextTheme);
    }

    const canUseViewTransition =
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fast path: No transition API or target resolved is unchanged
    if (!canUseViewTransition || nextResolved === resolvedTheme) {
      applyThemeToDOM(nextResolved);
      setThemeState(nextTheme);
      return;
    }

    // Determine circular animation origin coordinates
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event) {
      if (typeof event.clientX === 'number' && typeof event.clientY === 'number' && (event.clientX !== 0 || event.clientY !== 0)) {
        x = event.clientX;
        y = event.clientY;
      } else if (event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
        const rect = event.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      const transition = document.startViewTransition(() => {
        applyThemeToDOM(nextResolved);
        setThemeState(nextTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 420,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {
        applyThemeToDOM(nextResolved);
        setThemeState(nextTheme);
      });
    } catch (_) {
      applyThemeToDOM(nextResolved);
      setThemeState(nextTheme);
    }
  }, [resolvedTheme, applyThemeToDOM]);

  // Set theme directly ('dark' | 'light' | 'system')
  const setTheme = useCallback((newTheme, event, options) => {
    if (['dark', 'light', 'system'].includes(newTheme)) {
      switchThemeWithTransition(newTheme, event, options);
    }
  }, [switchThemeWithTransition]);

  // Toggle between dark and light
  const toggleTheme = useCallback((event, options) => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    switchThemeWithTransition(nextTheme, event, options);
  }, [resolvedTheme, switchThemeWithTransition]);

  // Cycle through dark -> light -> system -> dark
  const cycleTheme = useCallback((event, options) => {
    let nextTheme = 'dark';
    if (theme === 'dark') nextTheme = 'light';
    else if (theme === 'light') nextTheme = 'system';
    else nextTheme = 'dark';
    switchThemeWithTransition(nextTheme, event, options);
  }, [theme, switchThemeWithTransition]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        isDark,
        systemTheme,
        toggleTheme,
        cycleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
