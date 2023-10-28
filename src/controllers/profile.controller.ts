import { Response, Request } from 'express'
import { User } from '@root/models/User'
import { createErrorResponse, createResponse } from '@root/utils/response'
import { omit } from 'lodash'

export class ProfileController {
  // Get current user's profile
  async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req?.user?.id)
      const userWithoutPassword = omit(user?.toObject(), ['password'])

      if (!user) {
        return res.status(404).json(createErrorResponse('User not found'))
      }
      return res.json(createResponse(userWithoutPassword, 'Profile retrieved successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }

  // Update current user's profile
  async updateProfile(req: Request, res: Response) {
    const updateData = req.body
    try {
      const updatedUser = await User.findByIdAndUpdate(req?.user?.id, updateData, { new: true })
      if (!updatedUser) {
        return res.status(404).json(createErrorResponse('User not found'))
      }
      const updatedProfile = {
        name: updatedUser.name,
        email: updatedUser.email,
      }
      return res.json(createResponse(updatedProfile, 'Profile updated successfully'))
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new ProfileController()
