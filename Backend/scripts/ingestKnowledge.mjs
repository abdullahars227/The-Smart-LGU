import '../src/config/loadEnv.js'
import mongoose from 'mongoose'
import { connectDb } from '../src/config/db.js'
import { ingestKnowledgeDir } from '../src/services/ragService.js'

async function main() {
  await connectDb()
  const result = await ingestKnowledgeDir()
  console.log('[ingest] Done:', result)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error('[ingest] Failed:', err.message || err)
  process.exit(1)
})
