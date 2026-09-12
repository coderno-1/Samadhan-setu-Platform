import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const roles = ['citizen', 'student', 'faculty', 'industry', 'admin']

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'citizen', organization = '' } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' })
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    if (!roles.includes(role)) return res.status(400).json({ message: 'Choose a valid role.' })
    const normalizedEmail = email.toLowerCase().trim()
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account already exists for this email.' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email: normalizedEmail, passwordHash, role, organization })
    res.status(201).json({ token: createToken(user), user: user.toSafeObject() })
  } catch (error) { next(error) }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' })
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash')
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Incorrect email or password.' })
    if (!user.isActive) return res.status(403).json({ message: 'This account has been disabled.' })
    res.json({ token: createToken(user), user: user.toSafeObject() })
  } catch (error) { next(error) }
})

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user.toSafeObject() }))

export default router
