import { action } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'

function makeOrderNumber(): string {
  return (
    'LPJ-' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 5).toUpperCase()
  )
}

export const createOrder = action({
  args: {
    paymentMethodId: v.string(),
    amount: v.number(),
    currency: v.optional(v.string()),
    items: v.array(
      v.object({
        product: v.object({
          slug: v.string(),
          name: v.string(),
          price: v.number(),
          image: v.string(),
        }),
        quantity: v.number(),
      })
    ),
    shipping: v.object({
      email: v.string(),
      name: v.string(),
      phone: v.optional(v.string()),
      address: v.string(),
      city: v.string(),
      postal: v.optional(v.string()),
      country: v.string(),
    }),
  },
  handler: async (ctx, { paymentMethodId, amount, currency = 'kes', items, shipping }) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) throw new Error('Stripe key not configured')

    const shippingCost = amount >= 100 ? 0 : 500
    const total = amount + shippingCost

    const piRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(Math.round(total * 100)),
        currency,
        payment_method: paymentMethodId,
        confirm: 'true',
        'automatic_payment_methods[enabled]': 'true',
        'automatic_payment_methods[allow_redirects]': 'never',
      }),
    })

    const pi = await piRes.json() as { status: string; id: string; error?: { message: string } }

    if (pi.error) throw new Error(pi.error.message)
    if (pi.status !== 'succeeded') {
      throw new Error(`Payment ${pi.status}. Please try a different card.`)
    }

    const orderNumber = makeOrderNumber()

    await ctx.runMutation(api.orders.create, {
      orderNumber,
      email: shipping.email,
      name: shipping.name,
      phone: shipping.phone,
      address: shipping.address,
      city: shipping.city,
      postal: shipping.postal,
      country: shipping.country,
      items: items.map(i => ({
        slug: i.product.slug,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      subtotal: amount,
      shippingCost,
      total,
      currency,
      status: 'paid',
      stripePaymentMethodId: paymentMethodId,
      stripePaymentIntentId: pi.id,
    })

    return { orderNumber }
  },
})
