import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function TopicRadarChart({ topicCounts = {}, csTopics = [] }) {
  const { isDark } = useTheme();
  const categories = [
    { label: 'Dynamic Prog', key: 'dynamic programming' },
    { label: 'Graph Theory', key: 'graph' },
    { label: 'Trees & BST', key: 'tree' },
    { label: 'Binary Search', key: 'binary search' },
    { label: 'Arrays & Math', key: 'array' },
    { label: 'DBMS', isCs: true, subject: 'DBMS' },
    { label: 'OS & Concurrency', isCs: true, subject: 'OS' },
    { label: 'Networks & Protocols', isCs: true, subject: 'CN' }
  ];

  const labels = categories.map(c => c.label);
  const dataValues = categories.map(c => {
    if (c.isCs) {
      const match = csTopics.filter(t => t.subject_name === c.subject);
      if (!match.length) return 30;
      const mastered = match.filter(t => t.status === 'mastered').length;
      const revised = match.filter(t => t.status === 'revised').length;
      const inProg = match.filter(t => t.status === 'in_progress').length;
      const score = (mastered * 100 + revised * 75 + inProg * 40) / match.length;
      return Math.min(100, Math.round(score));
    } else {
      let solved = 0;
      for (const [k, v] of Object.entries(topicCounts)) {
        if (k.toLowerCase().includes(c.key)) solved += v;
      }
      // Benchmark: 15 solves = 100%
      return Math.min(100, Math.round((solved / 15) * 100));
    }
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Candidate Mastery (%)',
        data: dataValues,
        backgroundColor: isDark ? 'rgba(47, 233, 43, 0.25)' : 'rgba(5, 150, 105, 0.2)',
        borderColor: isDark ? '#2fe92b' : '#059669',
        borderWidth: 2,
        pointBackgroundColor: isDark ? '#2fe92b' : '#059669',
        pointBorderColor: isDark ? '#0f0f0f' : '#ffffff',
        pointHoverBackgroundColor: isDark ? '#ffffff' : '#059669',
        pointHoverBorderColor: isDark ? '#2fe92b' : '#047857',
      },
      {
        label: 'Tier-1 Target Bar (%)',
        data: [85, 80, 85, 80, 90, 85, 80, 75],
        backgroundColor: isDark ? 'rgba(255, 152, 33, 0.08)' : 'rgba(217, 119, 6, 0.08)',
        borderColor: isDark ? 'rgba(255, 152, 33, 0.7)' : 'rgba(217, 119, 6, 0.8)',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 850,
      easing: 'easeOutQuart',
    },
    scales: {
      r: {
        angleLines: { color: isDark ? 'rgba(38, 39, 45, 0.8)' : 'rgba(209, 215, 226, 0.9)' },
        grid: { color: isDark ? 'rgba(38, 39, 45, 0.6)' : 'rgba(209, 215, 226, 0.75)' },
        pointLabels: {
          color: isDark ? '#bbcbb2' : '#334155',
          font: { family: 'Inter', size: 11, weight: '600' },
        },
        ticks: {
          backdropColor: 'transparent',
          color: isDark ? '#6b7367' : '#94a3b8',
          stepSize: 25,
          font: { size: 9 },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#cbd5e1' : '#475569',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
    },
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '390px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Topic Mastery & Benchmark Radar</h3>
      <div style={{ flex: 1, position: 'relative' }}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}
