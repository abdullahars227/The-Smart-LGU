import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Backend/.env from this file (`src/config/loadEnv.js`) */
const envFromPackageRoot = path.resolve(__dirname, '../../.env')
/** When `npm run dev` is run from `Backend/`, cwd matches */
const envFromCwd = path.resolve(process.cwd(), '.env')

const candidates = [...new Set([envFromPackageRoot, envFromCwd])]

function stripBom(s) {
  return s.length > 0 && s.charCodeAt(0) === 0xfeff ? s.slice(1) : s
}

/** Notepad “Unicode” = UTF-16 LE; dotenv.parse needs a UTF-8 string */
function readEnvText(envPath) {
  const buf = fs.readFileSync(envPath)
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return stripBom(buf.slice(2).toString('utf16le'))
  }
  return stripBom(buf.toString('utf8'))
}

const loadedFrom = []

for (const envPath of candidates) {
  try {
    if (!fs.existsSync(envPath)) continue
    const raw = readEnvText(envPath)
    const parsed = dotenv.parse(raw)
    for (const [key, value] of Object.entries(parsed)) {
      process.env[key] = value
    }
    loadedFrom.push(envPath)
  } catch (err) {
    console.error('[env] Failed to read', envPath, err.message)
  }
}

if (loadedFrom.length === 0) {
  console.error('[env] No .env file found. Tried:\n  -', envFromPackageRoot, '\n  -', envFromCwd)
} else if (process.env.NODE_ENV !== 'production') {
  const ok = Boolean(process.env.OPENAI_API_KEY && String(process.env.OPENAI_API_KEY).trim())
  console.log('[env] Loaded from', loadedFrom.join(' + '), '| OPENAI_API_KEY:', ok ? 'set' : 'MISSING')
  if (!ok) {
    console.warn(
      '[env] If OPENAI_API_KEY is visible in the editor but still MISSING, the file was not saved — press Ctrl+S on Backend/.env and restart the server.',
    )
  }
}
