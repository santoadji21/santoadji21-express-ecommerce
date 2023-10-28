import { Types } from 'mongoose'
import { z } from 'zod'

// Zod Schemas
export const createReviewSchema = z.object({
  rating: z.number(),
  message: z.string(),
})

export const updateReviewSchema = createReviewSchema.partial()

export const reviewIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid review ID',
})
