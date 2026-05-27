import { Router } from 'express'
import { Product } from '../models/Product'

const router = Router()

router.get('/products', async (_, res) => {
  try {
    const products = await Product.find().lean()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

router.get('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean()
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? 'Failed to create product' })
  }
})

router.put('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
  } catch (err: any) {
    res.status(400).json({ error: err.message ?? 'Failed to update product' })
  }
})

router.delete('/products/:slug', async (req, res) => {
  try {
    await Product.findOneAndDelete({ slug: req.params.slug })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export default router
