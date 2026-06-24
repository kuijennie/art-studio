import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db'

async function resetUsers() {
  await connectDB()
  try {
    await mongoose.connection.dropCollection('users')
    console.log('[reset] Users collection dropped — will be recreated with new schema on next register.')
  } catch {
    console.log('[reset] No users collection found — nothing to drop.')
  }
  process.exit(0)
}

resetUsers()
