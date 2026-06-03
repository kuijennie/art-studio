import { Router, type Request, type Response } from 'express'
import { Webhook } from 'svix'
import { User } from '../models/User'

const router = Router()

// Raw body is required for svix signature verification.
// This route must be registered BEFORE express.json() in index.ts.
router.post('/webhooks/clerk', async (req: Request, res: Response) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook] CLERK_WEBHOOK_SECRET is not set')
    return res.status(500).json({ error: 'Webhook secret not configured' })
  }

  const svix_id        = req.headers['svix-id'] as string
  const svix_timestamp = req.headers['svix-timestamp'] as string
  const svix_signature = req.headers['svix-signature'] as string

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing svix headers' })
  }

  let payload: any
  try {
    const wh = new Webhook(secret)
    payload = wh.verify(req.body, {
      'svix-id':        svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch {
    return res.status(400).json({ error: 'Invalid webhook signature' })
  }

  const { type, data } = payload as { type: string; data: any }

  if (type === 'user.created') {
    const email    = data.email_addresses?.[0]?.email_address ?? ''
    const username = data.username ?? email.split('@')[0] ?? data.id

    try {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        { $setOnInsert: { clerkId: data.id, email, username } },
        { upsert: true, new: true }
      )
      console.log(`[webhook] user.created → saved ${username}`)
    } catch (err: any) {
      console.error('[webhook] user.created error:', err.message)
    }
  }

  if (type === 'session.created') {
    try {
      await User.findOneAndUpdate(
        { clerkId: data.user_id },
        { $set: { lastLogin: new Date() } }
      )
      console.log(`[webhook] session.created → updated lastLogin for ${data.user_id}`)
    } catch (err: any) {
      console.error('[webhook] session.created error:', err.message)
    }
  }

  res.json({ received: true })
})

export default router
