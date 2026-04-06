import 'dotenv/config'
import { createApp } from './app.js'
import { connectDb } from './config/db.js'

const port = Number(process.env.PORT) || 5000

async function main() {
  await connectDb()
  const app = createApp()
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
