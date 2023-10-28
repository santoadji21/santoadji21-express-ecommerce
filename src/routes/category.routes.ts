import { CategoryController } from '@controller/category.controller'
import authenticate from '@middleware/authenticate'
import express from 'express'

const router = express.Router()
const categoryController = new CategoryController()
const baseUrl = '/category'

router.post(baseUrl, authenticate, categoryController.create)
router.get('/categories/', categoryController.getAll)
router.get(`${baseUrl}/:id`, categoryController.getById)
router.patch(`${baseUrl}/:id`, authenticate, categoryController.update)
router.delete(`${baseUrl}/:id`, authenticate, categoryController.delete)

export default router
