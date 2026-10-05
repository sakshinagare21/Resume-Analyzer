const steps = [
  { number: '01', title: 'Choose your PDF', detail: 'Upload a resume in PDF format. The file must be under 5 MB and contain selectable text.' },
  { number: '02', title: 'Review the analysis', detail: 'See resume and ATS scores, recognized skills, strengths, and areas that could be clearer.' },
  { number: '03', title: 'Apply the suggestions', detail: 'Use the specific recommendations as a checklist. Keep your own voice and verify every change.' },
];

const questions = [
  { question: 'What kind of PDF works best?', answer: 'A text-based PDF exported from a document editor works best. Scanned image-only documents may not contain text that can be reviewed.' },
  { question: 'Does a score guarantee an interview?', answer: 'No. Scores are automated guidance, not a hiring prediction. Employers and applicant tracking systems can evaluate resumes differently.' },
  { question: 'What happens to my resume?', answer: 'The uploaded PDF is processed by the server and removed after successful analysis. Extracted text and the resulting review are stored in the configured PostgreSQL database.' },
  { question: 'Can I upload more than one version?', answer: 'Yes. Each upload creates a separate review that appears in History.' },
];

export default function HelpPage() {
  return (
    <div className="page-container content-page">
      <header className="page-heading">
        <p className="eyebrow">Help center</p>
        <h1>Make the review work for you.</h1>
        <p>Quick answers about preparing a resume and interpreting its analysis.</p>
      </header>

      <section className="help-process" aria-labelledby="process-title">
        <div className="section-heading compact-heading">
          <p className="eyebrow">The process</p>
          <h2 id="process-title">Three simple steps</h2>
        </div>
        <div className="help-step-grid">
          {steps.map((step) => (
            <article className="help-step" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-title">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Common questions</p>
          <h2 id="faq-title">A few things to know</h2>
        </div>
        <div className="faq-list">
          {questions.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}