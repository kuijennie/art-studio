import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { requireAuth, requireAdmin, type AuthRequest } from '../middleware/auth'

const router = Router()

function signToken(userId: string, role: string, rememberMe = false) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: rememberMe ? '30d' : '7d' }
  )
}

// ── REGISTER ─────────────────────────────────────────────────────────────────
router.post('/auth/register', async (req, res) => {
  try {
    const { fullname, email, password } = req.body

    if (!fullname || !email || !password)
      return res.status(400).json({ error: 'fullname, email and password are required' })

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' })

    const adminEmail = process.env.VITE_ADMIN_EMAIL
    const role = email.toLowerCase().trim() === adminEmail?.toLowerCase() ? 'admin' : 'customer'

    const user = await User.create({ fullname, email, password, role })
    const token = signToken(String(user._id), user.role)

    res.status(201).json({
      token,
      user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role },
    })
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Email already registered' })
    res.status(400).json({ error: err.message })
  }
})

// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required' })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' })

    user.lastLogin = new Date()
    await user.save()

    const token = signToken(String(user._id), user.role, !!rememberMe)

    res.json({
      token,
      user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role },
    })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
})

// ── GET CURRENT USER ──────────────────────────────────────────────────────────
router.get('/auth/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').lean()
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
router.put('/auth/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (req.body.fullname) user.fullname = req.body.fullname
    if (req.body.password) {
      if (req.body.password.length < 6)
        return res.status(400).json({ error: 'Password must be at least 6 characters' })
      user.password = req.body.password
    }

    await user.save()
    res.json({ _id: user._id, fullname: user.fullname, email: user.email, role: user.role })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// ── ADMIN: LIST ALL USERS ─────────────────────────────────────────────────────
router.get('/users', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const users = await User.find().select('-password').lean()
    res.json(users)
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// ── ADMIN: DELETE USER ────────────────────────────────────────────────────────
router.delete('/users/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    if (req.params.id === req.userId)
      return res.status(400).json({ error: 'Cannot delete your own account' })

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ ok: true, deleted: user.email })
  } catch {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// ── ADMIN: PROMOTE USER TO ADMIN ──────────────────────────────────────────────
router.patch('/users/:id/role', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { role } = req.body
    if (!['customer', 'admin'].includes(role))
      return res.status(400).json({ error: 'Invalid role' })

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: '-password' }
    )
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to update role' })
  }
})

export default router
