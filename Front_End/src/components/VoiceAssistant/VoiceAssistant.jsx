import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import './VoiceAssistant.css'

/**
 * Mic often picks up our own route-confirmation TTS — ignore transcripts that match that wording.
 * Keep in sync with `routeOpeningPhrase()` below (anything we speak must be ignored here).
 */
function isLikelySpeakerEcho(text) {
  const v = text.trim().toLowerCase()
  if (!v) return false
  if (/^opening\b/.test(v)) return true
  if (v.includes('opening the') && v.includes('program')) return true
  if (v.includes('opening the') && v.includes('home')) return true
  if (v.includes('navigated using')) return true
  /* Enter-site welcome TTS (“Welcome to The Smart LGU.”) — ignore if mic picks it up */
  if (v.includes('welcome to') && (v.includes('smart lgu') || v.includes('smart lg'))) return true
  if (v.includes('welcome to') && v.includes('lahore')) return true
  if (v.includes('welcome to') && v.includes('garrison')) return true
  return false
}

/** Spoken after navigation; must be caught by isLikelySpeakerEcho to avoid route loops. */
function routeOpeningPhrase(route) {
  if (route === '/') return 'Opening the home page.'
  const code = route.replace('/', '').toUpperCase()
  return `Opening the ${code} program.`
}

function speakRouteOpening(route, onComplete) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onComplete?.()
    return
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(routeOpeningPhrase(route))
  u.rate = 0.95
  u.onend = () => {
    window.setTimeout(() => onComplete?.(), 400)
  }
  u.onerror = () => onComplete?.()
  window.speechSynthesis.speak(u)
}

function resolveRouteFromSpeech(text) {
  if (isLikelySpeakerEcho(text)) return null

  const value = text.toLowerCase()

  const bscsKeywords = [
    'bscs',
    'bs cs',
    'computer science',
    'cs program',
    'cs page',
    'go to cs',
    'open cs',
  ]
  const bsseKeywords = [
    'bsse',
    'bs se',
    'software engineering',
    'se program',
    'se page',
    'go to se',
    'open se',
  ]
  const bsaiKeywords = [
    'bsai',
    'bs ai',
    'artificial intelligence',
    'ai program',
    'ai page',
    'go to ai',
    'open ai',
  ]

  if (bscsKeywords.some((key) => value.includes(key))) return '/bscs'
  if (bsseKeywords.some((key) => value.includes(key))) return '/bsse'
  if (bsaiKeywords.some((key) => value.includes(key))) return '/bsai'
  if (/\bhome\b/.test(value)) return '/'
  return null
}

export default function VoiceAssistant() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Say: BSCS, SE, AI, or Home')
  const resumeTimerRef = useRef(null)
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen

  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  const supported = useMemo(() => browserSupportsSpeechRecognition, [browserSupportsSpeechRecognition])

  const stopVoiceUi = useCallback(() => {
    if (resumeTimerRef.current != null) {
      window.clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = null
    }
    try {
      SpeechRecognition.abortListening()
    } catch {
      try {
        SpeechRecognition.stopListening()
      } catch {
        /* ignore */
      }
    }
    resetTranscript()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [resetTranscript])

  useEffect(() => {
    return () => {
      stopVoiceUi()
    }
  }, [stopVoiceUi])

  useEffect(() => {
    if (!isOpen || !supported) return

    const timer = window.setTimeout(async () => {
      try {
        await SpeechRecognition.startListening({
          continuous: true,
          language: 'en-US',
        })
        setStatusMessage('Listening... say BSCS, BSSE, BSAI, or Home')
      } catch {
        setStatusMessage('Microphone permission is required to use voice navigation.')
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      SpeechRecognition.abortListening()
    }
  }, [isOpen, supported])

  useEffect(() => {
    if (!finalTranscript || !isOpen) return

    if (isLikelySpeakerEcho(finalTranscript)) {
      resetTranscript()
      return
    }

    const route = resolveRouteFromSpeech(finalTranscript)
    if (!route) {
      setStatusMessage(`No route mapped for: "${finalTranscript}"`)
      resetTranscript()
      return
    }

    SpeechRecognition.abortListening()
    resetTranscript()

    navigate(route)
    const label = route === '/' ? 'Home' : route.replace('/', '').toUpperCase()
    setStatusMessage(`Navigated to ${label}. Confirmation is spoken; mic turns on again after.`)

    if (resumeTimerRef.current != null) window.clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = null

    speakRouteOpening(route, async () => {
      if (!isOpenRef.current) return
      try {
        await SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
      } catch {
        /* ignore */
      }
    })
  }, [finalTranscript, isOpen, navigate, resetTranscript])

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-assistant voice-assistant--unsupported">
        Voice routing not supported in this browser.
      </div>
    )
  }

  return (
    <>
      {isOpen ? (
        <div className="voice-assistant">
          <p className="voice-assistant__title">Voice Navigation</p>
          <p className="voice-assistant__hint">Say: BSCS, BSSE, BSAI, or Home (speakers can confuse the mic—use headphones if it repeats)</p>
          <p className="voice-assistant__status">
            Mic: <strong>{listening ? 'On' : 'Off'}</strong>
          </p>
          <p className="voice-assistant__transcript">
            {transcript || 'Listening... speak a route keyword'}
          </p>
          <p className="voice-assistant__status-message">{statusMessage}</p>
        </div>
      ) : null}
      <button
        type="button"
        className={`voice-fab ${isOpen ? 'voice-fab--active' : ''}`}
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev
            if (!next) {
              stopVoiceUi()
              setStatusMessage('Voice assistant closed')
            }
            return next
          })
        }}
        aria-label={isOpen ? 'Close voice assistant' : 'Open voice assistant'}
      >
        Voice assistant
      </button>
    </>
  )
}
