import { useEffect, useRef } from 'react'
import { useSpeech } from 'react-text-to-speech'
import { PAGE_LOAD_ID } from '../../initialDocumentPath.js'

const WELCOME_TEXT =
  'Welcome to Lahore Garrison University.'

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

/**
 * When to play welcome TTS:
 * - Reload on `/` → yes
 * - Browser back/forward → no (avoid repeating when returning to home)
 * - Normal navigation → yes only if the **current** URL is `/` (not only the first URL of the session).
 *   Using the first path only broke local dev when the app opened on `/login` or another route first,
 *   then navigated to `/` — production often hits `/` first so it looked fine there.
 */
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
  const { start, stop } = useSpeech({
    text: WELCOME_TEXT,
    stableText: true,
    rate: 0.96,
    pitch: 1,
    volume: 1,
    lang: 'en-US',
    highlightText: false,
    onStart: () => {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
    },
  })

  const startRef = useRef(start)
  const stopRef = useRef(stop)
  startRef.current = start
  stopRef.current = stop

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return undefined
    } catch {
      /* no sessionStorage */
    }
    if (!shouldPlayWelcome()) return undefined

    const synth = window.speechSynthesis
    if (!synth) return undefined

    let cancelled = false
    let playTimer = null
    let voicesTimer = null
    let interactionTimer = null
    let scheduled = false

    const play = () => {
      if (cancelled || scheduled) return
      scheduled = true
      playTimer = window.setTimeout(() => {
        if (!cancelled) startRef.current()
      }, 80)
    }

    if (synth.getVoices().length > 0) {
      play()
    } else {
      const onVoices = () => {
        if (cancelled || !synth.getVoices().length) return
        synth.removeEventListener('voiceschanged', onVoices)
        if (voicesTimer != null) {
          window.clearTimeout(voicesTimer)
          voicesTimer = null
        }
        play()
      }
      synth.addEventListener('voiceschanged', onVoices)
      voicesTimer = window.setTimeout(() => {
        synth.removeEventListener('voiceschanged', onVoices)
        voicesTimer = null
        if (!cancelled) play()
      }, 400)
    }

    const onFirstPointer = () => {
      if (cancelled) return
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) return
      } catch {
        /* ignore */
      }
      startRef.current()
    }

    interactionTimer = window.setTimeout(() => {
      if (cancelled) return
      try {
        if (sessionStorage.getItem(STORAGE_KEY)) return
      } catch {
        /* ignore */
      }
      if (window.speechSynthesis?.speaking) return
      window.addEventListener('pointerdown', onFirstPointer, { once: true, passive: true })
    }, 900)

    return () => {
      cancelled = true
      if (playTimer != null) window.clearTimeout(playTimer)
      if (voicesTimer != null) window.clearTimeout(voicesTimer)
      if (interactionTimer != null) window.clearTimeout(interactionTimer)
      window.removeEventListener('pointerdown', onFirstPointer)
      stopRef.current()
    }
  }, [])

  return null
}
