import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Code2, Trophy, GitFork, Award, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';

export default function SyncModal({ isOpen, onClose, platforms = [], onSyncComplete }) {
  const [leetcode, setLeetcode] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [github, setGithub] = useState('');
  const [hackerrank, setHackerrank] = useState('');
  const [codechef, setCodechef] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLeetcode(platforms.find(p => p.platform === 'leetcode')?.username || '');
      setCodeforces(platforms.find(p => p.platform === 'codeforces')?.username || '');
      setGithub(platforms.find(p => p.platform === 'github')?.username || '');
      setHackerrank(platforms.find(p => p.platform === 'hackerrank')?.username || '');
      setCodechef(platforms.find(p => p.platform === 'codechef')?.username || '');
      setSyncStatusMsg('');
    }
  }, [isOpen, platforms]);

  const handleSaveAndSync = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSyncStatusMsg('Connecting profiles & initiating full-spectrum ingestion...');

    try {
      // 1. Connect all 5 platforms
      await api.post('/platforms/connect', {
        leetcode: leetcode.trim() || null,
        codeforces: codeforces.trim() || null,
        github: github.trim() || null,
        hackerrank: hackerrank.trim() || null,
        codechef: codechef.trim() || null
      });

      // 2. Trigger sync all
      await api.post('/platforms/sync-all?force=true');
      setSyncStatusMsg('Sync initiated across all connected platforms (LeetCode, Codeforces, GitHub, HackerRank, CodeChef)...');

      // 3. Poll for status up to 10 seconds
      let attempts = 0;
      const pollInterval = setInterval(async () => {
        attempts++;
        try {
          const statusRes = await api.get('/platforms/status');
          const isStillSyncing = statusRes.platforms.some(p => p.sync_status === 'syncing');
          if (!isStillSyncing || attempts >= 8) {
            clearInterval(pollInterval);
            setLoading(false);
            setSyncStatusMsg('All profiles synced successfully!');
            setTimeout(() => {
              if (onSyncComplete) onSyncComplete();
              onClose();
            }, 800);
          }
        } catch (_) {
          if (attempts >= 8) {
            clearInterval(pollInterval);
            setLoading(false);
            onClose();
          }
        }
      }, 1200);

    } catch (err) {
      setLoading(false);
      setSyncStatusMsg(`Error: ${err.message}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', paddingRight: '28px' }}>
          <Sparkles size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
          <h2 style={{ fontSize: 'clamp(1.1rem, 1rem + 0.8vw, 1.3rem)', fontWeight: '800' }}>Connect Coding Profiles</h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Enter your public platform usernames across LeetCode, Codeforces, GitHub, HackerRank, and CodeChef. All metrics will be ingested simultaneously.
        </p>

        <form onSubmit={handleSaveAndSync}>
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#ffa116', fontWeight: '600' }}>LeetCode</span> Username
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. aditya_codes or neal_wu"
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#1e90ff', fontWeight: '600' }}>Codeforces</span> Handle
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. tourist or Benq"
              value={codeforces}
              onChange={(e) => setCodeforces(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#d97706', fontWeight: '600' }}>CodeChef</span> Handle
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. tourist or chef_aditya"
              value={codechef}
              onChange={(e) => setCodechef(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#10b981', fontWeight: '600' }}>HackerRank</span> Username
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. hackerrank_handle"
              value={hackerrank}
              onChange={(e) => setHackerrank(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#94a3b8', fontWeight: '600' }}>GitHub</span> Username
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. torvalds"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>

          {syncStatusMsg && (
            <div
              style={{
                fontSize: '0.85rem',
                color: syncStatusMsg.startsWith('Error') ? 'var(--destructive)' : 'var(--primary)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {loading && <RefreshCw size={14} className="animate-spin" />}
              {syncStatusMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: '1 1 100px', justifyContent: 'center' }}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: '2 1 180px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Syncing All...
                </>
              ) : (
                'Save & Sync All Now'
              )}
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
