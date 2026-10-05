import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(null);

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5 MB.');
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please choose a PDF resume first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setLoading(true);
      setError('');
      const response = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/analysis/${response.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze the resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container content-page upload-page">
      <header className="page-heading">
        <p className="eyebrow">Start with your latest version</p>
        <h1>Upload your resume</h1>
        <p>Get a focused review of your experience, skills, and ATS readiness.</p>
      </header>

      <div className="upload-layout">
        <section className="upload-panel" aria-label="Resume PDF upload">
          <div
          className={`dropzone${isDragging ? ' is-dragging' : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            ref={inputRef}
            id="resume-file"
            type="file"
            accept=".pdf"
            className="visually-hidden"
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <span className="upload-icon" aria-hidden="true">↑</span>
          <h2>Drop your PDF here</h2>
          <p>or choose a file from your device</p>
          <label className="button button-secondary" htmlFor="resume-file">Browse files</label>
          </div>

          {file && (
            <div className="selected-file">
              <span className="resume-file-mark" aria-hidden="true">PDF</span>
              <div><span className="field-label">Selected file</span><strong>{file.name}</strong></div>
              <button className="remove-file" type="button" aria-label="Remove selected file" onClick={() => setFile(null)}>×</button>
            </div>
          )}

          {error && <div className="notice notice-error" role="alert">{error}</div>}

          <button className="button button-primary analyze-button" type="button" onClick={handleSubmit} disabled={loading || !file}>
            {loading ? 'Reviewing your resume…' : 'Start resume review'} <span aria-hidden="true">→</span>
          </button>

          {loading && <p className="loading-note" role="status">This may take a few moments. Keep this page open.</p>}
        </section>

        <aside className="upload-guidance">
          <p className="eyebrow">Before you upload</p>
          <h2>A few quick checks</h2>
          <ul className="check-list">
            <li><span>✓</span><div><strong>PDF format</strong><p>Only PDF files are accepted.</p></div></li>
            <li><span>✓</span><div><strong>Under 5 MB</strong><p>Smaller files are quicker to process.</p></div></li>
            <li><span>✓</span><div><strong>Selectable text</strong><p>Scanned image-only PDFs may not be readable.</p></div></li>
          </ul>
          <p className="privacy-note">Your original PDF is removed after successful processing. Extracted text and review results are saved in your configured database.</p>
        </aside>
      </div>
    </div>
  );
}
