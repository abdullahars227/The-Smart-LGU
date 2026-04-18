import { useCallback, useId, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { computeEligibility, MIN_INTERMEDIATE_ELIGIBLE, PREFERRED_FIELD_OPTIONS } from '../../lib/eligibilityEngine'
import './HomeEligibilitySection.css'

function ProgramLink({ id, children }) {
  if (id === 'bsit') {
    return (
      <NavLink to="/" className="elig-program-card__link">
        {children} <span className="elig-program-card__link-hint">(see faculty overview)</span>
      </NavLink>
    )
  }
  return (
    <NavLink to={`/${id}`} className="elig-program-card__link">
      {children}
    </NavLink>
  )
}

export default function HomeEligibilitySection() {
  const formId = useId()
  const resultsRef = useRef(null)
  const [aggregate, setAggregate] = useState('')
  const [preferredField, setPreferredField] = useState('')
  const [result, setResult] = useState(null)
  const [formError, setFormError] = useState(null)

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      setFormError(null)
      if (aggregate === '') {
        setFormError(`Enter your Intermediate aggregate (${MIN_INTERMEDIATE_ELIGIBLE}% minimum to apply).`)
        setResult(null)
        return
      }
      const out = computeEligibility({
        intermediatePct: Number(aggregate),
        preferredField,
      })
      if (!out.ok) {
        setFormError(out.errors.join(' '))
        setResult(null)
        return
      }
      setResult(out)
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [aggregate, preferredField],
  )

  const programAccent = (accent) => `elig-program-card elig-program-card--${accent}`

  return (
    <section className="home-eligibility" id="admission-planner" aria-labelledby="home-eligibility-title">
      <div className="home-eligibility__head" aria-hidden="false">
        <div className="home-eligibility__aurora" aria-hidden="true" />
        <div className="home-eligibility__grid" aria-hidden="true" />
        <div className="home-eligibility__shimmer" aria-hidden="true" />
        <div className="container home-eligibility__head-inner">
          <p className="home-eligibility__eyebrow">LGU admissions</p>
          <h2 id="home-eligibility-title" className="home-eligibility__title">
            Admission Eligibility &amp; Program Recommendation
          </h2>
          <p className="home-eligibility__lead">
            One number that matters here: your <strong>Intermediate aggregate</strong>. We check if you can apply (50% minimum), then show plain
            admission-chance bands for BSCS, BSSE, BSAI, and BSIT—no fake decimal merit scores.
          </p>
        </div>
      </div>

      <div className="container home-eligibility__layout elig-layout">
        <section className="elig-panel elig-panel--form" aria-labelledby={`${formId}-heading`}>
          <h3 id={`${formId}-heading`} className="elig-panel__title">
            Your Intermediate result
          </h3>
          <p className="elig-panel__hint">
            Enter your aggregate as on the marks sheet. Optional: preferred area—we use it only to break ties for the “best for you” line.
          </p>
          <form className="elig-form" onSubmit={onSubmit} noValidate>
            <div className="elig-field">
              <label htmlFor={`${formId}-aggregate`}>Intermediate (or equivalent) aggregate %</label>
              <input
                id={`${formId}-aggregate`}
                type="number"
                min={0}
                max={100}
                step={0.01}
                inputMode="decimal"
                placeholder={`e.g. 72 (${MIN_INTERMEDIATE_ELIGIBLE}% minimum to apply)`}
                value={aggregate}
                onChange={(e) => setAggregate(e.target.value)}
                required
              />
            </div>

            <div className="elig-field">
              <label htmlFor={`${formId}-pref`}>Preferred field (optional)</label>
              <select
                id={`${formId}-pref`}
                className="elig-select"
                value={preferredField}
                onChange={(e) => setPreferredField(e.target.value)}
              >
                {PREFERRED_FIELD_OPTIONS.map((o) => (
                  <option key={o.value || 'none'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {formError ? (
              <div className="elig-form-error" role="alert">
                {formError}
              </div>
            ) : null}

            <button type="submit" className="elig-submit elig-submit--flow">
              See admission chances
            </button>
          </form>
        </section>

        <section
          ref={resultsRef}
          className={`elig-panel elig-panel--results${result ? ' elig-panel--results-visible' : ''}`}
          aria-live="polite"
        >
          {!result ? (
            <div className="elig-placeholder">
              <p className="elig-placeholder__title">Your summary will show here</p>
              <p className="elig-placeholder__text">
                You’ll get a clear eligible / not eligible line, a best-fit program, and four simple cards (Safe / Possible / Low Chance).
              </p>
            </div>
          ) : (
            <>
              <div className={`elig-verdict elig-verdict--${result.eligibleToApply ? 'yes' : 'no'}`}>
                <p className="elig-verdict__title">{result.headline}</p>
                <p className="elig-verdict__detail">{result.headlineDetail}</p>
              </div>

              {result.eligibleToApply && result.bestProgram ? (
                <div className="elig-best">
                  <p className="elig-best__label">Best program for you</p>
                  <p className="elig-best__name">
                    <span className="elig-best__emoji" aria-hidden="true">
                      {result.bestProgram.emoji}
                    </span>{' '}
                    {result.bestProgram.code} — {result.bestProgram.band}
                  </p>
                  <p className="elig-best__name-full">{result.bestProgram.name}</p>
                  <p className="elig-best__expl">{result.recommendationExplanation}</p>
                  {result.preferenceNote ? <p className="elig-best__pref">{result.preferenceNote}</p> : null}
                </div>
              ) : null}

              {result.eligibleToApply && result.programResults.length > 0 ? (
                <>
                  <h3 className="elig-section-title">Admission chance by program</h3>
                  <p className="elig-program-intro">
                    Bands use your <strong>Intermediate %</strong> only. “Safe” means your marks usually sit above typical expectations; “Possible”
                    means you may still get in depending on seats and entry test; “Low Chance” means it’s an uphill choice.
                  </p>
                  <div className="elig-program-grid">
                    {result.programResults.map((p) => (
                      <article key={p.id} className={programAccent(p.accent)}>
                        <header className="elig-program-card__head">
                          <span className="elig-program-card__code">{p.code}</span>
                          <span className={`elig-pill elig-pill--${p.band}`} title={p.badge}>
                            <span aria-hidden="true">{p.emoji}</span> {p.badge}
                          </span>
                        </header>
                        <h4 className="elig-program-card__name">{p.name}</h4>
                        <p className="elig-program-card__score">Your score: {p.yourScoreLabel}%</p>
                        <p className="elig-program-card__line">{p.line}</p>
                        <p className="elig-program-card__extra">{p.extra}</p>
                        <ProgramLink id={p.id}>
                          View {p.code}
                        </ProgramLink>
                      </article>
                    ))}
                  </div>
                </>
              ) : null}

              {!result.eligibleToApply ? (
                <p className="elig-blocked-hint">
                  Raise Intermediate to at least {MIN_INTERMEDIATE_ELIGIBLE}% (or ask admissions about accepted alternatives), then try again.
                </p>
              ) : null}

              <div className={`elig-scholarship elig-scholarship--${result.scholarship.tier}`}>
                <h3 className="elig-section-title">Scholarship snapshot (Intermediate–based)</h3>
                <p className="elig-scholarship__headline">{result.scholarship.headline}</p>
                <p className="elig-scholarship__detail">{result.scholarship.detail}</p>
                {result.scholarship.conditions.length > 0 ? (
                  <ul className="elig-scholarship__conditions">
                    {result.scholarship.conditions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="elig-scholarship__fineprint">
                  <strong>90%+ Intermediate:</strong> often full fee waiver bands. <strong>80%+ Intermediate:</strong> often partial fee off with{' '}
                  <strong>SGPA 3.50+</strong> to keep it. Always confirm with admissions.
                </p>
              </div>

              <footer className="elig-disclaimer">
                <p>
                  This tool is for orientation only. LGU sets real merit lists, quotas, and scholarships each year—use the official prospectus
                  and notices.
                </p>
              </footer>
            </>
          )}
        </section>
      </div>
    </section>
  )
}
