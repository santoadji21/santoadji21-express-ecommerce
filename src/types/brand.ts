import { Types } from 'mongoose'
import { z } from 'zod'

// Zod Schemas
export const createBrandSchema = z.object({
  name: z.string(),
  images: z.string().url().optional(),
})

export const updateBrandSchema = createBrandSchema.partial()

export const brandIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid brand ID',
})
