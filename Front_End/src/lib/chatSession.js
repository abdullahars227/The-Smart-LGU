/** Session id for RAG rate limits — one per browser tab session (sessionStorage). */

const STORAGE_KEY = 'lgu_rag_client_session_id'

export const RAG_SESSION_HEADER = 'X-LGU-Chat-Session'

export function getChatSessionId() {
  if (typeof sessionStorage === 'undefined') {
    return '00000000-0000-4000-8000-000000000000'
  }
  try {
    let id = sessionStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    return '00000000-0000-4000-8000-000000000000'
  }
}
