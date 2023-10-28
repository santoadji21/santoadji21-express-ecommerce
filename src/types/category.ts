import { Types } from 'mongoose'
import { z } from 'zod'

// Zod Schemas
export const createCategorySchema = z.object({
  name: z.string(),
  images: z.string().url().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categoryIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid category ID',
})
