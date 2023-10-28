import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import { createErrorResponse, createResponse } from '@utils/response'
import { User } from '@model/User'
import { MongoError } from 'mongodb'
import { createUserSchema, userIdSchema } from '@schema/users'
import { omit } from 'lodash'

export class UserController {
  // Create a new user
  async create(req: Request, res: Response) {
    const validationResult = createUserSchema.safeParse(req.body)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    const { name, email, password } = validationResult.data
    try {
      // Hash the password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      // Create the user with the hashed password
      const user = await User.create({ name, email, password: hashedPassword })
      const userWithoutPassword = omit(user.toObject(), ['password'])
      return res.json(createResponse(userWithoutPassword, 'User created successfully'))
    } catch (error) {
      const mongoError = error as MongoError
      if (mongoError.code === 11000) {
        return res.status(409).json(createErrorResponse('Email already exists'))
      }
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get all users
  async get(_req: Request, res: Response) {
    try {
      const users = await User.find()
      const usersWithoutPassword = users.map((user) => omit(user.toObject(), ['password']))
      return res.json(createResponse(usersWithoutPassword, 'Users retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Get a single user by id
  async getById(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = userIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const user = await User.findById(id)
      const userWithoutPassword = omit(user?.toObject(), ['password'])
      if (!user) {
        return res.status(404).json(createErrorResponse('User not found'))
      }
      return res.json(createResponse(userWithoutPassword, 'User retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update a user by id
  async update(req: Request, res: Response) {
    const { id } = req.params
    const updateData = req.body
    const idValidationResult = userIdSchema.safeParse(id)
    if (!idValidationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', idValidationResult.error.issues))
    }
    const dataValidationResult = createUserSchema.safeParse(updateData)
    if (!dataValidationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', dataValidationResult.error.issues))
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      if (!updatedUser) {
        return res.status(404).json(createErrorResponse('User not found'))
      }
      return res.json(createResponse(updatedUser, 'User updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Delete a user by id
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const validationResult = userIdSchema.safeParse(id)
    if (!validationResult.success) {
      return res.status(400).json(createErrorResponse('Validation error', validationResult.error.issues))
    }
    try {
      const deletedUser = await User.findByIdAndDelete(id)
      if (!deletedUser) {
        return res.status(404).json(createErrorResponse('User not found'))
      }
      return res.status(204).json(createResponse(null, 'User deleted successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new UserController()
