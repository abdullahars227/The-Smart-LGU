import { Router } from 'express'
import { postRagChat } from '../controllers/ragController.js'

const router = Router()

router.post('/chat', postRagChat)

export default router
