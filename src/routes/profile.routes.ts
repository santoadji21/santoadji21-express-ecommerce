import { ProfileController } from '@controller/profile.controller'
import authenticate from '@middleware/authenticate'
import express from 'express'

const router = express.Router()
const profileController = new ProfileController()

router.get('/profile/', authenticate, profileController.getProfile)
router.patch('/profile/', authenticate, profileController.updateProfile)

export default router
