import { answerWithRag } from '../services/ragService.js'
import { buildSupportPayload, getRagTurnLimit } from '../config/ragLimitConfig.js'
import {
  decrementRagCount,
  getRagCount,
  incrementRagCount,
  isValidSessionId,
} from '../services/ragSessionLimit.js'

function sessionIdFrom(req) {
  return String(req.get('x-lgu-chat-session') ?? '').trim()
}

export async function getRagSessionStatus(req, res) {
  const sessionId = sessionIdFrom(req)
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({ message: 'Send a valid X-LGU-Chat-Session header (refresh the page).' })
  }
  const limit = getRagTurnLimit()
  const used = getRagCount(sessionId)
  return res.json({
    limit,
    used,
    remaining: Math.max(0, limit - used),
    exhausted: used >= limit,
    ...buildSupportPayload(),
  })
}

export async function postRagChat(req, res) {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    return res.status(400).json({ message: 'Message is required' })
  }
  if (message.length > 4000) {
    return res.status(400).json({ message: 'Message is too long' })
  }

  const sessionId = sessionIdFrom(req)
  if (!isValidSessionId(sessionId)) {
    return res.status(400).json({
      message: 'Missing or invalid X-LGU-Chat-Session. Reload the assistant page.',
    })
  }

  const limit = getRagTurnLimit()
  const usedBefore = getRagCount(sessionId)
  if (usedBefore >= limit) {
    return res.status(429).json({
      code: 'RAG_LIMIT',
      message: `You have used all ${limit} knowledge-base questions for this visit. For detailed help, contact our team on WhatsApp.`,
      limit,
      used: usedBefore,
      remaining: 0,
      ...buildSupportPayload(),
    })
  }

  incrementRagCount(sessionId)

  try {
    const { reply, sources } = await answerWithRag(message)
    const used = getRagCount(sessionId)
    return res.json({
      reply,
      sources,
      rag: {
        limit,
        used,
        remaining: Math.max(0, limit - used),
      },
    })
  } catch (err) {
    decrementRagCount(sessionId)
    console.error('[rag]', err)
    const msg =
      err?.message?.includes('$vectorSearch') ||
      err?.message?.includes('vector') ||
      err?.message?.includes('embedding must be indexed')
        ? 'Atlas index is not a Vector Search index on field `embedding`. In Atlas: delete the wrong Search index on knowledge_chunks.chunks, then create Vector Search (not Atlas Search) with index name matching VECTOR_INDEX_NAME (default: default). Paste JSON from Backend/atlas-vector-index-definition.json (1536 dims, cosine). Wait until status is Ready.'
        : err?.message || 'Unable to answer right now.'
    return res.status(500).json({ message: msg })
  }
}
