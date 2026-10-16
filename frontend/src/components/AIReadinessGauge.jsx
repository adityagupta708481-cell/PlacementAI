import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Sparkles, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AIReadinessGauge({ score = 0, tier = "Analyzing..." }) {
  const { isDark } = useTheme();
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const remaining = 100 - clampedScore;

  // Determine color based on readiness using theme tokens
  let primaryColor = isDark ? '#ff5102' : '#dc2626'; // Destructive (<40)
  let glowColor = isDark ? 'rgba(255, 81, 2, 0.45)' : 'rgba(220, 38, 38, 0.35)';
  let tierBadgeClass = 'badge-urgent';

  if (clampedScore >= 75) {
    primaryColor = isDark ? '#2fe92b' : '#059669'; // Tier-1 Emerald Green
    glowColor = isDark ? 'rgba(47, 233, 43, 0.45)' : 'rgba(5, 150, 105, 0.35)';
    tierBadgeClass = 'badge-tier1';
  } else if (clampedScore >= 55) {
    primaryColor = isDark ? '#ff9821' : '#d97706'; // Mid-Tech Amber
    glowColor = isDark ? 'rgba(255, 152, 33, 0.45)' : 'rgba(217, 119, 6, 0.35)';
    tierBadgeClass = 'badge-mid';
  } else if (clampedScore >= 40) {
    primaryColor = isDark ? '#f57733' : '#ea580c'; // Services Orange
    glowColor = isDark ? 'rgba(245, 119, 51, 0.45)' : 'rgba(234, 88, 12, 0.35)';
    tierBadgeClass = 'badge-services';
  }

  const trackBg = isDark ? '#151922' : '#d1d7e2';

  const data = {
    datasets: [
      {
        data: [clampedScore, remaining],
        backgroundColor: [primaryColor, trackBg],
        borderColor: ['transparent', 'transparent'],
        borderWidth: 0,
        circumference: 240,
        rotation: 240,
        cutout: '82%',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 850,
      easing: 'easeOutQuart',
    },
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  return (
    <div className="glass-panel" style={{ padding: 'clamp(20px, 3vw, 28px)', textAlign: 'center', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color={primaryColor} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>AI Placement Readiness</h3>
        </div>
        <span className={`badge ${tierBadgeClass}`}>
          <Award size={14} />
          {clampedScore >= 75 ? 'Tier-1 Ready' : clampedScore >= 55 ? 'Mid-Tech Ready' : clampedScore >= 40 ? 'Services Ready' : 'Foundation'}
        </span>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '220px', height: '170px', margin: '0 auto' }}>
        <Doughnut data={data} options={options} />
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: primaryColor, textShadow: `0 0 20px ${glowColor}` }}>
            {clampedScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Readiness Index
          </div>
        </div>
      </div>

      <div style={{ marginTop: '8px', borderTop: '1px solid var(--card-border)', paddingTop: '14px' }}>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
          Predicted Hireability Tier
        </div>
        <div style={{ fontSize: '0.98rem', fontWeight: '600', color: 'var(--text-main)' }}>
          {tier}
        </div>
      </div>
    </div>
  );
}
