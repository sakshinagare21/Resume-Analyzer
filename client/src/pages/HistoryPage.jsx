import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const response = await api.get('/resume/analysis');
        if (active) setAnalyses(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Could not load review history.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHistory();
    return () => { active = false; };
  }, []);

  async function handleDelete(analysis) {
    const confirmed = window.confirm(`Delete the review for "${analysis.originalFilename}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      setDeletingId(analysis.id);
      setError('');
      await api.delete(`/resume/analysis/${analysis.id}`);
      setAnalyses((current) => current.filter((item) => item.id !== analysis.id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this review.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page-container content-page">
      <header className="page-heading history-heading">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>Review history</h1>
          <p>Revisit your recent resume analyses and compare progress.</p>
        </div>
        <Link className="button button-primary" to="/upload">New analysis <span aria-hidden="true">+</span></Link>
      </header>

      {error && <div className="notice notice-error" role="alert">{error}</div>}

      {loading ? (
        <div className="state-panel" role="status"><span className="loading-dot" /> Loading your reviews…</div>
      ) : analyses.length === 0 && !error ? (
        <section className="empty-state">
          <span className="empty-mark" aria-hidden="true">R</span>
          <h2>Your history starts here</h2>
          <p>Upload a resume to receive your first review. Your saved analyses will appear on this page.</p>
          <Link className="button button-primary" to="/upload">Review a resume <span aria-hidden="true">→</span></Link>
        </section>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr><th scope="col">Resume</th><th scope="col">Reviewed</th><th scope="col">Resume score</th><th scope="col">ATS score</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr>
            </thead>
            <tbody>
              {analyses.map((analysis) => (
                <tr key={analysis.id}>
                  <td><span className="resume-file-mark" aria-hidden="true">PDF</span><span className="filename-cell">{analysis.originalFilename}</span></td>
                  <td className="muted-cell">{formatDate(analysis.createdAt)}</td>
                  <td><span className="table-score">{analysis.resumeScore ?? '—'}<small>/100</small></span></td>
                  <td><span className="table-score">{analysis.atsScore ?? '—'}<small>%</small></span></td>
                  <td className="history-actions">
                    <Link className="table-link" to={`/analysis/${analysis.id}`}>View <span aria-hidden="true">→</span></Link>
                    <button
                      className="delete-link"
                      type="button"
                      onClick={() => handleDelete(analysis)}
                      disabled={deletingId === analysis.id}
                      aria-label={`Delete review for ${analysis.originalFilename}`}
                    >
                      {deletingId === analysis.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="table-footnote">Showing the 100 most recent reviews.</p>
        </div>
      )}
    </div>
  );
}