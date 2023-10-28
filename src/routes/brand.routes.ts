import { BrandController } from '@controller/brand.controller'
import authenticate from '@middleware/authenticate'
import express from 'express'

const router = express.Router()
const brandController = new BrandController()
const baseUrl = '/brand'

router.post(baseUrl, authenticate, brandController.create)
router.get(`${baseUrl}s`, brandController.getAll)
router.get(`${baseUrl}/:id`, brandController.getById)
router.patch(`${baseUrl}/:id`, authenticate, brandController.update)
router.delete(`${baseUrl}/:id`, authenticate, brandController.delete)

export default router
