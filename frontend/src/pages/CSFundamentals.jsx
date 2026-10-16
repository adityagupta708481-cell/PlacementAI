import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Award, Check, Zap } from 'lucide-react';
import { api } from '../api/client';
import Skeleton from '../components/ui/Skeleton';

export default function CSFundamentals() {
  const [csTopics, setCsTopics] = useState([]);
  const [aptitudeStats, setAptitudeStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Aptitude test submit form
  const [aptCategory, setAptCategory] = useState('Quantitative');
  const [aptAttempted, setAptAttempted] = useState(20);
  const [aptCorrect, setAptCorrect] = useState(16);
  const [aptTime, setAptTime] = useState(65);
  const [submittingApt, setSubmittingApt] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topics, stats] = await Promise.all([
        api.get('/cs/topics'),
        api.get('/aptitude/stats')
      ]);
      setCsTopics(topics || []);
      setAptitudeStats(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (topicId, newStatus) => {
    try {
      const updated = await api.put(`/cs/topics/${topicId}`, { status: newStatus });
      setCsTopics(prev => prev.map(t => t.id === topicId ? updated : t));
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleAptitudeSubmit = async (e) => {
    e.preventDefault();
    if (aptCorrect > aptAttempted) {
      alert('Correct answers cannot exceed attempted questions.');
      return;
    }
    try {
      setSubmittingApt(true);
      const res = await api.post('/aptitude/submit', {
        category: aptCategory,
        attempted: parseInt(aptAttempted),
        correct: parseInt(aptCorrect),
        avg_time_seconds: parseFloat(aptTime)
      });
      setAptitudeStats(res);
      alert('Aptitude session saved successfully!');
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmittingApt(false);
    }
  };

  // Group CS topics by subject
  const subjects = ['DBMS', 'OS', 'CN', 'OOP'];

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">CS Fundamentals &amp; Aptitude Engine</h1>
          <p className="page-subtitle">
            Master technical interview subject matter and practice company aptitude rounds
          </p>
        </div>
      </div>

      {/* Aptitude Analytics Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={22} color="var(--accent-amber)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Aptitude Elimination Round Tracker</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px 20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall Accuracy: </span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)' }}>
                {aptitudeStats?.overall_accuracy || 0}%
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Attempted: </span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
                {aptitudeStats?.total_attempted || 0} Qs
              </strong>
            </div>
          </div>
        </div>

        {/* Aptitude Category Breakdown Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: '14px', marginBottom: '24px' }}>
          {aptitudeStats?.categories?.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '6px' }}>{cat.category}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                {cat.accuracy}%
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {cat.correct} / {cat.attempted} correct &bull; {cat.avg_time_seconds || 60}s avg
              </div>
            </div>
          ))}
        </div>

        {/* Log Test Session Form */}
        <form onSubmit={handleAptitudeSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label className="input-label">Category</label>
            <select
              className="input-control"
              value={aptCategory}
              onChange={(e) => setAptCategory(e.target.value)}
            >
              <option value="Quantitative">Quantitative</option>
              <option value="Logical">Logical Reasoning</option>
              <option value="Verbal">Verbal Ability</option>
              <option value="Data Interpretation">Data Interpretation</option>
            </select>
          </div>

          <div>
            <label className="input-label">Attempted</label>
            <input
              type="number"
              min={1}
              required
              className="input-control"
              value={aptAttempted}
              onChange={(e) => setAptAttempted(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Correct</label>
            <input
              type="number"
              min={0}
              required
              className="input-control"
              value={aptCorrect}
              onChange={(e) => setAptCorrect(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Avg Sec/Q</label>
            <input
              type="number"
              min={10}
              className="input-control"
              value={aptTime}
              onChange={(e) => setAptTime(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ height: '46px' }}
            disabled={submittingApt}
          >
            {submittingApt ? 'Saving...' : 'Log Quiz'}
          </button>
        </form>
      </div>

      {/* CS Fundamentals Subject Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '24px' }}>
        {loading ? (
          subjects.map((sub) => (
            <div key={sub} className="glass-panel" style={{ padding: '24px', minHeight: '260px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Skeleton style={{ width: '80px', height: '22px' }} />
                <Skeleton style={{ width: '100px', height: '20px', borderRadius: '12px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} style={{ height: '42px', borderRadius: '8px' }} />
                ))}
              </div>
            </div>
          ))
        ) : (
          subjects.map((sub) => {
            const topics = csTopics.filter(t => t.subject_name === sub);
            const masteredCount = topics.filter(t => t.status === 'mastered').length;

            return (
              <div key={sub} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={20} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{sub}</h3>
                  </div>
                  <span className="badge badge-mid">
                    {masteredCount}/{topics.length} Mastered
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {topics.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        background: 'var(--card-subtle-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        padding: '12px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'border-color 0.15s ease, background 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', minWidth: 0, overflowWrap: 'anywhere' }}>
                        {t.topic_name}
                      </div>

                      <select
                        value={t.status}
                        onChange={(e) => handleStatusChange(t.id, e.target.value)}
                        style={{
                          background:
                            t.status === 'mastered' ? 'var(--primary-subtle)' :
                            t.status === 'revised' ? 'rgba(245, 158, 11, 0.15)' :
                            t.status === 'in_progress' ? 'rgba(234, 88, 12, 0.15)' :
                            'var(--secondary)',
                          color:
                            t.status === 'mastered' ? 'var(--primary)' :
                            t.status === 'revised' ? 'var(--chart-2)' :
                            t.status === 'in_progress' ? 'var(--chart-3)' :
                            'var(--muted-foreground)',
                          border: '1px solid var(--border)',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="revised">Revised</option>
                        <option value="mastered">Mastered</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
