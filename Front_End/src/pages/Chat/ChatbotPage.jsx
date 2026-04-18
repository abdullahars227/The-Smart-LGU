import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CAMPUS_QUICK_PICKS, matchCampusNavigationQuery } from '../../lib/campusNavigation'
import { getChatSessionId, RAG_SESSION_HEADER } from '../../lib/chatSession'
import { getSupportWhatsappDisplay, getSupportWhatsappUrl } from '../../lib/supportWhatsApp'
import './ChatbotPage.css'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function buildCampusAssistantMessage(pick) {
  return {
    role: 'assistant',
    content: `Here is ${pick.label} on Google Maps. Open the link on your phone for live directions—the pin marks the exact spot on campus.`,
    navigation: { label: pick.label, url: pick.url },
    sources: [],
    id: uid(),
  }
}

function MapsPinIcon() {
  return (
    <svg className="chatbot-page__nav-card-icon" viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
      <path
        fill="currentColor"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg className="chatbot-page__wa-glyph" viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  )
}

async function fetchRagSession() {
  const res = await fetch('/api/rag/session', {
    headers: { [RAG_SESSION_HEADER]: getChatSessionId() },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Could not load session')
  return data
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome. Ask about BSCS, BSSE, or BSAI — fees, eligibility, and labs from our PDF knowledge base. For on-campus directions (mosque, cafe, Fountain Ground, sports complex, or main gate), type a question like “Where is LGU Mosque?” or use the shortcuts below—no extra assistant or API keys needed. Knowledge-base AI answers are limited per visit (see the counter under the chat); campus map shortcuts do not use that limit.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const [quotaLoaded, setQuotaLoaded] = useState(false)
  const [ragLimit, setRagLimit] = useState(5)
  const [ragUsed, setRagUsed] = useState(0)
  const [ragRemaining, setRagRemaining] = useState(null)
  const [supportWhatsappDisplay, setSupportWhatsappDisplay] = useState('')
  const [supportWhatsappUrl, setSupportWhatsappUrl] = useState(null)

  const resolvedWhatsappDisplay = useMemo(() => {
    const fromApi = supportWhatsappDisplay?.trim()
    if (fromApi) return fromApi
    return getSupportWhatsappDisplay()
  }, [supportWhatsappDisplay])

  const resolvedWhatsappUrl = useMemo(
    () => supportWhatsappUrl || getSupportWhatsappUrl(),
    [supportWhatsappUrl],
  )

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const d = await fetchRagSession()
        if (cancelled) return
        setRagLimit(typeof d.limit === 'number' ? d.limit : 5)
        setRagUsed(typeof d.used === 'number' ? d.used : 0)
        setRagRemaining(typeof d.remaining === 'number' ? d.remaining : null)
        if (d.supportWhatsappDisplay != null) setSupportWhatsappDisplay(d.supportWhatsappDisplay)
        if (d.supportWhatsappUrl != null) setSupportWhatsappUrl(d.supportWhatsappUrl)
      } catch {
        if (!cancelled) setError('Could not verify usage limits. Try refreshing the page.')
      } finally {
        if (!cancelled) setQuotaLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const ragBlocked = quotaLoaded && ragRemaining === 0

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading || !quotaLoaded) return
    setInput('')
    setError(null)
    const userMsg = { role: 'user', content: text, id: uid() }
    setMessages((m) => [...m, userMsg])

    const nav = matchCampusNavigationQuery(text)
    if (nav) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: nav.reply,
          navigation: { label: nav.label, url: nav.mapsUrl },
          sources: [],
          id: uid(),
        },
      ])
      inputRef.current?.focus({ preventScroll: true })
      return
    }

    if (ragBlocked) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Your knowledge-base question limit for this visit is used up. Please reach out to our team on WhatsApp for detailed admissions and program support.',
          id: uid(),
        },
      ])
      inputRef.current?.focus({ preventScroll: true })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [RAG_SESSION_HEADER]: getChatSessionId(),
        },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.status === 429) {
        if (data.supportWhatsappDisplay != null) setSupportWhatsappDisplay(data.supportWhatsappDisplay)
        if (data.supportWhatsappUrl != null) setSupportWhatsappUrl(data.supportWhatsappUrl)
        setRagRemaining(0)
        if (typeof data.used === 'number') setRagUsed(data.used)
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              data.message ||
              'You have reached the knowledge-base limit for this visit. Please contact our team on WhatsApp for more help.',
            id: uid(),
          },
        ])
        return
      }

      if (!res.ok) throw new Error(data.message || 'Request failed')

      if (data.rag) {
        setRagLimit(typeof data.rag.limit === 'number' ? data.rag.limit : 5)
        setRagUsed(typeof data.rag.used === 'number' ? data.rag.used : 0)
        setRagRemaining(typeof data.rag.remaining === 'number' ? data.rag.remaining : 0)
      }

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.reply,
          sources: Array.isArray(data.sources) ? data.sources : [],
          id: uid(),
        },
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [input, loading, quotaLoaded, ragBlocked])

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Chat cleared. Ask about programs from the knowledge base, or use campus shortcuts for Google Maps pins (gate, mosque, cafe, and more). Your per-visit AI question allowance is unchanged.',
      },
    ])
    setError(null)
  }, [])

  const onQuickCampusPick = useCallback(
    (pick) => {
      if (loading) return
      const userMsg = { role: 'user', content: `Open map: ${pick.chipLabel}`, id: uid() }
      setMessages((m) => [...m, userMsg, buildCampusAssistantMessage(pick)])
      setError(null)
      inputRef.current?.focus({ preventScroll: true })
    },
    [loading],
  )

  const onSubmit = (e) => {
    e.preventDefault()
    void send()
  }

  const quotaLabel =
    quotaLoaded && ragRemaining !== null
      ? `${ragRemaining} / ${ragLimit} knowledge-base turns left this visit`
      : 'Loading usage…'

  return (
    <main className="chatbot-page">
      <div className="chatbot-page__ambient" aria-hidden="true" />
      <div className="container chatbot-page__inner">
        <header className="chatbot-page__header">
          <div className="chatbot-page__head-text">
            <h1 className="chatbot-page__title">LGU Assistant</h1>
            <p className="chatbot-page__subtitle">
              Program answers use your uploaded PDFs only. Campus pins open in Google Maps (no Maps API on this site).
              Nothing is saved after you leave this page.
            </p>
          </div>
          <button type="button" className="chatbot-page__clear" onClick={clearChat}>
            Clear chat
          </button>
        </header>

        <div className="chatbot-page__panel" role="log" aria-live="polite" aria-relevant="additions">
          <div className="chatbot-page__messages">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className={`chatbot-page__bubble chatbot-page__bubble--${msg.role}`}
              >
                <div className="chatbot-page__bubble-label">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="chatbot-page__bubble-text">{msg.content}</div>
                {msg.role === 'assistant' && msg.navigation?.url && (
                  <div className="chatbot-page__nav-card">
                    <div className="chatbot-page__nav-card-body">
                      <p className="chatbot-page__nav-card-title">{msg.navigation.label}</p>
                      <div className="chatbot-page__nav-card-actions">
                        <a
                          className="chatbot-page__nav-card-cta"
                          href={msg.navigation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapsPinIcon />
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {msg.role === 'assistant' && msg.sources?.length > 0 && (
                  <div className="chatbot-page__sources">
                    Sources:{' '}
                    {[...new Set(msg.sources)].map((s) => (
                      <span key={s} className="chatbot-page__source-pill">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {loading && (
              <div className="chatbot-page__bubble chatbot-page__bubble--assistant chatbot-page__typing">
                <span className="chatbot-page__dot" />
                <span className="chatbot-page__dot" />
                <span className="chatbot-page__dot" />
              </div>
            )}
          </div>

          {error && (
            <div className="chatbot-page__error" role="alert">
              {error}
            </div>
          )}

          {ragBlocked && (
            <div className="chatbot-page__limit-banner" role="status">
              <p className="chatbot-page__limit-banner-title">Knowledge-base limit reached</p>
              <p className="chatbot-page__limit-banner-lead chatbot-page__limit-banner-lead--desktop">
                For admissions and program questions, use this WhatsApp number on your phone:
              </p>
              <p className="chatbot-page__limit-banner-lead chatbot-page__limit-banner-lead--mobile">
                Tap below to open WhatsApp:
              </p>
              <div className="chatbot-page__limit-banner-desktop">
                <p className="chatbot-page__limit-banner-num-large" translate="no">
                  {resolvedWhatsappDisplay}
                </p>
              </div>
              <a
                className="chatbot-page__wa-btn chatbot-page__wa-btn--mobile-only"
                href={resolvedWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppGlyph />
                Open WhatsApp chat
              </a>
            </div>
          )}

          <div className="chatbot-page__quick-campus" aria-label="Campus map shortcuts">
            <span className="chatbot-page__quick-campus-label">Campus maps</span>
            <div className="chatbot-page__quick-campus-chips">
              {CAMPUS_QUICK_PICKS.map((pick) => (
                <button
                  key={pick.id}
                  type="button"
                  className="chatbot-page__chip"
                  disabled={loading}
                  onClick={() => onQuickCampusPick(pick)}
                >
                  {pick.chipLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="chatbot-page__quota-row" aria-live="polite">
            <span className="chatbot-page__quota-pill">{quotaLabel}</span>
            {quotaLoaded && !ragBlocked && ragRemaining !== null && ragRemaining <= 2 && (
              <span className="chatbot-page__quota-hint">Campus shortcuts do not use a turn.</span>
            )}
          </div>

          <form className="chatbot-page__form" onSubmit={onSubmit}>
            <label className="chatbot-page__sr-only" htmlFor="chat-input">
              Message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              className="chatbot-page__input"
              rows={2}
              placeholder='e.g. BSCS semester fee — or "Where is LGU Mosque?"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              disabled={loading || !quotaLoaded || ragBlocked}
              maxLength={4000}
            />
            <button
              type="submit"
              className="chatbot-page__send"
              disabled={loading || !quotaLoaded || ragBlocked || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
