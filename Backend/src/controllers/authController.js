import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'
import User from '../models/User.js'

const SALT_ROUNDS = 10

function userResponse(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
  }
}

export async function register(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
  }

  try {
    const { name, email, phone, password } = req.body
    const normalizedEmail = String(email).toLowerCase().trim()

    const existing = await User.findOne({ email: normalizedEmail }).lean()
    if (existing) {
      return res.status(409).json({
        message: 'An account with this email already exists. Please sign in instead.',
        code: 'EMAIL_EXISTS',
      })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
    })

    return res.status(201).json({
      message: 'Registered successfully',
      user: userResponse(user),
    })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists. Please sign in instead.',
        code: 'EMAIL_EXISTS',
      })
    }
    throw err
  }
}

export async function login(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
  }

  try {
    const { email, password } = req.body
    const normalizedEmail = String(email).toLowerCase().trim()

    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password', code: 'AUTH_FAILED' })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password', code: 'AUTH_FAILED' })
    }

    return res.json({
      message: 'Signed in successfully',
      user: userResponse(user),
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Unable to sign in' })
  }
}
