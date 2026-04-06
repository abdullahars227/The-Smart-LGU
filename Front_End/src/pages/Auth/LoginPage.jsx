import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const api = async (path, body) => {
    let res
    try {
      res = await fetch(`/api/auth${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      throw new Error('Cannot reach backend API. Start Backend server first.')
    }
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = data.message || 'Something went wrong'
      throw new Error(msg)
    }
    return data
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const data = await api('/register', { name, email, phone, password })
        login(data.user)
      } else {
        const data = await api('/login', { email, password })
        login(data.user)
      }
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true" />
      <div className="login-page__scrim" aria-hidden="true" />

      <div className="login-page__shell">
        <div className="login-page__brand">
          <img src="/images/lgu-logo.jpg" width={56} height={56} alt="" />
          <div>
            <p className="login-page__brand-title">Lahore Garrison University</p>
            <p className="login-page__brand-sub">Faculty of Computer Sciences</p>
          </div>
        </div>

        <div className="login-card">
          <p className="login-card__eyebrow">{mode === 'register' ? 'Create account' : 'Welcome back'}</p>
          <h1 className="login-card__title">{mode === 'register' ? 'Register' : 'Sign in'}</h1>
          <p className="login-card__hint">
            {mode === 'register'
              ? 'Use your university email. If you already have an account, switch to Sign in.'
              : 'Enter your email and password to continue.'}
          </p>

          <div className="login-card__tabs" role="tablist" aria-label="Auth mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={`login-card__tab${mode === 'signin' ? ' login-card__tab--active' : ''}`}
              onClick={() => {
                setMode('signin')
                setError('')
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={`login-card__tab${mode === 'register' ? ' login-card__tab--active' : ''}`}
              onClick={() => {
                setMode('register')
                setError('')
              }}
            >
              Register
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <label className="login-form__field">
                <span>Full name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="login-form__field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>

            {mode === 'register' && (
              <label className="login-form__field">
                <span>Phone</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  minLength={10}
                  placeholder="+92 3xx xxxxxxx"
                />
              </label>
            )}

            <label className="login-form__field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
              />
            </label>

            {error ? (
              <p className="login-form__error" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="login-form__submit" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="login-card__footer">
            <Link to="/" className="login-card__home-link">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
