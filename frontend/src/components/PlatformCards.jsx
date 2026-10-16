import React from 'react';
import { Code2, GitFork, Trophy, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Clock, Award, Star, Terminal, Flame } from 'lucide-react';

export default function PlatformCards({
  platforms = [],
  leetcodeData = null,
  codeforcesData = null,
  githubData = null,
  hackerrankData = null,
  codechefData = null,
  onOpenSyncModal
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}>
            <CheckCircle2 size={14} /> Synced
          </span>
        );
      case 'syncing':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--chart-2)', fontSize: '0.8rem', fontWeight: '600' }}>
            <RefreshCw size={14} className="animate-spin" /> Syncing
          </span>
        );
      case 'error':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--destructive)', fontSize: '0.8rem', fontWeight: '600' }}>
            <AlertCircle size={14} /> Failed
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            <Clock size={14} /> Idle
          </span>
        );
    }
  };

  const lcConn = platforms.find(p => p.platform === 'leetcode');
  const cfConn = platforms.find(p => p.platform === 'codeforces');
  const ccConn = platforms.find(p => p.platform === 'codechef');
  const hrConn = platforms.find(p => p.platform === 'hackerrank');
  const ghConn = platforms.find(p => p.platform === 'github');
  const hrOwnedBadges = (hackerrankData?.badges || []).filter(b => (b.stars || 0) > 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '20px' }}>
      {/* LeetCode Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(255, 161, 22, 0.1)', borderRadius: '12px', color: '#ffa116' }}>
              <Code2 size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>LeetCode</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {lcConn ? `@${lcConn.username}` : 'Not connected'}
              </p>
            </div>
          </div>
          {lcConn && getStatusBadge(lcConn.sync_status)}
        </div>

        {lcConn ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', margin: '16px 0' }}>
              <div style={{ background: 'var(--card-subtle-bg)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#00b8a3' }}>
                  {leetcodeData?.easy_solved || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Easy</div>
              </div>
              <div style={{ background: 'var(--card-subtle-bg)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffc01e' }}>
                  {leetcodeData?.medium_solved || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Medium</div>
              </div>
              <div style={{ background: 'var(--card-subtle-bg)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ff375f' }}>
                  {leetcodeData?.hard_solved || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hard</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
              <span>Total Solved: <strong style={{ color: 'var(--text-main)' }}>{leetcodeData?.total_solved || 0}</strong></span>
              <span>Rating: <strong style={{ color: 'var(--text-main)' }}>{leetcodeData?.contest_rating ? Math.round(leetcodeData.contest_rating) : 'Unrated'}</strong></span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Connect your profile to track solved DSA problems and contest ratings automatically.
            </p>
            <button className="btn-secondary btn-sm" onClick={onOpenSyncModal}>
              Connect Handle
            </button>
          </div>
        )}
      </div>

      {/* Codeforces Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(30, 144, 255, 0.1)', borderRadius: '12px', color: '#1e90ff' }}>
              <Trophy size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>Codeforces</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {cfConn ? `@${cfConn.username}` : 'Not connected'}
              </p>
            </div>
          </div>
          {cfConn && getStatusBadge(cfConn.sync_status)}
        </div>

        {cfConn ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px', margin: '20px 0', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--chart-2)' }}>
                  {codeforcesData?.rating || 'Unrated'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Rating</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {codeforcesData?.max_rating || 'Unrated'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Rating</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
              <span>Rank: <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{codeforcesData?.rank || 'Newbie'}</strong></span>
              <span>Topics: <strong style={{ color: 'var(--text-main)' }}>{codeforcesData?.tags ? Object.keys(codeforcesData.tags).length : 0} tags</strong></span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Connect Codeforces to ingest algorithmic contest ratings and problem tags.
            </p>
            <button className="btn-secondary btn-sm" onClick={onOpenSyncModal}>
              Connect Handle
            </button>
          </div>
        )}
      </div>

      {/* GitHub Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'var(--secondary)', borderRadius: '12px', color: 'var(--foreground)' }}>
              <GitFork size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>GitHub</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {ghConn ? `@${ghConn.username}` : 'Not connected'}
              </p>
            </div>
          </div>
          {ghConn && getStatusBadge(ghConn.sync_status)}
        </div>

        {ghConn ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px', margin: '20px 0', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {githubData?.repo_count || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Public Repos</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
                  {githubData?.stars || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stars Earned</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
              <span>Top Languages: </span>
              <strong style={{ color: 'var(--text-main)' }}>
                {githubData?.languages && Object.keys(githubData.languages).length > 0
                  ? Object.keys(githubData.languages).slice(0, 3).join(', ')
                  : 'Python, C++, Java'}
              </strong>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Connect GitHub to analyze project consistency and software repository depth.
            </p>
            <button className="btn-secondary btn-sm" onClick={onOpenSyncModal}>
              Connect Handle
            </button>
          </div>
        )}
      </div>

      {/* CodeChef Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(217, 119, 6, 0.12)', borderRadius: '12px', color: '#d97706' }}>
              <Flame size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>CodeChef</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {ccConn ? `@${ccConn.username}` : 'Not connected'}
              </p>
            </div>
          </div>
          {ccConn && getStatusBadge(ccConn.sync_status)}
        </div>

        {ccConn ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px', margin: '20px 0', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
                  {codechefData?.rating || 'Unrated'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating ({codechefData?.stars || 'Unrated'})</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ea580c' }}>
                  {codechefData?.max_rating || 'Unrated'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Rating</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {codechefData?.division || 'Div 3'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Division</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
              <span>Total Solved: <strong style={{ color: 'var(--text-main)' }}>{codechefData?.total_solved || 0}</strong></span>
              <span>Global Rank: <strong style={{ color: 'var(--text-main)' }}>{codechefData?.global_rank ? `#${codechefData.global_rank.toLocaleString()}` : '—'}</strong></span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Connect CodeChef to track competitive divisions, star ratings, and global rankings.
            </p>
            <button className="btn-secondary btn-sm" onClick={onOpenSyncModal}>
              Connect Handle
            </button>
          </div>
        )}
      </div>

      {/* HackerRank Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'var(--primary-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Terminal size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', fontSize: '1.05rem' }}>HackerRank</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {hrConn ? `@${hrConn.username}` : 'Not connected'}
              </p>
            </div>
          </div>
          {hrConn && getStatusBadge(hrConn.sync_status)}
        </div>

        {hrConn ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px', margin: '20px 0', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                  {hackerrankData?.problem_solving_stars ? `${hackerrankData.problem_solving_stars}★` : '0★'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Problem Solving</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--chart-2)' }}>
                  {hrOwnedBadges.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Badges Earned</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--chart-3)' }}>
                  {hackerrankData?.algorithms_score ? Math.round(hackerrankData.algorithms_score) : 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Algorithms Elo</div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px 12px' }}>
              <span>
                Verified Badges:{' '}
                <strong style={{ color: 'var(--text-main)' }}>
                  {hrOwnedBadges.length > 0
                    ? hrOwnedBadges.slice(0, 3).map(b => `${b.badge_name} (${b.stars}★)`).join(', ')
                    : 'No badges earned yet'}
                </strong>
              </span>
              {hackerrankData?.profile_url && (
                <a
                  href={hackerrankData.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontSize: '0.8rem' }}
                >
                  Profile <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Connect HackerRank to ingest verified skill badges, track scores, and star progression.
            </p>
            <button className="btn-secondary btn-sm" onClick={onOpenSyncModal}>
              Connect Handle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
