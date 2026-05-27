import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query('products').collect(),
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) =>
    ctx.db.query('products').withIndex('by_slug', q => q.eq('slug', slug)).first(),
})

export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    price: v.number(),
    description: v.string(),
    image: v.string(),
    tint: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => ctx.db.insert('products', args),
})

export const update = mutation({
  args: {
    id: v.id('products'),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    tint: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})

export const remove = mutation({
  args: { id: v.id('products') },
  handler: async (ctx, { id }) => ctx.db.delete(id),
})
