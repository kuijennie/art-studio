import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    slug: v.string(),
    name: v.string(),
    price: v.number(),
    description: v.string(),
    image: v.string(),
    tint: v.string(),
    category: v.string(),
  }).index('by_slug', ['slug']),

  orders: defineTable({
    orderNumber: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    postal: v.optional(v.string()),
    country: v.string(),
    items: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })
    ),
    subtotal: v.number(),
    shippingCost: v.number(),
    total: v.number(),
    currency: v.string(),
    status: v.string(),
    stripePaymentMethodId: v.string(),
    stripePaymentIntentId: v.string(),
  })
    .index('by_email', ['email'])
    .index('by_orderNumber', ['orderNumber']),
})
