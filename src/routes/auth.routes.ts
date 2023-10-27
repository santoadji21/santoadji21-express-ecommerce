import { AuthController } from '@controller/auth.controller'
import express from 'express'

const router = express.Router()
const authController = new AuthController()

router.post('/login', authController.login)

export default router
