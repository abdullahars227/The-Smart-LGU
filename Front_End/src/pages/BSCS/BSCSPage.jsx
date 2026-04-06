import './BSCSPage.css'

const RESEARCH_AREAS = [
  { title: 'Artificial Intelligence', blurb: 'ML, deep learning & intelligent systems' },
  { title: 'Cybersecurity', blurb: 'Defense, cryptography & secure systems' },
  { title: 'Computer Vision', blurb: 'Perception, imaging & spatial computing' },
  { title: 'Cloud & Distributed', blurb: 'Scalable infrastructure & services' },
  { title: 'Graphics & HCI', blurb: 'Visualization, interaction & simulation' },
  { title: 'Interdisciplinary', blurb: 'Cross-domain problem solving' },
]

const SOCIETIES = [
  { name: 'GITS', detail: 'Tech innovation & community builds' },
  { name: 'GEARS', detail: 'Engineering projects & hands-on labs' },
  { name: 'Google DSC', detail: 'Workshops, sprints & industry skills' },
  { name: 'IEEE Student Branch', detail: 'Networking, standards & competitions' },
]

const OUTCOMES = [
  'Design & build reliable software systems',
  'Apply CS theory to real industry problems',
  'Collaborate in agile, research-style teams',
  'Communicate technical ideas with clarity',
]

