import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './SignOutConfirmModal.css'

export default function SignOutConfirmModal({ open, onCancel, onConfirm }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => confirmRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="signout-modal" role="presentation">
      <button type="button" className="signout-modal__backdrop" aria-label="Dismiss" onClick={onCancel} />
      <div
        className="signout-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signout-modal-title"
        aria-describedby="signout-modal-desc"
      >
        <h2 id="signout-modal-title" className="signout-modal__title">
          Sign out?
        </h2>
        <p id="signout-modal-desc" className="signout-modal__text">
          You will need to sign in again to use the AI Assistant and see your account name in the header.
        </p>
        <div className="signout-modal__actions">
          <button type="button" className="signout-modal__btn signout-modal__btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="signout-modal__btn signout-modal__btn--danger"
            onClick={onConfirm}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
