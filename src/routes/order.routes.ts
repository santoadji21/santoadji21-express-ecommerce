import { OrderController } from '@controller/order.controller'
import authenticate from '@middleware/authenticate'
import express from 'express'

const router = express.Router()
const orderController = new OrderController()
const baseUrl = '/order'

router.post(baseUrl, authenticate, orderController.create)
router.get(`${baseUrl}s`, orderController.getAll)
router.get(`${baseUrl}/:id`, orderController.getById)
router.patch(`${baseUrl}/:id`, authenticate, orderController.update)
router.delete(`${baseUrl}/:id`, authenticate, orderController.delete)

export default router
