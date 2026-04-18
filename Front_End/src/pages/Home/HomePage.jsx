import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import HomeNewsCarousel from './HomeNewsCarousel'
import HomeSocialMarquee from './HomeSocialMarquee'
import StatsCounter from '../../components/StatsCounter/StatsCounter'
import HomeEnterSiteModal from '../../components/HomeEnterSiteModal/HomeEnterSiteModal'
import './HomePage.css'

/** Campus hero photo — swap between hero-campus.jpg (lawn + building) and hero-campus-alt.jpg (alternate). */
const HERO_BG = '/images/hero-campus.jpg'

const programs = [
  {
    title: 'BS Computer Science',
    code: 'BSCS',
    description:
      'Build advanced foundations in algorithms, AI, data science, cloud systems, and software architecture.',
    gradient: 'card-bscs',
  },
  {
    title: 'BS Software Engineering',
    code: 'BSSE',
    description:
      'Master full software lifecycle, quality assurance, DevOps, requirements engineering, and agile practices.',
    gradient: 'card-bsse',
  },
  {
    title: 'BS Artificial Intelligence',
    code: 'BSAI',
    description:
      'Learn machine learning, deep learning, NLP, computer vision, and intelligent system design.',
    gradient: 'card-bsai',
  },
]

const newsItems = [
  {
    tag: 'Innovation',
    title: 'Innovation and Entrepreneurship Session',
    text:
      'LGU hosted an industry-led session on global service startup opportunities.',
  },
  {
    tag: 'Academics',
    title: 'AI Integration in Curriculum',
    text:
      'Leadership explored practical ways to weave AI literacy and tools into modern university coursework.',
  },
  {
    tag: 'Campus life',
    title: 'Book Reading Club Activity',
    text:
      'Students joined reflective discussions to celebrate knowledge, values, and critical thinking.',
  },
]

export default function HomePage() {
  const [flipped, setFlipped] = useState(() => ({}))

  const toggleProgramCard = (code, e) => {
    if (typeof window !== 'undefined' && window.innerWidth > 900) return
    if (e?.target?.closest?.('a')) return
    setFlipped((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  return (
    <main>
      <HomeEnterSiteModal />
      <section className="home-hero" aria-labelledby="home-hero-heading">
        <div
          className="home-hero__bg"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          role="presentation"
        />
        <div className="home-hero__scrim" role="presentation" />
        <div className="container home-hero__inner">
          <div className="home-hero__main">
            <p className="home-kicker home-kicker--on-hero">Lahore Garrison University</p>
            <h1 id="home-hero-heading">Shape the Future with Computing, Engineering &amp; AI</h1>
            <p className="home-hero-text">
              Lahore Garrison University — excellence in academia, research, and graduates ready for
              industry. Your journey starts on a campus built for discovery.
            </p>
            <div className="home-hero-actions">
              <NavLink to="/bscs" className="home-btn home-btn-primary">
                <span className="home-btn__label">Explore BSCS</span>
              </NavLink>
              <NavLink to="/bsai" className="home-btn home-btn-secondary">
                <span className="home-btn__label">Discover BSAI</span>
              </NavLink>
            </div>
          </div>
          <aside className="home-hero__aside" aria-label="University identity">
            <div className="home-hero__glass">
              <div className="home-hero__logo-wrap">
                <img
                  className="home-hero__logo"
                  src="/images/lgu-logo.jpg"
                  width={120}
                  height={120}
                  alt="Lahore Garrison University seal"
                />
              </div>
              <blockquote className="home-hero__motto">&ldquo;Knowledge is Light&rdquo;</blockquote>
              <p className="home-hero__tagline">Official motto — a tradition of learning and service.</p>
              <a
                className="home-hero__site-link"
                href="https://lgu.edu.pk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit lgu.edu.pk
              </a>
            </div>
          </aside>
        </div>
      </section>

      <HomeSocialMarquee />

      <StatsCounter />

      <section className="home-elig-cta container" aria-labelledby="home-elig-cta-heading">
        <div className="home-elig-cta__inner">
          <div className="home-elig-cta__copy">
            <p className="home-kicker">Plan your admission</p>
            <h2 id="home-elig-cta-heading">Admission eligibility estimator</h2>
            <p className="home-elig-cta__text">
              Check the 50% Intermediate minimum, compare BSCS, BSSE, BSAI, and BSIT admission bands, and see a
              scholarship snapshot—on a dedicated planner page.
            </p>
          </div>
          <NavLink to="/eligibility" className="home-elig-cta__btn">
            Open admission planner
          </NavLink>
        </div>
      </section>

      <section className="home-programs container">
        <div className="home-section-head">
          <p className="home-kicker">Featured Programs</p>
          <h2>Choose Your Path in Tech</h2>
        </div>
        <div className="home-cards-grid">
          {programs.map((program) => (
            <article
              key={program.code}
              className={`home-program-card${flipped[program.code] ? ' home-program-card--flipped' : ''}`}
              onClick={(e) => toggleProgramCard(program.code, e)}
            >
              <div className="home-program-card__flip">
                <div className="home-program-card__rotate">
                  <div
                    className={`home-program-card__face home-program-card__face--front ${program.gradient}`}
                  >
                    <span className="home-program-card__code">{program.code}</span>
                    <h3>{program.title}</h3>
                    <p>{program.description}</p>
                    <NavLink
                      to={`/${program.code.toLowerCase()}`}
                      className="home-card-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="home-btn__label">Open Route</span>
                    </NavLink>
                  </div>
                  <div
                    className={`home-program-card__face home-program-card__face--back ${program.gradient}`}
                    aria-hidden="true"
                  >
                    <span className="home-program-card__code">{program.code}</span>
                    <h3>{program.title}</h3>
                    <p className="home-program-card__back-lede">
                      Labs, projects, and career tracks — open the full program page to explore.
                    </p>
                    <NavLink
                      to={`/${program.code.toLowerCase()}`}
                      className="home-card-link"
                      tabIndex={-1}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="home-btn__label">Open Route</span>
                    </NavLink>
                  </div>
                </div>
              </div>
              <p className="home-program-card__tap-hint" aria-hidden="true">
                Tap card to flip
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-news">
        <div className="home-news__band">
          <div className="container home-news__band-inner">
            <p className="home-news__eyebrow">University feed</p>
            <h2 className="home-news__title">News &amp; announcements</h2>
            <p className="home-news__lede">
              Highlights from campus — sessions, curriculum, and student life.
            </p>
          </div>
        </div>
        <HomeNewsCarousel items={newsItems} />
      </section>
    </main>
  )
}
