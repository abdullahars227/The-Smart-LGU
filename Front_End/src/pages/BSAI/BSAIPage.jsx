import BsaiLifecyclePipeline from '../../components/programVisuals/BsaiLifecyclePipeline'
import './BSAIPage.css'

const FOCUS_AREAS = [
  { title: 'Machine learning & deep learning', blurb: 'Models, optimization & neural architectures' },
  { title: 'Natural language & multimodal AI', blurb: 'Language, speech & cross-modal reasoning' },
  { title: 'Computer vision & perception', blurb: 'Imaging, detection & spatial intelligence' },
  { title: 'Responsible & ethical AI', blurb: 'Fairness, transparency & human oversight' },
  { title: 'AI systems & deployment', blurb: 'Pipelines, MLOps & real-world scale' },
  { title: 'Research & innovation', blurb: 'Labs, publications & industry collaboration' },
]

const HIGHLIGHTS = [
  { name: 'AI & data communities', detail: 'Study groups, competitions & project showcases' },
  { name: 'Industry workshops', detail: 'Tools, cloud credits & guest practitioners' },
  { name: 'Research labs', detail: 'Faculty-led groups across core AI topics' },
  { name: 'Hackathons & sprints', detail: 'Build fast, present clearly, iterate often' },
]

const OUTCOMES = [
  'Design, train, and evaluate AI models with sound methodology',
  'Apply ethics and governance thinking to intelligent systems',
  'Ship end-to-end AI features in team settings',
  'Communicate assumptions, limits, and risks to technical and general audiences',
]

