import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import './VoiceAssistant.css'

function resolveRouteFromSpeech(text) {
  const value = text.toLowerCase()

  const bscsKeywords = [
    'bscs',
     'cs',
    'bs cs',
    'computer science',
    'cs program',
    'cs page',
    'go to cs',
    'open cs',
  ]
  const bsseKeywords = [
    'bsse',
    'se',
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
    'ai',
    'artificial intelligence',
    'ai program',
    'ai page',
    'go to ai',
    'open ai',
  ]

  if (bscsKeywords.some((key) => value.includes(key))) return '/bscs'
  if (bsseKeywords.some((key) => value.includes(key))) return '/bsse'
  if (bsaiKeywords.some((key) => value.includes(key))) return '/bsai'
  if (value.includes('home')) return '/'
  return null
}

/** Must stay in sync with routes returned by resolveRouteFromSpeech. */
const ROUTE_CONFIRMATION_PHRASES = {
  '/': 'Opening home.',
  '/bscs': 'Opening the BSCS program.',
  '/bsse': 'Opening the BSSE program.',
  '/bsai': 'Opening the BSAI program.',
}

/**
 * Speaks a short confirmation only for known voice routes.
 * Call only after navigate(route) has been invoked for the same `route`.
 */
function speakRouteConfirmation(route) {
  if (typeof window === 'undefined') return
  const phrase = ROUTE_CONFIRMATION_PHRASES[route]
  if (!phrase) return

  const synth = window.speechSynthesis
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return

  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(phrase)
  utterance.rate = 1.02
  synth.speak(utterance)
}

export default function VoiceAssistant() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Say: BSCS, SE, AI, or Home')
  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  const supported = useMemo(() => browserSupportsSpeechRecognition, [browserSupportsSpeechRecognition])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (!isOpen || !supported) return

    const timer = setTimeout(async () => {
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
      clearTimeout(timer)
      SpeechRecognition.stopListening()
    }
  }, [isOpen, supported])

  useEffect(() => {
    if (!finalTranscript) return
    const route = resolveRouteFromSpeech(finalTranscript)
    if (!route) {
      setStatusMessage(`No route mapped for: "${finalTranscript}"`)
      return
    }

    navigate(route)
    speakRouteConfirmation(route)
    setStatusMessage(`Navigated using: "${finalTranscript}"`)
    resetTranscript()
  }, [finalTranscript, navigate, resetTranscript])

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
          <p className="voice-assistant__hint">Say: BSCS, CS, BSSE, SE, BSAI, AI, Home</p>
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
            if (!next) setStatusMessage('Voice assistant closed')
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
