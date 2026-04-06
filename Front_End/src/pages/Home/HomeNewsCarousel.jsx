import { useCallback, useEffect, useRef, useState } from 'react'

/** Time each slide stays on screen; progress bar fills linearly over this duration. */
const SLIDE_DURATION_MS = 4200
const SWIPE_MIN_PX = 48

/**
 * Center = sharp; left/right = blurred. Smooth autoplay (slider-like fill) + pause on hover / while dragging.
 */
export default function HomeNewsCarousel({ items }) {
  const n = items?.length ?? 0
  const [index, setIndex] = useState(0)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [slideProgress, setSlideProgress] = useState(0)
  const dragStartX = useRef(null)
  const slideStartRef = useRef(0)
  const progressRef = useRef(0)

  const paused = hoverPaused || dragging

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const go = useCallback(
    (dir) => {
      setIndex((i) => {
        if (dir === 'next') return (i + 1) % n
        if (dir === 'prev') return (i - 1 + n) % n
        return i
      })
    },
    [n]
  )

  // Reset slide timer when the active slide changes (auto, swipe, or keyboard).
  useEffect(() => {
    if (reduceMotion || n <= 1) return
    slideStartRef.current = Date.now()
    progressRef.current = 0
    setSlideProgress(0)
  }, [index, n, reduceMotion])

  // Smooth linear progress + advance when full (requestAnimationFrame).
  useEffect(() => {
    if (reduceMotion || paused || n <= 1) return

    slideStartRef.current = Date.now() - (progressRef.current / 100) * SLIDE_DURATION_MS

    let cancelled = false
    let raf = 0

    const loop = () => {
      if (cancelled) return
      const elapsed = Date.now() - slideStartRef.current
      const p = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100)
      progressRef.current = p
      setSlideProgress(p)
      if (elapsed >= SLIDE_DURATION_MS) {
        go('next')
        return
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [index, paused, reduceMotion, n, go])

  // Reduced motion: stepped advance only, no smooth fill.
  useEffect(() => {
    if (!reduceMotion || n <= 1) return
    if (paused) return
    const id = window.setInterval(() => go('next'), SLIDE_DURATION_MS)
    return () => window.clearInterval(id)
  }, [reduceMotion, paused, n, go])

  const onPointerDown = (e) => {
    if (n <= 1) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragStartX.current = e.clientX
    setDragging(true)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onPointerUp = (e) => {
    const startX = dragStartX.current
    dragStartX.current = null
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    if (startX == null || n <= 1) return
    const dx = e.clientX - startX
    if (dx > SWIPE_MIN_PX) go('prev')
    else if (dx < -SWIPE_MIN_PX) go('next')
  }

  const onPointerCancel = (e) => {
    dragStartX.current = null
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onKeyDown = (e) => {
    if (n <= 1) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go('prev')
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go('next')
    }
  }

  if (n === 0) return null

  const segmentPct = ((index + 1) / n) * 100
  const progressFillPct =
    n <= 1 ? 100 : reduceMotion ? segmentPct : slideProgress

  const left = n > 1 ? items[(index - 1 + n) % n] : null
  const center = items[index]
  const right = n > 1 ? items[(index + 1) % n] : null

  const card = (item) => (
    <>
      <span className="home-news-card__tag">{item.tag}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </>
  )

  return (
    <div className="home-news-carousel-wrap">
      <div
        className="home-news-carousel"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
      >
        <div className="home-news-carousel__shell" aria-roledescription="carousel">
          <div className="home-news-carousel__meta" aria-hidden="true">
            <span className="home-news-carousel__meta-label">Feed</span>
            <span className="home-news-carousel__meta-line" />
          </div>

          <div className="home-news-carousel__progress" role="presentation" aria-hidden="true">
            <span
              className="home-news-carousel__progress-fill"
              style={{ width: `${progressFillPct}%` }}
            />
          </div>

          <div
            className={`home-news-carousel__stage${n === 1 ? ' home-news-carousel__stage--single' : ''}${dragging ? ' home-news-carousel__stage--dragging' : ''}`}
            role="region"
            tabIndex={n > 1 ? 0 : -1}
            aria-label="News announcements. Drag or swipe to change slide. Use left and right arrow keys when focused."
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onKeyDown={onKeyDown}
          >
            {n > 1 && left && (
              <article className="home-news-carousel__panel home-news-carousel__panel--side" aria-hidden="true">
                <div className="home-news-card home-news-carousel__card home-news-carousel__card--blur">
                  {card(left)}
                </div>
              </article>
            )}

            <article className="home-news-carousel__panel home-news-carousel__panel--focus" aria-live="polite">
              <div
                key={index}
                className="home-news-card home-news-carousel__card home-news-carousel__card--sharp home-news-carousel__card--enter"
              >
                {card(center)}
              </div>
            </article>

            {n > 1 && right && (
              <article className="home-news-carousel__panel home-news-carousel__panel--side" aria-hidden="true">
                <div className="home-news-card home-news-carousel__card home-news-carousel__card--blur">
                  {card(right)}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
