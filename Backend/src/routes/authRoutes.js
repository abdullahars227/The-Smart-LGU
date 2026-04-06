import { Router } from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/authController.js'

const router = Router()

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone')
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone must be 10–20 characters'),
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be at least 8 characters'),
]

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]

router.post('/register', registerRules, register)
router.post('/login', loginRules, login)

export default router
