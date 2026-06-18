import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db'
import checkoutRouter from './routes/checkout'
import ordersRouter from './routes/orders'
import productsRouter from './routes/products'
import usersRouter from './routes/users'
import webhookRouter from './routes/webhook'

const app = express()
const PORT = Number(process.env.PORT ?? 3001)
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173'

const allowedOrigins = [CLIENT_URL, 'https://art-studio-pearl.vercel.app']
app.use(cors({ origin: allowedOrigins, credentials: true }))

// Webhook needs raw body for svix signature verification — scope it to that path only
app.use('/api/webhooks/clerk', express.raw({ type: 'application/json' }))

app.use(express.json())

app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date() }))
app.use('/api', productsRouter)
app.use('/api', checkoutRouter)
app.use('/api', ordersRouter)
app.use('/api', usersRouter)
app.use('/api', webhookRouter)

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
