/** First URL at bundle load + unique id per full page load (welcome TTS / session key). */
export const INITIAL_DOCUMENT_PATH = window.location.pathname
export const PAGE_LOAD_ID =
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
