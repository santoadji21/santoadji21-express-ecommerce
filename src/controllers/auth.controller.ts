import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Response, Request } from 'express'
import { User } from '@model/User'
import { createErrorResponse, createResponse } from '@utils/response'
import { config } from '@config/environment'

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      // Find the user by email
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json(createErrorResponse('Invalid credentials'))
      }
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json(createErrorResponse('Invalid credentials'))
      }
      // User matched, create JWT payload
      const payload = {
        user: {
          id: user.id,
          email: user.email,
        },
      }
      jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err
        return res.json(
          createResponse(
            {
              token,
              email: user.email,
              name: user.name,
            },
            'Logged in successfully',
          ),
        )
      })
    } catch (error) {
      return res.status(500).json(createErrorResponse('Server error', (error as Error).message))
    }
  }
}

export default new AuthController()
