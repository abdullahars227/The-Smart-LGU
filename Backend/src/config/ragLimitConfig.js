/**
 * Per-session caps for RAG / OpenAI usage (abuse & cost control).
 * Session id is supplied by the client (X-LGU-Chat-Session); server stores counts in memory.
 */

export function getRagTurnLimit() {
  const n = parseInt(process.env.RAG_MAX_TURNS_PER_SESSION ?? '5', 10)
  if (!Number.isFinite(n) || n < 1) return 5
  return Math.min(Math.floor(n), 100)
}

/** Digits only, e.g. 923001234567 for https://wa.me/923001234567 */
export function getSupportWhatsAppDigits() {
  const raw = String(process.env.SUPPORT_WHATSAPP ?? '').replace(/\D/g, '')
  return raw.length >= 8 ? raw : null
}

export function getSupportWhatsappDisplay() {
  const custom = String(process.env.SUPPORT_WHATSAPP_DISPLAY ?? '').trim()
  if (custom) return custom
  const d = getSupportWhatsAppDigits()
  if (!d) return ''
  return d.startsWith('92') ? `+92 ${d.slice(2)}` : `+${d}`
}

export function buildSupportPayload() {
  const digits = getSupportWhatsAppDigits()
  const supportWhatsappDisplay = getSupportWhatsappDisplay() || null
  const supportWhatsappUrl = digits ? `https://wa.me/${digits}` : null
  return { supportWhatsappDisplay, supportWhatsappUrl }
}
