import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import { Document } from '@langchain/core/documents'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { PDFParse } from 'pdf-parse'
import {
  CHAT_MODEL,
  CHUNK_OVERLAP,
  CHUNK_SIZE,
  EMBEDDING_MODEL,
  envStr,
  KNOWLEDGE_DIR,
  RAG_COLLECTION,
  RAG_DB_NAME,
  RETRIEVAL_K,
  VECTOR_INDEX_NAME,
} from '../config/ragConfig.js'

function requireOpenAiKey() {
  const key = envStr('OPENAI_API_KEY')
  if (!key) throw new Error('OPENAI_API_KEY is not set in Backend/.env')
  return key
}

function getEmbeddings() {
  return new OpenAIEmbeddings({
    apiKey: requireOpenAiKey(),
    model: EMBEDDING_MODEL,
  })
}

function getChatModel() {
  return new ChatOpenAI({
    apiKey: requireOpenAiKey(),
    model: CHAT_MODEL,
    temperature: 0.2,
    maxTokens: 700,
  })
}

export function getChunksCollection() {
  const client = mongoose.connection.getClient()
  return client.db(RAG_DB_NAME).collection(RAG_COLLECTION)
}

let vectorStorePromise = null

export async function getVectorStore() {
  if (!vectorStorePromise) {
    const embeddings = getEmbeddings()
    const collection = getChunksCollection()
    vectorStorePromise = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: VECTOR_INDEX_NAME,
      textKey: 'text',
      embeddingKey: 'embedding',
    })
  }
  return vectorStorePromise
}

const PROGRAM_CODE_RE = /\b(BSCS|BSSE|BSAI)\b/gi
const KEYWORD_EXTRA_LIMIT = 14
const MERGED_DOC_CAP = 16

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function programCodesInQuery(q) {
  const out = new Set()
  let m
  const re = new RegExp(PROGRAM_CODE_RE.source, 'gi')
  while ((m = re.exec(q)) !== null) out.add(m[1].toUpperCase())
  return [...out]
}

/**
 * Terms to match in chunk text. Acronyms alone miss questions that only say
 * "Software Engineering" / "Computer Science" without BSSE/BSCS.
 */
function retrievalKeywordsFromQuery(q) {
  const terms = new Set(programCodesInQuery(q))

  if (/\bsoftware\s+engineering\b/i.test(q)) {
    terms.add('BSSE')
    terms.add('Software Engineering')
  }
  if (/\bcomputer\s+science\b/i.test(q)) {
    terms.add('BSCS')
    terms.add('Computer Science')
  }
  if (/\bartificial\s+intelligence\b/i.test(q)) {
    terms.add('BSAI')
    terms.add('Artificial Intelligence')
  }

  if (/\bcampus\s+labs?\b/i.test(q)) {
    terms.add('Campus labs')
  }

  /** "General (all three programs)" block — vector alone often misses vs program-specific chunks */
  if (/\ball\s+three\s+programs?|\ball\s+programs\b|\beach\s+program\b|\bgeneral\b/i.test(q)) {
    terms.add('General')
    terms.add('all three programs')
  }

  if (/\b(attendance|attend)\b/i.test(q)) {
    terms.add('Attendance')
    terms.add('75%')
  }
  if (/\bterminal\s+exam|\bsit\s+in\s+terminal|\bexam\s+policy/i.test(q)) {
    terms.add('terminal')
    terms.add('Attendance')
  }
  if (/\bcredit\s+hours?\b/i.test(q)) {
    terms.add('Credit hours')
    terms.add('General')
  }
  if (/\bdemo\s+policy\b/i.test(q)) {
    terms.add('demo policy')
    terms.add('Attendance')
  }

  return [...terms]
}

function docDedupeKey(d) {
  const id = d.metadata?._id
  if (id != null) return `id:${String(id)}`
  return `txt:${d.pageContent.slice(0, 160)}`
}

/**
 * Vector search + Mongo keyword pass: fixes acronym vs full program name (e.g. "Software Engineering" without "BSSE").
 */