export default function BSAIPage() {
  return (
    <main className="bsai-page">
      <section className="bsai-hero" aria-labelledby="bsai-hero-title">
        <div className="bsai-hero__aurora" aria-hidden="true" />
        <div className="bsai-hero__grid" aria-hidden="true" />
        <div className="container bsai-hero__inner">
          <div className="bsai-hero__copy">
            <p className="bsai-eyebrow">
              <span className="bsai-eyebrow__dot" aria-hidden="true" />
              Department of Artificial Intelligence
            </p>
            <h1 id="bsai-hero-title" className="bsai-hero__title">
              BS <span className="bsai-hero__title-accent">Artificial Intelligence</span>
            </h1>
            <p className="bsai-hero__lead">
              A four-year program at the intersection of mathematics, computing, and intelligent
              systems—labs, projects, and research that move you from foundations to deployable AI.
            </p>
            <ul className="bsai-hero__badges" aria-label="Program highlights">
              <li>
                <span className="bsai-pill">
                  <span className="bsai-pill__text">HEC-aligned AI curriculum</span>
                </span>
              </li>
              <li>
                <span className="bsai-pill bsai-pill--ghost">
                  <span className="bsai-pill__text">BSAI · research & industry pathways</span>
                </span>
              </li>
            </ul>
          </div>
          <div className="bsai-hero__visual" aria-hidden="true">
            <div className="bsai-hero__tech-wrap">
              <div className="bsai-hero__tech-pitch">
                <svg
                  className="bsai-hero__tech-svg"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="bsaiNetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f5132" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 38 96 L 78 72 L 122 88 L 162 64 M 78 72 L 82 128 M 122 88 L 118 132 M 162 64 L 158 118"
                    stroke="rgba(15, 81, 50, 0.35)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 38 96 L 76 148 M 82 128 L 76 148 M 118 132 L 76 148 M 158 118 L 118 132"
                    stroke="rgba(15, 81, 50, 0.28)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle cx="38" cy="96" r="7" fill="url(#bsaiNetGrad)" />
                  <circle cx="78" cy="72" r="6.5" fill="url(#bsaiNetGrad)" />
                  <circle cx="122" cy="88" r="6.5" fill="url(#bsaiNetGrad)" />
                  <circle cx="162" cy="64" r="6" fill="#22c55e" />
                  <circle cx="82" cy="128" r="6" fill="url(#bsaiNetGrad)" />
                  <circle cx="118" cy="132" r="6" fill="url(#bsaiNetGrad)" />
                  <circle cx="158" cy="118" r="5.5" fill="url(#bsaiNetGrad)" />
                  <circle cx="76" cy="148" r="8" fill="url(#bsaiNetGrad)" opacity="0.95" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bsai-strip" aria-label="Quick facts">
        <div className="container bsai-strip__inner">
          <div className="bsai-stat">
            <span className="bsai-stat__value">4</span>
            <span className="bsai-stat__label">Years</span>
          </div>
          <div className="bsai-stat">
            <span className="bsai-stat__value">HEC</span>
            <span className="bsai-stat__label">Aligned AI track</span>
          </div>
          <div className="bsai-stat">
            <span className="bsai-stat__value">Labs</span>
            <span className="bsai-stat__label">Compute & tooling</span>
          </div>
          <div className="bsai-stat">
            <span className="bsai-stat__value">Impact</span>
            <span className="bsai-stat__label">Projects & research</span>
          </div>
        </div>
      </section>

      <section className="bsai-section bsai-section--vision" aria-labelledby="bsai-vision-heading">
        <div className="container">
          <div className="bsai-split">
            <article className="bsai-glass bsai-glass--vision">
              <h2 id="bsai-vision-heading" className="bsai-h2">
                Vision
              </h2>
              <p>
                To nurture AI leaders who advance trustworthy, human-centered intelligence—bridging
                rigorous theory with systems that people can understand, audit, and rely on in the
                real world.
              </p>
            </article>
            <article className="bsai-glass bsai-glass--mission">
              <h2 className="bsai-h2">Mission</h2>
              <p>
                Deliver a contemporary AI education grounded in mathematics and computing, with
                hands-on labs, ethical grounding, and research opportunities that prepare graduates to
                innovate responsibly across industry and academia.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bsai-section" aria-labelledby="bsai-focus-heading">
        <div className="container">
          <header className="bsai-section-head">
            <p className="bsai-kicker">Program depth</p>
            <h2 id="bsai-focus-heading" className="bsai-h2 bsai-h2--large">
              From foundations to deployable intelligence
            </h2>
            <p className="bsai-section-lead">
              Coursework and labs span core ML, deep learning, NLP, vision, responsible AI, and
              systems—so you can reason about data, models, and deployment together.
            </p>
          </header>
          <div className="bsai-research-grid">
            {FOCUS_AREAS.map((item) => (
              <article key={item.title} className="bsai-card">
                <div className="bsai-card__shine" aria-hidden="true" />
                <h3 className="bsai-card__title">{item.title}</h3>
                <p className="bsai-card__text">{item.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bsai-section bsai-section--media" aria-labelledby="bsai-media-heading">
        <div className="container bsai-media">
          <div className="bsai-media__visual bsai-media__visual--pipeline">
            <span className="bsai-media__frame-glow" aria-hidden="true" />
            <BsaiLifecyclePipeline />
            <span className="bsai-media__scan" aria-hidden="true" />
            <div className="bsai-media__holo" aria-hidden="true" />
          </div>
          <div className="bsai-media__text">
            <h2 id="bsai-media-heading" className="bsai-h2 bsai-h2--large">
              Built for the full AI lifecycle
            </h2>
            <p>
              You practice the same loop teams use in the field: frame the problem, prepare data,
              train and validate models, monitor behavior, and document limitations—with emphasis on
              safety, privacy, and clarity for users.
            </p>
            <ul className="bsai-outcomes">
              {OUTCOMES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bsai-section bsai-section--societies" aria-labelledby="bsai-highlights-heading">
        <div className="container">
          <header className="bsai-section-head bsai-section-head--center">
            <p className="bsai-kicker">Beyond the classroom</p>
            <h2 id="bsai-highlights-heading" className="bsai-h2 bsai-h2--large">
              Community & opportunities
            </h2>
            <p className="bsai-section-lead">
              Connect with peers and mentors through events, challenges, and project-driven learning.
            </p>
          </header>
          <div className="bsai-soc-row">
            {HIGHLIGHTS.map((s) => (
              <article key={s.name} className="bsai-soc-card">
                <span className="bsai-soc-card__name">{s.name}</span>
                <p className="bsai-soc-card__detail">{s.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bsai-cta" aria-labelledby="bsai-cta-heading">
        <div className="bsai-cta__glow" aria-hidden="true" />
        <div className="container bsai-cta__inner">
          <h2 id="bsai-cta-heading" className="bsai-cta__title">
            Ready to build intelligent systems the right way?
          </h2>
          <p className="bsai-cta__text">
            Explore admissions on the main LGU site—or return home and keep charting your path with
            us.
          </p>
          <a className="bsai-cta__btn" href="https://lgu.edu.pk/" target="_blank" rel="noopener noreferrer">
            Visit lgu.edu.pk
          </a>
        </div>
      </section>
    </main>
  )
}
