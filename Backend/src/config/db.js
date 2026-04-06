import dns from 'node:dns'
import mongoose from 'mongoose'

// Windows / some networks: system DNS fails SRV for mongodb+srv while Compass still works.
// Public resolvers often fix querySrv ECONNREFUSED for Node only.
dns.setServers(['8.8.8.8', '1.1.1.1'])

const connectOpts = {
  serverSelectionTimeoutMS: 15_000,
  family: 4,
}

function isSrvDnsFailure(err) {
  const msg = err?.message || String(err)
  return msg.includes('querySrv') || msg.includes('_mongodb._tcp')
}

function printNetworkHelp(err) {
  const msg = err?.message || String(err)
  console.error(`
[db] MongoDB connection failed (DNS / network).

Try:
  1) Atlas: cluster RUNNING (not paused), Network Access allows your IP (or 0.0.0.0/0 for dev).
  2) Internet / VPN: turn VPN off or try another network (hotspot).
  3) Windows: run: ipconfig /flushdns
  4) Re-copy the URI from Atlas → Connect → Drivers (one line, no spaces).
  5) If SRV keeps failing: add MONGODB_URI_STANDARD to Backend/.env (see .env.example).
     That uses mongodb://…:27017 (no mongodb+srv), so Windows DNS does not need SRV lookup.

Original error: ${msg}
`)
}

export async function connectDb() {
  const raw = process.env.MONGODB_URI
  const rawStandard = process.env.MONGODB_URI_STANDARD
  const uri = raw ? String(raw).trim() : ''
  const uriStandard = rawStandard ? String(rawStandard).trim() : ''

  if (!uri && !uriStandard) {
    throw new Error('Set MONGODB_URI or MONGODB_URI_STANDARD in Backend/.env')
  }

  mongoose.set('strictQuery', true)

  try {
    if (uriStandard && !uri) {
      await mongoose.connect(uriStandard, connectOpts)
      console.log('[db] Connected (MONGODB_URI_STANDARD)')
      return
    }

    if (uri) {
      try {
        await mongoose.connect(uri, connectOpts)
        console.log('[db] Connected (MONGODB_URI)')
        return
      } catch (firstErr) {
        if (uriStandard && isSrvDnsFailure(firstErr)) {
          console.warn('[db] mongodb+srv DNS failed — trying MONGODB_URI_STANDARD…')
          await mongoose.connect(uriStandard, connectOpts)
          console.log('[db] Connected (MONGODB_URI_STANDARD)')
          return
        }
        throw firstErr
      }
    }

    await mongoose.connect(uriStandard, connectOpts)
    console.log('[db] Connected (MONGODB_URI_STANDARD)')
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.includes('querySrv') || msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND')) {
      printNetworkHelp(err)
    }
    throw err
  }
}
