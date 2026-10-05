import { Link } from 'react-router-dom';

const highlights = [
  { number: '01', title: 'Upload once', detail: 'Start with a clear, text-based PDF.' },
  { number: '02', title: 'Get useful signals', detail: 'Review strengths, gaps, and ATS fit.' },
  { number: '03', title: 'Improve with intent', detail: 'Turn feedback into practical next steps.' },
];

export default function HomePage() {
  return (
    <div className="page-container home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark" /> AI resume review</p>
          <h1>A clearer resume starts with a <em>better review.</em></h1>
          <p className="hero-description">
            Get focused feedback on your resume&apos;s strengths, missing details, and ATS readiness before you apply.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/upload">Review a resume <span aria-hidden="true">→</span></Link>
            <Link className="text-link" to="/help">See how it works</Link>
          </div>
          <p className="file-note">PDF only <span>·</span> Up to 5 MB <span>·</span> No account required</p>
        </div>

        <aside className="review-preview" aria-label="Example review summary">
          <div className="preview-topline">
            <span className="preview-label">REVIEW SNAPSHOT</span>
            <span className="preview-status"><span /> Ready to improve</span>
          </div>
          <div className="preview-score-row">
            <div><span className="preview-caption">Resume score</span><strong className="preview-score">78<span>/100</span></strong></div>
            <div className="score-ring" aria-label="78 out of 100"><span>78</span></div>
          </div>
          <div className="preview-divider" />
          <div className="preview-insight">
            <span className="insight-symbol insight-positive">+</span>
            <div><strong>Strong foundation</strong><p>Relevant experience and clear role progression.</p></div>
          </div>
          <div className="preview-insight">
            <span className="insight-symbol insight-focus">↗</span>
            <div><strong>One area to focus</strong><p>Add measurable outcomes to recent projects.</p></div>
          </div>
          <div className="preview-footer"><span>ATS compatibility</span><strong>Good match</strong></div>
        </aside>
      </section>

      <section className="approach-section" aria-labelledby="approach-title">
        <div className="section-heading">
          <p className="eyebrow">A practical process</p>
          <h2 id="approach-title">Useful feedback, without the guesswork.</h2>
        </div>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <article className="highlight-item" key={item.number}>
              <span className="highlight-number">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.detail}</p></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
