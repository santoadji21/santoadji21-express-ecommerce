import { z } from 'zod'
import { ObjectId } from 'mongodb'

// Define a Zod schema for the user creation request
export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }), // Custom message
})

export const userIdSchema = z.string().refine((value) => ObjectId.isValid(value), {
  message: 'Invalid ObjectId',
})