async function retrieveDocumentsForRag(userMessage) {
  const store = await getVectorStore()
  const vectorDocs = await store.similaritySearch(userMessage, RETRIEVAL_K)

  const keywords = retrievalKeywordsFromQuery(userMessage)
  if (keywords.length === 0) return vectorDocs

  const collection = getChunksCollection()
  const orConds = keywords.map((term) => ({
    text: { $regex: escapeRegex(term), $options: 'i' },
  }))
  const extraRows = await collection
    .find({ $or: orConds })
    .limit(KEYWORD_EXTRA_LIMIT)
    .toArray()

  const seen = new Set(vectorDocs.map(docDedupeKey))
  const merged = [...vectorDocs]

  for (const row of extraRows) {
    const text = row.text
    if (typeof text !== 'string' || !text.trim()) continue
    const d = new Document({
      pageContent: text,
      metadata: { source: row.source, _id: row._id },
    })
    const key = docDedupeKey(d)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(d)
    if (merged.length >= MERGED_DOC_CAP) break
  }

  return merged
}

export async function listKnowledgePdfPaths() {
  let entries
  try {
    entries = await fs.readdir(KNOWLEDGE_DIR, { withFileTypes: true })
  } catch {
    return []
  }
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.pdf'))
    .map((e) => path.join(KNOWLEDGE_DIR, e.name))
}

async function readPdfText(filePath) {
  const buf = await fs.readFile(filePath)
  const parser = new PDFParse({ data: new Uint8Array(buf) })
  const result = await parser.getText()
  const text = (result?.text || '').trim()
  if (!text) {
    throw new Error(`No extractable text from ${path.basename(filePath)} (scanned PDFs need OCR).`)
  }
  return text
}

/**
 * Clears existing vectors and re-ingests every .pdf in Backend/knowledge.
 */
export async function ingestKnowledgeDir() {
  requireOpenAiKey()

  const pdfPaths = await listKnowledgePdfPaths()
  if (pdfPaths.length === 0) {
    throw new Error(
      `No PDF files found in ${KNOWLEDGE_DIR}. Add one or more .pdf files, then run: npm run ingest`,
    )
  }

  const collection = getChunksCollection()
  await collection.deleteMany({})

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  })

  const embeddings = getEmbeddings()
  const allSplitDocs = []

  for (const pdfPath of pdfPaths) {
    const base = path.basename(pdfPath)
    const raw = await readPdfText(pdfPath)
    const parent = new Document({
      pageContent: raw,
      metadata: { source: base },
    })
    const split = await splitter.splitDocuments([parent])
    allSplitDocs.push(...split)
  }

  await MongoDBAtlasVectorSearch.fromDocuments(allSplitDocs, embeddings, {
    collection,
    indexName: VECTOR_INDEX_NAME,
    textKey: 'text',
    embeddingKey: 'embedding',
  })

  return {
    pdfCount: pdfPaths.length,
    chunkCount: allSplitDocs.length,
    files: pdfPaths.map((p) => path.basename(p)),
  }
}

const SYSTEM_PROMPT = `You are the Smart LGU assistant. Answer using ONLY the CONTEXT below. If the context mentions fees, duration, eligibility, or labs for the program the user asked about, state those facts clearly. Do not invent numbers that are not in the context. If the context truly has no relevant information for the question, say you do not have that information in the uploaded materials. Keep answers concise.`

function formatContext(docs) {
  if (!docs.length) return '(No matching passages were found in the knowledge base.)'
  return docs
    .map((d, i) => {
      const src = d.metadata?.source ? ` [source: ${d.metadata.source}]` : ''
      return `[${i + 1}]${src}\n${d.pageContent}`
    })
    .join('\n\n')
}

export async function answerWithRag(userMessage) {
  requireOpenAiKey()

  const docs = await retrieveDocumentsForRag(userMessage)
  const context = formatContext(docs)

  const chat = getChatModel()
  const res = await chat.invoke([
    new SystemMessage(`${SYSTEM_PROMPT}\n\n---\nCONTEXT:\n${context}\n---`),
    new HumanMessage(userMessage),
  ])

  const text =
    typeof res.content === 'string'
      ? res.content
      : Array.isArray(res.content)
        ? res.content.map((p) => (typeof p === 'string' ? p : p.text || '')).join('')
        : String(res.content ?? '')

  return { reply: text.trim(), sources: docs.map((d) => d.metadata?.source).filter(Boolean) }
}
