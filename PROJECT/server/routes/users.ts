import { Router } from 'express'
import { User } from '../models/User'

const router = Router()

// ── CREATE ───────────────────────────────────────────────────────────────────
// SQL: INSERT INTO users(username, password) VALUES('admin', '1234');
router.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res.status(400).json({ error: 'username and password are required' })

    const user = await User.create({ username, password })
    res.status(201).json({ _id: user._id, username: user.username, createdAt: user.createdAt })
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({ error: 'Username already exists' })
    res.status(400).json({ error: err.message })
  }
})

// ── READ ALL ─────────────────────────────────────────────────────────────────
// SQL: SELECT id, username FROM users;
router.get('/users', async (_, res) => {
  try {
    const users = await User.find().select('-password').lean()
    res.json(users)
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// ── READ ONE ─────────────────────────────────────────────────────────────────
// SQL: SELECT id, username FROM users WHERE id = ?;
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean()
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// ── UPDATE ───────────────────────────────────────────────────────────────────
// SQL: UPDATE users SET password = ? WHERE id = ?;
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (req.body.username) user.username = req.body.username
    if (req.body.password) user.password = req.body.password  // pre-save hook re-hashes

    await user.save()
    res.json({ _id: user._id, username: user.username, updatedAt: user.updatedAt })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// ── LOGIN ────────────────────────────────────────────────────────────────────
// SQL: SELECT id FROM users WHERE username = ? AND password = ?;
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password)
      return res.status(400).json({ error: 'username and password are required' })

    const user = await User.findOne({ username })
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' })

    user.lastLogin = new Date()
    await user.save()

    res.json({ _id: user._id, username: user.username, lastLogin: user.lastLogin })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
})

// ── DELETE ───────────────────────────────────────────────────────────────────
// SQL: DELETE FROM users WHERE id = ?;
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ ok: true, deleted: user.username })
  } catch {
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router
