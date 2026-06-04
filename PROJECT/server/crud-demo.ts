/**
 * Task 4 – CRUD Operations Demo
 * MongoDB equivalent of SQL INSERT / SELECT / UPDATE / DELETE on products
 *
 * Run with:  npm run crud-demo
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { Product } from './models/Product'

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 15000, family: 4 })
  console.log('\n[crud-demo] Connected to MongoDB\n')
  console.log('='.repeat(55))

  // ── CREATE ────────────────────────────────────────────────
  // SQL: INSERT INTO products(slug, name, price, category) VALUES('demo-art', 'Demo Art', 5000, 'painting');
  console.log('\nCREATE — INSERT INTO products')
  console.log("   SQL: INSERT INTO products(slug, name, price, category) VALUES('demo-art', 'Demo Art', 5000, 'painting');")

  await Product.deleteOne({ slug: 'demo-art' })  // clean up if re-running
  const newProduct = await Product.create({
    slug:        'demo-art',
    name:        'Demo Art',
    price:       5000,
    description: 'A demo artwork for CRUD demonstration.',
    image:       'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400',
    tint:        '#c8a84b',
    category:    'painting',
  })
  console.log('   ✓ Product created:')
  console.log(`     _id     : ${newProduct._id}`)
  console.log(`     slug    : ${newProduct.slug}`)
  console.log(`     name    : ${newProduct.name}`)
  console.log(`     price   : KSh ${newProduct.price.toLocaleString()}`)
  console.log(`     category: ${newProduct.category}`)
  console.log(`     createdAt: ${newProduct.createdAt}`)

  console.log('\n' + '-'.repeat(55))

  // ── READ ──────────────────────────────────────────────────
  // SQL: SELECT slug, name, price, category FROM products;
  console.log('\nREAD — SELECT * FROM products')
  console.log('   SQL: SELECT slug, name, price, category FROM products;')

  const allProducts = await Product.find().select('slug name price category').lean()
  console.log(`   ✓ Found ${allProducts.length} products:`)
  allProducts.forEach((p, i) => {
    console.log(`     [${i + 1}] ${p.slug}  —  ${p.name}  —  KSh ${p.price.toLocaleString()}  (${p.category})`)
  })

  console.log('\n' + '-'.repeat(55))

  // ── UPDATE ────────────────────────────────────────────────
  // SQL: UPDATE products SET price = 7500 WHERE slug = 'demo-art';
  console.log('\nUPDATE — UPDATE products SET price')
  console.log("   SQL: UPDATE products SET price = 7500 WHERE slug = 'demo-art';")

  const productToUpdate = (await Product.findOne({ slug: 'demo-art' }))!
  productToUpdate.price = 7500
  await productToUpdate.save()
  console.log('   ✓ Product updated:')
  console.log(`     slug     : ${productToUpdate.slug}`)
  console.log(`     old price: KSh 5,000`)
  console.log(`     new price: KSh ${productToUpdate.price.toLocaleString()}`)
  console.log(`     updatedAt: ${productToUpdate.updatedAt}`)

  console.log('\n' + '-'.repeat(55))

  // ── DELETE ────────────────────────────────────────────────
  // SQL: DELETE FROM products WHERE slug = 'demo-art';
  console.log('\nDELETE — DELETE FROM products')
  console.log("   SQL: DELETE FROM products WHERE slug = 'demo-art';")

  await Product.deleteOne({ slug: 'demo-art' })
  const check = await Product.findOne({ slug: 'demo-art' })
  console.log(`   ✓ Product deleted. Still exists? ${check ? 'YES' : 'NO'}`)

  console.log('\n' + '='.repeat(55))
  console.log('\n[crud-demo] All 4 CRUD operations complete.\n')

  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('[crud-demo] Error:', err.message)
  process.exit(1)
})
