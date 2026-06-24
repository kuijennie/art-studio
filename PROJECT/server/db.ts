import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in .env')

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  })

  // Strip any legacy MongoDB-level validators left over from old schema
  const db = mongoose.connection.db!
  await db.command({ collMod: 'users', validator: {}, validationLevel: 'off' })
    .catch(() => {}) // silently skip if collection doesn't exist yet

  console.log('[db] Connected to MongoDB')
}
