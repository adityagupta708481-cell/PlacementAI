import React, { useState } from 'react';
import { Calendar, Check, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';

export default function RevisionCalendar({ revisions = [], onRevisionLogged }) {
  const [loggingId, setLoggingId] = useState(null);

  const handleLog = async (id, performance) => {
    try {
      setLoggingId(id);
      const updated = await api.post(`/revisions/${id}/log`, { performance });
      if (onRevisionLogged) {
        onRevisionLogged(id, updated);
      }
    } catch (err) {
      alert(err.message || 'Failed to record revision');
    } finally {
      setLoggingId(null);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Spaced Repetition: Due Today</h3>
        </div>
        <span className="badge badge-urgent">
          {revisions.length} Due for Review
        </span>
      </div>

      {revisions.length === 0 ? (
        <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Check size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 8px', display: 'block' }} />
          <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>All Caught Up!</p>
          <p style={{ fontSize: '0.85rem' }}>No spaced repetition topics currently due today. Excellent consistency!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="popLayout">
            {revisions.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'var(--card-subtle-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', background: 'var(--primary-subtle)', color: 'var(--primary)', border: '1px solid var(--primary-border-subtle)', borderRadius: 'var(--radius)' }}>
                    {item.category}
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.topic_name}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Stage {item.interval_stage} of 5 &bull; Next interval if recalled: +{item.interval_stage === 1 ? '3d' : item.interval_stage === 2 ? '7d' : '14d'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary btn-sm"
                  style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', border: '1px solid var(--primary-border-subtle)' }}
                  disabled={loggingId === item.id}
                  onClick={() => handleLog(item.id, 'easy')}
                  title="Advance 2 stages"
                >
                  Easy (+2)
                </button>
                <button
                  className="btn-secondary btn-sm"
                  style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--chart-2)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                  disabled={loggingId === item.id}
                  onClick={() => handleLog(item.id, 'good')}
                  title="Advance 1 stage"
                >
                  Good (+1)
                </button>
                <button
                  className="btn-secondary btn-sm"
                  style={{ background: 'rgba(234, 88, 12, 0.15)', color: 'var(--chart-3)', border: '1px solid rgba(234, 88, 12, 0.3)' }}
                  disabled={loggingId === item.id}
                  onClick={() => handleLog(item.id, 'hard')}
                  title="Maintain current interval"
                >
                  Hard
                </button>
                <button
                  className="btn-secondary btn-sm"
                  style={{ background: 'rgba(220, 38, 38, 0.15)', color: 'var(--destructive)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
                  disabled={loggingId === item.id}
                  onClick={() => handleLog(item.id, 'forgot')}
                  title="Reset to stage 1"
                >
                  Forgot (Reset)
                </button>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
