import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  brand: z.string().optional(),
  category: z.string(),
  price: z.number().positive(),
  size: z.array(z.string()),
  colors: z.array(z.string()),
  images: z.array(z.string().url()).optional(),
  totalQuantity: z.number().positive(),
  soldQuantity: z.number().nonnegative(),
})

export const updateProductSchema = createProductSchema.partial()
