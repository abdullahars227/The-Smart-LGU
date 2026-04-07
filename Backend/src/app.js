import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '1mb' }))

  
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'smart-lgu-backend' })
  })

  app.use('/api/auth', authRoutes)

 
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  
  const distPath = path.join(__dirname, '../dist')

 
  app.use(express.static(distPath))


  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })

  
  app.use((err, _req, res, _next) => {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  })

  return app
}