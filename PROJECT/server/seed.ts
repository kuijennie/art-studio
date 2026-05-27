import 'dotenv/config'
import { connectDB } from './db'
import { Product } from './models/Product'
import { products } from '../src/data/products'

async function seed() {
  await connectDB()
  await Product.deleteMany({})
  await Product.insertMany(products)
  console.log(`✓ Seeded ${products.length} products into MongoDB`)
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
