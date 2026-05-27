import { Router, type Request, type Response } from 'express'
import { Order } from '../models/Order'

const router = Router()

// GET /api/orders?email=foo@bar.com
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const { email } = req.query
    const filter = email ? { email: String(email) } : {}
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50)
    res.json(orders)
  } catch {
    res.status(500).json({ error: 'Could not fetch orders.' })
  }
})

// GET /api/orders/:orderNumber
router.get('/orders/:orderNumber', async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
    if (!order) {
      res.status(404).json({ error: 'Order not found.' })
      return
    }
    res.json(order)
  } catch {
    res.status(500).json({ error: 'Could not fetch order.' })
  }
})

export default router
