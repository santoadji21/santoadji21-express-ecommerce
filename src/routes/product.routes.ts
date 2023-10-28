import { ProductController } from '@controller/product.controller'
import authenticate from '@middleware/authenticate'
import express from 'express'

const router = express.Router()
const productController = new ProductController()
const baseUrl = '/product'

router.post(baseUrl, authenticate, productController.create)
router.get(`${baseUrl}s`, productController.getAll)
router.get(`${baseUrl}/:id`, productController.getById)
router.patch(`${baseUrl}/:id`, authenticate, productController.update)
router.delete(`${baseUrl}/:id`, authenticate, productController.delete)

export default router
