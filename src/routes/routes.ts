import userRoutes from '@routes/user.routes'
import authRoutes from '@routes/auth.routes'
import profileRoutes from '@routes/profile.routes'
import productRoutes from '@routes/product.routes'
import express from 'express'

const router = express.Router()

router.use('/v1', userRoutes)
router.use('/v1', authRoutes)
router.use('/v1', profileRoutes)
router.use('/v1', productRoutes)

export default router
