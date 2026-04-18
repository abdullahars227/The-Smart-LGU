/**
 * Public WhatsApp contact — keep in sync with Backend/.env SUPPORT_WHATSAPP for RAG limit messages.
 * VITE_* is baked at build time; set in Front_End/.env for local dev.
 */

const FALLBACK_DIGITS = '923170840207'

export function getSupportWhatsAppDigits() {
  const raw = String(import.meta.env?.VITE_SUPPORT_WHATSAPP ?? '').replace(/\D/g, '')
  return raw.length >= 8 ? raw : FALLBACK_DIGITS
}

export function getSupportWhatsappDisplay() {
  const custom = String(import.meta.env?.VITE_SUPPORT_WHATSAPP_DISPLAY ?? '').trim()
  if (custom) return custom
  const d = getSupportWhatsAppDigits()
  return d.startsWith('92') ? `+92 ${d.slice(2)}` : `+${d}`
}

export function getSupportWhatsappUrl() {
  return `https://wa.me/${getSupportWhatsAppDigits()}`
}
