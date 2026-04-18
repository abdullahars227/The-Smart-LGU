/**
 * In-memory RAG turn counts per client session id.
 * Resets on server restart; for multi-instance production use Redis or similar.
 */

const counts = new Map()

export function isValidSessionId(s) {
  if (typeof s !== 'string') return false
  const t = s.trim()
  return t.length >= 20 && t.length <= 80 && /^[0-9a-f-]+$/i.test(t)
}

export function getRagCount(sessionId) {
  return counts.get(sessionId) ?? 0
}

export function incrementRagCount(sessionId) {
  const n = (counts.get(sessionId) ?? 0) + 1
  counts.set(sessionId, n)
  return n
}

export function decrementRagCount(sessionId) {
  const n = counts.get(sessionId)
  if (n == null || n <= 0) return 0
  const next = n - 1
  if (next <= 0) counts.delete(sessionId)
  else counts.set(sessionId, next)
  return next
}
