import { ReviewController } from '@controller/review.controller'
import authenticate from '@middleware/authenticate'
import express from 'express'

const router = express.Router()
const reviewController = new ReviewController()
const baseUrl = '/review'

router.post(`${baseUrl}/:productId`, authenticate, reviewController.create)
router.get(`${baseUrl}s`, reviewController.getAll)
router.get(`${baseUrl}/:id`, reviewController.getById)
router.patch(`${baseUrl}/:id`, authenticate, reviewController.update)
router.delete(`${baseUrl}/:id`, authenticate, reviewController.delete)

export default router
