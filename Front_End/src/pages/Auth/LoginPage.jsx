import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import './LoginPage.css'

/** Matches backend `User` name rule — letters, spaces, apostrophes, hyphens; no digits. */
const NAME_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateName(name) {
  const t = name.trim()
  if (t.length < 2) return 'Name must be at least 2 characters.'
  if (t.length > 120) return 'Name must be at most 120 characters.'
  if (/\d/.test(t)) return 'Name cannot contain numbers—use letters only.'
  if (!NAME_REGEX.test(t)) {
    return 'Use letters only, with optional spaces, apostrophes, or hyphens (e.g. Mary-Jane O\'Neil).'
  }
  return ''
}

function validateEmail(email) {
  const t = email.trim()
  if (!t) return 'Email is required.'
  if (!EMAIL_REGEX.test(t)) return 'Enter a valid email address (e.g. you@university.edu.pk).'
  return ''
}

function validatePhone(phone) {
  const t = phone.trim()
  if (!t) return 'Phone is required.'
  if (t.length < 10 || t.length > 20) return 'Phone must be 10–20 characters.'
  if (/[a-zA-Z]/.test(t)) return 'Phone cannot contain letters—only digits and + ( ) - . spaces.'
  if (!/^[\d+()\s.-]+$/.test(t)) return 'Use digits and common phone symbols only (+, spaces, parentheses, dashes, dots).'
  if (!/\d/.test(t)) return 'Phone must include at least one digit.'
  return ''
}

function validatePassword(password, isRegister) {
  if (!password) return isRegister ? 'Password must be at least 8 characters.' : 'Password is required.'
  if (isRegister && password.length < 8) return 'Password must be at least 8 characters.'
  if (isRegister && password.length > 128) return 'Password is too long (max 128 characters).'
  return ''
}

function mapServerErrors(errorsArray) {
  const out = {}
  if (!Array.isArray(errorsArray)) return out
  for (const err of errorsArray) {
    const path = err.path
    if (path && typeof err.msg === 'string') {
      out[path] = err.msg
    }
  }
  return out
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const clearField = (key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const runRegisterValidation = () => {
    const next = {}
    const n = validateName(name)
    const e = validateEmail(email)
    const p = validatePhone(phone)
    const pw = validatePassword(password, true)
    if (n) next.name = n
    if (e) next.email = e
    if (p) next.phone = p
    if (pw) next.password = pw
    return next
  }

  const runSignInValidation = () => {
    const next = {}
    const e = validateEmail(email)
    const pw = validatePassword(password, false)
    if (e) next.email = e
    if (pw) next.password = pw
    return next
  }

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
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const mapped = mapServerErrors(data.errors)
        const err = new Error(data.message || 'Validation failed')
        err.fieldMap = mapped
        throw err
      }
      const msg = data.message || 'Something went wrong'
      throw new Error(msg)
    }
    return data
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFieldErrors({})

    if (mode === 'register') {
      const local = runRegisterValidation()
      if (Object.keys(local).length > 0) {
        setFieldErrors(local)
        setFormError('Fix the highlighted fields below.')
        return
      }
    } else {
      const local = runSignInValidation()
      if (Object.keys(local).length > 0) {
        setFieldErrors(local)
        setFormError('Fix the highlighted fields below.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        const data = await api('/register', { name: name.trim(), email: email.trim(), phone: phone.trim(), password })
        login(data.user)
      } else {
        const data = await api('/login', { email: email.trim(), password })
        login(data.user)
      }
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } catch (err) {
      const map = err?.fieldMap
      if (map && typeof map === 'object' && Object.keys(map).length > 0) {
        setFieldErrors(map)
        setFormError(err.message || 'Check the fields below.')
      } else {
        setFormError(err?.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const onNameChange = (v) => {
    const noDigits = v.replace(/\d/g, '')
    setName(noDigits)
    clearField('name')
  }

  const onPhoneChange = (v) => {
    const noLetters = v.replace(/[a-zA-Z]/g, '')
    setPhone(noLetters)
    clearField('phone')
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
                setFormError('')
                setFieldErrors({})
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
                setFormError('')
                setFieldErrors({})
              }}
            >
              Register
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <div className={`login-form__field${fieldErrors.name ? ' login-form__field--invalid' : ''}`}>
                <span>Full name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  onBlur={() => {
                    const msg = validateName(name)
                    if (msg) setFieldErrors((p) => ({ ...p, name: msg }))
                  }}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'err-name' : undefined}
                  placeholder="Letters only — e.g. Ali Hassan"
                />
                {fieldErrors.name ? (
                  <span id="err-name" className="login-form__field-msg" role="alert">
                    {fieldErrors.name}
                  </span>
                ) : null}
              </div>
            )}

            <div className={`login-form__field${fieldErrors.email ? ' login-form__field--invalid' : ''}`}>
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearField('email')
                }}
                onBlur={() => {
                  const msg = validateEmail(email)
                  if (msg) setFieldErrors((p) => ({ ...p, email: msg }))
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                placeholder="you@example.com"
              />
              {fieldErrors.email ? (
                <span id="err-email" className="login-form__field-msg" role="alert">
                  {fieldErrors.email}
                </span>
              ) : null}
            </div>

            {mode === 'register' && (
              <div className={`login-form__field${fieldErrors.phone ? ' login-form__field--invalid' : ''}`}>
                <span>Phone</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  onBlur={() => {
                    const msg = validatePhone(phone)
                    if (msg) setFieldErrors((p) => ({ ...p, phone: msg }))
                  }}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
                  placeholder="+92 3xx xxxxxxx"
                />
                {fieldErrors.phone ? (
                  <span id="err-phone" className="login-form__field-msg" role="alert">
                    {fieldErrors.phone}
                  </span>
                ) : null}
              </div>
            )}

            <div className={`login-form__field${fieldErrors.password ? ' login-form__field--invalid' : ''}`}>
              <span>Password</span>
              <input
                name="password"
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  clearField('password')
                }}
                onBlur={() => {
                  const msg = validatePassword(password, mode === 'register')
                  if (msg) setFieldErrors((p) => ({ ...p, password: msg }))
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'err-password' : undefined}
                placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'}
              />
              {fieldErrors.password ? (
                <span id="err-password" className="login-form__field-msg" role="alert">
                  {fieldErrors.password}
                </span>
              ) : null}
            </div>

            {formError ? (
              <p className="login-form__error" role="alert">
                {formError}
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
