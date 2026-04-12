import { useCallback, useEffect, useRef, useState } from 'react'
import './ChatbotPage.css'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome. Ask about BSCS, BSSE, or BSAI — fees, eligibility, labs — based on the PDFs in our knowledge base.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, error])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError(null)
    const userMsg = { role: 'user', content: text, id: uid() }
    setMessages((m) => [...m, userMsg])
    setLoading(true)
    try {
      const res = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Request failed')
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
      inputRef.current?.focus()
    }
  }, [input, loading])

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Chat cleared. Ask a new question about the programs.',
      },
    ])
    setError(null)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    void send()
  }

  return (
    <main className="chatbot-page container">
      <header className="chatbot-page__header">
        <div>
          <h1 className="chatbot-page__title">LGU Assistant</h1>
          <p className="chatbot-page__subtitle">
            Answers use your uploaded PDFs only. Nothing is saved after you leave this page.
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
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="chatbot-page__error" role="alert">
            {error}
          </div>
        )}

        <form className="chatbot-page__form" onSubmit={onSubmit}>
          <label className="chatbot-page__sr-only" htmlFor="chat-input">
            Message
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            className="chatbot-page__input"
            rows={2}
            placeholder="e.g. What is the semester fee for BSCS?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            disabled={loading}
            maxLength={4000}
          />
          <button type="submit" className="chatbot-page__send" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </main>
  )
}
