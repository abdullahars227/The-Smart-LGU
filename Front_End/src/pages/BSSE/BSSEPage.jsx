import './BSSEPage.css'

const FOCUS_AREAS = [
  'Software Requirements and Analysis',
  'Software Design and Architecture',
  'Quality Assurance and Testing',
  'DevOps, CI/CD, and Deployment',
  'Project Management and Agile Practices',
  'Research and Entrepreneurship Mindset',
]

const OUTCOMES = [
  'Build quality software systems using engineering standards.',
  'Bridge theory, tools, and real-world software delivery.',
  'Collaborate in teams with professional communication.',
  'Solve industry and societal problems with practical software solutions.',
]

const PIPELINE = [
  { step: '01', title: 'Discover & specify', detail: 'Requirements, risks, and measurable goals.' },
  { step: '02', title: 'Design & build', detail: 'Architecture, implementation, and reviews.' },
  { step: '03', title: 'Validate & ship', detail: 'Testing, release discipline, and observability.' },
  { step: '04', title: 'Measure & iterate', detail: 'Feedback loops and continuous improvement.' },
]

/** Orbit labels for the ESSE society visual (right column). */
const ESSE_ORBIT_LABELS = [
  { label: 'Events' },
  { label: 'Leadership' },
  { label: 'Community' },
  { label: 'Growth' },
]

function PipelineGraphic() {
  return (
    <svg
      className="bsse-hero__graphic"
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bsseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="55%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#0f5132" />
        </linearGradient>
        <filter id="bsseGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 32 88 H 128 M 128 88 L 128 52 H 248 M 248 52 L 248 88 H 368 M 32 132 H 108 M 108 132 L 108 168 H 292 M 292 168 L 292 132 H 368"
        stroke="rgba(148, 163, 184, 0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 32 88 H 200 C 230 88 230 132 260 132 H 368"
        stroke="url(#bsseGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#bsseGlow)"
        className="bsse-hero__flow"
      />
      <rect x="24" y="72" width="20" height="32" rx="6" stroke="#22d3ee" strokeWidth="1.5" fill="rgba(34, 211, 238, 0.12)" />
      <rect x="172" y="36" width="56" height="32" rx="8" stroke="#a3e635" strokeWidth="1.5" fill="rgba(163, 230, 53, 0.1)" />
      <rect x="348" y="116" width="28" height="32" rx="8" stroke="#0f5132" strokeWidth="1.5" fill="rgba(15, 81, 50, 0.2)" />
      <circle cx="200" cy="110" r="5" fill="#22d3ee" className="bsse-hero__node" />
      <circle cx="320" cy="110" r="5" fill="#a3e635" className="bsse-hero__node bsse-hero__node--delay" />
      <text x="178" y="56" fill="rgba(226, 232, 240, 0.5)" fontSize="10" fontFamily="ui-monospace, monospace">
        BUILD
      </text>
      <text x="32" y="196" fill="rgba(226, 232, 240, 0.45)" fontSize="10" fontFamily="ui-monospace, monospace">
        main
      </text>
      <text x="300" y="196" fill="rgba(226, 232, 240, 0.45)" fontSize="10" fontFamily="ui-monospace, monospace">
        release
      </text>
    </svg>
  )
}

