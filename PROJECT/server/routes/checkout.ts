import { Router, type Request, type Response } from 'express'
import Stripe from 'stripe'
import { Order } from '../models/Order'

const router = Router()

const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2025-04-30.basil' as any })
  : null

function makeOrderNumber(): string {
  return (
    'LPJ-' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 5).toUpperCase()
  )
}

router.post('/checkout', async (req: Request, res: Response) => {
  const { paymentMethodId, amount, currency = 'kes', items, shipping } = req.body

  if (!paymentMethodId || !amount || !items?.length || !shipping) {
    res.status(400).json({ error: 'Missing required fields.' })
    return
  }

  if (!stripe) {
    res.status(503).json({ error: 'Payments not configured on this server.' })
    return
  }

  try {
    const shippingCost = amount >= 100 ? 0 : 500
    const total = amount + shippingCost

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // KES → smallest unit
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    })

    if (paymentIntent.status !== 'succeeded') {
      res.status(402).json({
        error: `Payment ${paymentIntent.status}. Please try a different card.`,
      })
      return
    }

    const order = await Order.create({
      orderNumber:           makeOrderNumber(),
      email:                 shipping.email,
      name:                  shipping.name,
      phone:                 shipping.phone || undefined,
      address:               shipping.address,
      city:                  shipping.city,
      postal:                shipping.postal || undefined,
      country:               shipping.country,
      items: items.map((i: { product: { slug: string; name: string; price: number; image: string }; quantity: number }) => ({
        slug:     i.product.slug,
        name:     i.product.name,
        price:    i.product.price,
        quantity: i.quantity,
        image:    i.product.image,
      })),
      subtotal:              amount,
      shippingCost,
      total,
      currency,
      status:                'paid',
      stripePaymentMethodId: paymentMethodId,
      stripePaymentIntentId: paymentIntent.id,
    })

    res.status(201).json({ orderNumber: order.orderNumber })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    // Surface Stripe errors directly (they're user-friendly)
    const isStripe = err instanceof Stripe.errors.StripeError
    res.status(isStripe ? 402 : 500).json({ error: msg })
  }
})

export default router