export default function BSCSPage() {
  return (
    <main className="bscs-page">
      <section className="bscs-hero" aria-labelledby="bscs-hero-title">
        <div className="bscs-hero__aurora" aria-hidden="true" />
        <div className="bscs-hero__grid" aria-hidden="true" />
        <div className="container bscs-hero__inner">
          <div className="bscs-hero__copy">
            <p className="bscs-eyebrow">
              <span className="bscs-eyebrow__dot" aria-hidden="true" />
              Department of Computer Science
            </p>
            <h1 id="bscs-hero-title" className="bscs-hero__title">
              BS <span className="bscs-hero__title-accent">Computer Science</span>
            </h1>
            <p className="bscs-hero__lead">
              A four-year degree built for builders and thinkers—labs, research, and societies
              that push you from fundamentals to frontier tech.
            </p>
            <ul className="bscs-hero__badges" aria-label="Program highlights">
              <li>
                <span className="bscs-pill">NCEAC — X category</span>
              </li>
              <li>
                <span className="bscs-pill bscs-pill--ghost">BSCS · MSCS · MSAI · Ph.D. CS</span>
              </li>
            </ul>
          </div>
          <div className="bscs-hero__visual" aria-hidden="true">
            <div className="bscs-hero__tech-wrap">
              <div className="bscs-hero__tech-pitch">
                <svg
                  className="bscs-hero__tech-svg"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="bscsTechGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f5132" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  {/* Processor / board frame — CS hardware metaphor, not biology */}
                  <rect
                    x="26"
                    y="42"
                    width="148"
                    height="116"
                    rx="14"
                    stroke="url(#bscsTechGrad)"
                    strokeWidth="2.2"
                    fill="rgba(61, 220, 132, 0.06)"
                  />
                  {/* Orthogonal traces (circuit paths) */}
                  <path
                    d="M 42 74 H 98 V 102 H 158 M 42 126 H 86 V 102 M 158 74 V 94 H 118 V 102"
                    stroke="rgba(15, 81, 50, 0.42)"
                    strokeWidth="1.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Network / graph nodes */}
                  <circle cx="42" cy="74" r="5.5" fill="url(#bscsTechGrad)" />
                  <circle cx="100" cy="102" r="7" fill="url(#bscsTechGrad)" />
                  <circle cx="158" cy="126" r="5.5" fill="url(#bscsTechGrad)" />
                  <circle cx="158" cy="74" r="4" fill="#22c55e" opacity="0.95" />
                  <circle cx="42" cy="126" r="4" fill="#22c55e" opacity="0.95" />
                  {/* Data-flow cue */}
                  <path
                    d="M 124 54 H 168 M 160 48 L 168 54 L 160 60"
                    stroke="rgba(15, 81, 50, 0.48)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="54"
                    y="54"
                    width="10"
                    height="10"
                    rx="2"
                    stroke="rgba(34, 197, 94, 0.55)"
                    strokeWidth="1.2"
                    fill="rgba(61, 220, 132, 0.12)"
                  />
                  <rect
                    x="132"
                    y="118"
                    width="12"
                    height="12"
                    rx="2"
                    stroke="rgba(15, 81, 50, 0.4)"
                    strokeWidth="1.1"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bscs-strip" aria-label="Quick facts">
        <div className="container bscs-strip__inner">
          <div className="bscs-stat">
            <span className="bscs-stat__value">4</span>
            <span className="bscs-stat__label">Years</span>
          </div>
          <div className="bscs-stat">
            <span className="bscs-stat__value">HEC</span>
            <span className="bscs-stat__label">Aligned curriculum</span>
          </div>
          <div className="bscs-stat">
            <span className="bscs-stat__value">Labs</span>
            <span className="bscs-stat__label">Modern hardware & software</span>
          </div>
          <div className="bscs-stat">
            <span className="bscs-stat__value">Research</span>
            <span className="bscs-stat__label">Grants & publications</span>
          </div>
        </div>
      </section>

      <section className="bscs-section bscs-section--vision" aria-labelledby="bscs-vision-heading">
        <div className="container">
          <div className="bscs-split">
            <article className="bscs-glass bscs-glass--vision">
              <h2 id="bscs-vision-heading" className="bscs-h2">
                Vision
              </h2>
              <p>
                To be one of the premier Computer Science departments in the region—benefiting
                humanity through excellence in research, innovation, and entrepreneurship.
              </p>
            </article>
            <article className="bscs-glass bscs-glass--mission">
              <h2 className="bscs-h2">Mission</h2>
              <p>
                Create and impart the latest Computer Science and interdisciplinary knowledge in a
                way that inspires ethical lifelong learners, researchers, and innovative problem
                solvers who improve lives locally and globally.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bscs-section" aria-labelledby="bscs-research-heading">
        <div className="container">
          <header className="bscs-section-head">
            <p className="bscs-kicker">Research footprint</p>
            <h2 id="bscs-research-heading" className="bscs-h2 bscs-h2--large">
              Where curiosity meets compute
            </h2>
            <p className="bscs-section-lead">
              Faculty and students explore AI, machine learning, graphics, cybersecurity, computer
              vision, cloud computing, and allied domains—with labs that support grants and industry
              collaboration.
            </p>
          </header>
          <div className="bscs-research-grid">
            {RESEARCH_AREAS.map((item) => (
              <article key={item.title} className="bscs-card">
                <div className="bscs-card__shine" aria-hidden="true" />
                <h3 className="bscs-card__title">{item.title}</h3>
                <p className="bscs-card__text">{item.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bscs-section bscs-section--media" aria-labelledby="bscs-media-heading">
        <div className="container bscs-media">
          <div className="bscs-media__visual">
            <img
              className="bscs-media__img"
              src="/images/bscs-media-stack.jpg"
              alt=""
              width={540}
              height={360}
              loading="lazy"
              decoding="async"
            />
            <div className="bscs-media__holo" aria-hidden="true" />
            <div className="bscs-media__caption">Layers, latency, and logic—one coherent stack</div>
          </div>
          <div className="bscs-media__text">
            <h2 id="bscs-media-heading" className="bscs-h2 bscs-h2--large">
              Built for the pipeline ahead
            </h2>
            <p>
              From core programming to capstone projects, you move through a structured path that
              mirrors how modern teams ship: design, implement, test, and iterate—with room for
              research and competition teams.
            </p>
            <ul className="bscs-outcomes">
              {OUTCOMES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bscs-section bscs-section--societies" aria-labelledby="bscs-soc-heading">
        <div className="container">
          <header className="bscs-section-head bscs-section-head--center">
            <p className="bscs-kicker">Campus energy</p>
            <h2 id="bscs-soc-heading" className="bscs-h2 bscs-h2--large">
              Societies & clubs
            </h2>
            <p className="bscs-section-lead">
              Connect beyond lectures—hackathons, coding contests, workshops, and peer networks.
            </p>
          </header>
          <div className="bscs-soc-row">
            {SOCIETIES.map((s) => (
              <article key={s.name} className="bscs-soc-card">
                <span className="bscs-soc-card__name">{s.name}</span>
                <p className="bscs-soc-card__detail">{s.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bscs-cta" aria-labelledby="bscs-cta-heading">
        <div className="bscs-cta__glow" aria-hidden="true" />
        <div className="container bscs-cta__inner">
          <h2 id="bscs-cta-heading" className="bscs-cta__title">
            Ready to architect what&apos;s next?
          </h2>
          <p className="bscs-cta__text">
            Explore admissions on the main LGU site—or start from the home page and keep building
            your path with us.
          </p>
          <a className="bscs-cta__btn" href="https://lgu.edu.pk/" target="_blank" rel="noopener noreferrer">
            Visit lgu.edu.pk
          </a>
        </div>
      </section>
    </main>
  )
}
