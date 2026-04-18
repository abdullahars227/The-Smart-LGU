import { Router } from 'express'
import { getRagSessionStatus, postRagChat } from '../controllers/ragController.js'

const router = Router()

router.get('/session', getRagSessionStatus)
router.post('/chat', postRagChat)

export default router
