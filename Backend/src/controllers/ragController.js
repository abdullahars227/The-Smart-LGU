import { answerWithRag } from '../services/ragService.js'

export async function postRagChat(req, res) {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (!message) {
    return res.status(400).json({ message: 'Message is required' })
  }
  if (message.length > 4000) {
    return res.status(400).json({ message: 'Message is too long' })
  }

  try {
    const { reply, sources } = await answerWithRag(message)
    return res.json({ reply, sources })
  } catch (err) {
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
