import userRoutes from '@routes/user.routes'
import authRoutes from '@routes/auth.routes'
import express from 'express'

const router = express.Router()

router.use('/v1', userRoutes)
router.use('/v1', authRoutes)

export default router
