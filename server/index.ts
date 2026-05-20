import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db'
import checkoutRouter from './routes/checkout'
import ordersRouter from './routes/orders'

const app = express()
const PORT = Number(process.env.PORT ?? 3001)
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173'

app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())

app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date() }))
app.use('/api', checkoutRouter)
app.use('/api', ordersRouter)

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`[server] http://localhost:${PORT}`)
    )
  })
  .catch(err => {
    console.error('[server] Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
