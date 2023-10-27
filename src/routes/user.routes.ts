import { UserController } from '@root/controllers/user.controller'
import express from 'express'

const router = express.Router()
const userController = new UserController()

const userBaseUrl = '/users'

router.post(`${userBaseUrl}/`, userController.create)
router.get(`${userBaseUrl}/`, userController.get)
router.get(`${userBaseUrl}/:id`, userController.getById)
router.patch(`${userBaseUrl}/:id`, userController.update)
router.delete(`${userBaseUrl}/:id`, userController.delete)

export default router
