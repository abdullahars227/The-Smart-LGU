import './config/loadEnv.js'
import { createApp } from './app.js'
import { connectDb } from './config/db.js'

const port = Number(process.env.PORT) || 3000

async function main() {
  await connectDb()

  const app = createApp()

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})