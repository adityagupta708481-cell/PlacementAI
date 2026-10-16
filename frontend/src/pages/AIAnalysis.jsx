import React, { useState, useEffect } from 'react';
import { BrainCircuit, Target, CheckCircle2, AlertCircle, Sparkles, Send, Award, FileText } from 'lucide-react';
import { api } from '../api/client';
import Skeleton from '../components/ui/Skeleton';

export default function AIAnalysis() {
  const [report, setReport] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('Amazon');
  const [companyMatch, setCompanyMatch] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingReport, setLoadingReport] = useState(true);

  // Interview QA state
  const [interviewQuestion, setInterviewQuestion] = useState('Explain ACID properties in Database Management Systems and why they are vital for financial transactions.');
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewResult, setInterviewResult] = useState(null);
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false);

  const fetchLatestReport = async () => {
    try {
      setLoadingReport(true);
      const data = await api.get('/ai/latest-report');
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleCompanyMatch = async (comp) => {
    try {
      setLoadingMatch(true);
      setSelectedCompany(comp);
      const res = await api.post('/ai/company-match', { company: comp });
      setCompanyMatch(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleEvaluateInterview = async (e) => {
    e.preventDefault();
    if (!interviewAnswer.trim()) return;

    try {
      setEvaluatingAnswer(true);
      const res = await api.post('/ai/interview-eval', {
        question: interviewQuestion,
        answer: interviewAnswer
      });
      setInterviewResult(res);
    } catch (err) {
      alert(`Evaluation error: ${err.message}`);
    } finally {
      setEvaluatingAnswer(false);
    }
  };

  useEffect(() => {
    fetchLatestReport();
    handleCompanyMatch('Amazon');
  }, []);

  const companies = [
    'Google', 'Amazon', 'Microsoft', 'Adobe',
    'Oracle', 'Cisco', 'Morgan Stanley', 'Goldman Sachs',
    'TCS', 'Infosys', 'Cognizant', 'Wipro', 'Accenture'
  ];

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Hugging Face AI Placement Intelligence</h1>
          <p className="page-subtitle">
            Semantic job description matching, zero-shot hireability classification &amp; NLP interview scoring
          </p>
        </div>
      </div>

      {/* Model Architecture & Weights Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          marginBottom: '28px',
          borderLeft: '4px solid var(--accent-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles size={18} color="var(--accent-primary)" />
            <h4 style={{ fontWeight: '700' }}>Applied Multi-Model Ensemble</h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Model 1:</strong> <code>sentence-transformers/all-MiniLM-L6-v2</code> (Cosine Semantic Matching) &bull;{' '}
            <strong>Model 2:</strong> <code>facebook/bart-large-mnli</code> (Zero-Shot Hireability Classifier)
          </p>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', overflowWrap: 'anywhere' }}>
          Formula: 0.40*DSA + 0.25*Semantic + 0.15*CS + 0.10*Apt + 0.10*Interview
        </div>
      </div>

      {/* Company Benchmarking Module */}
      <div className="glass-panel" style={{ padding: 'clamp(18px, 3vw, 28px)', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Target size={22} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Target Company Alignment Benchmarking</h2>
        </div>

        {/* Company Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
          {companies.map((c) => (
            <button
              key={c}
              onClick={() => handleCompanyMatch(c)}
              className={selectedCompany === c ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              style={{ whiteSpace: 'nowrap' }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Company Match Result Card */}
        {loadingMatch ? (
          <div
            className="split-grid-sm"
            style={{
              '--split-cols': 'minmax(180px, 1fr) 2fr',
              background: 'var(--card-subtle-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(16px, 3vw, 24px)',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            <div className="match-score-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton style={{ width: '110px', height: '14px', marginBottom: '8px' }} />
              <Skeleton style={{ width: '90px', height: '48px', margin: '8px 0' }} />
              <Skeleton style={{ width: '80px', height: '20px', borderRadius: '12px' }} />
            </div>
            <div>
              <Skeleton style={{ width: '160px', height: '20px', marginBottom: '12px' }} />
              <Skeleton style={{ width: '80%', height: '16px', marginBottom: '12px' }} />
              <Skeleton style={{ width: '60%', height: '16px' }} />
            </div>
          </div>
        ) : companyMatch && (
          <div
            className="split-grid-sm"
            style={{
              '--split-cols': 'minmax(180px, 1fr) 2fr',
              background: 'var(--card-subtle-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'clamp(16px, 3vw, 24px)',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            <div className="match-score-col">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Semantic Fit Score
              </div>
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: companyMatch.match_score >= 75 ? 'var(--primary)' : 'var(--chart-2)',
                  margin: '8px 0'
                }}
              >
                {companyMatch.match_score}%
              </div>
              <span className={`badge ${companyMatch.tier === 'Tier-1' ? 'badge-tier1' : 'badge-mid'}`}>
                {companyMatch.tier} Benchmark
              </span>
            </div>

            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
                Status: <span style={{ color: 'var(--primary)' }}>{companyMatch.readiness_status}</span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required Focus Topics: </span>
                <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>
                  {companyMatch.focus_topics.join(', ')}
                </span>
              </div>

              {companyMatch.missing_topics.length > 0 ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--destructive)', fontSize: '0.85rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Missing/Neglected Topics: <strong>{companyMatch.missing_topics.join(', ')}</strong></span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={16} />
                  <span>All key focus topics covered in current practice profile!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Action Plan & AI Interview Side-by-Side */}
      <div className="split-grid" style={{ '--split-cols': '1.2fr 1fr' }}>
        {/* Action Plan */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FileText size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>AI-Generated 7-Day Preparation Plan</h3>
          </div>
          <div
            style={{
              background: 'var(--card-subtle-bg)',
              border: '1px solid var(--card-border)',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              maxHeight: '440px',
              overflowY: 'auto',
              color: 'var(--foreground)',
              fontFamily: 'inherit'
            }}
          >
            {report?.action_plan_text || 'Loading plan from AI evaluation model...'}
          </div>
        </div>

        {/* AI Mock Interview Evaluator */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BrainCircuit size={20} color="var(--accent-secondary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>AI Interview Answer Scorer</h3>
          </div>

          <form onSubmit={handleEvaluateInterview}>
            <div className="input-group">
              <label className="input-label">Interview Question</label>
              <select
                className="input-control"
                value={interviewQuestion}
                onChange={(e) => setInterviewQuestion(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="Explain ACID properties in Database Management Systems and why they are vital for financial transactions.">
                  DBMS: Explain ACID properties in database transactions
                </option>
                <option value="What are the four necessary Coffman conditions for a deadlock to occur in an operating system?">
                  OS: What are the 4 Coffman conditions for Deadlock?
                </option>
                <option value="How does database indexing with B-Trees speed up search queries compared to full scans?">
                  DBMS: How do B-Trees optimize database indexing?
                </option>
                <option value="Explain the differences between TCP and UDP protocols and when to choose which.">
                  CN: Explain differences between TCP and UDP
                </option>
                <option value="Explain the SOLID principles in Object-Oriented Software Design with real-world examples.">
                  OOP: Explain SOLID principles
                </option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Your Typed Answer</label>
              <textarea
                className="input-control"
                rows={4}
                required
                placeholder="Type your explanation using technical terminology..."
                value={interviewAnswer}
                onChange={(e) => setInterviewAnswer(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={evaluatingAnswer}
            >
              {evaluatingAnswer ? 'Running Semantic NLP Analysis...' : 'Evaluate with Hugging Face Model'}
              <Send size={16} />
            </button>
          </form>

          {/* Interview Evaluation Result */}
          {interviewResult && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--card-subtle-bg)',
                border: '1px solid var(--card-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Relevance Score:</span>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: interviewResult.relevance_score >= 70 ? 'var(--primary)' : 'var(--chart-2)'
                  }}
                >
                  {interviewResult.relevance_score}%
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {interviewResult.feedback}
              </p>
              {interviewResult.missing_keywords && interviewResult.missing_keywords.length > 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--destructive)' }}>
                  Missing Keywords to mention: <strong>{interviewResult.missing_keywords.join(', ')}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
