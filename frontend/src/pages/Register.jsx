import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api, setAuthToken } from '../api/client';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Register({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    college: 'Engineering Institute of Technology',
    branch: 'Computer Science and Engineering',
    graduation_year: 2026,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduation_year' ? parseInt(value) || '' : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Register
      await api.post('/auth/register', formData);
      
      // Auto login
      const loginRes = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      setAuthToken(loginRes.access_token);

      const me = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(me));

      if (onLoginSuccess) onLoginSuccess(me);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'var(--input)',
    color: 'var(--foreground)',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    color: 'var(--muted-foreground)',
    marginBottom: '4px',
    fontWeight: 600
  };

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'transparent', color: 'var(--foreground)', padding: '24px 16px' }}>
      {/* Top right ThemeToggle */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle variant="sm" />
      </div>

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="auth-card"
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'var(--card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius)',
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius)',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 4px 20px var(--primary-glow)',
            }}
          >
            <Sparkles size={22} color="var(--primary-foreground)" />
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.025em', color: 'var(--foreground)' }}>
            Student Onboarding
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Initialize your placement preparation &amp; AI tracking ecosystem
          </p>

          {error && (
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 81, 2, 0.15)',
                border: '1px solid rgba(255, 81, 2, 0.35)',
                color: 'var(--destructive)',
                padding: '10px 14px',
                borderRadius: 'var(--radius)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={labelStyle}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                required
                placeholder="e.g. Aditya Sharma"
                value={formData.full_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="split-grid-sm">
              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>
                  College Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="aditya@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  maxLength={128}
                  placeholder="Min 8 chars"
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={labelStyle}>
                College / University
              </label>
              <input
                type="text"
                name="college"
                required
                placeholder="College Name"
                value={formData.college}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div className="split-grid-sm">
              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>
                  Engineering Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer'
                  }}
                >
                  <option value="Computer Science and Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Electrical Engineering">EE</option>
                  <option value="Mechanical Engineering">ME</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={labelStyle}>
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduation_year"
                  required
                  min={2024}
                  max={2030}
                  value={formData.graduation_year}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginTop: '8px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px var(--primary-glow)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creating Profile & Seeding Modules...' : 'Register & Launch'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ height: 1, background: 'var(--border)', width: '100%', margin: '1.25rem 0' }} />

          <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                textDecoration: 'none',
                marginLeft: '4px'
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
