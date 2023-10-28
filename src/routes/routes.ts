import userRoutes from '@routes/user.routes'
import authRoutes from '@routes/auth.routes'
import profileRoutes from '@routes/profile.routes'
import productRoutes from '@routes/product.routes'
import categoryRoutes from '@routes/category.routes'
import brandRoutes from '@routes/brand.routes'
import colorRoutes from '@routes/color.routes'
import reviewRoutes from '@routes/review.routes'
import express from 'express'

const router = express.Router()

router.use('/v1', userRoutes)
router.use('/v1', authRoutes)
router.use('/v1', profileRoutes)
router.use('/v1', productRoutes)
router.use('/v1', categoryRoutes)
router.use('/v1', brandRoutes)
router.use('/v1', colorRoutes)
router.use('/v1', reviewRoutes)

export default router
