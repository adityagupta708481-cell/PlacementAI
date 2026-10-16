import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Code2,
  BrainCircuit,
  BookOpen,
  LogOut,
  Sparkles,
  User,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { getAuthToken, removeAuthToken } from './api/client';
import Dashboard from './pages/Dashboard';
import CodingProfiles from './pages/CodingProfiles';
import AIAnalysis from './pages/AIAnalysis';
import CSFundamentals from './pages/CSFundamentals';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import DemoOne from './components/ui/demo';
import DotMatrixBackground from './components/ui/DotMatrixBackground';
import AetherFlowBackground from './components/ui/AetherFlowBackground';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ui/ThemeToggle';

function DynamicBackground() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/demo';

  return isAuthPage ? <DotMatrixBackground /> : <AetherFlowBackground />;
}

function ProtectedLayout({ children, onLogout }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch (_) {}
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Coding Profiles', path: '/coding', icon: Code2 },
    { name: 'AI Placement Engine', path: '/ai-analysis', icon: BrainCircuit },
    { name: 'CS & Aptitude', path: '/cs-fundamentals', icon: BookOpen },
  ];

  return (
    <div className="app-container">
      {/* Mobile Top Header (visible < 1024px) */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius)',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px var(--primary-glow)',
            }}
          >
            <Sparkles size={16} color="var(--primary-foreground)" />
          </div>
          <span style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '-0.01em', color: 'var(--foreground)' }}>PlacementAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle variant="sm" />
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="app-sidebar"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      <div
        className={`sidebar-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar (static on desktop, slide-in drawer on mobile) */}
      <aside id="app-sidebar" className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 24px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius)',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px var(--primary-glow)',
              }}
            >
              <Sparkles size={20} color="var(--primary-foreground)" />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--sidebar-foreground)' }}>
                PlacementAI
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Readiness Engine
              </div>
            </div>
          </div>
          <ThemeToggle variant="sm" />
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '24px', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                  background: isActive ? 'var(--primary-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div style={{ borderTop: '1px solid var(--sidebar-border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '0 4px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <User size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--sidebar-foreground)' }}>
                {currentUser?.full_name || 'Student User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.email || 'Logged in'}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area with fluid route transitions */}
      <main className="main-content">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(getAuthToken());

  const handleLogout = () => {
    removeAuthToken();
    setToken(null);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Dynamic Ambient Background across whole frontend */}
        <DynamicBackground isLoggedIn={!!token} />

      <Routes>
        {/* Public cinematic landing page (always reachable) */}
        <Route path="/welcome" element={<Landing />} />

        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login onLoginSuccess={() => setToken(getAuthToken())} />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" replace /> : <Register onLoginSuccess={() => setToken(getAuthToken())} />}
        />

        {/* Standalone component demo */}
        <Route path="/demo" element={<DemoOne />} />

        <Route
          path="/"
          element={
            token ? (
              <ProtectedLayout onLogout={handleLogout}>
                <Dashboard />
              </ProtectedLayout>
            ) : (
              <Landing />
            )
          }
        />

        <Route
          path="/coding"
          element={
            token ? (
              <ProtectedLayout onLogout={handleLogout}>
                <CodingProfiles />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/ai-analysis"
          element={
            token ? (
              <ProtectedLayout onLogout={handleLogout}>
                <AIAnalysis />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/cs-fundamentals"
          element={
            token ? (
              <ProtectedLayout onLogout={handleLogout}>
                <CSFundamentals />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  );
}


