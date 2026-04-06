import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'

export function createApp() {
  const app = express()

  const origin = process.env.CORS_ORIGIN || 'http://localhost:5173'
  app.use(cors({ origin, credentials: true }))
  app.use(express.json({ limit: '1mb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'smart-lgu-backend' })
  })

  app.use('/api/auth', authRoutes)

  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })

  return app
}
