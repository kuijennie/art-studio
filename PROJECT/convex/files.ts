import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
})

export const getUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await ctx.storage.getUrl(storageId as any)
  },
})
