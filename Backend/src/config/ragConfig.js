import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Strip wrapping quotes from .env values */
export function envStr(key) {
  const v = process.env[key]
  if (v == null || v === '') return ''
  return String(v).replace(/^["']|["']$/g, '').trim()
}

export const RAG_DB_NAME = process.env.RAG_DB_NAME || 'knowledge_chunks'
export const RAG_COLLECTION = process.env.RAG_COLLECTION || 'chunks'
export const VECTOR_INDEX_NAME = process.env.VECTOR_INDEX_NAME || 'default'

export const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'
export const CHAT_MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini'

export const KNOWLEDGE_DIR = path.resolve(
  path.join(__dirname, '../../knowledge'),
)

/** Smaller chunks + higher overlap keep program headings with their bullet lines after splitting */
export const CHUNK_SIZE = Number(process.env.RAG_CHUNK_SIZE) || 900
export const CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP) || 280
export const RETRIEVAL_K = Number(process.env.RAG_RETRIEVAL_K) || 8
