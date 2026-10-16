import React, { useState, useEffect } from 'react';
import { Code2, Trophy, GitFork, RefreshCw, Layers, Award, Terminal, Flame, Star, ExternalLink } from 'lucide-react';
import { api } from '../api/client';
import TopicRadarChart from '../components/TopicRadarChart';
import PlatformCards from '../components/PlatformCards';
import SyncModal from '../components/SyncModal';
import Skeleton, { PlatformCardSkeleton } from '../components/ui/Skeleton';

export default function CodingProfiles() {
  const [platforms, setPlatforms] = useState([]);
  const [leetcode, setLeetcode] = useState(null);
  const [codeforces, setCodeforces] = useState(null);
  const [github, setGithub] = useState(null);
  const [hackerrank, setHackerrank] = useState(null);
  const [codechef, setCodechef] = useState(null);
  const [csTopics, setCsTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncModalOpen, setSyncModalOpen] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const [statusRes, csRes] = await Promise.all([
        api.get('/platforms/status'),
        api.get('/cs/topics')
      ]);

      setPlatforms(statusRes.platforms || []);
      setCsTopics(csRes || []);

      const list = statusRes.platforms || [];
      if (list.some(p => p.platform === 'leetcode')) {
        api.get('/platforms/leetcode').then(setLeetcode).catch(() => {});
      }
      if (list.some(p => p.platform === 'codeforces')) {
        api.get('/platforms/codeforces').then(setCodeforces).catch(() => {});
      }
      if (list.some(p => p.platform === 'github')) {
        api.get('/platforms/github').then(setGithub).catch(() => {});
      }
      if (list.some(p => p.platform === 'hackerrank')) {
        api.get('/platforms/hackerrank').then(setHackerrank).catch(() => {});
      }
      if (list.some(p => p.platform === 'codechef')) {
        api.get('/platforms/codechef').then(setCodechef).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Coding Profiles &amp; DSA Analytics</h1>
          <p className="page-subtitle">
            Live ingested algorithmic performance from LeetCode, Codeforces, CodeChef, HackerRank, and GitHub
          </p>
        </div>
        <button className="btn-primary" onClick={() => setSyncModalOpen(true)}>
          <RefreshCw size={16} />
          Sync Profiles
        </button>
      </div>

      {/* Synchronized Platform Cards */}
      <div style={{ marginBottom: '32px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '20px' }}>
            <PlatformCardSkeleton />
            <PlatformCardSkeleton />
            <PlatformCardSkeleton />
          </div>
        ) : (
          <PlatformCards
            platforms={platforms}
            leetcodeData={leetcode}
            codeforcesData={codeforces}
            githubData={github}
            hackerrankData={hackerrank}
            codechefData={codechef}
            onOpenSyncModal={() => setSyncModalOpen(true)}
          />
        )}
      </div>

      {/* Radar Chart + Topic Breakdown Grid */}
      <div className="split-grid" style={{ '--split-cols': 'minmax(320px, 1fr) 1.2fr', marginBottom: '32px' }}>
        {loading ? (
          <>
            <div className="glass-panel" style={{ padding: '24px', height: '390px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Skeleton style={{ width: '160px', height: '18px', marginBottom: '24px' }} />
              <Skeleton style={{ width: '220px', height: '220px', borderRadius: '50%' }} />
            </div>
            <div className="glass-panel" style={{ padding: '24px', height: '390px' }}>
              <Skeleton style={{ width: '180px', height: '18px', marginBottom: '20px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: '10px' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} style={{ height: '42px', borderRadius: '8px' }} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <TopicRadarChart
              topicCounts={leetcode?.topic_counts || {}}
              csTopics={csTopics}
            />

            {/* LeetCode Topic Tag Breakdown */}
            <div className="glass-panel" style={{ padding: '24px', maxHeight: '390px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Layers size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Ingested Topic Solved Counts</h3>
              </div>

              <div style={{ overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
                {leetcode?.topic_counts && Object.keys(leetcode.topic_counts).length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: '10px' }}>
                    {Object.entries(leetcode.topic_counts).map(([tag, count]) => (
                      <div
                        key={tag}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--card-border)',
                          borderRadius: 'var(--radius)',
                          padding: '10px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'border-color 0.15s ease, background 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', textTransform: 'capitalize', minWidth: 0, overflowWrap: 'anywhere' }}>{tag}</span>
                        <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    No topic data ingested yet. Connect your LeetCode handle to see tag breakdowns.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Platform Ingested Highlights: HackerRank Badges & CodeChef Standing */}
      {(() => {
        const ownedBadges = (hackerrank?.badges || []).filter((b) => (b.stars || 0) > 0);
        const hasCodechef = codechef?.rating && codechef.rating > 0;

        if (ownedBadges.length === 0 && !hasCodechef) {
          return null;
        }

        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '20px', marginBottom: '32px' }}>
            {ownedBadges.length > 0 && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>HackerRank Verified Skill Badges</h3>
                  </div>
                  <span style={{ fontSize: '0.78rem', padding: '3px 9px', borderRadius: '9999px', background: 'var(--primary-subtle)', color: 'var(--primary)', border: '1px solid var(--primary-border-subtle)', fontWeight: '600' }}>
                    {ownedBadges.length} Owned {ownedBadges.length === 1 ? 'Badge' : 'Badges'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(130px, 100%), 1fr))', gap: '12px' }}>
                  {ownedBadges.map((b, idx) => (
                    <div
                      key={`${b.badge_name}-${idx}`}
                      style={{
                        background: 'var(--card-subtle-bg)',
                        border: '1px solid var(--primary-border-subtle)',
                        borderRadius: 'var(--radius)',
                        padding: '12px 10px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '4px'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        {b.badge_name}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#f59e0b', letterSpacing: '1.5px', margin: '4px 0' }}>
                        {'★'.repeat(b.stars)}
                        <span style={{ color: 'rgba(150, 150, 150, 0.25)' }}>
                          {'☆'.repeat(Math.max(0, (b.max_stars || 5) - b.stars))}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {b.stars} of {b.max_stars || 5} Stars
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {codechef?.rating && codechef.rating > 0 && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Flame size={20} color="var(--chart-2)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>CodeChef Competitive Profile</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--card-subtle-bg)', padding: '12px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--chart-2)' }}>{codechef.rating}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating ({codechef.stars})</div>
                </div>
                <div style={{ background: 'var(--card-subtle-bg)', padding: '12px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>{codechef.division}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Division</div>
                </div>
                <div style={{ background: 'var(--card-subtle-bg)', padding: '12px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>{codechef.total_solved}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Problems Solved</div>
                </div>
                <div style={{ background: 'var(--card-subtle-bg)', padding: '12px', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--chart-3)' }}>
                    {codechef.global_rank ? `#${codechef.global_rank.toLocaleString()}` : '—'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Global Rank</div>
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })()}

      {/* Recent Submissions */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
          Recent Accepted Problem Submissions (Live Ingested)
        </h3>

        {leetcode?.recent_submissions && leetcode.recent_submissions.length > 0 ? (
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px' }}>Platform</th>
                  <th style={{ padding: '10px 14px' }}>Problem Title</th>
                  <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leetcode.recent_submissions.map((sub, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 14px', color: '#ffa116', fontWeight: '600' }}>LeetCode</td>
                    <td style={{ padding: '12px 14px', fontWeight: '600' }}>{sub.title}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-dim)' }}>
                      {sub.timestamp ? new Date(parseInt(sub.timestamp) * 1000).toLocaleDateString() : 'Recent'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-tier1">Accepted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            No recent submissions found. Click "Sync Profiles" to fetch live submissions.
          </div>
        )}
      </div>

      <SyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        platforms={platforms}
        onSyncComplete={fetchProfiles}
      />
    </div>
  );
}
