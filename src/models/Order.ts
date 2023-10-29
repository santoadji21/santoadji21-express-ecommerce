import { Schema, model, Document, Types } from 'mongoose'

interface Order extends Document {
  user: Types.ObjectId
  orderItems: object
  shippingAddress: object
  orderNumber: string
  paymentStatus: string
  paymentMethod: string
  currency: string
  status: string
  deliveredAt: Date
}
const generateOrderNumber = () => {
  // Generate a random number. You can adjust the range as needed.
  const randomNumber = Math.floor(Math.random() * 1000000)
  // Return the order number with the prefix.
  return `ORDER-${randomNumber}`
}

const OrderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        type: Object,
        ref: 'OrderItem',
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      default: generateOrderNumber(),
      unique: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'not-paid',
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'none',
    },
    currency: {
      type: String,
      required: true,
      default: 'none',
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'processing', 'shipping', 'completed', 'cancelled', 'refunded'],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export const Order = model<Order>('Order', OrderSchema)
