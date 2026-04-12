import { useEffect, useRef } from 'react'
import { PAGE_LOAD_ID } from '../../initialDocumentPath.js'

const WELCOME_TEXT = 'Welcome to Lahore Garrison University.'

/** Only set after TTS finishes — avoids React Strict Mode skipping playback when onStart wrote storage before unmount. */
const STORAGE_KEY = `lgu_welcome_done_${PAGE_LOAD_ID}`

function getNavigationType() {
  const nav = performance.getEntriesByType('navigation')[0]
  if (nav?.type) return nav.type
  if (typeof performance.navigation !== 'undefined') {
    if (performance.navigation.type === 1) return 'reload'
    if (performance.navigation.type === 2) return 'back_forward'
  }
  return 'navigate'
}

function shouldPlayWelcome() {
  const t = getNavigationType()
  if (t === 'reload') return true
  if (t === 'back_forward') return false
  if (t === 'navigate' || t === 'prerender') {
    return typeof window !== 'undefined' && window.location.pathname === '/'
  }
  return false
}

export default function HomeWelcomeSpeech() {
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return undefined
    } catch {
      /* no sessionStorage */
    }
    if (!shouldPlayWelcome()) return undefined

    const synth = window.speechSynthesis
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return undefined

    const playWelcome = () => {
      if (cancelledRef.current) return
      synth.cancel()
      const u = new SpeechSynthesisUtterance(WELCOME_TEXT)
      u.rate = 0.96
      u.pitch = 1
      u.volume = 1
      u.lang = 'en-US'
      u.onend = () => {
        try {
          sessionStorage.setItem(STORAGE_KEY, '1')
        } catch {
          /* ignore */
        }
      }
      u.onerror = () => {
        try {
          sessionStorage.setItem(STORAGE_KEY, '1')
        } catch {
          /* ignore */
        }
      }
      synth.speak(u)
    }

    let playTimer = null
    let voicesTimer = null
    let interactionTimer = null

    const schedulePlay = () => {
      playTimer = window.setTimeout(() => {
        if (!cancelledRef.current) playWelcome()
      }, 80)
    }

    if (synth.getVoices().length > 0) {
      schedulePlay()
    } else {
      const onVoices = () => {
        if (cancelledRef.current || !synth.getVoices().length) return
        synth.removeEventListener('voiceschanged', onVoices)
        if (voicesTimer != null) {
          window.clearTimeout(voicesTimer)
          voicesTimer = null
        }
        schedulePlay()
      }
      synth.addEventListener('voiceschanged', onVoices)
      voicesTimer = window.setTimeout(() => {
        synth.removeEventListener('voiceschanged', onVoices)
        voicesTimer = null
        if (!cancelledRef.current) schedulePlay()
      }, 400)
    }

    const onFirstPointer = () => {
      if (cancelledRef.current) return
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) return
      } catch {
        /* ignore */
      }
      playWelcome()
    }

    interactionTimer = window.setTimeout(() => {
      if (cancelledRef.current) return
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) return
      } catch {
        /* ignore */
      }
      if (synth.speaking) return
      window.addEventListener('pointerdown', onFirstPointer, { once: true, passive: true })
    }, 900)

    return () => {
      cancelledRef.current = true
      if (playTimer != null) window.clearTimeout(playTimer)
      if (voicesTimer != null) window.clearTimeout(voicesTimer)
      if (interactionTimer != null) window.clearTimeout(interactionTimer)
      window.removeEventListener('pointerdown', onFirstPointer)
      synth.cancel()
    }
  }, [])

  return null
}
