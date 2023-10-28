import { Schema, model, Document, Types } from 'mongoose'

interface Review extends Document {
  rating: number
  user: Types.ObjectId
  message: string
  products: Types.ObjectId[]
}

const ReviewSchema = new Schema<Review>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const Review = model<Review>('Review', ReviewSchema)
