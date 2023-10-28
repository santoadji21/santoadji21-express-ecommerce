import { Types } from 'mongoose'
import { z } from 'zod'

// Zod Schemas
export const createColorSchema = z.object({
  name: z.string(),
  images: z.string().url().optional(),
})

export const updateColorSchema = createColorSchema.partial()

export const colorIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid color ID',
})
