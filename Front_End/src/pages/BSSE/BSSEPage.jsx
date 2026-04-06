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

export default function BSSEPage() {
  return (
    <main className="bsse-page">
      <section className="bsse-hero" aria-labelledby="bsse-hero-title">
        <div className="container bsse-hero__inner">
          <p className="bsse-eyebrow">Department of Software Engineering</p>
          <h1 id="bsse-hero-title">
            BS <span>Software Engineering</span>
          </h1>
          <p className="bsse-hero__lede">
            A modern, industry-aligned program focused on creating high-quality software systems in a
            systematic, controlled, and efficient way.
          </p>
          <div className="bsse-hero__chips" aria-label="Program highlights">
            <span>Systematic Development</span>
            <span>Quality-Driven Engineering</span>
            <span>Research + Industry Readiness</span>
          </div>
        </div>
      </section>

      <section className="container bsse-core-grid">
        <article className="bsse-panel">
          <h2>Overview</h2>
          <p>
            Software Engineering at LGU is among the largest departments of the university. The
            program applies engineering concepts, techniques, and methods to software design,
            development, deployment, and maintenance.
          </p>
          <p>
            Students are groomed in principles, theory, practices, and processes required to produce
            quality software systems, with guidance from qualified faculty and strong research
            culture.
          </p>
        </article>

        <article className="bsse-panel bsse-panel--accent">
          <h3>Vision</h3>
          <p>
            To be a distinguished learning center of software engineering in the region, driving
            innovation and excellence through collaborative solutions.
          </p>
        </article>

        <article className="bsse-panel">
          <h2>History & Approach</h2>
          <p>
            The department promotes high-tech coursework and research-based teaching. The learning
            model emphasizes harmonizing theory with practice, concepts with applications, and
            problems with implementable solutions.
          </p>
          <p>
            This balance helps students strengthen technical confidence and prepares them for
            competitive positions in software careers.
          </p>
        </article>

        <article className="bsse-panel">
          <h3>Mission</h3>
          <p>
            To provide a dynamic learning environment, instill creative thinking, and cultivate
            entrepreneurial skills for service to the global community.
          </p>
        </article>

        <article className="bsse-panel">
          <h2>Graduate Outcomes</h2>
          <ul className="bsse-list bsse-list--checks">
            {OUTCOMES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="bsse-panel">
          <h2>Program Focus Areas</h2>
          <ul className="bsse-list">
            {FOCUS_AREAS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="bsse-panel bsse-panel--society bsse-panel--full">
          <h2>Our Society</h2>
          <p>
            <strong>Event Society of Software Engineering (ESSE)</strong> supports student activities,
            leadership, and professional growth through events and community engagement.
          </p>
          <a
            className="bsse-society-link"
            href="https://www.instagram.com/esse_lgu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit ESSE Community
          </a>
        </article>
      </section>
    </main>
  )
}
