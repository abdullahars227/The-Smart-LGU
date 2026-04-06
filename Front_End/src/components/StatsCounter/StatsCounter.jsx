import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function StatCell({ target, suffix, label, isK, runId, instant, onPointerEnter }) {
  const [n, setN] = useState(1)

  useEffect(() => {
    if (instant) {
      setN(target)
      return
    }
    if (!runId) return

    setN(1)
    let startTime
    const duration = 1150
    const startVal = 1

    const tick = (now) => {
      if (startTime === undefined) startTime = now
      const elapsed = now - startTime
      const p = Math.min(elapsed / duration, 1)
      const v = Math.round(startVal + (target - startVal) * easeOutCubic(p))
      setN(v)
      if (p < 1) requestAnimationFrame(tick)
    }

    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [runId, target, instant])

  const display = isK ? `${n}k+` : `${n}${suffix}`
  const showPlaceholder = !runId && !instant

  return (
    <article
      className="home-stats-card"
      onPointerEnter={onPointerEnter}
    >
      <h3 className="home-stats__value" aria-live="polite">
        {showPlaceholder ? <span className="home-stats__placeholder">—</span> : display}
      </h3>
      <p>{label}</p>
    </article>
  )
}

export default function StatsCounter() {
  const [runId, setRunId] = useState(0)
  const [instant, setInstant] = useState(false)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setInstant(true)
      return
    }
    setRunId(1)
  }, [])

  const replayOnHover = useCallback(() => {
    if (instant) return
    setRunId((r) => r + 1)
  }, [instant])

  const items = [
    { target: 15, suffix: '+', label: 'Departments' },
    { target: 120, suffix: '+', label: 'Faculty Members' },
    { target: 40, suffix: '+', label: 'Computing Labs' },
    { target: 20, suffix: 'k+', label: 'Alumni Network', isK: true },
  ]

  return (
    <section className="home-stats">
      <div className="container home-stats-grid">
        {items.map((item) => (
          <StatCell
            key={item.label}
            target={item.target}
            suffix={item.suffix}
            label={item.label}
            isK={item.isK}
            runId={runId}
            instant={instant}
            onPointerEnter={replayOnHover}
          />
        ))}
      </div>
    </section>
  )
}
