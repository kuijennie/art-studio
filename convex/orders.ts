import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const listByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) =>
    ctx.db.query('orders').withIndex('by_email', q => q.eq('email', email)).collect(),
})

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, { orderNumber }) =>
    ctx.db.query('orders').withIndex('by_orderNumber', q => q.eq('orderNumber', orderNumber)).first(),
})

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => ctx.db.insert('orders', args),
})
