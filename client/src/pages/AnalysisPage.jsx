import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

export default function AnalysisPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        const response = await api.get(`/resume/analysis/${id}`);
        setAnalysis(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch analysis.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container content-page"><div className="state-panel" role="status"><span className="loading-dot" /> Loading your review…</div></div>
    );
  }

  if (error) {
    return (
      <div className="page-container content-page"><div className="notice notice-error" role="alert">{error}</div></div>
    );
  }

  return (
    <div className="page-container content-page analysis-page">
      <header className="page-heading analysis-heading">
        <div><p className="eyebrow">Resume review</p><h1>{analysis.originalFilename}</h1><p>Use this feedback as a practical guide, not a hiring prediction.</p></div>
        <Link className="button button-secondary" to="/history">Back to history</Link>
      </header>

      <section className="score-grid">
        <article className="score-panel"><span className="field-label">Resume score</span><p className="large-score">{analysis.resumeScore}<small> / 100</small></p><p className="score-caption">Overall clarity and completeness</p></article>
        <article className="score-panel score-panel-green"><span className="field-label">ATS compatibility</span><p className="large-score">{analysis.atsScore}<small> %</small></p><p className="score-caption">Formatting and keyword alignment</p></article>
      </section>

      <section className="result-section">
        <div className="section-heading compact-heading"><p className="eyebrow">Recognized experience</p><h2>Skills</h2></div>
        <div className="skill-list">{(analysis.skills || []).map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div>
      </section>

      <section className="feedback-grid">
        <article className="feedback-panel"><h2>Strengths</h2><ul>{(analysis.strengths || []).map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="feedback-panel feedback-panel-focus"><h2>Areas to improve</h2><ul>{(analysis.weaknesses || []).map((item) => <li key={item}>{item}</li>)}</ul></article>
      </section>

      <section className="result-section suggestions-section">
        <div className="section-heading compact-heading"><p className="eyebrow">Recommended next steps</p><h2>Suggestions</h2></div>
        <ol className="suggestion-list">{(analysis.suggestions || []).map((item, index) => <li key={`${index}-${item}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol>
      </section>
    </div>
  );
}
