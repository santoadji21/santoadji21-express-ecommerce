import { Types } from 'mongoose'
import { z } from 'zod'

// Zod schemas for request body validation
export const createOrderSchema = z.object({
  user: z.string(),
  orderItems: z.array(z.object({})),
  shippingAddress: z.object({}),
  paymentMethod: z.string(),
  currency: z.string(),
})

export const updateOrderSchema = createOrderSchema.partial()

export const orderIdSchema = z.string().refine((value) => Types.ObjectId.isValid(value), {
  message: 'Invalid order ID',
})
