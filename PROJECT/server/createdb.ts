/**
 * MongoDB equivalent of:
 *   CREATE DATABASE productdb;
 *
 * In MongoDB, a database is created automatically the first time a
 * collection (table) is written to it.  This script makes that explicit:
 * it connects, selects the database from your MONGODB_URI, creates the
 * "products" collection with JSON-Schema validation, and creates indexes.
 *
 * Run with:  npm run createdb
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

async function createProductDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in .env')

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000, family: 4 })

  const db = mongoose.connection.db!
  const dbName = db.databaseName

  console.log(`\n[createdb] Connected to MongoDB`)
  console.log(`[createdb] Database : ${dbName}`)
  console.log(`[createdb] (SQL equivalent: CREATE DATABASE ${dbName})\n`)

  // ── 1. Create products collection ───────────────────────────────────────
  const existing = (await db.listCollections({ name: 'products' }).toArray()).length > 0

  if (!existing) {
    await db.createCollection('products', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['slug', 'name', 'price', 'description', 'image', 'tint', 'category'],
          properties: {
            slug:        { bsonType: 'string',  description: 'URL-safe unique identifier' },
            name:        { bsonType: 'string',  description: 'Product display name' },
            price:       { bsonType: 'number',  description: 'Price in KES' },
            description: { bsonType: 'string',  description: 'Product description' },
            image:       { bsonType: 'string',  description: 'Image URL' },
            tint:        { bsonType: 'string',  description: 'Hex accent colour' },
            category:    { bsonType: 'string',  description: 'Product category' },
          },
        },
      },
    })
    console.log(`✓ Created collection: products`)
  } else {
    console.log(`• Collection already exists: products`)
  }

  // ── 2. Create indexes ────────────────────────────────────────────────────
  const products = db.collection('products')

  await products.createIndex({ slug: 1 }, { unique: true })
  console.log(`✓ Index ensured:  slug (unique)`)

  await products.createIndex({ category: 1 })
  console.log(`✓ Index ensured:  category`)

  await products.createIndex({ price: 1 })
  console.log(`✓ Index ensured:  price`)

  // ── 3. Create users collection ───────────────────────────────────────────
  // SQL equivalent: CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(100), password VARCHAR(100))
  const usersExists = (await db.listCollections({ name: 'users' }).toArray()).length > 0

  if (!usersExists) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'password'],
          properties: {
            // _id (ObjectId) is the MongoDB equivalent of id INT PRIMARY KEY AUTO_INCREMENT
            username: { bsonType: 'string', maxLength: 100, description: 'VARCHAR(100)' },
            password: { bsonType: 'string', maxLength: 100, description: 'VARCHAR(100)' },
          },
        },
      },
    })
    console.log(`✓ Created collection: users`)
  } else {
    console.log(`• Collection already exists: users`)
  }

  await db.collection('users').createIndex({ username: 1 }, { unique: true })
  console.log(`✓ Index ensured:  username (unique)`)

  const users = db.collection('users')
  const userCount = await users.countDocuments()

  if (userCount === 0) {
    await users.insertMany([
      { username: 'admin', password: await bcrypt.hash('admin123', 10) },
      { username: 'jane',  password: await bcrypt.hash('jane2024', 10) },
      { username: 'john',  password: await bcrypt.hash('john2024', 10) },
    ])
    console.log(`✓ Inserted 3 sample users (passwords hashed with bcrypt)`)
  } else {
    console.log(`• users already has ${userCount} document(s)`)
  }

  // ── 4. Summary ───────────────────────────────────────────────────────────
  const count = await products.countDocuments()
  console.log(`\n[createdb] Done — products collection has ${count} document(s).\n`)

  await mongoose.disconnect()
  process.exit(0)
}

createProductDB().catch(err => {
  console.error('[createdb] Failed:', err.message)
  process.exit(1)
})
