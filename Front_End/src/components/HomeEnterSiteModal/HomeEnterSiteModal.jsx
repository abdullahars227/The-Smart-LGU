import { useEffect, useRef, useState } from 'react'
import './HomeEnterSiteModal.css'

/** Spoken after Enter site — concise for TTS. */
const WELCOME_SPOKEN = 'Welcome to The Smart LGU.'

const SESSION_ENTER_KEY = 'lgu-smart-site-entered'

function readSessionEntered() {
  if (typeof window === 'undefined') return true
  return window.sessionStorage.getItem(SESSION_ENTER_KEY) === '1'
}

/**
 * Shown once per browser tab session until "Enter site".
 * Reloading the page does not show the modal or replay welcome audio (sessionStorage persists).
 */
export default function HomeEnterSiteModal() {
  const [open, setOpen] = useState(() => !readSessionEntered())
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (open) closeBtnRef.current?.focus()
  }, [open])

  const handleEnterSite = () => {
    try {
      sessionStorage.setItem(SESSION_ENTER_KEY, '1')
    } catch {
      /* ignore private mode */
    }
    setOpen(false)
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(WELCOME_SPOKEN)
      u.rate = 0.96
      u.pitch = 1
      u.volume = 1
      u.lang = 'en-US'
      window.speechSynthesis.speak(u)
    } catch {
      /* ignore */
    }
  }

  if (!open) return null

  return (
    <div
      className="enter-site-modal"
      role="presentation"
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleEnterSite()
      }}
    >
      <div className="enter-site-modal__backdrop" role="presentation" aria-hidden="true" />
      <div
        className="enter-site-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enter-site-title"
        aria-describedby="enter-site-desc"
      >
        <p className="enter-site-modal__eyebrow">Demo · Lahore Garrison University</p>
        <h2 id="enter-site-title" className="enter-site-modal__title">
          The Smart LGU
        </h2>
        <p id="enter-site-desc" className="enter-site-modal__text">
          A prototype of a smarter LGU web experience—highlighting programs like BSCS, BSSE, and BSAI, clearer
          navigation, and tools that could improve how prospective students explore options and move toward
          admissions. This is a demo version focused on conversion and engagement.
        </p>
        <button
          ref={closeBtnRef}
          type="button"
          className="enter-site-modal__btn"
          onClick={handleEnterSite}
        >
          Enter site
        </button>
      </div>
    </div>
  )
}