function EsseSocietyVisual() {
  return (
    <div className="bsse-society__visual" aria-hidden="true">
      <div className="bsse-esse-orbit">
        <div className="bsse-esse-orbit__halo" />
        <div className="bsse-esse-orbit__ring bsse-esse-orbit__ring--outer" />
        <div className="bsse-esse-orbit__ring bsse-esse-orbit__ring--inner" />
        <div className="bsse-esse-orbit__spin">
          {ESSE_ORBIT_LABELS.map((s, i) => (
            <div
              key={s.label}
              className="bsse-esse-orbit__arm"
              style={{ '--esse-deg': `${i * 90}deg` }}
            >
              <span className="bsse-esse-orbit__node">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="bsse-esse-orbit__core">
          <span className="bsse-esse-orbit__scan" />
          <span className="bsse-esse-orbit__logo">ESSE</span>
        </div>
      </div>
    </div>
  )
}

export default function BSSEPage() {
  return (
    <main className="bsse-page">
      <section className="bsse-hero" aria-labelledby="bsse-hero-title">
        <div className="bsse-hero__noise" aria-hidden="true" />
        <div className="bsse-hero__gridlines" aria-hidden="true" />
        <div className="container bsse-hero__layout">
          <div className="bsse-hero__copy">
            <p className="bsse-eyebrow">Department of Software Engineering</p>
            <h1 id="bsse-hero-title" className="bsse-hero__title">
              BS <span className="bsse-hero__title-highlight">Software Engineering</span>
            </h1>
            <p className="bsse-hero__lede">
              A modern, industry-aligned program focused on creating high-quality software systems in a
              systematic, controlled, and efficient way.
            </p>
            <div className="bsse-hero__chips" aria-label="Program highlights">
              <span className="bsse-hero-chip">
                <span className="bsse-hero-chip__text">Systematic development</span>
              </span>
              <span className="bsse-hero-chip">
                <span className="bsse-hero-chip__text">Quality-driven engineering</span>
              </span>
              <span className="bsse-hero-chip">
                <span className="bsse-hero-chip__text">Research + industry readiness</span>
              </span>
            </div>
          </div>
          <div className="bsse-hero__panel">
            <p className="bsse-hero__panel-label">Delivery mindset</p>
            <PipelineGraphic />
          </div>
        </div>
        <div className="bsse-hero__slant" aria-hidden="true" />
      </section>

      <section className="bsse-metrics" aria-label="Program metrics">
        <div className="container bsse-metrics__inner">
          <div className="bsse-metric">
            <span className="bsse-metric__value">4</span>
            <span className="bsse-metric__unit">yr</span>
            <span className="bsse-metric__label">Structured degree path</span>
          </div>
          <div className="bsse-metric">
            <span className="bsse-metric__value">SE</span>
            <span className="bsse-metric__label">Engineering rigor</span>
          </div>
          <div className="bsse-metric">
            <span className="bsse-metric__value">∞</span>
            <span className="bsse-metric__label">Build → measure → learn</span>
          </div>
          <div className="bsse-metric">
            <span className="bsse-metric__value">ESSE</span>
            <span className="bsse-metric__label">Campus community</span>
          </div>
        </div>
      </section>

      <section className="container bsse-bento" aria-label="Program overview">
        <article className="bsse-tile bsse-tile--feature">
          <span className="bsse-tile__tag">Overview</span>
          <h2 className="bsse-tile__h">Engineering software, not just code</h2>
          <p>
            Software Engineering at LGU is among the largest departments of the university. The program
            applies engineering concepts, techniques, and methods to software design, development,
            deployment, and maintenance.
          </p>
          <p>
            Students are groomed in principles, theory, practices, and processes required to produce quality
            software systems, with guidance from qualified faculty and strong research culture.
          </p>
        </article>

        <article className="bsse-tile bsse-tile--accent">
          <h3 className="bsse-tile__h bsse-tile__h--sm">Vision</h3>
          <p className="bsse-tile__p">
            To be a distinguished learning center of software engineering in the region, driving innovation
            and excellence through collaborative solutions.
          </p>
        </article>

        <article className="bsse-tile bsse-tile--mission">
          <h3 className="bsse-tile__h bsse-tile__h--sm">Mission</h3>
          <p className="bsse-tile__p">
            To provide a dynamic learning environment, instill creative thinking, and cultivate entrepreneurial
            skills for service to the global community.
          </p>
        </article>

        <article className="bsse-tile bsse-tile--wide">
          <h2 className="bsse-tile__h">History &amp; approach</h2>
          <p>
            The department promotes high-tech coursework and research-based teaching. The learning model
            emphasizes harmonizing theory with practice, concepts with applications, and problems with
            implementable solutions.
          </p>
          <p>
            This balance helps students strengthen technical confidence and prepares them for competitive
            positions in software careers.
          </p>
        </article>
      </section>

      <section className="bsse-pipeline-section" aria-labelledby="bsse-pipeline-heading">
        <div className="container">
          <header className="bsse-pipeline-head">
            <p className="bsse-pipeline-kicker">How teams actually ship</p>
            <h2 id="bsse-pipeline-heading" className="bsse-pipeline-title">
              From clarity to continuous delivery
            </h2>
          </header>
          <ol className="bsse-pipeline">
            {PIPELINE.map((item) => (
              <li key={item.step} className="bsse-pipeline__step">
                <span className="bsse-pipeline__num" aria-hidden="true">
                  {item.step}
                </span>
                <div>
                  <h3 className="bsse-pipeline__name">{item.title}</h3>
                  <p className="bsse-pipeline__detail">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container bsse-dual" aria-label="Outcomes and focus">
        <article className="bsse-dual__card">
          <h2>Graduate outcomes</h2>
          <ul className="bsse-checklist">
            {OUTCOMES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="bsse-dual__card bsse-dual__card--inverse">
          <h2>Program focus areas</h2>
          <ul className="bsse-focus">
            {FOCUS_AREAS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="bsse-society-wrap">
        <div className="container">
          <article className="bsse-society">
            <div className="bsse-society__content">
              <h2>Our society</h2>
              <p>
                <strong>Event Society of Software Engineering (ESSE)</strong> supports student activities,
                leadership, and professional growth through events and community engagement.
              </p>
              <a
                className="bsse-society__btn"
                href="https://www.instagram.com/esse_lgu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit ESSE community
              </a>
            </div>
            <EsseSocietyVisual />
          </article>
        </div>
      </section>
    </main>
  )
}
