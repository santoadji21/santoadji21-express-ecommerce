import { ColorController } from '@controller/color.controller'
import authenticate from '@middleware/authenticate'
import express from 'express'

const router = express.Router()
const colorController = new ColorController()
const baseUrl = '/color'

router.post(baseUrl, authenticate, colorController.create)
router.get(`${baseUrl}s`, colorController.getAll)
router.get(`${baseUrl}/:id`, colorController.getById)
router.patch(`${baseUrl}/:id`, authenticate, colorController.update)
router.delete(`${baseUrl}/:id`, authenticate, colorController.delete)

export default router
